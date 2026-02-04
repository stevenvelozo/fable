# objectvaluestoarray

Extracts all values from an object as an array.

## Syntax

```
objectvaluestoarray(object)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Object | The object to extract values from |

## Returns

Array - Array of all values from the object.

## Description

The `objectvaluestoarray` function returns all property values from an object as an array. This is useful for aggregating values without needing the keys.

## Examples

### Basic Usage

```expression
// Given object: { name: "John", age: 30, city: "NYC" }
Result = OBJECTVALUESTOARRAY(Person)
// Result: ["John", 30, "NYC"]
```

### Sum Histogram Values

```expression
// Get all counts from histogram and sum them
Values = OBJECTVALUESTOARRAY(CategoryCounts)
Total = SUM(Values)
```

### Aggregate Processing

```expression
AllValues = OBJECTVALUESTOARRAY(DataObject)
Average = AVG(AllValues)
```

## Use Cases

- **Aggregation**: Sum or average all values
- **Collection**: Get all values regardless of key
- **Analysis**: Process all object values
- **Display**: List all values

## Related Functions

- [objectkeystoarray](./objectkeystoarray.md) - Extract keys instead
- [flatten](./flatten.md) - Flatten nested arrays
- [sum](./sum.md) - Sum the extracted values

## Notes

- Returns array of values (any type)
- Order corresponds to key order
- Uses the Math service's `objectValuesToArray` method
