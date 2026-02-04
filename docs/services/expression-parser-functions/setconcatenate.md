# setconcatenate

Concatenates two arrays into one.

## Syntax

```
setconcatenate(array1, array2)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array1` | Array | First array |
| `array2` | Array | Second array |

## Returns

Array - Combined array with elements from both inputs.

## Description

The `setconcatenate` function combines two arrays into a single array by appending the second array to the first.

## Examples

### Basic Usage

```expression
Result = SETCONCATENATE([1, 2, 3], [4, 5, 6])
// Result: [1, 2, 3, 4, 5, 6]
```

### Combining Data

```expression
AllItems = SETCONCATENATE(Category1Items, Category2Items)
```

### Multiple Concatenations

```expression
Combined = SETCONCATENATE(SETCONCATENATE(Set1, Set2), Set3)
```

## Use Cases

- **Data merging**: Combine datasets
- **Aggregation**: Collect from multiple sources
- **Array building**: Build arrays incrementally
- **Set union**: Combine sets (may have duplicates)

## Related Functions

- [arrayconcat](./arrayconcat.md) - Alternative concatenation
- [flatten](./flatten.md) - Flatten nested arrays
- [countset](./countset.md) - Count combined elements

## Notes

- Does not remove duplicates
- Order is preserved (array1 then array2)
- Uses the Math service's `setConcatenate` method
