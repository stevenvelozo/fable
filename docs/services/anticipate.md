# Anticipate Service

The Anticipate service provides asynchronous operation sequencing, allowing you to chain operations and manage async workflows.

## Access

```javascript
// On-demand service - instantiate when needed
const tmpAnticipate = fable.instantiateServiceProvider('Anticipate');

// Or use the factory method (creates unregistered instance)
const tmpAnticipate = fable.newAnticipate();
```

## Basic Usage

### Sequential Operations

```javascript
const tmpAnticipate = fable.newAnticipate();

tmpAnticipate.anticipate(function (fCallback)
{
	console.log('Executing step 1');
	setTimeout(function ()
	{
		console.log('Step 1 done');
		fCallback();
	}, 100);
});
tmpAnticipate.anticipate(function (fCallback)
{
	console.log('Executing step 2');
	setTimeout(function ()
	{
		console.log('Step 2 done');
		fCallback();
	}, 100);
});
tmpAnticipate.anticipate(function (fCallback)
{
	console.log('Executing step 3');
	fCallback();
});
tmpAnticipate.wait(function (pError)
{
	if (pError)
	{
		console.error('Failed:', pError);
	}
	else
	{
		console.log('All steps completed');
	}
});
```

### Sharing State Between Steps

Since Anticipate callbacks receive only `fCallback`, use closure scope or external variables to share data between steps:

```javascript
const tmpAnticipate = fable.newAnticipate();
let tmpUser = null;
let tmpPreferences = null;

tmpAnticipate.anticipate(function (fCallback)
{
	fetchUser(123, function (pUser)
	{
		tmpUser = pUser;
		fCallback();
	});
});
tmpAnticipate.anticipate(function (fCallback)
{
	loadPreferences(tmpUser.id, function (pPrefs)
	{
		tmpPreferences = pPrefs;
		fCallback();
	});
});
tmpAnticipate.anticipate(function (fCallback)
{
	render(tmpUser, tmpPreferences);
	fCallback();
});
tmpAnticipate.wait(function (pError)
{
	if (pError)
	{
		console.error('Workflow failed:', pError);
	}
});
```

## API Reference

### anticipate(fAsynchronousFunction)

Add an asynchronous operation to the queue. Operations run sequentially by default (one at a time).

```javascript
tmpAnticipate.anticipate(function (fCallback)
{
	// Do async work
	fCallback();  // Call when done, or fCallback(pError) to signal failure
});
```

The step function receives one parameter:
- `fCallback` — Callback to signal completion. Pass an error to bail out: `fCallback(new Error('something failed'))`

### wait(fCallback)

Register a callback to run when all queued operations complete (or when an error occurs):

```javascript
tmpAnticipate.wait(function (pError)
{
	if (pError)
	{
		console.error('Error:', pError);
	}
});
```

### maxOperations

Control concurrency. Default is `1` (sequential). Set higher for parallel execution:

```javascript
const tmpAnticipate = fable.newAnticipate();
tmpAnticipate.maxOperations = 5;  // Run up to 5 operations concurrently
```

## Error Handling

### Error Bailout

When an operation passes an error to its callback, remaining queued operations are skipped and the `wait` callback fires immediately with the error:

```javascript
const tmpAnticipate = fable.newAnticipate();
let tmpPostErrorRan = false;

tmpAnticipate.anticipate(function (fCallback)
{
	console.log('Step 1 running');
	fCallback();
});
tmpAnticipate.anticipate(function (fCallback)
{
	console.log('Step 2 failing');
	fCallback(new Error('Something went wrong'));
});
tmpAnticipate.anticipate(function (fCallback)
{
	// This will NOT run because the previous step errored
	tmpPostErrorRan = true;
	fCallback();
});
tmpAnticipate.wait(function (pError)
{
	console.log('Error:', pError);          // Error: Something went wrong
	console.log('Step 3 ran:', tmpPostErrorRan);  // false
});
```

### Error Recovery

To handle errors without bailing out, catch them inside the step and continue:

```javascript
const tmpAnticipate = fable.newAnticipate();
let tmpRecoveredError = null;

tmpAnticipate.anticipate(function (fCallback)
{
	try
	{
		riskyOperation();
		fCallback();
	}
	catch (pError)
	{
		tmpRecoveredError = pError;
		fCallback();  // No error passed — pipeline continues
	}
});
tmpAnticipate.anticipate(function (fCallback)
{
	if (tmpRecoveredError)
	{
		console.log('Recovered from:', tmpRecoveredError);
	}
	fCallback();
});
tmpAnticipate.wait(function (pError)
{
	console.log('Pipeline completed');
});
```

## Use Cases

### Database Migrations

```javascript
const tmpMigrate = fable.newAnticipate();

tmpMigrate.anticipate(function (fCallback)
{
	db.query('CREATE TABLE users...', fCallback);
});
tmpMigrate.anticipate(function (fCallback)
{
	db.query('CREATE TABLE posts...', fCallback);
});
tmpMigrate.anticipate(function (fCallback)
{
	db.query('CREATE INDEX...', fCallback);
});
tmpMigrate.wait(function (pError)
{
	if (pError) console.error('Migration failed:', pError);
	else console.log('Migration complete');
});
```

### API Request Chains

```javascript
const tmpWorkflow = fable.newAnticipate();
let tmpToken = null;
let tmpData = null;

tmpWorkflow.anticipate(function (fCallback)
{
	api.login(credentials, function (pToken)
	{
		tmpToken = pToken;
		fCallback();
	});
});
tmpWorkflow.anticipate(function (fCallback)
{
	api.getData(tmpToken, function (pData)
	{
		tmpData = pData;
		fCallback();
	});
});
tmpWorkflow.anticipate(function (fCallback)
{
	process(tmpData);
	fCallback();
});
tmpWorkflow.wait(function (pError)
{
	if (pError) console.error('Workflow failed:', pError);
});
```

### Parallel Operations

```javascript
const tmpParallel = fable.newAnticipate();
tmpParallel.maxOperations = 3;  // Run up to 3 at a time

tmpParallel.anticipate(function (fCallback)
{
	fetchFromServiceA(function () { fCallback(); });
});
tmpParallel.anticipate(function (fCallback)
{
	fetchFromServiceB(function () { fCallback(); });
});
tmpParallel.anticipate(function (fCallback)
{
	fetchFromServiceC(function () { fCallback(); });
});
tmpParallel.wait(function (pError)
{
	console.log('All fetches complete');
});
```

### Build Pipeline

```javascript
const tmpBuild = fable.newAnticipate();

tmpBuild.anticipate(function (fCallback)
{
	cleanBuildDir(fCallback);
});
tmpBuild.anticipate(function (fCallback)
{
	compile(fCallback);
});
tmpBuild.anticipate(function (fCallback)
{
	bundle(fCallback);
});
tmpBuild.anticipate(function (fCallback)
{
	minify(fCallback);
});
tmpBuild.wait(function (pError)
{
	if (pError) throw pError;
	console.log('Build complete');
});
```

## Multiple Instances

Create multiple independent workflows:

```javascript
const tmpUserWorkflow = fable.newAnticipate();
const tmpOrderWorkflow = fable.newAnticipate();

// These run independently
tmpUserWorkflow.anticipate(function (fCallback) { /* ... */ fCallback(); });
tmpUserWorkflow.wait(function (pError) { /* ... */ });

tmpOrderWorkflow.anticipate(function (fCallback) { /* ... */ fCallback(); });
tmpOrderWorkflow.wait(function (pError) { /* ... */ });
```
