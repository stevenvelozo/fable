# sorthistogram

Sorts a histogram object by its values.

## Syntax

```
sorthistogram(histogram)
sorthistogram(histogram, descending)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `histogram` | Object | The histogram object to sort |
| `descending` | Boolean | If true, sort in descending order (optional) |

## Returns

Array - Array of [key, value] pairs sorted by value.

## Description

The `sorthistogram` function takes a histogram (object with keys and numeric values) and returns it as a sorted array of key-value pairs, ordered by the values.

## Examples

### Ascending Sort (Default)

```expression
// Given histogram: { 'A': 5, 'B': 2, 'C': 8 }
Result = SORTHISTOGRAM(Histogram)
// Result: [['B', 2], ['A', 5], ['C', 8]]
```

### Descending Sort

```expression
Result = SORTHISTOGRAM(Histogram, true)
// Result: [['C', 8], ['A', 5], ['B', 2]]
```

### With Distribution Histogram

```expression
Distribution = DISTRIBUTIONHISTOGRAM("AppData.Orders", "status")
SortedByCount = SORTHISTOGRAM(Distribution, true)
// Most common statuses first
```

## Use Cases

- **Rankings**: Rank categories by frequency
- **Top N**: Find top categories
- **Reports**: Ordered category lists
- **Analysis**: Sorted distributions

## Related Functions

- [sorthistogrambykeys](./sorthistogrambykeys.md) - Sort by keys instead
- [sortset](./sortset.md) - Sort simple arrays
- [distributionhistogram](./distributionhistogram.md) - Create histogram
- [aggregationhistogram](./aggregationhistogram.md) - Create aggregation histogram

## Notes

- Returns array of [key, value] pairs
- Sorts by numeric value
- Uses the Math service's `sortHistogram` method
