# ProgressTrackerSet Service

The ProgressTrackerSet service manages named progress trackers for tracking the completion of batch operations, including elapsed time, average operation time, and estimated completion time.

## Access

```javascript
// On-demand service - instantiate when needed
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
```

## Basic Usage

### Create and Start a Tracker

```javascript
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

// Create a tracker with 100 total operations
trackerSet.createProgressTracker('download', 100);

// Start the tracker (begins timing)
trackerSet.startProgressTracker('download');
```

### Increment Progress

```javascript
// Increment by 1
trackerSet.incrementProgressTracker('download');

// Increment by a specific amount
trackerSet.incrementProgressTracker('download', 10);
```

### End the Tracker

```javascript
trackerSet.endProgressTracker('download');
```

### Get Status

```javascript
// Get a human-readable status string
const status = trackerSet.getProgressTrackerStatusString('download');
// e.g., "ProgressTracker download is 45.000% completed - 45 / 100 operations over 2s 150ms (median 47ms per). Estimated completion: 2s 585ms"

// Get just the percent complete
const percent = trackerSet.getProgressTrackerPercentCompleteString('download');
// e.g., "45.000%"

// Get completed count
const count = trackerSet.getProgressTrackerCompletedOperationCountString('download');
// e.g., "45"

// Log status directly
trackerSet.logProgressTrackerStatus('download');
```

## Methods

### `createProgressTracker(hash, totalOperations)`

Create a new progress tracker. Default hash is `'Default'`, default total is `100`.

```javascript
const tracker = trackerSet.createProgressTracker('import-records', 500);
```

Returns the tracker data object.

### `startProgressTracker(hash)`

Start timing a progress tracker. Creates the tracker if it doesn't exist.

```javascript
trackerSet.startProgressTracker('import-records');
```

### `endProgressTracker(hash)`

Mark the tracker as complete, recording the end timestamp.

```javascript
trackerSet.endProgressTracker('import-records');
```

### `incrementProgressTracker(hash, amount)`

Increment the current operation count. Defaults to incrementing by 1. Auto-starts the tracker if not started.

```javascript
trackerSet.incrementProgressTracker('import-records');
trackerSet.incrementProgressTracker('import-records', 5);
```

### `updateProgressTracker(hash, currentOperations)`

Set the current operation count to an absolute value.

```javascript
trackerSet.updateProgressTracker('import-records', 250);
```

### `setProgressTrackerTotalOperations(hash, total)`

Change the total number of expected operations.

```javascript
trackerSet.setProgressTrackerTotalOperations('import-records', 1000);
```

### `getProgressTracker(hash)`

Get a ProgressTracker wrapper object for a given hash. This provides convenience methods for working with the tracker:

```javascript
const tracker = trackerSet.getProgressTracker('import-records');
tracker.incrementProgressTracker(1);
tracker.setProgressTrackerTotalOperations(500);
```

### `getProgressTrackerData(hash)`

Get the raw tracker data object:

```javascript
const data = trackerSet.getProgressTrackerData('import-records');
// {
//     Hash: 'import-records',
//     StartTimeStamp: 1700000000000,
//     EndTimeStamp: -1,
//     PercentComplete: 45,
//     ElapsedTime: 2150,
//     AverageOperationTime: 47.78,
//     EstimatedCompletionTime: 2585,
//     TotalCount: 100,
//     CurrentCount: 45
// }
```

## Tracker Data Properties

Each tracker data object contains:

| Property | Description |
|----------|-------------|
| `Hash` | The tracker's identifier |
| `StartTimeStamp` | When the tracker was started (ms) |
| `EndTimeStamp` | When the tracker was ended (ms), `-1` if not ended |
| `PercentComplete` | Percentage complete (0-100, capped unless `AllowTruePercentComplete` is set) |
| `ElapsedTime` | Total elapsed time in milliseconds |
| `AverageOperationTime` | Average time per operation in milliseconds |
| `EstimatedCompletionTime` | Estimated remaining time in milliseconds |
| `TotalCount` | Total number of expected operations |
| `CurrentCount` | Number of completed operations |
| `AllowTruePercentComplete` | If true, PercentComplete can exceed 100% |

## Use Cases

### Batch Processing with Progress

```javascript
function processBatch(fable, items, fCallback) {
    const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

    trackerSet.createProgressTracker('batch', items.length);
    trackerSet.startProgressTracker('batch');

    let tmpAnticipate = fable.newAnticipate();

    for (let i = 0; i < items.length; i++) {
        tmpAnticipate.anticipate((fNext) => {
            processItem(items[i], () => {
                trackerSet.incrementProgressTracker('batch');

                if (i % 100 === 0) {
                    trackerSet.logProgressTrackerStatus('batch');
                }

                fNext();
            });
        });
    }

    tmpAnticipate.wait(() => {
        trackerSet.endProgressTracker('batch');
        trackerSet.logProgressTrackerStatus('batch');
        fCallback();
    });
}
```

### Integration with Operation Service

The Operation service uses ProgressTrackerSet internally. Each step gets its own progress tracker, and the overall operation has one too. Inside a step, use `this.ProgressTracker`:

```javascript
operation.addStep(
    function (fStepComplete) {
        this.ProgressTracker.setProgressTrackerTotalOperations(items.length);

        items.forEach((item) => {
            processItem(item);
            this.ProgressTracker.incrementProgressTracker(1);
            this.logProgressTrackerStatus();
        });

        fStepComplete();
    },
    {}, 'Process', 'Process all items', 'PROCESS'
);
```

## Notes

- All hash parameters default to `'Default'` if not provided
- Trackers that don't exist are auto-created with a warning when accessed
- `PercentComplete` is capped at 100% unless `AllowTruePercentComplete` is set on the tracker data
- Timing uses ProgressTime service internally
- Status strings include elapsed time, operation counts, and estimated completion
