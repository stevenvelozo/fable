# dateweekdifference

Calculates the difference between two dates in weeks.

## Syntax

```
dateweekdifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of weeks between the two dates.

## Description

The `dateweekdifference` function calculates how many weeks have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATEWEEKDIFFERENCE("2025-01-01T00:00:00.000Z", "2025-01-15T00:00:00.000Z")
// Result: "2"
```

### Sprint Tracking

```expression
SprintsCompleted = DATEWEEKDIFFERENCE(ProjectStart, Today) / 2
```

### Weeks Until Deadline

```expression
WeeksRemaining = DATEWEEKDIFFERENCE(Today, Deadline)
```

## Use Cases

- **Sprint planning**: Track sprint weeks
- **Project management**: Weekly progress
- **Scheduling**: Week-based planning
- **Reporting**: Weekly reports

## Related Functions

- [datedaydifference](./datedaydifference.md) - Difference in days
- [datemonthdifference](./datemonthdifference.md) - Difference in months
- [dateaddweeks](./dateaddweeks.md) - Add weeks to a date

## Notes

- Uses ISO 8601 date format
- One week equals 7 days
- Result can be negative
- Uses the Dates service internally
