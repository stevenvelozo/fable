(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.Fable = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      /**
      * Base Logger Class
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      class BaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          // This should not possibly be able to be instantiated without a settings object
          this._Settings = pLogStreamSettings;

          // The base logger does nothing but associate a UUID with itself
          // We added this as the mechanism for tracking loggers to allow multiple simultaneous streams
          // to the same provider.
          this.loggerUUID = this.generateInsecureUUID();

          // Eventually we can use this array to ompute which levels the provider allows.
          // For now it's just used to precompute some string concatenations.
          this.levels = ["trace", "debug", "info", "warn", "error", "fatal"];
        }

        // This is meant to generate programmatically insecure UUIDs to identify loggers
        generateInsecureUUID() {
          let tmpDate = new Date().getTime();
          let tmpUUID = 'LOGSTREAM-xxxxxx-yxxxxx'.replace(/[xy]/g, pCharacter => {
            // Funny algorithm from w3resource that is twister-ish without the deep math and security
            // ..but good enough for unique log stream identifiers
            let tmpRandomData = (tmpDate + Math.random() * 16) % 16 | 0;
            tmpDate = Math.floor(tmpDate / 16);
            return (pCharacter == 'x' ? tmpRandomData : tmpRandomData & 0x3 | 0x8).toString(16);
          });
          return tmpUUID;
        }
        initialize() {
          // No operation.
        }
        trace(pLogText, pLogObject) {
          this.write("trace", pLogText, pLogObject);
        }
        debug(pLogText, pLogObject) {
          this.write("debug", pLogText, pLogObject);
        }
        info(pLogText, pLogObject) {
          this.write("info", pLogText, pLogObject);
        }
        warn(pLogText, pLogObject) {
          this.write("warn", pLogText, pLogObject);
        }
        error(pLogText, pLogObject) {
          this.write("error", pLogText, pLogObject);
        }
        fatal(pLogText, pLogObject) {
          this.write("fatal", pLogText, pLogObject);
        }
        write(pLogLevel, pLogText, pLogObject) {
          // The base logger does nothing.
          return true;
        }
      }
      module.exports = BaseLogger;
    }, {}],
    2: [function (require, module, exports) {
      /**
      * Default Logger Provider Function
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      // Return the providers that are available without extensions loaded
      getDefaultProviders = () => {
        let tmpDefaultProviders = {};
        tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');
        tmpDefaultProviders.default = tmpDefaultProviders.console;
        return tmpDefaultProviders;
      };
      module.exports = getDefaultProviders();
    }, {
      "./Fable-Log-Logger-Console.js": 4
    }],
    3: [function (require, module, exports) {
      module.exports = [{
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
      }];
    }, {}],
    4: [function (require, module, exports) {
      let libBaseLogger = require('./Fable-Log-BaseLogger.js');
      class ConsoleLogger extends libBaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings);
          this._ShowTimeStamps = pLogStreamSettings.hasOwnProperty('showtimestamps') ? pLogStreamSettings.showtimestamps == true : false;
          this._FormattedTimeStamps = pLogStreamSettings.hasOwnProperty('formattedtimestamps') ? pLogStreamSettings.formattedtimestamps == true : false;
          this._ContextMessage = pLogStreamSettings.hasOwnProperty('Context') ? `(${pLogStreamSettings.Context})` : pFableLog._Settings.hasOwnProperty('Product') ? `(${pFableLog._Settings.Product})` : 'Unnamed_Log_Context';

          // Allow the user to decide what gets output to the console
          this._OutputLogLinesToConsole = pLogStreamSettings.hasOwnProperty('outputloglinestoconsole') ? pLogStreamSettings.outputloglinestoconsole : true;
          this._OutputObjectsToConsole = pLogStreamSettings.hasOwnProperty('outputobjectstoconsole') ? pLogStreamSettings.outputobjectstoconsole : true;

          // Precompute the prefix for each level
          this.prefixCache = {};
          for (let i = 0; i <= this.levels.length; i++) {
            this.prefixCache[this.levels[i]] = `[${this.levels[i]}] ${this._ContextMessage}: `;
            if (this._ShowTimeStamps) {
              // If there is a timestamp we need a to prepend space before the prefixcache string, since the timestamp comes first
              this.prefixCache[this.levels[i]] = ' ' + this.prefixCache[this.levels[i]];
            }
          }
        }
        write(pLevel, pLogText, pObject) {
          let tmpTimeStamp = '';
          if (this._ShowTimeStamps && this._FormattedTimeStamps) {
            tmpTimeStamp = new Date().toISOString();
          } else if (this._ShowTimeStamps) {
            tmpTimeStamp = +new Date();
          }
          let tmpLogLine = `${tmpTimeStamp}${this.prefixCache[pLevel]}${pLogText}`;
          if (this._OutputLogLinesToConsole) {
            console.log(tmpLogLine);
          }

          // Write out the object on a separate line if it is passed in
          if (this._OutputObjectsToConsole && typeof pObject !== 'undefined') {
            console.log(JSON.stringify(pObject, null, 2));
          }

          // Provide an easy way to be overridden and be consistent
          return tmpLogLine;
        }
      }
      module.exports = ConsoleLogger;
    }, {
      "./Fable-Log-BaseLogger.js": 1
    }],
    5: [function (require, module, exports) {
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
      class FableLog {
        constructor(pFableSettings, pFable) {
          let tmpSettings = typeof pFableSettings === 'object' ? pFableSettings : {};
          this._Settings = tmpSettings;
          this._Providers = require('./Fable-Log-DefaultProviders-Node.js');
          this._StreamDefinitions = tmpSettings.hasOwnProperty('LogStreams') ? tmpSettings.LogStreams : require('./Fable-Log-DefaultStreams.json');
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
          this.datumDecorator = pDatum => pDatum;
          this.uuid = typeof tmpSettings.Product === 'string' ? tmpSettings.Product : 'Default';
        }
        addLogger(pLogger, pLevel) {
          // Bail out if we've already created one.
          if (this.activeLogStreams.hasOwnProperty(pLogger.loggerUUID)) {
            return false;
          }

          // Add it to the streams and to the mutex
          this.logStreams.push(pLogger);
          this.activeLogStreams[pLogger.loggerUUID] = true;

          // Make sure a kosher level was passed in
          switch (pLevel) {
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
        setDatumDecorator(fDatumDecorator) {
          if (typeof fDatumDecorator === 'function') {
            this.datumDecorator = fDatumDecorator;
          } else {
            this.datumDecorator = pDatum => pDatum;
          }
        }
        trace(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsTrace.length; i++) {
            this.logStreamsTrace[i].trace(pMessage, tmpDecoratedDatum);
          }
        }
        debug(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsDebug.length; i++) {
            this.logStreamsDebug[i].debug(pMessage, tmpDecoratedDatum);
          }
        }
        info(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsInfo.length; i++) {
            this.logStreamsInfo[i].info(pMessage, tmpDecoratedDatum);
          }
        }
        warn(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsWarn.length; i++) {
            this.logStreamsWarn[i].warn(pMessage, tmpDecoratedDatum);
          }
        }
        error(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsError.length; i++) {
            this.logStreamsError[i].error(pMessage, tmpDecoratedDatum);
          }
        }
        fatal(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsFatal.length; i++) {
            this.logStreamsFatal[i].fatal(pMessage, tmpDecoratedDatum);
          }
        }
        initialize() {
          // "initialize" each logger as defined in the logging parameters
          for (let i = 0; i < this._StreamDefinitions.length; i++) {
            let tmpStreamDefinition = Object.assign({
              loggertype: 'default',
              streamtype: 'console',
              level: 'info'
            }, this._StreamDefinitions[i]);
            if (!this._Providers.hasOwnProperty(tmpStreamDefinition.loggertype)) {
              console.log(`Error initializing log stream: bad loggertype in stream definition ${JSON.stringify(tmpStreamDefinition)}`);
            } else {
              this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);
            }
          }

          // Now initialize each one.
          for (let i = 0; i < this.logStreams.length; i++) {
            this.logStreams[i].initialize();
          }
        }
        logTime(pMessage, pDatum) {
          let tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time';
          let tmpTime = new Date();
          this.info(`${tmpMessage} ${tmpTime} (epoch ${+tmpTime})`, pDatum);
        }

        // Get a timestamp
        getTimeStamp() {
          return +new Date();
        }
        getTimeDelta(pTimeStamp) {
          let tmpEndTime = +new Date();
          return tmpEndTime - pTimeStamp;
        }

        // Log the delta between a timestamp, and now with a message
        logTimeDelta(pTimeDelta, pMessage, pDatum) {
          let tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time Measurement';
          let tmpDatum = typeof pDatum === 'object' ? pDatum : {};
          let tmpEndTime = +new Date();
          this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms)`, pDatum);
        }
        logTimeDeltaHuman(pTimeDelta, pMessage, pDatum) {
          let tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time Measurement';
          let tmpEndTime = +new Date();
          let tmpMs = parseInt(pTimeDelta % 1000);
          let tmpSeconds = parseInt(pTimeDelta / 1000 % 60);
          let tmpMinutes = parseInt(pTimeDelta / (1000 * 60) % 60);
          let tmpHours = parseInt(pTimeDelta / (1000 * 60 * 60));
          tmpMs = tmpMs < 10 ? "00" + tmpMs : tmpMs < 100 ? "0" + tmpMs : tmpMs;
          tmpSeconds = tmpSeconds < 10 ? "0" + tmpSeconds : tmpSeconds;
          tmpMinutes = tmpMinutes < 10 ? "0" + tmpMinutes : tmpMinutes;
          tmpHours = tmpHours < 10 ? "0" + tmpHours : tmpHours;
          this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms) or (${tmpHours}:${tmpMinutes}:${tmpSeconds}.${tmpMs})`, pDatum);
        }
        logTimeDeltaRelative(pStartTime, pMessage, pDatum) {
          this.logTimeDelta(this.getTimeDelta(pStartTime), pMessage, pDatum);
        }
        logTimeDeltaRelativeHuman(pStartTime, pMessage, pDatum) {
          this.logTimeDeltaHuman(this.getTimeDelta(pStartTime), pMessage, pDatum);
        }
      }

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new FableLog(pSettings);
      }
      module.exports = {
        new: autoConstruct,
        FableLog: FableLog
      };
    }, {
      "./Fable-Log-DefaultProviders-Node.js": 2,
      "./Fable-Log-DefaultStreams.json": 3
    }],
    6: [function (require, module, exports) {
      module.exports = {
        "Product": "ApplicationNameHere",
        "ProductVersion": "0.0.0",
        "ConfigFile": false,
        "LogStreams": [{
          "level": "trace"
        }]
      };
    }, {}],
    7: [function (require, module, exports) {
      (function (process) {
        (function () {
          /**
          * Fable Settings Template Processor
          *
          * This class allows environment variables to come in via templated expressions, and defaults to be set.
          *
          * @license MIT
          *
          * @author Steven Velozo <steven@velozo.com>
          * @module Fable Settings
          */

          class FableSettingsTemplateProcessor {
            constructor(pDependencies) {
              // Use a no-dependencies templating engine to parse out environment variables
              this.templateProcessor = new pDependencies.precedent();

              // TODO: Make the environment variable wrap expression demarcation characters configurable?
              this.templateProcessor.addPattern('${', '}', pTemplateValue => {
                let tmpTemplateValue = pTemplateValue.trim();
                let tmpSeparatorIndex = tmpTemplateValue.indexOf('|');

                // If there is no pipe, the default value will end up being whatever the variable name is.
                let tmpDefaultValue = tmpTemplateValue.substring(tmpSeparatorIndex + 1);
                let tmpEnvironmentVariableName = tmpSeparatorIndex > -1 ? tmpTemplateValue.substring(0, tmpSeparatorIndex) : tmpTemplateValue;
                if (process.env.hasOwnProperty(tmpEnvironmentVariableName)) {
                  return process.env[tmpEnvironmentVariableName];
                } else {
                  return tmpDefaultValue;
                }
              });
            }
            parseSetting(pString) {
              return this.templateProcessor.parseString(pString);
            }
          }
          module.exports = FableSettingsTemplateProcessor;
        }).call(this);
      }).call(this, require('_process'));
    }, {
      "_process": 14
    }],
    8: [function (require, module, exports) {
      /**
      * Fable Settings Add-on
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      * @module Fable Settings
      */

      const libPrecedent = require('precedent');
      const libFableSettingsTemplateProcessor = require('./Fable-Settings-TemplateProcessor.js');
      class FableSettings {
        constructor(pFableSettings) {
          // Expose the dependencies for downstream re-use
          this.dependencies = {
            precedent: libPrecedent
          };

          // Initialize the settings value template processor
          this.settingsTemplateProcessor = new libFableSettingsTemplateProcessor(this.dependencies);

          // set straight away so anything that uses it respects the initial setting
          this._configureEnvTemplating(pFableSettings);
          this.default = this.buildDefaultSettings();

          // Construct a new settings object
          let tmpSettings = this.merge(pFableSettings, this.buildDefaultSettings());

          // The base settings object (what they were on initialization, before other actors have altered them)
          this.base = JSON.parse(JSON.stringify(tmpSettings));
          if (tmpSettings.DefaultConfigFile) {
            try {
              // If there is a DEFAULT configuration file, try to load and merge it.
              tmpSettings = this.merge(require(tmpSettings.DefaultConfigFile), tmpSettings);
            } catch (pException) {
              // Why this?  Often for an app we want settings to work out of the box, but
              // would potentially want to have a config file for complex settings.
              console.log('Fable-Settings Warning: Default configuration file specified but there was a problem loading it.  Falling back to base.');
              console.log('     Loading Exception: ' + pException);
            }
          }
          if (tmpSettings.ConfigFile) {
            try {
              // If there is a configuration file, try to load and merge it.
              tmpSettings = this.merge(require(tmpSettings.ConfigFile), tmpSettings);
            } catch (pException) {
              // Why this?  Often for an app we want settings to work out of the box, but
              // would potentially want to have a config file for complex settings.
              console.log('Fable-Settings Warning: Configuration file specified but there was a problem loading it.  Falling back to base.');
              console.log('     Loading Exception: ' + pException);
            }
          }
          this.settings = tmpSettings;
        }

        // Build a default settings object.  Use the JSON jimmy to ensure it is always a new object.
        buildDefaultSettings() {
          return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')));
        }

        // Update the configuration for environment variable templating based on the current settings object
        _configureEnvTemplating(pSettings) {
          // default environment variable templating to on
          this._PerformEnvTemplating = !pSettings || pSettings.NoEnvReplacement !== true;
        }

        // Resolve (recursive) any environment variables found in settings object.
        _resolveEnv(pSettings) {
          for (const tmpKey in pSettings) {
            if (typeof pSettings[tmpKey] === 'object') {
              this._resolveEnv(pSettings[tmpKey]);
            } else if (typeof pSettings[tmpKey] === 'string') {
              pSettings[tmpKey] = this.settingsTemplateProcessor.parseSetting(pSettings[tmpKey]);
            }
          }
        }

        /**
         * Check to see if a value is an object (but not an array).
         */
        _isObject(value) {
          return typeof value === 'object' && !Array.isArray(value);
        }

        /**
         * Merge two plain objects. Keys that are objects in both will be merged property-wise.
         */
        _deepMergeObjects(toObject, fromObject) {
          if (!fromObject || !this._isObject(fromObject)) {
            return;
          }
          Object.keys(fromObject).forEach(key => {
            const fromValue = fromObject[key];
            if (this._isObject(fromValue)) {
              const toValue = toObject[key];
              if (toValue && this._isObject(toValue)) {
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
        merge(pSettingsFrom, pSettingsTo) {
          // If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
          let tmpSettingsFrom = typeof pSettingsFrom === 'object' ? pSettingsFrom : {};
          // Default to the settings object if none is passed in for the merge.
          let tmpSettingsTo = typeof pSettingsTo === 'object' ? pSettingsTo : this.settings;

          // do not mutate the From object property values
          let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));
          tmpSettingsTo = this._deepMergeObjects(tmpSettingsTo, tmpSettingsFromCopy);
          if (this._PerformEnvTemplating) {
            this._resolveEnv(tmpSettingsTo);
          }
          // Update env tempating config, since we just updated the config object, and it may have changed
          this._configureEnvTemplating(tmpSettingsTo);
          return tmpSettingsTo;
        }

        // Fill in settings gaps without overwriting settings that are already there
        fill(pSettingsFrom) {
          // If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
          let tmpSettingsFrom = typeof pSettingsFrom === 'object' ? pSettingsFrom : {};

          // do not mutate the From object property values
          let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));
          this.settings = this._deepMergeObjects(tmpSettingsFromCopy, this.settings);
          return this.settings;
        }
      }
      ;

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new FableSettings(pSettings);
      }
      module.exports = {
        new: autoConstruct,
        FableSettings: FableSettings
      };
    }, {
      "./Fable-Settings-Default": 6,
      "./Fable-Settings-TemplateProcessor.js": 7,
      "precedent": 11
    }],
    9: [function (require, module, exports) {
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
      class RandomBytes {
        constructor() {
          // getRandomValues needs to be invoked in a context where "this" is a Crypto
          // implementation. Also, find the complete implementation of crypto on IE11.
          this.getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
        }

        // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
        generateWhatWGBytes() {
          let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

          this.getRandomValues(tmpBuffer);
          return tmpBuffer;
        }

        // Math.random()-based (RNG)
        generateRandomBytes() {
          // If all else fails, use Math.random().  It's fast, but is of unspecified
          // quality.
          let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

          for (let i = 0, tmpValue; i < 16; i++) {
            if ((i & 0x03) === 0) {
              tmpValue = Math.random() * 0x100000000;
            }
            tmpBuffer[i] = tmpValue >>> ((i & 0x03) << 3) & 0xff;
          }
          return tmpBuffer;
        }
        generate() {
          if (this.getRandomValues) {
            return this.generateWhatWGBytes();
          } else {
            return this.generateRandomBytes();
          }
        }
      }
      module.exports = RandomBytes;
    }, {}],
    10: [function (require, module, exports) {
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

      var libRandomByteGenerator = require('./Fable-UUID-Random.js');
      class FableUUID {
        constructor(pSettings) {
          // Determine if the module is in "Random UUID Mode" which means just use the random character function rather than the v4 random UUID spec.
          // Note this allows UUIDs of various lengths (including very short ones) although guaranteed uniqueness goes downhill fast.
          this._UUIDModeRandom = typeof pSettings === 'object' && pSettings.hasOwnProperty('UUIDModeRandom') ? pSettings.UUIDModeRandom == true : false;
          // These two properties are only useful if we are in Random mode.  Otherwise it generates a v4 spec
          // Length for "Random UUID Mode" is set -- if not set it to 8
          this._UUIDLength = typeof pSettings === 'object' && pSettings.hasOwnProperty('UUIDLength') ? pSettings.UUIDLength + 0 : 8;
          // Dictionary for "Random UUID Mode"
          this._UUIDRandomDictionary = typeof pSettings === 'object' && pSettings.hasOwnProperty('UUIDDictionary') ? pSettings.UUIDDictionary + 0 : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          this.randomByteGenerator = new libRandomByteGenerator();

          // Lookup table for hex codes
          this._HexLookup = [];
          for (let i = 0; i < 256; ++i) {
            this._HexLookup[i] = (i + 0x100).toString(16).substr(1);
          }
        }

        // Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
        bytesToUUID(pBuffer) {
          let i = 0;
          // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
          return [this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-', this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-', this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-', this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-', this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]]].join('');
        }

        // Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
        generateUUIDv4() {
          let tmpBuffer = new Array(16);
          var tmpRandomBytes = this.randomByteGenerator.generate();

          // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
          tmpRandomBytes[6] = tmpRandomBytes[6] & 0x0f | 0x40;
          tmpRandomBytes[8] = tmpRandomBytes[8] & 0x3f | 0x80;
          return this.bytesToUUID(tmpRandomBytes);
        }

        // Simple random UUID generation
        generateRandom() {
          let tmpUUID = '';
          for (let i = 0; i < this._UUIDLength; i++) {
            tmpUUID += this._UUIDRandomDictionary.charAt(Math.floor(Math.random() * (this._UUIDRandomDictionary.length - 1)));
          }
          return tmpUUID;
        }

        // Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
        getUUID() {
          if (this._UUIDModeRandom) {
            return this.generateRandom();
          } else {
            return this.generateUUIDv4();
          }
        }
      }

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new FableUUID(pSettings);
      }
      module.exports = {
        new: autoConstruct,
        FableUUID: FableUUID
      };
    }, {
      "./Fable-UUID-Random.js": 9
    }],
    11: [function (require, module, exports) {
      /**
      * Precedent Meta-Templating
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Process text streams, parsing out meta-template expressions.
      */
      var libWordTree = require(`./WordTree.js`);
      var libStringParser = require(`./StringParser.js`);
      class Precedent {
        /**
         * Precedent Constructor
         */
        constructor() {
          this.WordTree = new libWordTree();
          this.StringParser = new libStringParser();
          this.ParseTree = this.WordTree.ParseTree;
        }

        /**
         * Add a Pattern to the Parse Tree
         * @method addPattern
         * @param {Object} pTree - A node on the parse tree to push the characters into
         * @param {string} pPattern - The string to add to the tree
         * @param {number} pIndex - callback function
         * @return {bool} True if adding the pattern was successful
         */
        addPattern(pPatternStart, pPatternEnd, pParser) {
          return this.WordTree.addPattern(pPatternStart, pPatternEnd, pParser);
        }

        /**
         * Parse a string with the existing parse tree
         * @method parseString
         * @param {string} pString - The string to parse
         * @return {string} The result from the parser
         */
        parseString(pString) {
          return this.StringParser.parseString(pString, this.ParseTree);
        }
      }
      module.exports = Precedent;
    }, {
      "./StringParser.js": 12,
      "./WordTree.js": 13
    }],
    12: [function (require, module, exports) {
      /**
      * String Parser
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Parse a string, properly processing each matched token in the word tree.
      */

      class StringParser {
        /**
         * StringParser Constructor
         */
        constructor() {}

        /**
         * Create a fresh parsing state object to work with.
         * @method newParserState
         * @param {Object} pParseTree - A node on the parse tree to begin parsing from (usually root)
         * @return {Object} A new parser state object for running a character parser on
         * @private
         */
        newParserState(pParseTree) {
          return {
            ParseTree: pParseTree,
            Output: '',
            OutputBuffer: '',
            Pattern: false,
            PatternMatch: false,
            PatternMatchOutputBuffer: ''
          };
        }

        /**
         * Assign a node of the parser tree to be the next potential match.
         * If the node has a PatternEnd property, it is a valid match and supercedes the last valid match (or becomes the initial match).
         * @method assignNode
         * @param {Object} pNode - A node on the parse tree to assign
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        assignNode(pNode, pParserState) {
          pParserState.PatternMatch = pNode;

          // If the pattern has a END we can assume it has a parse function...
          if (pParserState.PatternMatch.hasOwnProperty('PatternEnd')) {
            // ... this is the legitimate start of a pattern.
            pParserState.Pattern = pParserState.PatternMatch;
          }
        }

        /**
         * Append a character to the output buffer in the parser state.
         * This output buffer is used when a potential match is being explored, or a match is being explored.
         * @method appendOutputBuffer
         * @param {string} pCharacter - The character to append
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        appendOutputBuffer(pCharacter, pParserState) {
          pParserState.OutputBuffer += pCharacter;
        }

        /**
         * Flush the output buffer to the output and clear it.
         * @method flushOutputBuffer
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        flushOutputBuffer(pParserState) {
          pParserState.Output += pParserState.OutputBuffer;
          pParserState.OutputBuffer = '';
        }

        /**
         * Check if the pattern has ended.  If it has, properly flush the buffer and start looking for new patterns.
         * @method checkPatternEnd
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        checkPatternEnd(pParserState) {
          if (pParserState.OutputBuffer.length >= pParserState.Pattern.PatternEnd.length + pParserState.Pattern.PatternStart.length && pParserState.OutputBuffer.substr(-pParserState.Pattern.PatternEnd.length) === pParserState.Pattern.PatternEnd) {
            // ... this is the end of a pattern, cut off the end tag and parse it.
            // Trim the start and end tags off the output buffer now
            pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStart.length + pParserState.Pattern.PatternEnd.length)));
            // Flush the output buffer.
            this.flushOutputBuffer(pParserState);
            // End pattern mode
            pParserState.Pattern = false;
            pParserState.PatternMatch = false;
          }
        }

        /**
         * Parse a character in the buffer.
         * @method parseCharacter
         * @param {string} pCharacter - The character to append
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        parseCharacter(pCharacter, pParserState) {
          // (1) If we aren't in a pattern match, and we aren't potentially matching, and this may be the start of a new pattern....
          if (!pParserState.PatternMatch && pParserState.ParseTree.hasOwnProperty(pCharacter)) {
            // ... assign the node as the matched node.
            this.assignNode(pParserState.ParseTree[pCharacter], pParserState);
            this.appendOutputBuffer(pCharacter, pParserState);
          }
          // (2) If we are in a pattern match (actively seeing if this is part of a new pattern token)
          else if (pParserState.PatternMatch) {
            // If the pattern has a subpattern with this key
            if (pParserState.PatternMatch.hasOwnProperty(pCharacter)) {
              // Continue matching patterns.
              this.assignNode(pParserState.PatternMatch[pCharacter], pParserState);
            }
            this.appendOutputBuffer(pCharacter, pParserState);
            if (pParserState.Pattern) {
              // ... Check if this is the end of the pattern (if we are matching a valid pattern)...
              this.checkPatternEnd(pParserState);
            }
          }
          // (3) If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
          else {
            pParserState.Output += pCharacter;
          }
        }

        /**
         * Parse a string for matches, and process any template segments that occur.
         * @method parseString
         * @param {string} pString - The string to parse.
         * @param {Object} pParseTree - The parse tree to begin parsing from (usually root)
         */
        parseString(pString, pParseTree) {
          let tmpParserState = this.newParserState(pParseTree);
          for (var i = 0; i < pString.length; i++) {
            // TODO: This is not fast.
            this.parseCharacter(pString[i], tmpParserState);
          }
          this.flushOutputBuffer(tmpParserState);
          return tmpParserState.Output;
        }
      }
      module.exports = StringParser;
    }, {}],
    13: [function (require, module, exports) {
      /**
      * Word Tree
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Create a tree (directed graph) of Javascript objects, one character per object.
      */

      class WordTree {
        /**
         * WordTree Constructor
         */
        constructor() {
          this.ParseTree = {};
        }

        /** 
         * Add a child character to a Parse Tree node
         * @method addChild
         * @param {Object} pTree - A parse tree to push the characters into
         * @param {string} pPattern - The string to add to the tree
         * @param {number} pIndex - The index of the character in the pattern
         * @returns {Object} The resulting leaf node that was added (or found)
         * @private
         */
        addChild(pTree, pPattern, pIndex) {
          if (!pTree.hasOwnProperty(pPattern[pIndex])) pTree[pPattern[pIndex]] = {};
          return pTree[pPattern[pIndex]];
        }

        /** Add a Pattern to the Parse Tree
         * @method addPattern
         * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
         * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
         * @param {number} pParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
         * @return {bool} True if adding the pattern was successful
         */
        addPattern(pPatternStart, pPatternEnd, pParser) {
          if (pPatternStart.length < 1) return false;
          if (typeof pPatternEnd === 'string' && pPatternEnd.length < 1) return false;
          let tmpLeaf = this.ParseTree;

          // Add the tree of leaves iteratively
          for (var i = 0; i < pPatternStart.length; i++) tmpLeaf = this.addChild(tmpLeaf, pPatternStart, i);
          tmpLeaf.PatternStart = pPatternStart;
          tmpLeaf.PatternEnd = typeof pPatternEnd === 'string' && pPatternEnd.length > 0 ? pPatternEnd : pPatternStart;
          tmpLeaf.Parse = typeof pParser === 'function' ? pParser : typeof pParser === 'string' ? () => {
            return pParser;
          } : pData => {
            return pData;
          };
          return true;
        }
      }
      module.exports = WordTree;
    }, {}],
    14: [function (require, module, exports) {
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
      function defaultClearTimeout() {
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
      })();
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
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
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
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
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
        while (len) {
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
      process.listeners = function (name) {
        return [];
      };
      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };
    }, {}],
    15: [function (require, module, exports) {
      var libNPMModuleWrapper = require('./Fable.js');
      if (typeof window === 'object' && !window.hasOwnProperty('Fable')) {
        window.Fable = libNPMModuleWrapper;
      }
      module.exports = libNPMModuleWrapper;
    }, {
      "./Fable.js": 17
    }],
    16: [function (require, module, exports) {
      class FableUtility {
        constructor(pFable) {
          this.fable = pFable;
        }

        // Underscore and lodash both had a behavior, _.extend, which merged objects
        // Now that es6 gives us this, use the native thingy.
        extend(pDestinationObject, ...pSourceObjects) {
          return Object.assign(pDestinationObject, ...pSourceObjects);
        }
      }
      module.exports = FableUtility;
    }, {}],
    17: [function (require, module, exports) {
      /**
      * Fable Application Services Support Library
      * @license MIT
      * @author <steven@velozo.com>
      */
      const libFableSettings = require('fable-settings').FableSettings;
      const libFableUUID = require('fable-uuid').FableUUID;
      const libFableLog = require('fable-log').FableLog;
      const libFableUtility = require('./Fable-Utility.js');
      class Fable {
        constructor(pSettings) {
          let tmpSettings = new libFableSettings(pSettings);
          this.settingsManager = tmpSettings;

          // Instantiate the UUID generator
          this.libUUID = new libFableUUID(this.settingsManager.settings);
          this.log = new libFableLog(this.settingsManager.settings);
          this.log.initialize();
          this.Utility = new libFableUtility(this);
        }
        get settings() {
          return this.settingsManager.settings;
        }
        get fable() {
          return this;
        }
        getUUID() {
          return this.libUUID.getUUID();
        }
      }
      module.exports = Fable;
    }, {
      "./Fable-Utility.js": 16,
      "fable-log": 5,
      "fable-settings": 8,
      "fable-uuid": 10
    }]
  }, {}, [15])(15);
});