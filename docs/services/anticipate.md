# Anticipate Service

The Anticipate service provides asynchronous operation sequencing, allowing you to chain operations and manage async workflows.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const tmpAnticipateService = fable.instantiateServiceProvider('Anticipate');
console.log('Service instance:', typeof tmpAnticipateService);

// Or use the factory method (creates unregistered instance)
const tmpAnticipateFactory = fable.newAnticipate();
console.log('Factory instance:', typeof tmpAnticipateFactory);
```

## Basic Usage

### Sequential Operations

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

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
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

// Stubbed async helpers for the playground demo
function fetchUser(pId, fCallback) { setTimeout(() => fCallback({ id: pId, name: 'User#' + pId }), 5); }
function loadPreferences(pId, fCallback) { setTimeout(() => fCallback({ theme: 'dark' }), 5); }
function render(pUser, pPrefs) { console.log('rendered:', pUser, pPrefs); }

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
	else
	{
		console.log('Workflow done.');
	}
});
```

## API Reference

### anticipate(fAsynchronousFunction)

Add an asynchronous operation to the queue. Operations run sequentially by default (one at a time).

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });
const tmpAnticipate = fable.newAnticipate();

tmpAnticipate.anticipate(function (fCallback)
{
	// Do async work
	console.log('async work running');
	fCallback();  // Call when done, or fCallback(pError) to signal failure
});
tmpAnticipate.wait(function (pError) { console.log('wait done, pError:', pError); });
```

The step function receives one parameter:
- `fCallback` -- Callback to signal completion. Pass an error to bail out: `fCallback(new Error('something failed'))`

### wait(fCallback)

Register a callback to run when all queued operations complete (or when an error occurs):

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });
const tmpAnticipate = fable.newAnticipate();

tmpAnticipate.anticipate(function (fCallback) { console.log('step done'); fCallback(); });
tmpAnticipate.wait(function (pError)
{
	if (pError)
	{
		console.error('Error:', pError);
	}
	else
	{
		console.log('All operations completed');
	}
});
```

### maxOperations

Control concurrency. Default is `1` (sequential). Set higher for parallel execution:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

const tmpAnticipate = fable.newAnticipate();
tmpAnticipate.maxOperations = 5;  // Run up to 5 operations concurrently
console.log('maxOperations:', tmpAnticipate.maxOperations);
```

## Error Handling

### Error Bailout

When an operation passes an error to its callback, remaining queued operations are skipped and the `wait` callback fires immediately with the error:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

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
	console.log('Caught error:', pError && pError.message);   // Something went wrong
	console.log('Step 3 ran:',   tmpPostErrorRan);            // false
});
```

### Error Recovery

To handle errors without bailing out, catch them inside the step and continue:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

function riskyOperation() { throw new Error('demo failure'); }

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
		fCallback();  // No error passed -- pipeline continues
	}
});
tmpAnticipate.anticipate(function (fCallback)
{
	if (tmpRecoveredError)
	{
		console.log('Recovered from:', tmpRecoveredError.message);
	}
	fCallback();
});
tmpAnticipate.wait(function (pError)
{
	console.log('Pipeline completed, pError:', pError);
});
```

## Use Cases

### Database Migrations

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

// Stub DB driver for the playground demo
const db = { query: (sql, cb) => { console.log('SQL:', sql); cb(null); } };

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
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

// Stub API + credentials + process for the playground demo
const credentials = { user: 'demo', pass: 'demo' };
const api = {
	login:   (creds, cb) => setTimeout(() => cb('tok-' + Math.floor(Math.random() * 1000)), 5),
	getData: (tok,   cb) => setTimeout(() => cb({ rows: 3, tok }), 5)
};
function processData(pData) { console.log('processed data:', pData); }

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
	processData(tmpData);
	fCallback();
});
tmpWorkflow.wait(function (pError)
{
	if (pError) console.error('Workflow failed:', pError);
	else console.log('Workflow OK; token:', tmpToken);
});
```

### Parallel Operations

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

// Stub fetchers for the playground demo
function fetchFromServiceA(cb) { setTimeout(() => { console.log('A done'); cb(); }, 5); }
function fetchFromServiceB(cb) { setTimeout(() => { console.log('B done'); cb(); }, 5); }
function fetchFromServiceC(cb) { setTimeout(() => { console.log('C done'); cb(); }, 5); }

const tmpParallel = fable.newAnticipate();
tmpParallel.maxOperations = 3;  // Run up to 3 at a time

tmpParallel.anticipate(function (fCallback) { fetchFromServiceA(function () { fCallback(); }); });
tmpParallel.anticipate(function (fCallback) { fetchFromServiceB(function () { fCallback(); }); });
tmpParallel.anticipate(function (fCallback) { fetchFromServiceC(function () { fCallback(); }); });
tmpParallel.wait(function (pError)
{
	console.log('All fetches complete');
});
```

### Build Pipeline

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

// Stub build steps for the playground demo
function cleanBuildDir(cb) { console.log('clean'); cb(); }
function compile(cb)       { console.log('compile'); cb(); }
function bundle(cb)        { console.log('bundle'); cb(); }
function minify(cb)        { console.log('minify'); cb(); }

const tmpBuild = fable.newAnticipate();

tmpBuild.anticipate(function (fCallback) { cleanBuildDir(fCallback); });
tmpBuild.anticipate(function (fCallback) { compile(fCallback); });
tmpBuild.anticipate(function (fCallback) { bundle(fCallback); });
tmpBuild.anticipate(function (fCallback) { minify(fCallback); });
tmpBuild.wait(function (pError)
{
	if (pError) throw pError;
	console.log('Build complete');
});
```

## Multiple Instances

Create multiple independent workflows:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'AnticipateDemo', ProductVersion: '1.0.0' });

const tmpUserWorkflow  = fable.newAnticipate();
const tmpOrderWorkflow = fable.newAnticipate();

// These run independently
tmpUserWorkflow.anticipate(function (fCallback) { console.log('user step');  fCallback(); });
tmpUserWorkflow.wait(function (pError) { console.log('user workflow done'); });

tmpOrderWorkflow.anticipate(function (fCallback) { console.log('order step'); fCallback(); });
tmpOrderWorkflow.wait(function (pError) { console.log('order workflow done'); });
```
