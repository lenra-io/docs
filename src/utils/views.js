const fs = require('fs-extra');
const Path = require('path');
const Utils = require('./common');
const showdown  = require('showdown');
const glob = require('glob');
const { basename } = require('path');

const viewsPath = Path.join(__dirname, '..', 'views');
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

async function getPages() {
    const home = new Page('/', 'Documentation', "Lenra's documentation", 'layout');
    home.collapsable = true;

    let all_pages = [home];

    const api_dir = Path.join(__dirname, '../api/', componentsApiBasePath)
    if ((await fs.stat(api_dir)).isDirectory()) {
        home.subPages = await Promise.all(fs.readdirSync(api_dir).map(async api_name => {
            const api_path = Path.join(api_dir, api_name)
            const api = new Page(`/${api_name}/`, api_name, `The Lenra's ${api_name} references. Understand the UI creation with Lenra`, 'definition-summary');

            const components_paths = await new Promise((resolve, reject) =>
                glob(
                    Path.join(api_path, '*.html'),
                    (error, match) => error ? reject(error) : resolve(match)
                )
            ).catch(err => {
                console.error(err);
            });
            api.subPages = components_paths.map(component_path => {
                if(component_path == '/home/shiishii/Documents/dev/github.com/lenra-io/docs/src/api/components-api/components/actionable.html')
                console.log(fs.readFileSync(component_path).toString())
                return new Page(Path.join(api.path, basename(component_path)), Path.basename(component_path, '.html'), null, 'definition', fs.readFileSync(component_path).toString())
            }
            );
            all_pages = [...all_pages, api, ...api.subPages]

            api.collapsable = false;
            return api;
        })).catch(err => {
            console.error(err)
        });
    } else {
        console.error(`${api_dir} wasn't a correct directory. Make sure it exist`)
    }
    return all_pages;
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
 * @param {Page[]} pages
 * @param {any} translations
 */
function translatePages(pages, translations) {
    const repositionPages = [];
    let retPages = pages.map(page => {
        const translation = translations.page[page.path] || {};
        let ret = Utils.mergeDeep({}, page, translation);
        if (page.subPages?.length) ret.subPages = translatePages(ret.subPages, translations);
        if ('position' in ret) repositionPages.push(ret);
        return ret;
    });
    repositionPages.forEach(p => {
        let pos = retPages.indexOf(p);
        if (pos!=p.position) {
            retPages.splice(pos, 1);
            retPages.splice(p.position, 0, p);
        }
    });
    return retPages;
}

class Page {
    /**
     * @param {string} path
     * @param {string} name
     * @param {string} description
     * @param {string} view
     * @param {Definition} definition
     */
    constructor(path, name, description, view, content = null) {
        this.path = path;
        this.name = name;
        this.description = description;
        this.view = view;
        this.collapsable = true;
        this.content = content;
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
