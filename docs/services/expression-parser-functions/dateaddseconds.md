# dateaddseconds

Adds a specified number of seconds to a date.

## Syntax

```
dateaddseconds(date, seconds)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `seconds` | Number | Number of seconds to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddseconds` function adds a specified number of seconds to a date and returns the new date/time. Use negative numbers to subtract seconds.

## Examples

### Basic Usage

```expression
Result = DATEADDSECONDS("2025-04-01T10:30:00.000Z", 30)
// Result: "2025-04-01T10:30:30.000Z"
```

### Subtracting Seconds

```expression
Result = DATEADDSECONDS("2025-04-01T10:30:30.000Z", -15)
// Result: "2025-04-01T10:30:15.000Z"
```

### Timeout Calculation

```expression
TimeoutExpiry = DATEADDSECONDS(RequestTime, TimeoutSeconds)
```

## Use Cases

- **Timeouts**: Calculate expiry times
- **Animations**: Timing calculations
- **Performance**: Measure durations
- **Precision timing**: Second-level calculations

## Related Functions

- [dateaddmilliseconds](./dateaddmilliseconds.md) - Add milliseconds
- [dateaddminutes](./dateaddminutes.md) - Add minutes
- [dateseconddifference](./dateseconddifference.md) - Calculate second difference

## Notes

- Returns ISO 8601 formatted string
- Handles minute/hour boundaries
- Negative values subtract seconds
- Uses the Dates service internally
