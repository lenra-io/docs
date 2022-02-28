/**
 * Generate the nginx configuration file
 * @param {string[]} languages Managed languages
 * @returns 
 */
function generateNginxConf(languages) {
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
    
    server {
        listen 0.0.0.0:8080;
        server_name documentation;
        root /app/;
    
        charset utf-8;
        charset_types text/css application/javascript;
    
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Content-Security-Policy "default-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';";
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
    
            set $index 'index.html';
            
            try_files /$lang$uri /$lang$uri$index /$lang$uri/$index /static$uri /$lang$index /$lang/$index =404;

            sub_filter_types text/plain;
            sub_filter_once off;
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

module.exports = {
    generateNginxConf
}