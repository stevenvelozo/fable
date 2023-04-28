/**
* Fable Application Services Support Library
* @license MIT
* @author <steven@velozo.com>
*/
const libFableSettings = require('fable-settings');
const libFableUUID = require('fable-uuid');
const libFableLog = require('fable-log');

const libFableUtility = require('./Fable-Utility.js');
const libFableServiceManager = require('./Fable-ServiceManager.js');

const libFableServiceTemplate = require('./Fable-Service-Template.js');

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

		// Built-in utility belt functions
		this.Utility = new libFableUtility(this);

		// Built-in dependencies
		this.Dependencies = (
			{
				precedent: libFableSettings.precedent
			});

		// Location for Operation state
		this.Operations = {};

		this.serviceManager = new libFableServiceManager(this);

		this.serviceManager.addServiceType('Template', libFableServiceTemplate);
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
			return this.pOperations[pOperationHash];
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