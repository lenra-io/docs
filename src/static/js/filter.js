document.querySelectorAll(".tab.filter").forEach(tabFilter => {
    const nav = tabFilter.querySelector(':scope>nav');
    const radios = [...nav.querySelectorAll(':scope>input[type="radio"]')];
    const style = document.createElement("style");
    style.innerHTML = `${radios.filter(radio => radio.id!="all").map(radio => `.tab.filter>nav.${radio.id}+ul>li.${radio.id}`).join(', ')} {
        display: flex;
    }`;
    tabFilter.appendChild(style);
    
    radios.forEach(radio => {
        radio.addEventListener('change', updateFilter);
    });
    updateFilter();

    function updateFilter() {
        console.log("updateFilter");
        nav.className = radios.find(radio => radio.checked).id;
    }
});
