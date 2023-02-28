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

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = asyncify;
      var _initialParams = require('./internal/initialParams.js');
      var _initialParams2 = _interopRequireDefault(_initialParams);
      var _setImmediate = require('./internal/setImmediate.js');
      var _setImmediate2 = _interopRequireDefault(_setImmediate);
      var _wrapAsync = require('./internal/wrapAsync.js');
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * Take a sync function and make it async, passing its return value to a
       * callback. This is useful for plugging sync functions into a waterfall,
       * series, or other async functions. Any arguments passed to the generated
       * function will be passed to the wrapped function (except for the final
       * callback argument). Errors thrown will be passed to the callback.
       *
       * If the function passed to `asyncify` returns a Promise, that promises's
       * resolved/rejected state will be used to call the callback, rather than simply
       * the synchronous return value.
       *
       * This also means you can asyncify ES2017 `async` functions.
       *
       * @name asyncify
       * @static
       * @memberOf module:Utils
       * @method
       * @alias wrapSync
       * @category Util
       * @param {Function} func - The synchronous function, or Promise-returning
       * function to convert to an {@link AsyncFunction}.
       * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
       * invoked with `(args..., callback)`.
       * @example
       *
       * // passing a regular synchronous function
       * async.waterfall([
       *     async.apply(fs.readFile, filename, "utf8"),
       *     async.asyncify(JSON.parse),
       *     function (data, next) {
       *         // data is the result of parsing the text.
       *         // If there was a parsing error, it would have been caught.
       *     }
       * ], callback);
       *
       * // passing a function returning a promise
       * async.waterfall([
       *     async.apply(fs.readFile, filename, "utf8"),
       *     async.asyncify(function (contents) {
       *         return db.model.create(contents);
       *     }),
       *     function (model, next) {
       *         // `model` is the instantiated model object.
       *         // If there was an error, this function would be skipped.
       *     }
       * ], callback);
       *
       * // es2017 example, though `asyncify` is not needed if your JS environment
       * // supports async functions out of the box
       * var q = async.queue(async.asyncify(async function(file) {
       *     var intermediateStep = await processFile(file);
       *     return await somePromise(intermediateStep)
       * }));
       *
       * q.push(files);
       */
      function asyncify(func) {
        if ((0, _wrapAsync.isAsync)(func)) {
          return function (...args /*, callback*/) {
            const callback = args.pop();
            const promise = func.apply(this, args);
            return handlePromise(promise, callback);
          };
        }
        return (0, _initialParams2.default)(function (args, callback) {
          var result;
          try {
            result = func.apply(this, args);
          } catch (e) {
            return callback(e);
          }
          // if result is Promise object
          if (result && typeof result.then === 'function') {
            return handlePromise(result, callback);
          } else {
            callback(null, result);
          }
        });
      }
      function handlePromise(promise, callback) {
        return promise.then(value => {
          invokeCallback(callback, null, value);
        }, err => {
          invokeCallback(callback, err && err.message ? err : new Error(err));
        });
      }
      function invokeCallback(callback, error, value) {
        try {
          callback(error, value);
        } catch (err) {
          (0, _setImmediate2.default)(e => {
            throw e;
          }, err);
        }
      }
      module.exports = exports['default'];
    }, {
      "./internal/initialParams.js": 8,
      "./internal/setImmediate.js": 13,
      "./internal/wrapAsync.js": 15
    }],
    2: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _eachOfLimit = require('./internal/eachOfLimit.js');
      var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);
      var _withoutIndex = require('./internal/withoutIndex.js');
      var _withoutIndex2 = _interopRequireDefault(_withoutIndex);
      var _wrapAsync = require('./internal/wrapAsync.js');
      var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
      var _awaitify = require('./internal/awaitify.js');
      var _awaitify2 = _interopRequireDefault(_awaitify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
       *
       * @name eachLimit
       * @static
       * @memberOf module:Collections
       * @method
       * @see [async.each]{@link module:Collections.each}
       * @alias forEachLimit
       * @category Collection
       * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
       * @param {number} limit - The maximum number of async operations at a time.
       * @param {AsyncFunction} iteratee - An async function to apply to each item in
       * `coll`.
       * The array index is not passed to the iteratee.
       * If you need the index, use `eachOfLimit`.
       * Invoked with (item, callback).
       * @param {Function} [callback] - A callback which is called when all
       * `iteratee` functions have finished, or an error occurs. Invoked with (err).
       * @returns {Promise} a promise, if a callback is omitted
       */
      function eachLimit(coll, limit, iteratee, callback) {
        return (0, _eachOfLimit2.default)(limit)(coll, (0, _withoutIndex2.default)((0, _wrapAsync2.default)(iteratee)), callback);
      }
      exports.default = (0, _awaitify2.default)(eachLimit, 4);
      module.exports = exports['default'];
    }, {
      "./internal/awaitify.js": 4,
      "./internal/eachOfLimit.js": 6,
      "./internal/withoutIndex.js": 14,
      "./internal/wrapAsync.js": 15
    }],
    3: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = asyncEachOfLimit;
      var _breakLoop = require('./breakLoop.js');
      var _breakLoop2 = _interopRequireDefault(_breakLoop);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      // for async generators
      function asyncEachOfLimit(generator, limit, iteratee, callback) {
        let done = false;
        let canceled = false;
        let awaiting = false;
        let running = 0;
        let idx = 0;
        function replenish() {
          //console.log('replenish')
          if (running >= limit || awaiting || done) return;
          //console.log('replenish awaiting')
          awaiting = true;
          generator.next().then(({
            value,
            done: iterDone
          }) => {
            //console.log('got value', value)
            if (canceled || done) return;
            awaiting = false;
            if (iterDone) {
              done = true;
              if (running <= 0) {
                //console.log('done nextCb')
                callback(null);
              }
              return;
            }
            running++;
            iteratee(value, idx, iterateeCallback);
            idx++;
            replenish();
          }).catch(handleError);
        }
        function iterateeCallback(err, result) {
          //console.log('iterateeCallback')
          running -= 1;
          if (canceled) return;
          if (err) return handleError(err);
          if (err === false) {
            done = true;
            canceled = true;
            return;
          }
          if (result === _breakLoop2.default || done && running <= 0) {
            done = true;
            //console.log('done iterCb')
            return callback(null);
          }
          replenish();
        }
        function handleError(err) {
          if (canceled) return;
          awaiting = false;
          done = true;
          callback(err);
        }
        replenish();
      }
      module.exports = exports['default'];
    }, {
      "./breakLoop.js": 5
    }],
    4: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = awaitify;
      // conditionally promisify a function.
      // only return a promise if a callback is omitted
      function awaitify(asyncFn, arity = asyncFn.length) {
        if (!arity) throw new Error('arity is undefined');
        function awaitable(...args) {
          if (typeof args[arity - 1] === 'function') {
            return asyncFn.apply(this, args);
          }
          return new Promise((resolve, reject) => {
            args[arity - 1] = (err, ...cbArgs) => {
              if (err) return reject(err);
              resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
            };
            asyncFn.apply(this, args);
          });
        }
        return awaitable;
      }
      module.exports = exports['default'];
    }, {}],
    5: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      // A temporary value used to identify if the loop should be broken.
      // See #1064, #1293
      const breakLoop = {};
      exports.default = breakLoop;
      module.exports = exports["default"];
    }, {}],
    6: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _once = require('./once.js');
      var _once2 = _interopRequireDefault(_once);
      var _iterator = require('./iterator.js');
      var _iterator2 = _interopRequireDefault(_iterator);
      var _onlyOnce = require('./onlyOnce.js');
      var _onlyOnce2 = _interopRequireDefault(_onlyOnce);
      var _wrapAsync = require('./wrapAsync.js');
      var _asyncEachOfLimit = require('./asyncEachOfLimit.js');
      var _asyncEachOfLimit2 = _interopRequireDefault(_asyncEachOfLimit);
      var _breakLoop = require('./breakLoop.js');
      var _breakLoop2 = _interopRequireDefault(_breakLoop);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      exports.default = limit => {
        return (obj, iteratee, callback) => {
          callback = (0, _once2.default)(callback);
          if (limit <= 0) {
            throw new RangeError('concurrency limit cannot be less than 1');
          }
          if (!obj) {
            return callback(null);
          }
          if ((0, _wrapAsync.isAsyncGenerator)(obj)) {
            return (0, _asyncEachOfLimit2.default)(obj, limit, iteratee, callback);
          }
          if ((0, _wrapAsync.isAsyncIterable)(obj)) {
            return (0, _asyncEachOfLimit2.default)(obj[Symbol.asyncIterator](), limit, iteratee, callback);
          }
          var nextElem = (0, _iterator2.default)(obj);
          var done = false;
          var canceled = false;
          var running = 0;
          var looping = false;
          function iterateeCallback(err, value) {
            if (canceled) return;
            running -= 1;
            if (err) {
              done = true;
              callback(err);
            } else if (err === false) {
              done = true;
              canceled = true;
            } else if (value === _breakLoop2.default || done && running <= 0) {
              done = true;
              return callback(null);
            } else if (!looping) {
              replenish();
            }
          }
          function replenish() {
            looping = true;
            while (running < limit && !done) {
              var elem = nextElem();
              if (elem === null) {
                done = true;
                if (running <= 0) {
                  callback(null);
                }
                return;
              }
              running += 1;
              iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(iterateeCallback));
            }
            looping = false;
          }
          replenish();
        };
      };
      module.exports = exports['default'];
    }, {
      "./asyncEachOfLimit.js": 3,
      "./breakLoop.js": 5,
      "./iterator.js": 10,
      "./once.js": 11,
      "./onlyOnce.js": 12,
      "./wrapAsync.js": 15
    }],
    7: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = function (coll) {
        return coll[Symbol.iterator] && coll[Symbol.iterator]();
      };
      module.exports = exports["default"];
    }, {}],
    8: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = function (fn) {
        return function (...args /*, callback*/) {
          var callback = args.pop();
          return fn.call(this, args, callback);
        };
      };
      module.exports = exports["default"];
    }, {}],
    9: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = isArrayLike;
      function isArrayLike(value) {
        return value && typeof value.length === 'number' && value.length >= 0 && value.length % 1 === 0;
      }
      module.exports = exports['default'];
    }, {}],
    10: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = createIterator;
      var _isArrayLike = require('./isArrayLike.js');
      var _isArrayLike2 = _interopRequireDefault(_isArrayLike);
      var _getIterator = require('./getIterator.js');
      var _getIterator2 = _interopRequireDefault(_getIterator);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      function createArrayIterator(coll) {
        var i = -1;
        var len = coll.length;
        return function next() {
          return ++i < len ? {
            value: coll[i],
            key: i
          } : null;
        };
      }
      function createES2015Iterator(iterator) {
        var i = -1;
        return function next() {
          var item = iterator.next();
          if (item.done) return null;
          i++;
          return {
            value: item.value,
            key: i
          };
        };
      }
      function createObjectIterator(obj) {
        var okeys = obj ? Object.keys(obj) : [];
        var i = -1;
        var len = okeys.length;
        return function next() {
          var key = okeys[++i];
          if (key === '__proto__') {
            return next();
          }
          return i < len ? {
            value: obj[key],
            key
          } : null;
        };
      }
      function createIterator(coll) {
        if ((0, _isArrayLike2.default)(coll)) {
          return createArrayIterator(coll);
        }
        var iterator = (0, _getIterator2.default)(coll);
        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
      }
      module.exports = exports['default'];
    }, {
      "./getIterator.js": 7,
      "./isArrayLike.js": 9
    }],
    11: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = once;
      function once(fn) {
        function wrapper(...args) {
          if (fn === null) return;
          var callFn = fn;
          fn = null;
          callFn.apply(this, args);
        }
        Object.assign(wrapper, fn);
        return wrapper;
      }
      module.exports = exports["default"];
    }, {}],
    12: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = onlyOnce;
      function onlyOnce(fn) {
        return function (...args) {
          if (fn === null) throw new Error("Callback was already called.");
          var callFn = fn;
          fn = null;
          callFn.apply(this, args);
        };
      }
      module.exports = exports["default"];
    }, {}],
    13: [function (require, module, exports) {
      (function (process, setImmediate) {
        (function () {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.fallback = fallback;
          exports.wrap = wrap;
          /* istanbul ignore file */

          var hasQueueMicrotask = exports.hasQueueMicrotask = typeof queueMicrotask === 'function' && queueMicrotask;
          var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
          var hasNextTick = exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';
          function fallback(fn) {
            setTimeout(fn, 0);
          }
          function wrap(defer) {
            return (fn, ...args) => defer(() => fn(...args));
          }
          var _defer;
          if (hasQueueMicrotask) {
            _defer = queueMicrotask;
          } else if (hasSetImmediate) {
            _defer = setImmediate;
          } else if (hasNextTick) {
            _defer = process.nextTick;
          } else {
            _defer = fallback;
          }
          exports.default = wrap(_defer);
        }).call(this);
      }).call(this, require('_process'), require("timers").setImmediate);
    }, {
      "_process": 30,
      "timers": 31
    }],
    14: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = _withoutIndex;
      function _withoutIndex(iteratee) {
        return (value, index, callback) => iteratee(value, callback);
      }
      module.exports = exports["default"];
    }, {}],
    15: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.isAsyncIterable = exports.isAsyncGenerator = exports.isAsync = undefined;
      var _asyncify = require('../asyncify.js');
      var _asyncify2 = _interopRequireDefault(_asyncify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      function isAsync(fn) {
        return fn[Symbol.toStringTag] === 'AsyncFunction';
      }
      function isAsyncGenerator(fn) {
        return fn[Symbol.toStringTag] === 'AsyncGenerator';
      }
      function isAsyncIterable(obj) {
        return typeof obj[Symbol.asyncIterator] === 'function';
      }
      function wrapAsync(asyncFn) {
        if (typeof asyncFn !== 'function') throw new Error('expected a function');
        return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
      }
      exports.default = wrapAsync;
      exports.isAsync = isAsync;
      exports.isAsyncGenerator = isAsyncGenerator;
      exports.isAsyncIterable = isAsyncIterable;
    }, {
      "../asyncify.js": 1
    }],
    16: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _once = require('./internal/once.js');
      var _once2 = _interopRequireDefault(_once);
      var _onlyOnce = require('./internal/onlyOnce.js');
      var _onlyOnce2 = _interopRequireDefault(_onlyOnce);
      var _wrapAsync = require('./internal/wrapAsync.js');
      var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
      var _awaitify = require('./internal/awaitify.js');
      var _awaitify2 = _interopRequireDefault(_awaitify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * Runs the `tasks` array of functions in series, each passing their results to
       * the next in the array. However, if any of the `tasks` pass an error to their
       * own callback, the next function is not executed, and the main `callback` is
       * immediately called with the error.
       *
       * @name waterfall
       * @static
       * @memberOf module:ControlFlow
       * @method
       * @category Control Flow
       * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
       * to run.
       * Each function should complete with any number of `result` values.
       * The `result` values will be passed as arguments, in order, to the next task.
       * @param {Function} [callback] - An optional callback to run once all the
       * functions have completed. This will be passed the results of the last task's
       * callback. Invoked with (err, [results]).
       * @returns {Promise} a promise, if a callback is omitted
       * @example
       *
       * async.waterfall([
       *     function(callback) {
       *         callback(null, 'one', 'two');
       *     },
       *     function(arg1, arg2, callback) {
       *         // arg1 now equals 'one' and arg2 now equals 'two'
       *         callback(null, 'three');
       *     },
       *     function(arg1, callback) {
       *         // arg1 now equals 'three'
       *         callback(null, 'done');
       *     }
       * ], function (err, result) {
       *     // result now equals 'done'
       * });
       *
       * // Or, with named functions:
       * async.waterfall([
       *     myFirstFunction,
       *     mySecondFunction,
       *     myLastFunction,
       * ], function (err, result) {
       *     // result now equals 'done'
       * });
       * function myFirstFunction(callback) {
       *     callback(null, 'one', 'two');
       * }
       * function mySecondFunction(arg1, arg2, callback) {
       *     // arg1 now equals 'one' and arg2 now equals 'two'
       *     callback(null, 'three');
       * }
       * function myLastFunction(arg1, callback) {
       *     // arg1 now equals 'three'
       *     callback(null, 'done');
       * }
       */
      function waterfall(tasks, callback) {
        callback = (0, _once2.default)(callback);
        if (!Array.isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
        if (!tasks.length) return callback();
        var taskIndex = 0;
        function nextTask(args) {
          var task = (0, _wrapAsync2.default)(tasks[taskIndex++]);
          task(...args, (0, _onlyOnce2.default)(next));
        }
        function next(err, ...args) {
          if (err === false) return;
          if (err || taskIndex === tasks.length) {
            return callback(err, ...args);
          }
          nextTask(args);
        }
        nextTask([]);
      }
      exports.default = (0, _awaitify2.default)(waterfall);
      module.exports = exports['default'];
    }, {
      "./internal/awaitify.js": 4,
      "./internal/once.js": 11,
      "./internal/onlyOnce.js": 12,
      "./internal/wrapAsync.js": 15
    }],
    17: [function (require, module, exports) {
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
    18: [function (require, module, exports) {
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
      "./Fable-Log-Logger-Console.js": 20
    }],
    19: [function (require, module, exports) {
      module.exports = [{
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
      }];
    }, {}],
    20: [function (require, module, exports) {
      let libBaseLogger = require('./Fable-Log-BaseLogger.js');
      class ConsoleLogger extends libBaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings);
          this._ShowTimeStamps = this._Settings.hasOwnProperty('showtimestamps') ? this._Settings.showtimestamps == true : false;
          this._FormattedTimeStamps = this._Settings.hasOwnProperty('formattedtimestamps') ? this._Settings.formattedtimestamps == true : false;
          this._ContextMessage = this._Settings.hasOwnProperty('Context') ? `(${this._Settings.Context})` : pFableLog._Settings.hasOwnProperty('Product') ? `(${pFableLog._Settings.Product})` : 'Unnamed_Log_Context';

          // Allow the user to decide what gets output to the console
          this._OutputLogLinesToConsole = this._Settings.hasOwnProperty('outputloglinestoconsole') ? this._Settings.outputloglinestoconsole : true;
          this._OutputObjectsToConsole = this._Settings.hasOwnProperty('outputobjectstoconsole') ? this._Settings.outputobjectstoconsole : true;

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
      "./Fable-Log-BaseLogger.js": 17
    }],
    21: [function (require, module, exports) {
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
      module.exports = FableLog;
      module.exports.new = autoConstruct;
      module.exports.LogProviderBase = require('./Fable-Log-BaseLogger.js');
    }, {
      "./Fable-Log-BaseLogger.js": 17,
      "./Fable-Log-DefaultProviders-Node.js": 18,
      "./Fable-Log-DefaultStreams.json": 19
    }],
    22: [function (require, module, exports) {
      module.exports = {
        "Product": "ApplicationNameHere",
        "ProductVersion": "0.0.0",
        "ConfigFile": false,
        "LogStreams": [{
          "level": "trace"
        }]
      };
    }, {}],
    23: [function (require, module, exports) {
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
      "_process": 30
    }],
    24: [function (require, module, exports) {
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
      "./Fable-Settings-Default": 22,
      "./Fable-Settings-TemplateProcessor.js": 23,
      "precedent": 27
    }],
    25: [function (require, module, exports) {
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
    26: [function (require, module, exports) {
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
      "./Fable-UUID-Random.js": 25
    }],
    27: [function (require, module, exports) {
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
      "./StringParser.js": 28,
      "./WordTree.js": 29
    }],
    28: [function (require, module, exports) {
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
    29: [function (require, module, exports) {
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
    30: [function (require, module, exports) {
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
    31: [function (require, module, exports) {
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
      "process/browser.js": 30,
      "timers": 31
    }],
    32: [function (require, module, exports) {
      var libNPMModuleWrapper = require('./Fable.js');
      if (typeof window === 'object' && !window.hasOwnProperty('Fable')) {
        window.Fable = libNPMModuleWrapper;
      }
      module.exports = libNPMModuleWrapper;
    }, {
      "./Fable.js": 35
    }],
    33: [function (require, module, exports) {
      class FableUtility {
        // Underscore and lodash have a behavior, _.template, which compiles a
        // string-based template with code snippets into simple executable pieces,
        // with the added twist of returning a precompiled function ready to go.
        //
        // NOTE: This does not implement underscore escape expressions
        // NOTE: This does not implement underscore magic browser variable assignment
        //
        // This is an implementation of that.
        // TODO: Make this use precedent, add configuration, add debugging.
        constructor(pFable, pTemplateText) {
          this.fable = pFable;

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
          this.renderFunction = () => {
            return ``;
          };
        }

        // Underscore and lodash have a behavior, _.extend, which merges objects.
        // Now that es6 gives us this, use the native thingy.
        extend(pDestinationObject, ...pSourceObjects) {
          return Object.assign(pDestinationObject, ...pSourceObjects);
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
            return `\\${this.templateEscapes[pMatch]}`;
          }).replace(this.Matchers.Interpolate || this.Matchers.GuaranteedNonMatch, (pMatch, pCode) => {
            return `'+\n(${decodeURIComponent(pCode)})+\n'`;
          }).replace(this.Matchers.Evaluate || this.Matchers.GuaranteedNonMatch, (pMatch, pCode) => {
            return `';\n${decodeURIComponent(pCode)}\n;__p+='`;
          }) + `';\n`;
          this.TemplateSource = `with(pTemplateDataObject||{}){\n${this.TemplateSource}}\n`;
          this.TemplateSource = `var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n${this.TemplateSource}return __p;\n`;
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
      module.exports = FableUtility;
    }, {}],
    34: [function (require, module, exports) {
      const libFableUtilityTemplate = require('./Fable-Utility-Template.js');
      const libAsyncWaterfall = require('async/waterfall');
      const libAsyncEachLimit = require('async/eachLimit');
      class FableUtility {
        constructor(pFable) {
          this.fable = pFable;

          // These two functions are used extensively throughout
          this.waterfall = libAsyncWaterfall;
          this.eachLimit = libAsyncEachLimit;
        }

        // Underscore and lodash have a behavior, _.extend, which merges objects.
        // Now that es6 gives us this, use the native thingy.
        extend(pDestinationObject, ...pSourceObjects) {
          return Object.assign(pDestinationObject, ...pSourceObjects);
        }

        // Underscore and lodash have a behavior, _.template, which compiles a
        // string-based template with code snippets into simple executable pieces,
        // with the added twist of returning a precompiled function ready to go.
        template(pTemplateText, pData) {
          let tmpTemplate = new libFableUtilityTemplate(this.fable, pTemplateText);
          return tmpTemplate.buildTemplateFunction(pTemplateText, pData);
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
      module.exports = FableUtility;
    }, {
      "./Fable-Utility-Template.js": 33,
      "async/eachLimit": 2,
      "async/waterfall": 16
    }],
    35: [function (require, module, exports) {
      /**
      * Fable Application Services Support Library
      * @license MIT
      * @author <steven@velozo.com>
      */
      const libFableSettings = require('fable-settings');
      const libFableUUID = require('fable-uuid');
      const libFableLog = require('fable-log');
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

          // Built-in dependencies ... more can be added here.
          this.Dependencies = {
            precedent: libFableSettings.precedent
          };
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

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new Fable(pSettings);
      }
      module.exports = Fable;
      module.exports.new = autoConstruct;
      module.exports.LogProviderBase = libFableLog.LogProviderBase;
      module.exports.precedent = libFableSettings.precedent;
    }, {
      "./Fable-Utility.js": 34,
      "fable-log": 21,
      "fable-settings": 24,
      "fable-uuid": 26
    }]
  }, {}, [32])(32);
});