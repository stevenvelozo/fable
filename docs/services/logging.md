# Logging Service

The Logging service provides a pluggable logging system that supports multiple output streams and log levels.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

// Pre-initialized, available directly
console.log('fable.log:',     typeof fable.log);
console.log('fable.Logging:', typeof fable.Logging);
```

## Log Levels

From most to least verbose:

1. `trace` - Detailed debugging information
2. `debug` - Debug information
3. `info` - Informational messages
4. `warn` - Warning messages
5. `error` - Error messages
6. `fatal` - Critical errors

## Basic Logging

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

fable.log.trace('Detailed trace information');
fable.log.debug('Debug message');
fable.log.info('Application started');
fable.log.warn('Resource running low');
fable.log.error('Operation failed');
fable.log.fatal('Critical system failure');
```

## Logging with Context

Pass additional context as a second parameter:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

fable.log.info('User logged in', { userId: 123, username: 'john' });
fable.log.error('Database connection failed', { host: 'db.example.com', port: 5432 });
```

## Configuration

Configure logging when creating a Fable instance:

```javascript
const libFable = require('fable');

const fable = new libFable({
    Product: 'MyApp',
    ProductVersion: '1.0.0',

    LogStreams: [
        // Console output at info level
        { level: 'info' }

        // In Node.js you can add file and external streams:
        // { level: 'error', path: '/var/log/myapp/error.log' },
        // { level: 'warn',  streamtype: 'mongodb' /* MongoDB-specific config */ }
    ]
});

fable.log.info('Logging configured with', fable.settings.LogStreams.length, 'stream(s)');
```

### Stream Configuration

Each log stream can have:

| Property | Description |
|----------|-------------|
| `level` | Minimum log level for this stream |
| `path` | File path for file streams |
| `streamtype` | Stream type identifier |

## Timestamp

Get the current timestamp:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

const timestamp = fable.log.getTimeStamp();
console.log('timestamp:', timestamp);
// Returns milliseconds since epoch
```

## Custom Log Providers

Create custom log providers by extending `LogProviderBase`:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

// A stub connection for the playground demo
function createConnection() {
    return { send: (entry) => console.log('CustomLogProvider received entry:', entry) };
}

const LogProviderBase = require('fable-log').LogProviderBase;

class CustomLogProvider extends LogProviderBase {
    initialize() {
        // Setup code
        this.myConnection = createConnection();
        console.log('CustomLogProvider initialized');
    }

    write(pLogEntry) {
        // pLogEntry contains:
        // - dt: timestamp
        // - lvl: log level
        // - src: source/product
        // - msg: message
        // - dat: additional data

        this.myConnection.send(pLogEntry);
    }
}

// Register the custom provider with fable.Logging
const customProvider = new CustomLogProvider(fable.Logging, { level: 'trace' });
customProvider.initialize();
fable.Logging.addLogger(customProvider);
fable.log.info('CustomLogProvider registered — fable.log calls now also hit it');
```

### Log Entry Structure

```javascript
const sampleLogEntry = {
    dt: 1704067200000,           // Timestamp (milliseconds)
    lvl: 'info',                 // Log level
    src: 'MyApp v1.0.0',         // Product/version
    msg: 'User logged in',       // Message
    dat: { userId: 123 }         // Additional data (optional)
};
console.log('sampleLogEntry:', sampleLogEntry);
```

## Log Streams

### Console Stream (Default)

Outputs to standard console:

```javascript
const consoleStreamConfig = {
    level: 'info'  // Shows info and above
};
console.log('consoleStreamConfig:', consoleStreamConfig);
```

### File Stream

Writes to a file (Node.js only):

```javascript
const fileStreamConfig = {
    level: 'error',
    path: '/var/log/myapp/error.log'
};
console.log('fileStreamConfig:', fileStreamConfig);
```

### Multiple Streams

Configure multiple outputs:

```javascript
const libFable = require('fable');

const fable = new libFable({
    LogStreams: [
        // Development console (all levels)
        { level: 'trace' }

        // In Node.js you can add file and external streams:
        // { level: 'warn',  path: '/var/log/app.log' },
        // { level: 'error', streamtype: 'alerting' }
    ]
});

console.log('Configured streams:', fable.settings.LogStreams.length);
fable.log.trace('Trace-level message (visible because lowest stream level is trace)');
```

## Noisiness Control

Control the verbosity of internal Fable logging:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

fable.LogNoisiness = 0;  // Quiet (default)
console.log('LogNoisiness =', fable.LogNoisiness);

fable.LogNoisiness = 1;  // Normal
console.log('LogNoisiness =', fable.LogNoisiness);

fable.LogNoisiness = 2;  // Verbose
console.log('LogNoisiness =', fable.LogNoisiness);
```

## Integration with Services

All Fable services have access to logging via `this.log`:

```javascript
const libFable = require('fable');
const libFableServiceBase = require('fable-serviceproviderbase');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'MyService';
    }

    doSomething() {
        this.log.info('Doing something');
        try {
            // operation
            throw new Error('demo failure');
        } catch (error) {
            this.log.error('Operation failed', { error: error.message });
        }
    }
}

fable.addAndInstantiateServiceType('MyService', MyService);
fable.MyService.doSomething();
```

## Best Practices

1. **Use appropriate levels**: Don't log everything at `info`
2. **Include context**: Pass relevant data as the second parameter
3. **Structure your data**: Use consistent property names in log context
4. **Don't log sensitive data**: Avoid logging passwords, tokens, or PII
5. **Use trace for detailed debugging**: Enable only when needed

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'LoggingDemo', ProductVersion: '1.0.0' });

const order = { id: 'order-001', total: 49.99 };

// Good
fable.log.info('Order processed', { orderId: order.id, total: order.total });

// Avoid
fable.log.info('Order processed: ' + JSON.stringify(order));
```

## Environment-Based Configuration

Set up different logging based on environment:

```javascript
const libFable = require('fable');

const nodeEnv = (typeof process !== 'undefined' && process.env)
    ? process.env.NODE_ENV
    : 'browser';

const logStreams = nodeEnv === 'production'
    ? [
        { level: 'warn',  path: '/var/log/app.log' },
        { level: 'error', streamtype: 'alerting' }
      ]
    : [
        { level: 'trace' }  // Console only in development
      ];

const fable = new libFable({ LogStreams: logStreams });
console.log('nodeEnv:', nodeEnv);
console.log('LogStreams configured:', fable.settings.LogStreams);
```
