# tofixed

Formats a number with a specified number of decimal places.

## Syntax

```
tofixed(value, decimalPlaces)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number | The number to format |
| `decimalPlaces` | Number | Number of decimal places to display |

## Returns

String - The number formatted with the specified decimal places.

## Description

The `tofixed` function formats a number to a fixed number of decimal places. This is useful for displaying currency, percentages, and other formatted numeric values.

## Examples

### Basic Usage

```expression
Result = TOFIXED(3.14159, 2)
// Result: "3.14"
```

### Currency Formatting

```expression
Price = TOFIXED(19.9, 2)
// Result: "19.90"
```

### Rounding

```expression
Result = TOFIXED(2.567, 1)
// Result: "2.6"
```

### With Calculations

```expression
// Format a calculated percentage
FormattedPercent = TOFIXED(PERCENT(Completed, Total) * 100, 1)
```

## Use Cases

- **Currency display**: Format prices and amounts
- **Percentage display**: Format percentages with precision
- **Scientific data**: Consistent decimal places
- **Reports**: Standardized number formatting

## Related Functions

- [round](./round.md) - Round to nearest integer
- [floor](./floor.md) - Round down
- [ceil](./ceil.md) - Round up
- [percent](./percent.md) - Calculate percentages

## Notes

- Always returns specified number of decimal places
- Pads with zeros if necessary (19.9 → "19.90")
- Uses the Math service's `toFixedPrecise` method
- Returns result as string
