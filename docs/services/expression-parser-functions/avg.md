# avg / mean

Calculates the arithmetic average (mean) of values in a set.

## Syntax

```
avg(array)
mean(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | An array of numeric values |

## Returns

String - The arithmetic mean of all values.

## Description

The `avg` and `mean` functions are identical - both calculate the arithmetic average of a set of values. The average is computed as the sum of all values divided by the count of values.

## Examples

### Basic Usage

```expression
TotalCost = MEAN(ItemCosts)
// With ItemCosts = [100, 200, 50, 45, 5]
// Result: "80"

// Using avg (same result)
Average = AVG(ItemCosts)
// Result: "80"
```

### Average of Computed Values

```expression
MadeUpValueArray = ROUND(AVG(createarrayfromabsolutevalues(100, 10, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100)),2)
// Result: "550.83"
```

### With Cleaned Data

```expression
// Average excluding invalid values
MadeUpValueArray = ROUND(AVG(cleanvaluearray(createarrayfromabsolutevalues(AppData.Value1, AppData.Value2, AppData.Value3, AppData.Value4, AppData.Value5), 1)),2)
// Result: "2421.54"
```

### Combined with Other Functions

```expression
// Average from flattened nested data
AvgPopulation = AVG(FLATTEN(Cities[].population))
```

## Use Cases

- **Statistics**: Central tendency measurement
- **Performance metrics**: Average response time, throughput
- **Financial**: Average transaction value, mean return
- **Scientific data**: Mean measurements

## Related Functions

- [sum](./sum.md) - Sum of values
- [median](./median.md) - Middle value
- [mode](./mode.md) - Most frequent value
- [count](./count.md) - Count elements

## Notes

- `avg` and `mean` are aliases for the same function
- Uses arbitrary precision arithmetic
- Returns the arithmetic mean (sum / count)
- Works with the Math service's `meanPrecise` and `averagePrecise` methods
