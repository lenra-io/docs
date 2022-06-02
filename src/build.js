'use strict';
const fs = require('fs-extra');
const Path = require('path');
const pug = require('pug');
const common = require('./i18n/common.json');
const Translations = require('./utils/i18n');
const Views = require('./utils/views');
const Utils = require('./utils/common');
const Nginx = require('./utils/nginx');
const minify = require('minify');

const { languagePriority } = require('./config.json');

const srcPath = Path.join(__dirname);
const buildPath = Path.join(__dirname, '..', 'build');
const wwwPath = Path.join(buildPath, 'www');
const staticSrcPath = Path.join(srcPath, 'static');
const staticDestPath = Path.join(wwwPath, 'static');
const languageFileRegex = /^(.+)[.]([a-z]{2})([.]pug)$/

fs.mkdirsSync(Path.join(wwwPath));
// copy static directory
Utils.getFilesRecursively(staticSrcPath)
    .forEach(file => {
        const relativePath = Path.relative(staticSrcPath, file);
        const destinationPath = Path.join(staticDestPath, relativePath);
        const destinationDir = Path.dirname(destinationPath);
        const ext = Path.extname(file).toLowerCase();
        if (/^.*\/\.[^/]+$/.test(file)) return;
        fs.mkdirsSync(destinationDir);
        switch (ext) {
            case '.html':
            case '.js':
                // case '.css':
                return minify(file)
                    .then(content => fs.writeFile(destinationPath, content));
            case '.css':
                const content = minify.css(`@import "${Path.relative(process.cwd(), file)}";`, {
                    css: {
                        rebase: false
                    },
                    img: {
                        maxSize: 1
                    }
                });
                return fs.writeFile(destinationPath, content);
            default:
                return fs.copyFile(file, destinationPath);
        }
    });
// list pug files
const viewsDirPath = Path.join(srcPath, 'views');

function getPagesToGenerate(page) {
    return [
        page,
        ...page.subPages.flatMap(getPagesToGenerate)
    ];
}

const traslationsP = Translations.loadTranslations();

Views.getPages().then(async pages => {
    const translations = await traslationsP;

    const langs = Object.keys(translations).sort((a, b) => {
        const posA = languagePriority.indexOf(a);
        const posB = languagePriority.indexOf(b);
        if (posA != -1 && posB != -1) return posA - posB;
        if (posA != -1) return -1;
        if (posB != -1) return +1;
        if (a < b) return -1;
        return 1;
    });

    Object.entries(translations).forEach(([lang, translation]) => {
        const props = {
            ...common,
            componentsApiBasePath: Views.componentsApiBasePath,
            language: lang,
            pages: Views.translatePages(pages, translation)
        };
        props.pages.flatMap(getPagesToGenerate)
            .map(page => {
                return {
                    page,
                    html: pug.renderFile(Path.join(viewsDirPath, page.view + '.pug'), {
                        ...props,
                        currentPage: page
                    })
                }
            })
            .map(async ({ page, html }) => {
                const dir = Path.join(wwwPath, lang, page.path.substring(0, page.path.lastIndexOf('/') + 1));
                fs.mkdirsSync(dir);
                await fs.writeFile(
                    Path.join(wwwPath, lang, page.path + (page.path.endsWith('/') ? 'index.html' : '')),
                    await minify.html(html)
                );
            });
    });

    // generate the nginx.conf file
    fs.writeFile(Path.join(buildPath, `nginx.conf`), Nginx.generateNginxConf({
        languages: langs,
        additionalContentSecurityPolicies: {
            'default-src': ['unsafe-inline', 'analytics.lenra.io']
        },
        rewriteRules: [
            new Nginx.RewriteRule('^/root.schema.html$', '/components-api/root.html', 'permanent'),
            new Nginx.RewriteRule('^/(components|defs)/(.*).schema.html$', '/components-api/$1/$2.html', 'permanent'),
            new Nginx.RewriteRule('^/(components|defs)/$', '/components-api/$1/', 'permanent')
        ]
    }));

    // generate the sitemap.txt file
    fs.writeFile(Path.join(staticDestPath, `sitemap.txt`),
        pages.flatMap(getPagesToGenerate)
            .map(page => `!BASE_URL!${page.path}`)
            .join('\n')
    );
    // TODO: manage page modifications to create a sitemap.xml
});