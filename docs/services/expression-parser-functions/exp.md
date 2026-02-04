# exp

Calculates e raised to the power of a number.

## Syntax

```
exp(exponent)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `exponent` | Number | The power to raise e to |

## Returns

Number - The value of e^exponent.

## Description

The `exp` function calculates e (Euler's number, approximately 2.71828) raised to the specified power. This is the inverse of the natural logarithm function.

## Examples

### Basic Usage

```expression
Result = EXP(1)
// Result: 2.718281828459045 (e)
```

### Exponential of Zero

```expression
Result = EXP(0)
// Result: 1
```

### With Variables

```expression
GrowthFactor = EXP(Rate * Time)
```

### Inverse of log

```expression
// EXP and LOG are inverse functions
Original = 2.5
Transformed = EXP(LOG(Original))
// Transformed ≈ 2.5
```

## Use Cases

- **Growth models**: Exponential growth calculations
- **Statistics**: Normal distribution calculations
- **Finance**: Continuous compound interest
- **Physics**: Decay and growth functions

## Related Functions

- [log](./log.md) - Inverse function (natural logarithm)
- [euler](./euler.md) - Euler's number constant
- [sqrt](./sqrt.md) - Square root

## Notes

- EXP(0) = 1
- EXP(1) = e ≈ 2.71828
- Uses JavaScript's `Math.exp` internally
- Useful for exponential growth/decay calculations
