# distributionhistogrambyobject

Generates a distribution histogram from an object directly.

## Syntax

```
distributionhistogrambyobject(object, keyProperty)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Array | Array of objects to count |
| `keyProperty` | String | Property name to count occurrences of |

## Returns

Object - A histogram object with unique values and their counts.

## Description

The `distributionhistogrambyobject` function is similar to `distributionhistogram` but takes an object/array directly instead of a data path string. This is useful when working with data that's already in a variable.

## Examples

### Basic Usage

```expression
// Given array of order data
Orders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'shipped' },
  { id: 3, status: 'pending' },
  { id: 4, status: 'delivered' }
]

Result = DISTRIBUTIONHISTOGRAMBYOBJECT(Orders, "status")
// Result: { 'pending': 2, 'shipped': 1, 'delivered': 1 }
```

### With Filtered Data

```expression
CategoryCounts = DISTRIBUTIONHISTOGRAMBYOBJECT(FilteredProducts, "category")
```

## Use Cases

- **Dynamic data**: Count data already in variables
- **Filtered data**: Count after filtering
- **Chained operations**: Use in expression chains

## Related Functions

- [distributionhistogram](./distributionhistogram.md) - Uses data path string
- [aggregationhistogrambyobject](./aggregationhistogrambyobject.md) - Sum by object
- [count](./count.md) - Simple count

## Notes

- Takes array directly, not path string
- Uses the Math service's `histogramDistributionByExactValue` method
