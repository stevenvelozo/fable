# dateaddmonths

Adds a specified number of months to a date.

## Syntax

```
dateaddmonths(date, months)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `months` | Number | Number of months to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddmonths` function adds a specified number of months to a date and returns the new date. Use negative numbers to subtract months.

## Examples

### Basic Usage

```expression
Result = DATEADDMONTHS("2025-01-15T00:00:00.000Z", 3)
// Result: "2025-04-15T00:00:00.000Z"
```

### Subtracting Months

```expression
Result = DATEADDMONTHS("2025-06-15T00:00:00.000Z", -2)
// Result: "2025-04-15T00:00:00.000Z"
```

### With Variables

```expression
RenewalDate = DATEADDMONTHS(SubscriptionStart, SubscriptionLength)
```

### Quarterly Calculations

```expression
NextQuarter = DATEADDMONTHS(CurrentDate, 3)
```

## Use Cases

- **Subscriptions**: Calculate renewal dates
- **Billing cycles**: Monthly billing dates
- **Project planning**: Monthly milestones
- **Financial reporting**: Period end dates

## Related Functions

- [dateadddays](./dateadddays.md) - Add days
- [dateaddweeks](./dateaddweeks.md) - Add weeks
- [dateaddyears](./dateaddyears.md) - Add years
- [datemonthdifference](./datemonthdifference.md) - Calculate month difference
- [datefromparts](./datefromparts.md) - Create date from parts

## Notes

- Returns ISO 8601 formatted string
- Handles year boundaries automatically
- Negative values subtract months
- Uses the Dates service internally
