# findfirstvaluebyexactmatch

Finds the first object in an array where a property exactly matches a value.

## Syntax

```
findfirstvaluebyexactmatch(array, property, value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | Array of objects to search |
| `property` | String | Property name to match against |
| `value` | Any | Value to match |

## Returns

Object - The first matching object, or undefined if not found.

## Description

The `findfirstvaluebyexactmatch` function searches through an array of objects and returns the first object where the specified property exactly matches the given value.

## Examples

### Basic Usage

```expression
// Given array: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
Result = FINDFIRSTVALUEBYEXACTMATCH(Users, "name", "Bob")
// Result: { id: 2, name: "Bob" }
```

### Find by ID

```expression
User = FINDFIRSTVALUEBYEXACTMATCH(AppData.Users, "id", "U123")
```

### Product Lookup

```expression
Product = FINDFIRSTVALUEBYEXACTMATCH(Products, "sku", "WIDGET-001")
```

## Use Cases

- **Lookups**: Find record by unique property
- **Data retrieval**: Get specific object
- **Validation**: Check if record exists
- **Search**: Simple exact-match search

## Related Functions

- [findfirstvaluebystringincludes](./findfirstvaluebystringincludes.md) - Partial string match
- [match](./match.md) - Regex pattern matching
- [entryinset](./entryinset.md) - Check if value exists in set

## Notes

- Returns first match only
- Case-sensitive matching
- Returns undefined if not found
- Uses the Utility service's `findFirstValueByExactMatch` method
