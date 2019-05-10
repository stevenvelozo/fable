'use strict';

const libBrowserify = require('browserify');
const libGulp = require('gulp');

const libVinylSourceStream = require('vinyl-source-stream');
const libVinylBuffer = require('vinyl-buffer');

const libTerser = require('gulp-terser');
const libSourcemaps = require('gulp-sourcemaps');
const libGulpUtil = require('gulp-util');
const libGulpBabel = require('gulp-babel');

// Build the module for the browser
//   This gulp task is taken from the gulp recipe repository:
//   https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
libGulp.task('minified',
	() => {
		// set up the custom browserify instance for this task
		var tmpBrowserify = libBrowserify(
		{
			entries: './source/Fable.js',
			debug: true
		});
		//tmpBrowserify.ignore('underscore');

		return tmpBrowserify.bundle()
			.pipe(libVinylSourceStream('fable.min.js'))
			.pipe(libVinylBuffer())
			.pipe(libSourcemaps.init({loadMaps: true}))
					// Add transformation tasks to the pipeline here.
					.pipe(libTerser())
					.on('error', libGulpUtil.log)
			.pipe(libSourcemaps.write('./'))
			.pipe(libGulp.dest('./dist/'));
	});

// Build the module for the browser
//   This gulp task is taken from the gulp recipe repository:
//   https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
libGulp.task('debug',
	() => {
		// set up the custom browserify instance for this task
		var tmpBrowserify = libBrowserify(
		{
			entries: './source/Fable.js',
			debug: true
		});

		return tmpBrowserify.bundle()
			.pipe(libVinylSourceStream('fable.js'))
			.pipe(libVinylBuffer())
					.on('error', libGulpUtil.log)
			.pipe(libGulp.dest('./dist/'));
	});

libGulp.task
(
	'build',
	libGulp.series('debug', 'minified')
);
