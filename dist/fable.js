(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fable = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
* Base Logger Class
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/
const libFableUUID = new (require('fable-uuid').FableUUID)();

class BaseLogger
{
	constructor(pLogStreamSettings, pFableLog)
	{
		// This should not possibly be able to be instantiated without a settings object
		this._Settings = pLogStreamSettings;
		
		// The base logger does nothing but associate a UUID with itself
		this.loggerUUID = libFableUUID.getUUID();
	}

	initialize()
	{
		// No operation.
	}

	trace(pLogText, pLogObject)
	{
		this.write("trace", pLogText, pLogObject);
	}

	debug(pLogText, pLogObject)
	{
		this.write("debug", pLogText, pLogObject);
	}

	info(pLogText, pLogObject)
	{
		this.write("info", pLogText, pLogObject);
	}

	warn(pLogText, pLogObject)
	{
		this.write("warn", pLogText, pLogObject);
	}

	error(pLogText, pLogObject)
	{
		this.write("error", pLogText, pLogObject);
	}

	fatal(pLogText, pLogObject)
	{
		this.write("fatal", pLogText, pLogObject);
	}

	write(pLogLevel, pLogText, pLogObject)
	{
		// The base logger does nothing.
		return true;
	}
}

module.exports = BaseLogger;

},{"fable-uuid":9}],2:[function(require,module,exports){
/**
* Default Logger Provider Function --- Browser
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

// Return the providers that are available without extensions loaded
getDefaultProviders = () =>
{
	let tmpDefaultProviders = {};

	tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');
	tmpDefaultProviders.default = tmpDefaultProviders.console;

	return tmpDefaultProviders;
}

module.exports = getDefaultProviders();
},{"./Fable-Log-Logger-Console.js":4}],3:[function(require,module,exports){
module.exports=[
    {
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
    }
]
},{}],4:[function(require,module,exports){
let libBaseLogger = require('./Fable-Log-BaseLogger.js');

class ConsoleLogger extends libBaseLogger
{
	constructor(pLogStreamSettings, pFableLog)
	{
		super(pLogStreamSettings)

		this._ShowTimeStamps = pLogStreamSettings.hasOwnProperty('ShowTimeStamps') ? (pLogStreamSettings.ShowTimeStamps == true) : false;
		this._FormattedTimeStamps = pLogStreamSettings.hasOwnProperty('FormattedTimeStamps') ? (pLogStreamSettings.FormattedTimeStamps == true) : false;

		this._ContextMessage = pLogStreamSettings.hasOwnProperty('Context') ? ` (${pLogStreamSettings.Context})` : 
								pFableLog._Settings.hasOwnProperty('Product') ? ` (${pFableLog._Settings.Product})` :
								'';
	}

	write(pLevel, pLogText, pObject)
	{
		if (this._ShowTimeStamps && this._FormattedTimeStamps)
		{
			let tmpDate = (new Date()).toISOString();
			console.log(`${tmpDate} [${pLevel}]${this._ContextMessage} ${pLogText}`);
		}
		else if (this._ShowTimeStamps)
		{
			let tmpDate = +new Date();
			console.log(`${tmpDate} [${pLevel}]${this._ContextMessage} ${pLogText}`);
		}
		else
		{
			console.log(`[${pLevel}]${this._ContextMessage} ${pLogText}`);
		}

		// Write out the object on a separate line if it is passed in
		if (typeof(pObject) !== 'undefined')
		{
			console.log(JSON.stringify(pObject, null, 4));
		}
	}

}

module.exports = ConsoleLogger;
},{"./Fable-Log-BaseLogger.js":1}],5:[function(require,module,exports){
/**
* Fable Logging Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Logger
*/

/**
* Fable Solution Log Wrapper Main Class
*
* @class FableLog
* @constructor
*/
class FableLog
{
	constructor(pFableSettings, pFable)
	{
		let tmpSettings = (typeof(pFableSettings) === 'object') ? pFableSettings : {}
		this._Settings = tmpSettings;

		this._Providers = require('./Fable-Log-DefaultProviders.js');

		this._StreamDefinitions = (tmpSettings.hasOwnProperty('LogStreams')) ? tmpSettings.LogStreams : require('./Fable-Log-DefaultStreams.json');

		this.logStreams = [];

		// This object gets decorated for one-time instantiated providers that
		//  have multiple outputs, such as bunyan.
		this.logProviders = {};

		// A hash list of the GUIDs for each log stream, so they can't be added to the set more than one time
		this.activeLogStreams = {};

		this.logStreamsTrace = [];
		this.logStreamsDebug = [];
		this.logStreamsInfo = [];
		this.logStreamsWarn = [];
		this.logStreamsError = [];
		this.logStreamsFatal = [];

		this.datumDecorator = (pDatum) => pDatum;

		this.uuid = (typeof(tmpSettings.Product) === 'string') ? tmpSettings.Product : 'Default';
	}

	addLogger(pLogger, pLevel)
	{
		// Bail out if we've already created one.
		if (this.activeLogStreams.hasOwnProperty(pLogger.loggerUUID))
		{
			return false;
		}

		// Add it to the streams and to the mutex
		this.logStreams.push(pLogger);
		this.activeLogStreams[pLogger.loggerUUID] = true;

		// Make sure a kosher level was passed in
		switch (pLevel)
		{
			case 'trace':
				this.logStreamsTrace.push(pLogger);
			case 'debug':
				this.logStreamsDebug.push(pLogger);
			case 'info':
				this.logStreamsInfo.push(pLogger);
			case 'warn':
				this.logStreamsWarn.push(pLogger);
			case 'error':
				this.logStreamsError.push(pLogger);
			case 'fatal':
				this.logStreamsFatal.push(pLogger);
				break;
		}

		return true;
	}

	setDatumDecorator(fDatumDecorator)
	{
		if (typeof(fDatumDecorator) === 'function')
		{
			this.datumDecorator = fDatumDecorator;
		}
		else
		{
			this.datumDecorator = (pDatum) => pDatum;
		}
	}

	trace(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsTrace.length; i++)
		{
			this.logStreamsTrace[i].trace(pMessage, tmpDecoratedDatum);
		}
	}

	debug(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsDebug.length; i++)
		{
			this.logStreamsDebug[i].debug(pMessage, tmpDecoratedDatum);
		}
	}

	info(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsInfo.length; i++)
		{
			this.logStreamsInfo[i].info(pMessage, tmpDecoratedDatum);
		}
	}

	warn(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsWarn.length; i++)
		{
			this.logStreamsWarn[i].warn(pMessage, tmpDecoratedDatum);
		}
	}

	error(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsError.length; i++)
		{
			this.logStreamsError[i].error(pMessage, tmpDecoratedDatum);
		}
	}

	fatal(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsFatal.length; i++)
		{
			this.logStreamsFatal[i].fatal(pMessage, tmpDecoratedDatum);
		}
	}

	initialize()
	{
		// "initialize" each logger as defined in the logging parameters
		for (let i = 0; i < this._StreamDefinitions.length; i++)
		{
			let tmpStreamDefinition = Object.assign({loggertype:'default',streamtype:'console',level:'info'},this._StreamDefinitions[i]);

			if (!this._Providers.hasOwnProperty(tmpStreamDefinition.loggertype))
			{
				console.log(`Error initializing log stream: bad loggertype in stream definition ${JSON.stringify(tmpStreamDefinition)}`);
			}
			else
			{
				this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);
			}
		}

		// Now initialize each one.
		for (let i = 0; i < this.logStreams.length; i++)
		{
			this.logStreams[i].initialize();
		}
	}

	logTime(pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time';
		let tmpTime = new Date();
		this.info(`${tmpMessage} ${tmpTime} (epoch ${+tmpTime})`, pDatum);
	}

	// Get a timestamp
	getTimeStamp()
	{
		return +new Date();
	}

	getTimeDelta(pTimeStamp)
	{
		let tmpEndTime = +new Date();
		return tmpEndTime-pTimeStamp;
	}

	// Log the delta between a timestamp, and now with a message
	logTimeDelta(pTimeDelta, pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';
		let tmpDatum = (typeof(pDatum) === 'object') ? pDatum : {};

		let tmpEndTime = +new Date();

		this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms)`, pDatum);
	}

	logTimeDeltaHuman(pTimeDelta, pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';

		let tmpEndTime = +new Date();

		let tmpMs = parseInt(pTimeDelta%1000);
		let tmpSeconds = parseInt((pTimeDelta/1000)%60);
		let tmpMinutes = parseInt((pTimeDelta/(1000*60))%60);
		let tmpHours = parseInt(pTimeDelta/(1000*60*60));

		tmpMs = (tmpMs < 10) ? "00"+tmpMs : (tmpMs < 100) ? "0"+tmpMs : tmpMs;
		tmpSeconds = (tmpSeconds < 10) ? "0"+tmpSeconds : tmpSeconds;
		tmpMinutes = (tmpMinutes < 10) ? "0"+tmpMinutes : tmpMinutes;
		tmpHours = (tmpHours < 10) ? "0"+tmpHours : tmpHours;

		this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms) or (${tmpHours}:${tmpMinutes}:${tmpSeconds}.${tmpMs})`, pDatum);
	}

	logTimeDeltaRelative(pStartTime, pMessage, pDatum)
	{
		this.logTimeDelta(this.getTimeDelta(pStartTime), pMessage, pDatum);
	}

	logTimeDeltaRelativeHuman(pStartTime, pMessage, pDatum)
	{
		this.logTimeDeltaHuman(this.getTimeDelta(pStartTime), pMessage, pDatum);
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableLog(pSettings);
}


module.exports = {new:autoConstruct, FableLog:FableLog};

},{"./Fable-Log-DefaultProviders.js":2,"./Fable-Log-DefaultStreams.json":3}],6:[function(require,module,exports){
module.exports={
	"Product": "ApplicationNameHere",
	"ProductVersion": "0.0.0",

	"ConfigFile": false,

	"LogStreams":
	[
		{
			"level": "trace"
		}
	]
}

},{}],7:[function(require,module,exports){
(function (process){(function (){
/**
* Fable Settings Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/

// needed since String.matchAll wasn't added to node until v12
const libMatchAll = require('match-all');

/**
* Fable Solution Settings
*
* @class FableSettings
* @constructor
*/

class FableSettings
{
	constructor(pFableSettings)
	{
		this.default = this.buildDefaultSettings();

		// Construct a new settings object
		let tmpSettings = this.merge(pFableSettings, this.buildDefaultSettings());

		// default environment variable templating to on
		this._PerformEnvTemplating = !tmpSettings || tmpSettings.NoEnvReplacement !== true;

		// The base settings object (what they were on initialization, before other actors have altered them)
		this.base = JSON.parse(JSON.stringify(tmpSettings));

		if (tmpSettings.DefaultConfigFile)
		{
			try
			{
				// If there is a DEFAULT configuration file, try to load and merge it.
				tmpSettings = this.merge(require(tmpSettings.DefaultConfigFile), tmpSettings);
			}
			catch (pException)
			{
				// Why this?  Often for an app we want settings to work out of the box, but
				// would potentially want to have a config file for complex settings.
				console.log('Fable-Settings Warning: Default configuration file specified but there was a problem loading it.  Falling back to base.');
				console.log('     Loading Exception: '+pException);
			}
		}

		if (tmpSettings.ConfigFile)
		{
			try
			{
				// If there is a configuration file, try to load and merge it.
				tmpSettings = this.merge(require(tmpSettings.ConfigFile), tmpSettings);
			}
			catch (pException)
			{
				// Why this?  Often for an app we want settings to work out of the box, but
				// would potentially want to have a config file for complex settings.
				console.log('Fable-Settings Warning: Configuration file specified but there was a problem loading it.  Falling back to base.');
				console.log('     Loading Exception: '+pException);
			}
		}

		this.settings = tmpSettings;
	}

	// Build a default settings object.  Use the JSON jimmy to ensure it is always a new object.
	buildDefaultSettings()
	{
		return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')));
	}


	// Resolve (recursive) any environment variables found in settings object.
	_resolveEnv(pSettings)
	{
		for (const tmpKey in pSettings)
		{
			const tmpValue = pSettings[tmpKey];
			if (typeof(tmpValue) === 'object') // && !Array.isArray(tmpValue))
			{
				this._resolveEnv(tmpValue);
			}
			else if (typeof(tmpValue) === 'string')
			{
				if (tmpValue.indexOf('${') >= 0)
				{
					//pick out and resolve env constiables from the settings value.
					const tmpMatches = libMatchAll(tmpValue, /\$\{(.*?)\}/g).toArray();
					tmpMatches.forEach((tmpMatch) =>
					{
						//format: VAR_NAME|DEFAULT_VALUE
						const tmpParts = tmpMatch.split('|');
						let tmpResolvedValue = process.env[tmpParts[0]] || '';
						if (!tmpResolvedValue && tmpParts.length > 1)
						{
							tmpResolvedValue = tmpParts[1];
						}

						pSettings[tmpKey] = pSettings[tmpKey].replace('${' + tmpMatch + '}', tmpResolvedValue);
					});
				}
			}
		}
	}

	/**
	 * Check to see if a value is an object (but not an array).
	 */
	_isObject(value)
	{
		return typeof(value) === 'object' && !Array.isArray(value);
	}

	/**
	 * Merge two plain objects. Keys that are objects in both will be merged property-wise.
	 */
	_deepMergeObjects(toObject, fromObject)
	{
		if (!fromObject || !this._isObject(fromObject))
		{
			return;
		}
		Object.keys(fromObject).forEach((key) =>
		{
			const fromValue = fromObject[key];
			if (this._isObject(fromValue))
			{
				const toValue = toObject[key];
				if (toValue && this._isObject(toValue))
				{
					// both are objects, so do a recursive merge
					this._deepMergeObjects(toValue, fromValue);
					return;
				}
			}
			toObject[key] = fromValue;
		});
		return toObject;
	}

	// Merge some new object into the existing settings.
	merge(pSettingsFrom, pSettingsTo)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};
		// Default to the settings object if none is passed in for the merge.
		let tmpSettingsTo = (typeof(pSettingsTo) === 'object') ? pSettingsTo : this.settings;

		// do not mutate the From object property values
		let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));
		tmpSettingsTo = this._deepMergeObjects(tmpSettingsTo, tmpSettingsFromCopy);

		if (this._PerformEnvTemplating)
		{
			this._resolveEnv(tmpSettingsTo);
		}

		return tmpSettingsTo;
	}

	// Fill in settings gaps without overwriting settings that are already there
	fill(pSettingsFrom)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};

		// do not mutate the From object property values
		let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));

		this.settings = this._deepMergeObjects(tmpSettingsFromCopy, this.settings);

		return this.settings;
	}
};

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableSettings(pSettings);
}

module.exports = {new:autoConstruct, FableSettings:FableSettings};

}).call(this)}).call(this,require('_process'))

},{"./Fable-Settings-Default":6,"_process":11,"match-all":10}],8:[function(require,module,exports){
/**
* Random Byte Generator - Browser version
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
class RandomBytes
{
	constructor()
	{

		// getRandomValues needs to be invoked in a context where "this" is a Crypto
		// implementation. Also, find the complete implementation of crypto on IE11.
		this.getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      		(typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));
	}

	// WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	generateWhatWGBytes()
	{
		let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

		this.getRandomValues(tmpBuffer);
		return tmpBuffer;
	}

	// Math.random()-based (RNG)
	generateRandomBytes()
	{
		// If all else fails, use Math.random().  It's fast, but is of unspecified
		// quality.
		let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

		for (let i = 0, tmpValue; i < 16; i++)
		{
			if ((i & 0x03) === 0)
			{
				tmpValue = Math.random() * 0x100000000;
			}

			tmpBuffer[i] = tmpValue >>> ((i & 0x03) << 3) & 0xff;
		}

		return tmpBuffer;
	}

	generate()
	{
		if (this.getRandomValues)
		{
			return this.generateWhatWGBytes();
		}
		else
		{
			return this.generateRandomBytes();
		}
	}
}

module.exports = RandomBytes;

},{}],9:[function(require,module,exports){
/**
* Fable UUID Generator
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable UUID
*/

/**
* Fable Solution UUID Generation Main Class
*
* @class FableUUID
* @constructor
*/

var libRandomByteGenerator = require('./Fable-UUID-Random.js')

class FableUUID
{
	constructor(pSettings)
	{
		// Determine if the module is in "Random UUID Mode" which means just use the random character function rather than the v4 random UUID spec.
		// Note this allows UUIDs of various lengths (including very short ones) although guaranteed uniqueness goes downhill fast.
		this._UUIDModeRandom = (typeof(pSettings) === 'object') && (pSettings.hasOwnProperty('UUIDModeRandom')) ? (pSettings.UUIDModeRandom == true) : false;
		// These two properties are only useful if we are in Random mode.  Otherwise it generates a v4 spec
		// Length for "Random UUID Mode" is set -- if not set it to 8
		this._UUIDLength = (typeof(pSettings) === 'object') && (pSettings.hasOwnProperty('UUIDLength')) ? (pSettings.UUIDLength + 0) : 8;
		// Dictionary for "Random UUID Mode"
		this._UUIDRandomDictionary = (typeof(pSettings) === 'object') && (pSettings.hasOwnProperty('UUIDDictionary')) ? (pSettings.UUIDDictionary + 0) : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

		this.randomByteGenerator = new libRandomByteGenerator();

		// Lookup table for hex codes
		this._HexLookup = [];
		for (let i = 0; i < 256; ++i)
		{
			this._HexLookup[i] = (i + 0x100).toString(16).substr(1);
		}
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	bytesToUUID(pBuffer)
	{
		let i = 0;
		// join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
		return ([
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], 
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]]
				]).join('');
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	generateUUIDv4()
	{
		let tmpBuffer = new Array(16);
		var tmpRandomBytes = this.randomByteGenerator.generate();

		// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
		tmpRandomBytes[6] = (tmpRandomBytes[6] & 0x0f) | 0x40;
		tmpRandomBytes[8] = (tmpRandomBytes[8] & 0x3f) | 0x80;

		return this.bytesToUUID(tmpRandomBytes);
	}

	// Simple random UUID generation
	generateRandom()
	{
		let tmpUUID = '';

		for (let i = 0; i < this._UUIDLength; i++)
		{
			tmpUUID += this._UUIDRandomDictionary.charAt(Math.floor(Math.random() * (this._UUIDRandomDictionary.length-1)));
		}

		return tmpUUID;
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	getUUID()
	{
		if (this._UUIDModeRandom)
		{
			return this.generateRandom();
		}
		else
		{
			return this.generateUUIDv4();
		}
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableUUID(pSettings);
}


module.exports = {new:autoConstruct, FableUUID:FableUUID};

},{"./Fable-UUID-Random.js":8}],10:[function(require,module,exports){
"use strict";

/**
 * matchAll
 * Get all the matches for a regular expression in a string.
 *
 * @name matchAll
 * @function
 * @param {String} s The input string.
 * @param {RegExp} r The regular expression.
 * @return {Object} An object containing the following fields:
 *
 *  - `input` (String): The input string.
 *  - `regex` (RegExp): The regular expression.
 *  - `next` (Function): Get the next match.
 *  - `toArray` (Function): Get all the matches.
 *  - `reset` (Function): Reset the index.
 */
module.exports = function matchAll(s, r) {
    return {
        input: s,
        regex: r

        /**
         * next
         * Get the next match in single group match.
         *
         * @name next
         * @function
         * @return {String|null} The matched snippet.
         */
        , next: function next() {
            var c = this.nextRaw();
            if (c) {
                for (var i = 1; i < c.length; i++) {
                    if (c[i]) {
                        return c[i];
                    }
                }
            }
            return null;
        }

        /**
         * nextRaw
         * Get the next match in raw regex output. Usefull to get another group match.
         *
         * @name nextRaw
         * @function
         * @returns {Array|null} The matched snippet
         */
        ,
        nextRaw: function nextRaw() {
            var c = this.regex.exec(this.input);
            return c;
        }

        /**
         * toArray
         * Get all the matches.
         *
         * @name toArray
         * @function
         * @return {Array} The matched snippets.
         */
        ,
        toArray: function toArray() {
            var res = [],
                c = null;

            while (c = this.next()) {
                res.push(c);
            }

            return res;
        }

        /**
         * reset
         * Reset the index.
         *
         * @name reset
         * @function
         * @param {Number} i The new index (default: `0`).
         * @return {Number} The new index.
         */
        ,
        reset: function reset(i) {
            return this.regex.lastIndex = i || 0;
        }
    };
};
},{}],11:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
const libFableSettings = require('fable-settings').FableSettings;
const libFableUUID = require('fable-uuid').FableUUID;
const libFableLog = require('fable-log').FableLog;


/**
* Fable Application Services Support Library
*
* @class Fable
*/
class Fable
{
	constructor(pSettings)
	{
		let tmpSettings = new libFableSettings(pSettings);

		this.settingsManager = tmpSettings;

		// Instantiate the UUID generator
		this.libUUID = new libFableUUID(this.settingsManager.settings);

		this.log = new libFableLog(this.settingsManager.settings);
		this.log.initialize();
	}

	get settings()
	{
		return this.settingsManager.settings;
	}

	get fable()
	{
		return this;
	}

	getUUID()
	{
		return this.libUUID.getUUID();
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new Fable(pSettings);
}

module.exports = {new:autoConstruct, Fable:Fable};
},{"fable-log":5,"fable-settings":7,"fable-uuid":9}]},{},[12])(12)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmFibGUtbG9nL3NvdXJjZS9GYWJsZS1Mb2ctQmFzZUxvZ2dlci5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS1sb2cvc291cmNlL0ZhYmxlLUxvZy1EZWZhdWx0UHJvdmlkZXJzLUJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZmFibGUtbG9nL3NvdXJjZS9GYWJsZS1Mb2ctRGVmYXVsdFN0cmVhbXMuanNvbiIsIm5vZGVfbW9kdWxlcy9mYWJsZS1sb2cvc291cmNlL0ZhYmxlLUxvZy1Mb2dnZXItQ29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS1sb2cvc291cmNlL0ZhYmxlLUxvZy5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS1zZXR0aW5ncy9zb3VyY2UvRmFibGUtU2V0dGluZ3MtRGVmYXVsdC5qc29uIiwibm9kZV9tb2R1bGVzL2ZhYmxlLXNldHRpbmdzL3NvdXJjZS9GYWJsZS1TZXR0aW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS11dWlkL3NvdXJjZS9GYWJsZS1VVUlELVJhbmRvbS1Ccm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2ZhYmxlLXV1aWQvc291cmNlL0ZhYmxlLVVVSUQuanMiLCJub2RlX21vZHVsZXMvbWF0Y2gtYWxsL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzb3VyY2UvRmFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuKiBCYXNlIExvZ2dlciBDbGFzc1xuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5jb25zdCBsaWJGYWJsZVVVSUQgPSBuZXcgKHJlcXVpcmUoJ2ZhYmxlLXV1aWQnKS5GYWJsZVVVSUQpKCk7XG5cbmNsYXNzIEJhc2VMb2dnZXJcbntcblx0Y29uc3RydWN0b3IocExvZ1N0cmVhbVNldHRpbmdzLCBwRmFibGVMb2cpXG5cdHtcblx0XHQvLyBUaGlzIHNob3VsZCBub3QgcG9zc2libHkgYmUgYWJsZSB0byBiZSBpbnN0YW50aWF0ZWQgd2l0aG91dCBhIHNldHRpbmdzIG9iamVjdFxuXHRcdHRoaXMuX1NldHRpbmdzID0gcExvZ1N0cmVhbVNldHRpbmdzO1xuXHRcdFxuXHRcdC8vIFRoZSBiYXNlIGxvZ2dlciBkb2VzIG5vdGhpbmcgYnV0IGFzc29jaWF0ZSBhIFVVSUQgd2l0aCBpdHNlbGZcblx0XHR0aGlzLmxvZ2dlclVVSUQgPSBsaWJGYWJsZVVVSUQuZ2V0VVVJRCgpO1xuXHR9XG5cblx0aW5pdGlhbGl6ZSgpXG5cdHtcblx0XHQvLyBObyBvcGVyYXRpb24uXG5cdH1cblxuXHR0cmFjZShwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJ0cmFjZVwiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHRkZWJ1ZyhwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJkZWJ1Z1wiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHRpbmZvKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImluZm9cIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0d2FybihwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJ3YXJuXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdGVycm9yKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImVycm9yXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdGZhdGFsKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImZhdGFsXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdHdyaXRlKHBMb2dMZXZlbCwgcExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHQvLyBUaGUgYmFzZSBsb2dnZXIgZG9lcyBub3RoaW5nLlxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUxvZ2dlcjtcbiIsIi8qKlxuKiBEZWZhdWx0IExvZ2dlciBQcm92aWRlciBGdW5jdGlvbiAtLS0gQnJvd3NlclxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8vIFJldHVybiB0aGUgcHJvdmlkZXJzIHRoYXQgYXJlIGF2YWlsYWJsZSB3aXRob3V0IGV4dGVuc2lvbnMgbG9hZGVkXG5nZXREZWZhdWx0UHJvdmlkZXJzID0gKCkgPT5cbntcblx0bGV0IHRtcERlZmF1bHRQcm92aWRlcnMgPSB7fTtcblxuXHR0bXBEZWZhdWx0UHJvdmlkZXJzLmNvbnNvbGUgPSByZXF1aXJlKCcuL0ZhYmxlLUxvZy1Mb2dnZXItQ29uc29sZS5qcycpO1xuXHR0bXBEZWZhdWx0UHJvdmlkZXJzLmRlZmF1bHQgPSB0bXBEZWZhdWx0UHJvdmlkZXJzLmNvbnNvbGU7XG5cblx0cmV0dXJuIHRtcERlZmF1bHRQcm92aWRlcnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGVmYXVsdFByb3ZpZGVycygpOyIsIm1vZHVsZS5leHBvcnRzPVtcbiAgICB7XG4gICAgICAgIFwibG9nZ2VydHlwZVwiOiBcImNvbnNvbGVcIixcbiAgICAgICAgXCJzdHJlYW10eXBlXCI6IFwiY29uc29sZVwiLFxuICAgICAgICBcImxldmVsXCI6IFwidHJhY2VcIlxuICAgIH1cbl0iLCJsZXQgbGliQmFzZUxvZ2dlciA9IHJlcXVpcmUoJy4vRmFibGUtTG9nLUJhc2VMb2dnZXIuanMnKTtcblxuY2xhc3MgQ29uc29sZUxvZ2dlciBleHRlbmRzIGxpYkJhc2VMb2dnZXJcbntcblx0Y29uc3RydWN0b3IocExvZ1N0cmVhbVNldHRpbmdzLCBwRmFibGVMb2cpXG5cdHtcblx0XHRzdXBlcihwTG9nU3RyZWFtU2V0dGluZ3MpXG5cblx0XHR0aGlzLl9TaG93VGltZVN0YW1wcyA9IHBMb2dTdHJlYW1TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnU2hvd1RpbWVTdGFtcHMnKSA/IChwTG9nU3RyZWFtU2V0dGluZ3MuU2hvd1RpbWVTdGFtcHMgPT0gdHJ1ZSkgOiBmYWxzZTtcblx0XHR0aGlzLl9Gb3JtYXR0ZWRUaW1lU3RhbXBzID0gcExvZ1N0cmVhbVNldHRpbmdzLmhhc093blByb3BlcnR5KCdGb3JtYXR0ZWRUaW1lU3RhbXBzJykgPyAocExvZ1N0cmVhbVNldHRpbmdzLkZvcm1hdHRlZFRpbWVTdGFtcHMgPT0gdHJ1ZSkgOiBmYWxzZTtcblxuXHRcdHRoaXMuX0NvbnRleHRNZXNzYWdlID0gcExvZ1N0cmVhbVNldHRpbmdzLmhhc093blByb3BlcnR5KCdDb250ZXh0JykgPyBgICgke3BMb2dTdHJlYW1TZXR0aW5ncy5Db250ZXh0fSlgIDogXG5cdFx0XHRcdFx0XHRcdFx0cEZhYmxlTG9nLl9TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnUHJvZHVjdCcpID8gYCAoJHtwRmFibGVMb2cuX1NldHRpbmdzLlByb2R1Y3R9KWAgOlxuXHRcdFx0XHRcdFx0XHRcdCcnO1xuXHR9XG5cblx0d3JpdGUocExldmVsLCBwTG9nVGV4dCwgcE9iamVjdClcblx0e1xuXHRcdGlmICh0aGlzLl9TaG93VGltZVN0YW1wcyAmJiB0aGlzLl9Gb3JtYXR0ZWRUaW1lU3RhbXBzKVxuXHRcdHtcblx0XHRcdGxldCB0bXBEYXRlID0gKG5ldyBEYXRlKCkpLnRvSVNPU3RyaW5nKCk7XG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0bXBEYXRlfSBbJHtwTGV2ZWx9XSR7dGhpcy5fQ29udGV4dE1lc3NhZ2V9ICR7cExvZ1RleHR9YCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRoaXMuX1Nob3dUaW1lU3RhbXBzKVxuXHRcdHtcblx0XHRcdGxldCB0bXBEYXRlID0gK25ldyBEYXRlKCk7XG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0bXBEYXRlfSBbJHtwTGV2ZWx9XSR7dGhpcy5fQ29udGV4dE1lc3NhZ2V9ICR7cExvZ1RleHR9YCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhgWyR7cExldmVsfV0ke3RoaXMuX0NvbnRleHRNZXNzYWdlfSAke3BMb2dUZXh0fWApO1xuXHRcdH1cblxuXHRcdC8vIFdyaXRlIG91dCB0aGUgb2JqZWN0IG9uIGEgc2VwYXJhdGUgbGluZSBpZiBpdCBpcyBwYXNzZWQgaW5cblx0XHRpZiAodHlwZW9mKHBPYmplY3QpICE9PSAndW5kZWZpbmVkJylcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwT2JqZWN0LCBudWxsLCA0KSk7XG5cdFx0fVxuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25zb2xlTG9nZ2VyOyIsIi8qKlxuKiBGYWJsZSBMb2dnaW5nIEFkZC1vblxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiogQG1vZHVsZSBGYWJsZSBMb2dnZXJcbiovXG5cbi8qKlxuKiBGYWJsZSBTb2x1dGlvbiBMb2cgV3JhcHBlciBNYWluIENsYXNzXG4qXG4qIEBjbGFzcyBGYWJsZUxvZ1xuKiBAY29uc3RydWN0b3JcbiovXG5jbGFzcyBGYWJsZUxvZ1xue1xuXHRjb25zdHJ1Y3RvcihwRmFibGVTZXR0aW5ncywgcEZhYmxlKVxuXHR7XG5cdFx0bGV0IHRtcFNldHRpbmdzID0gKHR5cGVvZihwRmFibGVTZXR0aW5ncykgPT09ICdvYmplY3QnKSA/IHBGYWJsZVNldHRpbmdzIDoge31cblx0XHR0aGlzLl9TZXR0aW5ncyA9IHRtcFNldHRpbmdzO1xuXG5cdFx0dGhpcy5fUHJvdmlkZXJzID0gcmVxdWlyZSgnLi9GYWJsZS1Mb2ctRGVmYXVsdFByb3ZpZGVycy5qcycpO1xuXG5cdFx0dGhpcy5fU3RyZWFtRGVmaW5pdGlvbnMgPSAodG1wU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ0xvZ1N0cmVhbXMnKSkgPyB0bXBTZXR0aW5ncy5Mb2dTdHJlYW1zIDogcmVxdWlyZSgnLi9GYWJsZS1Mb2ctRGVmYXVsdFN0cmVhbXMuanNvbicpO1xuXG5cdFx0dGhpcy5sb2dTdHJlYW1zID0gW107XG5cblx0XHQvLyBUaGlzIG9iamVjdCBnZXRzIGRlY29yYXRlZCBmb3Igb25lLXRpbWUgaW5zdGFudGlhdGVkIHByb3ZpZGVycyB0aGF0XG5cdFx0Ly8gIGhhdmUgbXVsdGlwbGUgb3V0cHV0cywgc3VjaCBhcyBidW55YW4uXG5cdFx0dGhpcy5sb2dQcm92aWRlcnMgPSB7fTtcblxuXHRcdC8vIEEgaGFzaCBsaXN0IG9mIHRoZSBHVUlEcyBmb3IgZWFjaCBsb2cgc3RyZWFtLCBzbyB0aGV5IGNhbid0IGJlIGFkZGVkIHRvIHRoZSBzZXQgbW9yZSB0aGFuIG9uZSB0aW1lXG5cdFx0dGhpcy5hY3RpdmVMb2dTdHJlYW1zID0ge307XG5cblx0XHR0aGlzLmxvZ1N0cmVhbXNUcmFjZSA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc0RlYnVnID0gW107XG5cdFx0dGhpcy5sb2dTdHJlYW1zSW5mbyA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc1dhcm4gPSBbXTtcblx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvciA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc0ZhdGFsID0gW107XG5cblx0XHR0aGlzLmRhdHVtRGVjb3JhdG9yID0gKHBEYXR1bSkgPT4gcERhdHVtO1xuXG5cdFx0dGhpcy51dWlkID0gKHR5cGVvZih0bXBTZXR0aW5ncy5Qcm9kdWN0KSA9PT0gJ3N0cmluZycpID8gdG1wU2V0dGluZ3MuUHJvZHVjdCA6ICdEZWZhdWx0Jztcblx0fVxuXG5cdGFkZExvZ2dlcihwTG9nZ2VyLCBwTGV2ZWwpXG5cdHtcblx0XHQvLyBCYWlsIG91dCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgb25lLlxuXHRcdGlmICh0aGlzLmFjdGl2ZUxvZ1N0cmVhbXMuaGFzT3duUHJvcGVydHkocExvZ2dlci5sb2dnZXJVVUlEKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIGl0IHRvIHRoZSBzdHJlYW1zIGFuZCB0byB0aGUgbXV0ZXhcblx0XHR0aGlzLmxvZ1N0cmVhbXMucHVzaChwTG9nZ2VyKTtcblx0XHR0aGlzLmFjdGl2ZUxvZ1N0cmVhbXNbcExvZ2dlci5sb2dnZXJVVUlEXSA9IHRydWU7XG5cblx0XHQvLyBNYWtlIHN1cmUgYSBrb3NoZXIgbGV2ZWwgd2FzIHBhc3NlZCBpblxuXHRcdHN3aXRjaCAocExldmVsKVxuXHRcdHtcblx0XHRcdGNhc2UgJ3RyYWNlJzpcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zVHJhY2UucHVzaChwTG9nZ2VyKTtcblx0XHRcdGNhc2UgJ2RlYnVnJzpcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zRGVidWcucHVzaChwTG9nZ2VyKTtcblx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNJbmZvLnB1c2gocExvZ2dlcik7XG5cdFx0XHRjYXNlICd3YXJuJzpcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zV2Fybi5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvci5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnZmF0YWwnOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNGYXRhbC5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHNldERhdHVtRGVjb3JhdG9yKGZEYXR1bURlY29yYXRvcilcblx0e1xuXHRcdGlmICh0eXBlb2YoZkRhdHVtRGVjb3JhdG9yKSA9PT0gJ2Z1bmN0aW9uJylcblx0XHR7XG5cdFx0XHR0aGlzLmRhdHVtRGVjb3JhdG9yID0gZkRhdHVtRGVjb3JhdG9yO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5kYXR1bURlY29yYXRvciA9IChwRGF0dW0pID0+IHBEYXR1bTtcblx0XHR9XG5cdH1cblxuXHR0cmFjZShwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Y29uc3QgdG1wRGVjb3JhdGVkRGF0dW0gPSB0aGlzLmRhdHVtRGVjb3JhdG9yKHBEYXR1bSk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNUcmFjZS5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNUcmFjZVtpXS50cmFjZShwTWVzc2FnZSwgdG1wRGVjb3JhdGVkRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGRlYnVnKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRjb25zdCB0bXBEZWNvcmF0ZWREYXR1bSA9IHRoaXMuZGF0dW1EZWNvcmF0b3IocERhdHVtKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc0RlYnVnLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0RlYnVnW2ldLmRlYnVnKHBNZXNzYWdlLCB0bXBEZWNvcmF0ZWREYXR1bSk7XG5cdFx0fVxuXHR9XG5cblx0aW5mbyhwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Y29uc3QgdG1wRGVjb3JhdGVkRGF0dW0gPSB0aGlzLmRhdHVtRGVjb3JhdG9yKHBEYXR1bSk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNJbmZvLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0luZm9baV0uaW5mbyhwTWVzc2FnZSwgdG1wRGVjb3JhdGVkRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdHdhcm4ocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGNvbnN0IHRtcERlY29yYXRlZERhdHVtID0gdGhpcy5kYXR1bURlY29yYXRvcihwRGF0dW0pO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dTdHJlYW1zV2Fybi5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNXYXJuW2ldLndhcm4ocE1lc3NhZ2UsIHRtcERlY29yYXRlZERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRlcnJvcihwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Y29uc3QgdG1wRGVjb3JhdGVkRGF0dW0gPSB0aGlzLmRhdHVtRGVjb3JhdG9yKHBEYXR1bSk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNFcnJvci5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvcltpXS5lcnJvcihwTWVzc2FnZSwgdG1wRGVjb3JhdGVkRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGZhdGFsKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRjb25zdCB0bXBEZWNvcmF0ZWREYXR1bSA9IHRoaXMuZGF0dW1EZWNvcmF0b3IocERhdHVtKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc0ZhdGFsLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0ZhdGFsW2ldLmZhdGFsKHBNZXNzYWdlLCB0bXBEZWNvcmF0ZWREYXR1bSk7XG5cdFx0fVxuXHR9XG5cblx0aW5pdGlhbGl6ZSgpXG5cdHtcblx0XHQvLyBcImluaXRpYWxpemVcIiBlYWNoIGxvZ2dlciBhcyBkZWZpbmVkIGluIHRoZSBsb2dnaW5nIHBhcmFtZXRlcnNcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX1N0cmVhbURlZmluaXRpb25zLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGxldCB0bXBTdHJlYW1EZWZpbml0aW9uID0gT2JqZWN0LmFzc2lnbih7bG9nZ2VydHlwZTonZGVmYXVsdCcsc3RyZWFtdHlwZTonY29uc29sZScsbGV2ZWw6J2luZm8nfSx0aGlzLl9TdHJlYW1EZWZpbml0aW9uc1tpXSk7XG5cblx0XHRcdGlmICghdGhpcy5fUHJvdmlkZXJzLmhhc093blByb3BlcnR5KHRtcFN0cmVhbURlZmluaXRpb24ubG9nZ2VydHlwZSkpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBFcnJvciBpbml0aWFsaXppbmcgbG9nIHN0cmVhbTogYmFkIGxvZ2dlcnR5cGUgaW4gc3RyZWFtIGRlZmluaXRpb24gJHtKU09OLnN0cmluZ2lmeSh0bXBTdHJlYW1EZWZpbml0aW9uKX1gKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5hZGRMb2dnZXIobmV3IHRoaXMuX1Byb3ZpZGVyc1t0bXBTdHJlYW1EZWZpbml0aW9uLmxvZ2dlcnR5cGVdKHRtcFN0cmVhbURlZmluaXRpb24sIHRoaXMpLCB0bXBTdHJlYW1EZWZpbml0aW9uLmxldmVsKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBOb3cgaW5pdGlhbGl6ZSBlYWNoIG9uZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtcy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNbaV0uaW5pdGlhbGl6ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGxvZ1RpbWUocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGxldCB0bXBNZXNzYWdlID0gKHR5cGVvZihwTWVzc2FnZSkgIT09ICd1bmRlZmluZWQnKSA/IHBNZXNzYWdlIDogJ1RpbWUnO1xuXHRcdGxldCB0bXBUaW1lID0gbmV3IERhdGUoKTtcblx0XHR0aGlzLmluZm8oYCR7dG1wTWVzc2FnZX0gJHt0bXBUaW1lfSAoZXBvY2ggJHsrdG1wVGltZX0pYCwgcERhdHVtKTtcblx0fVxuXG5cdC8vIEdldCBhIHRpbWVzdGFtcFxuXHRnZXRUaW1lU3RhbXAoKVxuXHR7XG5cdFx0cmV0dXJuICtuZXcgRGF0ZSgpO1xuXHR9XG5cblx0Z2V0VGltZURlbHRhKHBUaW1lU3RhbXApXG5cdHtcblx0XHRsZXQgdG1wRW5kVGltZSA9ICtuZXcgRGF0ZSgpO1xuXHRcdHJldHVybiB0bXBFbmRUaW1lLXBUaW1lU3RhbXA7XG5cdH1cblxuXHQvLyBMb2cgdGhlIGRlbHRhIGJldHdlZW4gYSB0aW1lc3RhbXAsIGFuZCBub3cgd2l0aCBhIG1lc3NhZ2Vcblx0bG9nVGltZURlbHRhKHBUaW1lRGVsdGEsIHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRsZXQgdG1wTWVzc2FnZSA9ICh0eXBlb2YocE1lc3NhZ2UpICE9PSAndW5kZWZpbmVkJykgPyBwTWVzc2FnZSA6ICdUaW1lIE1lYXN1cmVtZW50Jztcblx0XHRsZXQgdG1wRGF0dW0gPSAodHlwZW9mKHBEYXR1bSkgPT09ICdvYmplY3QnKSA/IHBEYXR1bSA6IHt9O1xuXG5cdFx0bGV0IHRtcEVuZFRpbWUgPSArbmV3IERhdGUoKTtcblxuXHRcdHRoaXMuaW5mbyhgJHt0bXBNZXNzYWdlfSBsb2dnZWQgYXQgKGVwb2NoICR7K3RtcEVuZFRpbWV9KSB0b29rICgke3BUaW1lRGVsdGF9bXMpYCwgcERhdHVtKTtcblx0fVxuXG5cdGxvZ1RpbWVEZWx0YUh1bWFuKHBUaW1lRGVsdGEsIHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRsZXQgdG1wTWVzc2FnZSA9ICh0eXBlb2YocE1lc3NhZ2UpICE9PSAndW5kZWZpbmVkJykgPyBwTWVzc2FnZSA6ICdUaW1lIE1lYXN1cmVtZW50JztcblxuXHRcdGxldCB0bXBFbmRUaW1lID0gK25ldyBEYXRlKCk7XG5cblx0XHRsZXQgdG1wTXMgPSBwYXJzZUludChwVGltZURlbHRhJTEwMDApO1xuXHRcdGxldCB0bXBTZWNvbmRzID0gcGFyc2VJbnQoKHBUaW1lRGVsdGEvMTAwMCklNjApO1xuXHRcdGxldCB0bXBNaW51dGVzID0gcGFyc2VJbnQoKHBUaW1lRGVsdGEvKDEwMDAqNjApKSU2MCk7XG5cdFx0bGV0IHRtcEhvdXJzID0gcGFyc2VJbnQocFRpbWVEZWx0YS8oMTAwMCo2MCo2MCkpO1xuXG5cdFx0dG1wTXMgPSAodG1wTXMgPCAxMCkgPyBcIjAwXCIrdG1wTXMgOiAodG1wTXMgPCAxMDApID8gXCIwXCIrdG1wTXMgOiB0bXBNcztcblx0XHR0bXBTZWNvbmRzID0gKHRtcFNlY29uZHMgPCAxMCkgPyBcIjBcIit0bXBTZWNvbmRzIDogdG1wU2Vjb25kcztcblx0XHR0bXBNaW51dGVzID0gKHRtcE1pbnV0ZXMgPCAxMCkgPyBcIjBcIit0bXBNaW51dGVzIDogdG1wTWludXRlcztcblx0XHR0bXBIb3VycyA9ICh0bXBIb3VycyA8IDEwKSA/IFwiMFwiK3RtcEhvdXJzIDogdG1wSG91cnM7XG5cblx0XHR0aGlzLmluZm8oYCR7dG1wTWVzc2FnZX0gbG9nZ2VkIGF0IChlcG9jaCAkeyt0bXBFbmRUaW1lfSkgdG9vayAoJHtwVGltZURlbHRhfW1zKSBvciAoJHt0bXBIb3Vyc306JHt0bXBNaW51dGVzfToke3RtcFNlY29uZHN9LiR7dG1wTXN9KWAsIHBEYXR1bSk7XG5cdH1cblxuXHRsb2dUaW1lRGVsdGFSZWxhdGl2ZShwU3RhcnRUaW1lLCBwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0dGhpcy5sb2dUaW1lRGVsdGEodGhpcy5nZXRUaW1lRGVsdGEocFN0YXJ0VGltZSksIHBNZXNzYWdlLCBwRGF0dW0pO1xuXHR9XG5cblx0bG9nVGltZURlbHRhUmVsYXRpdmVIdW1hbihwU3RhcnRUaW1lLCBwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0dGhpcy5sb2dUaW1lRGVsdGFIdW1hbih0aGlzLmdldFRpbWVEZWx0YShwU3RhcnRUaW1lKSwgcE1lc3NhZ2UsIHBEYXR1bSk7XG5cdH1cbn1cblxuLy8gVGhpcyBpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbmZ1bmN0aW9uIGF1dG9Db25zdHJ1Y3QocFNldHRpbmdzKVxue1xuXHRyZXR1cm4gbmV3IEZhYmxlTG9nKHBTZXR0aW5ncyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7bmV3OmF1dG9Db25zdHJ1Y3QsIEZhYmxlTG9nOkZhYmxlTG9nfTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJQcm9kdWN0XCI6IFwiQXBwbGljYXRpb25OYW1lSGVyZVwiLFxuXHRcIlByb2R1Y3RWZXJzaW9uXCI6IFwiMC4wLjBcIixcblxuXHRcIkNvbmZpZ0ZpbGVcIjogZmFsc2UsXG5cblx0XCJMb2dTdHJlYW1zXCI6XG5cdFtcblx0XHR7XG5cdFx0XHRcImxldmVsXCI6IFwidHJhY2VcIlxuXHRcdH1cblx0XVxufVxuIiwiLyoqXG4qIEZhYmxlIFNldHRpbmdzIEFkZC1vblxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiogQG1vZHVsZSBGYWJsZSBTZXR0aW5nc1xuKi9cblxuLy8gbmVlZGVkIHNpbmNlIFN0cmluZy5tYXRjaEFsbCB3YXNuJ3QgYWRkZWQgdG8gbm9kZSB1bnRpbCB2MTJcbmNvbnN0IGxpYk1hdGNoQWxsID0gcmVxdWlyZSgnbWF0Y2gtYWxsJyk7XG5cbi8qKlxuKiBGYWJsZSBTb2x1dGlvbiBTZXR0aW5nc1xuKlxuKiBAY2xhc3MgRmFibGVTZXR0aW5nc1xuKiBAY29uc3RydWN0b3JcbiovXG5cbmNsYXNzIEZhYmxlU2V0dGluZ3Ncbntcblx0Y29uc3RydWN0b3IocEZhYmxlU2V0dGluZ3MpXG5cdHtcblx0XHR0aGlzLmRlZmF1bHQgPSB0aGlzLmJ1aWxkRGVmYXVsdFNldHRpbmdzKCk7XG5cblx0XHQvLyBDb25zdHJ1Y3QgYSBuZXcgc2V0dGluZ3Mgb2JqZWN0XG5cdFx0bGV0IHRtcFNldHRpbmdzID0gdGhpcy5tZXJnZShwRmFibGVTZXR0aW5ncywgdGhpcy5idWlsZERlZmF1bHRTZXR0aW5ncygpKTtcblxuXHRcdC8vIGRlZmF1bHQgZW52aXJvbm1lbnQgdmFyaWFibGUgdGVtcGxhdGluZyB0byBvblxuXHRcdHRoaXMuX1BlcmZvcm1FbnZUZW1wbGF0aW5nID0gIXRtcFNldHRpbmdzIHx8IHRtcFNldHRpbmdzLk5vRW52UmVwbGFjZW1lbnQgIT09IHRydWU7XG5cblx0XHQvLyBUaGUgYmFzZSBzZXR0aW5ncyBvYmplY3QgKHdoYXQgdGhleSB3ZXJlIG9uIGluaXRpYWxpemF0aW9uLCBiZWZvcmUgb3RoZXIgYWN0b3JzIGhhdmUgYWx0ZXJlZCB0aGVtKVxuXHRcdHRoaXMuYmFzZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodG1wU2V0dGluZ3MpKTtcblxuXHRcdGlmICh0bXBTZXR0aW5ncy5EZWZhdWx0Q29uZmlnRmlsZSlcblx0XHR7XG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYSBERUZBVUxUIGNvbmZpZ3VyYXRpb24gZmlsZSwgdHJ5IHRvIGxvYWQgYW5kIG1lcmdlIGl0LlxuXHRcdFx0XHR0bXBTZXR0aW5ncyA9IHRoaXMubWVyZ2UocmVxdWlyZSh0bXBTZXR0aW5ncy5EZWZhdWx0Q29uZmlnRmlsZSksIHRtcFNldHRpbmdzKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChwRXhjZXB0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBXaHkgdGhpcz8gIE9mdGVuIGZvciBhbiBhcHAgd2Ugd2FudCBzZXR0aW5ncyB0byB3b3JrIG91dCBvZiB0aGUgYm94LCBidXRcblx0XHRcdFx0Ly8gd291bGQgcG90ZW50aWFsbHkgd2FudCB0byBoYXZlIGEgY29uZmlnIGZpbGUgZm9yIGNvbXBsZXggc2V0dGluZ3MuXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWJsZS1TZXR0aW5ncyBXYXJuaW5nOiBEZWZhdWx0IGNvbmZpZ3VyYXRpb24gZmlsZSBzcGVjaWZpZWQgYnV0IHRoZXJlIHdhcyBhIHByb2JsZW0gbG9hZGluZyBpdC4gIEZhbGxpbmcgYmFjayB0byBiYXNlLicpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnICAgICBMb2FkaW5nIEV4Y2VwdGlvbjogJytwRXhjZXB0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodG1wU2V0dGluZ3MuQ29uZmlnRmlsZSlcblx0XHR7XG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYSBjb25maWd1cmF0aW9uIGZpbGUsIHRyeSB0byBsb2FkIGFuZCBtZXJnZSBpdC5cblx0XHRcdFx0dG1wU2V0dGluZ3MgPSB0aGlzLm1lcmdlKHJlcXVpcmUodG1wU2V0dGluZ3MuQ29uZmlnRmlsZSksIHRtcFNldHRpbmdzKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChwRXhjZXB0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBXaHkgdGhpcz8gIE9mdGVuIGZvciBhbiBhcHAgd2Ugd2FudCBzZXR0aW5ncyB0byB3b3JrIG91dCBvZiB0aGUgYm94LCBidXRcblx0XHRcdFx0Ly8gd291bGQgcG90ZW50aWFsbHkgd2FudCB0byBoYXZlIGEgY29uZmlnIGZpbGUgZm9yIGNvbXBsZXggc2V0dGluZ3MuXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWJsZS1TZXR0aW5ncyBXYXJuaW5nOiBDb25maWd1cmF0aW9uIGZpbGUgc3BlY2lmaWVkIGJ1dCB0aGVyZSB3YXMgYSBwcm9ibGVtIGxvYWRpbmcgaXQuICBGYWxsaW5nIGJhY2sgdG8gYmFzZS4nKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJyAgICAgTG9hZGluZyBFeGNlcHRpb246ICcrcEV4Y2VwdGlvbik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXR0aW5ncyA9IHRtcFNldHRpbmdzO1xuXHR9XG5cblx0Ly8gQnVpbGQgYSBkZWZhdWx0IHNldHRpbmdzIG9iamVjdC4gIFVzZSB0aGUgSlNPTiBqaW1teSB0byBlbnN1cmUgaXQgaXMgYWx3YXlzIGEgbmV3IG9iamVjdC5cblx0YnVpbGREZWZhdWx0U2V0dGluZ3MoKVxuXHR7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVxdWlyZSgnLi9GYWJsZS1TZXR0aW5ncy1EZWZhdWx0JykpKTtcblx0fVxuXG5cblx0Ly8gUmVzb2x2ZSAocmVjdXJzaXZlKSBhbnkgZW52aXJvbm1lbnQgdmFyaWFibGVzIGZvdW5kIGluIHNldHRpbmdzIG9iamVjdC5cblx0X3Jlc29sdmVFbnYocFNldHRpbmdzKVxuXHR7XG5cdFx0Zm9yIChjb25zdCB0bXBLZXkgaW4gcFNldHRpbmdzKVxuXHRcdHtcblx0XHRcdGNvbnN0IHRtcFZhbHVlID0gcFNldHRpbmdzW3RtcEtleV07XG5cdFx0XHRpZiAodHlwZW9mKHRtcFZhbHVlKSA9PT0gJ29iamVjdCcpIC8vICYmICFBcnJheS5pc0FycmF5KHRtcFZhbHVlKSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5fcmVzb2x2ZUVudih0bXBWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YodG1wVmFsdWUpID09PSAnc3RyaW5nJylcblx0XHRcdHtcblx0XHRcdFx0aWYgKHRtcFZhbHVlLmluZGV4T2YoJyR7JykgPj0gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vcGljayBvdXQgYW5kIHJlc29sdmUgZW52IGNvbnN0aWFibGVzIGZyb20gdGhlIHNldHRpbmdzIHZhbHVlLlxuXHRcdFx0XHRcdGNvbnN0IHRtcE1hdGNoZXMgPSBsaWJNYXRjaEFsbCh0bXBWYWx1ZSwgL1xcJFxceyguKj8pXFx9L2cpLnRvQXJyYXkoKTtcblx0XHRcdFx0XHR0bXBNYXRjaGVzLmZvckVhY2goKHRtcE1hdGNoKSA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vZm9ybWF0OiBWQVJfTkFNRXxERUZBVUxUX1ZBTFVFXG5cdFx0XHRcdFx0XHRjb25zdCB0bXBQYXJ0cyA9IHRtcE1hdGNoLnNwbGl0KCd8Jyk7XG5cdFx0XHRcdFx0XHRsZXQgdG1wUmVzb2x2ZWRWYWx1ZSA9IHByb2Nlc3MuZW52W3RtcFBhcnRzWzBdXSB8fCAnJztcblx0XHRcdFx0XHRcdGlmICghdG1wUmVzb2x2ZWRWYWx1ZSAmJiB0bXBQYXJ0cy5sZW5ndGggPiAxKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0bXBSZXNvbHZlZFZhbHVlID0gdG1wUGFydHNbMV07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHBTZXR0aW5nc1t0bXBLZXldID0gcFNldHRpbmdzW3RtcEtleV0ucmVwbGFjZSgnJHsnICsgdG1wTWF0Y2ggKyAnfScsIHRtcFJlc29sdmVkVmFsdWUpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIHRvIHNlZSBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCAoYnV0IG5vdCBhbiBhcnJheSkuXG5cdCAqL1xuXHRfaXNPYmplY3QodmFsdWUpXG5cdHtcblx0XHRyZXR1cm4gdHlwZW9mKHZhbHVlKSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1lcmdlIHR3byBwbGFpbiBvYmplY3RzLiBLZXlzIHRoYXQgYXJlIG9iamVjdHMgaW4gYm90aCB3aWxsIGJlIG1lcmdlZCBwcm9wZXJ0eS13aXNlLlxuXHQgKi9cblx0X2RlZXBNZXJnZU9iamVjdHModG9PYmplY3QsIGZyb21PYmplY3QpXG5cdHtcblx0XHRpZiAoIWZyb21PYmplY3QgfHwgIXRoaXMuX2lzT2JqZWN0KGZyb21PYmplY3QpKVxuXHRcdHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0T2JqZWN0LmtleXMoZnJvbU9iamVjdCkuZm9yRWFjaCgoa2V5KSA9PlxuXHRcdHtcblx0XHRcdGNvbnN0IGZyb21WYWx1ZSA9IGZyb21PYmplY3Rba2V5XTtcblx0XHRcdGlmICh0aGlzLl9pc09iamVjdChmcm9tVmFsdWUpKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCB0b1ZhbHVlID0gdG9PYmplY3Rba2V5XTtcblx0XHRcdFx0aWYgKHRvVmFsdWUgJiYgdGhpcy5faXNPYmplY3QodG9WYWx1ZSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBib3RoIGFyZSBvYmplY3RzLCBzbyBkbyBhIHJlY3Vyc2l2ZSBtZXJnZVxuXHRcdFx0XHRcdHRoaXMuX2RlZXBNZXJnZU9iamVjdHModG9WYWx1ZSwgZnJvbVZhbHVlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRvT2JqZWN0W2tleV0gPSBmcm9tVmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRvT2JqZWN0O1xuXHR9XG5cblx0Ly8gTWVyZ2Ugc29tZSBuZXcgb2JqZWN0IGludG8gdGhlIGV4aXN0aW5nIHNldHRpbmdzLlxuXHRtZXJnZShwU2V0dGluZ3NGcm9tLCBwU2V0dGluZ3NUbylcblx0e1xuXHRcdC8vIElmIGFuIGludmFsaWQgc2V0dGluZ3MgZnJvbSBvYmplY3QgaXMgcGFzc2VkIGluIChlLmcuIG9iamVjdCBjb25zdHJ1Y3RvciB3aXRob3V0IHBhc3NpbmcgaW4gYW55dGhpbmcpIHRoaXMgc2hvdWxkIHN0aWxsIHdvcmtcblx0XHRsZXQgdG1wU2V0dGluZ3NGcm9tID0gKHR5cGVvZihwU2V0dGluZ3NGcm9tKSA9PT0gJ29iamVjdCcpID8gcFNldHRpbmdzRnJvbSA6IHt9O1xuXHRcdC8vIERlZmF1bHQgdG8gdGhlIHNldHRpbmdzIG9iamVjdCBpZiBub25lIGlzIHBhc3NlZCBpbiBmb3IgdGhlIG1lcmdlLlxuXHRcdGxldCB0bXBTZXR0aW5nc1RvID0gKHR5cGVvZihwU2V0dGluZ3NUbykgPT09ICdvYmplY3QnKSA/IHBTZXR0aW5nc1RvIDogdGhpcy5zZXR0aW5ncztcblxuXHRcdC8vIGRvIG5vdCBtdXRhdGUgdGhlIEZyb20gb2JqZWN0IHByb3BlcnR5IHZhbHVlc1xuXHRcdGxldCB0bXBTZXR0aW5nc0Zyb21Db3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0bXBTZXR0aW5nc0Zyb20pKTtcblx0XHR0bXBTZXR0aW5nc1RvID0gdGhpcy5fZGVlcE1lcmdlT2JqZWN0cyh0bXBTZXR0aW5nc1RvLCB0bXBTZXR0aW5nc0Zyb21Db3B5KTtcblxuXHRcdGlmICh0aGlzLl9QZXJmb3JtRW52VGVtcGxhdGluZylcblx0XHR7XG5cdFx0XHR0aGlzLl9yZXNvbHZlRW52KHRtcFNldHRpbmdzVG8pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0bXBTZXR0aW5nc1RvO1xuXHR9XG5cblx0Ly8gRmlsbCBpbiBzZXR0aW5ncyBnYXBzIHdpdGhvdXQgb3ZlcndyaXRpbmcgc2V0dGluZ3MgdGhhdCBhcmUgYWxyZWFkeSB0aGVyZVxuXHRmaWxsKHBTZXR0aW5nc0Zyb20pXG5cdHtcblx0XHQvLyBJZiBhbiBpbnZhbGlkIHNldHRpbmdzIGZyb20gb2JqZWN0IGlzIHBhc3NlZCBpbiAoZS5nLiBvYmplY3QgY29uc3RydWN0b3Igd2l0aG91dCBwYXNzaW5nIGluIGFueXRoaW5nKSB0aGlzIHNob3VsZCBzdGlsbCB3b3JrXG5cdFx0bGV0IHRtcFNldHRpbmdzRnJvbSA9ICh0eXBlb2YocFNldHRpbmdzRnJvbSkgPT09ICdvYmplY3QnKSA/IHBTZXR0aW5nc0Zyb20gOiB7fTtcblxuXHRcdC8vIGRvIG5vdCBtdXRhdGUgdGhlIEZyb20gb2JqZWN0IHByb3BlcnR5IHZhbHVlc1xuXHRcdGxldCB0bXBTZXR0aW5nc0Zyb21Db3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0bXBTZXR0aW5nc0Zyb20pKTtcblxuXHRcdHRoaXMuc2V0dGluZ3MgPSB0aGlzLl9kZWVwTWVyZ2VPYmplY3RzKHRtcFNldHRpbmdzRnJvbUNvcHksIHRoaXMuc2V0dGluZ3MpO1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0dGluZ3M7XG5cdH1cbn07XG5cbi8vIFRoaXMgaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5mdW5jdGlvbiBhdXRvQ29uc3RydWN0KHBTZXR0aW5ncylcbntcblx0cmV0dXJuIG5ldyBGYWJsZVNldHRpbmdzKHBTZXR0aW5ncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge25ldzphdXRvQ29uc3RydWN0LCBGYWJsZVNldHRpbmdzOkZhYmxlU2V0dGluZ3N9O1xuIiwiLyoqXG4qIFJhbmRvbSBCeXRlIEdlbmVyYXRvciAtIEJyb3dzZXIgdmVyc2lvblxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG4vLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuY2xhc3MgUmFuZG9tQnl0ZXNcbntcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cblx0XHQvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cblx0XHQvLyBpbXBsZW1lbnRhdGlvbi4gQWxzbywgZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIG9uIElFMTEuXG5cdFx0dGhpcy5nZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICBcdFx0KHR5cGVvZihtc0NyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0bykpO1xuXHR9XG5cblx0Ly8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG5cdGdlbmVyYXRlV2hhdFdHQnl0ZXMoKVxuXHR7XG5cdFx0bGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cdFx0dGhpcy5nZXRSYW5kb21WYWx1ZXModG1wQnVmZmVyKTtcblx0XHRyZXR1cm4gdG1wQnVmZmVyO1xuXHR9XG5cblx0Ly8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuXHRnZW5lcmF0ZVJhbmRvbUJ5dGVzKClcblx0e1xuXHRcdC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG5cdFx0Ly8gcXVhbGl0eS5cblx0XHRsZXQgdG1wQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cblx0XHRmb3IgKGxldCBpID0gMCwgdG1wVmFsdWU7IGkgPCAxNjsgaSsrKVxuXHRcdHtcblx0XHRcdGlmICgoaSAmIDB4MDMpID09PSAwKVxuXHRcdFx0e1xuXHRcdFx0XHR0bXBWYWx1ZSA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcblx0XHRcdH1cblxuXHRcdFx0dG1wQnVmZmVyW2ldID0gdG1wVmFsdWUgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wQnVmZmVyO1xuXHR9XG5cblx0Z2VuZXJhdGUoKVxuXHR7XG5cdFx0aWYgKHRoaXMuZ2V0UmFuZG9tVmFsdWVzKVxuXHRcdHtcblx0XHRcdHJldHVybiB0aGlzLmdlbmVyYXRlV2hhdFdHQnl0ZXMoKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJldHVybiB0aGlzLmdlbmVyYXRlUmFuZG9tQnl0ZXMoKTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21CeXRlcztcbiIsIi8qKlxuKiBGYWJsZSBVVUlEIEdlbmVyYXRvclxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiogQG1vZHVsZSBGYWJsZSBVVUlEXG4qL1xuXG4vKipcbiogRmFibGUgU29sdXRpb24gVVVJRCBHZW5lcmF0aW9uIE1haW4gQ2xhc3NcbipcbiogQGNsYXNzIEZhYmxlVVVJRFxuKiBAY29uc3RydWN0b3JcbiovXG5cbnZhciBsaWJSYW5kb21CeXRlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9GYWJsZS1VVUlELVJhbmRvbS5qcycpXG5cbmNsYXNzIEZhYmxlVVVJRFxue1xuXHRjb25zdHJ1Y3RvcihwU2V0dGluZ3MpXG5cdHtcblx0XHQvLyBEZXRlcm1pbmUgaWYgdGhlIG1vZHVsZSBpcyBpbiBcIlJhbmRvbSBVVUlEIE1vZGVcIiB3aGljaCBtZWFucyBqdXN0IHVzZSB0aGUgcmFuZG9tIGNoYXJhY3RlciBmdW5jdGlvbiByYXRoZXIgdGhhbiB0aGUgdjQgcmFuZG9tIFVVSUQgc3BlYy5cblx0XHQvLyBOb3RlIHRoaXMgYWxsb3dzIFVVSURzIG9mIHZhcmlvdXMgbGVuZ3RocyAoaW5jbHVkaW5nIHZlcnkgc2hvcnQgb25lcykgYWx0aG91Z2ggZ3VhcmFudGVlZCB1bmlxdWVuZXNzIGdvZXMgZG93bmhpbGwgZmFzdC5cblx0XHR0aGlzLl9VVUlETW9kZVJhbmRvbSA9ICh0eXBlb2YocFNldHRpbmdzKSA9PT0gJ29iamVjdCcpICYmIChwU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ1VVSURNb2RlUmFuZG9tJykpID8gKHBTZXR0aW5ncy5VVUlETW9kZVJhbmRvbSA9PSB0cnVlKSA6IGZhbHNlO1xuXHRcdC8vIFRoZXNlIHR3byBwcm9wZXJ0aWVzIGFyZSBvbmx5IHVzZWZ1bCBpZiB3ZSBhcmUgaW4gUmFuZG9tIG1vZGUuICBPdGhlcndpc2UgaXQgZ2VuZXJhdGVzIGEgdjQgc3BlY1xuXHRcdC8vIExlbmd0aCBmb3IgXCJSYW5kb20gVVVJRCBNb2RlXCIgaXMgc2V0IC0tIGlmIG5vdCBzZXQgaXQgdG8gOFxuXHRcdHRoaXMuX1VVSURMZW5ndGggPSAodHlwZW9mKHBTZXR0aW5ncykgPT09ICdvYmplY3QnKSAmJiAocFNldHRpbmdzLmhhc093blByb3BlcnR5KCdVVUlETGVuZ3RoJykpID8gKHBTZXR0aW5ncy5VVUlETGVuZ3RoICsgMCkgOiA4O1xuXHRcdC8vIERpY3Rpb25hcnkgZm9yIFwiUmFuZG9tIFVVSUQgTW9kZVwiXG5cdFx0dGhpcy5fVVVJRFJhbmRvbURpY3Rpb25hcnkgPSAodHlwZW9mKHBTZXR0aW5ncykgPT09ICdvYmplY3QnKSAmJiAocFNldHRpbmdzLmhhc093blByb3BlcnR5KCdVVUlERGljdGlvbmFyeScpKSA/IChwU2V0dGluZ3MuVVVJRERpY3Rpb25hcnkgKyAwKSA6ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG5cblx0XHR0aGlzLnJhbmRvbUJ5dGVHZW5lcmF0b3IgPSBuZXcgbGliUmFuZG9tQnl0ZUdlbmVyYXRvcigpO1xuXG5cdFx0Ly8gTG9va3VwIHRhYmxlIGZvciBoZXggY29kZXNcblx0XHR0aGlzLl9IZXhMb29rdXAgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKVxuXHRcdHtcblx0XHRcdHRoaXMuX0hleExvb2t1cFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWRhcHRlZCBmcm9tIG5vZGUtdXVpZCAoaHR0cHM6Ly9naXRodWIuY29tL2tlbGVrdGl2L25vZGUtdXVpZClcblx0Ynl0ZXNUb1VVSUQocEJ1ZmZlcilcblx0e1xuXHRcdGxldCBpID0gMDtcblx0XHQvLyBqb2luIHVzZWQgdG8gZml4IG1lbW9yeSBpc3N1ZSBjYXVzZWQgYnkgY29uY2F0ZW5hdGlvbjogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzE3NSNjNFxuXHRcdHJldHVybiAoW1xuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXVxuXHRcdFx0XHRdKS5qb2luKCcnKTtcblx0fVxuXG5cdC8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG5cdGdlbmVyYXRlVVVJRHY0KClcblx0e1xuXHRcdGxldCB0bXBCdWZmZXIgPSBuZXcgQXJyYXkoMTYpO1xuXHRcdHZhciB0bXBSYW5kb21CeXRlcyA9IHRoaXMucmFuZG9tQnl0ZUdlbmVyYXRvci5nZW5lcmF0ZSgpO1xuXG5cdFx0Ly8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXHRcdHRtcFJhbmRvbUJ5dGVzWzZdID0gKHRtcFJhbmRvbUJ5dGVzWzZdICYgMHgwZikgfCAweDQwO1xuXHRcdHRtcFJhbmRvbUJ5dGVzWzhdID0gKHRtcFJhbmRvbUJ5dGVzWzhdICYgMHgzZikgfCAweDgwO1xuXG5cdFx0cmV0dXJuIHRoaXMuYnl0ZXNUb1VVSUQodG1wUmFuZG9tQnl0ZXMpO1xuXHR9XG5cblx0Ly8gU2ltcGxlIHJhbmRvbSBVVUlEIGdlbmVyYXRpb25cblx0Z2VuZXJhdGVSYW5kb20oKVxuXHR7XG5cdFx0bGV0IHRtcFVVSUQgPSAnJztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fVVVJRExlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRtcFVVSUQgKz0gdGhpcy5fVVVJRFJhbmRvbURpY3Rpb25hcnkuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLl9VVUlEUmFuZG9tRGljdGlvbmFyeS5sZW5ndGgtMSkpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wVVVJRDtcblx0fVxuXG5cdC8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG5cdGdldFVVSUQoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX1VVSURNb2RlUmFuZG9tKVxuXHRcdHtcblx0XHRcdHJldHVybiB0aGlzLmdlbmVyYXRlUmFuZG9tKCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZW5lcmF0ZVVVSUR2NCgpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBUaGlzIGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuZnVuY3Rpb24gYXV0b0NvbnN0cnVjdChwU2V0dGluZ3MpXG57XG5cdHJldHVybiBuZXcgRmFibGVVVUlEKHBTZXR0aW5ncyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7bmV3OmF1dG9Db25zdHJ1Y3QsIEZhYmxlVVVJRDpGYWJsZVVVSUR9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogbWF0Y2hBbGxcbiAqIEdldCBhbGwgdGhlIG1hdGNoZXMgZm9yIGEgcmVndWxhciBleHByZXNzaW9uIGluIGEgc3RyaW5nLlxuICpcbiAqIEBuYW1lIG1hdGNoQWxsXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBzIFRoZSBpbnB1dCBzdHJpbmcuXG4gKiBAcGFyYW0ge1JlZ0V4cH0gciBUaGUgcmVndWxhciBleHByZXNzaW9uLlxuICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiAqXG4gKiAgLSBgaW5wdXRgIChTdHJpbmcpOiBUaGUgaW5wdXQgc3RyaW5nLlxuICogIC0gYHJlZ2V4YCAoUmVnRXhwKTogVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqICAtIGBuZXh0YCAoRnVuY3Rpb24pOiBHZXQgdGhlIG5leHQgbWF0Y2guXG4gKiAgLSBgdG9BcnJheWAgKEZ1bmN0aW9uKTogR2V0IGFsbCB0aGUgbWF0Y2hlcy5cbiAqICAtIGByZXNldGAgKEZ1bmN0aW9uKTogUmVzZXQgdGhlIGluZGV4LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hdGNoQWxsKHMsIHIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbnB1dDogcyxcbiAgICAgICAgcmVnZXg6IHJcblxuICAgICAgICAvKipcbiAgICAgICAgICogbmV4dFxuICAgICAgICAgKiBHZXQgdGhlIG5leHQgbWF0Y2ggaW4gc2luZ2xlIGdyb3VwIG1hdGNoLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbmFtZSBuZXh0XG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd8bnVsbH0gVGhlIG1hdGNoZWQgc25pcHBldC5cbiAgICAgICAgICovXG4gICAgICAgICwgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5uZXh0UmF3KCk7XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBuZXh0UmF3XG4gICAgICAgICAqIEdldCB0aGUgbmV4dCBtYXRjaCBpbiByYXcgcmVnZXggb3V0cHV0LiBVc2VmdWxsIHRvIGdldCBhbm90aGVyIGdyb3VwIG1hdGNoLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbmFtZSBuZXh0UmF3XG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl8bnVsbH0gVGhlIG1hdGNoZWQgc25pcHBldFxuICAgICAgICAgKi9cbiAgICAgICAgLFxuICAgICAgICBuZXh0UmF3OiBmdW5jdGlvbiBuZXh0UmF3KCkge1xuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLnJlZ2V4LmV4ZWModGhpcy5pbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0b0FycmF5XG4gICAgICAgICAqIEdldCBhbGwgdGhlIG1hdGNoZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBuYW1lIHRvQXJyYXlcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbWF0Y2hlZCBzbmlwcGV0cy5cbiAgICAgICAgICovXG4gICAgICAgICxcbiAgICAgICAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBbXSxcbiAgICAgICAgICAgICAgICBjID0gbnVsbDtcblxuICAgICAgICAgICAgd2hpbGUgKGMgPSB0aGlzLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHJlc2V0XG4gICAgICAgICAqIFJlc2V0IHRoZSBpbmRleC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG5hbWUgcmVzZXRcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpIFRoZSBuZXcgaW5kZXggKGRlZmF1bHQ6IGAwYCkuXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIG5ldyBpbmRleC5cbiAgICAgICAgICovXG4gICAgICAgICxcbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KGkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZ2V4Lmxhc3RJbmRleCA9IGkgfHwgMDtcbiAgICAgICAgfVxuICAgIH07XG59OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyAjIyMjIyBQYXJ0IG9mIHRoZSAqKltyZXRvbGRdKGh0dHBzOi8vc3RldmVudmVsb3pvLmdpdGh1Yi5pby9yZXRvbGQvKSoqIHN5c3RlbVxuLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5jb25zdCBsaWJGYWJsZVNldHRpbmdzID0gcmVxdWlyZSgnZmFibGUtc2V0dGluZ3MnKS5GYWJsZVNldHRpbmdzO1xuY29uc3QgbGliRmFibGVVVUlEID0gcmVxdWlyZSgnZmFibGUtdXVpZCcpLkZhYmxlVVVJRDtcbmNvbnN0IGxpYkZhYmxlTG9nID0gcmVxdWlyZSgnZmFibGUtbG9nJykuRmFibGVMb2c7XG5cblxuLyoqXG4qIEZhYmxlIEFwcGxpY2F0aW9uIFNlcnZpY2VzIFN1cHBvcnQgTGlicmFyeVxuKlxuKiBAY2xhc3MgRmFibGVcbiovXG5jbGFzcyBGYWJsZVxue1xuXHRjb25zdHJ1Y3RvcihwU2V0dGluZ3MpXG5cdHtcblx0XHRsZXQgdG1wU2V0dGluZ3MgPSBuZXcgbGliRmFibGVTZXR0aW5ncyhwU2V0dGluZ3MpO1xuXG5cdFx0dGhpcy5zZXR0aW5nc01hbmFnZXIgPSB0bXBTZXR0aW5ncztcblxuXHRcdC8vIEluc3RhbnRpYXRlIHRoZSBVVUlEIGdlbmVyYXRvclxuXHRcdHRoaXMubGliVVVJRCA9IG5ldyBsaWJGYWJsZVVVSUQodGhpcy5zZXR0aW5nc01hbmFnZXIuc2V0dGluZ3MpO1xuXG5cdFx0dGhpcy5sb2cgPSBuZXcgbGliRmFibGVMb2codGhpcy5zZXR0aW5nc01hbmFnZXIuc2V0dGluZ3MpO1xuXHRcdHRoaXMubG9nLmluaXRpYWxpemUoKTtcblx0fVxuXG5cdGdldCBzZXR0aW5ncygpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5zZXR0aW5nc01hbmFnZXIuc2V0dGluZ3M7XG5cdH1cblxuXHRnZXQgZmFibGUoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnZXRVVUlEKClcblx0e1xuXHRcdHJldHVybiB0aGlzLmxpYlVVSUQuZ2V0VVVJRCgpO1xuXHR9XG59XG5cbi8vIFRoaXMgaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5mdW5jdGlvbiBhdXRvQ29uc3RydWN0KHBTZXR0aW5ncylcbntcblx0cmV0dXJuIG5ldyBGYWJsZShwU2V0dGluZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtuZXc6YXV0b0NvbnN0cnVjdCwgRmFibGU6RmFibGV9OyJdfQ==
