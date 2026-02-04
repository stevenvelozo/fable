# Operation Service

The Operation service provides phased operation execution with progress tracking, designed for complex multi-step workflows.

## Access

```javascript
// On-demand service - instantiate when needed
const operation = fable.instantiateServiceProvider('Operation');
```

## Basic Usage

### Create an Operation

```javascript
const operation = fable.instantiateServiceProvider('Operation', {
    Name: 'DataImport',
    Description: 'Import user data from CSV'
});
```

### Add Phases

```javascript
operation.addPhase('validate', 'Validate Input', (pPhase, fComplete) => {
    // Validation logic
    if (isValid(inputData)) {
        fComplete();
    } else {
        fComplete(new Error('Validation failed'));
    }
});

operation.addPhase('process', 'Process Records', (pPhase, fComplete) => {
    // Processing logic
    processRecords(records, fComplete);
});

operation.addPhase('finalize', 'Finalize Import', (pPhase, fComplete) => {
    // Cleanup and finalization
    finalizeImport(fComplete);
});
```

### Execute Operation

```javascript
operation.execute((pError, pResult) => {
    if (pError) {
        fable.log.error('Operation failed', { error: pError.message });
    } else {
        fable.log.info('Operation completed successfully');
    }
});
```

## Progress Tracking

### Track Phase Progress

```javascript
operation.addPhase('import', 'Import Records', (pPhase, fComplete) => {
    const total = records.length;

    records.forEach((record, index) => {
        importRecord(record);
        pPhase.setProgress((index + 1) / total * 100);
    });

    fComplete();
});
```

### Get Operation Status

```javascript
const status = operation.getStatus();
console.log({
    currentPhase: status.currentPhase,
    progress: status.progress,
    elapsed: status.elapsedTime
});
```

## Phase Context

### Pass Data Between Phases

```javascript
operation.addPhase('load', 'Load Data', (pPhase, fComplete) => {
    const data = loadData();
    operation.context.data = data;
    fComplete();
});

operation.addPhase('transform', 'Transform Data', (pPhase, fComplete) => {
    const data = operation.context.data;
    operation.context.transformed = transformData(data);
    fComplete();
});

operation.addPhase('save', 'Save Data', (pPhase, fComplete) => {
    const transformed = operation.context.transformed;
    saveData(transformed, fComplete);
});
```

## Error Handling

### Phase-Level Errors

```javascript
operation.addPhase('risky', 'Risky Operation', (pPhase, fComplete) => {
    try {
        riskyOperation();
        fComplete();
    } catch (error) {
        fComplete(error);  // Operation stops here
    }
});

operation.execute((pError) => {
    if (pError) {
        console.log('Failed at phase:', operation.getFailedPhase());
    }
});
```

### Continue on Error

```javascript
operation.addPhase('optional', 'Optional Step', (pPhase, fComplete) => {
    try {
        optionalStep();
    } catch (error) {
        fable.log.warn('Optional step failed, continuing');
    }
    fComplete();  // Continue regardless
});
```

## Use Cases

### ETL Pipeline

```javascript
function createETLOperation(source, destination) {
    const operation = fable.instantiateServiceProvider('Operation', {
        Name: 'ETL Pipeline'
    });

    operation.addPhase('extract', 'Extract Data', (pPhase, fComplete) => {
        extractData(source, (error, data) => {
            if (error) return fComplete(error);
            operation.context.rawData = data;
            fComplete();
        });
    });

    operation.addPhase('transform', 'Transform Data', (pPhase, fComplete) => {
        const transformed = transformData(operation.context.rawData);
        operation.context.transformedData = transformed;
        fComplete();
    });

    operation.addPhase('load', 'Load Data', (pPhase, fComplete) => {
        loadData(destination, operation.context.transformedData, fComplete);
    });

    return operation;
}
```

### Deployment Pipeline

```javascript
const deployment = fable.instantiateServiceProvider('Operation', {
    Name: 'Deployment'
});

deployment.addPhase('build', 'Build Application', async (pPhase, fComplete) => {
    await runBuild();
    fComplete();
});

deployment.addPhase('test', 'Run Tests', async (pPhase, fComplete) => {
    const results = await runTests();
    if (!results.success) {
        return fComplete(new Error('Tests failed'));
    }
    fComplete();
});

deployment.addPhase('deploy', 'Deploy to Server', async (pPhase, fComplete) => {
    await deployToServer();
    fComplete();
});

deployment.addPhase('verify', 'Verify Deployment', async (pPhase, fComplete) => {
    const healthy = await healthCheck();
    if (!healthy) {
        return fComplete(new Error('Health check failed'));
    }
    fComplete();
});
```

### Data Migration

```javascript
const migration = fable.instantiateServiceProvider('Operation', {
    Name: 'Database Migration'
});

migration.addPhase('backup', 'Backup Database', (pPhase, fComplete) => {
    createBackup((error, backupId) => {
        if (error) return fComplete(error);
        migration.context.backupId = backupId;
        fComplete();
    });
});

migration.addPhase('migrate', 'Run Migration Scripts', (pPhase, fComplete) => {
    runMigrations(fComplete);
});

migration.addPhase('validate', 'Validate Data', (pPhase, fComplete) => {
    validateMigration((error, valid) => {
        if (error || !valid) {
            // Trigger rollback
            migration.context.needsRollback = true;
            return fComplete(error || new Error('Validation failed'));
        }
        fComplete();
    });
});

migration.execute((error) => {
    if (error && migration.context.needsRollback) {
        rollbackFromBackup(migration.context.backupId);
    }
});
```

## Integration with ProgressTrackerSet

```javascript
const operation = fable.instantiateServiceProvider('Operation', {
    Name: 'Batch Process'
});

const progressSet = fable.instantiateServiceProvider('ProgressTrackerSet');

operation.addPhase('process', 'Process Items', (pPhase, fComplete) => {
    const tracker = progressSet.createTracker('items', items.length);

    items.forEach(item => {
        processItem(item);
        tracker.increment();
        pPhase.setProgress(tracker.percentComplete);
    });

    fComplete();
});
```

## Notes

- Phases execute sequentially in the order they were added
- Each phase receives a phase object and completion callback
- Operation context persists across all phases
- Use `fComplete(error)` to halt operation on error
- Progress can be tracked at both phase and operation levels
