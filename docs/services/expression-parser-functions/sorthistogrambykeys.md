# sorthistogrambykeys

Sorts a histogram object by its keys.

## Syntax

```
sorthistogrambykeys(histogram)
sorthistogrambykeys(histogram, descending)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `histogram` | Object | The histogram object to sort |
| `descending` | Boolean | If true, sort in descending order (optional) |

## Returns

Array - Array of [key, value] pairs sorted by key.

## Description

The `sorthistogrambykeys` function takes a histogram (object with keys and values) and returns it as a sorted array of key-value pairs, ordered alphabetically or numerically by the keys.

## Examples

### Alphabetical Sort (Default)

```expression
// Given histogram: { 'Charlie': 5, 'Alice': 2, 'Bob': 8 }
Result = SORTHISTOGRAMBYKEYS(Histogram)
// Result: [['Alice', 2], ['Bob', 8], ['Charlie', 5]]
```

### Descending Sort

```expression
Result = SORTHISTOGRAMBYKEYS(Histogram, true)
// Result: [['Charlie', 5], ['Bob', 8], ['Alice', 2]]
```

### State Data

```expression
PopulationByState = AGGREGATIONHISTOGRAM("AppData.Cities", "state", "population")
SortedByState = SORTHISTOGRAMBYKEYS(PopulationByState)
// Alphabetically by state name
```

## Use Cases

- **Alphabetical ordering**: Sort categories alphabetically
- **Consistent display**: Predictable key ordering
- **Reports**: Ordered by category name
- **Lookups**: Binary search preparation

## Related Functions

- [sorthistogram](./sorthistogram.md) - Sort by values instead
- [sortset](./sortset.md) - Sort simple arrays
- [distributionhistogram](./distributionhistogram.md) - Create histogram

## Notes

- Returns array of [key, value] pairs
- Sorts by key (alphabetically/numerically)
- Uses the Math service's `sortHistogramByKeys` method
