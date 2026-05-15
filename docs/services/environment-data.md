# EnvironmentData Service

The EnvironmentData service identifies the runtime environment (Node.js or browser).

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'EnvironmentDataDemo', ProductVersion: '1.0.0' });

// Auto-instantiated, available directly
console.log('fable.EnvironmentData:', fable.EnvironmentData);
```

## Available Properties

### Environment

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'EnvironmentDataDemo', ProductVersion: '1.0.0' });

console.log('Environment:', fable.EnvironmentData.Environment);
// Returns 'node.js' in Node.js
// Returns 'web' in the browser
```

## Browser vs Node.js

Fable automatically uses the appropriate implementation:

- **Node.js**: `Fable-Service-EnvironmentData.js` -- sets `Environment` to `'node.js'`
- **Browser**: `Fable-Service-EnvironmentData-Web.js` -- sets `Environment` to `'web'`

## Use Cases

### Environment-Specific Behavior

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'EnvironmentDataDemo', ProductVersion: '1.0.0' });

if (fable.EnvironmentData.Environment === 'node.js') {
    // Node.js-specific code (e.g., file system access)
    console.log('Running in Node.js — file system access available');
} else {
    // Browser-specific code (e.g., DOM manipulation)
    console.log('Running in browser — Environment is:', fable.EnvironmentData.Environment);
}
```

## Notes

- The service is minimal by design, providing a simple environment flag
- It is auto-instantiated as a default service when Fable is created
