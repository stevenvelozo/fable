# log

Calculates the natural logarithm (base e) of a number.

## Syntax

```
log(value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number | The number to calculate the logarithm of |

## Returns

Number - The natural logarithm of the input value.

## Description

The `log` function calculates the natural logarithm (ln) of a number. The natural logarithm uses Euler's number (e ≈ 2.71828) as its base.

## Examples

### Basic Usage

```expression
Result = LOG(10)
// Result: 2.302585092994046 (approximately)
```

### Logarithm of e

```expression
Result = LOG(EULER())
// Result: 1
```

### With Variables

```expression
LogValue = LOG(InputNumber)
```

### Inverse of exp

```expression
// LOG and EXP are inverse functions
Original = 5
Transformed = LOG(EXP(Original))
// Transformed ≈ 5
```

## Use Cases

- **Growth analysis**: Logarithmic scaling of data
- **Scientific calculations**: Mathematical modeling
- **Data transformation**: Normalizing skewed data
- **Financial calculations**: Compound interest analysis

## Related Functions

- [exp](./exp.md) - Inverse function (e^x)
- [euler](./euler.md) - Euler's number constant
- [sqrt](./sqrt.md) - Square root

## Notes

- Returns NaN for negative numbers
- Returns -Infinity for 0
- Uses JavaScript's `Math.log` internally
- LOG(1) = 0
