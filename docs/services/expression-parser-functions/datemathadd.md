# datemathadd

Generic date math function for adding time units to a date.

## Syntax

```
datemathadd(date, amount, unit)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `amount` | Number | Amount to add (can be negative) |
| `unit` | String | Time unit ('days', 'months', 'years', etc.) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `datemathadd` function provides a generic way to add various time units to a date. This is an alternative to the specific functions like `dateadddays`, `dateaddmonths`, etc.

## Examples

### Add Days

```expression
Result = DATEMATHADD("2025-04-01T00:00:00.000Z", 10, "days")
// Result: "2025-04-11T00:00:00.000Z"
```

### Add Months

```expression
Result = DATEMATHADD("2025-04-01T00:00:00.000Z", 3, "months")
// Result: "2025-07-01T00:00:00.000Z"
```

### Subtract Years

```expression
Result = DATEMATHADD("2025-04-01T00:00:00.000Z", -5, "years")
// Result: "2020-04-01T00:00:00.000Z"
```

### With Variable Unit

```expression
NewDate = DATEMATHADD(StartDate, Amount, TimeUnit)
```

## Use Cases

- **Dynamic date math**: Unit specified at runtime
- **Generic calculations**: Flexible time operations
- **Configuration-based**: Configurable time adjustments

## Related Functions

- [dateadddays](./dateadddays.md) - Specific day addition
- [dateaddmonths](./dateaddmonths.md) - Specific month addition
- [dateaddyears](./dateaddyears.md) - Specific year addition

## Notes

- Supports various time units
- Negative values subtract
- Uses the Dates service internally
