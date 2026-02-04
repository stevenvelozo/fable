# min

Returns the smallest value from a set of numbers.

## Syntax

```
min(value1, value2, ...)
min(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Individual numbers or an array of numbers |

## Returns

String - The minimum value from the input set.

## Description

The `min` function finds and returns the smallest value from a set of numbers. It can accept individual arguments or an array of values.

## Examples

### Basic Usage

```expression
Result = MIN(5, 10, 3, 8)
// Result: "3"
```

### With Variables

```expression
Lowest = MIN(Price1, Price2, Price3)
```

### With Array

```expression
// Given an array of values
MinValue = MIN(AppData.Temperatures)
```

### Finding Range

```expression
// Calculate the range of values
Range = MAX(Values) - MIN(Values)
```

## Use Cases

- **Data analysis**: Find lowest values in datasets
- **Pricing**: Determine minimum price
- **Quality control**: Find minimum measurements
- **Limits**: Establish lower bounds

## Related Functions

- [max](./max.md) - Find maximum value
- [smallestinset](./smallestinset.md) - Alternative for finding smallest
- [sortset](./sortset.md) - Sort values to find extremes
- [avg](./avg.md) - Calculate average

## Notes

- Returns result as string (arbitrary precision)
- Works with the Math service's `minPrecise` method
- Handles both individual arguments and arrays
