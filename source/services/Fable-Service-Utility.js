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
	getInternalValueByHash(pValueAddress)
	{
		// Get the value from the internal manifest and return it
		return this.getValueByHash(this.fable, pValueAddress);
	}

	/**
	 * Get a value from an object by hash/address
	 * @param {object} pObject - The object to get the value from
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 * @param {object} [pManifest] - The manyfest object to use; constructs one inline if not provided
	 * @returns {object} - The value from the object
	 */
	getValueByHash(pObject, pValueAddress, pManifest)
	{
		let tmpManifest = pManifest;

		if (typeof(tmpManifest) == 'undefined')
		{
			// Lazily create a manifest if it doesn't exist
			if (!this.manifest)
			{
				this.manifest = this.fable.newManyfest();
			}
			tmpManifest = this.manifest;
		}

		// Get the value from the internal manifest and return it
		return tmpManifest.getValueByHash(pObject, pValueAddress);
	}

	/**
	 * Set a value to an object by hash/address
	 * @param {object} pObject - The object to get the value from
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 * @param {object} pValue - The value to set
	 * @param {object} [pManifest] - The manyfest object to use; constructs one inline if not provided
	 * @returns {object} - The value from the object
	 */
	setValueByHash(pObject, pValueAddress, pValue, pManifest)
	{
		let tmpManifest = pManifest;

		if (typeof(tmpManifest) == 'undefined')
		{
			// Lazily create a manifest if it doesn't exist
			if (!this.manifest)
			{
				this.manifest = this.fable.newManyfest();
			}
			tmpManifest = this.manifest;
		}

		// Get the value from the internal manifest and return it
		return tmpManifest.setValueByHash(pObject, pValueAddress, pValue);
	}

	/**
	 * Get a value array from an object by hash/address list
	 * @param {object} pObject - The object to get the value from
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 * @param {object} [pManifest] - The manyfest object to use; constructs one inline if not provided
	 * @returns {Array} - The value array built from the hash list
	 */
	createValueArrayByHashes(pObject, pValueHashes, pManifest)
	{
		let tmpManifest = pManifest;

		if (typeof(tmpManifest) == 'undefined')
		{
			// Lazily create a manifest if it doesn't exist
			if (!this.manifest)
			{
				this.manifest = this.fable.newManyfest();
			}
			tmpManifest = this.manifest;
		}

		if (!Array.isArray(pValueHashes))
		{
			return [];
		}

		let tmpValueArray = [];
		for (let i = 0; i < pValueHashes.length; i++)
		{
			tmpValueArray.push(tmpManifest.getValueByHash(pObject, pValueHashes[i]));
		}

		// Get the value from the internal manifest and return it
		return tmpValueArray;
	}

	/**
	 * Get a value array by hash/address list from the internal fable/pict state
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 * @param {object} [pManifest] - The manyfest object to use; constructs one inline if not provided
	 * @returns {Array} - The value array built from the hash list
	 */
	createValueArrayByHashesFromInternal(pValueHashes, pManifest)
	{
		return this.createValueArrayByHashes(this.fable, pValueHashes, pManifest);
	}

	createValueArrayByHashParametersFromInternal()
	{
		if (arguments.length < 2)
		{
			return [];
		}
		
		let tmpValueHashes = Array.prototype.slice.call(arguments);
		return this.createValueArrayByHashes(this.fable, tmpValueHashes);
	}

	/**
	 * Get a value object from a list of hash/addressese
	 * @param {object} pObject - The object to get the value from
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 * @param {object} [pManifest] - The manyfest object to use; constructs one inline if not provided
	 * @returns {object} - The value object built from the hash list
	 */
	createValueObjectByHashes(pObject, pValueHashes, pManifest)
	{
		let tmpManifest = pManifest;

		if (typeof(tmpManifest) == 'undefined')
		{
			// Lazily create a manifest if it doesn't exist
			if (!this.manifest)
			{
				this.manifest = this.fable.newManyfest();
			}
			tmpManifest = this.manifest;
		}

		if (!Array.isArray(pValueHashes))
		{
			return {};
		}

		let tmpValueObject = {};
		for (let i = 0; i < pValueHashes.length; i++)
		{
			tmpValueObject[pValueHashes[i]] = tmpManifest.getValueByHash(pObject, pValueHashes[i]);
		}

		// Get the value from the internal manifest and return it
		return tmpValueObject;
	}

	/**
	 * Get a value object by hash/address list from the internal fable/pict state
	 * @param {string} pValueAddress - The manyfest hash/address of the value to get
	 * @param {object} [pManifest] - The manyfest object to use; constructs one inline if not provided
	 * @returns {object} - The value object built from the hash list
	 */
	createValueObjectByHashesFromInternal(pValueHashes, pManifest)
	{
		return this.createValueObjectByHashes(this.fable, pValueHashes, pManifest);
	}

	/**
	 * Get a value object by hash/address list as parameters from the internal fable/pict state
	 * @returns {Array} - The value array built from the hash list
	 */
	createValueObjectByHashParametersFromInternal()
	{
		let tmpValueHashes = Array.prototype.slice.call(arguments);
		return this.createValueObjectByHashes(this.fable, tmpValueHashes);
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

	/**
	 * Find the first value in an object that contains a specific value
	 * @param {array} pObjectArray - The array of objects to search
	 * @param {string} pValueToMatchAddress - The manyfest hash/address of the value to match
	 * @param {string} pValueToMatch - The value to match
	 * @param {string} pValueAddress - The manyfest hash/address of the value to return
	 * @returns {any} - The value from the object
	 */
	findFirstValueByStringIncludes(pObjectArray, pValueToMatchAddress, pValueToMatch, pValueAddress)
	{
		// Lazily create a manifest if it doesn't exist
		if (!this.manifest)
		{
			this.manifest = this.fable.newManyfest();
		}

		if (!Array.isArray(pObjectArray))
		{
			return undefined;
		}
		for (let i = 0; i < pObjectArray.length; i++)
		{
			let tmpValueToMatch = this.manifest.getValueByHash(pObjectArray[i], pValueToMatchAddress);
			if (tmpValueToMatch && (tmpValueToMatch.includes(pValueToMatch)))
			{
				return this.manifest.getValueByHash(pObjectArray[i], pValueAddress);
			}
		}

		return undefined;
	}

	/**
	 * Find the first value in an object that contains a specific value
	 * @param {string} pFableAddress - The address in the fable object to pull the value from
	 * @param {string} pValueToMatchAddress - The manyfest hash/address of the value to match
	 * @param {string} pValueToMatch - The value to match
	 * @param {string} pValueAddress - The manyfest hash/address of the value to return
	 * @returns {any} - The value from the object
	 */
	findFirstValueByStringIncludesInternal(pFableAddress, pValueToMatchAddress, pValueToMatch, pValueAddress)
	{
		// Lazily create a manifest if it doesn't exist
		if (!this.manifest)
		{
			this.manifest = this.fable.newManyfest();
		}

		if (typeof(pFableAddress) != 'string')
		{
			return undefined;
		}
		let tmpObjectArray = this.manifest.getValueByHash(this.fable, pFableAddress);

		return this.findFirstValueByStringIncludes(tmpObjectArray, pValueToMatchAddress, pValueToMatch, pValueAddress);
	}

	/**
	 * Find the first value in an object that contains a specific value
	 * @param {array} pObjectArray - The array of objects to search
	 * @param {string} pValueToMatchAddress - The manyfest hash/address of the value to match
	 * @param {string} pValueToMatch - The value to match
	 * @param {string} pValueAddress - The manyfest hash/address of the value to return
	 * @returns {any} - The value from the object
	 */
	findFirstValueByExactMatch(pObjectArray, pValueToMatchAddress, pValueToMatch, pValueAddress)
	{
		// Lazily create a manifest if it doesn't exist
		if (!this.manifest)
		{
			this.manifest = this.fable.newManyfest();
		}

		if (!Array.isArray(pObjectArray))
		{
			return undefined;
		}
		for (let i = 0; i < pObjectArray.length; i++)
		{
			let tmpValueToMatch = this.manifest.getValueByHash(pObjectArray[i], pValueToMatchAddress);
			if (tmpValueToMatch && (tmpValueToMatch == pValueToMatch))
			{
				return this.manifest.getValueByHash(pObjectArray[i], pValueAddress);
			}
		}

		return undefined;
	}

	/**
	 * Find the first value in an object that contains a specific value
	 * @param {string} pFableAddress - The address in the fable object to pull the value from
	 * @param {string} pValueToMatchAddress - The manyfest hash/address of the value to match
	 * @param {string} pValueToMatch - The value to match
	 * @param {string} pValueAddress - The manyfest hash/address of the value to return
	 * @returns {any} - The value from the object
	 */
	findFirstValueByExactMatchInternal(pFableAddress, pValueToMatchAddress, pValueToMatch, pValueAddress)
	{
		// Lazily create a manifest if it doesn't exist
		if (!this.manifest)
		{
			this.manifest = this.fable.newManyfest();
		}

		if (typeof(pFableAddress) != 'string')
		{
			return undefined;
		}
		let tmpObjectArray = this.manifest.getValueByHash(this.fable, pFableAddress);

		return this.findFirstValueByExactMatch(tmpObjectArray, pValueToMatchAddress, pValueToMatch, pValueAddress);
	}

	/**
	 * Flatten an array of solver inputs into a single array
	 *
	 * @param {Array<any>} pInputArray - The array of inputs to flatten
	 * @return {Array<any>} - The flattened array
	 */
	flattenArrayOfSolverInputs(pInputArray)
	{
		if (!Array.isArray(pInputArray))
		{
			if (typeof pInputArray === 'object')
			{
				pInputArray = Object.values(pInputArray);
			}
			if (!pInputArray)
			{
				return [];
			}
		}
		const tmpArrayFlattener = (p) =>
		{
			if (Array.isArray(p))
			{
				return p; // .flatMap(tmpArrayFlattener);
			}
			if (typeof p === 'object')
			{
				return Object.values(p);
			}
			return [ p ];
		};
		return pInputArray.flatMap(tmpArrayFlattener);
	}
}

module.exports = FableServiceUtility;
