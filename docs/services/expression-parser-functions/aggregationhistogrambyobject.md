# aggregationhistogrambyobject

Generates an aggregation histogram from an object directly.

## Syntax

```
aggregationhistogrambyobject(object, keyProperty, valueProperty)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Array | Array of objects to aggregate |
| `keyProperty` | String | Property name to group by |
| `valueProperty` | String | Property name containing values to sum |

## Returns

Object - A histogram object with keys and their aggregated values.

## Description

The `aggregationhistogrambyobject` function is similar to `aggregationhistogram` but takes an object/array directly instead of a data path string. This is useful when working with data that's already in a variable.

## Examples

### Basic Usage

```expression
// Given array of team data
Teams = [
  { Team: 'Mariners', State: 'WA', Score: 100 },
  { Team: 'Yankees', State: 'NY', Score: 200 },
  { Team: 'Mets', State: 'NY', Score: 50 }
]

Result = AGGREGATIONHISTOGRAMBYOBJECT(Teams, "State", "Score")
// Result: { 'WA': '100', 'NY': '250' }
```

### With Variable Data

```expression
SalesByRegion = AGGREGATIONHISTOGRAMBYOBJECT(FilteredData, "region", "amount")
```

## Use Cases

- **Dynamic data**: Aggregate data already in variables
- **Filtered data**: Aggregate after filtering
- **Chained operations**: Use in expression chains

## Related Functions

- [aggregationhistogram](./aggregationhistogram.md) - Uses data path string
- [distributionhistogrambyobject](./distributionhistogrambyobject.md) - Count by object
- [sum](./sum.md) - Simple sum

## Notes

- Takes array directly, not path string
- Uses the Math service's `histogramAggregationByExactValue` method
