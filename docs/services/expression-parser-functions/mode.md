# mode

Returns the most frequently occurring value in a dataset.

## Syntax

```
mode(value1, value2, ...)
mode(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Number(s) | Individual numbers or an array of numbers |

## Returns

String - The value that appears most frequently.

## Description

The `mode` function finds and returns the most frequently occurring value in a dataset. If multiple values have the same highest frequency, it returns one of them.

## Examples

### Basic Usage

```expression
Result = MODE(1, 2, 2, 3, 3, 3, 4)
// Result: "3" (appears 3 times)
```

### With Array

```expression
// Find most common value
MostCommon = MODE(AppData.Ratings)
```

### Survey Data

```expression
// Find most selected option
PopularChoice = MODE(FLATTEN(AppData.Survey.response))
```

## Use Cases

- **Survey analysis**: Find most common response
- **Quality control**: Identify most frequent measurement
- **Market research**: Most popular choice
- **Statistics**: Central tendency analysis

## Related Functions

- [median](./median.md) - Middle value
- [avg](./avg.md) - Arithmetic mean
- [distributionhistogram](./distributionhistogram.md) - Full frequency distribution

## Notes

- Returns result as string
- Works with the Math service's `modePrecise` method
- For multimodal datasets, returns one of the modes
