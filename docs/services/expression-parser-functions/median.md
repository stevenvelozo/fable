# median

Returns the middle value of a sorted set.

## Syntax

```
median(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | An array of numeric values |

## Returns

String - The median value.

## Description

The `median` function returns the middle value when all values are sorted. For an odd number of values, it returns the exact middle value. For an even number of values, it returns the average of the two middle values.

## Examples

### Odd Number of Values

```expression
TotalCost = MEDIAN(ItemCosts)
// With ItemCosts = [100, 200, 50, 45, 5]
// Sorted: [5, 45, 50, 100, 200]
// Result: "50" (the middle value)
```

### Even Number of Values

```expression
Result = median([1, 2, 3, 4])
// Sorted: [1, 2, 3, 4]
// Middle values: 2 and 3
// Result: "2.5" (average of 2 and 3)
```

### With Variable Data

```expression
MedianPrice = MEDIAN(Prices)
// Finds the middle price point
```

## Use Cases

- **Statistics**: Robust measure of central tendency
- **Real estate**: Median home prices (less affected by outliers)
- **Income analysis**: Median income (avoids skew from extremes)
- **Quality metrics**: Median response time

## Advantages Over Mean

The median is more robust than the mean for skewed data:

```expression
// Example: [1, 2, 3, 4, 1000]
Mean = 202     // Heavily influenced by 1000
Median = 3     // Better represents typical value
```

## Related Functions

- [avg](./avg.md) / [mean](./mean.md) - Arithmetic average
- [mode](./mode.md) - Most frequent value
- [min](./min.md) / [max](./max.md) - Extremes

## Notes

- Values are automatically sorted before finding median
- Uses arbitrary precision arithmetic
- Works with the Math service's `medianPrecise` method
