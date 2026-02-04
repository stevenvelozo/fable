# largestinset

Returns the largest value from a set/array.

## Syntax

```
largestinset(set)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `set` | Array | The array of values |

## Returns

String - The largest value in the set.

## Description

The `largestinset` function finds and returns the largest (maximum) value from an array. This is an alternative to the `max` function specifically designed for set operations.

## Examples

### Basic Usage

```expression
Result = LARGESTINSET([5, 2, 8, 1, 9])
// Result: "9"
```

### With Data

```expression
HighestScore = LARGESTINSET(FLATTEN(AppData.Students.score))
```

### Sales Data

```expression
TopSale = LARGESTINSET(MonthlySales)
```

## Use Cases

- **Analysis**: Find maximum values
- **Rankings**: Determine top values
- **Comparisons**: Find highest in category
- **Limits**: Check maximum constraints

## Related Functions

- [smallestinset](./smallestinset.md) - Find minimum value
- [max](./max.md) - Alternative maximum function
- [sortset](./sortset.md) - Sort to find extremes

## Notes

- Returns result as string
- Works with numeric values
- Uses the Math service's `largestInSet` method
