const fs = require('fs-extra');
const Path = require('path');
const Components = require('./components');
const Utils = require('./common');
const showdown  = require('showdown');


const converter = new showdown.Converter();
const viewsPath = Path.join(__dirname, '..', 'views');
const markdownPath = Path.join(__dirname, '..', 'markdown');
const componentsApiBasePath = '/components-api/';
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
 * @returns
 */
async function getPages() {
    const home = new Page('/', 'Documentation', "Lenra's documentation", 'layout');
    const componentsApi = new Page(componentsApiBasePath, 'Components API', "The Lenra's components API references. Understand the UI creation with Lenra", 'definition-summary');
    const componentsPromise = Components.loadComponents();
    const markdowns = Utils.getFilesRecursively(markdownPath);
    componentsApi.subPages = generateDefinitionPages(Components.parseSchemata(await componentsPromise));
    componentsApi.collapsable = false;
    home.subPages = [componentsApi];
    return includeMarkdownPages([home], markdowns);
}

/**
 * 
 * @param {Page[]} pages 
 * @param {string[]} markdowns 
 */
function includeMarkdownPages(pages, markdowns) {
    markdowns
    .map(path => ({path, pagePath: '/'+Path.relative(markdownPath, path)}))
    // TODO: filter language specific files
    .map(({path, pagePath}) => ({path, pagePath: pagePath.replace(/\.md$/, '.html').replace(/\/index\.html$/, '/')}))
    .forEach(({path, pagePath}) => {
        const parentPath = pagePath.substring(0, pagePath.lastIndexOf('/') + 1);
        const parentPage = parentPath.length>1 ? getPageFromPath(pages, parentPath) : null;
        const findInPages = parentPage ? parentPage.subPages : pages;
        let page = getPageFromPath(findInPages, pagePath);
        if (!page) {
            let pageName = pagePath.endsWith('/') ? pagePath.replace(/\/$/, '') : pagePath.replace(/\.html$/, '');
            pageName = pageName.substring(pageName.lastIndexOf('/') + 1);
            page = new Page(pagePath, pageName, "Description is not managed yet", "layout");
            parentPage.subPages.push(page);
        }
        page.markdown = converter.makeHtml(fs.readFileSync(path, 'utf8'));
    });
    return pages;
}

/**
 * @param {Page[]} pages 
 * @param {string} path 
 * @returns {Page}
 */
function getPageFromPath(pages, path) {
    const p = pages.find(p => path.startsWith(p.path));
    if (!p || p.path==path) return p;
    if (p.subPages.length)
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
        parent.push(new Page(componentsApiBasePath+def.id.replace(/\.schema\.json$/, '.html'), def.name, def.description, 'definition', def));
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
        this.markdown = null;
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