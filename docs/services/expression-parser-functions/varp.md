# varp

Calculates the variance of an entire population.

## Syntax

```
varp(value1, value2, ...)
varp(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Individual numbers or an array of numbers |

## Returns

String - The population variance.

## Description

The `varp` function calculates the variance of an entire population using the population variance formula (dividing by n). Use this when your data represents the entire population, not a sample.

## Examples

### Basic Usage

```expression
Result = VARP(2, 4, 6, 8, 10)
// Result: "8" (population variance)
```

### With Array

```expression
PopVariance = VARP(FLATTEN(AppData.AllMeasurements))
```

### Complete Dataset

```expression
// When you have all values, not a sample
TotalVariance = VARP(EntireDataset)
```

## Use Cases

- **Census data**: Complete population statistics
- **Quality control**: All measurements available
- **Inventory**: Entire inventory analysis
- **Deterministic systems**: Complete data known

## Related Functions

- [var](./var.md) - Sample variance
- [vara](./vara.md) - Variance with text/boolean
- [stdevp](./stdevp.md) - Population standard deviation

## Notes

- Uses population variance formula (n divisor)
- For samples, use `var` instead
- Returns result as string
- Uses the Math service's `varpPrecise` method
