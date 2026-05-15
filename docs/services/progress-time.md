# ProgressTime Service

The ProgressTime service provides named timestamp creation and delta measurement for tracking execution timing.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

// Auto-instantiated, available directly
console.log('fable.ProgressTime:', typeof fable.ProgressTime);
```

## Basic Timing

### Create a Timestamp

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

// Create a 'Default' timestamp (no hash specified)
fable.ProgressTime.createTimeStamp();

// Create a named timestamp
fable.ProgressTime.createTimeStamp('MyOperation');

console.log('Timestamps:', Object.keys(fable.ProgressTime.timeStamps));
```

### Get Elapsed Time (Delta)

Measure milliseconds elapsed since a timestamp was created:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp();

// ... do some work ...
await new Promise(r => setTimeout(r, 10));

const elapsed = fable.ProgressTime.getTimeStampDelta();
console.log('elapsed since Default:', elapsed, 'ms');

// With a named timestamp
fable.ProgressTime.createTimeStamp('DatabaseQuery');
// ... query ...
await new Promise(r => setTimeout(r, 5));
const queryTime = fable.ProgressTime.getTimeStampDelta('DatabaseQuery');
console.log('queryTime:', queryTime, 'ms');
```

Returns `-1` if the timestamp doesn't exist.

### Get Duration Between Two Timestamps

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp('Start');

// ... some time passes ...
await new Promise(r => setTimeout(r, 25));

fable.ProgressTime.createTimeStamp('End');

const duration = fable.ProgressTime.getDurationBetweenTimestamps('Start', 'End');
console.log('Duration Start..End:', duration, 'ms');
```

## Timestamp Management

### Get Timestamp Value

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp('MyOperation');
const value = fable.ProgressTime.getTimeStampValue('MyOperation');
console.log('value:', value);
// Returns the raw millisecond timestamp, or -1 if not found
```

### Remove a Timestamp

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp('MyOperation');
console.log(fable.ProgressTime.removeTimeStamp('MyOperation'));
// Returns true if removed, false if it didn't exist
```

### Update a Timestamp

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp('MyOperation');
fable.ProgressTime.updateTimeStampValue('MyOperation');
console.log('After current-time update:', fable.ProgressTime.getTimeStampValue('MyOperation'));

fable.ProgressTime.updateTimeStampValue('MyOperation', 1700000000000);
console.log('After explicit update:',    fable.ProgressTime.getTimeStampValue('MyOperation'));
```

### Access All Timestamps

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp();
fable.ProgressTime.createTimeStamp('MyOperation');
console.log(fable.ProgressTime.timeStamps);
// { Default: 1700000000000, MyOperation: 1700000001000, ... }
```

## Formatted Output

### Get Delta Message

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp();
fable.ProgressTime.createTimeStamp('DatabaseQuery');
await new Promise(r => setTimeout(r, 10));

const message = fable.ProgressTime.getTimeStampDeltaMessage();
console.log(message);

const customMessage = fable.ProgressTime.getTimeStampDeltaMessage('DatabaseQuery', 'DB query took');
console.log(customMessage);
```

### Log Delta

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp();
fable.ProgressTime.createTimeStamp('DatabaseQuery');
await new Promise(r => setTimeout(r, 5));

fable.ProgressTime.logTimeStampDelta();
// Logs via fable.log.info: 'Elapsed for Default:  2s 150ms'

fable.ProgressTime.logTimeStampDelta('DatabaseQuery', 'DB query completed in');
// Logs: 'DB query completed in 523ms'
```

### Format Duration

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

console.log(fable.ProgressTime.formatTimeDuration(3661150));
// Returns '1h 1m 1s 150ms'

console.log(fable.ProgressTime.formatTimeDuration(523));
// Returns '523ms'

console.log(fable.ProgressTime.formatTimeDuration(65000));
// Returns '1m 5s 0ms'
```

## Use Cases

### Multi-Phase Operations

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

fable.ProgressTime.createTimeStamp('Total');
fable.ProgressTime.createTimeStamp('Phase1');

// ... Phase 1 work ...
await new Promise(r => setTimeout(r, 5));

fable.ProgressTime.logTimeStampDelta('Phase1', 'Phase 1');
fable.ProgressTime.createTimeStamp('Phase2');

// ... Phase 2 work ...
await new Promise(r => setTimeout(r, 5));

fable.ProgressTime.logTimeStampDelta('Phase2', 'Phase 2');
fable.ProgressTime.logTimeStampDelta('Total', 'Total time');
```

### Request Timing

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ProgressTimeDemo', ProductVersion: '1.0.0' });

function timeRequest(name) {
    fable.ProgressTime.createTimeStamp(name);
    return () => {
        fable.ProgressTime.logTimeStampDelta(name, `Request ${name}`);
        fable.ProgressTime.removeTimeStamp(name);
    };
}

const done = timeRequest('api-call');
// ... do request ...
await new Promise(r => setTimeout(r, 10));
done();
// Logs: 'Request api-call  245ms'
```

## Notes

- Timestamps use `+new Date()` for millisecond precision
- The default hash is `'Default'` when no hash string is provided
- `getTimeStampDelta()` and `getTimeStampValue()` return `-1` when the requested hash doesn't exist
- Consider using ProgressTrackerSet for tracking multiple related operations with progress counts
