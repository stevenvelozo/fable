# EnvironmentData Service

The EnvironmentData service provides information about the operating system and runtime environment.

## Access

```javascript
// Auto-instantiated, available directly
fable.EnvironmentData
```

## Platform Information

The service automatically detects and exposes environment information on instantiation.

## Browser vs Node.js

Fable automatically uses the appropriate implementation:

- **Node.js**: `Fable-Service-EnvironmentData.js` - Full OS information
- **Browser**: `Fable-Service-EnvironmentData-Web.js` - Browser-compatible subset

## Available Properties

### Node.js Environment

```javascript
fable.EnvironmentData.platform    // e.g., 'linux', 'darwin', 'win32'
fable.EnvironmentData.arch        // e.g., 'x64', 'arm64'
fable.EnvironmentData.hostname    // Machine hostname
fable.EnvironmentData.type        // OS type, e.g., 'Linux', 'Darwin', 'Windows_NT'
fable.EnvironmentData.release     // OS release version
fable.EnvironmentData.cpus        // Number of CPU cores
fable.EnvironmentData.totalmem    // Total system memory in bytes
fable.EnvironmentData.freemem     // Free memory in bytes
fable.EnvironmentData.uptime      // System uptime in seconds
```

### Browser Environment

In browsers, the service provides limited information based on what's available:

```javascript
fable.EnvironmentData.platform    // Browser platform string
fable.EnvironmentData.userAgent   // Browser user agent
```

## Use Cases

### Environment-Specific Behavior

```javascript
if (fable.EnvironmentData.platform === 'win32') {
    // Windows-specific code
} else if (fable.EnvironmentData.platform === 'darwin') {
    // macOS-specific code
} else {
    // Linux/other
}
```

### Resource Monitoring

```javascript
function checkMemory() {
    const total = fable.EnvironmentData.totalmem;
    const free = fable.EnvironmentData.freemem;
    const usedPercent = ((total - free) / total * 100).toFixed(2);

    fable.log.info('Memory usage', {
        total: `${(total / 1024 / 1024 / 1024).toFixed(2)} GB`,
        free: `${(free / 1024 / 1024 / 1024).toFixed(2)} GB`,
        used: `${usedPercent}%`
    });
}
```

### System Information Logging

```javascript
fable.log.info('System information', {
    platform: fable.EnvironmentData.platform,
    arch: fable.EnvironmentData.arch,
    hostname: fable.EnvironmentData.hostname,
    cpus: fable.EnvironmentData.cpus,
    memory: `${(fable.EnvironmentData.totalmem / 1024 / 1024 / 1024).toFixed(2)} GB`
});
```

### Feature Detection

```javascript
// Adjust behavior based on available resources
const workerCount = Math.min(
    fable.EnvironmentData.cpus || 1,
    8  // Cap at 8 workers
);

// Memory-based configuration
const cacheSize = fable.EnvironmentData.totalmem > 8 * 1024 * 1024 * 1024
    ? 'large'
    : 'small';
```

## Browser Compatibility

The browser version provides a safe subset of properties:

```javascript
// Works in both Node.js and browser
if (fable.EnvironmentData.platform) {
    console.log('Platform:', fable.EnvironmentData.platform);
}

// Node.js only - check before using
if (fable.EnvironmentData.cpus) {
    console.log('CPUs:', fable.EnvironmentData.cpus);
}
```

## Refresh Environment Data

The environment data is captured at instantiation. For dynamic values like free memory, you may want to refresh:

```javascript
// Re-instantiate to get fresh data
fable.instantiateServiceProvider('EnvironmentData', {}, 'EnvironmentData-Fresh');
const freshEnv = fable.servicesMap.EnvironmentData['EnvironmentData-Fresh'];
console.log('Current free memory:', freshEnv.freemem);
```
