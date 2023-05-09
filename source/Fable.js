/**
* Fable Application Services Support Library
* @license MIT
* @author <steven@velozo.com>
*/
// Pre-init services
const libFableSettings = require('fable-settings');
const libFableUUID = require('fable-uuid');
const libFableLog = require('fable-log');

const libFableServiceManager = require('./Fable-ServiceManager.js');

// Default Services
const libFableServiceDataArithmatic = require('data-arithmatic');
const libFableServiceMetaTemplate = require('./services/Fable-Service-MetaTemplate.js');
const libFableServiceOperation = require('./services/Fable-Service-Operation.js');
const libFableServiceRestClient = require('./services/Fable-Service-RestClient.js');
const libFableServiceTemplate = require('./services/Fable-Service-Template.js');
const libFableServiceUtility = require('./services/Fable-Service-Utility.js');

class Fable
{
	constructor(pSettings)
	{
		// Initialization Phase 0: Set up the lowest level state (core services)
		// Container for the core services prototypes.
		// This is here so if an API consumer changes the default for a core service,
		// fable still runs with what was initialized.
		this._coreServices = {};

		// Instantiate the default Settings Manager
		this._coreServices.SettingsManager = new libFableSettings(pSettings);
		// Instantiate the UUID generator
		this._coreServices.UUID = new libFableUUID(this._coreServices.SettingsManager.settings);
		// Instantiate the logging system
		this._coreServices.Logging = new libFableLog(this._coreServices.SettingsManager.settings);
		this._coreServices.Logging.initialize();

		// Initialization Phase 1: Instantiate the service manager
		// This is the start actual bootstrapping point for fable
		this._coreServices.ServiceManager = new libFableServiceManager(this);
		this.serviceManager = this._coreServices.ServiceManager;
		this.serviceManager.connectFable(this);
		// Bootstrapping of fable into the Service Manager is complete

		// Initialization Phase 2: Map in the default services.
		// They will then be available in the Default service provider set as well.
		this.serviceManager.connectPreinitServiceProviderInstance(this._coreServices.ServiceManager);
		this.serviceManager.connectPreinitServiceProviderInstance(this._coreServices.UUID);
		this.serviceManager.connectPreinitServiceProviderInstance(this._coreServices.Logging);
		this.serviceManager.connectPreinitServiceProviderInstance(this._coreServices.SettingsManager);

		// Initialize and instantiate the default baked-in Data Arithmatic service
		this.serviceManager.addServiceType('Template', libFableServiceTemplate);
		this.serviceManager.addServiceType('MetaTemplate', libFableServiceMetaTemplate);
		this.serviceManager.addServiceType('DataArithmatic', libFableServiceDataArithmatic);
		this.fable.serviceManager.instantiateServiceProvider('DataArithmatic');
		this.serviceManager.addServiceType('Utility', libFableServiceUtility);
		this.fable.serviceManager.instantiateServiceProvider('Utility');
		this.serviceManager.addServiceType('Operation', libFableServiceOperation);
		this.serviceManager.addServiceType('RestClient', libFableServiceRestClient);

	}

	get settings()
	{
		return this._coreServices.SettingsManager.settings;
	}

	get log()
	{
		return this._coreServices.Logging;
	}

	get services()
	{
		return this._coreServices.ServiceManager.services;
	}

	get defaultServices()
	{
		return this._coreServices.ServiceManager.defaultServices;
	}

	getUUID()
	{
		return this._coreServices.UUID.getUUID();
	}

	get fable()
	{
		return this;
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
module.exports.CoreServiceProviderBase = libFableServiceManager.CoreServiceProviderBase;

module.exports.precedent = libFableSettings.precedent;