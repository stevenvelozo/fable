# slice

Extracts a portion of an array.

## Syntax

```
slice(array, start)
slice(array, start, end)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array to slice |
| `start` | Number | Starting index (0-based) |
| `end` | Number | Ending index (optional, exclusive) |

## Returns

Array - A new array containing the extracted elements.

## Description

The `slice` function extracts a section of an array and returns it as a new array. The original array is not modified.

## Examples

### Basic Usage

```expression
Result = SLICE([1, 2, 3, 4, 5], 1, 4)
// Result: [2, 3, 4]
```

### From Start Index to End

```expression
// Get everything from index 2 onwards
Result = SLICE([1, 2, 3, 4, 5], 2)
// Result: [3, 4, 5]
```

### First N Elements

```expression
// Get first 3 elements
TopThree = SLICE(SortedScores, 0, 3)
```

### Pagination

```expression
// Get page of results
PageSize = 10
PageStart = (PageNumber - 1) * PageSize
PageData = SLICE(AllData, PageStart, PageStart + PageSize)
```

## Use Cases

- **Pagination**: Extract page of results
- **Top N**: Get first N elements
- **Data sampling**: Extract subset of data
- **Range selection**: Select specific range

## Related Functions

- [sortset](./sortset.md) - Sort before slicing
- [flatten](./flatten.md) - Flatten before slicing
- [count](./count.md) - Get array length

## Notes

- Start index is 0-based
- End index is exclusive
- Negative indices may not be supported
- Does not modify original array
- Uses JavaScript array slice behavior
