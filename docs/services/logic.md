# Logic Service

The Logic service provides comparison and conditional operations, supporting both string and numeric comparisons with arbitrary precision for numeric values.

## Access

```javascript
// Auto-instantiated, available directly
fable.Logic
```

## Conditional Check (checkIf)

Perform comparisons and return different values based on the result:

```javascript
fable.Logic.checkIf(left, operator, right, onTrue, onFalse);
```

### Parameters

- `left` - Left value to compare
- `operator` - Comparison operator (string)
- `right` - Right value to compare
- `onTrue` - Value to return if comparison is true
- `onFalse` - Value to return if comparison is false (optional, defaults to `''` for strings, `'0'` for numbers)

### Comparison Operators

| Operator | Aliases | Description |
|----------|---------|-------------|
| `<` | `LT` | Less than |
| `<=` | `LTE` | Less than or equal |
| `>` | `GT` | Greater than |
| `>=` | `GTE` | Greater than or equal |
| `==` | | Loose equality |
| `===` | | Strict equality |

### Examples

#### Numeric Comparisons

When both values can be parsed as numbers, arbitrary precision comparison is used:

```javascript
fable.Logic.checkIf(10, '>', 5, 'greater', 'not greater');
// Returns 'greater'

fable.Logic.checkIf('3.14159', '==', '3.14159', 'equal', 'not equal');
// Returns 'equal' (with small tolerance for ==)

fable.Logic.checkIf('100', 'LTE', '50', 'yes', 'no');
// Returns 'no'
```

#### String Comparisons

When either value is not a number, standard string comparison is used:

```javascript
fable.Logic.checkIf('apple', '<', 'banana', 'first', 'second');
// Returns 'first' (alphabetical order)

fable.Logic.checkIf('Hello', '===', 'Hello', 'match', 'no match');
// Returns 'match'

fable.Logic.checkIf('hello', '===', 'Hello', 'match', 'no match');
// Returns 'no match' (case sensitive)
```

#### Default False Values

```javascript
// String comparison defaults to empty string
fable.Logic.checkIf('a', '>', 'b', 'yes');
// Returns '' (empty string) when false

// Numeric comparison defaults to '0'
fable.Logic.checkIf(5, '>', 10, 'yes');
// Returns '0' when false
```

## Truthy Check (when)

Return different values based on whether a value is truthy:

```javascript
fable.Logic.when(checkValue, onTrue, onFalse);
```

### Parameters

- `checkValue` - Value to check for truthiness
- `onTrue` - Value to return if truthy
- `onFalse` - Value to return if falsy (optional, defaults to `''`)

### Truthiness Rules

The `when` method considers the following as falsy:
- `false`, `null`, `undefined`, `0`, `''`
- Empty arrays (`[]`)
- Empty objects (`{}`)

### Examples

```javascript
// Basic truthy check
fable.Logic.when(true, 'yes', 'no');      // Returns 'yes'
fable.Logic.when(false, 'yes', 'no');     // Returns 'no'
fable.Logic.when('hello', 'yes', 'no');   // Returns 'yes'
fable.Logic.when('', 'yes', 'no');        // Returns 'no'

// With numbers
fable.Logic.when(42, 'has value', 'empty');     // Returns 'has value'
fable.Logic.when(0, 'has value', 'empty');      // Returns 'empty'

// With arrays
fable.Logic.when([1, 2, 3], 'has items', 'empty');  // Returns 'has items'
fable.Logic.when([], 'has items', 'empty');         // Returns 'empty'

// With objects
fable.Logic.when({ a: 1 }, 'has props', 'empty');   // Returns 'has props'
fable.Logic.when({}, 'has props', 'empty');         // Returns 'empty'
```

## Use Cases

### Form Validation

```javascript
const age = formData.age;
const message = fable.Logic.checkIf(age, '>=', 18, 'Welcome!', 'Must be 18 or older');
```

### Conditional Display

```javascript
const items = getItems();
const display = fable.Logic.when(items, `Found ${items.length} items`, 'No items found');
```

### Numeric Thresholds

```javascript
const score = calculateScore();
const grade = fable.Logic.checkIf(score, '>=', 90, 'A',
              fable.Logic.checkIf(score, '>=', 80, 'B',
              fable.Logic.checkIf(score, '>=', 70, 'C', 'F')));
```

### Template Conditionals

Combined with the Template service:

```javascript
const template = fable.Utility.template(`
    <%= fable.Logic.when(user.premium, 'Premium Member', 'Free User') %>
`);
```

## Notes

- Numeric comparisons use `fable.Math` for arbitrary precision
- The `==` operator for numbers uses a tolerance of `0.000001` for comparison
- The `===` operator for numbers performs exact comparison
- Invalid operators default to loose equality (`==`) with a warning logged
