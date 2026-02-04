# Manifest Service

The Manifest service (powered by [manyfest](https://github.com/stevenvelozo/manyfest)) provides object navigation and manipulation using hash/address paths, supporting complex data access patterns.

## Access

```javascript
// On-demand service - instantiate when needed
const manifest = fable.instantiateServiceProvider('Manifest');

// Or use the factory method (creates unregistered instance)
const manifest = fable.newManyfest();

// With definition
const manifest = fable.newManyfest({
    Scope: 'User',
    Descriptors: {
        'Name': { Hash: 'name', Type: 'String' },
        'Email': { Hash: 'email', Type: 'String' }
    }
});
```

## Core Concepts

### Hash/Address Notation

Navigate objects using dot-notation paths:

```javascript
const obj = {
    user: {
        profile: {
            name: 'John',
            contacts: [
                { type: 'email', value: 'john@example.com' }
            ]
        }
    }
};

manifest.getValueByHash(obj, 'user.profile.name');           // 'John'
manifest.getValueByHash(obj, 'user.profile.contacts[0].value'); // 'john@example.com'
```

## Getting Values

### getValueByHash

```javascript
const data = { a: { b: { c: 'value' } } };

manifest.getValueByHash(data, 'a.b.c');     // 'value'
manifest.getValueByHash(data, 'a.b');       // { c: 'value' }
manifest.getValueByHash(data, 'x.y.z');     // undefined
```

### With Default Value

```javascript
manifest.getValueByHash(data, 'missing.path', 'default');  // 'default'
```

### Array Access

```javascript
const data = { items: ['a', 'b', 'c'] };

manifest.getValueByHash(data, 'items[0]');  // 'a'
manifest.getValueByHash(data, 'items[2]');  // 'c'
```

## Setting Values

### setValueByHash

```javascript
const data = {};

manifest.setValueByHash(data, 'user.name', 'John');
// data is now { user: { name: 'John' } }

manifest.setValueByHash(data, 'user.age', 30);
// data is now { user: { name: 'John', age: 30 } }
```

### Creating Nested Structures

```javascript
const data = {};
manifest.setValueByHash(data, 'deep.nested.path.value', 'hello');
// Creates: { deep: { nested: { path: { value: 'hello' } } } }
```

### Array Setting

```javascript
const data = { items: [] };
manifest.setValueByHash(data, 'items[0]', 'first');
manifest.setValueByHash(data, 'items[1]', 'second');
// data.items is ['first', 'second']
```

## Checking Existence

### checkAddressExists

```javascript
const data = { a: { b: 'value' } };

manifest.checkAddressExists(data, 'a.b');      // true
manifest.checkAddressExists(data, 'a.c');      // false
manifest.checkAddressExists(data, 'x.y.z');    // false
```

## Manifest Definitions

Define schemas for structured data:

```javascript
const userManifest = fable.newManyfest({
    Scope: 'User',
    Descriptors: {
        'Full Name': {
            Hash: 'profile.fullName',
            Type: 'String',
            Default: 'Unknown'
        },
        'Age': {
            Hash: 'profile.age',
            Type: 'Number',
            Default: 0
        },
        'Email': {
            Hash: 'contact.email',
            Type: 'String'
        },
        'Active': {
            Hash: 'status.isActive',
            Type: 'Boolean',
            Default: true
        }
    }
});
```

### Using Descriptors

```javascript
// Get all descriptor names
const names = userManifest.getDescriptorNames();
// ['Full Name', 'Age', 'Email', 'Active']

// Get descriptor by name
const emailDescriptor = userManifest.getDescriptor('Email');
// { Hash: 'contact.email', Type: 'String' }
```

## Boxed Properties

Access properties with special characters using brackets:

```javascript
const data = {
    'my-special-key': 'value1',
    'another key': 'value2'
};

manifest.getValueByHash(data, '["my-special-key"]');   // 'value1'
manifest.getValueByHash(data, "['another key']");     // 'value2'
```

## Use Cases

### Dynamic Form Handling

```javascript
function updateFormData(formData, fieldPath, value) {
    const manifest = fable.newManyfest();
    manifest.setValueByHash(formData, fieldPath, value);
    return formData;
}

// Usage
let form = {};
form = updateFormData(form, 'user.firstName', 'John');
form = updateFormData(form, 'user.lastName', 'Doe');
form = updateFormData(form, 'user.address.city', 'New York');
```

### Configuration Access

```javascript
function getConfig(path, defaultValue) {
    const manifest = fable.newManyfest();
    return manifest.getValueByHash(fable.settings, path, defaultValue);
}

// Usage
const timeout = getConfig('API.timeout', 30000);
const debug = getConfig('Logging.debug', false);
```

### Data Transformation

```javascript
function transformData(source, mappings) {
    const manifest = fable.newManyfest();
    const result = {};

    Object.entries(mappings).forEach(([targetPath, sourcePath]) => {
        const value = manifest.getValueByHash(source, sourcePath);
        if (value !== undefined) {
            manifest.setValueByHash(result, targetPath, value);
        }
    });

    return result;
}

// Usage
const transformed = transformData(apiResponse, {
    'userName': 'data.user.name',
    'userEmail': 'data.user.contact.email',
    'createdAt': 'metadata.created'
});
```

### Safe Property Access

```javascript
function safeGet(obj, path, defaultValue = null) {
    const manifest = fable.newManyfest();
    const value = manifest.getValueByHash(obj, path);
    return value !== undefined ? value : defaultValue;
}

// Safely access deeply nested properties
const city = safeGet(user, 'address.city', 'Unknown');
const phone = safeGet(user, 'contacts[0].phone', 'N/A');
```

## Integration with Other Services

The Manifest service is used internally by:
- `Utility.getValueByHash()`
- `Utility.setValueByHash()`
- Math service for object set operations
- Expression parser for variable resolution

## Notes

- Paths are case-sensitive
- Non-existent intermediate objects are created automatically when setting
- Array indices use bracket notation: `items[0]`
- Special characters in keys require bracket notation with quotes
