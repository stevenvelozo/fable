'use strict';

/*
  After hours of reading and trying various ways of using gulp-env, environment variables
  and babel browesrslistrc / package.json environments it is clear that the state of using
  these tools is a mess.  There are ways of getting it to work but none of them feel like
  they will work well in the long term (all of the examples seem to be in bands of about
  a year or two of working before the pattern changes entirely).

  WHY did we need such a crazy compatible version?  wkhtmltopdf is why.  It uses a very
  old incompatible version of the QT browser.

  Therefore, we will use a very old and simple method.

	1) There is a config file (gulpfile-config.json), documented here, describing the inputs and outputs for the build operation.

		const _CONFIG = (
			{
				// The input source file that should be passed to browserify:
				// (if you need to auto-instantiate an object, for instance)
				EntrypointInputSourceFile: `${__dirname}/source/Fable-Browser-Shim.js`,

				// The name of the packaged object to be passed to browserify:
				// (browserify sets this to global scope and window.SOMEOBJECTNAMEHERE where SOMEOBJECTNAMEHERE is the string below)
				LibraryObjectName: `Fable`,

				// The folder to write the library files and maps out to:
				LibraryOutputFolder: `${__dirname}/dist/`,

				// The name of the unminified version of the packaged library, for easy debugging:
				LibraryUniminifiedFileName: `fable.js`,

				// The name of the minified version of the packaged library, for production release:
				LibraryMinifiedFileName: `fable.min.js`
			});

	2) We are using a .browserslistrc file... this is what tells gulp-babel, through the
	   magic of the @babel/preset-env library, how to transpile the library into a compatible
	   enough format for our targets.

	   For example as of writing this, there are two targets we want:

			*	Modern browsers in the last five years, expressed as a .browserslistrc with the string "since 2018"
			*	Very old janky browsers expressed as a .browserslistrc with the string "> 0.01%"
				... which is interpreted as anything more than 0.01% of browsers in existence or something like that

	3) Because we want multiple outputs, and, the tools do fine if we want one output but some of
	   the toolchain doesn't like making different targets well, we're just going to have multiple
	   configurations and .browserslistrc files.  So if our spec above says we need a ".browserslistrc"
	   file and a "gulpfile-config.json", we're going to make the following two sets of configuration:

			*	.browserslistrc_default, .gulpfile-config_default.json
			*	.browserslistrc_compatible, .gulpfile-config_compatible.json

	4) We will copy, synchronously, these files to where the rest of our toolchain expects
	   them, before we begin the build.  This will be done by looking at the GULP_CUSTOM_BUILD_TARGET
	   environment variable.  This allows us to create new targets to experiment by copying a couple files,
	   jimmying the settings and setting an environment variable before running the pipeline.

	5) We will run the toolchain and it will happily think it's just doing a single build and kinda work.

 */
// BEGINNING OF STEP 3 and STEP 4 ABOVE
const libFS = require('fs');
const _GULP_CUSTOM_BUILD_TARGET = (typeof(process.env.GULP_CUSTOM_BUILD_TARGET) == 'undefined') ? 'default' : process.env.GULP_CUSTOM_BUILD_TARGET;
console.log(`--> Gulp custom build target set to: [${_GULP_CUSTOM_BUILD_TARGET}]`);
const _GULP_CONFIG = `./gulpfile-config_${_GULP_CUSTOM_BUILD_TARGET}.json`;
const _GULP_CONFIG_TARGET = `./gulpfile-config.json`;
console.log(`   : Environment set gulp config [${_GULP_CONFIG}] will be copied to [${_GULP_CONFIG_TARGET}]`);
if (!libFS.existsSync(`./${_GULP_CONFIG}`))
{
	console.log(`!!!> Enviromnent set gulp config doesn't exist!`);
	process.exit(1);
}
else
{
	libFS.copyFileSync(_GULP_CONFIG, _GULP_CONFIG_TARGET);
	console.log(`   > Environment Gulp Config copied`);
}
const _BROWSERSLISTRC = `./.browserslistrc_${_GULP_CUSTOM_BUILD_TARGET}`;
const _BROWSERSLISTRC_TARGET = `./.browserslistrc`;
console.log(`   : Environment set browserslistrc [${_BROWSERSLISTRC}] will be copied to [${_BROWSERSLISTRC_TARGET}]`);
if (!libFS.existsSync(`./${_GULP_CONFIG}`))
{
	console.log(`!!!> Enviromnent set browserslistrc doesn't exist!`);
	process.exit(1);
}
else
{
	libFS.copyFileSync(_BROWSERSLISTRC, _BROWSERSLISTRC_TARGET);
	console.log(`   > Environment Gulp Config copied`);
}
console.log(`---> The browserslistrc compatibility set is: ${libFS.readFileSync(_BROWSERSLISTRC_TARGET, 'utf8')}`);
// END OF STEP 3 and STEP 4 ABOVE


// ---> Now load the config and get on with building <--- \\
console.log(``);
console.log(`---> Loading the gulp config...`);
const _CONFIG = require('./gulpfile-config.json');
console.log(`   > Building to [${_CONFIG.LibraryUniminifiedFileName}] and [${_CONFIG.LibraryMinifiedFileName}]`)

// --->  Boilerplate Browser Uglification and Packaging  <--- \\
console.log(``);
console.log(`--> Gulp is taking over!`);

const libBrowserify = require('browserify');
const libGulp = require('gulp');

const libVinylSourceStream = require('vinyl-source-stream');
const libVinylBuffer = require('vinyl-buffer');

const libSourcemaps = require('gulp-sourcemaps');
const libGulpUtil = require('gulp-util');
const libBabel = require('gulp-babel');
const libTerser = require('gulp-terser');

// Build the module for the browser
libGulp.task('minified',
() => {
	// set up the custom browserify instance for this task
	var tmpBrowserify = libBrowserify(
	{
		entries: _CONFIG.EntrypointInputSourceFile,
		standalone: _CONFIG.LibraryObjectName,
		debug: true
	});

	return tmpBrowserify.bundle()
		.pipe(libVinylSourceStream(_CONFIG.LibraryMinifiedFileName))
		.pipe(libVinylBuffer())
		.pipe(libSourcemaps.init({loadMaps: true}))
				// Add transformation tasks to the pipeline here.
				.pipe(libBabel())
				.pipe(libTerser())
				.on('error', libGulpUtil.log)
		.pipe(libSourcemaps.write('./'))
		.pipe(libGulp.dest(_CONFIG.LibraryOutputFolder));
});

// Build the module for the browser
libGulp.task('debug',
	() => {
		// set up the custom browserify instance for this task
		var tmpBrowserify = libBrowserify(
		{
			entries: _CONFIG.EntrypointInputSourceFile,
			standalone: _CONFIG.LibraryObjectName,
			debug: true
		});

		return tmpBrowserify.bundle()
			.pipe(libVinylSourceStream(_CONFIG.LibraryUniminifiedFileName))
			.pipe(libVinylBuffer())
					.pipe(libBabel())
					.on('error', libGulpUtil.log)
			.pipe(libGulp.dest(_CONFIG.LibraryOutputFolder));
	});

libGulp.task
(
	'build',
	libGulp.series('debug', 'minified')
);