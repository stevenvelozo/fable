/**
* Fable Web Services Support Packaging Library
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable
*/

/**
* Fable Web Services Support Packaging Library
*
* @class Fable
* @constructor
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

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableObject = (
		{
			new: createNew
		});

		/**
		 * Settings
		 *
		 * @property settings
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableObject, 'settings',
			{
				get: function() { return _Settings.settings; },
				enumerable: false
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

		/**
		 * Log Streams
		 *
		 * @property log
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableObject, 'log',
			{
				get: function() { return _Log; },
				enumerable: false
			});


		return tmpNewFableObject;
	}

	return createNew();
};

module.exports = Fable();
