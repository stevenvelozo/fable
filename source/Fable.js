/**
* Fable Application Services Support Library
* @author <steven@velozo.com>
*/
// Pre-init services
const libFableSettings = require('fable-settings');
const libFableUUID = require('fable-uuid');
const libFableLog = require('fable-log');

const libFableServiceBase = require('fable-serviceproviderbase');

class Fable extends libFableServiceBase.CoreServiceProviderBase
{
	constructor(pSettings)
	{
		super(pSettings);

		// Initialization Phase 0: Set up the lowest level state (fable is a utility service manager at heart)
		this.serviceType = 'ServiceManager';

		// An array of the types of services available
		this.serviceTypes = [];
		// A map of instantiated services
		this.servicesMap = {};
		// A map of the default instantiated service by type
		this.services = {};

		// A map of class constructors for services
		this.serviceClasses = {};

		// If we need extra service initialization capabilities
		this.extraServiceInitialization = false;

		// Set how noisy the system is about signaling complexity
		this.LogNoisiness = 0;

		// Initialization Phase 1: Set up the core utility services
		// These are things like power, water, and sewage.  They are required for fable to run (e.g. logging, settings, etc)

		// Instantiate the default Settings Manager
		this.SettingsManager = new libFableSettings(pSettings);
		this.SettingsManager = this.SettingsManager;
		// Instantiate the UUID generator
		this.UUID = new libFableUUID(this.SettingsManager.settings);
		// Instantiate the logging system
		this.Logging = new libFableLog(this.SettingsManager.settings);
		this.Logging.initialize();

		// Initialization Phase 1.5: Instantiate the service manager
		// This is the start actual bootstrapping point for fable.
		// For consistency fable is treated as a service.
		this.ServiceManager = this;
		// TODO: Remove this when Orator and meadow-endpoints are shifted to this new pattern
		this.serviceManager = this;
		// END TODO
		this.connectFable(this);
		// --> Bootstrapping of fable into the Service Manager is complete

		// Initialization Phase 2: Map in the default services.
		// They will then be available in the Default service provider set as well.
		this.connectPreinitServiceProviderInstance(this.UUID);
		this.connectPreinitServiceProviderInstance(this.Logging);
		this.connectPreinitServiceProviderInstance(this.SettingsManager);

		// Initialize and instantiate the default baked-in Data Arithmatic service
		this.addAndInstantiateServiceType('EnvironmentData', require('./services/Fable-Service-EnvironmentData.js'));
		this.addServiceType('Template', require('./services/Fable-Service-Template.js'));
		this.addServiceType('MetaTemplate', require('./services/Fable-Service-MetaTemplate.js'));
		this.addServiceType('Anticipate', require('./services/Fable-Service-Anticipate.js'));
		this.addAndInstantiateServiceType('Dates', require('./services/Fable-Service-DateManipulation.js'));
		this.addAndInstantiateServiceType('DataFormat', require('./services/Fable-Service-DataFormat.js'));
		this.addAndInstantiateServiceType('DataGeneration', require('./services/Fable-Service-DataGeneration.js'));
		this.addAndInstantiateServiceType('Utility', require('./services/Fable-Service-Utility.js'));
		this.addAndInstantiateServiceType('Math', require('./services/Fable-Service-Math.js'));
		this.addServiceType('RestClient', require('./services/Fable-Service-RestClient.js'));
		this.addServiceType('Manifest', require('manyfest'));
		this.addServiceType('ObjectCache', require('cachetrax'));
		this.addAndInstantiateServiceType('ProgressTime', require('./services/Fable-Service-ProgressTime.js'));
		this.addServiceType('ProgressTrackerSet', require('./services/Fable-Service-ProgressTrackerSet.js'));
		this.addServiceType('Operation', require('./services/Fable-Service-Operation.js'));
		this.addServiceType('CSVParser', require('./services/Fable-Service-CSVParser.js'));
		this.addServiceType('FilePersistence', require('./services/Fable-Service-FilePersistence.js'));
	}

	/* State Accessors */
	get isFable()
	{
		return true;
	}

	get settings()
	{
		return this.SettingsManager.settings;
	}

	get settingsManager()
	{
		return this.SettingsManager;
	}

	// For backwards compatibility
	getUUID()
	{
		return this.UUID.getUUID();
	}

	newAnticipate()
	{
		return this.instantiateServiceProviderWithoutRegistration('Anticipate');
	}

	/* Service Manager Methods */
	addServiceType(pServiceType, pServiceClass)
	{
		if (this.servicesMap.hasOwnProperty(pServiceType))
		{
			// TODO: Check if any services are running?
			this.log.warn(`Adding a service type [${pServiceType}] that already exists.  This will change the default class prototype for this service.`);
		}
		else
		{
			// Add the container for instantiated services to go in
			this.servicesMap[pServiceType] = {};

			// Add the type to the list of types
			this.serviceTypes.push(pServiceType);
		}

		// Using the static member of the class is a much more reliable way to check if it is a service class than instanceof
		if ((typeof(pServiceClass) == 'function') && (pServiceClass.isFableService))
		{
			// Add the class to the list of classes
			this.serviceClasses[pServiceType] = pServiceClass;
		}
		else
		{
			// Add the base class to the list of classes
			this.log.error(`Attempted to add service type [${pServiceType}] with an invalid class.  Using base service class, which will not crash but won't provide meaningful services.`);
			this.serviceClasses[pServiceType] = libFableServiceBase;
		}

		return this.serviceClasses[pServiceType];
	}

	addServiceTypeIfNotExists(pServiceType, pServiceClass)
	{
		if (!this.servicesMap.hasOwnProperty(pServiceType))
		{
			return this.addServiceType(pServiceType, pServiceClass);
		}
		else
		{
			return this.serviceClasses[pServiceType];
		}
	}

	// This is for the services that are meant to run mostly single-instance so need a default at initialization
	addAndInstantiateServiceType(pServiceType, pServiceClass)
	{
		this.addServiceType(pServiceType, pServiceClass);
		return this.instantiateServiceProvider(pServiceType, {}, `${pServiceType}-Default`);
	}

	// Some services expect to be overloaded / customized class.
	instantiateServiceProviderFromPrototype(pServiceType, pOptions, pCustomServiceHash, pServicePrototype)
	{
		// Instantiate the service
		let tmpService = new pServicePrototype(this, pOptions, pCustomServiceHash);

		if (this.extraServiceInitialization)
		{
			tmpService = this.extraServiceInitialization(tmpService);
		}

		// Add the service to the service map
		this.servicesMap[pServiceType][tmpService.Hash] = tmpService;

		// If this is the first service of this type, make it the default
		if (!this.services.hasOwnProperty(pServiceType))
		{
			this.setDefaultServiceInstantiation(pServiceType, tmpService.Hash)
		}

		return tmpService;
	}

	instantiateServiceProvider(pServiceType, pOptions, pCustomServiceHash)
	{
		// Instantiate the service
		let tmpService = this.instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash);

		// Add the service to the service map
		this.servicesMap[pServiceType][tmpService.Hash] = tmpService;

		// If this is the first service of this type, make it the default
		if (!this.services.hasOwnProperty(pServiceType))
		{
			this.setDefaultServiceInstantiation(pServiceType, tmpService.Hash)
		}

		return tmpService;
	}

	instantiateServiceProviderIfNotExists(pServiceType, pOptions, pCustomServiceHash)
	{
		if (this.services.hasOwnProperty(pServiceType))
		{
			return this.services[pServiceType];
		}
		else
		{
			return this.instantiateServiceProvider(pServiceType, pOptions, pCustomServiceHash);
		}
	}

	// Create a service provider but don't register it to live forever in fable.services
	instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash)
	{
		// Instantiate the service
		let tmpService = new this.serviceClasses[pServiceType](this, pOptions, pCustomServiceHash);
		if (this.extraServiceInitialization)
		{
			tmpService = this.extraServiceInitialization(tmpService);
		}
		return tmpService;
	}

	// Connect an initialized service provider that came before Fable was initialized
	connectPreinitServiceProviderInstance(pServiceInstance)
	{
		let tmpServiceType = pServiceInstance.serviceType;
		let tmpServiceHash = pServiceInstance.Hash;

		// The service should already be instantiated, so just connect it to fable
		pServiceInstance.connectFable(this);

		// Add the service type to the map if it isn't there yet
		if (!this.servicesMap.hasOwnProperty(tmpServiceType))
		{
			// If the core service hasn't registered itself yet, create the service container for it.
			// This means you couldn't register another with this type unless it was later registered with a constructor class.
			this.servicesMap[tmpServiceType] = {};
		}
		// Add the service to the service map
		this.servicesMap[tmpServiceType][tmpServiceHash] = pServiceInstance;

		// If this is the first service of this type, make it the default
		if (!this.services.hasOwnProperty(tmpServiceType))
		{
			this.setDefaultServiceInstantiation(tmpServiceType, tmpServiceHash, false);
		}

		return pServiceInstance;
	}

	setDefaultServiceInstantiation(pServiceType, pServiceHash, pOverwriteService)
	{
		// Overwrite services by default, unless told not to
		let tmpOverwriteService = (typeof(pOverwriteService) === 'undefined') ? true : pOverwriteService;
		// Make sure the service exists
		if (this.servicesMap[pServiceType].hasOwnProperty(pServiceHash))
		{
			if (!this.hasOwnProperty(pServiceType) || tmpOverwriteService)
			{
				this[pServiceType] = this.servicesMap[pServiceType][pServiceHash];
			}
			if (!this.services.hasOwnProperty(pServiceType) || tmpOverwriteService)
			{
				this.services[pServiceType] = this.servicesMap[pServiceType][pServiceHash];
			}
			return true;
		}

		return false;
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
module.exports.ServiceProviderBase = libFableServiceBase;
module.exports.CoreServiceProviderBase = libFableServiceBase.CoreServiceProviderBase;

module.exports.precedent = libFableSettings.precedent;
