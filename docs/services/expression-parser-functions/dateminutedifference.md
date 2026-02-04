# dateminutedifference

Calculates the difference between two dates in minutes.

## Syntax

```
dateminutedifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of minutes between the two dates.

## Description

The `dateminutedifference` function calculates how many minutes have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATEMINUTEDIFFERENCE("2025-04-01T10:00:00.000Z", "2025-04-01T10:45:00.000Z")
// Result: "45"
```

### Meeting Duration

```expression
MeetingLength = DATEMINUTEDIFFERENCE(MeetingStart, MeetingEnd)
```

### Time Until Event

```expression
MinutesUntilStart = DATEMINUTEDIFFERENCE(Now, EventStart)
```

## Use Cases

- **Meeting tracking**: Duration calculations
- **Response time**: Minutes to respond
- **Scheduling**: Time intervals
- **Performance**: Duration metrics

## Related Functions

- [dateseconddifference](./dateseconddifference.md) - Difference in seconds
- [datehourdifference](./datehourdifference.md) - Difference in hours
- [dateaddminutes](./dateaddminutes.md) - Add minutes to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Uses the Dates service internally
