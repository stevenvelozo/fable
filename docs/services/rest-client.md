# RestClient Service

The RestClient service provides HTTP/REST client functionality with support for JSON APIs, cookie management, and request tracing.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });

// On-demand service - must be instantiated
const restClient = fable.instantiateServiceProvider('RestClient');
console.log('restClient:', typeof restClient);

// Or create named instances for different purposes
const apiClient  = fable.instantiateServiceProvider('RestClient', {}, 'api');
const authClient = fable.instantiateServiceProvider('RestClient', { TraceLog: true }, 'auth');
console.log('Named instances ready:', typeof apiClient, typeof authClient);
```

## Configuration

### Options

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });

const restClient = fable.instantiateServiceProvider('RestClient', {
    TraceLog: true  // Enable request/response logging
});
console.log('TraceLog enabled:', restClient.options.TraceLog);
```

### URL Prefix

Set a global URL prefix in Fable settings:

```javascript
const libFable = require('fable');
const fable = new libFable({
    RestClientURLPrefix: 'https://api.example.com'
});
console.log('URL prefix:', fable.settings.RestClientURLPrefix);

// In Node.js (network calls are skipped in the browser playground):
// restClient.getJSON('/users', callback);  // -> Requests https://api.example.com/users
console.info("    restClient.getJSON('/users', callback);  // -> https://api.example.com/users");
```

## JSON Requests

### GET JSON

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground (CORS).
console.info("In Node.js:");
console.info("    // Simple URL");
console.info("    restClient.getJSON('https://api.example.com/users', (error, response, data) => {");
console.info("        if (error) { console.error('Request failed:', error); return; }");
console.info("        console.log('Status:', response.statusCode);");
console.info("        console.log('Data:', data);  // Parsed JSON");
console.info("    });");
console.info("    // With options");
console.info("    restClient.getJSON({");
console.info("        url: 'https://api.example.com/users',");
console.info("        headers: { Authorization: 'Bearer token123' }");
console.info("    }, (error, response, data) => { console.log(data); });");
```

### POST JSON

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.postJSON({");
console.info("        url: 'https://api.example.com/users',");
console.info("        body: { name: 'John Doe', email: 'john@example.com' }");
console.info("    }, (error, response, data) => { console.log('Created user:', data); });");
```

### PUT JSON

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.putJSON({");
console.info("        url: 'https://api.example.com/users/123',");
console.info("        body: { name: 'John Smith' }");
console.info("    }, (error, response, data) => { console.log('Updated user:', data); });");
```

### PATCH JSON

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.patchJSON({");
console.info("        url: 'https://api.example.com/users/123',");
console.info("        body: { email: 'john.smith@example.com' }");
console.info("    }, (error, response, data) => { console.log('Patched user:', data); });");
```

### DELETE JSON

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.delJSON({");
console.info("        url: 'https://api.example.com/users/123'");
console.info("    }, (error, response, data) => { console.log('Deleted user'); });");
```

### HEAD JSON

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.headJSON({");
console.info("        url: 'https://api.example.com/users/123',");
console.info("        body: {}  // Required but not sent");
console.info("    }, (error, response, data) => { console.log('Headers:', response.headers); });");
```

## Raw Text Requests

### GET Raw Text

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.getRawText('https://example.com/page.html', (error, response, text) => {");
console.info("        console.log('HTML:', text);");
console.info("    });");
```

## Chunked Requests

For streaming or large responses:

### Text Chunks

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.executeChunkedRequest({");
console.info("        method: 'GET',");
console.info("        url: 'https://example.com/large-file.txt'");
console.info("    }, (error, response, data) => { console.log('Complete data:', data); });");
```

### Binary Chunks

```javascript
// Node.js reference - real HTTP + fs don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.executeChunkedRequestBinary({");
console.info("        method: 'GET',");
console.info("        url: 'https://example.com/image.png'");
console.info("    }, (error, response, buffer) => {");
console.info("        // buffer is a Node.js Buffer");
console.info("        require('fs').writeFileSync('image.png', buffer);");
console.info("    });");
```

## Cookie Management

### Set Cookies

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });
const restClient = fable.instantiateServiceProvider('RestClient');

restClient.cookie = {
    'session_id': 'abc123',
    'user_token': 'xyz789'
};
console.log('Cookies set:', restClient.cookie);
```

### Automatic Cookie Handling

Cookies are automatically included in subsequent requests:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });
const restClient = fable.instantiateServiceProvider('RestClient');

restClient.cookie = { session: 'abc123' };
console.log('Cookie set:', restClient.cookie);

// In Node.js (browser playground skips real network):
// restClient.getJSON('/protected-resource', callback);
console.info("    // restClient.getJSON('/protected-resource', callback);  // sends session cookie");
```

## Request Options

All request methods accept an options object:

```javascript
const requestOptionsShape = {
    url: 'https://api.example.com/endpoint',
    method: 'GET',  // Usually set by the convenience method
    headers: {
        'Authorization': 'Bearer token',
        'Content-Type':  'application/json',
        'Accept':        'application/json'
    },
    body: { /* request body for POST/PUT/PATCH */ },
    timeout: 30000  // Request timeout in milliseconds
};
console.log('requestOptionsShape:', requestOptionsShape);
```

## Custom Request Preparation

Override the `prepareRequestOptions` function to modify all outgoing requests:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });
const restClient = fable.instantiateServiceProvider('RestClient');

function getAccessToken() { return 'demo-token-abc123'; }

restClient.prepareRequestOptions = (options) => {
    // Add authentication to all requests
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] = 'Bearer ' + getAccessToken();
    return options;
};

const sample = restClient.prepareRequestOptions({ url: '/users' });
console.log('Prepared options:', sample);
```

## Trace Logging

Enable detailed request logging:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });

const restClient = fable.instantiateServiceProvider('RestClient', {
    TraceLog: true
});

// Or enable globally
fable.TraceLog = true;
console.log('Per-instance TraceLog:', restClient.options.TraceLog);
console.log('Global fable.TraceLog:', fable.TraceLog);

// Logs include:
// - Request start time
// - Connection time
// - Chunk reception times
// - Total transfer time and size
```

Example trace output:

```
Beginning GET request to https://api.example.com/users at 1704067200000
--> GET connected in 00:00:00.150ms code 200
--> GET data chunk size 1024b received in 00:00:00.200ms
==> GET completed data size 4096b received in 00:00:00.250ms
```

## Direct simpleGet Access

Access the underlying `simple-get` library directly:

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.simpleGet({");
console.info("        method: 'GET',");
console.info("        url: 'https://example.com',");
console.info("        // ... other simple-get options");
console.info("    }, callback);");
```

## Error Handling

```javascript
// Node.js reference - real HTTP requests don't run in the browser playground.
console.info("In Node.js:");
console.info("    restClient.getJSON('https://api.example.com/users', (error, response, data) => {");
console.info("        if (error) { console.error('Network error:', error.message); return; }");
console.info("        if (response.statusCode >= 400) {");
console.info("            console.error('HTTP error:', response.statusCode);");
console.info("            console.error('Error body:', data);");
console.info("            return;");
console.info("        }");
console.info("        console.log('Data:', data);");
console.info("    });");
```

## Multiple Instances

Create separate clients for different APIs:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'RestClientDemo', ProductVersion: '1.0.0' });

const mainApi = fable.instantiateServiceProvider('RestClient', {}, 'main-api');
const authApi = fable.instantiateServiceProvider('RestClient', {}, 'auth-api');

// Set different cookies for each
mainApi.cookie = { api_session:  '...' };
authApi.cookie = { auth_session: '...' };

// Set different request preparation
authApi.prepareRequestOptions = (options) => {
    options.headers = options.headers || {};
    options.headers['X-Auth-Service'] = 'true';
    return options;
};

console.log('mainApi cookie keys:', Object.keys(mainApi.cookie));
console.log('authApi cookie keys:', Object.keys(authApi.cookie));
console.log('authApi prepared headers:', authApi.prepareRequestOptions({}).headers);
```
