# abs

Returns the absolute value of a number.

## Syntax

```
abs(value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number/String | The value to get the absolute value of |

## Returns

String - The absolute value (non-negative) of the input.

## Description

The `abs` function returns the absolute value of a number, which is always non-negative. If the input is negative, it returns the positive equivalent. If already positive or zero, it returns the value unchanged.

## Examples

### Basic Usage

```expression
Result = abs(-5)
// Result: "5"

Result = abs(5)
// Result: "5"

Result = abs(0)
// Result: "0"

Result = abs(-3.14159)
// Result: "3.14159"
```

### With Variables

```expression
// Calculate the absolute difference between two values
Difference = abs(Value1 - Value2)
// With Value1=10, Value2=25
// Result: "15"
```

### In Conditional Comparisons

```expression
// Check if two values are within a tolerance
IsClose = IF(ABS(Expected - Actual), "LT", Tolerance, "yes", "no")
```

### In Complex Expressions

```expression
// Used in the unit tests to verify precision
Result = abs(ComputedValue - ExpectedValue)
// Check if within epsilon: abs(difference) < 0.00000000001
```

## Use Cases

- **Error calculations**: Finding the magnitude of differences
- **Distance calculations**: Distances are always positive
- **Tolerance checking**: Verifying values are within acceptable ranges
- **Data normalization**: Converting all values to positive

## Related Functions

- [sqrt](./sqrt.md) - Square root
- [floor](./floor.md) - Floor value
- [ceil](./ceil.md) - Ceiling value

## Notes

- Uses arbitrary precision arithmetic
- Returns a string representation of the result
- Works with the Math service's `absPrecise` method internally
