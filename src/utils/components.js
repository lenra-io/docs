const fs = require('fs-extra');
const path = require('path');
const { getFilesRecursively } = require('./common');

const compFileRegex = /^(.+[.]json)$/;
const componentsPath = path.join(__dirname, '..', 'api/');
const subDefinitionSeparator = '@';

/**
 * Get the managed languages
 * @returns {Promise<Array<string>>}
 */
function getManagedComponents() {
    return getFilesRecursively(componentsPath)
        .map(file => file.match(compFileRegex))
        .filter(match => match)
        .map(match => match[1])
        .map(file => path.relative(componentsPath, file).replace('\\', '/'));
}

/**
 * Load all the translations managed
 * @returns
 */
async function loadComponents() {
    const components = {};
    await Promise.all((getManagedComponents())
        .map(comp => loadComponent(comp)
            .then(c => components[comp] = c)));
    return components;
}

/**
 * Load the defined translations for a language
 * @param {string} comp The translations language
 * @returns The translation map
 */
async function loadComponent(comp) {
    return fs.readFile(path.join(componentsPath, `${comp}`), 'utf8')
        .then(data => {
            return JSON.parse(data);
        });
}

const classicProps = ['$schema', '$id', 'title', 'additionalProperties', '$ref', 'type', 'description', 'enum', 'default', 'items'];

/**
 * Compare two strings
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

/**
 * Parse API schemata to definitions
 * @param {object} schemata Components schemata
 * @param {Definition} parent Parent definition
 * @returns {Definition[]}
 */
function parseSchemata(schemata, parent) {
    return Object.entries(schemata)
        .filter(([id, schema]) => id.endsWith('/iconData.schema.json') || schema.properties)
        .sort(([aId, a], [bId, b]) => {
            const aParts = aId.split('/');
            const bParts = bId.split('/');
            const size = Math.min(aParts.length, bParts.length) - 1;
            for (let i = 0; i < size; i++) {
                const diff = compareStrings(aParts[i], bParts[i]);
                if (diff!=0) return diff;
            }
            if (aParts.length!=bParts.length)
                return aParts.length - bParts.length;
            return compareStrings(aParts[size], bParts[size]);
        })
        .map(([id, schema]) => {
            const ret = parseSchema(id, schema);
            if (schema.definitions)
                ret.setSubDefinitions(parseSchemata(schema.definitions, ret));
            return ret;
        });

    /**
     * Parse the schema to a definition
     * @param {string} id Schema id
     * @param {object} schema The schema
     * @param {Definition} parent The parent definition
     * @return {Definition}
     */
    function parseSchema(id, schema) {
        const properties = parseProperties(schema.properties);
        const title = schema.title || id;
        return new Definition(
            parent ? `${parent.id}@${id}` : id,
            parent ? `${parent.name}@${title}` : title,
            schema.description,
            properties ? null : parseType(schema),
            properties
        );


        function parseType(property) {
            let content = property;
            let isArray = content.type=='array';
            let description = content.description;
            if (isArray) {
                content = {...content, ...property.items};
                if (!description) description = property.items.description;
            }
            let ref = content['$ref'];
            if (ref) {
                let target = schemata[ref];
                if (ref.startsWith('#/')) {
                    ref = ref.substring(2);
                    const parts = ref.split('/');
                    target = parts.reduce((o, att) => o[att], schema);
                    const n = parts[parts.length-1];
                    ref = (parent ? parent.id : id) + subDefinitionSeparator + n;
                    content.type = ref;
                }
                else {
                    content.type = target.title;
                }
                if (!description) description = target.description;
                if (!target.properties && !ref.endsWith('/iconData.schema.json')) {
                    ref = null;
                    content = {...content, ...target};
                }
            }
            return new Type(content.type, description, ref, content, isArray, content.enum, content.default);
        }
        /**
         * @param {string} name
         * @param {any} property
         * @returns
         */
        function parseProperty(name, property) {
            const type = parseType(property);
            const attributes = Object.entries(type.target)
                .map(([key, value]) => ({key, value}))
                .filter(({key, value}) => !classicProps.includes(key) && value!=null)
                .flatMap(({key, value}) => {
                    if (key=='properties')
                        return parseProperties(value)
                            .map(p => new Attribute(`${key}.${p.name}`, p));
                    return [new Attribute(key, value)];
                });
            return new Property(
                name,
                property.description || type.description,
                type,
                schema.required && schema.required.includes(name),
                attributes
            );
        }

        /**
         * @param {any} properties Properties schema
         * @returns {Property[]}
         */
        function parseProperties(properties) {
            if (!properties) return null;
            return Object.entries(properties)
            .map(([name, property]) => parseProperty(name, property))
            .sort((a, b) => {
                if (a.name=='type')
                    return -1;
                if (b.name=='type')
                    return 1;
                if (a.required && !b.required)
                    return -1;
                else if (!a.required && b.required)
                    return 1;
                return compareStrings(a.name, b.name);
            });
        }
    }
}

class Definition {
    /**
     * @param {string} id The definition id
     * @param {string} name The definition name
     * @param {string} description The definition description
     * @param {Type} type The definition type
     * @param {Property[]} properties The definition properties
     */
    constructor(id, name, description, type, properties) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.properties = properties;
        this.hasOtherAttributes = properties && properties.some(p => p.attributes.length>0);
        this.setSubDefinitions([]);
    }

    /**
     * @param {Definition[]} subDefs
     */
    setSubDefinitions(subDefs) {
        this.subDefinitions = subDefs;
        this.subDefinitionsMap = {};
        subDefs.forEach(d => this.subDefinitionsMap[d.id] = d);
    }
}

class Property {
    /**
     * @param {string} name Property name
     * @param {string} description Property description
     * @param {Type} type Property type
     * @param {boolean} required True if the property is required
     * @param {Attribute[]} attributes The property other attributes
     */
    constructor(name, description, type, required, attributes) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.required = required;
        this.attributes = attributes;
    }
}

class Type {
    /**
     * @param {string} name
     * @param {string} description
     * @param {string} ref
     * @param {any} target
     * @param {boolean} isArray
     * @param {any[]} values
     * @param {any} defaultValue
     */
    constructor(name, description, ref, target, isArray, values, defaultValue) {
        this.name = name;
        this.description = description;
        this.ref = ref;
        this.target = target
        this.isArray = isArray;
        this.values = values;
        this.defaultValue = defaultValue;
    }
}

class Attribute {
    /**
     * @param {string} name Attribute name
     * @param {any} value Attribute value
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

module.exports = {
    Definition,
    Property,
    Type,
    Attribute,
    getManagedComponents,
    loadComponent,
    loadComponents,
    parseSchemata,
    subDefinitionSeparator
}
