"use strict";

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
      'use strict';

      var eachOfLimit = require('async.util.eachoflimit');
      var withoutIndex = require('async.util.withoutindex');
      module.exports = function eachLimit(arr, limit, iterator, cb) {
        return eachOfLimit(limit)(arr, withoutIndex(iterator), cb);
      };
    }, {
      "async.util.eachoflimit": 3,
      "async.util.withoutindex": 14
    }],
    2: [function (require, module, exports) {
      'use strict';

      module.exports = function (tasks) {
        function makeCallback(index) {
          function fn() {
            if (tasks.length) {
              tasks[index].apply(null, arguments);
            }
            return fn.next();
          }
          fn.next = function () {
            return index < tasks.length - 1 ? makeCallback(index + 1) : null;
          };
          return fn;
        }
        return makeCallback(0);
      };
    }, {}],
    3: [function (require, module, exports) {
      var once = require('async.util.once');
      var noop = require('async.util.noop');
      var onlyOnce = require('async.util.onlyonce');
      var keyIterator = require('async.util.keyiterator');
      module.exports = function eachOfLimit(limit) {
        return function (obj, iterator, cb) {
          cb = once(cb || noop);
          obj = obj || [];
          var nextKey = keyIterator(obj);
          if (limit <= 0) {
            return cb(null);
          }
          var done = false;
          var running = 0;
          var errored = false;
          (function replenish() {
            if (done && running <= 0) {
              return cb(null);
            }
            while (running < limit && !errored) {
              var key = nextKey();
              if (key === null) {
                done = true;
                if (running <= 0) {
                  cb(null);
                }
                return;
              }
              running += 1;
              iterator(obj[key], key, onlyOnce(function (err) {
                running -= 1;
                if (err) {
                  cb(err);
                  errored = true;
                } else {
                  replenish();
                }
              }));
            }
          })();
        };
      };
    }, {
      "async.util.keyiterator": 7,
      "async.util.noop": 9,
      "async.util.once": 10,
      "async.util.onlyonce": 11
    }],
    4: [function (require, module, exports) {
      'use strict';

      var setImmediate = require('async.util.setimmediate');
      var restParam = require('async.util.restparam');
      module.exports = function (fn) {
        return restParam(function (args) {
          var callback = args.pop();
          args.push(function () {
            var innerArgs = arguments;
            if (sync) {
              setImmediate(function () {
                callback.apply(null, innerArgs);
              });
            } else {
              callback.apply(null, innerArgs);
            }
          });
          var sync = true;
          fn.apply(this, args);
          sync = false;
        });
      };
    }, {
      "async.util.restparam": 12,
      "async.util.setimmediate": 13
    }],
    5: [function (require, module, exports) {
      'use strict';

      module.exports = Array.isArray || function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };
    }, {}],
    6: [function (require, module, exports) {
      'use strict';

      var isArray = require('async.util.isarray');
      module.exports = function isArrayLike(arr) {
        return isArray(arr) ||
        // has a positive integer length property
        typeof arr.length === 'number' && arr.length >= 0 && arr.length % 1 === 0;
      };
    }, {
      "async.util.isarray": 5
    }],
    7: [function (require, module, exports) {
      'use strict';

      var _keys = require('async.util.keys');
      var isArrayLike = require('async.util.isarraylike');
      module.exports = function keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (isArrayLike(coll)) {
          len = coll.length;
          return function next() {
            i++;
            return i < len ? i : null;
          };
        } else {
          keys = _keys(coll);
          len = keys.length;
          return function next() {
            i++;
            return i < len ? keys[i] : null;
          };
        }
      };
    }, {
      "async.util.isarraylike": 6,
      "async.util.keys": 8
    }],
    8: [function (require, module, exports) {
      'use strict';

      module.exports = Object.keys || function keys(obj) {
        var _keys = [];
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            _keys.push(k);
          }
        }
        return _keys;
      };
    }, {}],
    9: [function (require, module, exports) {
      'use strict';

      module.exports = function noop() {};
    }, {}],
    10: [function (require, module, exports) {
      'use strict';

      module.exports = function once(fn) {
        return function () {
          if (fn === null) return;
          fn.apply(this, arguments);
          fn = null;
        };
      };
    }, {}],
    11: [function (require, module, exports) {
      'use strict';

      module.exports = function only_once(fn) {
        return function () {
          if (fn === null) throw new Error('Callback was already called.');
          fn.apply(this, arguments);
          fn = null;
        };
      };
    }, {}],
    12: [function (require, module, exports) {
      'use strict';

      module.exports = function restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
          var length = Math.max(arguments.length - startIndex, 0);
          var rest = new Array(length);
          for (var index = 0; index < length; index++) {
            rest[index] = arguments[index + startIndex];
          }
          switch (startIndex) {
            case 0:
              return func.call(this, rest);
            case 1:
              return func.call(this, arguments[0], rest);
          }
        };
      };
    }, {}],
    13: [function (require, module, exports) {
      (function (setImmediate) {
        (function () {
          'use strict';

          var _setImmediate = typeof setImmediate === 'function' && setImmediate;
          var fallback = function fallback(fn) {
            setTimeout(fn, 0);
          };
          module.exports = function setImmediate(fn) {
            // not a direct alias for IE10 compatibility
            return (_setImmediate || fallback)(fn);
          };
        }).call(this);
      }).call(this, require("timers").setImmediate);
    }, {
      "timers": 34
    }],
    14: [function (require, module, exports) {
      'use strict';

      module.exports = function withoutIndex(iterator) {
        return function (value, index, callback) {
          return iterator(value, callback);
        };
      };
    }, {}],
    15: [function (require, module, exports) {
      'use strict';

      var once = require('async.util.once');
      var noop = require('async.util.noop');
      var isArray = require('async.util.isarray');
      var restParam = require('async.util.restparam');
      var ensureAsync = require('async.util.ensureasync');
      var iterator = require('async.iterator');
      module.exports = function (tasks, cb) {
        cb = once(cb || noop);
        if (!isArray(tasks)) return cb(new Error('First argument to waterfall must be an array of functions'));
        if (!tasks.length) return cb();
        function wrapIterator(iterator) {
          return restParam(function (err, args) {
            if (err) {
              cb.apply(null, [err].concat(args));
            } else {
              var next = iterator.next();
              if (next) {
                args.push(wrapIterator(next));
              } else {
                args.push(cb);
              }
              ensureAsync(iterator).apply(null, args);
            }
          });
        }
        wrapIterator(iterator(tasks))();
      };
    }, {
      "async.iterator": 2,
      "async.util.ensureasync": 4,
      "async.util.isarray": 5,
      "async.util.noop": 9,
      "async.util.once": 10,
      "async.util.restparam": 12
    }],
    16: [function (require, module, exports) {}, {}],
    17: [function (require, module, exports) {
      /**
      * @license MIT
      * @author <steven@velozo.com>
      */

      /**
      * Data Arithmatic
      *
      * @class DataArithmatic
      */
      class DataArithmatic {
        constructor() {
          // Regular Expressions (so they don't have to be recompiled every time)
          // These could be defined as static, but I'm not sure if that will work with browserify ... and specifically the QT browser.
          this._Regex_formatterInsertCommas = /.{1,3}/g;
          // Match Function:
          // function(pMatch, pSign, pZeros, pBefore, pDecimal, pAfter)
          // Thoughts about below:   /^([+-]?)(0*)(\d+)(\.(\d+))?$/;
          this._Regex_formatterAddCommasToNumber = /^([-+]?)(0?)(\d+)(.?)(\d+)$/g;
          this._Regex_formatterDollarsRemoveCommas = /,/gi;
          this._Regex_formatterCleanNonAlpha = /[^a-z0-9]/gi;

          // TODO: Potentially pull these in from a configuration.
          // TODO: Use locale data for this if it's defaults all the way down.
          this._Value_MoneySign_Currency = '$';
          this._Value_NaN_Currency = '--';
          this._Value_GroupSeparator_Number = ',';
          this._Value_Prefix_StringHash = 'HSH';
          this._Value_Clean_formatterCleanNonAlpha = '_';
          this._UseEngineStringStartsWith = typeof String.prototype.startsWith === 'function';
          this._UseEngineStringEndsWith = typeof String.prototype.endsWith === 'function';
        }

        /*************************************************************************
         * String Manipulation and Comparison Functions
         *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

        /**
         * Reverse a string
         *
         * @param {string} pString - The string to reverse
         * @returns {string}
         */
        stringReverse(pString) {
          // TODO: Benchmark if there are faster ways we want to do this with all the newer JS stuff
          //       ... and if it will work with browserify in a clean way.
          return pString.split('').reverse().join('');
        }

        /**
         * Test if a string starts with a given substring.
         *
         * @param {*} pString
         * @param {*} pSearchString
         * @param {*} pStartIndex
         * @returns {*}
         */
        stringStartsWith(pString, pSearchString, pStartIndex) {
          if (this._UseEngineStringStartsWith) {
            return pString.startsWith(pSearchString, pStartIndex);
          } else {
            return this.stringStartsWith_Polyfill.call(pString, pSearchString, pStartIndex);
          }
        }

        /**
         * Check if a string starts with a given substring.  This is a safe polyfill for the ES6 string.startsWith() function.
         *
         * @param {*} pSearchString - The string to search for
         * @param {*} pStartIndex - The index to start the search at
         * @returns {boolean}
         */
        stringStartsWith_Polyfill(pSearchString, pStartIndex) {
          return this.slice(pStartIndex || 0, pSearchString.length) === pSearchString;
        }

        /**
         * Test if a string starts with a given substring.
         *
         * @param {*} pString
         * @param {*} pSearchString
         * @param {*} pEndIndex
         * @returns {*}
         */
        stringEndsWith(pString, pSearchString, pEndIndex) {
          if (this._UseEngineStringEndsWith) {
            return pString.endsWith(pSearchString, pEndIndex);
          } else {
            return this.stringEndsWith_Polyfill.call(pString, pSearchString, pEndIndex);
          }
        }

        /**
         * Check if a string starts with a given substring.  This is a safe polyfill for the ES6 string.startsWith() function.
         *
         * @param {*} pSearchString - The string to search for
         * @param {*} pEndIndex - The index to end the search at
         * @returns {boolean}
         */
        stringEndsWith_Polyfill(pSearchString, pEndIndex) {
          // This works much better than >= because
          // it compensates for NaN:
          if (!(pEndIndex < this.length)) {
            pEndIndex = this.length;
          } else {
            pEndIndex |= 0; // round position
          }

          return this.substr(pEndIndex - pSearchString.length, pSearchString.length) === pSearchString;
        }

        /**
         * Generate an insecure string hash.  Not meant to be secure, just a quick way to generate a hash for a string.  This is not a cryptographic hash.  Additional warranty and disclaimer ... this is not for passwords!
         *
         * @param {string} pString
         * @returns {string}
         */
        insecureStringHash(pString) {
          let tmpHash = 0;
          let tmpStringLength = pString.length;
          let tmpCharacterIndex = 0;
          while (tmpCharacterIndex < tmpStringLength) {
            tmpHash = (tmpHash << 5) - tmpHash + pString.charCodeAt(tmpCharacterIndex++) | 0;
          }
          return "".concat(this._Value_Prefix_StringHash).concat(tmpHash);
        }

        /**
         * Clean wrapping characters if they exist consistently around the string.  If they do not, the string is returned unchanged.
         *
         * @param {string} pWrapCharacter - The character expected as the wrapping character
         * @param {string} pString - the string to clean
         * @returns {string}
         */
        cleanEnclosureWrapCharacters(pWrapCharacter, pString) {
          // # Use case from ManyFest DSL:
          //
          // When a boxed property is passed in, it should have quotes of some
          // kind around it.
          //
          // For instance:
          // 		MyValues['Name']
          // 		MyValues["Age"]
          // 		MyValues[`Cost`]
          //
          // This function is necessary to remove the wrapping quotes before object
          // resolution can occur.
          if (pString.startsWith(pWrapCharacter) && pString.endsWith(pWrapCharacter)) {
            return pString.substring(1, pString.length - 1);
          } else {
            return pString;
          }
        }

        /**
         *
         * @param {*} pString
         * @returns
         */
        cleanNonAlphaCharacters(pString) {
          if (typeof pString == 'string' && pString != '') {
            return pString.replace(this._Regex_formatterCleanNonAlpha, this._Value_Clean_formatterCleanNonAlpha);
          }
        }

        /*************************************************************************
         * Number Formatting Functions
         *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

        /**
         * Insert commas every 3 characters from the right.  Used by formatterAddCommasToNumber().
         *
         * @param {*} pString
         * @returns {*}
         */
        formatterInsertCommas(pString) {
          // Reverse, because it's easier to do things from the left, given arbitrary digit counts
          let tmpReversed = this.stringReverse(pString);
          // Add commas every three characters
          let tmpReversedWithCommas = tmpReversed.match(this._Regex_formatterInsertCommas).join(',');
          // Reverse again (back to normal direction)
          return this.stringReverse(tmpReversedWithCommas);
        }
        processAddCommasToNumberRegex(pMatch, pSign, pZeros, pBefore, pDecimal, pAfter) {
          // If there was no decimal, the last capture grabs the final digit, so
          // we have to put it back together with the 'before' substring
          return pSign + (pDecimal ? this.formatterInsertCommas(pBefore) + pDecimal + pAfter : this.formatterInsertCommas(pBefore + pAfter));
        }

        /**
         * Add Commas to a Number for readability.
         *
         * @param {*} pNumber
         * @returns {string}
         */
        formatterAddCommasToNumber(pNumber) {
          // If the regex doesn't match, `replace` returns the string unmodified
          return pNumber.toString().replace(this._Regex_formatterAddCommasToNumber, this.processAddCommasToNumberRegex.bind(this));
        }

        /**
         * This will take a number and format it as a dollar string.  It will also add commas to the number.  If the number is not a number, it will return '--'.
         *
         * @param {*} pValue
         * @returns {string}
         */
        formatterDollars(pValue) {
          let tmpDollarAmount = parseFloat(pValue).toFixed(2);
          if (isNaN(tmpDollarAmount)) {
            // Try again and see if what was passed in was a dollars string.
            if (typeof pValue == 'string') {
              // TODO: Better rounding function?  This is a hack to get rid of the currency symbol and commas.
              tmpDollarAmount = parseFloat(pValue.replace(this._Value_MoneySign_Currency, '').replace(this._Regex_formatterDollarsRemoveCommas, '')).toFixed(2);
            }
            // If we didn't get a number, return the "not a number" string.
            if (isNaN(tmpDollarAmount)) {
              return this._Value_NaN_Currency;
            }
          }

          // TODO: Get locale data and use that for this stuff.
          return "$".concat(this.formatterAddCommasToNumber(tmpDollarAmount));
        }

        /**
         * Round a number to a certain number of digits.  If the number is not a number, it will return 0.  If no digits are specified, it will default to 2 significant digits.
         *
         * @param {*} pValue
         * @param {number} pDigits
         * @returns {string}
         */
        formatterRoundNumber(pValue, pDigits) {
          let tmpDigits = typeof pDigits == 'undefined' ? 2 : pDigits;
          let tmpValue = Number.parseFloat(pValue).toFixed(tmpDigits);
          if (isNaN(tmpValue)) {
            let tmpZed = 0;
            return tmpZed.toFixed(tmpDigits);
          } else {
            return tmpValue;
          }
        }

        /*************************************************************************
         * String Tokenization Functions
         *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

        /**
         * Return the string before the matched substring.
         *
         * If the substring is not found, the entire string is returned.  This only deals with the *first* match.
         *
         * @param {string} pString
         * @param {string} pMatch
         * @returns {string}
         */
        stringBeforeMatch(pString, pMatch) {
          return pString.split(pMatch)[0];
        }

        /**
         * Return the string after the matched substring.
         *
         * If the substring is not found, an empty string is returned.  This only deals with the *first* match.
         *
         * @param {string} pString
         * @param {string} pMatch
         * @returns {string}
         */
        stringAfterMatch(pString, pMatch) {
          let tmpStringSplitLocation = pString.indexOf(pMatch);
          if (tmpStringSplitLocation < 0 || tmpStringSplitLocation + pMatch.length >= pString.length) {
            return '';
          }
          return pString.substring(tmpStringSplitLocation + pMatch.length);
        }

        /**
         * Count the number of enclosures in a string based on the start and end characters.
         *
         * If no start or end characters are specified, it will default to parentheses.  If the string is not a string, it will return 0.
         *
         * @param {string} pString
         * @param {string} pEnclosureStart
         * @param {string} pEnclosureEnd
         * @returns the count of full in the string
         */
        stringCountEnclosures(pString, pEnclosureStart, pEnclosureEnd) {
          let tmpString = typeof pString == 'string' ? pString : '';
          let tmpEnclosureStart = typeof pEnclosureStart == 'string' ? pEnclosureStart : '(';
          let tmpEnclosureEnd = typeof pEnclosureEnd == 'string' ? pEnclosureEnd : ')';
          let tmpEnclosureCount = 0;
          let tmpEnclosureDepth = 0;
          for (let i = 0; i < tmpString.length; i++) {
            // This is the start of an enclosure
            if (tmpString[i] == tmpEnclosureStart) {
              if (tmpEnclosureDepth == 0) {
                tmpEnclosureCount++;
              }
              tmpEnclosureDepth++;
            } else if (tmpString[i] == tmpEnclosureEnd) {
              tmpEnclosureDepth--;
            }
          }
          return tmpEnclosureCount;
        }

        /**
         * Get the value of the enclosure at the specified index.
         *
         * If the index is not a number, it will default to 0.  If the string is not a string, it will return an empty string.  If the enclosure is not found, it will return an empty string.  If the enclosure
         *
         * @param {string} pString
         * @param {number} pEnclosureIndexToGet
         * @param {string} pEnclosureStart
         * @param {string}} pEnclosureEnd
         * @returns {string}
         */
        stringGetEnclosureValueByIndex(pString, pEnclosureIndexToGet, pEnclosureStart, pEnclosureEnd) {
          let tmpString = typeof pString == 'string' ? pString : '';
          let tmpEnclosureIndexToGet = typeof pEnclosureIndexToGet == 'number' ? pEnclosureIndexToGet : 0;
          let tmpEnclosureStart = typeof pEnclosureStart == 'string' ? pEnclosureStart : '(';
          let tmpEnclosureEnd = typeof pEnclosureEnd == 'string' ? pEnclosureEnd : ')';
          let tmpEnclosureCount = 0;
          let tmpEnclosureDepth = 0;
          let tmpMatchedEnclosureIndex = false;
          let tmpEnclosedValueStartIndex = 0;
          let tmpEnclosedValueEndIndex = 0;
          for (let i = 0; i < tmpString.length; i++) {
            // This is the start of an enclosure
            if (tmpString[i] == tmpEnclosureStart) {
              tmpEnclosureDepth++;

              // Only count enclosures at depth 1, but still this parses both pairs of all of them.
              if (tmpEnclosureDepth == 1) {
                tmpEnclosureCount++;
                if (tmpEnclosureIndexToGet == tmpEnclosureCount - 1) {
                  // This is the start of *the* enclosure
                  tmpMatchedEnclosureIndex = true;
                  tmpEnclosedValueStartIndex = i;
                }
              }
            }
            // This is the end of an enclosure
            else if (tmpString[i] == tmpEnclosureEnd) {
              tmpEnclosureDepth--;

              // Again, only count enclosures at depth 1, but still this parses both pairs of all of them.
              if (tmpEnclosureDepth == 0 && tmpMatchedEnclosureIndex && tmpEnclosedValueEndIndex <= tmpEnclosedValueStartIndex) {
                tmpEnclosedValueEndIndex = i;
                tmpMatchedEnclosureIndex = false;
              }
            }
          }
          if (tmpEnclosureCount <= tmpEnclosureIndexToGet) {
            // Return an empty string if the enclosure is not found
            return '';
          }
          if (tmpEnclosedValueEndIndex > 0 && tmpEnclosedValueEndIndex > tmpEnclosedValueStartIndex) {
            return tmpString.substring(tmpEnclosedValueStartIndex + 1, tmpEnclosedValueEndIndex);
          } else {
            return tmpString.substring(tmpEnclosedValueStartIndex + 1);
          }
        }

        /**
         * Remove an enclosure from a string based on the index of the enclosure.
         *
         * @param {string} pString
         * @param {number} pEnclosureIndexToRemove
         * @param {number} pEnclosureStart
         * @param {number} pEnclosureEnd
         * @returns {string}
         */
        stringRemoveEnclosureByIndex(pString, pEnclosureIndexToRemove, pEnclosureStart, pEnclosureEnd) {
          let tmpString = typeof pString == 'string' ? pString : '';
          let tmpEnclosureIndexToRemove = typeof pEnclosureIndexToRemove == 'number' ? pEnclosureIndexToRemove : 0;
          let tmpEnclosureStart = typeof pEnclosureStart == 'string' ? pEnclosureStart : '(';
          let tmpEnclosureEnd = typeof pEnclosureEnd == 'string' ? pEnclosureEnd : ')';
          let tmpEnclosureCount = 0;
          let tmpEnclosureDepth = 0;
          let tmpMatchedEnclosureIndex = false;
          let tmpEnclosureStartIndex = 0;
          let tmpEnclosureEndIndex = 0;
          for (let i = 0; i < tmpString.length; i++) {
            // This is the start of an enclosure
            if (tmpString[i] == tmpEnclosureStart) {
              tmpEnclosureDepth++;
              if (tmpEnclosureDepth == 1) {
                tmpEnclosureCount++;
                if (tmpEnclosureIndexToRemove == tmpEnclosureCount - 1) {
                  tmpMatchedEnclosureIndex = true;
                  tmpEnclosureStartIndex = i;
                }
              }
            } else if (tmpString[i] == tmpEnclosureEnd) {
              tmpEnclosureDepth--;
              if (tmpEnclosureDepth == 0 && tmpMatchedEnclosureIndex && tmpEnclosureEndIndex <= tmpEnclosureStartIndex) {
                tmpEnclosureEndIndex = i;
                tmpMatchedEnclosureIndex = false;
              }
            }
          }
          if (tmpEnclosureCount <= tmpEnclosureIndexToRemove) {
            return tmpString;
          }
          let tmpReturnString = '';
          if (tmpEnclosureStartIndex > 1) {
            tmpReturnString = tmpString.substring(0, tmpEnclosureStartIndex);
          }
          if (tmpString.length > tmpEnclosureEndIndex + 1 && tmpEnclosureEndIndex > tmpEnclosureStartIndex) {
            tmpReturnString += tmpString.substring(tmpEnclosureEndIndex + 1);
          }
          return tmpReturnString;
        }
      }
      module.exports = DataArithmatic;
    }, {}],
    18: [function (require, module, exports) {
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
          this._Settings = typeof pLogStreamSettings == 'object' ? pLogStreamSettings : {};

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
    19: [function (require, module, exports) {
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
      "./Fable-Log-Logger-Console.js": 21
    }],
    20: [function (require, module, exports) {
      module.exports = [{
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
      }];
    }, {}],
    21: [function (require, module, exports) {
      let libBaseLogger = require('./Fable-Log-BaseLogger.js');
      class ConsoleLogger extends libBaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings);
          this._ShowTimeStamps = this._Settings.hasOwnProperty('showtimestamps') ? this._Settings.showtimestamps == true : true;
          this._FormattedTimeStamps = this._Settings.hasOwnProperty('formattedtimestamps') ? this._Settings.formattedtimestamps == true : true;
          this._ContextMessage = this._Settings.hasOwnProperty('Context') ? "(".concat(this._Settings.Context, ")") : pFableLog._Settings.hasOwnProperty('Product') ? "(".concat(pFableLog._Settings.Product, ")") : 'Unnamed_Log_Context';

          // Allow the user to decide what gets output to the console
          this._OutputLogLinesToConsole = this._Settings.hasOwnProperty('outputloglinestoconsole') ? this._Settings.outputloglinestoconsole : true;
          this._OutputObjectsToConsole = this._Settings.hasOwnProperty('outputobjectstoconsole') ? this._Settings.outputobjectstoconsole : true;

          // Precompute the prefix for each level
          this.prefixCache = {};
          for (let i = 0; i <= this.levels.length; i++) {
            this.prefixCache[this.levels[i]] = "[".concat(this.levels[i], "] ").concat(this._ContextMessage, ": ");
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
          let tmpLogLine = "".concat(tmpTimeStamp).concat(this.prefixCache[pLevel]).concat(pLogText);
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
      "./Fable-Log-BaseLogger.js": 18
    }],
    22: [function (require, module, exports) {
      const libConsoleLog = require('./Fable-Log-Logger-Console.js');
      const libFS = require('fs');
      const libPath = require('path');
      class SimpleFlatFileLogger extends libConsoleLog {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings, pFableLog);

          // If a path isn't provided for the logfile, it tries to use the ProductName or Context
          this.logFileRawPath = this._Settings.hasOwnProperty('path') ? this._Settings.path : "./".concat(this._ContextMessage, ".log");
          this.logFilePath = libPath.normalize(this.logFileRawPath);
          this.logFileStreamOptions = this._Settings.hasOwnProperty('fileStreamoptions') ? this._Settings.fileStreamOptions : {
            "flags": "a",
            "encoding": "utf8"
          };
          this.fileWriter = libFS.createWriteStream(this.logFilePath, this.logFileStreamOptions);
          this.activelyWriting = false;
          this.logLineStrings = [];
          this.logObjectStrings = [];
          this.defaultWriteCompleteCallback = () => {};
          this.defaultBufferFlushCallback = () => {};
        }
        closeWriter(fCloseComplete) {
          let tmpCloseComplete = typeof fCloseComplete == 'function' ? fCloseComplete : () => {};
          if (this.fileWriter) {
            this.fileWriter.end('\n');
            return this.fileWriter.once('finish', tmpCloseComplete.bind(this));
          }
        }
        completeBufferFlushToLogFile(fFlushComplete) {
          this.activelyWriting = false;
          let tmpFlushComplete = typeof fFlushComplete == 'function' ? fFlushComplete : this.defaultBufferFlushCallback;
          if (this.logLineStrings.length > 0) {
            this.flushBufferToLogFile(tmpFlushComplete);
          } else {
            return tmpFlushComplete();
          }
        }
        flushBufferToLogFile(fFlushComplete) {
          if (!this.activelyWriting) {
            // Only want to be writing one thing at a time....
            this.activelyWriting = true;
            let tmpFlushComplete = typeof fFlushComplete == 'function' ? fFlushComplete : this.defaultBufferFlushCallback;

            // Get the current buffer arrays.  These should always have matching number of elements.
            let tmpLineStrings = this.logLineStrings;
            let tmpObjectStrings = this.logObjectStrings;

            // Reset these to be filled while we process this queue...
            this.logLineStrings = [];
            this.logObjectStrings = [];

            // This is where we will put each line before writing it to the file...
            let tmpConstructedBufferOutputString = '';
            for (let i = 0; i < tmpLineStrings.length; i++) {
              // TODO: Windows Newline?   ....... yo no se!
              tmpConstructedBufferOutputString += "".concat(tmpLineStrings[i], "\n");
              if (tmpObjectStrings[i] !== false) {
                tmpConstructedBufferOutputString += "".concat(tmpObjectStrings[i], "\n");
              }
            }
            if (!this.fileWriter.write(tmpConstructedBufferOutputString, 'utf8')) {
              // If the streamwriter returns false, we need to wait for it to drain.
              this.fileWriter.once('drain', this.completeBufferFlushToLogFile.bind(this, tmpFlushComplete));
            } else {
              return this.completeBufferFlushToLogFile(tmpFlushComplete);
            }
          }
        }
        write(pLevel, pLogText, pObject) {
          let tmpLogLine = super.write(pLevel, pLogText, pObject);

          // Use a very simple array as the write buffer
          this.logLineStrings.push(tmpLogLine);

          // Write out the object on a separate line if it is passed in
          if (typeof pObject !== 'undefined') {
            this.logObjectStrings.push(JSON.stringify(pObject, null, 4));
          } else {
            this.logObjectStrings.push(false);
          }
          this.flushBufferToLogFile();
        }
      }
      module.exports = SimpleFlatFileLogger;
    }, {
      "./Fable-Log-Logger-Console.js": 21,
      "fs": 16,
      "path": 29
    }],
    23: [function (require, module, exports) {
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
              console.log("Error initializing log stream: bad loggertype in stream definition ".concat(JSON.stringify(tmpStreamDefinition)));
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
          this.info("".concat(tmpMessage, " ").concat(tmpTime, " (epoch ").concat(+tmpTime, ")"), pDatum);
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
          this.info("".concat(tmpMessage, " logged at (epoch ").concat(+tmpEndTime, ") took (").concat(pTimeDelta, "ms)"), pDatum);
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
          this.info("".concat(tmpMessage, " logged at (epoch ").concat(+tmpEndTime, ") took (").concat(pTimeDelta, "ms) or (").concat(tmpHours, ":").concat(tmpMinutes, ":").concat(tmpSeconds, ".").concat(tmpMs, ")"), pDatum);
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
      module.exports = FableLog;
      module.exports.new = autoConstruct;
      module.exports.LogProviderBase = require('./Fable-Log-BaseLogger.js');
      module.exports.LogProviderConsole = require('./Fable-Log-Logger-Console.js');
      module.exports.LogProviderConsole = require('./Fable-Log-Logger-SimpleFlatFile.js');
    }, {
      "./Fable-Log-BaseLogger.js": 18,
      "./Fable-Log-DefaultProviders-Node.js": 19,
      "./Fable-Log-DefaultStreams.json": 20,
      "./Fable-Log-Logger-Console.js": 21,
      "./Fable-Log-Logger-SimpleFlatFile.js": 22
    }],
    24: [function (require, module, exports) {
      module.exports = {
        "Product": "ApplicationNameHere",
        "ProductVersion": "0.0.0",
        "ConfigFile": false,
        "LogStreams": [{
          "level": "trace"
        }]
      };
    }, {}],
    25: [function (require, module, exports) {
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
      "_process": 33
    }],
    26: [function (require, module, exports) {
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
      module.exports = FableSettings;
      module.exports.new = autoConstruct;
      module.exports.precedent = libPrecedent;
    }, {
      "./Fable-Settings-Default": 24,
      "./Fable-Settings-TemplateProcessor.js": 25,
      "precedent": 30
    }],
    27: [function (require, module, exports) {
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
    28: [function (require, module, exports) {
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
      module.exports = FableUUID;
      module.exports.new = autoConstruct;
    }, {
      "./Fable-UUID-Random.js": 27
    }],
    29: [function (require, module, exports) {
      (function (process) {
        (function () {
          // 'path' module extracted from Node.js v8.11.1 (only the posix part)
          // transplited with Babel

          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict';

          function assertPath(path) {
            if (typeof path !== 'string') {
              throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
            }
          }

          // Resolves . and .. elements in a path with directory names
          function normalizeStringPosix(path, allowAboveRoot) {
            var res = '';
            var lastSegmentLength = 0;
            var lastSlash = -1;
            var dots = 0;
            var code;
            for (var i = 0; i <= path.length; ++i) {
              if (i < path.length) code = path.charCodeAt(i);else if (code === 47 /*/*/) break;else code = 47 /*/*/;
              if (code === 47 /*/*/) {
                if (lastSlash === i - 1 || dots === 1) {
                  // NOOP
                } else if (lastSlash !== i - 1 && dots === 2) {
                  if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
                    if (res.length > 2) {
                      var lastSlashIndex = res.lastIndexOf('/');
                      if (lastSlashIndex !== res.length - 1) {
                        if (lastSlashIndex === -1) {
                          res = '';
                          lastSegmentLength = 0;
                        } else {
                          res = res.slice(0, lastSlashIndex);
                          lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                      }
                    } else if (res.length === 2 || res.length === 1) {
                      res = '';
                      lastSegmentLength = 0;
                      lastSlash = i;
                      dots = 0;
                      continue;
                    }
                  }
                  if (allowAboveRoot) {
                    if (res.length > 0) res += '/..';else res = '..';
                    lastSegmentLength = 2;
                  }
                } else {
                  if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
                  lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
              } else if (code === 46 /*.*/ && dots !== -1) {
                ++dots;
              } else {
                dots = -1;
              }
            }
            return res;
          }
          function _format(sep, pathObject) {
            var dir = pathObject.dir || pathObject.root;
            var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
            if (!dir) {
              return base;
            }
            if (dir === pathObject.root) {
              return dir + base;
            }
            return dir + sep + base;
          }
          var posix = {
            // path.resolve([from ...], to)
            resolve: function resolve() {
              var resolvedPath = '';
              var resolvedAbsolute = false;
              var cwd;
              for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path;
                if (i >= 0) path = arguments[i];else {
                  if (cwd === undefined) cwd = process.cwd();
                  path = cwd;
                }
                assertPath(path);

                // Skip empty entries
                if (path.length === 0) {
                  continue;
                }
                resolvedPath = path + '/' + resolvedPath;
                resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
              }

              // At this point the path should be resolved to a full absolute path, but
              // handle relative paths to be safe (might happen when process.cwd() fails)

              // Normalize the path
              resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
              if (resolvedAbsolute) {
                if (resolvedPath.length > 0) return '/' + resolvedPath;else return '/';
              } else if (resolvedPath.length > 0) {
                return resolvedPath;
              } else {
                return '.';
              }
            },
            normalize: function normalize(path) {
              assertPath(path);
              if (path.length === 0) return '.';
              var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
              var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

              // Normalize the path
              path = normalizeStringPosix(path, !isAbsolute);
              if (path.length === 0 && !isAbsolute) path = '.';
              if (path.length > 0 && trailingSeparator) path += '/';
              if (isAbsolute) return '/' + path;
              return path;
            },
            isAbsolute: function isAbsolute(path) {
              assertPath(path);
              return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
            },

            join: function join() {
              if (arguments.length === 0) return '.';
              var joined;
              for (var i = 0; i < arguments.length; ++i) {
                var arg = arguments[i];
                assertPath(arg);
                if (arg.length > 0) {
                  if (joined === undefined) joined = arg;else joined += '/' + arg;
                }
              }
              if (joined === undefined) return '.';
              return posix.normalize(joined);
            },
            relative: function relative(from, to) {
              assertPath(from);
              assertPath(to);
              if (from === to) return '';
              from = posix.resolve(from);
              to = posix.resolve(to);
              if (from === to) return '';

              // Trim any leading backslashes
              var fromStart = 1;
              for (; fromStart < from.length; ++fromStart) {
                if (from.charCodeAt(fromStart) !== 47 /*/*/) break;
              }
              var fromEnd = from.length;
              var fromLen = fromEnd - fromStart;

              // Trim any leading backslashes
              var toStart = 1;
              for (; toStart < to.length; ++toStart) {
                if (to.charCodeAt(toStart) !== 47 /*/*/) break;
              }
              var toEnd = to.length;
              var toLen = toEnd - toStart;

              // Compare paths to find the longest common path from root
              var length = fromLen < toLen ? fromLen : toLen;
              var lastCommonSep = -1;
              var i = 0;
              for (; i <= length; ++i) {
                if (i === length) {
                  if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === 47 /*/*/) {
                      // We get here if `from` is the exact base path for `to`.
                      // For example: from='/foo/bar'; to='/foo/bar/baz'
                      return to.slice(toStart + i + 1);
                    } else if (i === 0) {
                      // We get here if `from` is the root
                      // For example: from='/'; to='/foo'
                      return to.slice(toStart + i);
                    }
                  } else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
                      // We get here if `to` is the exact base path for `from`.
                      // For example: from='/foo/bar/baz'; to='/foo/bar'
                      lastCommonSep = i;
                    } else if (i === 0) {
                      // We get here if `to` is the root.
                      // For example: from='/foo'; to='/'
                      lastCommonSep = 0;
                    }
                  }
                  break;
                }
                var fromCode = from.charCodeAt(fromStart + i);
                var toCode = to.charCodeAt(toStart + i);
                if (fromCode !== toCode) break;else if (fromCode === 47 /*/*/) lastCommonSep = i;
              }
              var out = '';
              // Generate the relative path based on the path difference between `to`
              // and `from`
              for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
                if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
                  if (out.length === 0) out += '..';else out += '/..';
                }
              }

              // Lastly, append the rest of the destination (`to`) path that comes after
              // the common path parts
              if (out.length > 0) return out + to.slice(toStart + lastCommonSep);else {
                toStart += lastCommonSep;
                if (to.charCodeAt(toStart) === 47 /*/*/) ++toStart;
                return to.slice(toStart);
              }
            },
            _makeLong: function _makeLong(path) {
              return path;
            },
            dirname: function dirname(path) {
              assertPath(path);
              if (path.length === 0) return '.';
              var code = path.charCodeAt(0);
              var hasRoot = code === 47 /*/*/;
              var end = -1;
              var matchedSlash = true;
              for (var i = path.length - 1; i >= 1; --i) {
                code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                  if (!matchedSlash) {
                    end = i;
                    break;
                  }
                } else {
                  // We saw the first non-path separator
                  matchedSlash = false;
                }
              }
              if (end === -1) return hasRoot ? '/' : '.';
              if (hasRoot && end === 1) return '//';
              return path.slice(0, end);
            },
            basename: function basename(path, ext) {
              if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
              assertPath(path);
              var start = 0;
              var end = -1;
              var matchedSlash = true;
              var i;
              if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
                if (ext.length === path.length && ext === path) return '';
                var extIdx = ext.length - 1;
                var firstNonSlashEnd = -1;
                for (i = path.length - 1; i >= 0; --i) {
                  var code = path.charCodeAt(i);
                  if (code === 47 /*/*/) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                      start = i + 1;
                      break;
                    }
                  } else {
                    if (firstNonSlashEnd === -1) {
                      // We saw the first non-path separator, remember this index in case
                      // we need it if the extension ends up not matching
                      matchedSlash = false;
                      firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                      // Try to match the explicit extension
                      if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                          // We matched the extension, so mark this as the end of our path
                          // component
                          end = i;
                        }
                      } else {
                        // Extension does not match, so our result is the entire path
                        // component
                        extIdx = -1;
                        end = firstNonSlashEnd;
                      }
                    }
                  }
                }
                if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
                return path.slice(start, end);
              } else {
                for (i = path.length - 1; i >= 0; --i) {
                  if (path.charCodeAt(i) === 47 /*/*/) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                      start = i + 1;
                      break;
                    }
                  } else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                  }
                }
                if (end === -1) return '';
                return path.slice(start, end);
              }
            },
            extname: function extname(path) {
              assertPath(path);
              var startDot = -1;
              var startPart = 0;
              var end = -1;
              var matchedSlash = true;
              // Track the state of characters (if any) we see before our first dot and
              // after any path separator we find
              var preDotState = 0;
              for (var i = path.length - 1; i >= 0; --i) {
                var code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                  }
                  continue;
                }
                if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // extension
                  matchedSlash = false;
                  end = i + 1;
                }
                if (code === 46 /*.*/) {
                  // If this is our first dot, mark it as the start of our extension
                  if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
                } else if (startDot !== -1) {
                  // We saw a non-dot and non-path separator before our dot, so we should
                  // have a good chance at having a non-empty extension
                  preDotState = -1;
                }
              }
              if (startDot === -1 || end === -1 ||
              // We saw a non-dot character immediately before the dot
              preDotState === 0 ||
              // The (right-most) trimmed path component is exactly '..'
              preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                return '';
              }
              return path.slice(startDot, end);
            },
            format: function format(pathObject) {
              if (pathObject === null || typeof pathObject !== 'object') {
                throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
              }
              return _format('/', pathObject);
            },
            parse: function parse(path) {
              assertPath(path);
              var ret = {
                root: '',
                dir: '',
                base: '',
                ext: '',
                name: ''
              };
              if (path.length === 0) return ret;
              var code = path.charCodeAt(0);
              var isAbsolute = code === 47 /*/*/;
              var start;
              if (isAbsolute) {
                ret.root = '/';
                start = 1;
              } else {
                start = 0;
              }
              var startDot = -1;
              var startPart = 0;
              var end = -1;
              var matchedSlash = true;
              var i = path.length - 1;

              // Track the state of characters (if any) we see before our first dot and
              // after any path separator we find
              var preDotState = 0;

              // Get non-dir info
              for (; i >= start; --i) {
                code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                  }
                  continue;
                }
                if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // extension
                  matchedSlash = false;
                  end = i + 1;
                }
                if (code === 46 /*.*/) {
                  // If this is our first dot, mark it as the start of our extension
                  if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
                } else if (startDot !== -1) {
                  // We saw a non-dot and non-path separator before our dot, so we should
                  // have a good chance at having a non-empty extension
                  preDotState = -1;
                }
              }
              if (startDot === -1 || end === -1 ||
              // We saw a non-dot character immediately before the dot
              preDotState === 0 ||
              // The (right-most) trimmed path component is exactly '..'
              preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                if (end !== -1) {
                  if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
                }
              } else {
                if (startPart === 0 && isAbsolute) {
                  ret.name = path.slice(1, startDot);
                  ret.base = path.slice(1, end);
                } else {
                  ret.name = path.slice(startPart, startDot);
                  ret.base = path.slice(startPart, end);
                }
                ret.ext = path.slice(startDot, end);
              }
              if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
              return ret;
            },
            sep: '/',
            delimiter: ':',
            win32: null,
            posix: null
          };
          posix.posix = posix;
          module.exports = posix;
        }).call(this);
      }).call(this, require('_process'));
    }, {
      "_process": 33
    }],
    30: [function (require, module, exports) {
      /**
      * Precedent Meta-Templating
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Process text streams, parsing out meta-template expressions.
      */
      var libWordTree = require("./WordTree.js");
      var libStringParser = require("./StringParser.js");
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
      "./StringParser.js": 31,
      "./WordTree.js": 32
    }],
    31: [function (require, module, exports) {
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
    32: [function (require, module, exports) {
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
    33: [function (require, module, exports) {
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
    34: [function (require, module, exports) {
      (function (setImmediate, clearImmediate) {
        (function () {
          var nextTick = require('process/browser.js').nextTick;
          var apply = Function.prototype.apply;
          var slice = Array.prototype.slice;
          var immediateIds = {};
          var nextImmediateId = 0;

          // DOM APIs, for completeness

          exports.setTimeout = function () {
            return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
          };
          exports.setInterval = function () {
            return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
          };
          exports.clearTimeout = exports.clearInterval = function (timeout) {
            timeout.close();
          };
          function Timeout(id, clearFn) {
            this._id = id;
            this._clearFn = clearFn;
          }
          Timeout.prototype.unref = Timeout.prototype.ref = function () {};
          Timeout.prototype.close = function () {
            this._clearFn.call(window, this._id);
          };

          // Does not start the time, just sets up the members needed.
          exports.enroll = function (item, msecs) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = msecs;
          };
          exports.unenroll = function (item) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = -1;
          };
          exports._unrefActive = exports.active = function (item) {
            clearTimeout(item._idleTimeoutId);
            var msecs = item._idleTimeout;
            if (msecs >= 0) {
              item._idleTimeoutId = setTimeout(function onTimeout() {
                if (item._onTimeout) item._onTimeout();
              }, msecs);
            }
          };

          // That's not how node.js implements it but the exposed api is the same.
          exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
            var id = nextImmediateId++;
            var args = arguments.length < 2 ? false : slice.call(arguments, 1);
            immediateIds[id] = true;
            nextTick(function onNextTick() {
              if (immediateIds[id]) {
                // fn.call() is faster so we optimize for the common use-case
                // @see http://jsperf.com/call-apply-segu
                if (args) {
                  fn.apply(null, args);
                } else {
                  fn.call(null);
                }
                // Prevent ids from leaking
                exports.clearImmediate(id);
              }
            });
            return id;
          };
          exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
            delete immediateIds[id];
          };
        }).call(this);
      }).call(this, require("timers").setImmediate, require("timers").clearImmediate);
    }, {
      "process/browser.js": 33,
      "timers": 34
    }],
    35: [function (require, module, exports) {
      var libNPMModuleWrapper = require('./Fable.js');
      if (typeof window === 'object' && !window.hasOwnProperty('Fable')) {
        window.Fable = libNPMModuleWrapper;
      }
      module.exports = libNPMModuleWrapper;
    }, {
      "./Fable.js": 42
    }],
    36: [function (require, module, exports) {
      const _OperationStatePrototype = JSON.stringify({
        "Metadata": {
          "GUID": false,
          "Hash": false,
          "Title": "",
          "Summary": "",
          "Version": 0
        },
        "Status": {
          "Completed": false,
          "CompletionProgress": 0,
          "CompletionTimeElapsed": 0,
          "Steps": 1,
          "StepsCompleted": 0,
          "StartTime": 0,
          "EndTime": 0
        },
        "Errors": [],
        "Log": []
      });
      class FableOperation {
        constructor(pFable, pOperationName, pOperationHash) {
          this.fable = pFable;
          this.name = pOperationName;
          this.state = JSON.parse(_OperationStatePrototype);
          this.state.Metadata.GUID = this.fable.getUUID();
          this.state.Metadata.Hash = this.state.GUID;
          if (typeof pOperationHash == 'string') {
            this.state.Metadata.Hash = pOperationHash;
          }
        }
        get GUID() {
          return this.state.Metadata.GUID;
        }
        get Hash() {
          return this.state.Metadata.Hash;
        }
        get log() {
          return this;
        }
        writeOperationLog(pLogLevel, pLogText, pLogObject) {
          this.state.Log.push("".concat(new Date().toUTCString(), " [").concat(pLogLevel, "]: ").concat(pLogText));
          if (typeof pLogObject == 'object') {
            this.state.Log.push(JSON.stringify(pLogObject));
          }
        }
        writeOperationErrors(pLogText, pLogObject) {
          this.state.Errors.push("".concat(pLogText));
          if (typeof pLogObject == 'object') {
            this.state.Errors.push(JSON.stringify(pLogObject));
          }
        }
        trace(pLogText, pLogObject) {
          this.writeOperationLog('TRACE', pLogText, pLogObject);
          this.fable.log.trace(pLogText, pLogObject);
        }
        debug(pLogText, pLogObject) {
          this.writeOperationLog('DEBUG', pLogText, pLogObject);
          this.fable.log.debug(pLogText, pLogObject);
        }
        info(pLogText, pLogObject) {
          this.writeOperationLog('INFO', pLogText, pLogObject);
          this.fable.log.info(pLogText, pLogObject);
        }
        warn(pLogText, pLogObject) {
          this.writeOperationLog('WARN', pLogText, pLogObject);
          this.fable.log.warn(pLogText, pLogObject);
        }
        error(pLogText, pLogObject) {
          this.writeOperationLog('ERROR', pLogText, pLogObject);
          this.writeOperationErrors(pLogText, pLogObject);
          this.fable.log.error(pLogText, pLogObject);
        }
        fatal(pLogText, pLogObject) {
          this.writeOperationLog('FATAL', pLogText, pLogObject);
          this.writeOperationErrors(pLogText, pLogObject);
          this.fable.log.fatal(pLogText, pLogObject);
        }
      }
      module.exports = FableOperation;
    }, {}],
    37: [function (require, module, exports) {
      const libFableServiceBase = require('./Fable-ServiceProviderBase.js');
      const libDataArithmatic = require('data-arithmatic');
      class FableServiceDataArithmatic extends libFableServiceBase {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.serviceType = 'DataArithmatic';
          this._DataArithmaticLibrary = new libDataArithmatic();
        }
      }
      module.exports = FableServiceDataArithmatic;
    }, {
      "./Fable-ServiceProviderBase.js": 41,
      "data-arithmatic": 17
    }],
    38: [function (require, module, exports) {
      const libFableServiceBase = require('./Fable-ServiceProviderBase.js');
      class FableServiceTemplate extends libFableServiceBase {
        // Underscore and lodash have a behavior, _.template, which compiles a
        // string-based template with code snippets into simple executable pieces,
        // with the added twist of returning a precompiled function ready to go.
        //
        // NOTE: This does not implement underscore escape expressions
        // NOTE: This does not implement underscore magic browser variable assignment
        //
        // This is an implementation of that.
        // TODO: Make this use precedent, add configuration, add debugging.
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.serviceType = 'Template';

          // These are the exact regex's used in lodash/underscore
          // TODO: Switch this to precedent
          this.Matchers = {
            Evaluate: /<%([\s\S]+?)%>/g,
            Interpolate: /<%=([\s\S]+?)%>/g,
            Escaper: /\\|'|\r|\n|\t|\u2028|\u2029/g,
            Unescaper: /\\(\\|'|r|n|t|u2028|u2029)/g,
            // This is how underscore does it, so we are keeping it for now.
            GuaranteedNonMatch: /.^/
          };

          // This is a helper for the escaper and unescaper functions.
          // Right now we are going to keep what underscore is doing, but, not forever.
          this.templateEscapes = {
            '\\': '\\',
            "'": "'",
            'r': '\r',
            '\r': 'r',
            'n': '\n',
            '\n': 'n',
            't': '\t',
            '\t': 't',
            'u2028': '\u2028',
            '\u2028': 'u2028',
            'u2029': '\u2029',
            '\u2029': 'u2029'
          };

          // This is defined as such to underscore that it is a dynamic programming
          // function on this class.
          this.renderFunction = false;
          this.templateString = false;
        }
        renderTemplate(pData) {
          return this.renderFunction(pData);
        }
        templateFunction(pData) {
          let fRenderTemplateBound = this.renderTemplate.bind(this);
          return fRenderTemplateBound;
        }
        buildTemplateFunction(pTemplateText, pData) {
          // For now this is being kept in a weird form ... this is to mimic the old
          // underscore code until this is rewritten using precedent.
          this.TemplateSource = "__p+='" + pTemplateText.replace(this.Matchers.Escaper, pMatch => {
            return "\\".concat(this.templateEscapes[pMatch]);
          }).replace(this.Matchers.Interpolate || this.Matchers.GuaranteedNonMatch, (pMatch, pCode) => {
            return "'+\n(".concat(decodeURIComponent(pCode), ")+\n'");
          }).replace(this.Matchers.Evaluate || this.Matchers.GuaranteedNonMatch, (pMatch, pCode) => {
            return "';\n".concat(decodeURIComponent(pCode), "\n;__p+='");
          }) + "';\n";
          this.TemplateSource = "with(pTemplateDataObject||{}){\n".concat(this.TemplateSource, "}\n");
          this.TemplateSource = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n".concat(this.TemplateSource, "return __p;\n");
          this.renderFunction = new Function('pTemplateDataObject', this.TemplateSource);
          if (typeof pData != 'undefined') {
            return this.renderFunction(pData);
          }

          // Provide the compiled function source as a convenience for build time
          // precompilation.
          this.TemplateSourceCompiled = 'function(obj){\n' + this.TemplateSource + '}';
          return this.templateFunction();
        }
      }
      module.exports = FableServiceTemplate;
    }, {
      "./Fable-ServiceProviderBase.js": 41
    }],
    39: [function (require, module, exports) {
      const libFableServiceBase = require('./Fable-ServiceProviderBase.js');

      // TODO: These are still pretty big -- consider the smaller polyfills
      const libAsyncWaterfall = require('async.waterfall');
      const libAsyncEachLimit = require('async.eachlimit');
      class FableServiceUtility extends libFableServiceBase {
        // Underscore and lodash have a behavior, _.template, which compiles a
        // string-based template with code snippets into simple executable pieces,
        // with the added twist of returning a precompiled function ready to go.
        //
        // NOTE: This does not implement underscore escape expressions
        // NOTE: This does not implement underscore magic browser variable assignment
        //
        // This is an implementation of that.
        // TODO: Make this use precedent, add configuration, add debugging.
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.templates = {};

          // These two functions are used extensively throughout
          this.waterfall = libAsyncWaterfall;
          this.eachLimit = libAsyncEachLimit;
        }

        // Underscore and lodash have a behavior, _.extend, which merges objects.
        // Now that es6 gives us this, use the native thingy.
        extend(pDestinationObject) {
          for (var _len = arguments.length, pSourceObjects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            pSourceObjects[_key - 1] = arguments[_key];
          }
          return Object.assign(pDestinationObject, ...pSourceObjects);
        }

        // Underscore and lodash have a behavior, _.template, which compiles a
        // string-based template with code snippets into simple executable pieces,
        // with the added twist of returning a precompiled function ready to go.
        template(pTemplateText, pData) {
          let tmpTemplate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Template');
          return tmpTemplate.buildTemplateFunction(pTemplateText, pData);
        }

        // Build a template function from a template hash, and, register it with the service provider
        buildHashedTemplate(pTemplateHash, pTemplateText, pData) {
          let tmpTemplate = this.fable.serviceManager.instantiateServiceProvider('Template', {}, pTemplateHash);
          this.templates[pTemplateHash] = tmpTemplate.buildTemplateFunction(pTemplateText, pData);
          return this.templates[pTemplateHash];
        }

        // This is a safe, modern version of chunk from underscore
        // Algorithm pulled from a mix of these two polyfills:
        // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
        // https://youmightnotneed.com/lodash
        // This implementation was most tolerant in browsers.  Uglify can fix the rest.
        chunk(pInput, pChunkSize, pChunkCache) {
          let tmpInputArray = [...pInput];
          // Note lodash defaults to 1, underscore defaults to 0
          let tmpChunkSize = typeof pChunkSize == 'number' ? pChunkSize : 0;
          let tmpChunkCache = typeof pChunkCache != 'undefined' ? pChunkCache : [];
          if (tmpChunkSize <= 0) {
            return tmpChunkCache;
          }
          while (tmpInputArray.length) {
            tmpChunkCache.push(tmpInputArray.splice(0, tmpChunkSize));
          }
          return tmpChunkCache;
        }
      }
      module.exports = FableServiceUtility;
    }, {
      "./Fable-ServiceProviderBase.js": 41,
      "async.eachlimit": 1,
      "async.waterfall": 15
    }],
    40: [function (require, module, exports) {
      /**
      * Fable Application Services Management
      * @license MIT
      * @author <steven@velozo.com>
      */

      const libFableServiceBase = require('./Fable-ServiceProviderBase.js');
      class FableService {
        constructor(pFable) {
          this.fable = pFable;
          this.serviceTypes = [];

          // A map of instantiated services
          this.services = {};

          // A map of the default instantiated service by type
          this.defaultServices = {};

          // A map of class constructors for services
          this.serviceClasses = {};
        }
        addServiceType(pServiceType, pServiceClass) {
          // Add the type to the list of types
          this.serviceTypes.push(pServiceType);

          // Add the container for instantiated services to go in
          this.services[pServiceType] = {};
          if (typeof pServiceClass == 'function' && pServiceClass.prototype instanceof libFableServiceBase) {
            // Add the class to the list of classes
            this.serviceClasses[pServiceType] = pServiceClass;
          } else {
            // Add the base class to the list of classes
            this.serviceClasses[pServiceType] = libFableServiceBase;
          }
        }
        instantiateServiceProvider(pServiceType, pOptions, pCustomServiceHash) {
          // Instantiate the service
          let tmpService = this.instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash);

          // Add the service to the service map
          this.services[pServiceType][tmpService.Hash] = tmpService;

          // If this is the first service of this type, make it the default
          if (!this.defaultServices.hasOwnProperty(pServiceType)) {
            this.defaultServices[pServiceType] = tmpService;
          }
          return tmpService;
        }

        // Create a service provider but don't register it to live forever in fable.services
        instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash) {
          // Instantiate the service
          let tmpService = new this.serviceClasses[pServiceType](this.fable, pOptions, pCustomServiceHash);
          return tmpService;
        }
        setDefaultServiceInstantiation(pServiceType, pServiceHash) {
          if (this.services[pServiceType].hasOwnProperty(pServiceHash)) {
            this.defaultServices[pServiceType] = this.services[pServiceType][pServiceHash];
            return true;
          }
          return false;
        }
      }
      module.exports = FableService;
      module.exports.ServiceProviderBase = libFableServiceBase;
    }, {
      "./Fable-ServiceProviderBase.js": 41
    }],
    41: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @license MIT
      * @author <steven@velozo.com>
      */

      class FableServiceProviderBase {
        constructor(pFable, pOptions, pServiceHash) {
          this.fable = pFable;
          this.options = typeof pOptions === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';
          this.UUID = pFable.getUUID();
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : "".concat(this.UUID);
        }
      }
      module.exports = FableServiceProviderBase;
    }, {}],
    42: [function (require, module, exports) {
      /**
      * Fable Application Services Support Library
      * @license MIT
      * @author <steven@velozo.com>
      */
      const libFableSettings = require('fable-settings');
      const libFableUUID = require('fable-uuid');
      const libFableLog = require('fable-log');
      const libFableServiceManager = require('./Fable-ServiceManager.js');
      const libFableServiceDataArithmatic = require('./Fable-Service-DataArithmatic.js');
      const libFableServiceTemplate = require('./Fable-Service-Template.js');
      const libFableServiceUtility = require('./Fable-Service-Utility.js');
      const libFableOperation = require('./Fable-Operation.js');
      class Fable {
        constructor(pSettings) {
          let tmpSettings = new libFableSettings(pSettings);
          this.settingsManager = tmpSettings;

          // Instantiate the UUID generator
          this.libUUID = new libFableUUID(this.settingsManager.settings);
          this.log = new libFableLog(this.settingsManager.settings);
          this.log.initialize();

          // Built-in dependencies
          this.Dependencies = {
            precedent: libFableSettings.precedent
          };

          // Location for Operation state
          this.Operations = {};
          this.serviceManager = new libFableServiceManager(this);

          // Initialize and instantiate the default baked-in Data Arithmatic service
          this.serviceManager.addServiceType('DataArithmatic', libFableServiceDataArithmatic);
          this.fable.serviceManager.instantiateServiceProvider('DataArithmatic', {}, 'Default-Service-DataArithmatic');
          // This service is passing through the data arithmatic library
          this.DataArithmatic = this.serviceManager.defaultServices.DataArithmatic._DataArithmaticLibrary;

          // Initialize the template service
          this.serviceManager.addServiceType('Template', libFableServiceTemplate);

          // Initialize and instantiate the default baked-in Utility service
          this.serviceManager.addServiceType('Utility', libFableServiceUtility);
          this.fable.serviceManager.instantiateServiceProvider('Utility', {}, 'Default-Service-Utility');
          this.Utility = this.serviceManager.defaultServices.Utility;
          this.services = this.serviceManager.services;
          this.defaultServices = this.serviceManager.defaultServices;
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
        createOperation(pOperationName, pOperationHash) {
          let tmpOperation = new libFableOperation(this, pOperationName, pOperationHash);
          if (this.Operations.hasOwnProperty(tmpOperation.Hash)) {
            // Uh Oh ...... Operation Hash Collision!
            // TODO: What to do?!
          } else {
            this.Operations[tmpOperation.Hash] = tmpOperation;
          }
          return tmpOperation;
        }
        getOperation(pOperationHash) {
          if (!this.Operations.hasOwnProperty(pOperationHash)) {
            return false;
          } else {
            return this.Operations[pOperationHash];
          }
        }
      }

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new Fable(pSettings);
      }
      module.exports = Fable;
      module.exports.new = autoConstruct;
      module.exports.LogProviderBase = libFableLog.LogProviderBase;
      module.exports.ServiceProviderBase = libFableServiceManager.ServiceProviderBase;
      module.exports.precedent = libFableSettings.precedent;
    }, {
      "./Fable-Operation.js": 36,
      "./Fable-Service-DataArithmatic.js": 37,
      "./Fable-Service-Template.js": 38,
      "./Fable-Service-Utility.js": 39,
      "./Fable-ServiceManager.js": 40,
      "fable-log": 23,
      "fable-settings": 26,
      "fable-uuid": 28
    }]
  }, {}, [35])(35);
});