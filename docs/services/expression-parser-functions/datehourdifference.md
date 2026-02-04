# datehourdifference

Calculates the difference between two dates in hours.

## Syntax

```
datehourdifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of hours between the two dates.

## Description

The `datehourdifference` function calculates how many hours have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATEHOURDIFFERENCE("2025-04-01T08:00:00.000Z", "2025-04-01T17:00:00.000Z")
// Result: "9"
```

### SLA Tracking

```expression
HoursSinceCreated = DATEHOURDIFFERENCE(TicketCreated, Now)
```

### Work Hours

```expression
HoursWorked = DATEHOURDIFFERENCE(ClockIn, ClockOut)
```

## Use Cases

- **SLA monitoring**: Hours since ticket opened
- **Time tracking**: Work hours calculation
- **Scheduling**: Hours until deadline
- **Billing**: Hourly billing calculations

## Related Functions

- [dateminutedifference](./dateminutedifference.md) - Difference in minutes
- [datedaydifference](./datedaydifference.md) - Difference in days
- [dateaddhours](./dateaddhours.md) - Add hours to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Uses the Dates service internally
