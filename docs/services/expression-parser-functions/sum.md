# sum

Calculates the sum of all values in a set.

## Syntax

```
sum(array)
sum(value1, value2, ...)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | An array of numeric values |
| `values` | Numbers | Individual values to sum |

## Returns

String - The sum of all values with arbitrary precision.

## Description

The `sum` function adds up all numeric values in an array or set of arguments. It uses arbitrary precision arithmetic for accurate calculations.

## Examples

### Basic Array Sum

```expression
TotalCost = SUM(ItemCosts)
// With ItemCosts = [100, 200, 50, 45, 5]
// Result: "400"
```

### Sum with Flattened Arrays

```expression
// Sum population from nested data
PopSum = sum(flatten(AppData.Cities[].population))
// Sums all population values from the Cities array
```

### Sum of Histogram Values

```expression
// Sum aggregated values
Total = SUM(FLATTEN(AppData.DestinationObject.AggregationResult))
```

### Combining with Other Functions

```expression
// Sum a computed series
IntegratedSeries = SUM(FLATTEN(AppData.SeriesFromCoefficients))
```

## Use Cases

- **Financial totals**: Sum of transactions, costs, revenues
- **Inventory**: Total quantity of items
- **Statistics**: First step in many statistical calculations
- **Aggregation**: Combining values from multiple sources

## Related Functions

- [avg](./avg.md) / [mean](./mean.md) - Calculate average
- [count](./count.md) - Count elements
- [min](./min.md) / [max](./max.md) - Find extremes
- [cumulativesummation](./cumulativesummation.md) - Running total

## Notes

- Uses arbitrary precision arithmetic
- Returns "0" for empty arrays
- Non-numeric values may be treated as 0
- Works with the Math service's `sumPrecise` method
