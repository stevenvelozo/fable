# DataGeneration Service

The DataGeneration service provides utilities for generating synthetic and random data, useful for testing, seeding databases, and creating sample data.

## Access

```javascript
// Auto-instantiated, available directly
fable.DataGeneration
```

## Random Data Generation

### Random Numbers

```javascript
// Random integer between min and max (inclusive)
fable.DataGeneration.randomInt(1, 100);

// Random float
fable.DataGeneration.randomFloat(0, 1);
```

### Random Strings

```javascript
// Random alphanumeric string
fable.DataGeneration.randomString(10);  // e.g., 'a1b2c3d4e5'

// Random alphabetic string
fable.DataGeneration.randomAlphaString(8);  // e.g., 'AbCdEfGh'
```

### Random Selection

```javascript
// Random element from array
const colors = ['red', 'green', 'blue'];
fable.DataGeneration.randomElement(colors);  // e.g., 'green'
```

## Structured Data Generation

### Random Names

```javascript
fable.DataGeneration.randomFirstName();   // e.g., 'John'
fable.DataGeneration.randomLastName();    // e.g., 'Smith'
fable.DataGeneration.randomFullName();    // e.g., 'John Smith'
```

### Random Addresses

```javascript
fable.DataGeneration.randomStreetAddress();  // e.g., '123 Main St'
fable.DataGeneration.randomCity();           // e.g., 'Springfield'
fable.DataGeneration.randomState();          // e.g., 'CA'
fable.DataGeneration.randomZipCode();        // e.g., '90210'
```

### Random Contact Info

```javascript
fable.DataGeneration.randomEmail();        // e.g., 'john.doe@example.com'
fable.DataGeneration.randomPhoneNumber();  // e.g., '555-123-4567'
```

## Date Generation

```javascript
// Random date within range
fable.DataGeneration.randomDate(
    new Date('2020-01-01'),
    new Date('2024-12-31')
);

// Random date in the past
fable.DataGeneration.randomPastDate(365);  // Within last 365 days

// Random date in the future
fable.DataGeneration.randomFutureDate(30); // Within next 30 days
```

## Use Cases

### Test Data Generation

```javascript
function generateTestUsers(count) {
    const users = [];

    for (let i = 0; i < count; i++) {
        users.push({
            id: fable.getUUID(),
            firstName: fable.DataGeneration.randomFirstName(),
            lastName: fable.DataGeneration.randomLastName(),
            email: fable.DataGeneration.randomEmail(),
            age: fable.DataGeneration.randomInt(18, 80),
            createdAt: fable.DataGeneration.randomPastDate(365)
        });
    }

    return users;
}

// Generate 100 test users
const testUsers = generateTestUsers(100);
```

### Database Seeding

```javascript
async function seedDatabase() {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

    for (let i = 0; i < 50; i++) {
        await db.products.create({
            name: `Product ${fable.DataGeneration.randomString(6)}`,
            price: fable.DataGeneration.randomFloat(9.99, 999.99).toFixed(2),
            category: fable.DataGeneration.randomElement(categories),
            stock: fable.DataGeneration.randomInt(0, 100),
            description: fable.DataGeneration.randomString(200)
        });
    }
}
```

### Mock API Responses

```javascript
function mockUserEndpoint() {
    return {
        id: fable.getUUID(),
        name: fable.DataGeneration.randomFullName(),
        email: fable.DataGeneration.randomEmail(),
        phone: fable.DataGeneration.randomPhoneNumber(),
        address: {
            street: fable.DataGeneration.randomStreetAddress(),
            city: fable.DataGeneration.randomCity(),
            state: fable.DataGeneration.randomState(),
            zip: fable.DataGeneration.randomZipCode()
        },
        registeredAt: fable.DataGeneration.randomPastDate(730).toISOString()
    };
}
```

### Load Testing Data

```javascript
function generateLoadTestPayload() {
    return {
        transactions: Array.from({ length: 1000 }, () => ({
            id: fable.getUUID(),
            amount: fable.DataGeneration.randomFloat(1, 10000).toFixed(2),
            timestamp: fable.DataGeneration.randomPastDate(30).toISOString(),
            status: fable.DataGeneration.randomElement(['pending', 'completed', 'failed']),
            customerId: fable.DataGeneration.randomString(8)
        }))
    };
}
```

### Unit Test Fixtures

```javascript
function createTestOrder() {
    const itemCount = fable.DataGeneration.randomInt(1, 5);
    const items = [];

    for (let i = 0; i < itemCount; i++) {
        items.push({
            productId: fable.getUUID(),
            quantity: fable.DataGeneration.randomInt(1, 10),
            price: parseFloat(fable.DataGeneration.randomFloat(5, 100).toFixed(2))
        });
    }

    return {
        orderId: fable.getUUID(),
        customerId: fable.getUUID(),
        items,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date()
    };
}
```

## Integration with Other Services

### With Math Service

```javascript
// Generate random data with precise calculations
const price = fable.DataGeneration.randomFloat(10, 100);
const tax = fable.Math.multiplyPrecise(price.toString(), '0.08');
const total = fable.Math.addPrecise(price.toString(), tax);
```

### With DataFormat Service

```javascript
// Format generated data
const amount = fable.DataGeneration.randomFloat(100, 10000);
const formatted = fable.DataFormat.formatterDollars(amount);
```

## Notes

- Random generation uses JavaScript's `Math.random()`; not cryptographically secure
- Names, cities, etc. are drawn from predefined lists
- For truly random UUIDs, use `fable.getUUID()` instead of random strings
