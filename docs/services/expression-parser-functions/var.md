# var

Calculates the variance of a sample dataset.

## Syntax

```
var(value1, value2, ...)
var(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Individual numbers or an array of numbers |

## Returns

String - The sample variance.

## Description

The `var` function calculates the variance of a sample dataset using the sample variance formula (dividing by n-1). Variance measures how spread out the values are from the mean.

## Examples

### Basic Usage

```expression
Result = VAR(2, 4, 6, 8, 10)
// Result: "10" (sample variance)
```

### With Array

```expression
Variance = VAR(FLATTEN(AppData.Scores))
```

### Quality Control

```expression
// Check variance in measurements
MeasurementVariance = VAR(Measurements)
```

## Use Cases

- **Quality control**: Measure consistency
- **Statistics**: Distribution analysis
- **Finance**: Investment risk
- **Research**: Data spread analysis

## Related Functions

- [vara](./vara.md) - Variance including text/boolean
- [varp](./varp.md) - Population variance
- [stdev](./stdev.md) - Standard deviation
- [avg](./avg.md) - Mean value

## Notes

- Uses sample variance formula (n-1 divisor)
- For population variance, use `varp`
- Returns result as string
- Uses the Math service's `varPrecise` method
