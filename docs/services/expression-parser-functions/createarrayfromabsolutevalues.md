# createarrayfromabsolutevalues

Creates an array of absolute values from input values.

## Syntax

```
createarrayfromabsolutevalues(value1, value2, ...)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Values to convert to absolute values |

## Returns

Array - Array of absolute values.

## Description

The `createarrayfromabsolutevalues` function takes multiple values and returns an array containing the absolute value of each input.

## Examples

### Basic Usage

```expression
Result = CREATEARRAYFROMABSOLUTEVALUES(-5, 3, -2, 7, -1)
// Result: [5, 3, 2, 7, 1]
```

### With Variables

```expression
AbsValues = CREATEARRAYFROMABSOLUTEVALUES(Delta1, Delta2, Delta3)
```

### For Distance Calculations

```expression
Distances = CREATEARRAYFROMABSOLUTEVALUES(X2-X1, Y2-Y1, Z2-Z1)
```

## Use Cases

- **Distance calculations**: Absolute differences
- **Error analysis**: Absolute errors
- **Data normalization**: Remove negative signs
- **Magnitude**: Get magnitudes of values

## Related Functions

- [abs](./abs.md) - Single value absolute
- [flatten](./flatten.md) - Flatten arrays
- [sum](./sum.md) - Sum the absolute values

## Notes

- Converts all values to positive
- Returns array, not single value
- Uses the Math service's `createArrayFromAbsoluteValues` method
