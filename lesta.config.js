import { nginxBuilder, Page, PageManager, pugPageLister, RobotsManager, SitemapManager } from '@lenra/lesta';
import { getFilesRecursively } from '@lenra/lesta/lib/utils.js';
import fm from 'front-matter';
import * as fs from 'fs';
import lunr from 'lunr';
import { parse } from 'node-html-parser';
import * as Path from 'path';
import Showdown from 'showdown';

const languageFileRegex = /^(.+)[.]([a-z]{2})([.](md|html))$/
const attributesMatchingRegex = /#\S+|\.\S+|([a-zA-Z0-9_-]+)(=("(\\"|[^"])*"|'(\\'|[^'])*'|\S*))?/g;
const converter = new Showdown.Converter({ tables: true });
const cwd = process.cwd();

const customClassExt = {
    type: 'output',
    filter: function (text) {
        const replaced = text
            // In element without P
            .replace(/<([^/][^>]+)>\{:([^}]+)\}/g, (_, g1, g2) => addAttributes(g1, g2))
            // In element with P
            .replace(/<([^/][^>]+)><p>\{:([^}]+)\}<\/p>/g, (_, g1, g2) => addAttributes(g1, g2))
            // Before element
            .replace(/<p>\{:([^}]+)\}<\/p>\s*<([^/][^>]+)>/g, (_, g1, g2) => addAttributes(g2, g1))
            // Element in P
            .replace(/<p>\s*\{:([^}]+)\}\s*<([^/][^>]+)>(((?!<\/p>).)*)\s*<\/p>/g, (_, g1, g2, g3) => addAttributes(g2, g1, g3))

            // Prevent class name with 2 dashs being replace by `<em>` tag
            .replace(/class="(.+)"/g, function (str) {
                if (str.indexOf("<em>") !== -1) {
                    return str.replace(/<[/]?em>/g, '_');
                }
                return str;
            });
        return replaced;
    }
};

converter.addExtension(customClassExt);

/**
 * 
 * @param {string} tag 
 * @param {string} attributes 
 * @returns 
 */
function addAttributes(tag, attributes, rest) {
    tag = tag.trim();
    attributes = attributes.trim();
    const attrs = {};
    const pos = tag.indexOf(" ");
    if (pos != -1) {
        attributes = `${tag.substring(pos + 1)} ${attributes}`;
        tag = tag.substring(0, pos);
    }

    const matches = attributes.matchAll(attributesMatchingRegex);
    for (const match of matches) {
        const [content, key, _, value] = match;
        if (key) {
            attrs[key] = (value || "").replace(/^("(.*)"|'(.*)')$/, (_, nq, dq, sq) => dq || sq || nq);
        }
        else {
            content.split(".")
                .filter(c => c)
                .forEach(c => {
                    if (c.startsWith("#")) {
                        attrs.id = c.substring(1);
                        return;
                    }
                    if (!("class" in attrs)) attrs.class = c;
                    else attrs.class += " " + c;
                });
        }
    }
    return `<${tag} ${Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(" ")}>${rest || ''}`;
}

/**
 * Returns the website path managers
 * @returns {PathManager[]}
 */
export function getManagers() {
    return [new PageManager(pageLister), new RobotsManager(), new SitemapManager()];
}

/**
 * Return a page list based on markdown files and the APIs HTML files
 * @param {import('../config/configurator.js').Configuration} configuration The configuration
 * @returns {Promise<Page[]>}
 */
async function pageLister(configuration) {
    const viewsDirPath = Path.join(process.cwd(), configuration.viewsDir);
    const pugPages = await pugPageLister(configuration);
    pugPages.forEach(page => {
        const sourceFile = Path.join(configuration.viewsDir, page.getView());
        page.properties.sourceFile = `https://github.com/lenra-io/docs/blob/beta/${sourceFile}`;
    });
    const markdownPages = await markdownPageLister(configuration);
    const apiPages = await apiPageLister(configuration);
    let pages = pugPages.slice();
    addPages(pages, markdownPages);
    addPages(pages, apiPages);
    pages.forEach(page => {
        const basicPath = page.path.replace(/\.html$/, '');
        page.properties.basicPath = basicPath;
        if (!page.properties.name) {
            let name = page.href
                .split("/")
                .filter(part => part)
                .at(-1) || "";
            name = name.replace(/\.html$/, "")
                .replace(/-/g, " ")
                .replace(/^[a-z]/, (letter) => letter.toUpperCase());
            page.properties.name = name;
        }
    });
    setPagesParent(pages);
    pages = sortPages(pages);
    setPagesChildrenAndNav(pages);
    return pages;
}

/**
 * Add pages if they don't already exist
 * @param {Page[]} pages The global page list
 * @param {Page[]} newPages The new pages to add
 */
function addPages(pages, newPages) {
    const hrefs = pages.map(p => p.href);
    pages.push(...newPages.filter(p => !hrefs.includes(p.href)));
}

/**
 * Return a page list based on markdown files
 * @param {import('../config/configurator.js').Configuration} configuration The configuration
 * @returns {Promise<Page[]>}
 */
async function markdownPageLister(configuration) {
    const markdownDirPath = "src/markdown";
    const files = await getFilesRecursively(markdownDirPath);
    const relativeFiles = files.filter(file => !Path.basename(file).startsWith('.'))
        .map(file => Path.relative(markdownDirPath, file));
    const langViews = {};
    const matchFiles = relativeFiles.map(file => ({
        file,
        match: file.match(languageFileRegex)
    }));
    matchFiles.filter(({ match }) => match)
        .forEach(({ file, match }) => {
            const lang = match[2];
            const f = match[1] + match[3];
            if (!langViews[f]) langViews[f] = {};
            langViews[f][lang] = file;
        });
    return matchFiles.filter(({ match }) => !match)
        .map(({ file }) => {
            const path = file.replace(/[.]md$/, '.html');
            const sourceFile = `${markdownDirPath}/${file}`;
            const fmResult = fm(fs.readFileSync(sourceFile, 'utf8'));
            return new Page(
                path,
                '.layout.pug',
                langViews[file] || {},
                {
                    ...fmResult.attributes,
                    sourceFile: `https://github.com/lenra-io/docs/blob/beta/${sourceFile}`,
                    content: converter.makeHtml(fmResult.body.replace(/\{\{([^}]+)\}\}/, (_all, att) => att.split(".").reduce((o, key) => o[key], fmResult.attributes) || _all))
                }
            )
        })
}

/**
 * Return a page list based on APIs HTML files
 * @param {import('../config/configurator.js').Configuration} configuration The configuration
 * @returns {Promise<Page[]>}
 */
async function apiPageLister(configuration) {
    const apisDirPath = "src/api";
    const files = (await getFilesRecursively(apisDirPath)).filter(p => p.endsWith(".html"));
    const relativeFiles = files.filter(file => !Path.basename(file).startsWith('.'))
        .map(file => Path.relative(apisDirPath, file));
    const langViews = {};
    const matchFiles = relativeFiles.map(file => ({
        file,
        match: file.match(languageFileRegex)
    }));
    matchFiles.filter(({ match }) => match)
        .forEach(({ file, match }) => {
            const lang = match[2];
            const f = match[1] + match[3];
            if (!langViews[f]) langViews[f] = {};
            langViews[f][lang] = file;
        });
    return matchFiles.filter(({ match }) => !match)
        .map(({ file }) => {
            const path = `references/${file}`;
            const sourceFile = `${apisDirPath}/${file}`;
            const content = fs.readFileSync(sourceFile, 'utf8');
            const json = JSON.parse(fs.readFileSync(`${sourceFile}.json`, 'utf8'));
            return new Page(
                path,
                '.layout.pug',
                langViews[file] || {},
                {
                    ...json,
                    content
                }
            )
        })
}

/**
 * Set pages parent page href
 * @param {Page[]} pages 
 */
function setPagesParent(pages) {
    pages.forEach(p => {
        let pos = p.href.replace(/\/$/, "").lastIndexOf("/");
        if (pos > 0) {
            p.properties.parent = p.href.substring(0, pos + 1);
        }
    });
}

/**
 * Set pages children page href, and next and previous pages href
 * @param {Page[]} pages 
 */
function setPagesChildrenAndNav(pages) {
    for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        // Filter dir pages
        if (p.href.endsWith("/")) {
            // Set the children pages
            p.properties.children = pages
                .filter(child => child.properties.parent == p.href)
                .map(p => p.href);
        }
        const previous = pages[i - 1];
        if (previous) p.properties.previous = previous.href;
        const next = pages[i + 1];
        if (next) p.properties.next = next.href;
    }
}

/**
 * Sort the page list
 * @param {Page[]} pages 
 */
function sortPages(pages) {
    // Sort the pages without parent in a resulting array
    const ret = sortPageLevel(pages.filter(page => !page.properties.parent));
    // for each page in the resulting array, add the sorted sub pages
    let i = 0;
    while (i < ret.length) {
        const page = ret[i];
        ret.splice(++i, 0, ...sortPageLevel(pages.filter(p => p.properties.parent == page.href)));
    }
    return ret;
}

/**
 * Sort the page list of a specific level
 * @param {Page[]} pages 
 */
function sortPageLevel(pages) {
    pages.sort((p1, p2) => p1.href.localeCompare(p2.href));
    const positionnables = pages.filter(p => "position" in p.properties)
        .sort((p1, p2) => p1.properties.position - p2.properties.position);
    positionnables.forEach(page => {
        const currentPos = pages.indexOf(page);
        let targetPos = Math.max(
            Math.min(page.properties.position, pages.length - 1),
            0
        );
        if (currentPos != targetPos) {
            pages.splice(currentPos, 1);
            pages.splice(targetPos, 0, page);
        }
    });
    return pages;
}

export const generators = {
    nginx: nginxBuilderOverride
}

async function nginxBuilderOverride(configuration, managers) {
    let ret = await nginxBuilder(configuration, managers);

    // list all the html files
    const buildPath = Path.join(cwd, configuration.buildDir);
    const wwwPath = Path.join(buildPath, 'www');
    const files = await getFilesRecursively(wwwPath)
        .then(files => files.filter(file => file.endsWith(".html")));

    // index the files with lunr
    const index = lunr((builder) => {
        builder.ref("href");
        builder.field("title");
        builder.field("body");
        files.forEach(file => {
            const document = parse(fs.readFileSync(file, 'utf8'));
            const main = document.querySelector("main");
            const title = main.querySelector("h1").text;
            main.querySelectorAll("header").forEach(el => el.remove());
            main.querySelectorAll("*+*").forEach(el => el.insertAdjacentHTML("beforebegin", " "));
            const body = main.text;
            const indexContent = {
                href: Path.relative(wwwPath, file),
                title,
                body
            };

            builder.add(indexContent);
            fs.writeFileSync(file + ".index.json", JSON.stringify(indexContent), 'utf8');
        });
    });
    // save the index in a json file
    const indexPath = Path.join(wwwPath, 'lunr.json');
    fs.writeFileSync(indexPath, JSON.stringify(index), 'utf8');
    return ret;
}
