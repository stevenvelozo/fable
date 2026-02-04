# dateyeardifference

Calculates the difference between two dates in years.

## Syntax

```
dateyeardifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of years between the two dates.

## Description

The `dateyeardifference` function calculates how many years have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATEYEARDIFFERENCE("2020-01-01T00:00:00.000Z", "2025-01-01T00:00:00.000Z")
// Result: "5"
```

### Age Calculation

```expression
Age = DATEYEARDIFFERENCE(BirthDate, Today)
```

### Contract Duration

```expression
ContractYears = DATEYEARDIFFERENCE(StartDate, EndDate)
```

## Use Cases

- **Age calculation**: Calculate age in years
- **Anniversary**: Years since event
- **Contracts**: Multi-year contract terms
- **Experience**: Years of service

## Related Functions

- [datedaydifference](./datedaydifference.md) - Difference in days
- [datemonthdifference](./datemonthdifference.md) - Difference in months
- [dateaddyears](./dateaddyears.md) - Add years to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Uses the Dates service internally
