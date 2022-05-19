const fs = require('fs-extra');
const Path = require('path');
const Components = require('./components');
const Utils = require('./common');
const showdown  = require('showdown');


const converter = new showdown.Converter({headerLevelStart: 2});
const viewsPath = Path.join(__dirname, '..', 'views');
const componentsApiBasePath = 'components-api/';
// const componentsApiBasePath = '/';

/**
 * Get the view file for the given path and language
 * @param {string} path The view path
 * @param {string?} lang The language for specific views
 * @returns {string?}
 */
function getViewFile(path, lang) {
    let p;
    if (lang) {
        p = Path.join(viewsPath, `${path}.${lang}.pug`);
        if (fs.existsSync(p)) return p;
    }
    p = Path.join(viewsPath, `${path}.pug`);
    if (fs.existsSync(p)) return p;
    return null;
}

/**
 * @returns {Page[]}
 */
async function getPages() {
    const api = new Page(componentsApiBasePath, 'components-api', 'The components API', 'definition-summary');
    api.subPages = generateDefinitionPages(Components.parseSchemata(await Components.loadComponents()));
    api.collapsable = false;
    return [new Page('/', 'Doc', "Lenra's documentation", 'layout'), api];
}

/**
 * @param {Page[]} pages 
 * @param {string} path 
 * @returns 
 */
function getPageFromPath(pages, path) {
    const p = pages.find(p => path.startsWith(p.path));
    if (p && p.path!=path && p.subPages.length)
        return getPageFromPath(p.subPages, path);
    return p;
}

/**
 * Generates a map of components pages from the components ids
 * @param {Definition[]} definitions The components definitions
 * @returns 
 */
function generateDefinitionPages(definitions) {
    const pages = [];
    const nodes = {};
    definitions.forEach(def => {
        let pos = def.id.indexOf('/');
        let parent = pages;
        while (pos!=-1) {
            const path = def.id.substring(0, ++pos);
            if (!(path in nodes)) {
                let name = path.substring(0, pos-1);
                name = name.substring(name.lastIndexOf('/')+1);
                pages.push(nodes[path] = new Page(componentsApiBasePath+path, name, null, 'definition-summary'));
            }
            parent = nodes[path].subPages;
            pos = def.id.indexOf('/', pos);
        }
        parent.push(new Page(componentsApiBasePath+def.id.replace(/\.json$/, '.html'), def.name, def.description, 'definition', def));
    });
    return pages;
}

/**
 * @param {Page[]} pages 
 * @param {any} translations 
 */
function translatePages(pages, translations) {
    return pages.map(page => {
        let ret = Utils.mergeDeep({}, page, translations.page[page.path] || {});
        if (page.subPages.length) ret.subPages = translatePages(ret.subPages, translations);
        return ret;
    });
}

function getPageContent() {
    converter.makeHtml('# Coucou\nCa va ?');
}

function renderPage() {
    
}

class Page {
    /**
     * @param {string} path 
     * @param {string} name 
     * @param {string} description 
     * @param {string} view
     * @param {Definition} definition 
     */
    constructor(path, name, description, view, definition) {
        this.path = path;
        this.name = name;
        this.description = description;
        this.view = view;
        this.definition = definition;
        this.collapsable = true;
        this.subPages = [];
    }
}

module.exports = {
    Page,
    getViewFile,
    getPages,
    getPageFromPath,
    translatePages,
    componentsApiBasePath
}