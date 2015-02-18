/**
* Fable Entity, Behavior and API Library
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable
*/

// We use Underscore.js for utility
var libUnderscore = require('underscore');
// The logger uses Bunyan to write logs
var libLog = require('./Logger.js');
// Each query object gets a UUID, using flake-idgen and biguint-format
var libFlakeIDGen = require('flake-idgen');
var flakeIDGen = new libFlakeIDGen();
var libIntFormat = require('biguint-format')
// TODO: Load parameters for FlakeID generation from a .json config if it exists

// FoxHound is the default query generator
var libFoxHound = require('foxhound');
var libMeadow = require('meadow');

/**
* Fable Entity, Behavior and API Library
*
* @class Fable
* @constructor
*/
var Fable = function()
{
	function createNew(pScope, pSchema)
	{
		// A universally unique identifier for this object
		var _UUID = libIntFormat(flakeIDGen.next(), 'hex', { prefix: '0x' });

		// The name for this Entity.  Often matches the Scope
		var _Name = 'Unknown';

		var _DataAccess = libMeadow;
		// Set the scope of the Data Access object to our name, by default.
		_DataAccess.scope = _Name;

		/**
		* Get a Data Access Library (Meadow) object for this entity.
		*
		* @method data
		* @return {Object} Returns a Query object.  This is chainable.
		*/
		var data = function()
		{
			return _DataAccess;
		}

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableObject = (
		{
			data: data,

			new: createNew
		});



		/**
		 * Scope from the Data Access Library
		 *
		 * @property scope
		 * @type String
		 */
		Object.defineProperty(tmpNewFableObject, 'scope',
			{
				get: function() { return _DataAccess.scope; },
				set: function(pScope) { _DataAccess.scope = pScope; },
				enumerable: true
			});



		/**
		 * Universally Unique Identifier
		 *
		 * @property uuid
		 * @type string
		 */
		Object.defineProperty(tmpNewFableObject, 'uuid',
			{
				get: function() { return _UUID; },
				enumerable: true
			});



		var __initialize = function ()
		{
			// TODO: Load a json file with any necessary config settings.
		};
		__initialize();

		return tmpNewFableObject;
	}

	return createNew();
};

module.exports = Fable();
