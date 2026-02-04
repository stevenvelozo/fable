# cleanvaluearray

Gets a value from an array with default for missing values.

## Syntax

```
cleanvaluearray(array, index, defaultValue)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array to retrieve from |
| `index` | Number | Zero-based index |
| `defaultValue` | Any | Value to return if index is out of bounds or value is undefined |

## Returns

Any - The value at the index, or the default value.

## Description

The `cleanvaluearray` function retrieves a value from an array at the specified index, returning a default value if the index is out of bounds or the value is undefined/null.

## Examples

### Basic Usage

```expression
Result = CLEANVALUEARRAY(["a", "b", "c"], 5, "default")
// Result: "default" (index 5 is out of bounds)
```

### Safe Access

```expression
Value = CLEANVALUEARRAY(Items, Index, 0)
// Returns 0 if index invalid
```

### With Empty Array

```expression
First = CLEANVALUEARRAY(MaybeEmptyArray, 0, "No items")
```

## Use Cases

- **Safe access**: Avoid undefined errors
- **Default values**: Provide fallbacks
- **Data processing**: Handle missing data
- **Display**: Show placeholder for missing

## Related Functions

- [getvaluearray](./getvaluearray.md) - Get without default
- [cleanvalueobject](./cleanvalueobject.md) - Clean get from object
- [if](./if.md) - Conditional logic

## Notes

- Returns default for undefined/null
- Returns default for out-of-bounds
- Uses the Logic service's `cleanValueArray` method
