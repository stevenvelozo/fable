# Fable

**A service dependency injection, configuration, and logging library for Node.js and browsers.**

Fable is a comprehensive framework that provides a service-oriented architecture with built-in dependency injection, configuration management, and logging. It enables you to bootstrap low-level application services in a single line of code.

## Overview

Fable acts as a service container and manager, providing:

- **Dependency Injection**: Services are automatically wired together through the Fable instance
- **Configuration Management**: Centralized settings with environment-aware loading
- **Pluggable Logging**: Multiple log destinations including console, files, MongoDB, and external services
- **UUID Generation**: Unique identifier generation with DataCenter and Worker encoding
- **Service Lifecycle Management**: Automatic instantiation and registration of services

## Installation

```bash
npm install fable
```

## Quick Start

```javascript
const Fable = require('fable');

// Create a new Fable instance with optional configuration
const fable = new Fable({
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

## Core Concepts

### Service Types

Fable services fall into three categories:

1. **Pre-initialized Services**: Core services that exist before Fable bootstraps
   - `SettingsManager` - Application configuration
   - `UUID` - Unique identifier generation
   - `Logging` - Logging system

2. **Auto-Instantiated Services**: Services created automatically on Fable initialization
   - `EnvironmentData` - OS/runtime environment information
   - `Dates` - Date manipulation using day.js
   - `DataFormat` - String and data formatting utilities
   - `DataGeneration` - Synthetic data generation
   - `Utility` - General utilities (object extension, templating, chunking)
   - `Logic` - Comparison and conditional operations
   - `Math` - Arbitrary precision math operations
   - `ProgressTime` - Execution timing and progress tracking

3. **On-Demand Services**: Services instantiated when needed
   - `Template` - Underscore-style template compilation
   - `MetaTemplate` - Advanced templating with meta-programming
   - `Anticipate` - Asynchronous operation sequencing
   - `RestClient` - HTTP/REST client with cookie management
   - `ExpressionParser` - Mathematical expression parser
   - `Operation` - Phased operation execution
   - `CSVParser` - CSV parsing with multi-line support
   - `FilePersistence` - File system operations
   - `Manifest` (manyfest) - Manifest/metadata management
   - `ObjectCache` (cachetrax) - Object caching

### Service Registration

```javascript
// Add a service type without instantiating
fable.addServiceType('MyService', MyServiceClass);

// Add and immediately instantiate a service
fable.addAndInstantiateServiceType('MyService', MyServiceClass);

// Instantiate a service on-demand
const myService = fable.instantiateServiceProvider('MyService', options, 'custom-hash');

// Instantiate without registering (useful for temporary services)
const tempService = fable.instantiateServiceProviderWithoutRegistration('MyService', options);
```

## Configuration

Fable accepts a configuration object that controls various aspects of behavior:

```javascript
const fable = new Fable({
    Product: 'MyApp',
    ProductVersion: '1.0.0',

    // UUID configuration
    UUID: {
        DataCenter: 0,
        Worker: 0
    },

    // Logging configuration
    LogStreams: [
        { level: 'info' },
        { level: 'error', path: '/var/log/myapp/error.log' }
    ],

    // REST client URL prefix
    RestClientURLPrefix: 'https://api.example.com'
});
```

## Browser Support

Fable includes browser compatibility through automatic service remapping:

- `EnvironmentData` → `EnvironmentData-Web`
- `FilePersistence` → `FilePersistence-Web`

A browserified bundle is available in `dist/fable.js` (or minified: `dist/fable.min.js`).

```html
<script src="node_modules/fable/dist/fable.min.js"></script>
<script>
    const fable = new Fable();
    console.log(fable.getUUID());
</script>
```

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `fable-log` | Logging framework with pluggable streams |
| `fable-settings` | Settings management |
| `fable-uuid` | UUID generation |
| `fable-serviceproviderbase` | Base class for all services |
| `big.js` | Arbitrary precision math |
| `dayjs` | Date manipulation |
| `manyfest` | Manifest/metadata management |
| `cachetrax` | Object caching |

## Documentation

- [Architecture](./architecture.md) - System architecture and design patterns
- [Services](./services/) - Detailed documentation for each service

## License

MIT License - See [LICENSE](../LICENSE) for details.

## Author

Steven Velozo <steven@velozo.com>
