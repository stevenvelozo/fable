# findfirstvaluebystringincludes

Finds the first object where a property contains a substring.

## Syntax

```
findfirstvaluebystringincludes(array, property, substring)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | Array of objects to search |
| `property` | String | Property name to search in |
| `substring` | String | Substring to search for |

## Returns

Object - The first matching object, or undefined if not found.

## Description

The `findfirstvaluebystringincludes` function searches through an array of objects and returns the first object where the specified property contains the given substring.

## Examples

### Basic Usage

```expression
// Given: [{ name: "Alice Smith" }, { name: "Bob Jones" }]
Result = FINDFIRSTVALUEBYSTRINGINCLUDES(Users, "name", "Smith")
// Result: { name: "Alice Smith" }
```

### Email Search

```expression
User = FINDFIRSTVALUEBYSTRINGINCLUDES(Users, "email", "@company.com")
```

### Description Search

```expression
Product = FINDFIRSTVALUEBYSTRINGINCLUDES(Products, "description", "wireless")
```

## Use Cases

- **Fuzzy search**: Find by partial match
- **Text search**: Search in text fields
- **Filtering**: Find containing substring
- **Lookups**: Partial name/ID matching

## Related Functions

- [findfirstvaluebyexactmatch](./findfirstvaluebyexactmatch.md) - Exact match
- [match](./match.md) - Regex pattern matching
- [entryinset](./entryinset.md) - Check membership

## Notes

- Case-sensitive by default
- Returns first match only
- Partial string matching
- Uses the Utility service's `findFirstValueByStringIncludes` method
