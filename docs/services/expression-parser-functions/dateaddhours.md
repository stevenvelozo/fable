# dateaddhours

Adds a specified number of hours to a date.

## Syntax

```
dateaddhours(date, hours)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `hours` | Number | Number of hours to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddhours` function adds a specified number of hours to a date and returns the new date/time. Use negative numbers to subtract hours.

## Examples

### Basic Usage

```expression
Result = DATEADDHOURS("2025-04-01T10:00:00.000Z", 5)
// Result: "2025-04-01T15:00:00.000Z"
```

### Crossing Day Boundary

```expression
Result = DATEADDHOURS("2025-04-01T22:00:00.000Z", 4)
// Result: "2025-04-02T02:00:00.000Z"
```

### Subtracting Hours

```expression
Result = DATEADDHOURS("2025-04-01T10:00:00.000Z", -3)
// Result: "2025-04-01T07:00:00.000Z"
```

### Deadline Calculation

```expression
DeadlineTime = DATEADDHOURS(SubmissionStart, TimeLimit)
```

## Use Cases

- **SLA tracking**: Hours until deadline
- **Scheduling**: Appointment times
- **Time zones**: Hour offset calculations
- **Shift scheduling**: Work shift end times

## Related Functions

- [dateaddminutes](./dateaddminutes.md) - Add minutes
- [dateaddseconds](./dateaddseconds.md) - Add seconds
- [dateadddays](./dateadddays.md) - Add days
- [datehourdifference](./datehourdifference.md) - Calculate hour difference

## Notes

- Returns ISO 8601 formatted string
- Handles day/month/year boundaries
- Negative values subtract hours
- Uses the Dates service internally
