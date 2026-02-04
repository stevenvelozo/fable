# aggregationhistogram

Generates a histogram by aggregating values grouped by a key.

## Syntax

```
aggregationhistogram(dataPath, keyProperty, valueProperty)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `dataPath` | String | Path to the data array (quoted string) |
| `keyProperty` | String | Property name to group by |
| `valueProperty` | String | Property name containing values to sum |

## Returns

Object - A histogram object with keys and their aggregated values.

## Description

The `aggregationhistogram` function creates a histogram by grouping records by a key property and summing the values of another property for each group. This is useful for aggregating totals by category.

## Examples

### Basic Usage

```expression
// Given AppData.Teams:
// [
//   { Team: 'Mariners', States: 'Washington', Score: 100 },
//   { Team: 'Yankees', States: 'New York', Score: 200 },
//   { Team: 'Mets', States: 'New York', Score: 50 },
//   { Team: 'Giants', States: 'California', Score: 45 },
//   { Team: 'Dodgers', States: 'California', Score: 5 },
//   { Team: 'Astros', States: 'Texas', Score: 75 }
// ]

Result = aggregationhistogram("AppData.Teams", "States", "Score")
// Result: {
//   'Washington': '100',
//   'New York': '250',    // 200 + 50
//   'California': '50',   // 45 + 5
//   'Texas': '75'
// }
```

### Population by State

```expression
// Aggregate city populations by state
AggregationResult = aggregationHistogram("AppData.Cities", "state", "population")
// Result: { 'Alabama': '1279813', 'Colorado': '...', ... }
```

### With Further Processing

```expression
// Sum all aggregated values
Total = SUM(FLATTEN(AppData.DestinationObject.AggregationResult))
```

## Use Cases

- **Sales by region**: Sum revenue by territory
- **Population statistics**: Aggregate population by state/country
- **Inventory**: Total items by category
- **Financial reporting**: Sum transactions by account

## Related Functions

- [aggregationhistogrambyobject](./aggregationhistogrambyobject.md) - Takes object directly instead of path
- [distributionhistogram](./distributionhistogram.md) - Count occurrences instead of sum
- [sum](./sum.md) - Simple sum of values

## Notes

- The data path must be a quoted string
- Uses arbitrary precision arithmetic for summing
- Works with the Math service's `histogramAggregationByExactValueFromInternalState` method
