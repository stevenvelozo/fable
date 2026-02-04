# ProgressTime Service

The ProgressTime service provides execution timing and progress tracking utilities.

## Access

```javascript
// Auto-instantiated, available directly
fable.ProgressTime
```

## Basic Timing

### Start/End Timing

```javascript
fable.ProgressTime.start('operation');

// ... do work ...

const elapsed = fable.ProgressTime.end('operation');
console.log(`Operation took ${elapsed}ms`);
```

### Lap Timing

```javascript
fable.ProgressTime.start('process');

// Phase 1
// ... work ...
fable.ProgressTime.lap('process', 'Phase 1');

// Phase 2
// ... work ...
fable.ProgressTime.lap('process', 'Phase 2');

// Phase 3
// ... work ...
const total = fable.ProgressTime.end('process');
```

## Progress Tracking

### Create Progress Tracker

```javascript
const progress = fable.ProgressTime.createProgressTracker('import', 1000);
// Track progress for 1000 total items

progress.increment();  // Mark one item complete
progress.increment(10); // Mark 10 items complete

console.log(`Progress: ${progress.percentComplete}%`);
```

### Track with Logging

```javascript
const progress = fable.ProgressTime.createProgressTracker('export', totalRecords);

records.forEach((record, index) => {
    processRecord(record);
    progress.increment();

    // Log every 10%
    if (progress.percentComplete % 10 === 0) {
        fable.log.info(`Export progress: ${progress.percentComplete}%`);
    }
});
```

## Timestamp Utilities

### Get Current Timestamp

```javascript
const now = fable.ProgressTime.getTimestamp();
// Returns milliseconds since epoch
```

### Get Formatted Time

```javascript
const formatted = fable.ProgressTime.getFormattedTime();
// Returns human-readable timestamp
```

## Use Cases

### Performance Profiling

```javascript
function profileFunction(fn, name) {
    return function(...args) {
        fable.ProgressTime.start(name);
        const result = fn.apply(this, args);
        const elapsed = fable.ProgressTime.end(name);
        fable.log.debug(`${name} completed in ${elapsed}ms`);
        return result;
    };
}

// Usage
const profiledSort = profileFunction(sortArray, 'sortArray');
profiledSort(largeArray);
```

### Batch Processing Progress

```javascript
async function processBatch(items) {
    const tracker = fable.ProgressTime.createProgressTracker('batch', items.length);

    fable.ProgressTime.start('batch-process');

    for (const item of items) {
        await processItem(item);
        tracker.increment();

        if (tracker.current % 100 === 0) {
            fable.log.info('Batch progress', {
                completed: tracker.current,
                total: tracker.total,
                percent: tracker.percentComplete,
                elapsed: fable.ProgressTime.lap('batch-process', `${tracker.current} items`)
            });
        }
    }

    const totalTime = fable.ProgressTime.end('batch-process');
    fable.log.info(`Batch complete in ${totalTime}ms`);
}
```

### API Request Timing

```javascript
function timedRequest(url) {
    const requestId = fable.getUUID();

    fable.ProgressTime.start(`request-${requestId}`);

    return fetch(url)
        .then(response => {
            const elapsed = fable.ProgressTime.end(`request-${requestId}`);
            fable.log.debug('Request completed', { url, elapsed });
            return response;
        });
}
```

### Long-Running Task Progress

```javascript
class LongRunningTask {
    constructor(totalSteps) {
        this.tracker = fable.ProgressTime.createProgressTracker('task', totalSteps);
        this.startTime = fable.ProgressTime.getTimestamp();
    }

    completeStep() {
        this.tracker.increment();
    }

    getStatus() {
        const elapsed = fable.ProgressTime.getTimestamp() - this.startTime;
        const rate = this.tracker.current / (elapsed / 1000);
        const remaining = (this.tracker.total - this.tracker.current) / rate;

        return {
            completed: this.tracker.current,
            total: this.tracker.total,
            percentComplete: this.tracker.percentComplete,
            elapsedMs: elapsed,
            estimatedRemainingSeconds: remaining
        };
    }
}
```

### Multi-Phase Operations

```javascript
async function multiPhaseOperation() {
    const phases = ['init', 'process', 'validate', 'cleanup'];

    fable.ProgressTime.start('total');

    for (const phase of phases) {
        fable.ProgressTime.start(phase);

        switch (phase) {
            case 'init':
                await initialize();
                break;
            case 'process':
                await process();
                break;
            case 'validate':
                await validate();
                break;
            case 'cleanup':
                await cleanup();
                break;
        }

        const phaseTime = fable.ProgressTime.end(phase);
        fable.log.info(`Phase ${phase} completed`, { duration: phaseTime });
    }

    const totalTime = fable.ProgressTime.end('total');
    fable.log.info('Operation complete', { totalDuration: totalTime });
}
```

## Integration with DataFormat

Use DataFormat for formatted time output:

```javascript
const start = fable.ProgressTime.getTimestamp();
// ... work ...
const end = fable.ProgressTime.getTimestamp();

const formatted = fable.DataFormat.formatTimeDelta(start, end);
console.log(`Duration: ${formatted}`);  // "00:01:23.456"
```

## Notes

- Timing uses JavaScript's high-resolution timestamp when available
- Progress trackers are lightweight and can be created freely
- Consider using ProgressTrackerSet for tracking multiple related operations
