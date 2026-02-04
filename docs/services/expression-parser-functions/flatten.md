# flatten

Flattens a nested array or extracts property values from an array of objects.

## Syntax

```
flatten(array)
flatten(arrayOfObjects.property)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array to flatten or property path to extract |

## Returns

Array - A flattened array of values.

## Description

The `flatten` function can flatten nested arrays into a single-level array, or extract all values of a specific property from an array of objects. This is essential for preparing data for aggregate functions.

## Examples

### Flatten Nested Arrays

```expression
Result = FLATTEN([[1, 2], [3, 4], [5]])
// Result: [1, 2, 3, 4, 5]
```

### Extract Property Values

```expression
// Given AppData.Cities with objects containing 'population' property
Populations = FLATTEN(AppData.Cities.population)
// Result: [39538223, 29145505, 21538187, ...]
```

### With Aggregate Functions

```expression
// Sum all populations
TotalPopulation = SUM(FLATTEN(AppData.Cities.population))
```

### Chain Operations

```expression
// Get average of extracted values
AverageScore = AVG(FLATTEN(AppData.Students.score))
```

## Use Cases

- **Data extraction**: Get property values from object arrays
- **Array processing**: Flatten nested structures
- **Aggregation prep**: Prepare data for SUM, AVG, etc.
- **Data transformation**: Restructure array data

## Related Functions

- [sum](./sum.md) - Sum flattened values
- [avg](./avg.md) - Average flattened values
- [objectkeystoarray](./objectkeystoarray.md) - Extract object keys
- [objectvaluestoarray](./objectvaluestoarray.md) - Extract object values

## Notes

- Critical for preparing data for aggregate functions
- Works with both nested arrays and object arrays
- Uses the Math service's `flatten` method
- Commonly used in data pipelines
