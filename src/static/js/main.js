(() => {
    const isSearchPage = location.pathname.endsWith("/search.html");
    const pagination = isSearchPage ? 10 : 5;
    const summaryLength = isSearchPage ? 500 : 200;
    const searchForm = document.querySelector("body>header>form");
    const searchInput = searchForm.querySelector("input");
    const searchIndexs = {};
    let modal, resultList, idx = null;


    async function initSearch() {
        if (idx !== null) return;
        idx = lunr.Index.load(JSON.parse(await fetch('/lunr.json').then(r => r.text())));

        if (isSearchPage) {
            resultList = document.querySelector("main>ul");
            const params = new URLSearchParams(window.location.search);
            searchInput.value = params.get("q") || "";
            history.replaceState({ q: searchInput.value }, "", location);
            searchForm.addEventListener("submit", event => {
                event.preventDefault();
                search(searchInput.value.trim().toLowerCase());
                const url = new URL(location);
                url.searchParams.set("q", searchInput.value);
                history.pushState({ q: searchInput.value }, "", url);
            });
            window.addEventListener("popstate", event => {
                searchInput.value = event.state?.q || "";
                search(searchInput.value.trim().toLowerCase());
            });

        }
        else {
            modal = document.createElement("aside");
            resultList = document.createElement("ul");
            modal.appendChild(resultList);
            searchForm.appendChild(modal);
        }

        resultList.classList.add("results");

        searchInput.addEventListener("input", event => {
            search(event.target.value.trim().toLowerCase());
        });
        search(searchInput.value.trim().toLowerCase());
    }

    /**
     * @param {string} query
     * @returns
     */
    function search(query) {
        resultList.innerHTML = "";
        resultList.classList.add("loading");
        if (query) {
            const results = idx.search(query);
            if (results.length === 0) {
                resultList.innerHTML = "No results found";
            }
            results.slice(0, pagination).forEach(result => {
                resultList.appendChild(createSearchResult(query, result));
            });
            if (results.length > pagination) {
                let resultPosition = pagination;
                const more = document.createElement("li");
                more.innerText = "More results";
                more.classList.add("more");
                more.addEventListener("click", () => {
                    if (isSearchPage) {
                        results.slice(resultPosition, resultPosition + pagination).forEach(result => {
                            resultList.insertBefore(createSearchResult(query, result), more);
                        });
                        if (results.length <= resultPosition + pagination) {
                            more.remove();
                        }
                        resultPosition += pagination;
                    }
                    else {
                        location.href = "/search.html?q=" + encodeURIComponent(query);
                    }
                });
                resultList.appendChild(more);
            }
        }
    }

    /**
     * @param {{ref: string, score: number, matchData: import("lunr").MatchData}} result 
     * @returns 
     */
    function createSearchResult(query, result) {
        const li = document.createElement("li");
        li.classList.add("loading");
        getSearchIndexs(result.ref).then((index) => {
            const a = document.createElement("a");
            a.href = "/" + result.ref;
            const title = document.createElement("h2");
            title.innerText = index.title;
            const content = document.createElement("p");
            content.innerHTML = searchResultSummarize(query, index.body);
            a.appendChild(title);
            a.appendChild(content);
            li.appendChild(a);
            li.dataset.score = result.score.toString();
            li.classList.remove("loading");
        });
        return li;
    }

    /**
     * @param {string} href
     * @returns
     */
    async function getSearchIndexs(href) {
        if (!searchIndexs[href]) {
            searchIndexs[href] = await fetch(`/${href}.index.json`).then(r => r.json());
        }
        return searchIndexs[href];
    }

    /**
     * @param {string} query 
     * @param {string} body 
     * @returns 
     */
    function searchResultSummarize(query, body) {
        const queryWordsRegex = new RegExp(query.replace(/\s+/g, "|"), "gmi");
        const tags = Array.from(
            body.matchAll(/<code[^>]*>([\s\S]*?)<\/code>/gm),
            match => ({ text: match[0], index: match.index })
        );

        let sentences = [];
        let lastEnd = 0;
        for (const tag of tags) {
            sentences.push(...getTextSentences(body.slice(lastEnd, tag.index)));
            sentences.push(tag.text);
            lastEnd = tag.index + tag.text.length;
        }
        if (lastEnd < body.length) {
            sentences.push(...getTextSentences(body.slice(lastEnd)));
        }
        sentences = sentences.filter(s => s).map((sentence, position) => {
            const queryWorkds = Array.from(
                sentence.matchAll(queryWordsRegex),
                match => ({ word: match[0], index: match.index })
            );
            return { text: sentence, queryWorkds, position };
        });
        const orderedSentences = sentences.slice().sort((a, b) => {
            const aScore = a.queryWorkds.length / a.text.length;
            const bScore = b.queryWorkds.length / b.text.length;
            return bScore - aScore;
        });
        let summarySize = 0;
        let summarySentences = [];
        while (summarySentences.length < sentences.length) {
            const sentence = orderedSentences.shift();
            summarySize += sentence.text.length;
            summarySentences.push(sentence);
            summarySentences.sort((a, b) => a.position - b.position);
            if (summarySize > summaryLength) break;
        }

        console.log(summarySentences);
        let summary = "";
        let lastSentencePosition = 0;
        summarySentences.forEach(sentence => {
            if (lastSentencePosition !== 0)
                summary += " ";
            if (sentence.position > lastSentencePosition + 1)
                summary += "[...] ";
            summary += sentence.text.replace(queryWordsRegex, "<strong>$&</strong>");
        });

        return summary;
    }

    /**
     * @param {string} text
     * @returns
     */
    function getTextSentences(text) {
        return Array.from(
            text.matchAll(/[^.!?\n\r]+[.!?]?/gm),
            match => match[0].trim()
        );
    }

    if (isSearchPage) {
        initSearch();
    }
    else {
        searchInput.addEventListener("focus", () => {
            initSearch();
        });
    }

    document.addEventListener('keydown', event => {
        // If Ctrl or Cmd key is pressed and the K key is pressed
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            searchInput.focus();
        }
    });
})();