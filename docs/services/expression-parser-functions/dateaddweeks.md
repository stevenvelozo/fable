# dateaddweeks

Adds a specified number of weeks to a date.

## Syntax

```
dateaddweeks(date, weeks)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `weeks` | Number | Number of weeks to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddweeks` function adds a specified number of weeks to a date and returns the new date. Use negative numbers to subtract weeks.

## Examples

### Basic Usage

```expression
Result = DATEADDWEEKS("2025-04-01T00:00:00.000Z", 2)
// Result: "2025-04-15T00:00:00.000Z"
```

### Subtracting Weeks

```expression
Result = DATEADDWEEKS("2025-04-15T00:00:00.000Z", -1)
// Result: "2025-04-08T00:00:00.000Z"
```

### Sprint Planning

```expression
SprintEndDate = DATEADDWEEKS(SprintStartDate, 2)
```

### Weekly Schedule

```expression
NextMeeting = DATEADDWEEKS(LastMeeting, 1)
```

## Use Cases

- **Sprint planning**: Calculate sprint dates
- **Scheduling**: Weekly recurring events
- **Project management**: Week-based milestones
- **Payroll**: Bi-weekly pay periods

## Related Functions

- [dateadddays](./dateadddays.md) - Add days
- [dateaddmonths](./dateaddmonths.md) - Add months
- [dateweekdifference](./dateweekdifference.md) - Calculate week difference
- [datefromparts](./datefromparts.md) - Create date from parts

## Notes

- Returns ISO 8601 formatted string
- One week equals 7 days
- Negative values subtract weeks
- Uses the Dates service internally
