# dateaddmilliseconds

Adds a specified number of milliseconds to a date.

## Syntax

```
dateaddmilliseconds(date, milliseconds)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | String | Starting date (ISO 8601 format) |
| `milliseconds` | Number | Number of milliseconds to add (can be negative) |

## Returns

String - The resulting date in ISO 8601 format.

## Description

The `dateaddmilliseconds` function adds a specified number of milliseconds to a date and returns the new date/time. Use negative numbers to subtract milliseconds.

## Examples

### Basic Usage

```expression
Result = DATEADDMILLISECONDS("2025-04-01T10:30:00.000Z", 500)
// Result: "2025-04-01T10:30:00.500Z"
```

### Subtracting Milliseconds

```expression
Result = DATEADDMILLISECONDS("2025-04-01T10:30:00.500Z", -250)
// Result: "2025-04-01T10:30:00.250Z"
```

### Precise Timing

```expression
AnimationFrame = DATEADDMILLISECONDS(StartTime, FrameDelay)
```

## Use Cases

- **High precision timing**: Millisecond-level calculations
- **Animation**: Frame timing
- **Performance measurement**: Precise durations
- **Logging**: Precise timestamps

## Related Functions

- [dateaddseconds](./dateaddseconds.md) - Add seconds
- [datemilliseconddifference](./datemilliseconddifference.md) - Calculate millisecond difference

## Notes

- Returns ISO 8601 formatted string
- Handles second/minute boundaries
- Negative values subtract milliseconds
- Uses the Dates service internally
