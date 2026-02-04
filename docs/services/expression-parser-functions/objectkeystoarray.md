# objectkeystoarray

Extracts all keys from an object as an array.

## Syntax

```
objectkeystoarray(object)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Object | The object to extract keys from |

## Returns

Array - Array of all keys from the object.

## Description

The `objectkeystoarray` function returns all property names (keys) from an object as an array. This is useful for iterating over object properties or analyzing object structure.

## Examples

### Basic Usage

```expression
// Given object: { name: "John", age: 30, city: "NYC" }
Result = OBJECTKEYSTOARRAY(Person)
// Result: ["name", "age", "city"]
```

### With Histogram

```expression
// Get all category names from histogram
Categories = OBJECTKEYSTOARRAY(CategoryCounts)
```

### Dynamic Property Access

```expression
Keys = OBJECTKEYSTOARRAY(ConfigObject)
// Use keys for iteration or display
```

## Use Cases

- **Object inspection**: List all properties
- **Dynamic iteration**: Process unknown objects
- **Validation**: Check expected properties exist
- **Display**: Show object structure

## Related Functions

- [objectvaluestoarray](./objectvaluestoarray.md) - Extract values instead
- [getvalue](./getvalue.md) - Get specific value by key
- [flatten](./flatten.md) - Flatten arrays

## Notes

- Returns array of strings (key names)
- Order may not be guaranteed
- Uses the Math service's `objectKeysToArray` method
