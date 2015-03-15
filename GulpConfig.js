/**
 * + Gulp Config
 * =====================================================================
 */

module.exports = (function(config) {

    // required packages
    var path   = require('path');

    // data
    var cwd   = process.cwd(),
        pkg   = require(cwd + '/package.json');

    /**
     * + Paths
     * =====================================================================
     */

    config.paths = (function(p) {
        p.root      = cwd;
        p.node      = path.join(p.root, 'node_modules');
        p.src       = path.join(p.root, 'src');
        p.dest      = path.join(p.root, 'dest');
        p.css       = path.join(p.dest, 'css');
        return p;
    })({});

    /* = Paths */
    /**
      * + Gulp module options
      * =====================================================================
      */

    // gulp default params
    config.gulpParams = {
        environment: 'production'
    };

    // global watch task options
    config.watch = {
        mode: 'auto'
    };

    // stylus options
    config.stylus = {
        // add imports and vendor folders to @import path
        paths: [
            path.join(config.paths.src, 'stylus/imports')
        ],
        // function for generating base64 data-uris
        url: {
            name: 'inline-url',
            limit: false
        },
        // create sourcemaps containing inline sources
        sourcemap: {
            inline: true,
            sourceRoot: '.',
            basePath: path.relative(config.paths.dest, config.paths.css)
        }
    };

    // autoprefixer options
    config.autoprefixer = {
        browsers: [
            'last 2 versions',
            '> 2%',
            'Opera 12.1',
            'Firefox ESR'
        ]
    };

    // csslint options
    // https://github.com/CSSLint/csslint/wiki/Rules-by-ID
    config.csslint = {
        'box-sizing': false,
        'compatible-vendor-prefixes': false,
        'important': false,
        'outline-none': false,
        'universal-selector': false
    };

    /* = Gulp module options */


    return config;
})({});

/* = Gulp Config */
