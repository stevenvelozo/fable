# datemonthdifference

Calculates the difference between two dates in months.

## Syntax

```
datemonthdifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of months between the two dates.

## Description

The `datemonthdifference` function calculates how many months have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATEMONTHDIFFERENCE("2025-01-15T00:00:00.000Z", "2025-04-15T00:00:00.000Z")
// Result: "3"
```

### Negative Result

```expression
Result = DATEMONTHDIFFERENCE("2025-06-01T00:00:00.000Z", "2025-01-01T00:00:00.000Z")
// Result: "-5"
```

### Subscription Length

```expression
MonthsSubscribed = DATEMONTHDIFFERENCE(SubscriptionStart, Today)
```

## Use Cases

- **Subscriptions**: Calculate subscription duration
- **Billing**: Monthly billing periods
- **Age**: Age in months
- **Project tracking**: Project duration

## Related Functions

- [datedaydifference](./datedaydifference.md) - Difference in days
- [dateweekdifference](./dateweekdifference.md) - Difference in weeks
- [dateyeardifference](./dateyeardifference.md) - Difference in years
- [dateaddmonths](./dateaddmonths.md) - Add months to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Uses the Dates service internally
