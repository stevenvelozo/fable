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
const libFableServiceMetaTemplate = require('./Fable-Service-MetaTemplate.js');
const libFableServiceUtility = require('./Fable-Service-Utility.js');

const libFableOperation = require('./Fable-Operation.js');

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

		// Built-in dependencies
		this.Dependencies = (
			{
				precedent: libFableSettings.precedent
			});

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

		// Initialize the metatemplate service
		this.serviceManager.addServiceType('MetaTemplate', libFableServiceMetaTemplate);

		// Initialize and instantiate the default baked-in Utility service
		this.serviceManager.addServiceType('Utility', libFableServiceUtility)
		this.fable.serviceManager.instantiateServiceProvider('Utility', {}, 'Default-Service-Utility');
		this.Utility = this.serviceManager.defaultServices.Utility;

		this.services = this.serviceManager.services;
		this.defaultServices = this.serviceManager.defaultServices;
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

	createOperation(pOperationName, pOperationHash)
	{
		let tmpOperation = new libFableOperation(this, pOperationName, pOperationHash);

		if (this.Operations.hasOwnProperty(tmpOperation.Hash))
		{
			// Uh Oh ...... Operation Hash Collision!
			// TODO: What to do?!
		}
		else
		{
			this.Operations[tmpOperation.Hash] = tmpOperation;
		}

		return tmpOperation;
	}

	getOperation(pOperationHash)
	{
		if (!this.Operations.hasOwnProperty(pOperationHash))
		{
			return false;
		}
		else
		{
			return this.Operations[pOperationHash];
		}
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new Fable(pSettings);
}

module.exports = Fable;
module.exports.new = autoConstruct;

module.exports.LogProviderBase = libFableLog.LogProviderBase;
module.exports.ServiceProviderBase = libFableServiceManager.ServiceProviderBase;

module.exports.precedent = libFableSettings.precedent;