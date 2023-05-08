/**
* Fable Application Services Management
* @license MIT
* @author <steven@velozo.com>
*/

const libFableServiceBase = require('./Fable-ServiceProviderBase.js');

class FableService
{
	constructor(pFable)
	{
		this.fable = pFable;

		this.serviceTypes = [];

		// A map of instantiated services
		this.services = {};

		// A map of the default instantiated service by type
		this.defaultServices = {};

		// A map of class constructors for services
		this.serviceClasses = {};
	}

	addServiceType(pServiceType, pServiceClass)
	{
		// Add the type to the list of types
		this.serviceTypes.push(pServiceType);

		// Add the container for instantiated services to go in
		this.services[pServiceType] = {};

		if ((typeof(pServiceClass) == 'function') && (pServiceClass.prototype instanceof libFableServiceBase))
		{
			// Add the class to the list of classes
			this.serviceClasses[pServiceType] = pServiceClass;
		}
		else
		{
			// Add the base class to the list of classes
			this.serviceClasses[pServiceType] = libFableServiceBase;
		}
	}

	instantiateServiceProvider(pServiceType, pOptions, pCustomServiceHash)
	{
		// Instantiate the service
		let tmpService = this.instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash);

		// Add the service to the service map
		this.services[pServiceType][tmpService.Hash] = tmpService;

		// If this is the first service of this type, make it the default
		if (!this.defaultServices.hasOwnProperty(pServiceType))
		{
			this.defaultServices[pServiceType] = tmpService;
		}

		return tmpService;
	}

	// Create a service provider but don't register it to live forever in fable.services
	instantiateServiceProviderWithoutRegistration(pServiceType, pOptions, pCustomServiceHash)
	{
		// Instantiate the service
		let tmpService = new this.serviceClasses[pServiceType](this.fable, pOptions, pCustomServiceHash);
		return tmpService;
	}

	// Connect an initialized service provider that came before Fable was initialized
	connectPreinitServiceProviderInstance(pServiceInstance)
	{
		let tmpServiceType = pServiceInstance.serviceType;
		let tmpServiceHash = pServiceInstance.Hash;

		// The service should already be instantiated, so just connect it to fable
		pServiceInstance.connectFable(this.fable);

		if (!this.services.hasOwnProperty(tmpServiceType))
		{
			// If the core service hasn't registered itself yet, create the service container for it.
			// This means you couldn't register another with this type unless it was later registered with a constructor class.
			this.services[tmpServiceType] = {};
		}
		// Add the service to the service map
		this.services[tmpServiceType][tmpServiceHash] = pServiceInstance;

		// If this is the first service of this type, make it the default
		if (!this.defaultServices.hasOwnProperty(tmpServiceType))
		{
			this.defaultServices[tmpServiceType] = pServiceInstance;
		}

		return pServiceInstance;
	}

	setDefaultServiceInstantiation(pServiceType, pServiceHash)
	{
		if (this.services[pServiceType].hasOwnProperty(pServiceHash))
		{
			this.defaultServices[pServiceType] = this.services[pServiceType][pServiceHash];
			return true;
		}

		return false;
	}
}

module.exports = FableService;

module.exports.ServiceProviderBase = libFableServiceBase;