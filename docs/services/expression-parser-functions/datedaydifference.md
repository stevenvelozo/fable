# datedaydifference

Calculates the difference between two dates in days.

## Syntax

```
datedaydifference(startDate, endDate)
datedaydifference(startDate, endDate, requireEndDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |
| `requireEndDate` | Number | If 1, returns NaN when endDate is missing |

## Returns

String - The number of days between the two dates. Negative if endDate is before startDate.

## Description

The `datedaydifference` function calculates how many days have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = datedaydifference("2023-08-10T05:00:00.000Z", "2023-08-11T05:00:00.000Z")
// Result: "1"
```

### With Variables

```expression
Result = datedaydifference(StartDate, EndDate)
// With StartDate = "2023-08-10T05:00:00.000Z", EndDate = "2023-08-11T05:00:00.000Z"
// Result: "1"
```

### Negative Result

```expression
// When end date is before start date
Result = datedaydifference("2023-08-15T05:00:00.000Z", "2023-08-10T05:00:00.000Z")
// Result: "-5"
```

### Requiring End Date

```expression
// Returns NaN if end date is missing when required
Result = datedaydifference(StartDate, EndDate, 1)
// With EndDate undefined
// Result: "NaN"
```

## Use Cases

- **Age calculation**: Days since birth or event
- **Project tracking**: Days until deadline
- **Billing**: Calculate billing periods
- **SLA monitoring**: Days since ticket opened

## Related Functions

- [datemilliseconddifference](./datemilliseconddifference.md) - Difference in milliseconds
- [dateseconddifference](./dateseconddifference.md) - Difference in seconds
- [dateminutedifference](./dateminutedifference.md) - Difference in minutes
- [datehourdifference](./datehourdifference.md) - Difference in hours
- [dateweekdifference](./dateweekdifference.md) - Difference in weeks
- [datemonthdifference](./datemonthdifference.md) - Difference in months
- [dateyeardifference](./dateyeardifference.md) - Difference in years
- [dateadddays](./dateadddays.md) - Add days to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Uses the Dates service internally
