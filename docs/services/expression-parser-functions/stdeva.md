# stdeva

Calculates standard deviation including text and boolean values.

## Syntax

```
stdeva(value1, value2, ...)
stdeva(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Any | Values including numbers, text, and booleans |

## Returns

String - The standard deviation including converted text/boolean values.

## Description

The `stdeva` function calculates sample standard deviation while treating text as 0 and boolean TRUE as 1, FALSE as 0. This is similar to Excel's STDEVA function.

## Examples

### Basic Usage

```expression
Result = STDEVA(1, 2, true, false, "text")
// Text = 0, true = 1, false = 0
```

### With Mixed Data

```expression
StdDev = STDEVA(MixedDataArray)
```

## Use Cases

- **Mixed data**: Standard deviation with non-numeric values
- **Spreadsheet compatibility**: Excel-like behavior
- **Survey data**: Handle mixed responses

## Related Functions

- [stdev](./stdev.md) - Numeric-only standard deviation
- [stdevp](./stdevp.md) - Population standard deviation
- [vara](./vara.md) - Variance with text/boolean

## Notes

- Text values treated as 0
- TRUE = 1, FALSE = 0
- Uses sample formula (n-1)
- Uses the Math service's `stdevaPrecise` method
