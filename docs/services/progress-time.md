# ProgressTime Service

The ProgressTime service provides named timestamp creation and delta measurement for tracking execution timing.

## Access

```javascript
// Auto-instantiated, available directly
fable.ProgressTime
```

## Basic Timing

### Create a Timestamp

```javascript
// Create a 'Default' timestamp (no hash specified)
fable.ProgressTime.createTimeStamp();

// Create a named timestamp
fable.ProgressTime.createTimeStamp('MyOperation');
```

### Get Elapsed Time (Delta)

Measure milliseconds elapsed since a timestamp was created:

```javascript
fable.ProgressTime.createTimeStamp();

// ... do some work ...

const elapsed = fable.ProgressTime.getTimeStampDelta();
// Returns milliseconds since 'Default' timestamp was created

// With a named timestamp
fable.ProgressTime.createTimeStamp('DatabaseQuery');
// ... query ...
const queryTime = fable.ProgressTime.getTimeStampDelta('DatabaseQuery');
// Returns milliseconds since 'DatabaseQuery' was created
```

Returns `-1` if the timestamp doesn't exist.

### Get Duration Between Two Timestamps

```javascript
fable.ProgressTime.createTimeStamp('Start');

// ... some time passes ...

fable.ProgressTime.createTimeStamp('End');

const duration = fable.ProgressTime.getDurationBetweenTimestamps('Start', 'End');
// Returns milliseconds between the two timestamps
```

## Timestamp Management

### Get Timestamp Value

```javascript
const value = fable.ProgressTime.getTimeStampValue('MyOperation');
// Returns the raw millisecond timestamp, or -1 if not found
```

### Remove a Timestamp

```javascript
fable.ProgressTime.removeTimeStamp('MyOperation');
// Returns true if removed, false if it didn't exist
```

### Update a Timestamp

```javascript
fable.ProgressTime.updateTimeStampValue('MyOperation');
// Updates to current time

fable.ProgressTime.updateTimeStampValue('MyOperation', 1700000000000);
// Updates to a specific millisecond value
```

### Access All Timestamps

```javascript
fable.ProgressTime.timeStamps
// { Default: 1700000000000, MyOperation: 1700000001000, ... }
```

## Formatted Output

### Get Delta Message

```javascript
const message = fable.ProgressTime.getTimeStampDeltaMessage();
// Returns something like: 'Elapsed for Default:  2s 150ms'

const customMessage = fable.ProgressTime.getTimeStampDeltaMessage('DatabaseQuery', 'DB query took');
// Returns something like: 'DB query took 523ms'
```

### Log Delta

```javascript
fable.ProgressTime.logTimeStampDelta();
// Logs via fable.log.info: 'Elapsed for Default:  2s 150ms'

fable.ProgressTime.logTimeStampDelta('DatabaseQuery', 'DB query completed in');
// Logs: 'DB query completed in 523ms'
```

### Format Duration

```javascript
fable.ProgressTime.formatTimeDuration(3661150);
// Returns '1h 1m 1s 150ms'

fable.ProgressTime.formatTimeDuration(523);
// Returns '523ms'

fable.ProgressTime.formatTimeDuration(65000);
// Returns '1m 5s 0ms'
```

## Use Cases

### Multi-Phase Operations

```javascript
fable.ProgressTime.createTimeStamp('Total');
fable.ProgressTime.createTimeStamp('Phase1');

// ... Phase 1 work ...

fable.ProgressTime.logTimeStampDelta('Phase1', 'Phase 1');
fable.ProgressTime.createTimeStamp('Phase2');

// ... Phase 2 work ...

fable.ProgressTime.logTimeStampDelta('Phase2', 'Phase 2');
fable.ProgressTime.logTimeStampDelta('Total', 'Total time');
```

### Request Timing

```javascript
function timeRequest(name) {
    fable.ProgressTime.createTimeStamp(name);
    return () => {
        fable.ProgressTime.logTimeStampDelta(name, `Request ${name}`);
        fable.ProgressTime.removeTimeStamp(name);
    };
}

const done = timeRequest('api-call');
// ... do request ...
done();
// Logs: 'Request api-call  245ms'
```

## Notes

- Timestamps use `+new Date()` for millisecond precision
- The default hash is `'Default'` when no hash string is provided
- `getTimeStampDelta()` and `getTimeStampValue()` return `-1` when the requested hash doesn't exist
- Consider using ProgressTrackerSet for tracking multiple related operations with progress counts
