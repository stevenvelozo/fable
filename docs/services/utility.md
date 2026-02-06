# Utility Service

The Utility service provides general-purpose helper functions including object manipulation, array operations, templating, and async utilities.

## Access

```javascript
// Auto-instantiated, available directly
fable.Utility
```

## Object Extension

Shallow merge objects (similar to `Object.assign` or lodash `_.extend`):

```javascript
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

fable.Utility.extend(target, source1, source2);
// target is now { a: 1, b: 2, c: 3 }
```

## Template Compilation

Create underscore/lodash-style templates:

```javascript
// Create a template function
const template = fable.Utility.template('Hello, <%= name %>!');

// Use it
template({ name: 'World' });  // Returns 'Hello, World!'

// With execution code
const listTemplate = fable.Utility.template(`
    <ul>
    <% for (var i = 0; i < items.length; i++) { %>
        <li><%= items[i] %></li>
    <% } %>
    </ul>
`);

listTemplate({ items: ['Apple', 'Banana', 'Cherry'] });
```

### Immediate Rendering

Pass data as the second argument to render immediately instead of getting a function:

```javascript
fable.Utility.template('There are <%= Count %> things....', { Count: 1000 });
// Returns the string 'There are 1000 things....' directly (not a function)
```

### Hashed Templates

Register templates for reuse:

```javascript
// Build and register a template
fable.Utility.buildHashedTemplate('greeting', 'Hello, <%= name %>!');

// Access the compiled template
fable.Utility.templates.greeting({ name: 'World' });
```

## Array Operations

### Chunk Array

Split an array into chunks of specified size:

```javascript
fable.Utility.chunk([1, 2, 3, 4, 5, 6, 7], 3);
// Returns [[1, 2, 3], [4, 5, 6], [7]]

fable.Utility.chunk([1, 2, 3, 4], 2);
// Returns [[1, 2], [3, 4]]
```

### Slice Array

Extract a portion of an array:

```javascript
fable.Utility.slice([1, 2, 3, 4, 5], 1, 4);
// Returns [2, 3, 4]
```

### Concatenate Arrays

```javascript
fable.Utility.concatenateArrays([1, 2], [3, 4], [5, 6]);
// Returns [1, 2, 3, 4, 5, 6]
```

### Flatten Arrays

```javascript
fable.Utility.flattenArrayOfSolverInputs([[1, 2], [3, 4]]);
// Returns [1, 2, 3, 4]
```

## Object/Array Conversion

### Keys to Array

```javascript
fable.Utility.objectKeysToArray({ a: 1, b: 2, c: 3 });
// Returns ['a', 'b', 'c']
```

### Values to Array

```javascript
fable.Utility.objectValuesToArray({ a: 1, b: 2, c: 3 });
// Returns [1, 2, 3]
```

### Generate Objects from Sets

Takes pairs of `(propertyName, valuesObject)` and zips them into an array of objects. Values are extracted from each object using `objectValuesToArray`:

```javascript
fable.Utility.generateArrayOfObjectsFromSets(
    'x', { a: 1, b: 2, c: 3 },
    'y', { d: 4, e: 5, f: 6 }
);
// Returns [{ x: 1, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 6 }]
```

If value sets have different lengths, missing values are omitted from the result objects.

## Value Access by Hash/Address

Access nested object values using dot notation paths:

### Get Value

```javascript
const obj = { user: { profile: { name: 'John' } } };

fable.Utility.getValueByHash(obj, 'user.profile.name');
// Returns 'John'
```

### Set Value

```javascript
const obj = {};
fable.Utility.setValueByHash(obj, 'user.profile.name', 'John');
// obj is now { user: { profile: { name: 'John' } } }
```

### Get Internal Value

Access values from the Fable instance itself:

```javascript
fable.Utility.getInternalValueByHash('settings.Product');
```

### Check for Null or Empty

```javascript
fable.Utility.addressIsNullOrEmpty({ name: '' }, 'name');     // true
fable.Utility.addressIsNullOrEmpty({ name: 'John' }, 'name'); // false
fable.Utility.addressIsNullOrEmpty({}, 'name');               // true
```

## Array Value Collection

### Create Value Array from Hashes

```javascript
const obj = { a: 1, b: 2, c: 3 };
fable.Utility.createValueArrayByHashes(obj, ['a', 'c']);
// Returns [1, 3]
```

### Create Value Object from Hashes

```javascript
const obj = { a: 1, b: 2, c: 3, d: 4 };
fable.Utility.createValueObjectByHashes(obj, ['a', 'c']);
// Returns { a: 1, c: 3 }
```

## Search Operations

### Find by String Includes

```javascript
const items = [
    { name: 'Apple iPhone', price: 999 },
    { name: 'Samsung Galaxy', price: 899 },
    { name: 'Google Pixel', price: 799 }
];

fable.Utility.findFirstValueByStringIncludes(items, 'name', 'Samsung', 'price');
// Returns 899
```

### Find by Exact Match

```javascript
const items = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

fable.Utility.findFirstValueByExactMatch(items, 'name', 'Bob', 'id');
// Returns 2
```

### Find Index

```javascript
fable.Utility.findIndexInternal('5', [1, 3, 5, 7, 9], '0');  // Exact match, returns 2
fable.Utility.findIndexInternal('4', [1, 3, 5, 7, 9], '1');  // Ascending search, returns 2
```

## Sorting

### Sort by External Array

```javascript
const values = [100, 200, 300];
const objects = [
    { label: 'C' },
    { label: 'A' },
    { label: 'B' }
];

fable.Utility.objectValuesSortByExternalArray(values, objects, false, 'label');
// Sorts values based on object labels: [200, 300, 100] (A, B, C order)
```

## Date Parsing

Convert ISO strings to JavaScript Date objects:

```javascript
fable.Utility.isoStringToDate('2024-01-15T12:30:00.000Z');
// Returns JavaScript Date object
```

## Async Utilities

### Waterfall

Execute functions in sequence, passing results to the next:

```javascript
fable.Utility.waterfall([
    (callback) => {
        callback(null, 'one', 'two');
    },
    (arg1, arg2, callback) => {
        // arg1 = 'one', arg2 = 'two'
        callback(null, 'three');
    },
    (arg1, callback) => {
        // arg1 = 'three'
        callback(null, 'done');
    }
], (err, result) => {
    // result = 'done'
});
```

### Each Limit

Process array items in parallel with concurrency limit:

```javascript
fable.Utility.eachLimit(
    [1, 2, 3, 4, 5],        // Array to process
    2,                       // Concurrency limit
    (item, callback) => {    // Iterator
        processItem(item, callback);
    },
    (err) => {               // Completion callback
        console.log('All done');
    }
);
```

## BigNumber Access

Direct access to the big.js library for arbitrary precision:

```javascript
const bigNum = new fable.Utility.bigNumber('123456789012345678901234567890');
```

## Create Array from Values

```javascript
fable.Utility.createArrayFromAbsoluteValues(1, 2, 3, 4, 5);
// Returns [1, 2, 3, 4, 5]
```
