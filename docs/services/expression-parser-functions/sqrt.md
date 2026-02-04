# sqrt

Calculates the square root of a number with arbitrary precision.

## Syntax

```
sqrt(value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number/String | The value to calculate the square root of |

## Returns

String - The square root of the input value with arbitrary precision.

## Description

The `sqrt` function computes the square root of a numeric value. It uses arbitrary precision arithmetic, so results are accurate for very large or very precise numbers.

## Examples

### Basic Usage

```expression
Result = sqrt(16)
// Result: "4"

Result = sqrt(2)
// Result: "1.41421356237309504880168872420969807856967187537694..."

Result = sqrt(100)
// Result: "10"
```

### In Complex Expressions

```expression
// Pythagorean theorem: c = sqrt(a² + b²)
Hypotenuse = sqrt(X^2 + Y^2)
// With X=3, Y=4: Result: "5"

// Distance formula
Distance = sqrt((X2 - X1)^2 + (Y2 - Y1)^2)
```

### With Variables

```expression
Result = sqrt(100 * (C + 30)) + sin(Depth - Width) / 10
// With C=-13, Depth=100.203, Width=10.5
// Result: "41.32965489638783839821"
```

### Nested in Other Functions

```expression
Result = 1.5 * sqrt(8 * 2.423782342^2) / 10
// Result: "1.02832375808904701855"

Result = 1 * sqrt(16)
// Result: "4"
```

## Use Cases

- **Geometry calculations**: Computing diagonals, distances, and hypotenuses
- **Statistical analysis**: Used in standard deviation calculations
- **Physics formulas**: Many physics equations involve square roots
- **Financial calculations**: Volatility and other risk metrics

## Related Functions

- [abs](./abs.md) - Absolute value
- [pow](./pow.md) - Power/exponentiation (use `^` operator)

## Notes

- Returns arbitrary precision results as strings
- Input can be a number or a numeric string
- Works with the Math service's `sqrtPrecise` method internally
