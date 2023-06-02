/**
* Fable Application Services Management
* @author <steven@velozo.com>
*/

const libFableServiceBase = require('fable-serviceproviderbase');

class FableService extends libFableServiceBase.CoreServiceProviderBase
{
	constructor(pSettings, pServiceHash)
	{
		super(pSettings, pServiceHash);

		this.serviceType = 'ServiceManager';

		this.serviceTypes = [];

		// A map of instantiated services
		this.serviceMap = {};

		// A map of the default instantiated service by type
		this.services = {};

		// A map of class constructors for services
		this.serviceClasses = {};

		// If we need extra service initialization capabilities
		this.extraServiceInitialization = false;
	}

	addServiceType(pServiceType, pServiceClass)
	{
		// Add the type to the list of types
		this.serviceTypes.push(pServiceType);

		// Add the container for instantiated services to go in
		this.serviceMap[pServiceType] = {};

		// Using the static member of the class is a much more reliable way to check if it is a service class than instanceof
		if ((typeof(pServiceClass) == 'function') && (pServiceClass.isFableService))
		{
			// Add the class to the list of classes
			this.serviceClasses[pServiceType] = pServiceClass;
		}
		else
		{
			// Add the base class to the list of classes
			this.fable.log.error(`Attempted to add service type [${pServiceType}] with an invalid class.  Using base service class, which will not crash but won't provide meaningful services.`);
			this.serviceClasses[pServiceType] = libFableServiceBase;
		}
	}

	// This is for the services that are meant to run mostly single-instance so need a default at initialization
	addAndInstantiateServiceType(pServiceType, pServiceClass)
	{
		this.addServiceType(pServiceType, pServiceClass);
		this.instantiateServiceProvider(pServiceType, {}, `${pServiceType}-Default`);
	}

	// Some services expect to be overloaded / customized class.
	instantiateServiceProviderFromPrototype(pServiceType, pOptions, pCustomServiceHash, pServicePrototype)
	{
		// Instantiate the service
		let tmpService = new pServicePrototype(this.fable, pOptions, pCustomServiceHash);

		if (this.extraServiceInitialization)
		{
			tmpService = this.extraServiceInitialization(tmpService);
		}

		// Add the service to the service map
		this.serviceMap[pServiceType][tmpService.Hash] = tmpService;

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
		this.serviceMap[pServiceType][tmpService.Hash] = tmpService;

		// If this is the first service of this type, make it the default
		if (!this.services.hasOwnProperty(pServiceType))
		{
			this.setDefaultServiceInstantiation(pServiceType, tmpService.Hash)
		}

		return tmpService;
	}

	// Create a service provider but don't register it to live forever in fable.services
	instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash)
	{
		// Instantiate the service
		let tmpService = new this.serviceClasses[pServiceType](this.fable, pOptions, pCustomServiceHash);
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
		pServiceInstance.connectFable(this.fable);

		if (!this.serviceMap.hasOwnProperty(tmpServiceType))
		{
			// If the core service hasn't registered itself yet, create the service container for it.
			// This means you couldn't register another with this type unless it was later registered with a constructor class.
			this.services[tmpServiceType] = {};
		}
		// Add the service to the service map
		this.serviceMap[tmpServiceType][tmpServiceHash] = pServiceInstance;

		// If this is the first service of this type, make it the default
		if (!this.services.hasOwnProperty(tmpServiceType))
		{
			this.setDefaultServiceInstantiation(tmpServiceType, tmpServiceHash)
		}

		return pServiceInstance;
	}

	setDefaultServiceInstantiation(pServiceType, pServiceHash)
	{
		if (this.serviceMap[pServiceType].hasOwnProperty(pServiceHash))
		{
			this.fable[pServiceType] = this.serviceMap[pServiceType][pServiceHash];
			this.services[pServiceType] = this.serviceMap[pServiceType][pServiceHash];
			return true;
		}

		return false;
	}
}

module.exports = FableService;

module.exports.ServiceProviderBase = libFableServiceBase;
module.exports.CoreServiceProviderBase = libFableServiceBase.CoreServiceProviderBase;