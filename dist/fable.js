(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

	trace(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsTrace.length; i++)
		{
			this.logStreamsTrace[i].trace(pMessage, pDatum);
		}
	}

	debug(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsDebug.length; i++)
		{
			this.logStreamsDebug[i].debug(pMessage, pDatum);
		}
	}

	info(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsInfo.length; i++)
		{
			this.logStreamsInfo[i].info(pMessage, pDatum);
		}
	}

	warn(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsWarn.length; i++)
		{
			this.logStreamsWarn[i].warn(pMessage, pDatum);
		}
	}

	error(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsError.length; i++)
		{
			this.logStreamsError[i].error(pMessage, pDatum);
		}
	}

	fatal(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsFatal.length; i++)
		{
			this.logStreamsFatal[i].fatal(pMessage, pDatum);
		}
	}

	initialize()
	{
		// "initialize" each logger as defined in the logging parameters
		for (let i = 0; i < this._StreamDefinitions.length; i++)
		{
			let tmpStreamDefinition = Object.assign({loggertype:'console',streamtype:'console',level:'info'},this._StreamDefinitions[i]);

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
/**
* Fable Settings Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/

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
		return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')))
	}

	// Merge some new object into the existing settings.
	merge(pSettingsFrom, pSettingsTo)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};
		// Default to the settings object if none is passed in for the merge.
		let tmpSettingsTo = (typeof(pSettingsTo) === 'object') ? pSettingsTo : this.settings;

		tmpSettingsTo = Object.assign(tmpSettingsTo, tmpSettingsFrom);

		return tmpSettingsTo;
	}

	// Fill in settings gaps without overwriting settings that are already there
	fill(pSettingsFrom)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};

		this.settings = Object.assign(tmpSettingsFrom, this.settings);

		return this.settings;
	}
};

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableSettings(pSettings);
}

module.exports = {new:autoConstruct, FableSettings:FableSettings};

},{"./Fable-Settings-Default":6}],8:[function(require,module,exports){
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
		//
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
			return generateWhatWGBytes();
		}
		else
		{
			return generateRandomBytes();
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
		this.libUUID = new libFableUUID(tmpSettings);

		this.log = new libFableLog(tmpSettings);
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
},{"fable-log":5,"fable-settings":7,"fable-uuid":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmFibGUtbG9nL3NvdXJjZS9GYWJsZS1Mb2ctQmFzZUxvZ2dlci5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS1sb2cvc291cmNlL0ZhYmxlLUxvZy1EZWZhdWx0UHJvdmlkZXJzLUJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZmFibGUtbG9nL3NvdXJjZS9GYWJsZS1Mb2ctRGVmYXVsdFN0cmVhbXMuanNvbiIsIm5vZGVfbW9kdWxlcy9mYWJsZS1sb2cvc291cmNlL0ZhYmxlLUxvZy1Mb2dnZXItQ29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS1sb2cvc291cmNlL0ZhYmxlLUxvZy5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS1zZXR0aW5ncy9zb3VyY2UvRmFibGUtU2V0dGluZ3MtRGVmYXVsdC5qc29uIiwibm9kZV9tb2R1bGVzL2ZhYmxlLXNldHRpbmdzL3NvdXJjZS9GYWJsZS1TZXR0aW5ncy5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS11dWlkL3NvdXJjZS9GYWJsZS1VVUlELVJhbmRvbS1Ccm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2ZhYmxlLXV1aWQvc291cmNlL0ZhYmxlLVVVSUQuanMiLCJzb3VyY2UvRmFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuKiBCYXNlIExvZ2dlciBDbGFzc1xuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5jb25zdCBsaWJGYWJsZVVVSUQgPSBuZXcgKHJlcXVpcmUoJ2ZhYmxlLXV1aWQnKS5GYWJsZVVVSUQpKCk7XG5cbmNsYXNzIEJhc2VMb2dnZXJcbntcblx0Y29uc3RydWN0b3IocExvZ1N0cmVhbVNldHRpbmdzLCBwRmFibGVMb2cpXG5cdHtcblx0XHQvLyBUaGlzIHNob3VsZCBub3QgcG9zc2libHkgYmUgYWJsZSB0byBiZSBpbnN0YW50aWF0ZWQgd2l0aG91dCBhIHNldHRpbmdzIG9iamVjdFxuXHRcdHRoaXMuX1NldHRpbmdzID0gcExvZ1N0cmVhbVNldHRpbmdzO1xuXHRcdFxuXHRcdC8vIFRoZSBiYXNlIGxvZ2dlciBkb2VzIG5vdGhpbmcgYnV0IGFzc29jaWF0ZSBhIFVVSUQgd2l0aCBpdHNlbGZcblx0XHR0aGlzLmxvZ2dlclVVSUQgPSBsaWJGYWJsZVVVSUQuZ2V0VVVJRCgpO1xuXHR9XG5cblx0aW5pdGlhbGl6ZSgpXG5cdHtcblx0XHQvLyBObyBvcGVyYXRpb24uXG5cdH1cblxuXHR0cmFjZShwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJ0cmFjZVwiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHRkZWJ1ZyhwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJkZWJ1Z1wiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHRpbmZvKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImluZm9cIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0d2FybihwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJ3YXJuXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdGVycm9yKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImVycm9yXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdGZhdGFsKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImZhdGFsXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdHdyaXRlKHBMb2dMZXZlbCwgcExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHQvLyBUaGUgYmFzZSBsb2dnZXIgZG9lcyBub3RoaW5nLlxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUxvZ2dlcjtcbiIsIi8qKlxuKiBEZWZhdWx0IExvZ2dlciBQcm92aWRlciBGdW5jdGlvbiAtLS0gQnJvd3NlclxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8vIFJldHVybiB0aGUgcHJvdmlkZXJzIHRoYXQgYXJlIGF2YWlsYWJsZSB3aXRob3V0IGV4dGVuc2lvbnMgbG9hZGVkXG5nZXREZWZhdWx0UHJvdmlkZXJzID0gKCkgPT5cbntcblx0bGV0IHRtcERlZmF1bHRQcm92aWRlcnMgPSB7fTtcblxuXHR0bXBEZWZhdWx0UHJvdmlkZXJzLmNvbnNvbGUgPSByZXF1aXJlKCcuL0ZhYmxlLUxvZy1Mb2dnZXItQ29uc29sZS5qcycpO1xuXG5cdHJldHVybiB0bXBEZWZhdWx0UHJvdmlkZXJzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERlZmF1bHRQcm92aWRlcnMoKTsiLCJtb2R1bGUuZXhwb3J0cz1bXG4gICAge1xuICAgICAgICBcImxvZ2dlcnR5cGVcIjogXCJjb25zb2xlXCIsXG4gICAgICAgIFwic3RyZWFtdHlwZVwiOiBcImNvbnNvbGVcIixcbiAgICAgICAgXCJsZXZlbFwiOiBcInRyYWNlXCJcbiAgICB9XG5dIiwibGV0IGxpYkJhc2VMb2dnZXIgPSByZXF1aXJlKCcuL0ZhYmxlLUxvZy1CYXNlTG9nZ2VyLmpzJyk7XG5cbmNsYXNzIENvbnNvbGVMb2dnZXIgZXh0ZW5kcyBsaWJCYXNlTG9nZ2VyXG57XG5cdGNvbnN0cnVjdG9yKHBMb2dTdHJlYW1TZXR0aW5ncywgcEZhYmxlTG9nKVxuXHR7XG5cdFx0c3VwZXIocExvZ1N0cmVhbVNldHRpbmdzKVxuXG5cdFx0dGhpcy5fU2hvd1RpbWVTdGFtcHMgPSBwTG9nU3RyZWFtU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ1Nob3dUaW1lU3RhbXBzJykgPyAocExvZ1N0cmVhbVNldHRpbmdzLlNob3dUaW1lU3RhbXBzID09IHRydWUpIDogZmFsc2U7XG5cdFx0dGhpcy5fRm9ybWF0dGVkVGltZVN0YW1wcyA9IHBMb2dTdHJlYW1TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnRm9ybWF0dGVkVGltZVN0YW1wcycpID8gKHBMb2dTdHJlYW1TZXR0aW5ncy5Gb3JtYXR0ZWRUaW1lU3RhbXBzID09IHRydWUpIDogZmFsc2U7XG5cblx0XHR0aGlzLl9Db250ZXh0TWVzc2FnZSA9IHBMb2dTdHJlYW1TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnQ29udGV4dCcpID8gYCAoJHtwTG9nU3RyZWFtU2V0dGluZ3MuQ29udGV4dH0pYCA6IFxuXHRcdFx0XHRcdFx0XHRcdHBGYWJsZUxvZy5fU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ1Byb2R1Y3QnKSA/IGAgKCR7cEZhYmxlTG9nLl9TZXR0aW5ncy5Qcm9kdWN0fSlgIDpcblx0XHRcdFx0XHRcdFx0XHQnJztcblx0fVxuXG5cdHdyaXRlKHBMZXZlbCwgcExvZ1RleHQsIHBPYmplY3QpXG5cdHtcblx0XHRpZiAodGhpcy5fU2hvd1RpbWVTdGFtcHMgJiYgdGhpcy5fRm9ybWF0dGVkVGltZVN0YW1wcylcblx0XHR7XG5cdFx0XHRsZXQgdG1wRGF0ZSA9IChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpO1xuXHRcdFx0Y29uc29sZS5sb2coYCR7dG1wRGF0ZX0gWyR7cExldmVsfV0ke3RoaXMuX0NvbnRleHRNZXNzYWdlfSAke3BMb2dUZXh0fWApO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0aGlzLl9TaG93VGltZVN0YW1wcylcblx0XHR7XG5cdFx0XHRsZXQgdG1wRGF0ZSA9ICtuZXcgRGF0ZSgpO1xuXHRcdFx0Y29uc29sZS5sb2coYCR7dG1wRGF0ZX0gWyR7cExldmVsfV0ke3RoaXMuX0NvbnRleHRNZXNzYWdlfSAke3BMb2dUZXh0fWApO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coYFske3BMZXZlbH1dJHt0aGlzLl9Db250ZXh0TWVzc2FnZX0gJHtwTG9nVGV4dH1gKTtcblx0XHR9XG5cblx0XHQvLyBXcml0ZSBvdXQgdGhlIG9iamVjdCBvbiBhIHNlcGFyYXRlIGxpbmUgaWYgaXQgaXMgcGFzc2VkIGluXG5cdFx0aWYgKHR5cGVvZihwT2JqZWN0KSAhPT0gJ3VuZGVmaW5lZCcpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocE9iamVjdCwgbnVsbCwgNCkpO1xuXHRcdH1cblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc29sZUxvZ2dlcjsiLCIvKipcbiogRmFibGUgTG9nZ2luZyBBZGQtb25cbipcbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEBhdXRob3IgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qIEBtb2R1bGUgRmFibGUgTG9nZ2VyXG4qL1xuXG4vKipcbiogRmFibGUgU29sdXRpb24gTG9nIFdyYXBwZXIgTWFpbiBDbGFzc1xuKlxuKiBAY2xhc3MgRmFibGVMb2dcbiogQGNvbnN0cnVjdG9yXG4qL1xuY2xhc3MgRmFibGVMb2dcbntcblx0Y29uc3RydWN0b3IocEZhYmxlU2V0dGluZ3MsIHBGYWJsZSlcblx0e1xuXHRcdGxldCB0bXBTZXR0aW5ncyA9ICh0eXBlb2YocEZhYmxlU2V0dGluZ3MpID09PSAnb2JqZWN0JykgPyBwRmFibGVTZXR0aW5ncyA6IHt9XG5cdFx0dGhpcy5fU2V0dGluZ3MgPSB0bXBTZXR0aW5ncztcblxuXHRcdHRoaXMuX1Byb3ZpZGVycyA9IHJlcXVpcmUoJy4vRmFibGUtTG9nLURlZmF1bHRQcm92aWRlcnMuanMnKTtcblxuXHRcdHRoaXMuX1N0cmVhbURlZmluaXRpb25zID0gKHRtcFNldHRpbmdzLmhhc093blByb3BlcnR5KCdMb2dTdHJlYW1zJykpID8gdG1wU2V0dGluZ3MuTG9nU3RyZWFtcyA6IHJlcXVpcmUoJy4vRmFibGUtTG9nLURlZmF1bHRTdHJlYW1zLmpzb24nKTtcblxuXHRcdHRoaXMubG9nU3RyZWFtcyA9IFtdO1xuXG5cdFx0Ly8gVGhpcyBvYmplY3QgZ2V0cyBkZWNvcmF0ZWQgZm9yIG9uZS10aW1lIGluc3RhbnRpYXRlZCBwcm92aWRlcnMgdGhhdFxuXHRcdC8vICBoYXZlIG11bHRpcGxlIG91dHB1dHMsIHN1Y2ggYXMgYnVueWFuLlxuXHRcdHRoaXMubG9nUHJvdmlkZXJzID0ge307XG5cblx0XHQvLyBBIGhhc2ggbGlzdCBvZiB0aGUgR1VJRHMgZm9yIGVhY2ggbG9nIHN0cmVhbSwgc28gdGhleSBjYW4ndCBiZSBhZGRlZCB0byB0aGUgc2V0IG1vcmUgdGhhbiBvbmUgdGltZVxuXHRcdHRoaXMuYWN0aXZlTG9nU3RyZWFtcyA9IHt9O1xuXG5cdFx0dGhpcy5sb2dTdHJlYW1zVHJhY2UgPSBbXTtcblx0XHR0aGlzLmxvZ1N0cmVhbXNEZWJ1ZyA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc0luZm8gPSBbXTtcblx0XHR0aGlzLmxvZ1N0cmVhbXNXYXJuID0gW107XG5cdFx0dGhpcy5sb2dTdHJlYW1zRXJyb3IgPSBbXTtcblx0XHR0aGlzLmxvZ1N0cmVhbXNGYXRhbCA9IFtdO1xuXG5cdFx0dGhpcy51dWlkID0gKHR5cGVvZih0bXBTZXR0aW5ncy5Qcm9kdWN0KSA9PT0gJ3N0cmluZycpID8gdG1wU2V0dGluZ3MuUHJvZHVjdCA6ICdEZWZhdWx0Jztcblx0fVxuXG5cdGFkZExvZ2dlcihwTG9nZ2VyLCBwTGV2ZWwpXG5cdHtcblx0XHQvLyBCYWlsIG91dCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgb25lLlxuXHRcdGlmICh0aGlzLmFjdGl2ZUxvZ1N0cmVhbXMuaGFzT3duUHJvcGVydHkocExvZ2dlci5sb2dnZXJVVUlEKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIGl0IHRvIHRoZSBzdHJlYW1zIGFuZCB0byB0aGUgbXV0ZXhcblx0XHR0aGlzLmxvZ1N0cmVhbXMucHVzaChwTG9nZ2VyKTtcblx0XHR0aGlzLmFjdGl2ZUxvZ1N0cmVhbXNbcExvZ2dlci5sb2dnZXJVVUlEXSA9IHRydWU7XG5cblx0XHQvLyBNYWtlIHN1cmUgYSBrb3NoZXIgbGV2ZWwgd2FzIHBhc3NlZCBpblxuXHRcdHN3aXRjaCAocExldmVsKVxuXHRcdHtcblx0XHRcdGNhc2UgJ3RyYWNlJzpcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zVHJhY2UucHVzaChwTG9nZ2VyKTtcblx0XHRcdGNhc2UgJ2RlYnVnJzpcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zRGVidWcucHVzaChwTG9nZ2VyKTtcblx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNJbmZvLnB1c2gocExvZ2dlcik7XG5cdFx0XHRjYXNlICd3YXJuJzpcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zV2Fybi5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvci5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnZmF0YWwnOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNGYXRhbC5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHRyYWNlKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc1RyYWNlLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc1RyYWNlW2ldLnRyYWNlKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGRlYnVnKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc0RlYnVnLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0RlYnVnW2ldLmRlYnVnKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGluZm8ocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dTdHJlYW1zSW5mby5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNJbmZvW2ldLmluZm8ocE1lc3NhZ2UsIHBEYXR1bSk7XG5cdFx0fVxuXHR9XG5cblx0d2FybihwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNXYXJuLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc1dhcm5baV0ud2FybihwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRlcnJvcihwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNFcnJvci5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvcltpXS5lcnJvcihwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRmYXRhbChwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNGYXRhbC5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNGYXRhbFtpXS5mYXRhbChwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRpbml0aWFsaXplKClcblx0e1xuXHRcdC8vIFwiaW5pdGlhbGl6ZVwiIGVhY2ggbG9nZ2VyIGFzIGRlZmluZWQgaW4gdGhlIGxvZ2dpbmcgcGFyYW1ldGVyc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fU3RyZWFtRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0bGV0IHRtcFN0cmVhbURlZmluaXRpb24gPSBPYmplY3QuYXNzaWduKHtsb2dnZXJ0eXBlOidjb25zb2xlJyxzdHJlYW10eXBlOidjb25zb2xlJyxsZXZlbDonaW5mbyd9LHRoaXMuX1N0cmVhbURlZmluaXRpb25zW2ldKTtcblxuXHRcdFx0aWYgKCF0aGlzLl9Qcm92aWRlcnMuaGFzT3duUHJvcGVydHkodG1wU3RyZWFtRGVmaW5pdGlvbi5sb2dnZXJ0eXBlKSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coYEVycm9yIGluaXRpYWxpemluZyBsb2cgc3RyZWFtOiBiYWQgbG9nZ2VydHlwZSBpbiBzdHJlYW0gZGVmaW5pdGlvbiAke0pTT04uc3RyaW5naWZ5KHRtcFN0cmVhbURlZmluaXRpb24pfWApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmFkZExvZ2dlcihuZXcgdGhpcy5fUHJvdmlkZXJzW3RtcFN0cmVhbURlZmluaXRpb24ubG9nZ2VydHlwZV0odG1wU3RyZWFtRGVmaW5pdGlvbiwgdGhpcyksIHRtcFN0cmVhbURlZmluaXRpb24ubGV2ZWwpO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gTm93IGluaXRpYWxpemUgZWFjaCBvbmUuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dTdHJlYW1zW2ldLmluaXRpYWxpemUoKTtcblx0XHR9XG5cdH1cblxuXHRsb2dUaW1lKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRsZXQgdG1wTWVzc2FnZSA9ICh0eXBlb2YocE1lc3NhZ2UpICE9PSAndW5kZWZpbmVkJykgPyBwTWVzc2FnZSA6ICdUaW1lJztcblx0XHRsZXQgdG1wVGltZSA9IG5ldyBEYXRlKCk7XG5cdFx0dGhpcy5pbmZvKGAke3RtcE1lc3NhZ2V9ICR7dG1wVGltZX0gKGVwb2NoICR7K3RtcFRpbWV9KWAsIHBEYXR1bSk7XG5cdH1cblxuXHQvLyBHZXQgYSB0aW1lc3RhbXAgXG5cdGdldFRpbWVTdGFtcCgpXG5cdHtcblx0XHRyZXR1cm4gK25ldyBEYXRlKCk7XG5cdH1cblxuXHRnZXRUaW1lRGVsdGEocFRpbWVTdGFtcClcblx0e1xuXHRcdGxldCB0bXBFbmRUaW1lID0gK25ldyBEYXRlKCk7XG5cdFx0cmV0dXJuIHRtcEVuZFRpbWUtcFRpbWVTdGFtcDtcblx0fVxuXG5cdC8vIExvZyB0aGUgZGVsdGEgYmV0d2VlbiBhIHRpbWVzdGFtcCwgYW5kIG5vdyB3aXRoIGEgbWVzc2FnZVxuXHRsb2dUaW1lRGVsdGEocFRpbWVEZWx0YSwgcE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGxldCB0bXBNZXNzYWdlID0gKHR5cGVvZihwTWVzc2FnZSkgIT09ICd1bmRlZmluZWQnKSA/IHBNZXNzYWdlIDogJ1RpbWUgTWVhc3VyZW1lbnQnO1xuXHRcdGxldCB0bXBEYXR1bSA9ICh0eXBlb2YocERhdHVtKSA9PT0gJ29iamVjdCcpID8gcERhdHVtIDoge307XG5cblx0XHRsZXQgdG1wRW5kVGltZSA9ICtuZXcgRGF0ZSgpO1xuXG5cdFx0dGhpcy5pbmZvKGAke3RtcE1lc3NhZ2V9IGxvZ2dlZCBhdCAoZXBvY2ggJHsrdG1wRW5kVGltZX0pIHRvb2sgKCR7cFRpbWVEZWx0YX1tcylgLCBwRGF0dW0pO1xuXHR9XG5cblx0bG9nVGltZURlbHRhSHVtYW4ocFRpbWVEZWx0YSwgcE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGxldCB0bXBNZXNzYWdlID0gKHR5cGVvZihwTWVzc2FnZSkgIT09ICd1bmRlZmluZWQnKSA/IHBNZXNzYWdlIDogJ1RpbWUgTWVhc3VyZW1lbnQnO1xuXG5cdFx0bGV0IHRtcEVuZFRpbWUgPSArbmV3IERhdGUoKTtcblxuXHRcdGxldCB0bXBNcyA9IHBhcnNlSW50KHBUaW1lRGVsdGElMTAwMCk7XG5cdFx0bGV0IHRtcFNlY29uZHMgPSBwYXJzZUludCgocFRpbWVEZWx0YS8xMDAwKSU2MCk7XG5cdFx0bGV0IHRtcE1pbnV0ZXMgPSBwYXJzZUludCgocFRpbWVEZWx0YS8oMTAwMCo2MCkpJTYwKTtcblx0XHRsZXQgdG1wSG91cnMgPSBwYXJzZUludChwVGltZURlbHRhLygxMDAwKjYwKjYwKSk7XG5cblx0XHR0bXBNcyA9ICh0bXBNcyA8IDEwKSA/IFwiMDBcIit0bXBNcyA6ICh0bXBNcyA8IDEwMCkgPyBcIjBcIit0bXBNcyA6IHRtcE1zO1xuXHRcdHRtcFNlY29uZHMgPSAodG1wU2Vjb25kcyA8IDEwKSA/IFwiMFwiK3RtcFNlY29uZHMgOiB0bXBTZWNvbmRzO1xuXHRcdHRtcE1pbnV0ZXMgPSAodG1wTWludXRlcyA8IDEwKSA/IFwiMFwiK3RtcE1pbnV0ZXMgOiB0bXBNaW51dGVzO1xuXHRcdHRtcEhvdXJzID0gKHRtcEhvdXJzIDwgMTApID8gXCIwXCIrdG1wSG91cnMgOiB0bXBIb3VycztcblxuXHRcdHRoaXMuaW5mbyhgJHt0bXBNZXNzYWdlfSBsb2dnZWQgYXQgKGVwb2NoICR7K3RtcEVuZFRpbWV9KSB0b29rICgke3BUaW1lRGVsdGF9bXMpIG9yICgke3RtcEhvdXJzfToke3RtcE1pbnV0ZXN9OiR7dG1wU2Vjb25kc30uJHt0bXBNc30pYCwgcERhdHVtKTtcblx0fVxuXG5cdGxvZ1RpbWVEZWx0YVJlbGF0aXZlKHBTdGFydFRpbWUsIHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHR0aGlzLmxvZ1RpbWVEZWx0YSh0aGlzLmdldFRpbWVEZWx0YShwU3RhcnRUaW1lKSwgcE1lc3NhZ2UsIHBEYXR1bSk7XG5cdH1cblxuXHRsb2dUaW1lRGVsdGFSZWxhdGl2ZUh1bWFuKHBTdGFydFRpbWUsIHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHR0aGlzLmxvZ1RpbWVEZWx0YUh1bWFuKHRoaXMuZ2V0VGltZURlbHRhKHBTdGFydFRpbWUpLCBwTWVzc2FnZSwgcERhdHVtKTtcblx0fVxufVxuXG4vLyBUaGlzIGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuZnVuY3Rpb24gYXV0b0NvbnN0cnVjdChwU2V0dGluZ3MpXG57XG5cdHJldHVybiBuZXcgRmFibGVMb2cocFNldHRpbmdzKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtuZXc6YXV0b0NvbnN0cnVjdCwgRmFibGVMb2c6RmFibGVMb2d9O1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIlByb2R1Y3RcIjogXCJBcHBsaWNhdGlvbk5hbWVIZXJlXCIsXG5cdFwiUHJvZHVjdFZlcnNpb25cIjogXCIwLjAuMFwiLFxuXG5cdFwiQ29uZmlnRmlsZVwiOiBmYWxzZSxcblxuXHRcIkxvZ1N0cmVhbXNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwibGV2ZWxcIjogXCJ0cmFjZVwiXG5cdFx0fVxuXHRdXG59XG4iLCIvKipcbiogRmFibGUgU2V0dGluZ3MgQWRkLW9uXG4qXG4qIEBsaWNlbnNlIE1JVFxuKlxuKiBAYXV0aG9yIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKiBAbW9kdWxlIEZhYmxlIFNldHRpbmdzXG4qL1xuXG4vKipcbiogRmFibGUgU29sdXRpb24gU2V0dGluZ3NcbipcbiogQGNsYXNzIEZhYmxlU2V0dGluZ3NcbiogQGNvbnN0cnVjdG9yXG4qL1xuXG5jbGFzcyBGYWJsZVNldHRpbmdzXG57XG5cdGNvbnN0cnVjdG9yKHBGYWJsZVNldHRpbmdzKVxuXHR7XG5cdFx0dGhpcy5kZWZhdWx0ID0gdGhpcy5idWlsZERlZmF1bHRTZXR0aW5ncygpO1xuXG5cdFx0Ly8gQ29uc3RydWN0IGEgbmV3IHNldHRpbmdzIG9iamVjdFxuXHRcdGxldCB0bXBTZXR0aW5ncyA9IHRoaXMubWVyZ2UocEZhYmxlU2V0dGluZ3MsIHRoaXMuYnVpbGREZWZhdWx0U2V0dGluZ3MoKSk7XG5cblx0XHQvLyBUaGUgYmFzZSBzZXR0aW5ncyBvYmplY3QgKHdoYXQgdGhleSB3ZXJlIG9uIGluaXRpYWxpemF0aW9uLCBiZWZvcmUgb3RoZXIgYWN0b3JzIGhhdmUgYWx0ZXJlZCB0aGVtKVxuXHRcdHRoaXMuYmFzZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodG1wU2V0dGluZ3MpKTtcblxuXHRcdGlmICh0bXBTZXR0aW5ncy5EZWZhdWx0Q29uZmlnRmlsZSlcblx0XHR7XG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYSBERUZBVUxUIGNvbmZpZ3VyYXRpb24gZmlsZSwgdHJ5IHRvIGxvYWQgYW5kIG1lcmdlIGl0LlxuXHRcdFx0XHR0bXBTZXR0aW5ncyA9IHRoaXMubWVyZ2UocmVxdWlyZSh0bXBTZXR0aW5ncy5EZWZhdWx0Q29uZmlnRmlsZSksIHRtcFNldHRpbmdzKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChwRXhjZXB0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBXaHkgdGhpcz8gIE9mdGVuIGZvciBhbiBhcHAgd2Ugd2FudCBzZXR0aW5ncyB0byB3b3JrIG91dCBvZiB0aGUgYm94LCBidXRcblx0XHRcdFx0Ly8gd291bGQgcG90ZW50aWFsbHkgd2FudCB0byBoYXZlIGEgY29uZmlnIGZpbGUgZm9yIGNvbXBsZXggc2V0dGluZ3MuXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWJsZS1TZXR0aW5ncyBXYXJuaW5nOiBEZWZhdWx0IGNvbmZpZ3VyYXRpb24gZmlsZSBzcGVjaWZpZWQgYnV0IHRoZXJlIHdhcyBhIHByb2JsZW0gbG9hZGluZyBpdC4gIEZhbGxpbmcgYmFjayB0byBiYXNlLicpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnICAgICBMb2FkaW5nIEV4Y2VwdGlvbjogJytwRXhjZXB0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodG1wU2V0dGluZ3MuQ29uZmlnRmlsZSlcblx0XHR7XG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYSBjb25maWd1cmF0aW9uIGZpbGUsIHRyeSB0byBsb2FkIGFuZCBtZXJnZSBpdC5cblx0XHRcdFx0dG1wU2V0dGluZ3MgPSB0aGlzLm1lcmdlKHJlcXVpcmUodG1wU2V0dGluZ3MuQ29uZmlnRmlsZSksIHRtcFNldHRpbmdzKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChwRXhjZXB0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBXaHkgdGhpcz8gIE9mdGVuIGZvciBhbiBhcHAgd2Ugd2FudCBzZXR0aW5ncyB0byB3b3JrIG91dCBvZiB0aGUgYm94LCBidXRcblx0XHRcdFx0Ly8gd291bGQgcG90ZW50aWFsbHkgd2FudCB0byBoYXZlIGEgY29uZmlnIGZpbGUgZm9yIGNvbXBsZXggc2V0dGluZ3MuXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWJsZS1TZXR0aW5ncyBXYXJuaW5nOiBDb25maWd1cmF0aW9uIGZpbGUgc3BlY2lmaWVkIGJ1dCB0aGVyZSB3YXMgYSBwcm9ibGVtIGxvYWRpbmcgaXQuICBGYWxsaW5nIGJhY2sgdG8gYmFzZS4nKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJyAgICAgTG9hZGluZyBFeGNlcHRpb246ICcrcEV4Y2VwdGlvbik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXR0aW5ncyA9IHRtcFNldHRpbmdzO1xuXHR9XG5cblx0Ly8gQnVpbGQgYSBkZWZhdWx0IHNldHRpbmdzIG9iamVjdC4gIFVzZSB0aGUgSlNPTiBqaW1teSB0byBlbnN1cmUgaXQgaXMgYWx3YXlzIGEgbmV3IG9iamVjdC5cblx0YnVpbGREZWZhdWx0U2V0dGluZ3MoKVxuXHR7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVxdWlyZSgnLi9GYWJsZS1TZXR0aW5ncy1EZWZhdWx0JykpKVxuXHR9XG5cblx0Ly8gTWVyZ2Ugc29tZSBuZXcgb2JqZWN0IGludG8gdGhlIGV4aXN0aW5nIHNldHRpbmdzLlxuXHRtZXJnZShwU2V0dGluZ3NGcm9tLCBwU2V0dGluZ3NUbylcblx0e1xuXHRcdC8vIElmIGFuIGludmFsaWQgc2V0dGluZ3MgZnJvbSBvYmplY3QgaXMgcGFzc2VkIGluIChlLmcuIG9iamVjdCBjb25zdHJ1Y3RvciB3aXRob3V0IHBhc3NpbmcgaW4gYW55dGhpbmcpIHRoaXMgc2hvdWxkIHN0aWxsIHdvcmtcblx0XHRsZXQgdG1wU2V0dGluZ3NGcm9tID0gKHR5cGVvZihwU2V0dGluZ3NGcm9tKSA9PT0gJ29iamVjdCcpID8gcFNldHRpbmdzRnJvbSA6IHt9O1xuXHRcdC8vIERlZmF1bHQgdG8gdGhlIHNldHRpbmdzIG9iamVjdCBpZiBub25lIGlzIHBhc3NlZCBpbiBmb3IgdGhlIG1lcmdlLlxuXHRcdGxldCB0bXBTZXR0aW5nc1RvID0gKHR5cGVvZihwU2V0dGluZ3NUbykgPT09ICdvYmplY3QnKSA/IHBTZXR0aW5nc1RvIDogdGhpcy5zZXR0aW5ncztcblxuXHRcdHRtcFNldHRpbmdzVG8gPSBPYmplY3QuYXNzaWduKHRtcFNldHRpbmdzVG8sIHRtcFNldHRpbmdzRnJvbSk7XG5cblx0XHRyZXR1cm4gdG1wU2V0dGluZ3NUbztcblx0fVxuXG5cdC8vIEZpbGwgaW4gc2V0dGluZ3MgZ2FwcyB3aXRob3V0IG92ZXJ3cml0aW5nIHNldHRpbmdzIHRoYXQgYXJlIGFscmVhZHkgdGhlcmVcblx0ZmlsbChwU2V0dGluZ3NGcm9tKVxuXHR7XG5cdFx0Ly8gSWYgYW4gaW52YWxpZCBzZXR0aW5ncyBmcm9tIG9iamVjdCBpcyBwYXNzZWQgaW4gKGUuZy4gb2JqZWN0IGNvbnN0cnVjdG9yIHdpdGhvdXQgcGFzc2luZyBpbiBhbnl0aGluZykgdGhpcyBzaG91bGQgc3RpbGwgd29ya1xuXHRcdGxldCB0bXBTZXR0aW5nc0Zyb20gPSAodHlwZW9mKHBTZXR0aW5nc0Zyb20pID09PSAnb2JqZWN0JykgPyBwU2V0dGluZ3NGcm9tIDoge307XG5cblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0bXBTZXR0aW5nc0Zyb20sIHRoaXMuc2V0dGluZ3MpO1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0dGluZ3M7XG5cdH1cbn07XG5cbi8vIFRoaXMgaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5mdW5jdGlvbiBhdXRvQ29uc3RydWN0KHBTZXR0aW5ncylcbntcblx0cmV0dXJuIG5ldyBGYWJsZVNldHRpbmdzKHBTZXR0aW5ncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge25ldzphdXRvQ29uc3RydWN0LCBGYWJsZVNldHRpbmdzOkZhYmxlU2V0dGluZ3N9O1xuIiwiLyoqXG4qIFJhbmRvbSBCeXRlIEdlbmVyYXRvciAtIEJyb3dzZXIgdmVyc2lvblxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG4vLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuY2xhc3MgUmFuZG9tQnl0ZXNcbntcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cblx0XHQvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cblx0XHQvLyBpbXBsZW1lbnRhdGlvbi4gQWxzbywgZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIG9uIElFMTEuXG5cdFx0dGhpcy5nZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICBcdFx0KHR5cGVvZihtc0NyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0bykpO1xuXHR9XG5cblx0Ly8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG5cdGdlbmVyYXRlV2hhdFdHQnl0ZXMoKVxuXHR7XG5cdFx0bGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cdFx0dGhpcy5nZXRSYW5kb21WYWx1ZXModG1wQnVmZmVyKTtcblx0XHRyZXR1cm4gdG1wQnVmZmVyO1xuXHR9XG5cblx0Ly8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuXHRnZW5lcmF0ZVJhbmRvbUJ5dGVzKClcblx0e1xuXHRcdC8vXG5cdFx0Ly8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcblx0XHQvLyBxdWFsaXR5LlxuXHRcdGxldCB0bXBCdWZmZXIgPSBuZXcgVWludDhBcnJheSgxNik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuXHRcdGZvciAobGV0IGkgPSAwLCB0bXBWYWx1ZTsgaSA8IDE2OyBpKyspXG5cdFx0e1xuXHRcdFx0aWYgKChpICYgMHgwMykgPT09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRtcFZhbHVlID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuXHRcdFx0fVxuXG5cdFx0XHR0bXBCdWZmZXJbaV0gPSB0bXBWYWx1ZSA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuXHRcdH1cblxuXHRcdHJldHVybiB0bXBCdWZmZXI7XG5cdH1cblxuXHRnZW5lcmF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5nZXRSYW5kb21WYWx1ZXMpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGdlbmVyYXRlV2hhdFdHQnl0ZXMoKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJldHVybiBnZW5lcmF0ZVJhbmRvbUJ5dGVzKCk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tQnl0ZXM7XG4iLCIvKipcbiogRmFibGUgVVVJRCBHZW5lcmF0b3JcbipcbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEBhdXRob3IgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qIEBtb2R1bGUgRmFibGUgVVVJRFxuKi9cblxuLyoqXG4qIEZhYmxlIFNvbHV0aW9uIFVVSUQgR2VuZXJhdGlvbiBNYWluIENsYXNzXG4qXG4qIEBjbGFzcyBGYWJsZVVVSURcbiogQGNvbnN0cnVjdG9yXG4qL1xuXG52YXIgbGliUmFuZG9tQnl0ZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vRmFibGUtVVVJRC1SYW5kb20uanMnKVxuXG5jbGFzcyBGYWJsZVVVSURcbntcblx0Y29uc3RydWN0b3IocFNldHRpbmdzKVxuXHR7XG5cdFx0Ly8gRGV0ZXJtaW5lIGlmIHRoZSBtb2R1bGUgaXMgaW4gXCJSYW5kb20gVVVJRCBNb2RlXCIgd2hpY2ggbWVhbnMganVzdCB1c2UgdGhlIHJhbmRvbSBjaGFyYWN0ZXIgZnVuY3Rpb24gcmF0aGVyIHRoYW4gdGhlIHY0IHJhbmRvbSBVVUlEIHNwZWMuXG5cdFx0Ly8gTm90ZSB0aGlzIGFsbG93cyBVVUlEcyBvZiB2YXJpb3VzIGxlbmd0aHMgKGluY2x1ZGluZyB2ZXJ5IHNob3J0IG9uZXMpIGFsdGhvdWdoIGd1YXJhbnRlZWQgdW5pcXVlbmVzcyBnb2VzIGRvd25oaWxsIGZhc3QuXG5cdFx0dGhpcy5fVVVJRE1vZGVSYW5kb20gPSAodHlwZW9mKHBTZXR0aW5ncykgPT09ICdvYmplY3QnKSAmJiAocFNldHRpbmdzLmhhc093blByb3BlcnR5KCdVVUlETW9kZVJhbmRvbScpKSA/IChwU2V0dGluZ3MuVVVJRE1vZGVSYW5kb20gPT0gdHJ1ZSkgOiBmYWxzZTtcblx0XHQvLyBUaGVzZSB0d28gcHJvcGVydGllcyBhcmUgb25seSB1c2VmdWwgaWYgd2UgYXJlIGluIFJhbmRvbSBtb2RlLiAgT3RoZXJ3aXNlIGl0IGdlbmVyYXRlcyBhIHY0IHNwZWNcblx0XHQvLyBMZW5ndGggZm9yIFwiUmFuZG9tIFVVSUQgTW9kZVwiIGlzIHNldCAtLSBpZiBub3Qgc2V0IGl0IHRvIDhcblx0XHR0aGlzLl9VVUlETGVuZ3RoID0gKHR5cGVvZihwU2V0dGluZ3MpID09PSAnb2JqZWN0JykgJiYgKHBTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnVVVJRExlbmd0aCcpKSA/IChwU2V0dGluZ3MuVVVJRExlbmd0aCArIDApIDogODtcblx0XHQvLyBEaWN0aW9uYXJ5IGZvciBcIlJhbmRvbSBVVUlEIE1vZGVcIlxuXHRcdHRoaXMuX1VVSURSYW5kb21EaWN0aW9uYXJ5ID0gKHR5cGVvZihwU2V0dGluZ3MpID09PSAnb2JqZWN0JykgJiYgKHBTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnVVVJRERpY3Rpb25hcnknKSkgPyAocFNldHRpbmdzLlVVSUREaWN0aW9uYXJ5ICsgMCkgOiAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonO1xuXG5cdFx0dGhpcy5yYW5kb21CeXRlR2VuZXJhdG9yID0gbmV3IGxpYlJhbmRvbUJ5dGVHZW5lcmF0b3IoKTtcblxuXHRcdC8vIExvb2t1cCB0YWJsZSBmb3IgaGV4IGNvZGVzXG5cdFx0dGhpcy5fSGV4TG9va3VwID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSlcblx0XHR7XG5cdFx0XHR0aGlzLl9IZXhMb29rdXBbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG5cdGJ5dGVzVG9VVUlEKHBCdWZmZXIpXG5cdHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Ly8gam9pbiB1c2VkIHRvIGZpeCBtZW1vcnkgaXNzdWUgY2F1c2VkIGJ5IGNvbmNhdGVuYXRpb246IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxNzUjYzRcblx0XHRyZXR1cm4gKFtcblx0XHRcdFx0XHR0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV1cblx0XHRcdFx0XSkuam9pbignJyk7XG5cdH1cblxuXHQvLyBBZGFwdGVkIGZyb20gbm9kZS11dWlkIChodHRwczovL2dpdGh1Yi5jb20va2VsZWt0aXYvbm9kZS11dWlkKVxuXHRnZW5lcmF0ZVVVSUR2NCgpXG5cdHtcblx0XHRsZXQgdG1wQnVmZmVyID0gbmV3IEFycmF5KDE2KTtcblx0XHR2YXIgdG1wUmFuZG9tQnl0ZXMgPSB0aGlzLnJhbmRvbUJ5dGVHZW5lcmF0b3IuZ2VuZXJhdGUoKTtcblxuXHRcdC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblx0XHR0bXBSYW5kb21CeXRlc1s2XSA9ICh0bXBSYW5kb21CeXRlc1s2XSAmIDB4MGYpIHwgMHg0MDtcblx0XHR0bXBSYW5kb21CeXRlc1s4XSA9ICh0bXBSYW5kb21CeXRlc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuXHRcdHJldHVybiB0aGlzLmJ5dGVzVG9VVUlEKHRtcFJhbmRvbUJ5dGVzKTtcblx0fVxuXG5cdC8vIFNpbXBsZSByYW5kb20gVVVJRCBnZW5lcmF0aW9uXG5cdGdlbmVyYXRlUmFuZG9tKClcblx0e1xuXHRcdGxldCB0bXBVVUlEID0gJyc7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX1VVSURMZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0bXBVVUlEICs9IHRoaXMuX1VVSURSYW5kb21EaWN0aW9uYXJ5LmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5fVVVJRFJhbmRvbURpY3Rpb25hcnkubGVuZ3RoLTEpKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRtcFVVSUQ7XG5cdH1cblxuXHQvLyBBZGFwdGVkIGZyb20gbm9kZS11dWlkIChodHRwczovL2dpdGh1Yi5jb20va2VsZWt0aXYvbm9kZS11dWlkKVxuXHRnZXRVVUlEKClcblx0e1xuXHRcdGlmICh0aGlzLl9VVUlETW9kZVJhbmRvbSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZW5lcmF0ZVJhbmRvbSgpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2VuZXJhdGVVVUlEdjQoKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gVGhpcyBpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbmZ1bmN0aW9uIGF1dG9Db25zdHJ1Y3QocFNldHRpbmdzKVxue1xuXHRyZXR1cm4gbmV3IEZhYmxlVVVJRChwU2V0dGluZ3MpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge25ldzphdXRvQ29uc3RydWN0LCBGYWJsZVVVSUQ6RmFibGVVVUlEfTtcbiIsIi8vICMjIyMjIFBhcnQgb2YgdGhlICoqW3JldG9sZF0oaHR0cHM6Ly9zdGV2ZW52ZWxvem8uZ2l0aHViLmlvL3JldG9sZC8pKiogc3lzdGVtXG4vKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cbmNvbnN0IGxpYkZhYmxlU2V0dGluZ3MgPSByZXF1aXJlKCdmYWJsZS1zZXR0aW5ncycpLkZhYmxlU2V0dGluZ3M7XG5jb25zdCBsaWJGYWJsZVVVSUQgPSByZXF1aXJlKCdmYWJsZS11dWlkJykuRmFibGVVVUlEO1xuY29uc3QgbGliRmFibGVMb2cgPSByZXF1aXJlKCdmYWJsZS1sb2cnKS5GYWJsZUxvZztcblxuXG4vKipcbiogRmFibGUgQXBwbGljYXRpb24gU2VydmljZXMgU3VwcG9ydCBMaWJyYXJ5XG4qXG4qIEBjbGFzcyBGYWJsZVxuKi9cbmNsYXNzIEZhYmxlXG57XG5cdGNvbnN0cnVjdG9yKHBTZXR0aW5ncylcblx0e1xuXHRcdGxldCB0bXBTZXR0aW5ncyA9IG5ldyBsaWJGYWJsZVNldHRpbmdzKHBTZXR0aW5ncyk7XG5cblx0XHR0aGlzLnNldHRpbmdzTWFuYWdlciA9IHRtcFNldHRpbmdzO1xuXG5cdFx0Ly8gSW5zdGFudGlhdGUgdGhlIFVVSUQgZ2VuZXJhdG9yXG5cdFx0dGhpcy5saWJVVUlEID0gbmV3IGxpYkZhYmxlVVVJRCh0bXBTZXR0aW5ncyk7XG5cblx0XHR0aGlzLmxvZyA9IG5ldyBsaWJGYWJsZUxvZyh0bXBTZXR0aW5ncyk7XG5cdFx0dGhpcy5sb2cuaW5pdGlhbGl6ZSgpO1xuXHR9XG5cblx0Z2V0IHNldHRpbmdzKClcblx0e1xuXHRcdHJldHVybiB0aGlzLnNldHRpbmdzTWFuYWdlci5zZXR0aW5ncztcblx0fVxuXG5cdGdldCBmYWJsZSgpXG5cdHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGdldFVVSUQoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMubGliVVVJRC5nZXRVVUlEKCk7XG5cdH1cbn1cblxuLy8gVGhpcyBpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbmZ1bmN0aW9uIGF1dG9Db25zdHJ1Y3QocFNldHRpbmdzKVxue1xuXHRyZXR1cm4gbmV3IEZhYmxlKHBTZXR0aW5ncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge25ldzphdXRvQ29uc3RydWN0LCBGYWJsZTpGYWJsZX07Il19
