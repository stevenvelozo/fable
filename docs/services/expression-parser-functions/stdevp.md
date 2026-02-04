# stdevp

Calculates the population standard deviation of a set of values.

## Syntax

```
stdevp(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | An array of numeric values |

## Returns

String - The population standard deviation.

## Description

The `stdevp` function calculates the population standard deviation, which measures how spread out the values are from the mean. Population standard deviation divides by n (not n-1), and is used when you have data for the entire population, not just a sample.

## Examples

### Basic Usage

```expression
StDevP = STDEVP(Values)
// With Values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// Result: approximately "3.1623"
```

### Comparing Sample vs Population

```expression
// Sample standard deviation (divides by n-1)
SampleStDev = STDEV(Values)   // ≈ 3.3166

// Population standard deviation (divides by n)
PopStDev = STDEVP(Values)     // ≈ 3.1623
```

## Formula

Population Standard Deviation (σ):
```
σ = sqrt(Σ(xi - μ)² / n)
```

Where:
- xi = each value
- μ = population mean
- n = population size

## When to Use STDEVP vs STDEV

| Use STDEVP when... | Use STDEV when... |
|-------------------|-------------------|
| You have the entire population | You have a sample |
| Census data | Survey data |
| All possible outcomes | Subset of outcomes |

## Use Cases

- **Census data**: When you have measurements from everyone
- **Theoretical analysis**: Known distributions
- **Complete datasets**: When no inference is needed

## Related Functions

- [stdev](./stdev.md) - Sample standard deviation
- [var](./var.md) - Sample variance
- [varp](./varp.md) - Population variance
- [avg](./avg.md) / [mean](./mean.md) - Average

## Notes

- Uses n in denominator (no Bessel's correction)
- Results are slightly smaller than sample standard deviation
- For sample data, use [stdev](./stdev.md) instead
- Works with the Math service's `populationStandardDeviationPrecise` method
