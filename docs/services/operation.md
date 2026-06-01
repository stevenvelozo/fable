# Operation Service

The Operation service provides phased step execution with built-in progress tracking and logging, designed for complex multi-step workflows.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const operation = fable.instantiateServiceProvider('Operation', { Name: 'My Operation' }, 'MY-OP-1');
console.log('operation:', typeof operation, 'name:', operation.state.Metadata.Name);
```

## Basic Usage

### Create an Operation

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });

const operation = fable.instantiateServiceProvider('Operation', {
    Name: 'Data Import'
}, 'IMPORT-123');
console.log('Operation created:', operation.state.Metadata.Name);
```

### Add Steps

Use `addStep()` to register sequential steps. Each step function receives a completion callback and runs with a bound context:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });
const operation = fable.instantiateServiceProvider('Operation', { Name: 'Data Import' }, 'IMPORT-123');

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

console.log('Registered steps:', operation.state.Status.StepCount);
```

### Execute the Operation

Steps execute sequentially in the order they were added:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });
const operation = fable.instantiateServiceProvider('Operation', { Name: 'Demo' }, 'DEMO-1');

operation.addStep(function (fStepComplete) {
    this.log.info('Step 1 running');
    fStepComplete();
}, {}, 'Step1', 'first step', 'S1');

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
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });
const operation = fable.instantiateServiceProvider('Operation', { Name: 'Demo' }, 'TOTALS-1');

operation.addStep(
    function (fStepComplete) {
        // ... step work ...
        fStepComplete();
    },
    {}, 'Process Records', 'Process all records', 'PROCESS-STEP'
);

// Set expected total operations for the step
operation.setStepTotalOperations('PROCESS-STEP', 100);
console.log('Step PROCESS-STEP total ops registered.');
```

### Increment Progress Within a Step

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });

const items = ['a', 'b', 'c'];
function processItem(item) { console.log('processed:', item); }

const operation = fable.instantiateServiceProvider('Operation', { Name: 'Item Processor' }, 'ITEMS-1');

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

operation.execute((pError) => console.log('Done - pError:', pError));
```

## Operation State and Logging

The operation maintains a structured state object:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });
const operation = fable.instantiateServiceProvider('Operation', { Name: 'State Demo' }, 'STATE-1');

console.log('Metadata.UUID:',    operation.state.Metadata.UUID);    // Unique identifier
console.log('Metadata.Name:',    operation.state.Metadata.Name);    // Operation name
console.log('Status.StepCount:', operation.state.Status.StepCount); // Number of registered steps
console.log('Steps:',            operation.state.Steps);            // Array of step state entries
console.log('Log:',              operation.state.Log);              // Array of log strings
console.log('Errors:',           operation.state.Errors);           // Array of error strings
```

### Built-in Log Methods

The operation provides logging methods that write to both fable.log and the operation's internal log:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });
const operation = fable.instantiateServiceProvider('Operation', { Name: 'Log Demo' }, 'LOG-1');

operation.log.trace('Trace message');
operation.log.debug('Debug message');
operation.log.info('Info message');
operation.log.warn('Warning message');
operation.log.error('Error message');    // Also writes to state.Errors
operation.log.fatal('Fatal message');    // Also writes to state.Errors
console.log('state.Errors count:', operation.state.Errors.length);
```

### Logging with Data

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });
const operation = fable.instantiateServiceProvider('Operation', { Name: 'Log With Data' }, 'LOGDATA-1');

operation.log.debug('Processing', { TestData: 'Ignition Complete' });
// Appends JSON stringified data to the log
console.log('Last log entry:', operation.state.Log[operation.state.Log.length - 1]);
```

## Use Cases

### Multi-Step Async Workflow

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'OperationDemo', ProductVersion: '1.0.0' });

// Stubs for the playground demo
function importRecord(rec, cb) { console.log('imported:', rec); cb(); }
function finalizeImport(cb)     { console.log('finalized'); cb(); }

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

const op = createImportOperation(fable, [{ id: 1 }, { id: 2 }, { id: 3 }]);
op.execute((pError) => console.log('Import done - pError:', pError));
```

## Notes

- Steps execute sequentially in the order they were added
- An operation can only be executed once; calling `execute()` again returns an error
- Step functions are bound to a custom context (not the operation itself)
- The service type is `'PhasedOperation'`
- Each step gets its own progress tracker automatically
- The operation tracks an overall progress tracker across all steps
