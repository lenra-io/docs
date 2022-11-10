// ajouter/générer le style sans les variables si elles ne sont pas gérées
var computedStyle = getComputedStyle(document.querySelector("a.primary"), null);
if (computedStyle.backgroundColor=="transparent") {
    console.log("Variables non gérées");
    var script = document.createElement("script");
    script.src = "js/modernizer.js";
    document.body.appendChild(script);
}

var previousHeight = 0;
setInterval(function() {
    var h = document.body.offsetHeight;
    if (h!=previousHeight) {
        document.body.style.setProperty('--body-height', h + "px");
        previousHeight = h;
    }
}, 50);

function checkReady() {
    if (document.querySelector('link[href="/css/main.css"]').media=='print')
        return requestAnimationFrame(checkReady);
    document.body.classList.add('ready');
}

checkReady();
