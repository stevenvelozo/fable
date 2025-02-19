const libFableServiceBase = require('fable-serviceproviderbase');

// TODO: These are still pretty big -- consider the smaller polyfills
const libAsyncWaterfall = require('async.waterfall');
const libAsyncEachLimit = require('async.eachlimit');

const libBigNumber = require('big.js');

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

		this.bigNumber = libBigNumber;
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
			if (typeof(tmpSourceObject) === 'object')
			{
				let tmpObjectProperties = Object.keys(tmpSourceObject);
				for (let k = 0; k < tmpObjectProperties.length; k++)
				{
					pDestinationObject[tmpObjectProperties[k]] = tmpSourceObject[tmpObjectProperties[k]];
				}
			}
		}
		return pDestinationObject;
	}

	// Underscore and lodash have a behavior, _.template, which compiles a
	// string-based template with code snippets into simple executable pieces,
	// with the added twist of returning a precompiled function ready to go.
	template(pTemplateText, pData)
	{
		let tmpTemplate = this.fable.instantiateServiceProviderWithoutRegistration('Template');
		return tmpTemplate.buildTemplateFunction(pTemplateText, pData);
	}

	// Build a template function from a template hash, and, register it with the service provider
	buildHashedTemplate(pTemplateHash, pTemplateText, pData)
	{
		let tmpTemplate = this.fable.instantiateServiceProvider('Template', {}, pTemplateHash);
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
	
	/**
	 * Get a value from fable/pict by hash/address
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 */
	getValue(pValueAddress)
	{
		// Lazily create a manifest if it doesn't exist
		if (!this.manifest)
		{
			this.manifest = this.fable.newManyfest();
		}

		// Get the value from the internal manifest and return it
		return this.manifest.getValueByHash(this.fable, pValueAddress);
	}
	
	/**
	 * Check if a value is null or empty
	 * @param {object} pObject - The object to check
	 * @param {string} pValueAddress - The manyfest hash/address to check
	 */
	addressIsNullOrEmpty(pObject, pValueAddress)
	{
		// Lazily create a manifest if it doesn't exist
		if (!this.manifest)
		{
			this.manifest = this.fable.newManyfest();
		}

		// If it doesn't exist, it is null or empty.
		if (!this.manifest.checkAddressExists(pObject, pValueAddress))
		{
			return true;
		}

		// Get the value from the internal manifest and return it
		let tmpValue = this.manifest.getValueByHash(pObject, pValueAddress);
		if (tmpValue === null || tmpValue === '')
		{
			return true;
		}

		return false;
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
		if (!('Dates' in this.fable))
		{
			this.fable.instantiateServiceProvider('Dates');
		}

		let tmpDate = false;

		try
		{
			tmpDate = this.fable.Dates.dayJS.utc(pISOString);
		}
		catch(pError)
		{
			// TODO: Should this throw?  Doubtful.
			this.fable.log.error(`Could not parse date string ${pISOString} with dayJS.`);
			return false;
		}

		if (tmpDate)
		{
			return tmpDate.toDate();
		}
		else
		{
			return false;
		}
	}
}

module.exports = FableServiceUtility;