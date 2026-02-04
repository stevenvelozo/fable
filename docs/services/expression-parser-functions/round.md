# round

Rounds a number to a specified number of decimal places.

## Syntax

```
round(value)
round(value, decimalPlaces)
round(value, decimalPlaces, roundingMethod)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | Number/String | required | The value to round |
| `decimalPlaces` | Number | 0 | Number of decimal places |
| `roundingMethod` | Number | 1 | Rounding method (0-3) |

### Rounding Methods

| Value | Method | Description |
|-------|--------|-------------|
| 0 | Round Down | Truncate toward zero |
| 1 | Round Half Up | Round to nearest, ties away from zero (default) |
| 2 | Round Half Even | Round to nearest, ties to even (banker's rounding) |
| 3 | Round Up | Always round away from zero |

## Returns

String - The rounded value.

## Description

The `round` function rounds a number to a specified number of decimal places using arbitrary precision arithmetic. It supports multiple rounding methods for different use cases.

## Examples

### Basic Usage (No Decimal Places)

```expression
Result = round(3.7)
// Result: "4"

Result = round(3.2)
// Result: "3"

Result = round(3.5)
// Result: "4" (rounds up by default)
```

### With Decimal Places

```expression
Result = round(3.14159, 2)
// Result: "3.14"

Result = round(3.14159, 4)
// Result: "3.1416"

// From unit tests:
Area = ROUND(X * Y * Z, 2)
// With X=5.867, Y=3.1, Z=75: Area = 1364.0775
// Result: "1364.08"
```

### With Custom Rounding Method

```expression
// Round up (method 3)
Result = ROUND(X * Y * Z, 3, 3)
// With X=5.867, Y=3.5, Z=75.248923423
// Result: "1545.2"
```

### Dynamic Decimal Places

```expression
// Decimal places can be computed
MATH_DP = ROUND(1.2345, 5 - 2)
// Result: "1.235"
```

### In Complex Expressions

```expression
EGS = ROUND(ROUND(0.0172834*2.71828182845905^(-0.0117685*Temp),5)*SQRT(ROUND(16.294-0.163*HR,1)/60),4)
// With Temp=24, HR=20.5
// Result: "0.0061"
```

## Use Cases

- **Financial calculations**: Rounding currency values
- **Display formatting**: Showing clean numeric values
- **Precision control**: Limiting decimal places in results
- **Statistical output**: Rounding means, percentages, etc.

## Related Functions

- [tofixed](./tofixed.md) - Format to fixed decimal places
- [floor](./floor.md) - Round down
- [ceil](./ceil.md) - Round up

## Notes

- Uses arbitrary precision arithmetic
- Returns a string representation
- When no decimal places specified, rounds to nearest integer
- Be careful with rounding methods in financial applications (banker's rounding may be preferred)
