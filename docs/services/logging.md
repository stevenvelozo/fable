# Logging Service

The Logging service provides a pluggable logging system that supports multiple output streams and log levels.

## Access

```javascript
// Pre-initialized, available directly
fable.log
fable.Logging
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
fable.log.info('User logged in', { userId: 123, username: 'john' });
fable.log.error('Database connection failed', { host: 'db.example.com', port: 5432 });
```

## Configuration

Configure logging when creating a Fable instance:

```javascript
const fable = new Fable({
    Product: 'MyApp',
    ProductVersion: '1.0.0',

    LogStreams: [
        // Console output at info level
        { level: 'info' },

        // File output for errors
        {
            level: 'error',
            path: '/var/log/myapp/error.log'
        },

        // MongoDB stream
        {
            level: 'warn',
            streamtype: 'mongodb',
            // MongoDB-specific configuration
        }
    ]
});
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
const timestamp = fable.log.getTimeStamp();
// Returns milliseconds since epoch
```

## Custom Log Providers

Create custom log providers by extending `LogProviderBase`:

```javascript
const LogProviderBase = require('fable').LogProviderBase;

class CustomLogProvider extends LogProviderBase {
    initialize() {
        // Setup code
        this.myConnection = createConnection();
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

// Register the custom provider
fable.Logging.addStream(new CustomLogProvider(fable.Logging));
```

### Log Entry Structure

```javascript
{
    dt: 1704067200000,           // Timestamp (milliseconds)
    lvl: 'info',                 // Log level
    src: 'MyApp v1.0.0',         // Product/version
    msg: 'User logged in',       // Message
    dat: { userId: 123 }         // Additional data (optional)
}
```

## Log Streams

### Console Stream (Default)

Outputs to standard console:

```javascript
{
    level: 'info'  // Shows info and above
}
```

### File Stream

Writes to a file:

```javascript
{
    level: 'error',
    path: '/var/log/myapp/error.log'
}
```

### Multiple Streams

Configure multiple outputs:

```javascript
const fable = new Fable({
    LogStreams: [
        // Development console (all levels)
        { level: 'trace' },

        // Production file (warnings and above)
        { level: 'warn', path: '/var/log/app.log' },

        // Error alerting service
        { level: 'error', streamtype: 'alerting' }
    ]
});
```

## Noisiness Control

Control the verbosity of internal Fable logging:

```javascript
fable.LogNoisiness = 0;  // Quiet (default)
fable.LogNoisiness = 1;  // Normal
fable.LogNoisiness = 2;  // Verbose
```

## Integration with Services

All Fable services have access to logging via `this.log`:

```javascript
class MyService extends libFableServiceBase {
    constructor(pFable, pOptions, pServiceHash) {
        super(pFable, pOptions, pServiceHash);
    }

    doSomething() {
        this.log.info('Doing something');
        try {
            // operation
        } catch (error) {
            this.log.error('Operation failed', { error: error.message });
        }
    }
}
```

## Best Practices

1. **Use appropriate levels**: Don't log everything at `info`
2. **Include context**: Pass relevant data as the second parameter
3. **Structure your data**: Use consistent property names in log context
4. **Don't log sensitive data**: Avoid logging passwords, tokens, or PII
5. **Use trace for detailed debugging**: Enable only when needed

```javascript
// Good
fable.log.info('Order processed', { orderId: order.id, total: order.total });

// Avoid
fable.log.info('Order processed: ' + JSON.stringify(order));
```

## Environment-Based Configuration

Set up different logging based on environment:

```javascript
const logStreams = process.env.NODE_ENV === 'production'
    ? [
        { level: 'warn', path: '/var/log/app.log' },
        { level: 'error', streamtype: 'alerting' }
      ]
    : [
        { level: 'trace' }  // Console only in development
      ];

const fable = new Fable({ LogStreams: logStreams });
```
