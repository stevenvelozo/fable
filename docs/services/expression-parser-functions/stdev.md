# stdev / stdeva

Calculates the sample standard deviation of a set of values.

## Syntax

```
stdev(array)
stdeva(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | An array of numeric values |

## Returns

String - The sample standard deviation.

## Description

The `stdev` and `stdeva` functions calculate the sample standard deviation, which measures how spread out the values are from the mean. Sample standard deviation divides by (n-1) rather than n, providing an unbiased estimate when working with a sample of a larger population.

## Examples

### Basic Usage

```expression
StDev = STDEV(Values)
// With Values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// Result: approximately "3.3166"
```

### Financial Risk Analysis

```expression
// Calculate volatility of returns
Volatility = STDEV(DailyReturns)
```

### Quality Control

```expression
// Measure variation in measurements
ProcessVariation = STDEV(Measurements)
```

## Formula

Sample Standard Deviation (s):
```
s = sqrt(Σ(xi - x̄)² / (n - 1))
```

Where:
- xi = each value
- x̄ = mean of all values
- n = number of values

## Use Cases

- **Finance**: Measuring volatility and risk
- **Quality control**: Process variation analysis
- **Research**: Data variability measurement
- **Statistics**: Confidence intervals, hypothesis testing

## Related Functions

- [stdevp](./stdevp.md) - Population standard deviation
- [var](./var.md) - Sample variance
- [varp](./varp.md) - Population variance
- [avg](./avg.md) / [mean](./mean.md) - Average

## Notes

- `stdev` and `stdeva` are aliases
- Uses (n-1) in denominator (Bessel's correction)
- For population data, use [stdevp](./stdevp.md) instead
- Works with the Math service's `standardDeviationPrecise` method
