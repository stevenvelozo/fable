const libFableUtilityTemplate = require('./Fable-Utility-Template.js');
// TODO: These are still pretty big -- consider the smaller polyfills
const libAsyncWaterfall = require('async/waterfall');
const libAsyncEachLimit = require('async/eachLimit');

class FableUtility
{
	constructor(pFable)
	{
		this.fable = pFable;

		// These two functions are used extensively throughout
		this.waterfall = libAsyncWaterfall;
		this.eachLimit = libAsyncEachLimit;
	}

	// Underscore and lodash have a behavior, _.extend, which merges objects.
	// Now that es6 gives us this, use the native thingy.
	extend(pDestinationObject, ...pSourceObjects)
	{
		return Object.assign(pDestinationObject, ...pSourceObjects);
	}

	// Underscore and lodash have a behavior, _.template, which compiles a
	// string-based template with code snippets into simple executable pieces,
	// with the added twist of returning a precompiled function ready to go.
	template(pTemplateText, pData)
	{
		let tmpTemplate = new libFableUtilityTemplate(this.fable, pTemplateText);

		return tmpTemplate.buildTemplateFunction(pTemplateText, pData);
	}

	// This is a safe, modern version of chunk from underscore
	// Algorithm pulled from a mix of these two polyfills:
	// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
	// https://youmightnotneed.com/lodash
	// This implementation was most tolerant in browsers.  Uglify can fix the rest.
	chunk (pInput, pChunkSize, pChunkCache)
	{
		let tmpInputArray = [...pInput];
		// Note lodash defaults to 1, underscore defaults to 0
		let tmpChunkSize = (typeof(pChunkSize) == 'number') ? pChunkSize : 0;
		let tmpChunkCache = (typeof(pChunkCache) != 'undefined') ? pChunkCache : [];

		if (tmpChunkSize <= 0)
		{
			return tmpChunkCache;
		}

		while (tmpInputArray.length)
		{
			tmpChunkCache.push(tmpInputArray.splice(0, tmpChunkSize));
		}

		return tmpChunkCache;
	}
}

module.exports = FableUtility;