# ExpressionParser Service

The ExpressionParser service provides mathematical expression parsing and evaluation with arbitrary precision support using postfix notation.

## Access

```javascript
// On-demand service - instantiate when needed
const parser = fable.instantiateServiceProvider('ExpressionParser');
```

## Basic Usage

### Parse and Evaluate

```javascript
const parser = fable.instantiateServiceProvider('ExpressionParser');

// Simple arithmetic
parser.evaluate('2 + 3');        // Returns '5'
parser.evaluate('10 * 5');       // Returns '50'
parser.evaluate('100 / 4');      // Returns '25'
parser.evaluate('2 ^ 10');       // Returns '1024'
```

### Order of Operations

```javascript
parser.evaluate('2 + 3 * 4');      // Returns '14' (not '20')
parser.evaluate('(2 + 3) * 4');    // Returns '20'
parser.evaluate('10 - 2 * 3');     // Returns '4'
parser.evaluate('(10 - 2) * 3');   // Returns '24'
```

## Operators

### Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `5 + 3` → `8` |
| `-` | Subtraction | `5 - 3` → `2` |
| `*` | Multiplication | `5 * 3` → `15` |
| `/` | Division | `15 / 3` → `5` |
| `^` | Power | `2 ^ 3` → `8` |
| `%` | Modulo | `10 % 3` → `1` |

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `>` | Greater than | `5 > 3` → `true` |
| `<` | Less than | `5 < 3` → `false` |
| `>=` | Greater than or equal | `5 >= 5` → `true` |
| `<=` | Less than or equal | `5 <= 3` → `false` |
| `==` | Equal | `5 == 5` → `true` |

## Variables

### Using Variables

```javascript
parser.evaluate('x + y', { x: 10, y: 5 });  // Returns '15'
parser.evaluate('price * quantity', { price: 29.99, quantity: 3 });
```

### Nested Variables

```javascript
parser.evaluate('user.age + 10', {
    user: { age: 25 }
});  // Returns '35'
```

## Functions

### Built-in Functions

```javascript
parser.evaluate('sqrt(16)');      // Returns '4'
parser.evaluate('abs(-5)');       // Returns '5'
parser.evaluate('round(3.7)');    // Returns '4'
parser.evaluate('floor(3.7)');    // Returns '3'
parser.evaluate('ceil(3.2)');     // Returns '4'
```

### Math Functions

```javascript
parser.evaluate('sin(0)');        // Sine
parser.evaluate('cos(0)');        // Cosine
parser.evaluate('tan(0)');        // Tangent
parser.evaluate('log(100, 10)');  // Logarithm
```

### Aggregate Functions

```javascript
parser.evaluate('sum(1, 2, 3, 4, 5)');     // Returns '15'
parser.evaluate('avg(10, 20, 30)');        // Returns '20'
parser.evaluate('min(5, 2, 8, 1)');        // Returns '1'
parser.evaluate('max(5, 2, 8, 1)');        // Returns '8'
```

## Complex Expressions

```javascript
// Financial calculation
parser.evaluate(
    '(principal * rate * time) / 100',
    { principal: 1000, rate: 5, time: 2 }
);  // Simple interest

// Percentage calculation
parser.evaluate(
    '(score / total) * 100',
    { score: 85, total: 100 }
);  // Returns '85'

// Compound expression
parser.evaluate(
    'sqrt(x^2 + y^2)',
    { x: 3, y: 4 }
);  // Returns '5' (Pythagorean theorem)
```

## Use Cases

### Spreadsheet-like Calculations

```javascript
function calculateCell(formula, cells) {
    const parser = fable.instantiateServiceProvider('ExpressionParser');
    return parser.evaluate(formula, cells);
}

const cells = {
    A1: 100,
    A2: 200,
    A3: 300
};

calculateCell('A1 + A2 + A3', cells);  // Returns '600'
calculateCell('avg(A1, A2, A3)', cells);  // Returns '200'
```

### Rule Engine

```javascript
function evaluateRule(rule, data) {
    const parser = fable.instantiateServiceProvider('ExpressionParser');
    const result = parser.evaluate(rule, data);
    return result === 'true' || result === '1';
}

const rules = [
    { name: 'Senior Discount', condition: 'age >= 65' },
    { name: 'Bulk Discount', condition: 'quantity >= 10' },
    { name: 'VIP', condition: 'totalPurchases > 1000' }
];

const customer = { age: 70, quantity: 5, totalPurchases: 1500 };

rules.forEach(rule => {
    if (evaluateRule(rule.condition, customer)) {
        console.log(`Apply: ${rule.name}`);
    }
});
```

### Dynamic Pricing

```javascript
function calculatePrice(formula, context) {
    const parser = fable.instantiateServiceProvider('ExpressionParser');
    return parser.evaluate(formula, context);
}

const pricing = {
    formula: 'basePrice * (1 - discount/100) * quantity',
    basePrice: 50,
    discount: 10,
    quantity: 5
};

const total = calculatePrice(pricing.formula, pricing);
// Returns '225' (50 * 0.9 * 5)
```

### Form Validation

```javascript
function validateField(validation, value) {
    const parser = fable.instantiateServiceProvider('ExpressionParser');
    return parser.evaluate(validation, { value }) === 'true';
}

// Check if age is between 18 and 120
validateField('value >= 18 && value <= 120', 25);  // true
validateField('value >= 18 && value <= 120', 15);  // false
```

## Arbitrary Precision

The ExpressionParser uses the Math service for arbitrary precision:

```javascript
// Large number calculations
parser.evaluate('99999999999999999999 + 1');

// Precise decimal operations
parser.evaluate('0.1 + 0.2');  // Returns '0.3' (not 0.30000000000000004)
```

## Error Handling

```javascript
try {
    const result = parser.evaluate('invalid expression');
} catch (error) {
    fable.log.error('Expression error', { error: error.message });
}
```

## Notes

- Uses postfix (Reverse Polish) notation internally for evaluation
- Supports arbitrary precision arithmetic via fable.Math
- Variables are accessed using the Manifest service's path notation
- Comparison operators return `'true'` or `'false'` as strings
