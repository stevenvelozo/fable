# countset

Returns the count of elements in a set.

## Syntax

```
countset(set)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `set` | Array | The set to count elements from |

## Returns

String - The number of elements in the set.

## Description

The `countset` function returns the number of elements in a set. It works similarly to `count` but is specifically designed for set operations.

## Examples

### Basic Usage

```expression
Result = COUNTSET([1, 2, 3, 4, 5])
// Result: "5"
```

### With Data

```expression
// Count items in a set
TotalItems = COUNTSET(AppData.UniqueCategories)
```

### After Set Operations

```expression
// Count after concatenating sets
CombinedCount = COUNTSET(SETCONCATENATE(Set1, Set2))
```

## Use Cases

- **Set operations**: Determine set cardinality
- **Data analysis**: Count unique values
- **Validation**: Verify set sizes
- **Statistics**: Sample size from sets

## Related Functions

- [count](./count.md) - Count array elements
- [countsetelements](./countsetelements.md) - Count unique elements
- [setconcatenate](./setconcatenate.md) - Combine sets

## Notes

- Returns result as string
- Works with the Math service's `count` method
- Functionally similar to `count`
