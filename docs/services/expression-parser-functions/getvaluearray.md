# getvaluearray

Gets a value from an array by index.

## Syntax

```
getvaluearray(array, index)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array to retrieve from |
| `index` | Number | Zero-based index |

## Returns

Any - The value at the specified index.

## Description

The `getvaluearray` function retrieves a value from an array at the specified index. Uses zero-based indexing.

## Examples

### Basic Usage

```expression
Result = GETVALUEARRAY(["a", "b", "c", "d"], 2)
// Result: "c" (index 2, third element)
```

### First Element

```expression
First = GETVALUEARRAY(Items, 0)
```

### With Variable Index

```expression
SelectedItem = GETVALUEARRAY(Options, SelectedIndex)
```

## Use Cases

- **Random selection**: Get random array element
- **Indexed access**: Retrieve by position
- **Dynamic selection**: Variable-based selection
- **Data extraction**: Get specific element

## Related Functions

- [getvalue](./getvalue.md) - Get property from object
- [getvalueobject](./getvalueobject.md) - Get from object by key
- [slice](./slice.md) - Get range of elements

## Notes

- Zero-based indexing
- Returns undefined for out-of-bounds
- Uses the Logic service's `getValueArray` method
