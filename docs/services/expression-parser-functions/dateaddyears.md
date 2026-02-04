# dateaddyears

Adds a specified number of years to a date.

## Syntax

```
dateaddyears(date, years)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `years` | Number | Number of years to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddyears` function adds a specified number of years to a date and returns the new date. Use negative numbers to subtract years.

## Examples

### Basic Usage

```expression
Result = DATEADDYEARS("2025-04-15T00:00:00.000Z", 5)
// Result: "2030-04-15T00:00:00.000Z"
```

### Subtracting Years

```expression
Result = DATEADDYEARS("2025-04-15T00:00:00.000Z", -10)
// Result: "2015-04-15T00:00:00.000Z"
```

### With Variables

```expression
ExpirationDate = DATEADDYEARS(IssueDate, ValidityPeriod)
```

### Age Calculation

```expression
// Calculate future age date
FutureDate = DATEADDYEARS(BirthDate, 18)
```

## Use Cases

- **Contracts**: Multi-year contract expiration
- **Warranties**: Long-term warranty dates
- **Planning**: Long-term projections
- **Legal**: Statute of limitations

## Related Functions

- [dateadddays](./dateadddays.md) - Add days
- [dateaddmonths](./dateaddmonths.md) - Add months
- [dateyeardifference](./dateyeardifference.md) - Calculate year difference
- [datefromparts](./datefromparts.md) - Create date from parts

## Notes

- Returns ISO 8601 formatted string
- Handles leap years appropriately
- Negative values subtract years
- Uses the Dates service internally
