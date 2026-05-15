# DataGeneration Service

The DataGeneration service provides utilities for generating random data, useful for testing, seeding databases, and creating sample data.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const dataGen = fable.instantiateServiceProvider('DataGeneration');
console.log('dataGen:', typeof dataGen);
```

## Random Integers

### Random Integer (Default Range)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomInteger());  // Random integer from 0 to default maximum
```

### Random Integer Up To

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomIntegerUpTo(100));  // Random integer from 0 (inclusive) to 100 (exclusive)
```

### Random Integer Between

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomIntegerBetween(10, 50));  // Random integer from 10 (inclusive) to 50 (exclusive)
```

## Random Floats

### Random Float (0 to 1)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomFloat());  // Random float between 0 and 1 (same as Math.random())
```

### Random Float Up To

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomFloatUpTo(7.65));  // Random float from 0 to 7.65
```

### Random Float Between

Uses arbitrary precision math under the hood:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomFloatBetween(4.3, 5.1));  // Random float between 4.3 and 5.1
console.log(dataGen.randomFloatBetween(0, 100));     // Random float between 0 and 100
```

## Random Strings

### Numeric String

Generate a zero-padded random numeric string:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomNumericString());         // e.g., '0382917456' (default length 10, max 9999999999)
console.log(dataGen.randomNumericString(6, 999999)); // e.g., '042871' (length 6, max 999999)
```

## Random Selections from Default Data Sets

The service includes built-in data sets for generating human-readable random values.

### Random Name (First Name)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomName());  // e.g., 'John'
```

### Random Surname

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomSurname());  // e.g., 'Smith'
```

### Random Month

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomMonth());  // e.g., 'January'
```

### Random Day of Week

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomDayOfWeek());  // e.g., 'Wednesday'
```

### Random Color

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataGenDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

console.log(dataGen.randomColor());  // e.g., 'Blue'
```

## Use Cases

### Test Data Generation

```javascript
const libFable = require('fable');

function generateTestUsers(count) {
    const fable = new libFable({ Product: 'TestUserGen', ProductVersion: '1.0.0' });
    const dataGen = fable.instantiateServiceProvider('DataGeneration');
    const users = [];

    for (let i = 0; i < count; i++) {
        users.push({
            id: fable.getUUID(),
            firstName: dataGen.randomName(),
            lastName: dataGen.randomSurname(),
            age: dataGen.randomIntegerBetween(18, 80)
        });
    }

    return users;
}

console.log(generateTestUsers(3));
```

### Database Seeding

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'SeedDemo', ProductVersion: '1.0.0' });
const dataGen = fable.instantiateServiceProvider('DataGeneration');

// Stub db so the playground demo runs without a real database.
const db = { products: { create: async (row) => { console.log('insert:', row); return row; } } };

for (let i = 0; i < 3; i++) {  // 3 rows for the demo (real code might do 50)
    await db.products.create({
        name: `Product ${dataGen.randomNumericString(6, 999999)}`,
        price: dataGen.randomFloatBetween(9.99, 999.99),
        stock: dataGen.randomIntegerBetween(0, 100)
    });
}
```

## Notes

- Random generation uses JavaScript's `Math.random()`; not cryptographically secure
- Names, colors, months, etc. are drawn from predefined lists in `Fable-Service-DataGeneration-DefaultValues.json`
- Float operations use the Math service for arbitrary precision
- For truly random UUIDs, use `fable.getUUID()` instead of random strings
