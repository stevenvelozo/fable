# datemilliseconddifference

Calculates the difference between two dates in milliseconds.

## Syntax

```
datemilliseconddifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of milliseconds between the two dates.

## Description

The `datemilliseconddifference` function calculates how many milliseconds have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATEMILLISECONDDIFFERENCE("2025-04-01T10:00:00.000Z", "2025-04-01T10:00:00.500Z")
// Result: "500"
```

### Performance Measurement

```expression
ExecutionTime = DATEMILLISECONDDIFFERENCE(StartTime, EndTime)
```

### Precise Timing

```expression
LatencyMs = DATEMILLISECONDDIFFERENCE(RequestTime, ResponseTime)
```

## Use Cases

- **Performance profiling**: Precise execution times
- **Latency measurement**: Network latency
- **Animation timing**: Frame durations
- **Benchmarking**: Comparing execution speeds

## Related Functions

- [dateseconddifference](./dateseconddifference.md) - Difference in seconds
- [dateaddmilliseconds](./dateaddmilliseconds.md) - Add milliseconds to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Highest precision time difference
- Uses the Dates service internally
