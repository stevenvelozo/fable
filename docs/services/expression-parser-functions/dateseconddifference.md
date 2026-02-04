# dateseconddifference

Calculates the difference between two dates in seconds.

## Syntax

```
dateseconddifference(startDate, endDate)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | String | Start date (ISO 8601 format) |
| `endDate` | String | End date (ISO 8601 format) |

## Returns

String - The number of seconds between the two dates.

## Description

The `dateseconddifference` function calculates how many seconds have elapsed between two dates. The result is positive when endDate is after startDate, and negative otherwise.

## Examples

### Basic Usage

```expression
Result = DATESECONDDIFFERENCE("2025-04-01T10:00:00.000Z", "2025-04-01T10:00:30.000Z")
// Result: "30"
```

### Response Time

```expression
ResponseTime = DATESECONDDIFFERENCE(RequestSent, ResponseReceived)
```

### Timeout Check

```expression
SecondsSinceStart = DATESECONDDIFFERENCE(ProcessStart, Now)
```

## Use Cases

- **Performance measurement**: Response times
- **Timeouts**: Check elapsed time
- **Rate limiting**: Time between requests
- **Logging**: Precise durations

## Related Functions

- [datemilliseconddifference](./datemilliseconddifference.md) - Difference in milliseconds
- [dateminutedifference](./dateminutedifference.md) - Difference in minutes
- [dateaddseconds](./dateaddseconds.md) - Add seconds to a date

## Notes

- Uses ISO 8601 date format
- Result can be negative
- Uses the Dates service internally
