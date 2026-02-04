# Fable Services

This directory contains documentation for each Fable service.

## Service Categories

### Pre-Initialized Services

These services are initialized before Fable fully bootstraps:

- [Settings Manager](./settings-manager.md) - Configuration management
- [UUID](./uuid.md) - Unique identifier generation
- [Logging](./logging.md) - Logging system

### Auto-Instantiated Services

These services are automatically created when Fable initializes:

- [EnvironmentData](./environment-data.md) - OS/runtime environment information
- [Dates](./dates.md) - Date manipulation using day.js
- [DataFormat](./data-format.md) - String and data formatting utilities
- [DataGeneration](./data-generation.md) - Synthetic data generation
- [Utility](./utility.md) - General utilities
- [Logic](./logic.md) - Comparison and conditional operations
- [Math](./math.md) - Arbitrary precision math operations
- [ProgressTime](./progress-time.md) - Execution timing and progress tracking

### On-Demand Services

These services are created when first requested:

- [Template](./template.md) - Underscore-style template compilation
- [MetaTemplate](./meta-template.md) - Advanced templating with meta-programming
- [Anticipate](./anticipate.md) - Asynchronous operation sequencing
- [RestClient](./rest-client.md) - HTTP/REST client
- [ExpressionParser](./expression-parser.md) - Mathematical expression parser
- [Operation](./operation.md) - Phased operation execution
- [CSVParser](./csv-parser.md) - CSV parsing
- [FilePersistence](./file-persistence.md) - File system operations
- [Manifest](./manifest.md) - Manifest/metadata management
- [ObjectCache](./object-cache.md) - Object caching

## Common Patterns

### Accessing Services

```javascript
// Auto-instantiated services are available directly
fable.Dates.dayJS().format('YYYY-MM-DD');
fable.Math.addPrecise('1', '2');

// On-demand services need to be instantiated first
const restClient = fable.instantiateServiceProvider('RestClient');
restClient.getJSON('https://api.example.com/data', (err, res, data) => {
    console.log(data);
});
```

### Creating Multiple Instances

```javascript
// Create named instances for different purposes
const apiClient = fable.instantiateServiceProvider('RestClient', {}, 'api');
const authClient = fable.instantiateServiceProvider('RestClient', {}, 'auth');
```

### Service Options

Most services accept an options object during instantiation:

```javascript
const service = fable.instantiateServiceProvider('ServiceType', {
    option1: 'value1',
    option2: 'value2'
}, 'optional-hash');
```
