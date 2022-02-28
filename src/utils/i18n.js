const fs = require('fs-extra');
const path = require('path');

const langFileRegex = /^([a-z]{2})[.]json$/;
const i18nPath = path.join(__dirname, '..', 'i18n');

/**
 * Get the managed languages
 * @returns {Promise<Array<string>>}
 */
async function getManagedLanguages() {
    return fs.readdir(i18nPath)
    .then(files => files
        .map(file => file.match(langFileRegex))
        .filter(match => match)
        .map(match => match[1])
    );
}

/**
 * Load all the translations managed
 * @returns 
 */
async function loadTranslations() {
    const translations = {};
    await Promise.all((await getManagedLanguages())
    .map(lang => loadTranslation(lang)
        .then(t => translations[lang] = t)));
     return translations;
}

/**
 * Load the defined translations for a language
 * @param {string} lang The translations language
 * @returns The translation map
 */
async function loadTranslation(lang) {
    return fs.readFile(path.join(i18nPath, `${lang}.json`), 'utf8')
    .then(data => {
        return JSON.parse(data);
    });
}

exports.getManagedLanguages = getManagedLanguages;
exports.loadTranslation = loadTranslation;
exports.loadTranslations = loadTranslations;