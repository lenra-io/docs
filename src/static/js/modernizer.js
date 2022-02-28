// ajouter/générer le style sans les variables si elles ne sont pas gérées
// ajouter/générer le style sans le dark theme
// gérer les ajouts des préfixes CSS --webkit...

function replaceStyleSheet(styleSheet) {
    var req = new XMLHttpRequest();
    req.onload = function(e) {
        var css = req.responseText;
        css = replaceCSS(css);
        var style = document.createElement("style");
        style.innerHTML = css;
        styleSheet.ownerNode.parentNode.insertBefore(style, styleSheet.ownerNode);
        styleSheet.ownerNode.parentNode.removeChild(styleSheet.ownerNode);
    };
    req.open("get", styleSheet.href, true);
    req.send();
}

var propertyReplacements = {};
for (var ssIt = 0; ssIt < document.styleSheets.length; ssIt++) {
    replaceStyleSheet(document.styleSheets[ssIt]);
}

function replaceCSS(css) {
    css = css.replace(/[/][*]((?![*][/]).)+[*][/]/g, "");
    var ruleRegex = /([^{};]+)\{([^{}]+)\}/g;
    var rules = [];
    while (css.match(ruleRegex)) {
        css = css.replace(ruleRegex, function(full, selector, content) {
            var id = rules.length;
            rules.push({ selector: selector, content: content});
            return "@rule-"+id+";";
        });
    }
    css = replaceRules(css, rules, {});
    return css;
}

function replaceRules(css, rules, variables) {
    var replacerRegex = /@rule-(\d+);/g;
    return css.replace(replacerRegex, function(full, id) {
        var rule = rules[parseInt(id)];
        if (rule.selector.match(/@font-face/g))
            return rule.selector+"{"+rule.content+"}";
        var content = replaceProperties(rule.content, variables);
        if (content.match(/^\s*$/g)) {
            return "";
        }
        if (content.match(replacerRegex)) {
            var subvars = {};
            for (var key in variables) {
                subvars[key] = variables[key];
            }
            content = replaceRules(content, rules, subvars);
        }
        return rule.selector+"{"+content+"}";
    });
}

function replaceProperties(css, vars) {
    var prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
    var regex = /([a-zA-Z0-9-]+)\s*:\s*([^;]+)\s*(;|$)/g;
    return css.replace(regex, function(full, prop, value) {
        if (prop.match("^--[a-zA-Z0-9-]+")) {
            vars[prop] = value;
            return "";
        }
        if (!(prop in propertyReplacements)) {
            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
                if (prefix+prop in document.body.style) {
                    propertyReplacements[prop] = prefix+prop;
                    break;
                }
            }
            if (!(prop in propertyReplacements)) {
                console.error("Not managed style property : "+prop);
                propertyReplacements[prop] = null;
            }
        }
        prop = propertyReplacements[prop];
        return prop ? prop+":"+replaceValue(value, vars)+";" : "";
    });
}

function replaceValue(val, vars) {
    return val.replace(/var\s*\((--[a-zA-Z0-9-]+)(\s*,([^()]+))?\)/g, function(all, variable, defaultValue) {
        if (variable in vars) {
            return replaceValue(vars[variable], vars);
        }
        else if (defaultValue) {
            return replaceValue(defaultValue, vars);
        }
        console.error("Not defined variable : "+variable);
        return all;
    });
}