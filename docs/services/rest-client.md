# RestClient Service

The RestClient service provides HTTP/REST client functionality with support for JSON APIs, cookie management, and request tracing.

## Access

```javascript
// On-demand service - must be instantiated
const restClient = fable.instantiateServiceProvider('RestClient');

// Or create named instances for different purposes
const apiClient = fable.instantiateServiceProvider('RestClient', {}, 'api');
const authClient = fable.instantiateServiceProvider('RestClient', { TraceLog: true }, 'auth');
```

## Configuration

### Options

```javascript
const restClient = fable.instantiateServiceProvider('RestClient', {
    TraceLog: true  // Enable request/response logging
});
```

### URL Prefix

Set a global URL prefix in Fable settings:

```javascript
const fable = new Fable({
    RestClientURLPrefix: 'https://api.example.com'
});

// All requests will be prefixed
restClient.getJSON('/users', callback);  // Requests https://api.example.com/users
```

## JSON Requests

### GET JSON

```javascript
// Simple URL
restClient.getJSON('https://api.example.com/users', (error, response, data) => {
    if (error) {
        console.error('Request failed:', error);
        return;
    }
    console.log('Status:', response.statusCode);
    console.log('Data:', data);  // Parsed JSON
});

// With options
restClient.getJSON({
    url: 'https://api.example.com/users',
    headers: {
        'Authorization': 'Bearer token123'
    }
}, (error, response, data) => {
    console.log(data);
});
```

### POST JSON

```javascript
restClient.postJSON({
    url: 'https://api.example.com/users',
    body: {
        name: 'John Doe',
        email: 'john@example.com'
    }
}, (error, response, data) => {
    console.log('Created user:', data);
});
```

### PUT JSON

```javascript
restClient.putJSON({
    url: 'https://api.example.com/users/123',
    body: {
        name: 'John Smith'
    }
}, (error, response, data) => {
    console.log('Updated user:', data);
});
```

### PATCH JSON

```javascript
restClient.patchJSON({
    url: 'https://api.example.com/users/123',
    body: {
        email: 'john.smith@example.com'
    }
}, (error, response, data) => {
    console.log('Patched user:', data);
});
```

### DELETE JSON

```javascript
restClient.delJSON({
    url: 'https://api.example.com/users/123'
}, (error, response, data) => {
    console.log('Deleted user');
});
```

### HEAD JSON

```javascript
restClient.headJSON({
    url: 'https://api.example.com/users/123',
    body: {}  // Required but not sent
}, (error, response, data) => {
    console.log('Headers:', response.headers);
});
```

## Raw Text Requests

### GET Raw Text

```javascript
restClient.getRawText('https://example.com/page.html', (error, response, text) => {
    console.log('HTML:', text);
});
```

## Chunked Requests

For streaming or large responses:

### Text Chunks

```javascript
restClient.executeChunkedRequest({
    method: 'GET',
    url: 'https://example.com/large-file.txt'
}, (error, response, data) => {
    console.log('Complete data:', data);
});
```

### Binary Chunks

```javascript
restClient.executeChunkedRequestBinary({
    method: 'GET',
    url: 'https://example.com/image.png'
}, (error, response, buffer) => {
    // buffer is a Node.js Buffer
    require('fs').writeFileSync('image.png', buffer);
});
```

## Cookie Management

### Set Cookies

```javascript
restClient.cookie = {
    'session_id': 'abc123',
    'user_token': 'xyz789'
};
```

### Automatic Cookie Handling

Cookies are automatically included in subsequent requests:

```javascript
restClient.cookie = { session: 'abc123' };

// This request will include the session cookie
restClient.getJSON('/protected-resource', callback);
```

## Request Options

All request methods accept an options object:

```javascript
{
    url: 'https://api.example.com/endpoint',
    method: 'GET',  // Usually set by the convenience method
    headers: {
        'Authorization': 'Bearer token',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: { /* request body for POST/PUT/PATCH */ },
    timeout: 30000  // Request timeout in milliseconds
}
```

## Custom Request Preparation

Override the `prepareRequestOptions` function to modify all outgoing requests:

```javascript
restClient.prepareRequestOptions = (options) => {
    // Add authentication to all requests
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] = 'Bearer ' + getAccessToken();
    return options;
};
```

## Trace Logging

Enable detailed request logging:

```javascript
const restClient = fable.instantiateServiceProvider('RestClient', {
    TraceLog: true
});

// Or enable globally
fable.TraceLog = true;

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
restClient.simpleGet({
    method: 'GET',
    url: 'https://example.com',
    // ... other simple-get options
}, callback);
```

## Error Handling

```javascript
restClient.getJSON('https://api.example.com/users', (error, response, data) => {
    if (error) {
        // Network error, timeout, etc.
        console.error('Network error:', error.message);
        return;
    }

    if (response.statusCode >= 400) {
        // HTTP error status
        console.error('HTTP error:', response.statusCode);
        console.error('Error body:', data);
        return;
    }

    // Success
    console.log('Data:', data);
});
```

## Multiple Instances

Create separate clients for different APIs:

```javascript
const mainApi = fable.instantiateServiceProvider('RestClient', {}, 'main-api');
const authApi = fable.instantiateServiceProvider('RestClient', {}, 'auth-api');

// Set different cookies for each
mainApi.cookie = { api_session: '...' };
authApi.cookie = { auth_session: '...' };

// Set different request preparation
authApi.prepareRequestOptions = (options) => {
    options.headers = options.headers || {};
    options.headers['X-Auth-Service'] = 'true';
    return options;
};
```
