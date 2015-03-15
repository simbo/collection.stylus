/**
 * + Gulpfile
 * https://github.com/gulpjs/gulp/blob/master/docs/API.md
 * https://github.com/gulpjs/gulp/tree/master/docs/recipes
 * =====================================================================
 */
'use strict';

// node modules
var _            = require('lodash'),
    autoPlug     = require('auto-plug'),
    autoprefixer = require('autoprefixer-core'),
    csswring     = require('csswring'),
    del          = require('del'),
    gulp         = require('gulp'),
    minimist     = require('minimist'),
    mqpacker     = require('css-mqpacker'),
    path         = require('path'),
    runSequence  = require('run-sequence'),
    util         = require('util');

// external data
var config = require(process.cwd() + '/GulpConfig.js'),
    pkg    = require(process.cwd() + '/package.json');

// auto-require gulp plugins
var g  = autoPlug({ prefix: 'gulp', config: pkg });


/**
 * + Error handling
 * =====================================================================
 */

function handleError(err) {
    g.util.log(err.toString());
    this.emit('end');
}

/* = Error handling */


/**
 * + Parse CLI params
 * =====================================================================
 */

var params = (function(p){
        var cliParams = minimist(process.argv.slice(2));
        p.environment = cliParams.environment || cliParams.env || process.env.NODE_ENV || config.gulpParams.environment || 'production';
        return p;
    })({});

/* = Parse CLI params */


/**
 * + Stylus / CSS processing
 * =====================================================================
 */

gulp.task('build:css', function() {
    return gulp

        // grab all stylus files in stylus root folder
        .src(config.paths.src + '/stylus/*.styl')

        // pipe through stylus processor
        .pipe(g.stylus(config.stylus).on('error', handleError))

        // pipe through sourcemaps processor
        .pipe(g.sourcemaps.init({
            loadMaps: true
        }))

        // pipe through postcss processor
        .pipe(g.postcss((function(postcssPlugins){
                // minify only when in production mode
                if (params.environment === 'production') {
                    postcssPlugins.push(csswring(config.csswring));
                }
                return postcssPlugins;
            })([
                autoprefixer(config.autoprefixer),
                mqpacker
            ])
        ).on('error', handleError))

        // pipe through csslint if in development mode
        .pipe(g.if(
            params.environment === 'development',
            g.csslint(config.csslint)
        ))
        .pipe(g.csslint.reporter())

        // write sourcemaps
        .pipe(g.sourcemaps.write('.', {
            includeContent: true,
            sourceRoot: '.'
        }))

        // write processed styles
        .pipe(gulp.dest(config.paths.css));

});

/* = Stylus / CSS processing */


/**
 * + Config sync task
 * =====================================================================
 */

gulp.task('config-sync', function() {
    return gulp
        .src(path.join(config.paths.root, 'bower.json'))
        .pipe(g.configSync(config.configSync))
        .pipe(gulp.dest('.'));
});

/* = Config sync task */


/**
 * + Clean Tasks
 * =====================================================================
 */

// clean generated content
gulp.task('clean:dest', function(done) {
    del(config.paths.dest, done);
});

/* = Clean Tasks */


/**
 * + Watch Task
 * =====================================================================
 */

gulp.task('watch', function() {

    // watch task defintions
    var watchTasks = {
        stylus: {
            glob: '**/*.styl',
            cwd: path.join(config.paths.src, 'stylus'),
            start: 'build:css'
        },
        pkq: {
            glob: 'package.json',
            cwd: config.paths.root,
            start: 'config-sync'
        }
    }

    // show watch info in console
    function logWatchInfo(event) {
        var eventPath = path.relative(config.paths.root, event.path);
        g.util.log('File \'' + g.util.colors.cyan(eventPath) + '\' was ' + g.util.colors.yellow(event.type) + ', running tasks...');
    }

    // create watch tasks
    Object.keys(watchTasks).forEach(function(key) {
        var task = watchTasks[key];
        gulp.watch(task.glob, _.merge({ cwd: task.cwd }, config.watch), function(event) {
            logWatchInfo(event);
            gulp.start(task.start);
        });
    });

});

/* = Watch Task */


/**
 * + Common tasks
 * =====================================================================
 */

// default task
gulp.task('default', ['build']);

// full build
gulp.task('build', ['clean:dest', 'config-sync'], function(done) {
    runSequence(
        'build:css',
        done
    );
});

// build and watch
gulp.task('dev', ['build'], function() {
    gulp.start('watch');
});

/* = Common tasks */


/* = Gulpfile */
