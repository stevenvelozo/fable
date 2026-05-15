# Fable

> A service dependency injection, configuration, and logging library for Node.js and browsers

Fable is a comprehensive framework that provides a service-oriented architecture with built-in dependency injection, configuration management, and logging. It enables you to bootstrap low-level application services in a single line of code.

## Features

- **Dependency Injection** - Services are automatically wired together through the Fable instance
- **Configuration Management** - Centralized settings with environment-aware loading
- **Pluggable Logging** - Multiple log destinations including console, files, and external services
- **UUID Generation** - Unique identifier generation with DataCenter and Worker encoding
- **Service Lifecycle Management** - Automatic instantiation and registration of services
- **Browser & Node.js** - Works seamlessly in both environments

## Quick Start

```javascript
const libFable = require('fable');

// Create a new Fable instance with optional configuration
const fable = new libFable({
    Product: 'MyApplication',
    ProductVersion: '1.0.0',
    LogStreams: [
        { level: 'info' }
    ]
});

// Access built-in services
fable.log.info('Application started');
console.log('UUID:', fable.getUUID());
console.log('Current date:', fable.Dates.dayJS().format('YYYY-MM-DD'));
```

## Installation

```bash
npm install fable
```

## Core Concepts

### Service Types

Fable services fall into three categories:

1. **Pre-initialized Services** - Core services that exist before Fable bootstraps (SettingsManager, UUID, Logging)

2. **Auto-Instantiated Services** - Services created automatically on Fable initialization (EnvironmentData, Dates, DataFormat, DataGeneration, Utility, Logic, Math, ProgressTime)

3. **On-Demand Services** - Services instantiated when needed (Template, MetaTemplate, Anticipate, RestClient, ExpressionParser, Operation, CSVParser, FilePersistence, Manifest, ObjectCache)

### Service Registration

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'ServiceRegistrationDemo', ProductVersion: '1.0.0' });

// A trivial service class for demonstration purposes
class MyServiceClass extends libFableServiceBase
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'MyService';
    }
}
const options = { greeting: 'hello' };

// Add a service type without instantiating
fable.addServiceType('MyService', MyServiceClass);
console.log('Registered service types include MyService:', 'MyService' in fable.serviceTypes);

// Add and immediately instantiate a service
fable.addAndInstantiateServiceType('AnotherService', MyServiceClass);
console.log('AnotherService instantiated:', typeof fable.AnotherService);

// Instantiate a service on-demand
const myService = fable.instantiateServiceProvider('MyService', options, 'custom-hash');
console.log('myService.serviceType:', myService.serviceType);
```

## Configuration

Fable accepts a configuration object that controls various aspects of behavior:

```javascript
const libFable = require('fable');

const fable = new libFable({
    Product: 'MyApp',
    ProductVersion: '1.0.0',
    UUID: { DataCenter: 0, Worker: 0 },
    LogStreams: [
        { level: 'info' }
        // In Node.js you can also write a file-based stream, e.g.:
        // { level: 'error', path: '/var/log/myapp/error.log' }
    ],
    RestClientURLPrefix: 'https://api.example.com'
});

console.log('Configured fable:', fable.settings.Product, 'v' + fable.settings.ProductVersion);
console.log('RestClientURLPrefix setting:', fable.settings.RestClientURLPrefix);
```

## Documentation

- [Architecture](architecture.md) - System architecture and design patterns
- [Services](services/README.md) - Detailed documentation for each service

## Related Packages

- [fable-log](https://github.com/stevenvelozo/fable-log) - Logging framework
- [fable-settings](https://github.com/stevenvelozo/fable-settings) - Settings management
- [fable-uuid](https://github.com/stevenvelozo/fable-uuid) - UUID generation
- [fable-serviceproviderbase](https://github.com/stevenvelozo/fable-serviceproviderbase) - Service provider base class
- [pict](https://github.com/stevenvelozo/pict) - UI framework
