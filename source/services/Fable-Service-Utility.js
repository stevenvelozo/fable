const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

// TODO: These are still pretty big -- consider the smaller polyfills
const libAsyncWaterfall = require('async.waterfall');
const libAsyncEachLimit = require('async.eachlimit');

class FableServiceUtility extends libFableServiceBase
{
	// Underscore and lodash have a behavior, _.template, which compiles a
	// string-based template with code snippets into simple executable pieces,
	// with the added twist of returning a precompiled function ready to go.
	//
	// NOTE: This does not implement underscore escape expressions
	// NOTE: This does not implement underscore magic browser variable assignment
	//
	// This is an implementation of that.
	// TODO: Make this use precedent, add configuration, add debugging.
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

		this.templates = {};

		// These two functions are used extensively throughout
		this.waterfall = libAsyncWaterfall;
		this.eachLimit = libAsyncEachLimit;
	}

	// Underscore and lodash have a behavior, _.extend, which merges objects.
	// Now that es6 gives us this, use the native thingy.
	// Nevermind, the native thing is not stable enough across environments
	// Basic shallow copy
	extend(pDestinationObject, ...pSourceObjects)
	{
		for (let i = 0; i < pSourceObjects.length; i++)
		{
			let tmpSourceObject = pSourceObjects[i];
			let tmpObjectProperties = Object.keys(tmpSourceObject);
			for (let k = 0; k < tmpObjectProperties.length; k++)
			{
				pDestinationObject[tmpObjectProperties[k]] = tmpSourceObject[tmpObjectProperties[k]];
			}
		}
		return pDestinationObject;
	}

	// Underscore and lodash have a behavior, _.template, which compiles a
	// string-based template with code snippets into simple executable pieces,
	// with the added twist of returning a precompiled function ready to go.
	template(pTemplateText, pData)
	{
		let tmpTemplate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Template');

		return tmpTemplate.buildTemplateFunction(pTemplateText, pData);
	}

	// Build a template function from a template hash, and, register it with the service provider
	buildHashedTemplate(pTemplateHash, pTemplateText, pData)
	{
		let tmpTemplate = this.fable.serviceManager.instantiateServiceProvider('Template', {}, pTemplateHash);

		this.templates[pTemplateHash] = tmpTemplate.buildTemplateFunction(pTemplateText, pData);

		return this.templates[pTemplateHash];
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

	// Convert an ISO string to a javascript date object
	// Adapted from https://stackoverflow.com/a/54751179
	//
	// Takes strings like: 2022-11-04T11:34:45.000Z
	//                and: 1986-06-11T09:34:46.012Z+0200
	// ... and converts them into javascript timestamps, following the directions of the timezone stuff.
	//
	// This is not meant to replace the more complex libraries such as moment or luxon.
	// This *is* meant to be a simple, small, and fast way to convert ISO strings to dates in engines
	// with ultra limited JS capabilities where those don't work.
	isoStringToDate (pISOString)
	{

		// Split the string into an array based on the digit groups.
		let tmpDateParts = pISOString.split( /\D+/ );

		// Set up a date object with the current time.
		let tmpReturnDate = new Date();

		// Track the number of hours we need to adjust the date by based on the timezone.
		let tmpTimeZoneOffsetInHours = 0;
		// Track the number of minutes we need to adjust the date by based on the timezone.
		let tmpTimeZoneOffsetInMinutes = 0;

		// Manually parse the parts of the string and set each part for the
		// date. Note: Using the UTC versions of these functions is necessary
		// because we're manually adjusting for time zones stored in the
		// string.
		tmpReturnDate.setUTCFullYear( parseInt( tmpDateParts[ 0 ] ) );

		// The month numbers are one "off" from what normal humans would expect
		// because January == 0.
		tmpReturnDate.setUTCMonth( parseInt( tmpDateParts[ 1 ] - 1 ) );
		tmpReturnDate.setUTCDate( parseInt( tmpDateParts[ 2 ] ) );

		// Set the time parts of the date object.
		tmpReturnDate.setUTCHours( parseInt( tmpDateParts[ 3 ] ) );
		tmpReturnDate.setUTCMinutes( parseInt( tmpDateParts[ 4 ] ) );
		tmpReturnDate.setUTCSeconds( parseInt( tmpDateParts[ 5 ] ) );
		tmpReturnDate.setUTCMilliseconds( parseInt( tmpDateParts[ 6 ] ) );

		// If there's a value for either the hours or minutes offset.
		if (tmpDateParts[ 7 ] || tmpDateParts[ 8 ])
		{
			// If there's a value for the minutes offset.
			if (tmpDateParts[8])
			{
				// Convert the minutes value into an hours value.
				tmpTimeZoneOffsetInMinutes = parseInt(tmpDateParts[8]) / 60;
			}

			// Add the hours and minutes values to get the total offset in hours.
			tmpTimeZoneOffsetInHours = parseInt(tmpDateParts[7]) + tmpTimeZoneOffsetInMinutes;

			// If the sign for the timezone is a plus to indicate the timezone is ahead of UTC time.
			if (pISOString.substr( -6, 1 ) == "+")
			{
				// Make the offset negative since the hours will need to be subtracted from the date.
				tmpTimeZoneOffsetInHours *= -1;
			}
		}

		// Get the current hours for the date and add the offset to get the correct time adjusted for timezone.
		tmpReturnDate.setHours( tmpReturnDate.getHours() + tmpTimeZoneOffsetInHours );

		// Return the Date object calculated from the string.
		return tmpReturnDate;
	}
}

module.exports = FableServiceUtility;