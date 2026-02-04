# smallestinset

Returns the smallest value from a set/array.

## Syntax

```
smallestinset(set)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `set` | Array | The array of values |

## Returns

String - The smallest value in the set.

## Description

The `smallestinset` function finds and returns the smallest (minimum) value from an array. This is an alternative to the `min` function specifically designed for set operations.

## Examples

### Basic Usage

```expression
Result = SMALLESTINSET([5, 2, 8, 1, 9])
// Result: "1"
```

### With Data

```expression
LowestPrice = SMALLESTINSET(FLATTEN(AppData.Products.price))
```

### Temperature Data

```expression
MinTemp = SMALLESTINSET(DailyTemperatures)
```

## Use Cases

- **Analysis**: Find minimum values
- **Thresholds**: Determine lower bounds
- **Comparisons**: Find lowest in category
- **Validation**: Check minimum constraints

## Related Functions

- [largestinset](./largestinset.md) - Find maximum value
- [min](./min.md) - Alternative minimum function
- [sortset](./sortset.md) - Sort to find extremes

## Notes

- Returns result as string
- Works with numeric values
- Uses the Math service's `smallestInSet` method
