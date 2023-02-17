import { Page, PageManager, RobotsManager, SitemapManager } from '@lenra/lesta';
import { getFilesRecursively } from '@lenra/lesta/lib/utils.js';
import * as Path from 'path';
import * as showdown from 'showdown/dist/showdown.js';

const converter = new showdown.Converter();
const languageFileRegex = /^(.+)[.]([a-z]{2})([.](md|html))$/

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
    return [
        ...markdownPages,
        ...apiPages
    ];
}

/**
 * Return a page list based on markdown files
 * @param {import('../config/configurator.js').Configuration} configuration The configuration
 * @returns {Promise<Page[]>}
 */
async function markdownPageLister(configuration) {
    const markdownDirPath = Path.join(process.cwd(), "src/markdown");
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
            const title = file.replace(/[.]md$/, '');
            const description = `${title} page`;
            return new Page(
                path,
                'layout.pug',
                langViews[file] || {},
                {
                    title,
                    description,
                    content: converter.makeHtml(fs.readFileSync(file, 'utf8'))
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
    return [];
}