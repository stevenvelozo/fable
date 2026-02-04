# count

Returns the count of elements in an array or set.

## Syntax

```
count(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array to count elements from |

## Returns

String - The number of elements in the array.

## Description

The `count` function returns the number of elements in an array. This is useful for determining the size of datasets or validating data.

## Examples

### Basic Usage

```expression
Result = COUNT([1, 2, 3, 4, 5])
// Result: "5"
```

### With Data Path

```expression
// Count records in a dataset
TotalCities = COUNT(AppData.Cities)
```

### Conditional Counting

```expression
// Use with filtered data
ActiveUsers = COUNT(FLATTEN(AppData.Users.active))
```

### Validation

```expression
// Verify expected count
IsValid = COUNT(Records) == ExpectedCount
```

## Use Cases

- **Data validation**: Verify record counts
- **Statistics**: Determine sample size
- **Pagination**: Calculate total pages
- **Reporting**: Show record counts

## Related Functions

- [countset](./countset.md) - Count elements in a set
- [countsetelements](./countsetelements.md) - Count unique elements
- [sum](./sum.md) - Sum values instead of counting
- [avg](./avg.md) - Average (uses count internally)

## Notes

- Returns result as string
- Works with the Math service's `count` method
- Returns "0" for empty arrays
