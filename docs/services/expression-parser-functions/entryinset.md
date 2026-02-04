# entryinset

Checks if a value exists in a set/array.

## Syntax

```
entryinset(value, set)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Any | The value to search for |
| `set` | Array | The array to search in |

## Returns

Boolean - True if the value exists in the set, false otherwise.

## Description

The `entryinset` function checks whether a specific value exists within an array or set. This is useful for membership testing and validation.

## Examples

### Basic Usage

```expression
Result = ENTRYINSET(3, [1, 2, 3, 4, 5])
// Result: true
```

### Not Found

```expression
Result = ENTRYINSET(10, [1, 2, 3, 4, 5])
// Result: false
```

### With Variables

```expression
IsValidStatus = ENTRYINSET(OrderStatus, ["pending", "shipped", "delivered"])
```

### Validation

```expression
IsAllowedCategory = ENTRYINSET(Category, AllowedCategories)
```

## Use Cases

- **Validation**: Check if value is allowed
- **Filtering**: Conditional processing
- **Membership**: Check set membership
- **Logic**: Conditional branching

## Related Functions

- [findfirstvaluebyexactmatch](./findfirstvaluebyexactmatch.md) - Find value in array
- [if](./if.md) - Use with conditional logic
- [when](./when.md) - Conditional expression

## Notes

- Returns boolean (true/false)
- Uses exact matching
- Case-sensitive for strings
- Uses the Math service's `entryInSet` method
