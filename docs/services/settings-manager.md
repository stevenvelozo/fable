# Settings Manager Service

The Settings Manager provides centralized configuration management for Fable applications, with support for environment-aware settings and default value merging.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'SettingsDemo', ProductVersion: '1.0.0' });

// Pre-initialized, available directly
console.log('fable.SettingsManager:', typeof fable.SettingsManager);
console.log('fable.settings:',        typeof fable.settings,        '(shorthand for SettingsManager.settings)');
console.log('fable.settingsManager:', typeof fable.settingsManager, '(alias)');
```

## Basic Usage

### Reading Settings

```javascript
const libFable = require('fable');
const fable = new libFable({
    Product: 'MyApplication',
    ProductVersion: '1.0.0',
    Database: { Host: 'localhost' }
});

// Access settings directly
const productName = fable.settings.Product;
const version     = fable.settings.ProductVersion;

// Access nested settings
const dbHost = fable.settings.Database.Host;

console.log('productName:', productName, 'version:', version, 'dbHost:', dbHost);
```

### Providing Configuration

Pass settings when creating a Fable instance:

```javascript
const libFable = require('fable');

const fable = new libFable({
    Product: 'MyApplication',
    ProductVersion: '1.0.0',

    Database: {
        Host: 'localhost',
        Port: 5432,
        Name: 'myapp'
    },

    API: {
        BaseURL: 'https://api.example.com',
        Timeout: 30000
    }
});

console.log('Database.Host:', fable.settings.Database.Host);
console.log('API.BaseURL:',   fable.settings.API.BaseURL);
```

## Default Settings

Fable provides sensible defaults that your configuration extends:

```javascript
const defaultSettingsShape = {
    Product: 'Fable',
    ProductVersion: '0.0.0',

    UUID: {
        DataCenter: 0,
        Worker: 0
    },

    LogStreams: [
        { level: 'info' }
    ]
};
console.log('defaultSettingsShape:', defaultSettingsShape);
```

Your settings are merged with these defaults using [precedent](https://github.com/fable-retold/precedent).

## Environment-Aware Configuration

### Using Environment Variables

```javascript
const libFable = require('fable');

const env = (typeof process !== 'undefined' && process.env) ? process.env : {};

const fable = new libFable({
    Product: 'MyApp',

    Database: {
        Host:     env.DB_HOST || 'localhost',
        Port:     parseInt(env.DB_PORT) || 5432,
        Password: env.DB_PASSWORD
    }
});

console.log('Database.Host:', fable.settings.Database.Host);
console.log('Database.Port:', fable.settings.Database.Port);
```

### Environment-Specific Config Files

```javascript
const libFable = require('fable');

const environment = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : 'development';

// In Node.js you would load config like this:
//   const config = require(`./config/${environment}.json`);
// In this playground we just construct an in-memory equivalent.
const config = { Product: 'MyApp', Environment: environment };

const fable = new libFable(config);
console.log('environment:', environment);
console.log('Configured product:', fable.settings.Product);
```

## Precedent Integration

The Settings Manager uses precedent for deep configuration merging:

```javascript
const libFable = require('fable');

// Base configuration
const baseConfig = {
    API: {
        Timeout: 5000,
        RetryCount: 3
    }
};

// Environment override
const envConfig = {
    API: {
        Timeout: 30000  // Override just the timeout
    }
};

// Merge happens automatically through Fable's settings layer (precedent)
const fable = new libFable(baseConfig);
fable.settingsManager.fill(envConfig);
console.log('Merged API settings:', fable.settings.API);
// Result: { API: { Timeout: 30000, RetryCount: 3 } }
```

## Configuration Patterns

### Layered Configuration

```javascript
const libFable = require('fable');

// In Node.js you would load these from JSON files on disk:
//   const defaults    = require('./config/default.json');
//   const environment = require(`./config/${process.env.NODE_ENV}.json`);
//   const local       = require('./config/local.json');  // gitignored
// For the playground we use in-memory objects to show the layering shape:
const defaults    = { Product: 'MyApp', API: { Timeout: 5000 } };
const environment = { API: { Timeout: 30000 } };
const local       = { API: { BaseURL: 'http://localhost:8080' } };

const fable = new libFable({
    ...defaults,
    ...environment,
    ...local
});

console.log('Layered config result:', fable.settings.API);
```

### Feature Flags

```javascript
const libFable = require('fable');

const env = (typeof process !== 'undefined' && process.env) ? process.env : {};

const fable = new libFable({
    Features: {
        NewDashboard: env.FEATURE_NEW_DASHBOARD === 'true',
        BetaAPI: false
    }
});

// Usage
if (fable.settings.Features.NewDashboard) {
    console.log('NewDashboard feature is ON');
} else {
    console.log('NewDashboard feature is OFF (set FEATURE_NEW_DASHBOARD=true to enable)');
}
```

### Service Configuration

```javascript
const libFable = require('fable');

const env = (typeof process !== 'undefined' && process.env) ? process.env : {};

const fable = new libFable({
    Services: {
        Email: {
            Provider: 'sendgrid',
            APIKey: env.SENDGRID_API_KEY
        },
        Storage: {
            Provider: 's3',
            Bucket: 'my-app-storage'
        }
    }
});

console.log('Email provider:', fable.settings.Services.Email.Provider);
console.log('Storage bucket:', fable.settings.Services.Storage.Bucket);
```

## Accessing Settings in Services

All Fable services can access settings:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({
    Product: 'SettingsServiceDemo',
    API: { BaseURL: 'https://api.example.com' }
});

class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'MyService';

        // Access global settings
        this.apiUrl = this.fable.settings.API.BaseURL;

        // Access service-specific options
        this.localOption = this.options.myOption;
    }
}

fable.addAndInstantiateServiceType('MyService', MyService);
const svc = fable.instantiateServiceProvider('MyService', { myOption: 'demo-value' }, 'demo');
console.log('apiUrl:',      svc.apiUrl);
console.log('localOption:', svc.localOption);
```

## Common Configuration Options

### Product Information

```javascript
const productInfoConfig = {
    Product: 'MyApp',
    ProductVersion: '1.0.0'
};
console.log('productInfoConfig:', productInfoConfig);
```

### UUID Configuration

```javascript
const uuidConfig = {
    UUID: {
        DataCenter: 1,  // 0-31
        Worker: 5       // 0-31
    }
};
console.log('uuidConfig:', uuidConfig);
```

### Logging Configuration

```javascript
const loggingConfig = {
    LogStreams: [
        { level: 'info' },
        { level: 'error', path: '/var/log/app/error.log' }
    ]
};
console.log('loggingConfig:', loggingConfig);
```

### REST Client Configuration

```javascript
const restClientConfig = {
    RestClientURLPrefix: 'https://api.example.com/v1'
};
console.log('restClientConfig:', restClientConfig);
```

## Best Practices

1. **Don't hardcode secrets**: Use environment variables
2. **Use typed configuration**: Define interfaces for your config shape
3. **Provide sensible defaults**: Make configuration optional where possible
4. **Document your settings**: List all configuration options
5. **Validate on startup**: Check for required settings early

```javascript
const libFable = require('fable');

// Validation example
const config = { Product: 'MyApp', Database: { Host: 'localhost' } };
const fable = new libFable(config);

if (!fable.settings.Database?.Host) {
    throw new Error('Database.Host is required');
}
console.log('Validation passed — Database.Host =', fable.settings.Database.Host);
```

## Reading External Config Files

```javascript
// Node.js reference — this pattern uses fs which is not available in the browser playground.
console.info("In Node.js:");
console.info("    const fs   = require('fs');");
console.info("    const path = require('path');");
console.info("    const configPath = path.join(__dirname, 'config.json');");
console.info("    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));");
console.info("    const fable = new (require('fable'))(config);");
```

## Runtime Configuration Updates

While generally not recommended, settings can be modified at runtime:

```javascript
const libFable = require('fable');
const fable = new libFable({
    Product: 'RuntimeMutationDemo',
    MyFeature: { Enabled: false }
});

console.log('Before:', fable.settings.MyFeature.Enabled);

// Not recommended, but possible
fable.settings.MyFeature.Enabled = true;

console.log('After:',  fable.settings.MyFeature.Enabled);
// Better: Use a service for dynamic configuration
```
