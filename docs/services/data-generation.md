# DataGeneration Service

The DataGeneration service provides utilities for generating random data, useful for testing, seeding databases, and creating sample data.

## Access

```javascript
// On-demand service - instantiate when needed
const dataGen = fable.instantiateServiceProvider('DataGeneration');
```

## Random Integers

### Random Integer (Default Range)

```javascript
dataGen.randomInteger();  // Random integer from 0 to default maximum
```

### Random Integer Up To

```javascript
dataGen.randomIntegerUpTo(100);  // Random integer from 0 (inclusive) to 100 (exclusive)
```

### Random Integer Between

```javascript
dataGen.randomIntegerBetween(10, 50);  // Random integer from 10 (inclusive) to 50 (exclusive)
```

## Random Floats

### Random Float (0 to 1)

```javascript
dataGen.randomFloat();  // Random float between 0 and 1 (same as Math.random())
```

### Random Float Up To

```javascript
dataGen.randomFloatUpTo(7.65);  // Random float from 0 to 7.65
```

### Random Float Between

Uses arbitrary precision math under the hood:

```javascript
dataGen.randomFloatBetween(4.3, 5.1);  // Random float between 4.3 and 5.1
dataGen.randomFloatBetween(0, 100);     // Random float between 0 and 100
```

## Random Strings

### Numeric String

Generate a zero-padded random numeric string:

```javascript
dataGen.randomNumericString();         // e.g., '0382917456' (default length 10, max 9999999999)
dataGen.randomNumericString(6, 999999); // e.g., '042871' (length 6, max 999999)
```

## Random Selections from Default Data Sets

The service includes built-in data sets for generating human-readable random values.

### Random Name (First Name)

```javascript
dataGen.randomName();  // e.g., 'John'
```

### Random Surname

```javascript
dataGen.randomSurname();  // e.g., 'Smith'
```

### Random Month

```javascript
dataGen.randomMonth();  // e.g., 'January'
```

### Random Day of Week

```javascript
dataGen.randomDayOfWeek();  // e.g., 'Wednesday'
```

### Random Color

```javascript
dataGen.randomColor();  // e.g., 'Blue'
```

## Use Cases

### Test Data Generation

```javascript
function generateTestUsers(count) {
    const fable = new Fable();
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
```

### Database Seeding

```javascript
const dataGen = fable.instantiateServiceProvider('DataGeneration');

for (let i = 0; i < 50; i++) {
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
