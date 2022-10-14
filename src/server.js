const express = require('express');
// const fs = require('fs-extra');
const Path = require('path');
const pug = require('pug');
const Translations = require('./utils/i18n');
// const utils = require('./utils/common');

const staticPath = Path.join(__dirname, 'static');

const { languagePriority } = require('./config.json');
const app = express();
const port = 8080;

app.get('/(*/)?(*.html)?', async (req, res) => {
    const Views = require('./utils/views');
    const common = require('./i18n/common.json');
    const lang = req.query.lang ||  languagePriority[0];
    const pTranslation = Translations.loadTranslation(lang);

    const pages = Views.translatePages(await Views.getPages(), await pTranslation);

    const currentPage = Views.getPageFromPath(pages, req.path);
    const file = currentPage ? Views.getViewFile(currentPage.view, lang) : null;
    if (!file) {
        res.sendStatus(404);
        return;
    }
    const props = {
        ...common,
        componentsApiBasePath: Views.componentsApiBasePath,
        language: lang,
        pages,
        currentPage
    };

    res.send(pug.renderFile(file, props));
})

app.use(express.static(staticPath, {dotfiles: 'allow'}));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
