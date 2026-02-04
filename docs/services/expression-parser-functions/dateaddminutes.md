# dateaddminutes

Adds a specified number of minutes to a date.

## Syntax

```
dateaddminutes(date, minutes)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `minutes` | Number | Number of minutes to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddminutes` function adds a specified number of minutes to a date and returns the new date/time. Use negative numbers to subtract minutes.

## Examples

### Basic Usage

```expression
Result = DATEADDMINUTES("2025-04-01T10:30:00.000Z", 45)
// Result: "2025-04-01T11:15:00.000Z"
```

### Subtracting Minutes

```expression
Result = DATEADDMINUTES("2025-04-01T10:30:00.000Z", -15)
// Result: "2025-04-01T10:15:00.000Z"
```

### Meeting Duration

```expression
MeetingEnd = DATEADDMINUTES(MeetingStart, Duration)
```

### Buffer Time

```expression
ArrivalTime = DATEADDMINUTES(AppointmentTime, -15)
```

## Use Cases

- **Meeting scheduling**: Calculate end times
- **Timers**: Add time intervals
- **Reminders**: Calculate reminder times
- **Transit**: Estimated arrival times

## Related Functions

- [dateaddseconds](./dateaddseconds.md) - Add seconds
- [dateaddhours](./dateaddhours.md) - Add hours
- [dateminutedifference](./dateminutedifference.md) - Calculate minute difference

## Notes

- Returns ISO 8601 formatted string
- Handles hour/day boundaries
- Negative values subtract minutes
- Uses the Dates service internally
