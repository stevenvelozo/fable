# ProgressTrackerSet Service

The ProgressTrackerSet service manages multiple related progress trackers for batch operations, providing coordinated progress tracking across parallel or sequential tasks.

## Access

```javascript
// On-demand service - instantiate when needed
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
```

## Basic Usage

### Create Trackers

```javascript
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

// Create individual trackers
const downloadTracker = trackerSet.createTracker('download', 100);  // 100 files
const processTracker = trackerSet.createTracker('process', 100);    // 100 items
const uploadTracker = trackerSet.createTracker('upload', 100);      // 100 uploads
```

### Update Progress

```javascript
// Update individual trackers
downloadTracker.increment();
downloadTracker.increment(10);  // Increment by 10

// Get individual progress
console.log(`Download: ${downloadTracker.percentComplete}%`);
```

### Get Overall Progress

```javascript
const overall = trackerSet.getOverallProgress();
console.log(`Total progress: ${overall}%`);
```

## Tracker Operations

### Create Tracker

```javascript
const tracker = trackerSet.createTracker(name, total);
// name: Unique identifier for this tracker
// total: Total number of items to track
```

### Get Tracker

```javascript
const tracker = trackerSet.getTracker('download');
```

### Remove Tracker

```javascript
trackerSet.removeTracker('download');
```

### List All Trackers

```javascript
const trackers = trackerSet.getAllTrackers();
trackers.forEach(tracker => {
    console.log(`${tracker.name}: ${tracker.percentComplete}%`);
});
```

## Progress Calculation

### Weighted Progress

```javascript
// Different trackers can have different weights based on their total
const smallTask = trackerSet.createTracker('small', 10);   // 10 items
const largeTask = trackerSet.createTracker('large', 1000); // 1000 items

smallTask.increment(5);   // 50% of small task
largeTask.increment(100); // 10% of large task

// Overall considers totals
const overall = trackerSet.getOverallProgress();
// Weighted average: (5 + 100) / (10 + 1000) = ~10.4%
```

### Status Summary

```javascript
const status = trackerSet.getStatus();
// Returns:
// {
//   trackers: {
//     download: { current: 50, total: 100, percent: 50 },
//     process: { current: 30, total: 100, percent: 30 }
//   },
//   overall: 40
// }
```

## Use Cases

### Parallel File Processing

```javascript
async function processFiles(files) {
    const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

    // Group files by type
    const images = files.filter(f => f.type === 'image');
    const documents = files.filter(f => f.type === 'document');

    const imageTracker = trackerSet.createTracker('images', images.length);
    const docTracker = trackerSet.createTracker('documents', documents.length);

    // Process in parallel
    await Promise.all([
        processImages(images, imageTracker),
        processDocuments(documents, docTracker)
    ]);

    console.log('All files processed');
}

async function processImages(images, tracker) {
    for (const image of images) {
        await processImage(image);
        tracker.increment();
        reportProgress();
    }
}
```

### Multi-Stage Pipeline

```javascript
async function dataPipeline(data) {
    const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

    // Create trackers for each stage
    const stages = ['extract', 'transform', 'validate', 'load'];
    const trackers = {};

    stages.forEach(stage => {
        trackers[stage] = trackerSet.createTracker(stage, data.length);
    });

    // Execute stages
    const extracted = await extractData(data, trackers.extract);
    const transformed = await transformData(extracted, trackers.transform);
    const validated = await validateData(transformed, trackers.validate);
    await loadData(validated, trackers.load);

    return trackerSet.getStatus();
}
```

### Batch Import with Categories

```javascript
function importRecords(records) {
    const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

    // Group by category
    const byCategory = groupBy(records, 'category');

    // Create tracker for each category
    Object.entries(byCategory).forEach(([category, items]) => {
        trackerSet.createTracker(category, items.length);
    });

    // Process each category
    Object.entries(byCategory).forEach(([category, items]) => {
        const tracker = trackerSet.getTracker(category);

        items.forEach(item => {
            importRecord(item);
            tracker.increment();

            // Log progress periodically
            if (tracker.current % 100 === 0) {
                logProgress(trackerSet);
            }
        });
    });

    return trackerSet.getStatus();
}

function logProgress(trackerSet) {
    const status = trackerSet.getStatus();
    console.log(`Overall: ${status.overall}%`);
    Object.entries(status.trackers).forEach(([name, tracker]) => {
        console.log(`  ${name}: ${tracker.percent}%`);
    });
}
```

### Download Manager

```javascript
class DownloadManager {
    constructor() {
        this.trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');
    }

    addDownload(url, size) {
        const id = fable.getUUID();
        this.trackerSet.createTracker(id, size);
        this.startDownload(url, id);
        return id;
    }

    updateProgress(id, bytesReceived) {
        const tracker = this.trackerSet.getTracker(id);
        if (tracker) {
            tracker.setCurrent(bytesReceived);
        }
    }

    completeDownload(id) {
        this.trackerSet.removeTracker(id);
    }

    getProgress() {
        return this.trackerSet.getStatus();
    }
}
```

## Progress Events

### Monitor Progress Changes

```javascript
// Poll for progress updates
const interval = setInterval(() => {
    const status = trackerSet.getStatus();
    updateUI(status);

    if (status.overall >= 100) {
        clearInterval(interval);
        onComplete();
    }
}, 100);
```

## Integration with Operation Service

```javascript
const operation = fable.instantiateServiceProvider('Operation');
const trackerSet = fable.instantiateServiceProvider('ProgressTrackerSet');

operation.addPhase('process', 'Process Data', (pPhase, fComplete) => {
    const tracker = trackerSet.createTracker('process', items.length);

    items.forEach(item => {
        processItem(item);
        tracker.increment();
        pPhase.setProgress(tracker.percentComplete);
    });

    fComplete();
});
```

## Notes

- Overall progress is calculated as weighted average based on totals
- Trackers can be added/removed dynamically
- Each tracker maintains its own current count and total
- Thread-safe for single-threaded JavaScript environments
