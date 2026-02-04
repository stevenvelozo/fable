# datefromparts

Creates a date from individual year, month, day (and optionally time) components.

## Syntax

```
datefromparts(year, month, day)
datefromparts(year, month, day, hour, minute, second, millisecond)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `year` | Number | Four-digit year |
| `month` | Number | Month (1-12) |
| `day` | Number | Day of month (1-31) |
| `hour` | Number | Hour (0-23), optional |
| `minute` | Number | Minute (0-59), optional |
| `second` | Number | Second (0-59), optional |
| `millisecond` | Number | Millisecond (0-999), optional |

## Returns

String - An ISO 8601 formatted date string.

## Description

The `datefromparts` function constructs a date from individual components. This is useful when you have date parts stored separately or need to build a specific date programmatically.

## Examples

### Date Only

```expression
DateFromPartsExample = DATEFROMPARTS(2025, 4, 1)
// Result: "2025-04-01T00:00:00.000Z"
```

### With Time Components

```expression
DateFromPartsExample = DATEFROMPARTS(2025, 4, 1, 13, 03, 51, 761)
// Result: "2025-04-01T13:03:51.761Z"
```

### Combined with Date Math

```expression
// Create a date then add days
FutureDate = DATEADDDAYS(DATEFROMPARTS(2025, 4, 1, 13, 03, 51, 761), 87)
// Result: "2025-06-27T13:03:51.761Z"
```

### With Variables

```expression
EventDate = DATEFROMPARTS(EventYear, EventMonth, EventDay)
```

## Use Cases

- **Form processing**: Build dates from separate input fields
- **Report generation**: Create specific dates for reports
- **Data migration**: Convert separate date columns to dates
- **Scheduling**: Construct dates for calendar events

## Related Functions

- [dateadddays](./dateadddays.md) - Add days to a date
- [dateaddmonths](./dateaddmonths.md) - Add months to a date
- [dateaddyears](./dateaddyears.md) - Add years to a date
- [datedaydifference](./datedaydifference.md) - Calculate day difference

## Notes

- Month is 1-based (January = 1, December = 12)
- Returns ISO 8601 formatted string (UTC)
- Time components default to 0 if not provided
- Uses the Dates service internally
