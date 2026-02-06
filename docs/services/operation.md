# Operation Service

The Operation service provides phased step execution with built-in progress tracking and logging, designed for complex multi-step workflows.

## Access

```javascript
// On-demand service - instantiate when needed
const operation = fable.instantiateServiceProvider('Operation', { Name: 'My Operation' }, 'MY-OP-1');
```

## Basic Usage

### Create an Operation

```javascript
const operation = fable.instantiateServiceProvider('Operation', {
    Name: 'Data Import'
}, 'IMPORT-123');
```

### Add Steps

Use `addStep()` to register sequential steps. Each step function receives a completion callback and runs with a bound context:

```javascript
operation.addStep(
    function (fStepComplete) {
        this.log.info('Validating input...');
        // ... validation logic ...
        fStepComplete();
    },
    {},                    // Step metadata (accessible as this.metadata / this.options)
    'Validate',            // Step name
    'Validate input data', // Step description
    'VALIDATE-STEP'        // Step GUID (optional)
);

operation.addStep(
    function (fStepComplete) {
        this.log.info('Processing records...');
        // ... processing logic ...
        fStepComplete();
    },
    {},
    'Process',
    'Process all records',
    'PROCESS-STEP'
);
```

### Execute the Operation

Steps execute sequentially in the order they were added:

```javascript
operation.execute((pError) => {
    if (pError) {
        fable.log.error('Operation failed', { error: pError.message });
    } else {
        fable.log.info('Operation completed successfully');
    }
});
```

## Step Context

Inside a step function, `this` is bound to a context object with these properties:

| Property | Description |
|----------|-------------|
| `this.log` | Logger (writes to both fable.log and operation state log) |
| `this.fable` | Reference to the Fable instance |
| `this.options` | Step metadata object (same as `this.metadata`) |
| `this.metadata` | Step metadata object |
| `this.ProgressTracker` | Progress tracker for this step |
| `this.logProgressTrackerStatus()` | Log the current progress status |
| `this.OperationState` | The full operation state object |
| `this.StepState` | This step's state entry |

## Progress Tracking

### Set Total Operations for a Step

```javascript
operation.addStep(
    function (fStepComplete) {
        // ... step work ...
        fStepComplete();
    },
    {}, 'Process Records', 'Process all records', 'PROCESS-STEP'
);

// Set expected total operations for the step
operation.setStepTotalOperations('PROCESS-STEP', 100);
```

### Increment Progress Within a Step

```javascript
operation.addStep(
    function (fStepComplete) {
        this.ProgressTracker.setProgressTrackerTotalOperations(items.length);

        let tmpAnticipate = this.fable.newAnticipate();

        for (let i = 0; i < items.length; i++) {
            tmpAnticipate.anticipate((fWorkComplete) => {
                processItem(items[i]);
                this.ProgressTracker.incrementProgressTracker(1);
                this.logProgressTrackerStatus();
                fWorkComplete();
            });
        }

        tmpAnticipate.wait(fStepComplete);
    },
    {}, 'Process Items', 'Process each item with tracking', 'ITEMS-STEP'
);
```

## Operation State and Logging

The operation maintains a structured state object:

```javascript
operation.state.Metadata.UUID    // Unique identifier
operation.state.Metadata.Name    // Operation name
operation.state.Status.StepCount // Number of registered steps
operation.state.Steps            // Array of step state entries
operation.state.Log              // Array of log strings
operation.state.Errors           // Array of error strings
```

### Built-in Log Methods

The operation provides logging methods that write to both fable.log and the operation's internal log:

```javascript
operation.log.trace('Trace message');
operation.log.debug('Debug message');
operation.log.info('Info message');
operation.log.warn('Warning message');
operation.log.error('Error message');    // Also writes to state.Errors
operation.log.fatal('Fatal message');    // Also writes to state.Errors
```

### Logging with Data

```javascript
operation.log.debug('Processing', { TestData: 'Ignition Complete' });
// Appends JSON stringified data to the log
```

## Use Cases

### Multi-Step Async Workflow

```javascript
function createImportOperation(fable, records) {
    const operation = fable.instantiateServiceProvider('Operation', {
        Name: 'Record Import'
    });

    operation.addStep(
        function (fStepComplete) {
            this.log.info(`Importing ${records.length} records...`);

            this.ProgressTracker.setProgressTrackerTotalOperations(records.length);

            let tmpAnticipate = this.fable.newAnticipate();

            for (let i = 0; i < records.length; i++) {
                tmpAnticipate.anticipate((fWorkComplete) => {
                    importRecord(records[i], () => {
                        this.ProgressTracker.incrementProgressTracker(1);
                        this.logProgressTrackerStatus();
                        fWorkComplete();
                    });
                });
            }

            tmpAnticipate.wait(fStepComplete);
        },
        {}, 'Import', 'Import all records', 'IMPORT'
    );

    operation.addStep(
        function (fStepComplete) {
            this.log.info('Finalizing...');
            finalizeImport(fStepComplete);
        },
        {}, 'Finalize', 'Finalize the import'
    );

    return operation;
}
```

## Notes

- Steps execute sequentially in the order they were added
- An operation can only be executed once; calling `execute()` again returns an error
- Step functions are bound to a custom context (not the operation itself)
- The service type is `'PhasedOperation'`
- Each step gets its own progress tracker automatically
- The operation tracks an overall progress tracker across all steps
