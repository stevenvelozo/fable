// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libUnderscore = require('underscore');

/**
* Fable Application Services Support Library
*
* @class Fable
*/
var Fable = function()
{
	function createNew(pSettings)
	{
		// Setup the application settings object
		var _Settings = require('fable-settings').new(pSettings);

		// Instantiate the logger
		var _Log = require('fable-log').new(_Settings.settings);
		_Log.initialize();

		// Instantiate the UUID generator
		var libUUID = require('fable-uuid').new(_Settings.settings);

		/**
		 * Get a UUID based on the settings
		 */
		var getUUID = function()
		{
			return libUUID.getUUID();
		}

		/**
		 * Add Services references (e.g. log & settings) to an Object
		 *
		 * @function addServices
		 */
		var addServices = function(pObject)
		{
			/**
			 * Fable Pass-through
			 *
			 * @property fable
			 */
			Object.defineProperty(pObject, 'fable',
				{
					get: function() { return tmpNewFableObject; },
					enumerable: false
				});

			/**
			 * Settings
			 *
			 * @property settings
			 * @type Object
			 */
			Object.defineProperty(pObject, 'settings',
				{
					get: function() { return _Settings.settings; },
					enumerable: false
				});

			/**
			 * Log Streams
			 *
			 * @property log
			 * @type Object
			 */
			Object.defineProperty(pObject, 'log',
				{
					get: function() { return _Log; },
					enumerable: false
				});
		};

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableObject = (
		{
			addServices: addServices,
			getUUID: getUUID,
			new: createNew
		});

		/**
		 * Settings Management Library
		 *
		 * @property settingsmanager
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableObject, 'settingsManager',
			{
				get: function() { return _Settings; },
				enumerable: false
			});

		// Add services to ourself.
		addServices(tmpNewFableObject);

		return tmpNewFableObject;
	}

	return createNew();
};

module.exports = new Fable();
