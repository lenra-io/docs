/**
 * Generate the nginx configuration file
 * @param {string[]} languages Managed languages
 * @param {any} additionalContentSecurityPolicies Additional content security policies
 * @returns 
 */
function generateNginxConf(languages, additionalContentSecurityPolicies) {
    return `map $http_accept_language $lang {
        default ${languages[0]};
    
        ${languages
                    .map(((lang, i) => acceptLangMapper(languages, lang, i)))
                    .join('\n    ')
                }
    }

    map $http_x_forwarded_proto $initial_scheme {
        default $scheme;
        https https;
    }

    map $request_uri $redirect_uri {
        /root.schema.html           /components-api/root.html;
        ~^/(components|defs)/(.*).schema.html$    /components-api/$1/$2.html;
        ~^/(components|defs)/$    /components-api/$1/;
        # A named capture that maps
        # e.g. service-1234.html into /services/item-1234/overview
        ~service-(?<sku>\d+)\.html   /services/item-$sku/overview;
    }
    
    server {
        listen 0.0.0.0:8080;
        server_name documentation;
        root /app/;
    
        charset utf-8;
        charset_types text/css application/javascript;
    
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Content-Security-Policy "${buildContentSecurityPolicyHeader(additionalContentSecurityPolicies)}";
        add_header Vary "Accept-Encoding";
        add_header X-Content-Type-Options "nosniff";
        add_header X-Frame-Options "DENY";
    
        gzip_types
            text/plain
            text/css
            text/js
            text/xml
            text/javascript
            application/javascript
            application/x-javascript
            application/json
            application/xml
            application/rss+xml
            image/svg+xml;
        
        location / {
            expires 10d;
            
            if ($uri ~ '^/((${languages.join('|')}|static)(/.*)?)$') {
                return 404;
            }

            # if ( $redirect_uri ) {
            #     return 301 $redirect_uri;
            # }

            
            rewrite ^/root.schema.html$ /components-api/root.html permanent;
            rewrite ^/(components|defs)/(.*).schema.html$ /components-api/$1/$2.html permanent;
            rewrite ^/(components|defs)/$ /components-api/$1/ permanent;
    
            set $index 'index.html';
            
            try_files /$lang$uri /$lang$uri$index /$lang$uri/$index /static$uri /$lang$index /$lang/$index =404;

            sub_filter_types text/plain;
            sub_filter_once off;
            sub_filter '!DOMAIN!'  '$host';
            sub_filter '!CURRENT_URL!'  '$initial_scheme://$host$request_uri';
            sub_filter '!BASE_URL!'  '$initial_scheme://$host';
            sub_filter '!IMAGE_URL!'  '$initial_scheme://$host$uri.jpg';
        }
    }
    `;
}

/**
 * 
 * @param {string[]} langs The available langs
 * @param {string} lang The lang
 * @param {int} i Position in langs
 * @returns 
 */
function acceptLangMapper(langs, lang, i) {
    return `~${i < langs.length - 1
            ? `^(((?!(${langs.slice(i + 1).join('|')})).)+,)*`
            : ''
        }${lang}.* ${lang};`;
}

/**
 * 
 * @param {any} additionalPolicies Additional policies
 */
function buildContentSecurityPolicyHeader(additionalPolicies) {
    if (!additionalPolicies) additionalPolicies = {};
    const defaultSecurityPolicies = {
        'default-src': ['self'],
        'object-src': ['none'],
        'base-uri': ['self']
    };
    const policies = {};
    mergeDeep(policies, defaultSecurityPolicies, additionalPolicies);
    const siteRuleRegex = /.*[.*].*/;
    return Object.entries(policies)
        .map(([key, values]) => `${key} ${values.map(v => siteRuleRegex.test(v) ? v : `'${v}'`).join(' ')};`)
        .join(' ');
}

class NginxConfOptions {
    /**
     * @param {string[]} languages The managed languages ordered by priority
     * @param {RewriteRule[]} rewriteRules The conf rewrite rules
     * @param {any} additionalContentSecurityPolicies Additional content security policies
     */
    constructor(languages, rewriteRules, additionalContentSecurityPolicies) {
        this.languages = languages || ['en'];
        this.rewriteRules = rewriteRules || [];
        this.additionalContentSecurityPolicies = additionalContentSecurityPolicies || {};
    }
}

class RewriteRule {
    /**
     * @param {string} from The request url regex
     * @param {string} to The rewrite target
     * @param {"last"|"break"|"redirect"|"permanent"|void} flag The rewrite flag
     */
    constructor(from, to, flag) {
        this.from = from;
        this.to = to;
        this.type = flag;
    }
}

module.exports = {
    generateNginxConf,
    NginxConfOptions,
    RewriteRule
}