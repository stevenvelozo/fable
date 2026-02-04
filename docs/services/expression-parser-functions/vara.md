# vara

Calculates variance including text and boolean values.

## Syntax

```
vara(value1, value2, ...)
vara(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Any | Values including numbers, text, and booleans |

## Returns

String - The variance including converted text/boolean values.

## Description

The `vara` function calculates sample variance while treating text as 0 and boolean TRUE as 1, FALSE as 0. This is similar to Excel's VARA function.

## Examples

### Basic Usage

```expression
Result = VARA(1, 2, true, false, "text")
// Text = 0, true = 1, false = 0
```

### With Mixed Data

```expression
Variance = VARA(MixedDataArray)
```

## Use Cases

- **Mixed data**: Variance with non-numeric values
- **Spreadsheet compatibility**: Excel-like behavior
- **Survey data**: Handle mixed responses

## Related Functions

- [var](./var.md) - Numeric-only variance
- [varp](./varp.md) - Population variance
- [stdeva](./stdeva.md) - Standard deviation with text/boolean

## Notes

- Text values treated as 0
- TRUE = 1, FALSE = 0
- Uses sample variance formula (n-1)
- Uses the Math service's `varaPrecise` method
