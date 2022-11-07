const fs = require('fs-extra');
const Path = require('path');
const Utils = require('./common');
const showdown  = require('showdown');
const glob = require('glob');

const config = require('../i18n/common.json');
const { file } = require('jszip');

const converter = new showdown.Converter();

const viewsPath = Path.join(__dirname, '..', 'views');
const markdownPath = Path.join(__dirname, '..', 'markdown');

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
	const markdowns = Utils.getFilesRecursively(markdownPath);
	const home_markdown = markdowns.splice(markdowns.findIndex(page => Path.basename(page, '.md') === 'index'), 1)[0]
	const home = new Page('/', 'Documentation', "Lenra's documentation", 'layout');
	home.content = converter.makeHtml(fs.readFileSync(home_markdown, 'utf8'));
	home.collapsable = true;

	const static_pages = markdowns
		.filter(file => file.endsWith('.md'))
		.map(file => {
			const filename = Path.basename(file, '.md')
			const page = new Page(file.substring(file.lastIndexOf('/')).replace('.md', '.html'),
				filename.charAt(0).toUpperCase() + filename.substring(1),
				"Description is not managed yet",
				"layout");
			page.content = converter.makeHtml(fs.readFileSync(file, 'utf8'));
			const position = config.page[page.path]?.position
			if (position !== undefined) {
				home.subPages.splice(position, 0, page)
			} else {
				home.subPages.push(page)
			}
			return page
		});

	let all_pages = [home, ...static_pages];

	const api_dir = Path.join(__dirname, '../api/')
	if ((await fs.stat(api_dir)).isDirectory()) {
		home.subPages = home.subPages.concat(
			await Promise.all(
				fs.readdirSync(api_dir)
					.filter(api_name => !api_name.startsWith('.'))
					.map(api_name => parseApiDir(api_name, api_dir))
				).catch(err => {
					console.error(err)
				})
		);
	} else {
		console.error(`${api_dir} is not a correct directory. Make sure it exists.`)
	}

	home.subPages.forEach(value => all_pages.push(value))
	console.log(all_pages)

	return all_pages;
}

async function parseApiDir(api_name, api_dir) {
	const api_path = Path.join(api_dir, api_name)
	const api = new Page(`/${api_name}/`, api_name.charAt(0).toUpperCase() + api_name.substring(1), 'Description is not managed yet', 'definition-summary');
	api.collapsable = true

	const components_paths = fs.readdirSync(api_path)

	api.subPages = await Promise.all(components_paths
		.filter(component_path => !Path.basename(component_path).startsWith('.'))
		.map(async component_path => {
			const file_info = fs.statSync(component_path);
			if (file_info.isDirectory()) {
				const filename = Path.basename(component_path)
				return parseApiDir(filename, component_path)
			} else {
				const filename = Path.basename(component_path, '.html')
				return new Page(
					Path.join(api.path, Path.basename(component_path)),
					filename.charAt(0).toUpperCase() + filename.substring(1),
					'Description is not managed yet',
					'definition',
					fs.readFileSync(component_path).toString())
			}
	}));

	return api;
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
		this.collapsable = false;
		this.content = content;
		this.subPages = [];
	}
}

module.exports = {
	Page,
	getViewFile,
	getPages,
	getPageFromPath,
	translatePages
}
