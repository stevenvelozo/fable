# dateadddays

Adds a specified number of days to a date.

## Syntax

```
dateadddays(date, days)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `days` | Number | Number of days to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateadddays` function adds a specified number of days to a date and returns the new date. Use negative numbers to subtract days.

## Examples

### Basic Usage

```expression
Result = DATEADDDAYS("2025-04-01T00:00:00.000Z", 10)
// Result: "2025-04-11T00:00:00.000Z"
```

### Adding Many Days

```expression
Result = DATEADDDAYS(DATEFROMPARTS(2025, 4, 1, 13, 03, 51, 761), 87)
// Result: "2025-06-27T13:03:51.761Z"
```

### Subtracting Days

```expression
Result = DATEADDDAYS("2025-04-15T00:00:00.000Z", -10)
// Result: "2025-04-05T00:00:00.000Z"
```

### With Variables

```expression
DueDate = DATEADDDAYS(OrderDate, ShippingDays)
```

## Use Cases

- **Due date calculation**: Add business days to start date
- **Scheduling**: Calculate future appointments
- **Aging reports**: Determine dates in past or future
- **Date navigation**: Moving through calendars

## Related Functions

- [dateaddmilliseconds](./dateaddmilliseconds.md) - Add milliseconds
- [dateaddseconds](./dateaddseconds.md) - Add seconds
- [dateaddminutes](./dateaddminutes.md) - Add minutes
- [dateaddhours](./dateaddhours.md) - Add hours
- [dateaddweeks](./dateaddweeks.md) - Add weeks
- [dateaddmonths](./dateaddmonths.md) - Add months
- [dateaddyears](./dateaddyears.md) - Add years
- [datedaydifference](./datedaydifference.md) - Calculate day difference
- [datefromparts](./datefromparts.md) - Create date from parts

## Notes

- Returns ISO 8601 formatted string
- Handles month/year boundaries automatically
- Negative values subtract days
- Uses the Dates service internally
