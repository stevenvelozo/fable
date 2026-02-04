# sortset

Sorts an array of values in ascending or descending order.

## Syntax

```
sortset(array)
sortset(array, descending)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array to sort |
| `descending` | Boolean | If true, sort in descending order (optional) |

## Returns

Array - The sorted array.

## Description

The `sortset` function sorts an array of values. By default, it sorts in ascending order. Pass `true` as the second parameter to sort in descending order.

## Examples

### Ascending Sort (Default)

```expression
Result = SORTSET([3, 1, 4, 1, 5, 9, 2, 6])
// Result: [1, 1, 2, 3, 4, 5, 6, 9]
```

### Descending Sort

```expression
Result = SORTSET([3, 1, 4, 1, 5, 9, 2, 6], true)
// Result: [9, 6, 5, 4, 3, 2, 1, 1]
```

### With Data

```expression
SortedScores = SORTSET(FLATTEN(AppData.Students.score), true)
// Highest to lowest scores
```

### Top N Values

```expression
TopThree = SLICE(SORTSET(Values, true), 0, 3)
```

## Use Cases

- **Rankings**: Create leaderboards
- **Analysis**: Sorted data examination
- **Selection**: Find top/bottom values
- **Display**: Ordered presentation

## Related Functions

- [sorthistogram](./sorthistogram.md) - Sort histogram by values
- [sorthistogrambykeys](./sorthistogrambykeys.md) - Sort histogram by keys
- [max](./max.md) - Find maximum value
- [min](./min.md) - Find minimum value
- [slice](./slice.md) - Extract portion after sorting

## Notes

- Returns new sorted array
- Original array unchanged
- Uses the Math service's `sortSet` method
