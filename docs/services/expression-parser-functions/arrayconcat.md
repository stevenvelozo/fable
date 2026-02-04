# arrayconcat

Concatenates multiple arrays into one.

## Syntax

```
arrayconcat(array1, array2, ...)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrays` | Array(s) | Arrays to concatenate |

## Returns

Array - Combined array with elements from all inputs.

## Description

The `arrayconcat` function combines multiple arrays into a single array by appending them in order.

## Examples

### Basic Usage

```expression
Result = ARRAYCONCAT([1, 2], [3, 4], [5, 6])
// Result: [1, 2, 3, 4, 5, 6]
```

### Two Arrays

```expression
Combined = ARRAYCONCAT(FirstHalf, SecondHalf)
```

### Multiple Sources

```expression
AllData = ARRAYCONCAT(Source1, Source2, Source3)
```

## Use Cases

- **Data merging**: Combine multiple arrays
- **Report building**: Aggregate data sections
- **Collection**: Gather from multiple sources
- **Batch processing**: Combine batches

## Related Functions

- [setconcatenate](./setconcatenate.md) - Concatenate two sets
- [flatten](./flatten.md) - Flatten nested arrays
- [join](./join.md) - Join as string

## Notes

- Accepts multiple arrays
- Order is preserved
- Does not remove duplicates
- Uses the Math service's `arrayConcat` method
