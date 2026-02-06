# EnvironmentData Service

The EnvironmentData service identifies the runtime environment (Node.js or browser).

## Access

```javascript
// Auto-instantiated, available directly
fable.EnvironmentData
```

## Available Properties

### Environment

```javascript
fable.EnvironmentData.Environment
// Returns 'node.js' in Node.js
// Returns 'web' in the browser
```

## Browser vs Node.js

Fable automatically uses the appropriate implementation:

- **Node.js**: `Fable-Service-EnvironmentData.js` — sets `Environment` to `'node.js'`
- **Browser**: `Fable-Service-EnvironmentData-Web.js` — sets `Environment` to `'web'`

## Use Cases

### Environment-Specific Behavior

```javascript
if (fable.EnvironmentData.Environment === 'node.js') {
    // Node.js-specific code (e.g., file system access)
} else {
    // Browser-specific code (e.g., DOM manipulation)
}
```

## Notes

- The service is minimal by design, providing a simple environment flag
- It is auto-instantiated as a default service when Fable is created
