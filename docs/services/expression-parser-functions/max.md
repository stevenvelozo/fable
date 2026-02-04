# max

Returns the largest value from a set of numbers.

## Syntax

```
max(value1, value2, ...)
max(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Individual numbers or an array of numbers |

## Returns

String - The maximum value from the input set.

## Description

The `max` function finds and returns the largest value from a set of numbers. It can accept individual arguments or an array of values.

## Examples

### Basic Usage

```expression
Result = MAX(5, 10, 3, 8)
// Result: "10"
```

### With Variables

```expression
Highest = MAX(Score1, Score2, Score3)
```

### With Array

```expression
// Given an array of values
MaxValue = MAX(AppData.Scores)
```

### In Expressions

```expression
// Find the highest price
MaxPrice = MAX(FLATTEN(AppData.Products.price))
```

## Use Cases

- **Data analysis**: Find highest values in datasets
- **Pricing**: Determine maximum price
- **Scoring**: Find top scores
- **Limits**: Establish upper bounds

## Related Functions

- [min](./min.md) - Find minimum value
- [largestinset](./largestinset.md) - Alternative for finding largest
- [sortset](./sortset.md) - Sort values to find extremes
- [avg](./avg.md) - Calculate average

## Notes

- Returns result as string (arbitrary precision)
- Works with the Math service's `maxPrecise` method
- Handles both individual arguments and arrays
