# Anticipate Service

The Anticipate service provides asynchronous operation sequencing, allowing you to chain operations and manage async workflows.

## Access

```javascript
// On-demand service - instantiate when needed
const anticipate = fable.instantiateServiceProvider('Anticipate');

// Or use the factory method (creates unregistered instance)
const anticipate = fable.newAnticipate();
```

## Basic Usage

### Sequential Operations

```javascript
const anticipate = fable.newAnticipate();

anticipate
    .queue('Step 1',
        (fComplete) => {
            console.log('Executing step 1');
            setTimeout(() => fComplete(), 100);
        })
    .queue('Step 2',
        (fComplete) => {
            console.log('Executing step 2');
            setTimeout(() => fComplete(), 100);
        })
    .queue('Step 3',
        (fComplete) => {
            console.log('Executing step 3');
            fComplete();
        })
    .execute((pError) => {
        if (pError) {
            console.error('Failed:', pError);
        } else {
            console.log('All steps completed');
        }
    });
```

### Passing Data Between Steps

```javascript
const anticipate = fable.newAnticipate();

anticipate
    .queue('Fetch User',
        (fComplete, pData) => {
            fetchUser(123, (user) => {
                pData.user = user;
                fComplete();
            });
        })
    .queue('Load Preferences',
        (fComplete, pData) => {
            loadPreferences(pData.user.id, (prefs) => {
                pData.preferences = prefs;
                fComplete();
            });
        })
    .queue('Render',
        (fComplete, pData) => {
            render(pData.user, pData.preferences);
            fComplete();
        })
    .execute();
```

## API Reference

### queue(pStepName, fStepFunction)

Add a step to the queue:

```javascript
anticipate.queue('Step Name', (fComplete, pData) => {
    // Do work
    fComplete();  // Call when done
});
```

Parameters for step function:
- `fComplete` - Callback to signal completion
- `pData` - Shared data object for passing state between steps

### execute(fCallback)

Execute all queued steps:

```javascript
anticipate.execute((pError) => {
    if (pError) {
        console.error('Error:', pError);
    }
});
```

### clear()

Clear all queued steps:

```javascript
anticipate.clear();
```

## Error Handling

### Passing Errors

```javascript
anticipate.queue('Risky Operation',
    (fComplete, pData) => {
        doRiskyThing((error, result) => {
            if (error) {
                fComplete(error);  // Pass error to callback
            } else {
                pData.result = result;
                fComplete();
            }
        });
    })
.execute((pError) => {
    if (pError) {
        console.error('Pipeline failed:', pError);
    }
});
```

### Error Recovery

```javascript
anticipate
    .queue('Try Operation',
        (fComplete, pData) => {
            try {
                riskyOperation();
                fComplete();
            } catch (e) {
                pData.error = e;
                fComplete();  // Continue despite error
            }
        })
    .queue('Check Result',
        (fComplete, pData) => {
            if (pData.error) {
                console.log('Recovering from:', pData.error);
            }
            fComplete();
        })
    .execute();
```

## Use Cases

### Database Migrations

```javascript
const migrate = fable.newAnticipate();

migrate
    .queue('Create users table',
        (fComplete) => {
            db.query('CREATE TABLE users...', fComplete);
        })
    .queue('Create posts table',
        (fComplete) => {
            db.query('CREATE TABLE posts...', fComplete);
        })
    .queue('Add indexes',
        (fComplete) => {
            db.query('CREATE INDEX...', fComplete);
        })
    .execute((err) => {
        if (err) console.error('Migration failed:', err);
        else console.log('Migration complete');
    });
```

### API Request Chains

```javascript
const workflow = fable.newAnticipate();

workflow
    .queue('Authenticate',
        (fComplete, pData) => {
            api.login(credentials, (token) => {
                pData.token = token;
                fComplete();
            });
        })
    .queue('Fetch Data',
        (fComplete, pData) => {
            api.getData(pData.token, (data) => {
                pData.data = data;
                fComplete();
            });
        })
    .queue('Process',
        (fComplete, pData) => {
            process(pData.data);
            fComplete();
        })
    .execute();
```

### Build Pipeline

```javascript
const build = fable.newAnticipate();

build
    .queue('Clean',
        (fComplete) => {
            cleanBuildDir(fComplete);
        })
    .queue('Compile',
        (fComplete) => {
            compile(fComplete);
        })
    .queue('Bundle',
        (fComplete) => {
            bundle(fComplete);
        })
    .queue('Minify',
        (fComplete) => {
            minify(fComplete);
        })
    .execute((err) => {
        if (err) throw err;
        console.log('Build complete');
    });
```

## Comparison with async.waterfall

Anticipate is similar to `async.waterfall` but provides:
- Named steps for better debugging
- Shared data object instead of passing arguments
- Chainable API

```javascript
// async.waterfall
async.waterfall([
    (callback) => { callback(null, 'one'); },
    (arg1, callback) => { callback(null, 'two'); }
], callback);

// Anticipate
fable.newAnticipate()
    .queue('First', (fComplete, pData) => {
        pData.result = 'one';
        fComplete();
    })
    .queue('Second', (fComplete, pData) => {
        pData.result = 'two';
        fComplete();
    })
    .execute(callback);
```

## Multiple Instances

Create multiple independent workflows:

```javascript
const userWorkflow = fable.newAnticipate();
const orderWorkflow = fable.newAnticipate();

// Execute concurrently
userWorkflow.queue(...).execute();
orderWorkflow.queue(...).execute();
```
