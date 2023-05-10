Fable Overview
=====

It is tiring to setup logging and settings management in every application you write. Fable provides a single line solution to have simple logging to the console and file, with the options for plugins to things like bunyan and graylog. Add a simple configuration object and it can also write the log to a file. Or even mongodb!

## Install

```sh
$ npm install fable
```

## Quick Start

You can have basic low-level application services in a single line of code.

```js
const libFable = require('fable');

var fable = new libFable();

fable.log.info('What are you doing, Dave?', {SomeColorSetting: 'Red', CurrentFolder: __dirname });
```

Which will output the following to the terminal:
```
$ node index.js
2023-05-09T23:04:34.041Z [info] (ApplicationNameHere): What are you doing, Dave?
{
  "SomeColorSetting": "Red",
  "CurrentFolder": "/Users/steven/Code/retold/modules/fable/fable/debug"
}
```

## Logging

If you want logging to go to a file, you can do that too.  Just configure the `LogStreams` array in the settings object like so (everything but the `loggertype` and `path` are optional):

```js
{
	Product:'SimpleFlatFileTest',
	LogStreams:
		[
			{
				// The loggertype is what tells fable-log to write to files
				loggertype:'simpleflatfile',
				outputloglinestoconsole: false,
				showtimestamps: true,
				formattedtimestamps: true,
				level:'trace',
				// The path is where it writes the files
				path: '/tmp/Fable-Log-Test.log'
			}
		]
}
```

As long as the `/tmp` folder exists and is writable, fable will write to that log file.

### Log Streams are Plugins for Fable-Log

If you want to create your own adapter for log streams, it is easily extensible.  You can write your own plugin for fable-log, and include it during initialization.  (examples to come)

### Log Streams are Multiplexed

You can decide to use multiple log streams simultaneously.  If fable-log doesn't recognize the stream type in the configuration it falls back to terminal.  *note this means it can lead to multiple copies of the same log entry*.  You broke it, you bought it.

Below is a JSON configuration example containing two log streams:

```
{
	"Product": "MyApplicationNameHere",
	"ProductVersion": "3.1.9",

	"UUID":
		{
			"DataCenter": 0,
			"Worker": 0
		},
	"LogStreams":
		[
			{
				"level": "trace",
				"loggertype":"simpleflatfile",
				"path": "./Logs/Application.log"
			},
			{
				"level": "trace",
				"streamtype": "process.stdout"
			}
		]
}
```


### Log Levels _Fable.log.info(message, rawObject)

Writes a log message to the `info` log level.  All [bunyan](https://github.com/trentm/node-bunyan) log levels are supported, as the log object here is just a reference to bunyan.

This means you can also use the following log levels (taken from the bunyan documentation):

* `fatal` (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
* `error` (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
* `warn` (40): A note on something that should probably be looked at by an operator eventually.
* `info` (30): Detail on regular operation.
* `debug` (20): Anything else, i.e. too verbose to be included in "info" level.
* `trace` (10): Logging from external libraries used by your app or very detailed application logging.

Fun note -- if you use a `_Fable.log.fatal('Oh my gosh cats are everywhere!')` call to the `fatal` stream, the bunyon console logger will invert the text by the log entry making it easier to see.

__Arguments__

* `message` - A string message for the log entry text
* `rawObject` - A javascript object containing anything else you want logged

__Example__

```js
fable.log.info('What are you doing, Dave?', {SomeColor: 'Red', CurrentFolder: __dirname });
// This just wrote out a nice log line to wherever you have your log streams pointing to
```


---------------------------------------

## Application Settings

The excellent white paper [Out of the Tar Pit](http://shaffner.us/cs/papers/tarpit.pdf) describes a critical problem with how we manage state in most large-scale application designs.  One of the fronts we use to combat this state management issue is by separating the non-business state of the application out.  The easiest example of this is the address list for other servers in your data center.  We certainly need to know the address of the database server, but this address has nothing to do with how many widgets are in stock for your site visitors to purchase.

Therefore we provide a configuration management system in Fable.  You can load thse configurations from files, pass them in or modify them in real-time.

These configuration settings are meant to be just the state your application needs to run in its environment and as configured.

You can pass settings into fable in the constructor:

```js
var _Fable = require('fable').new({Product: 'MyProduct', ProductVersion: '1.3.8'});

// Fill in other settings
_Fable.settingsManager.fill({ApacheStormAddress: '192.168.167.100'});

// Now access a setting
console.log("Apache Storm is located at: "+_Fable.settings.ApacheStormAddress);

// ...printing out "Apache Storm is located at: 192.168.167.100" to the console
```


### _Fable.settings

Access to the settings values which have been set.  Fable comes with a number of default settings:

```js
	// Default Fable settings
	var _SettingsDefaults = (
	{
		// This is used for logging and API identification
		Product: 'Fable',
		ProductVersion: '0.0.0',

		// The default port for an API server
		APIServerPort: 8080,

		// The location for a config file to load
		ConfigFile: false,

		// Identification for the log and record GUID generators
		UUID: (
			{
				DataCenter: 0,
				Worker: 0
			}),

		// The session handler configuration
		SessionStrategy: "memcached",
		MemcachedURL: "127.0.0.1:11211",

		// The MongoDB URL (this is used by the logger)
		MongoDBURL:"mongodb://127.0.0.1/Fable",

		// The MySQL Server connection data
		MySQL:
			{
				"Server": "127.0.0.1",
				"Port": 3306,
				"User": "ENTER_USER_HERE",
				"Password": "ENTER_PASSWORD_HERE",
				"Database": "ENTER_DATABASE_HERE",
				"ConnectionPoolLimit": 20
			},

		// A sane default log stream
		LogStreams: [{streamtype:'process.stdout', level:'trace'}]
	});
```

__Example__

```js
console.log("Wiring up routes for "+_Fable.settings.Product);

// Which writes "Wiring up routes for WHATEVER_VALUE_YOU_PUT_IN_THE_PRODUCT_SETTING"
```


### _Fable.new(settingsObject)

Constructs the fable object and sets the *default settings* to whatever is passed in as `settingsObject`.  Fable allows you to create clones by calling `Fable.new()` from any fable object, and these clones will use the same default settings as passed in with the first construction.

__Arguments__

* `settingsObject` - An object to use as the default settings

__Example__

```js
var _Fable = require('fable').new({Product: 'MyCoolProduct', ProductVersion: '1.13.8'});
// _Fable is now ready to use.
```


### _Fable.settingsManager.fill(settingsObject)

Fills in values in the settings object without overwriting values already there.  This is especially useful for maintaining libraries that rely on fable.  You can `fill` any required settings to default values after your library has been instantiated.

__Arguments__

* `settingsObject` - An object to fill in settings with

__Example__

```js
// Assuming the _Fable has already been initialized
_Fable.settingsManager.fill({MaximumThumbnailCacheSize: 50});

// If MaximumThumbnailCacheSize was not set, it is now!
```


### _Fable.settingsManager.merge(settingsObject)

Merge in values to settings, destructively overwriting previous values if they were already there.

__Arguments__

* `settingsObject` - An object to merge into settings

__Example__

```js
// Assuming the _Fable has already been initialized
_Fable.settingsManager.merge({RequestTimeout: 1500});

// Regardless of whether RequestTimeout was set before merge, it is now 1500
```

---------------------------------------

## Universally Unique Identifiers

When instantiating fable, you can define a couple configuration values which will help generate UUIDs with some encoded information.  This includes the DataCenter and Worker portions of the settings object.  These two values are then deconstructible from the UUIDs generated using the following code:


```js
var fable = require('fable').new();

var uuid = fable.getUUID();

console.log('My UUID is: '+uuid);
```

Resulting in:

```
steven at MathBookPro in ~/FableTest
$ node index.js
My UUID is: 0x53e122bc8f400000
steven at MathBookPro in ~/FableTest
$ node index.js
My UUID is: 0x53e122c213800000
```



### _Fable.getUUID()

Return a unique identifier, with encoded information about the data center and worker portion of the configuration file.

__Example__

```js
// Assuming the _Fable has already been initialized
var uuid = fable.getUUID();

// The uuid variable now contains a unique string.
```
