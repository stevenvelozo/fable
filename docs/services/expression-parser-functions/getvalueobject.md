# getvalueobject

Gets a value from an object by key.

## Syntax

```
getvalueobject(object, key)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Object | The object to retrieve from |
| `key` | String | The property key |

## Returns

Any - The value of the specified property.

## Description

The `getvalueobject` function retrieves a value from an object using a string key. This is useful for dynamic property access.

## Examples

### Basic Usage

```expression
// Given object: { name: "John", age: 30 }
Result = GETVALUEOBJECT(Person, "name")
// Result: "John"
```

### Dynamic Key

```expression
PropertyName = "email"
Value = GETVALUEOBJECT(User, PropertyName)
```

### Histogram Access

```expression
// Get count for specific category
Count = GETVALUEOBJECT(CategoryCounts, "Electronics")
```

## Use Cases

- **Dynamic access**: Access property by variable name
- **Histogram lookup**: Get value by key
- **Configuration**: Access settings by name
- **Data extraction**: Get nested values

## Related Functions

- [getvalue](./getvalue.md) - Get from data state
- [getvaluearray](./getvaluearray.md) - Get from array by index
- [objectkeystoarray](./objectkeystoarray.md) - Get all keys

## Notes

- String key access
- Returns undefined for missing keys
- Uses the Logic service's `getValueObject` method
