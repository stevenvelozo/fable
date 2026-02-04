# Fable Architecture

This document describes the internal architecture and design patterns used in Fable.

## Overview

Fable is built on a **Service Provider Pattern** architecture that provides dependency injection, service lifecycle management, and centralized configuration.

```
Fable (Core ServiceManager)
    ├── Settings Manager (fable-settings)
    ├── UUID Generator (fable-uuid)
    ├── Logging System (fable-log)
    └── Service Registry
         ├── Default Single-Instance Services (auto-instantiated)
         ├── On-Demand Services (instantiated when needed)
         └── Custom Service Types (user-defined)
```

## Design Principles

### Inversion of Control (IoC)

Services depend on Fable rather than creating their own dependencies. Each service receives a reference to the Fable instance during construction, providing access to all other services and shared configuration.

```javascript
class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);

        // Access other services through fable
        this.log = this.fable.log;
        this.settings = this.fable.settings;
    }
}
```

### Lazy Instantiation

Services can be registered without being instantiated, allowing for on-demand creation when first needed:

```javascript
// Register without instantiating
fable.addServiceType('ExpensiveService', ExpensiveServiceClass);

// Later, when needed
const service = fable.instantiateServiceProvider('ExpensiveService');
```

### Service Containers

Each service type maintains a map of instances, supporting multiple named instances of the same service type:

```javascript
// Create multiple instances of the same service type
const clientA = fable.instantiateServiceProvider('RestClient', {}, 'api-client');
const clientB = fable.instantiateServiceProvider('RestClient', {}, 'auth-client');

// Access via services map
fable.servicesMap.RestClient['api-client'];
fable.servicesMap.RestClient['auth-client'];
```

### Default Service Pattern

The first instance of each service type becomes the default accessor on the Fable object:

```javascript
// First instantiation becomes default
fable.instantiateServiceProvider('RestClient', {}, 'primary');

// Now accessible directly
fable.RestClient;           // The 'primary' instance
fable.services.RestClient;  // Same as above
```

## Initialization Phases

Fable initializes in distinct phases to ensure proper dependency ordering:

### Phase 0: Core State Setup

The lowest level state and service infrastructure is established:

```javascript
this.serviceType = 'ServiceManager';
this.serviceTypes = [];      // Array of registered service types
this.servicesMap = {};       // Map of instantiated services by type and hash
this.services = {};          // Map of default service instances
this.serviceClasses = {};    // Map of service class constructors
```

### Phase 1: Core Utility Services

Fundamental services required for Fable to operate:

```javascript
this.SettingsManager = new libFableSettings(pSettings);
this.UUID = new libFableUUID(this.SettingsManager.settings);
this.Logging = new libFableLog(this.SettingsManager.settings);
this.Logging.initialize();
```

### Phase 1.5: Self-Registration

Fable registers itself as a service, enabling consistent service access patterns:

```javascript
this.ServiceManager = this;
this.connectFable(this);
```

### Phase 2: Default Built-in Services

All default services are registered and optionally instantiated:

```javascript
// Auto-instantiated (available immediately)
this.addAndInstantiateServiceType('EnvironmentData', ...);
this.addAndInstantiateServiceType('Dates', ...);
this.addAndInstantiateServiceType('DataFormat', ...);
// ... etc

// On-demand (registered but not instantiated)
this.addServiceType('Template', ...);
this.addServiceType('RestClient', ...);
// ... etc
```

## Service Base Class

All Fable services extend `CoreServiceProviderBase` from `fable-serviceproviderbase`:

```javascript
class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'MyService';  // Required: identifies the service type
    }

    // Services automatically have:
    // - this.fable (reference to Fable instance)
    // - this.log (logging via fable.log)
    // - this.options (passed options)
    // - this.Hash (unique service instance identifier)
}
```

## Service Registration Methods

### `addServiceType(pServiceType, pServiceClass)`

Registers a service class without instantiation:

```javascript
fable.addServiceType('MyService', MyServiceClass);
```

### `addAndInstantiateServiceType(pServiceType, pServiceClass)`

Registers and immediately creates a default instance:

```javascript
fable.addAndInstantiateServiceType('MyService', MyServiceClass);
// Creates instance with hash 'MyService-Default'
```

### `instantiateServiceProvider(pServiceType, pOptions, pCustomServiceHash)`

Creates a new instance of a registered service:

```javascript
const service = fable.instantiateServiceProvider('MyService',
    { option: 'value' },
    'my-custom-hash'
);
```

### `instantiateServiceProviderFromPrototype(pServiceType, pOptions, pCustomServiceHash, pServicePrototype)`

Creates an instance using a custom class that may differ from the registered class:

```javascript
class CustomizedService extends MyServiceClass { /* ... */ }

const service = fable.instantiateServiceProviderFromPrototype(
    'MyService',
    options,
    'customized',
    CustomizedService
);
```

## Service Access Patterns

### Direct Property Access

Auto-instantiated services are available directly on the Fable instance:

```javascript
fable.Dates.dayJS().format('YYYY-MM-DD');
fable.Math.addPrecise('1.5', '2.5');
fable.DataFormat.formatterDollars(1234.56);
```

### Services Map Access

All instantiated services are accessible through the services map:

```javascript
fable.services.Dates;
fable.servicesMap.Dates['Dates-Default'];
```

### Factory Methods

Some services provide convenient factory methods:

```javascript
// Create a new Anticipate instance without registration
const anticipate = fable.newAnticipate();

// Create a new Manifest instance without registration
const manifest = fable.newManyfest(definition);
```

## Configuration Flow

Settings flow from initialization through all services:

```
User Config → SettingsManager → Fable.settings → All Services
                    ↓
              fable-settings
              (precedent-based
               config merging)
```

Services access configuration through:

```javascript
this.fable.settings.SomeSetting;
this.fable.SettingsManager.settings;
```

## Logging Architecture

The logging system supports multiple output streams:

```
Application Code → fable.log → Log Router → Stream 1 (console)
                                         → Stream 2 (file)
                                         → Stream 3 (MongoDB)
                                         → Stream N (custom)
```

Log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`

Custom log providers can be created by extending `LogProviderBase`:

```javascript
const LogProviderBase = require('fable').LogProviderBase;

class CustomLogProvider extends LogProviderBase {
    write(pLogEntry) {
        // Custom logging implementation
    }
}
```

## Browser Compatibility

Fable supports browser environments through service remapping:

```javascript
// package.json browser field
{
    "browser": {
        "./source/service/Fable-Service-EnvironmentData.js":
            "./source/service/Fable-Service-EnvironmentData-Web.js",
        "./source/service/Fable-Service-FilePersistence.js":
            "./source/service/Fable-Service-FilePersistence-Web.js"
    }
}
```

The `dist/` folder contains browserified bundles for direct browser use.

## Extending Fable

### Creating Custom Services

```javascript
const libFableServiceBase = require('fable-serviceproviderbase');

class MyCustomService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'MyCustomService';
    }

    myMethod() {
        this.log.info('Doing something');
        return this.fable.Math.addPrecise('1', '2');
    }
}

// Register with Fable
fable.addAndInstantiateServiceType('MyCustomService', MyCustomService);

// Use it
fable.MyCustomService.myMethod();
```

### Service Initialization Hook

For advanced scenarios, Fable supports an extra initialization callback:

```javascript
fable.extraServiceInitialization = (pService) => {
    // Perform additional setup on every service
    pService.customProperty = 'value';
    return pService;
};
```
