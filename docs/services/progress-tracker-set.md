# ProgressTrackerSet Service

The ProgressTrackerSet service manages named progress trackers for tracking the completion of batch operations, including elapsed time, average operation time, and estimated completion time.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
console.log('trackerSet:', typeof trackerSet);
```

## Basic Usage

### Create and Start a Tracker

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

// Create a tracker with 100 total operations
trackerSet.createProgressTracker('download', 100);

// Start the tracker (begins timing)
trackerSet.startProgressTracker('download');
console.log('Started:', trackerSet.getProgressTrackerStatusString('download'));
```

### Increment Progress

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('download', 100);
trackerSet.startProgressTracker('download');

// Increment by 1
trackerSet.incrementProgressTracker('download');

// Increment by a specific amount
trackerSet.incrementProgressTracker('download', 10);

console.log('Completed:', trackerSet.getProgressTrackerCompletedOperationCountString('download'));
```

### End the Tracker

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('download', 100);
trackerSet.startProgressTracker('download');
trackerSet.incrementProgressTracker('download', 100);

trackerSet.endProgressTracker('download');
console.log('End status:', trackerSet.getProgressTrackerStatusString('download'));
```

### Get Status

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('download', 100);
trackerSet.startProgressTracker('download');
trackerSet.incrementProgressTracker('download', 45);

// Get a human-readable status string
const status = trackerSet.getProgressTrackerStatusString('download');
console.log('status:', status);

// Get just the percent complete
const percent = trackerSet.getProgressTrackerPercentCompleteString('download');
console.log('percent:', percent);

// Get completed count
const count = trackerSet.getProgressTrackerCompletedOperationCountString('download');
console.log('count:', count);

// Log status directly
trackerSet.logProgressTrackerStatus('download');
```

## Methods

### `createProgressTracker(hash, totalOperations)`

Create a new progress tracker. Default hash is `'Default'`, default total is `100`.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

const tracker = trackerSet.createProgressTracker('import-records', 500);
console.log('Tracker data:', tracker);
```

Returns the tracker data object.

### `startProgressTracker(hash)`

Start timing a progress tracker. Creates the tracker if it doesn't exist.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

trackerSet.startProgressTracker('import-records');
console.log('Started import-records');
```

### `endProgressTracker(hash)`

Mark the tracker as complete, recording the end timestamp.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.startProgressTracker('import-records');

trackerSet.endProgressTracker('import-records');
console.log('Ended import-records');
```

### `incrementProgressTracker(hash, amount)`

Increment the current operation count. Defaults to incrementing by 1. Auto-starts the tracker if not started.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('import-records', 100);
trackerSet.startProgressTracker('import-records');

trackerSet.incrementProgressTracker('import-records');
trackerSet.incrementProgressTracker('import-records', 5);
console.log('Completed:', trackerSet.getProgressTrackerCompletedOperationCountString('import-records'));
```

### `updateProgressTracker(hash, currentOperations)`

Set the current operation count to an absolute value.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('import-records', 500);
trackerSet.startProgressTracker('import-records');

trackerSet.updateProgressTracker('import-records', 250);
console.log('Status:', trackerSet.getProgressTrackerStatusString('import-records'));
```

### `setProgressTrackerTotalOperations(hash, total)`

Change the total number of expected operations.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('import-records', 500);

trackerSet.setProgressTrackerTotalOperations('import-records', 1000);
console.log('Total updated; data:', trackerSet.getProgressTrackerData('import-records').TotalCount);
```

### `getProgressTracker(hash)`

Get a ProgressTracker wrapper object for a given hash. This provides convenience methods for working with the tracker:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('import-records', 100);
trackerSet.startProgressTracker('import-records');

const tracker = trackerSet.getProgressTracker('import-records');
tracker.incrementProgressTracker(1);
tracker.setProgressTrackerTotalOperations(500);
console.log('Tracker after wrapper ops:', trackerSet.getProgressTrackerData('import-records'));
```

### `getProgressTrackerData(hash)`

Get the raw tracker data object:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
trackerSet.createProgressTracker('import-records', 100);
trackerSet.startProgressTracker('import-records');
trackerSet.incrementProgressTracker('import-records', 45);

const data = trackerSet.getProgressTrackerData('import-records');
console.log(data);
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
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });

// Stubbed processItem for the playground demo
function processItem(item, cb) { console.log('processed:', item); cb(); }

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

processBatch(fable, ['a', 'b', 'c', 'd'], () => console.log('Batch done.'));
```

### Integration with Operation Service

The Operation service uses ProgressTrackerSet internally. Each step gets its own progress tracker, and the overall operation has one too. Inside a step, use `this.ProgressTracker`:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TrackerDemo', ProductVersion: '1.0.0' });

const operation = fable.instantiateServiceProvider('Operation', { Name: 'Items' }, 'ITEMS-OP');
const items = ['a', 'b', 'c'];
function processItem(item) { console.log('processed:', item); }

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

operation.execute((pError) => console.log('Op done - pError:', pError));
```

## Notes

- All hash parameters default to `'Default'` if not provided
- Trackers that don't exist are auto-created with a warning when accessed
- `PercentComplete` is capped at 100% unless `AllowTruePercentComplete` is set on the tracker data
- Timing uses ProgressTime service internally
- Status strings include elapsed time, operation counts, and estimated completion
