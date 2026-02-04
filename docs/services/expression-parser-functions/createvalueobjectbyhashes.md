# createvalueobjectbyhashes

Creates an object from arrays of keys and values.

## Syntax

```
createvalueobjectbyhashes(keys, values)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `keys` | Array | Array of property names |
| `values` | Array | Array of values |

## Returns

Object - New object with key-value pairs.

## Description

The `createvalueobjectbyhashes` function creates an object by pairing up arrays of keys and values. Each key is matched with the value at the same index.

## Examples

### Basic Usage

```expression
Keys = ["name", "age", "city"]
Values = ["John", 30, "NYC"]
Result = CREATEVALUEOBJECTBYHASHES(Keys, Values)
// Result: { name: "John", age: 30, city: "NYC" }
```

### From Headers and Data

```expression
Headers = ["id", "product", "price"]
Row = ["001", "Widget", "9.99"]
Record = CREATEVALUEOBJECTBYHASHES(Headers, Row)
```

### Dynamic Object Creation

```expression
PropertyNames = OBJECTKEYSTOARRAY(Template)
PropertyValues = GeneratedValues
NewObject = CREATEVALUEOBJECTBYHASHES(PropertyNames, PropertyValues)
```

## Use Cases

- **CSV processing**: Convert rows to objects
- **Data transformation**: Build objects dynamically
- **Mapping**: Create lookup tables
- **Import**: Convert flat data to objects

## Related Functions

- [objectkeystoarray](./objectkeystoarray.md) - Extract keys
- [objectvaluestoarray](./objectvaluestoarray.md) - Extract values
- [generatearrayofobjectsfromsets](./generatearrayofobjectsfromsets.md) - Generate multiple objects

## Notes

- Arrays should have same length
- Uses the Logic service's `createValueObjectByHashes` method
