# Utility Service

The Utility service provides general-purpose helper functions including object manipulation, array operations, templating, and async utilities.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

// Auto-instantiated, available directly
console.log('fable.Utility:', typeof fable.Utility);
```

## Object Extension

Shallow merge objects (similar to `Object.assign` or lodash `_.extend`):

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

fable.Utility.extend(target, source1, source2);
// target is now { a: 1, b: 2, c: 3 }
console.log('target:', target);
```

## Template Compilation

Create underscore/lodash-style templates:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

// Create a template function
const template = fable.Utility.template('Hello, <%= name %>!');

// Use it
console.log(template({ name: 'World' }));  // Returns 'Hello, World!'

// With execution code
const listTemplate = fable.Utility.template(`
    <ul>
    <% for (var i = 0; i < items.length; i++) { %>
        <li><%= items[i] %></li>
    <% } %>
    </ul>
`);

console.log(listTemplate({ items: ['Apple', 'Banana', 'Cherry'] }));
```

### Immediate Rendering

Pass data as the second argument to render immediately instead of getting a function:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.template('There are <%= Count %> things....', { Count: 1000 }));
// Returns the string 'There are 1000 things....' directly (not a function)
```

### Hashed Templates

Register templates for reuse:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

// Build and register a template
fable.Utility.buildHashedTemplate('greeting', 'Hello, <%= name %>!');

// Access the compiled template
console.log(fable.Utility.templates.greeting({ name: 'World' }));
```

## Array Operations

### Chunk Array

Split an array into chunks of specified size:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.chunk([1, 2, 3, 4, 5, 6, 7], 3));
// Returns [[1, 2, 3], [4, 5, 6], [7]]

console.log(fable.Utility.chunk([1, 2, 3, 4], 2));
// Returns [[1, 2], [3, 4]]
```

### Slice Array

Extract a portion of an array:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.slice([1, 2, 3, 4, 5], 1, 4));
// Returns [2, 3, 4]
```

### Concatenate Arrays

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.concatenateArrays([1, 2], [3, 4], [5, 6]));
// Returns [1, 2, 3, 4, 5, 6]
```

### Flatten Arrays

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.flattenArrayOfSolverInputs([[1, 2], [3, 4]]));
// Returns [1, 2, 3, 4]
```

## Object/Array Conversion

### Keys to Array

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.objectKeysToArray({ a: 1, b: 2, c: 3 }));
// Returns ['a', 'b', 'c']
```

### Values to Array

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.objectValuesToArray({ a: 1, b: 2, c: 3 }));
// Returns [1, 2, 3]
```

### Generate Objects from Sets

Takes pairs of `(propertyName, valuesObject)` and zips them into an array of objects. Values are extracted from each object using `objectValuesToArray`:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.generateArrayOfObjectsFromSets(
    'x', { a: 1, b: 2, c: 3 },
    'y', { d: 4, e: 5, f: 6 }
));
// Returns [{ x: 1, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 6 }]
```

If value sets have different lengths, missing values are omitted from the result objects.

## Value Access by Hash/Address

Access nested object values using dot notation paths:

### Get Value

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const obj = { user: { profile: { name: 'John' } } };

console.log(fable.Utility.getValueByHash(obj, 'user.profile.name'));
// Returns 'John'
```

### Set Value

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const obj = {};
fable.Utility.setValueByHash(obj, 'user.profile.name', 'John');
// obj is now { user: { profile: { name: 'John' } } }
console.log('obj:', obj);
```

### Get Internal Value

Access values from the Fable instance itself:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'InternalDemoProduct', ProductVersion: '1.0.0' });

console.log(fable.Utility.getInternalValueByHash('settings.Product'));
```

### Check for Null or Empty

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.addressIsNullOrEmpty({ name: '' }, 'name'));     // true
console.log(fable.Utility.addressIsNullOrEmpty({ name: 'John' }, 'name')); // false
console.log(fable.Utility.addressIsNullOrEmpty({}, 'name'));               // true
```

## Array Value Collection

### Create Value Array from Hashes

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const obj = { a: 1, b: 2, c: 3 };
console.log(fable.Utility.createValueArrayByHashes(obj, ['a', 'c']));
// Returns [1, 3]
```

### Create Value Object from Hashes

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const obj = { a: 1, b: 2, c: 3, d: 4 };
console.log(fable.Utility.createValueObjectByHashes(obj, ['a', 'c']));
// Returns { a: 1, c: 3 }
```

## Search Operations

### Find by String Includes

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const items = [
    { name: 'Apple iPhone', price: 999 },
    { name: 'Samsung Galaxy', price: 899 },
    { name: 'Google Pixel', price: 799 }
];

console.log(fable.Utility.findFirstValueByStringIncludes(items, 'name', 'Samsung', 'price'));
// Returns 899
```

### Find by Exact Match

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const items = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

console.log(fable.Utility.findFirstValueByExactMatch(items, 'name', 'Bob', 'id'));
// Returns 2
```

### Find Index

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.findIndexInternal('5', [1, 3, 5, 7, 9], '0'));  // Exact match, returns 2
console.log(fable.Utility.findIndexInternal('4', [1, 3, 5, 7, 9], '1'));  // Ascending search, returns 2
```

## Sorting

### Sort by External Array

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const values = [100, 200, 300];
const objects = [
    { label: 'C' },
    { label: 'A' },
    { label: 'B' }
];

console.log(fable.Utility.objectValuesSortByExternalArray(values, objects, false, 'label'));
// Sorts values based on object labels: [200, 300, 100] (A, B, C order)
```

## Date Parsing

Convert ISO strings to JavaScript Date objects:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.isoStringToDate('2024-01-15T12:30:00.000Z'));
// Returns JavaScript Date object
```

## Async Utilities

### Waterfall

Execute functions in sequence, passing results to the next:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

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
    console.log('waterfall finished — err:', err, 'result:', result);
});
```

### Each Limit

Process array items in parallel with concurrency limit:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

// Stub for the playground demo — real code would do real work per item
function processItem(item, callback) {
    console.log('processing item', item);
    callback(null);
}

fable.Utility.eachLimit(
    [1, 2, 3, 4, 5],        // Array to process
    2,                       // Concurrency limit
    (item, callback) => {    // Iterator
        processItem(item, callback);
    },
    (err) => {               // Completion callback
        console.log('All done — err:', err);
    }
);
```

## BigNumber Access

Direct access to the big.js library for arbitrary precision:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

const bigNum = new fable.Utility.bigNumber('123456789012345678901234567890');
console.log('bigNum:', bigNum.toString());
console.log('bigNum * 2:', bigNum.times(2).toString());
```

## Create Array from Values

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UtilityDemo', ProductVersion: '1.0.0' });

console.log(fable.Utility.createArrayFromAbsoluteValues(1, 2, 3, 4, 5));
// Returns [1, 2, 3, 4, 5]
```
