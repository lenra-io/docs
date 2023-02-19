import { Page, PageManager, pugPageLister, RobotsManager, SitemapManager } from '@lenra/lesta';
import { getFilesRecursively } from '@lenra/lesta/lib/utils.js';
import * as Path from 'path';
import * as fs from 'fs';
import Showdown from 'showdown';
import fm from 'front-matter';

const languageFileRegex = /^(.+)[.]([a-z]{2})([.](md|html))$/
const attributesMatchingRegex = /#\S+|\.\S+|([a-zA-Z0-9_-]+)(=("(\\"|[^"])*"|'(\\'|[^'])*'|\S*))?/g;
const converter = new Showdown.Converter();

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
    const markdownPages = await markdownPageLister(configuration);
    const apiPages = await apiPageLister(configuration);
    const pages = [
        ...markdownPages,
        ...apiPages
    ].map(page => {
        const basicPath = page.path.replace(/\.html$/, '');
        const href = page.path.replace(/index\.html$/, '');
        page.properties.basicPath = basicPath;
        page.properties.href = href;
        if (!page.properties.name) {
            let name = page.properties.href
                .split("/")
                .filter(part => part)
                .at(-1) || "";
            name = name.replace(/\.html$/, "")
                .replace(/-/g, " ")
                .replace(/^[a-z]/, (letter) => letter.toUpperCase());
            page.properties.name = name;
        }
        return page;
    });
    return pages;
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
