# mean

Calculates the arithmetic mean (average) of values.

## Syntax

```
mean(value1, value2, ...)
mean(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Individual numbers or an array of numbers |

## Returns

String - The arithmetic mean.

## Description

The `mean` function calculates the arithmetic mean (average) of a set of numbers. This is an alias for the `avg` function.

## Examples

### Basic Usage

```expression
Result = MEAN(10, 20, 30, 40, 50)
// Result: "30"
```

### With Array

```expression
Average = MEAN(FLATTEN(AppData.Scores))
```

### Statistics

```expression
MeanValue = MEAN(DataSet)
```

## Use Cases

- **Statistics**: Central tendency
- **Analysis**: Average values
- **Reporting**: Mean calculations

## Related Functions

- [avg](./avg.md) - Same function (alias)
- [median](./median.md) - Middle value
- [mode](./mode.md) - Most frequent value

## Notes

- Alias for `avg` function
- Uses the Math service's `meanPrecise` method
- Returns result as string for precision
