# Settings Manager Service

The Settings Manager provides centralized configuration management for Fable applications, with support for environment-aware settings and default value merging.

## Access

```javascript
// Pre-initialized, available directly
fable.SettingsManager
fable.settings  // Shorthand for SettingsManager.settings
fable.settingsManager  // Alias
```

## Basic Usage

### Reading Settings

```javascript
// Access settings directly
const productName = fable.settings.Product;
const version = fable.settings.ProductVersion;

// Access nested settings
const dbHost = fable.settings.Database.Host;
```

### Providing Configuration

Pass settings when creating a Fable instance:

```javascript
const fable = new Fable({
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
```

## Default Settings

Fable provides sensible defaults that your configuration extends:

```javascript
{
    Product: 'Fable',
    ProductVersion: '0.0.0',

    UUID: {
        DataCenter: 0,
        Worker: 0
    },

    LogStreams: [
        { level: 'info' }
    ]
}
```

Your settings are merged with these defaults using [precedent](https://github.com/stevenvelozo/precedent).

## Environment-Aware Configuration

### Using Environment Variables

```javascript
const fable = new Fable({
    Product: 'MyApp',

    Database: {
        Host: process.env.DB_HOST || 'localhost',
        Port: parseInt(process.env.DB_PORT) || 5432,
        Password: process.env.DB_PASSWORD
    }
});
```

### Environment-Specific Config Files

```javascript
const environment = process.env.NODE_ENV || 'development';
const config = require(`./config/${environment}.json`);

const fable = new Fable(config);
```

## Precedent Integration

The Settings Manager uses precedent for deep configuration merging:

```javascript
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

// Result: { API: { Timeout: 30000, RetryCount: 3 } }
```

## Configuration Patterns

### Layered Configuration

```javascript
const defaults = require('./config/default.json');
const environment = require(`./config/${process.env.NODE_ENV}.json`);
const local = require('./config/local.json');  // gitignored

const fable = new Fable({
    ...defaults,
    ...environment,
    ...local
});
```

### Feature Flags

```javascript
const fable = new Fable({
    Features: {
        NewDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
        BetaAPI: false
    }
});

// Usage
if (fable.settings.Features.NewDashboard) {
    // New dashboard code
}
```

### Service Configuration

```javascript
const fable = new Fable({
    Services: {
        Email: {
            Provider: 'sendgrid',
            APIKey: process.env.SENDGRID_API_KEY
        },
        Storage: {
            Provider: 's3',
            Bucket: 'my-app-storage'
        }
    }
});
```

## Accessing Settings in Services

All Fable services can access settings:

```javascript
class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);

        // Access global settings
        this.apiUrl = this.fable.settings.API.BaseURL;

        // Access service-specific options
        this.localOption = this.options.myOption;
    }
}
```

## Common Configuration Options

### Product Information

```javascript
{
    Product: 'MyApp',
    ProductVersion: '1.0.0'
}
```

### UUID Configuration

```javascript
{
    UUID: {
        DataCenter: 1,  // 0-31
        Worker: 5       // 0-31
    }
}
```

### Logging Configuration

```javascript
{
    LogStreams: [
        { level: 'info' },
        { level: 'error', path: '/var/log/app/error.log' }
    ]
}
```

### REST Client Configuration

```javascript
{
    RestClientURLPrefix: 'https://api.example.com/v1'
}
```

## Best Practices

1. **Don't hardcode secrets**: Use environment variables
2. **Use typed configuration**: Define interfaces for your config shape
3. **Provide sensible defaults**: Make configuration optional where possible
4. **Document your settings**: List all configuration options
5. **Validate on startup**: Check for required settings early

```javascript
// Validation example
const fable = new Fable(config);

if (!fable.settings.Database?.Host) {
    throw new Error('Database.Host is required');
}
```

## Reading External Config Files

```javascript
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const fable = new Fable(config);
```

## Runtime Configuration Updates

While generally not recommended, settings can be modified at runtime:

```javascript
// Not recommended, but possible
fable.settings.MyFeature.Enabled = true;

// Better: Use a service for dynamic configuration
```
