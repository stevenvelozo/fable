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
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'MyService';

        // Access other services through fable
        this.log      = this.fable.log;
        this.settings = this.fable.settings;
    }
}

fable.addAndInstantiateServiceType('MyService', MyService);
console.log('MyService wired up; log + settings accessible:',
    typeof fable.MyService.log, typeof fable.MyService.settings);
```

### Lazy Instantiation

Services can be registered without being instantiated, allowing for on-demand creation when first needed:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

class ExpensiveServiceClass extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'ExpensiveService';
        console.log('ExpensiveServiceClass instantiated - work happens here.');
    }
}

// Register without instantiating
fable.addServiceType('ExpensiveService', ExpensiveServiceClass);
console.log('Registered; no instance yet.');

// Later, when needed
const service = fable.instantiateServiceProvider('ExpensiveService');
console.log('Instantiated:', service.serviceType);
```

### Service Containers

Each service type maintains a map of instances, supporting multiple named instances of the same service type:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// Create multiple instances of the same service type
const clientA = fable.instantiateServiceProvider('RestClient', {}, 'api-client');
const clientB = fable.instantiateServiceProvider('RestClient', {}, 'auth-client');

// Access via services map
console.log('api-client:',  typeof fable.servicesMap.RestClient['api-client']);
console.log('auth-client:', typeof fable.servicesMap.RestClient['auth-client']);
```

### Default Service Pattern

The first instance of each service type becomes the default accessor on the Fable object:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// First instantiation becomes default
fable.instantiateServiceProvider('RestClient', {}, 'primary');

// Now accessible directly
console.log('fable.RestClient:',           typeof fable.RestClient);           // The 'primary' instance
console.log('fable.services.RestClient:',  typeof fable.services.RestClient);  // Same as above
```

## Initialization Phases

Fable initializes in distinct phases to ensure proper dependency ordering:

### Phase 0: Core State Setup

The lowest level state and service infrastructure is established:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// Inside Fable's constructor, Phase 0 sets up its own service-manager state:
//   this.serviceType    = 'ServiceManager';
//   this.serviceTypes   = [];      // Array of registered service types
//   this.servicesMap    = {};      // Map of instantiated services by type and hash
//   this.services       = {};      // Map of default service instances
//   this.serviceClasses = {};      // Map of service class constructors
//
// You can observe these on a constructed instance:
console.log('serviceType:',         fable.serviceType);
console.log('serviceTypes count:',  fable.serviceTypes.length);
console.log('servicesMap keys:',    Object.keys(fable.servicesMap).slice(0, 5), '...');
console.log('services keys:',       Object.keys(fable.services).slice(0, 5),    '...');
```

### Phase 1: Core Utility Services

Fundamental services required for Fable to operate:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// Inside Fable's constructor, Phase 1 wires up the core utility services:
//   this.SettingsManager = new libFableSettings(pSettings);
//   this.UUID            = new libFableUUID(this.SettingsManager.settings);
//   this.Logging         = new libFableLog(this.SettingsManager.settings);
//   this.Logging.initialize();
//
// On the constructed instance these are all live:
console.log('SettingsManager:', typeof fable.SettingsManager);
console.log('UUID:',            typeof fable.UUID);
console.log('Logging:',         typeof fable.Logging);
```

### Phase 1.5: Self-Registration

Fable registers itself as a service, enabling consistent service access patterns:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// Inside Fable's constructor, Phase 1.5 self-registers:
//   this.ServiceManager = this;
//   this.connectFable(this);
//
// On the constructed instance, fable.ServiceManager === fable:
console.log('fable.ServiceManager === fable:', fable.ServiceManager === fable);
```

### Phase 2: Default Built-in Services

All default services are registered and optionally instantiated:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// Inside Fable's constructor, Phase 2 registers all built-in services:
//   // Auto-instantiated (available immediately)
//   this.addAndInstantiateServiceType('EnvironmentData', ...);
//   this.addAndInstantiateServiceType('Dates', ...);
//   this.addAndInstantiateServiceType('DataFormat', ...);
//   ...
//   // On-demand (registered but not instantiated)
//   this.addServiceType('Template', ...);
//   this.addServiceType('RestClient', ...);
//   ...
//
// On the constructed instance, you can see both:
const autoInstantiated = Object.keys(fable.services).filter(k => fable[k]);
console.log('Auto-instantiated services:', autoInstantiated.join(', '));
console.log('Registered service types:',   fable.serviceTypes.join(', '));
```

## Service Base Class

All Fable services extend `CoreServiceProviderBase` from `fable-serviceproviderbase`:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

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

fable.addAndInstantiateServiceType('MyService', MyService);
const svc = fable.MyService;
console.log('serviceType:',  svc.serviceType);
console.log('fable ref:',    typeof svc.fable);
console.log('log:',          typeof svc.log);
console.log('options:',      typeof svc.options);
console.log('Hash:',         svc.Hash);
```

## Service Registration Methods

### `addServiceType(pServiceType, pServiceClass)`

Registers a service class without instantiation:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

class MyServiceClass extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) { super(pFable, pOptions, pServiceHash); this.serviceType = 'MyService'; }
}

fable.addServiceType('MyService', MyServiceClass);
console.log('Registered:', fable.serviceTypes.includes('MyService'));
```

### `addAndInstantiateServiceType(pServiceType, pServiceClass)`

Registers and immediately creates a default instance:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

class MyServiceClass extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) { super(pFable, pOptions, pServiceHash); this.serviceType = 'MyService'; }
}

fable.addAndInstantiateServiceType('MyService', MyServiceClass);
// Creates instance with hash 'MyService-Default'
console.log('Default instance Hash:', fable.MyService.Hash);
```

### `instantiateServiceProvider(pServiceType, pOptions, pCustomServiceHash)`

Creates a new instance of a registered service:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

class MyServiceClass extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) { super(pFable, pOptions, pServiceHash); this.serviceType = 'MyService'; }
}

fable.addServiceType('MyService', MyServiceClass);

const service = fable.instantiateServiceProvider('MyService',
    { option: 'value' },
    'my-custom-hash'
);
console.log('Service Hash:', service.Hash);
console.log('Service options:', service.options);
```

### `instantiateServiceProviderFromPrototype(pServiceType, pOptions, pCustomServiceHash, pServicePrototype)`

Creates an instance using a custom class that may differ from the registered class:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

class MyServiceClass extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) { super(pFable, pOptions, pServiceHash); this.serviceType = 'MyService'; }
}
fable.addServiceType('MyService', MyServiceClass);

class CustomizedService extends MyServiceClass {
    constructor(pFable, pOptions, pServiceHash) { super(pFable, pOptions, pServiceHash); this.flavor = 'custom'; }
}

const options = { mode: 'demo' };
const service = fable.instantiateServiceProviderFromPrototype(
    'MyService',
    options,
    'customized',
    CustomizedService
);
console.log('Custom flavor:', service.flavor);
console.log('Hash:',          service.Hash);
```

## Service Access Patterns

### Direct Property Access

Auto-instantiated services are available directly on the Fable instance:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dayJS().format('YYYY-MM-DD'));
console.log(fable.Math.addPrecise('1.5', '2.5'));
console.log(fable.DataFormat.formatterDollars(1234.56));
```

### Services Map Access

All instantiated services are accessible through the services map:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

console.log('fable.services.Dates:',                 typeof fable.services.Dates);
console.log("fable.servicesMap.Dates['Dates-Default']:", typeof fable.servicesMap.Dates['Dates-Default']);
```

### Factory Methods

Some services provide convenient factory methods:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

// Create a new Anticipate instance without registration
const anticipate = fable.newAnticipate();
console.log('anticipate:', typeof anticipate);

// Create a new Manifest instance without registration
const definition = { Scope: 'Demo', Descriptors: { Foo: { Hash: 'foo', Type: 'String' } } };
const manifest = fable.newManyfest(definition);
console.log('manifest scope:', manifest.scope);
```

## Configuration Flow

Settings flow from initialization through all services:

```
User Config -> SettingsManager -> Fable.settings -> All Services
                    ↓
              fable-settings
              (precedent-based
               config merging)
```

Services access configuration through:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', SomeSetting: 'demo-value' });

// Inside a service, you access config via:
//   this.fable.settings.SomeSetting
//   this.fable.SettingsManager.settings
//
// At the top level, drop "this.":
console.log('settings.SomeSetting:',          fable.settings.SomeSetting);
console.log('SettingsManager.settings type:', typeof fable.SettingsManager.settings);
```

## Logging Architecture

The logging system supports multiple output streams:

```
Application Code -> fable.log -> Log Router -> Stream 1 (console)
                                         -> Stream 2 (file)
                                         -> Stream 3 (MongoDB)
                                         -> Stream N (custom)
```

Log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`

Custom log providers can be created by extending `LogProviderBase`:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

const LogProviderBase = require('fable-log').LogProviderBase;

class CustomLogProvider extends LogProviderBase {
    write(pLogEntry) {
        // Custom logging implementation
        console.log('CustomLogProvider received:', pLogEntry.msg);
    }
}

const provider = new CustomLogProvider(fable.Logging, { level: 'trace' });
provider.initialize();
fable.Logging.addLogger(provider);
fable.log.info('Hello from custom provider demo');
```

## Browser Compatibility

Fable supports browser environments through service remapping:

```javascript
// Shape of the browser remap declared in package.json:
const packageJSONBrowserField = {
    "browser": {
        "./source/service/Fable-Service-EnvironmentData.js":
            "./source/service/Fable-Service-EnvironmentData-Web.js",
        "./source/service/Fable-Service-FilePersistence.js":
            "./source/service/Fable-Service-FilePersistence-Web.js"
    }
};
console.log('Browser remap entries:', Object.keys(packageJSONBrowserField.browser).length);
```

The `dist/` folder contains browserified bundles for direct browser use.

## Extending Fable

### Creating Custom Services

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

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
console.log('myMethod() returns:', fable.MyCustomService.myMethod());
```

### Service Initialization Hook

For advanced scenarios, Fable supports an extra initialization callback:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ArchitectureDemo', ProductVersion: '1.0.0' });

fable.extraServiceInitialization = (pService) => {
    // Perform additional setup on every service
    pService.customProperty = 'value';
    return pService;
};

// Subsequent service instantiations now pass through the hook:
class DemoService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) { super(pFable, pOptions, pServiceHash); this.serviceType = 'DemoService'; }
}
fable.addAndInstantiateServiceType('DemoService', DemoService);
console.log('DemoService.customProperty:', fable.DemoService.customProperty);
```
