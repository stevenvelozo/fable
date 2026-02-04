# objectvaluessortbyexternalobjectarray

Sorts object values based on an external ordering array.

## Syntax

```
objectvaluessortbyexternalobjectarray(object, orderArray, keyProperty)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Object | Object to sort values from |
| `orderArray` | Array | Array defining the sort order |
| `keyProperty` | String | Property to match for ordering |

## Returns

Array - Values sorted according to external order.

## Description

The `objectvaluessortbyexternalobjectarray` function extracts values from an object and sorts them based on the order defined by an external array.

## Examples

### Basic Usage

```expression
Data = { 'a': 10, 'b': 20, 'c': 30 }
Order = [{ key: 'c' }, { key: 'a' }, { key: 'b' }]

Result = OBJECTVALUESSORTBYEXTERNALOBJECTARRAY(Data, Order, "key")
// Result: [30, 10, 20] (sorted: c, a, b)
```

### Custom Display Order

```expression
// Sort categories by custom priority
CategoryData = { 'urgent': 5, 'normal': 10, 'low': 2 }
Priority = [{ name: 'urgent' }, { name: 'normal' }, { name: 'low' }]

Sorted = OBJECTVALUESSORTBYEXTERNALOBJECTARRAY(CategoryData, Priority, "name")
```

## Use Cases

- **Custom ordering**: Sort by external criteria
- **Display order**: Match specific sort order
- **Prioritization**: Order by priority list
- **Report generation**: Consistent ordering

## Related Functions

- [sorthistogram](./sorthistogram.md) - Sort by values
- [sorthistogrambykeys](./sorthistogrambykeys.md) - Sort alphabetically
- [objectvaluestoarray](./objectvaluestoarray.md) - Extract values

## Notes

- Maintains relationship between keys and values
- Uses the Math service
