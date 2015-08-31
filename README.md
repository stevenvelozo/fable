Fable
=====

[![Code Climate](https://codeclimate.com/github/stevenvelozo/fable/badges/gpa.svg)](https://codeclimate.com/github/stevenvelozo/fable)
[![Coverage Status](https://coveralls.io/repos/stevenvelozo/fable/badge.svg?branch=master)](https://coveralls.io/r/stevenvelozo/fable?branch=master)
[![Build Status](https://travis-ci.org/stevenvelozo/fable.svg?branch=master)](https://travis-ci.org/stevenvelozo/fable)
[![Dependency Status](https://david-dm.org/stevenvelozo/fable.svg)](https://david-dm.org/stevenvelozo/fable)
[![devDependency Status](https://david-dm.org/stevenvelozo/fable/dev-status.svg)](https://david-dm.org/stevenvelozo/fable#info=devDependencies)

It is tiring to setup logging and settings management in every application you write. Fable provides a single line solution to have simple logging to the console via [bunyan](https://github.com/trentm/node-bunyan). Add a simple configuration object and it can also write the log to a file. Or even mongodb!

## Install

```sh
$ npm install fable
```

## Quick Start

You can have basic low-level application services in a single line of code.

```js
var fable = require('fable').new();

fable.log.info('What are you doing, Dave?', {SomeColor: 'Red', CurrentFolder: __dirname });
```

Which will output the following to the terminal:
```
$ node index.js 
{"name":"Fable","hostname":"MathBookAir","pid":38807,"level":30,"Source":"0x53e0793606800000","ver":"0.0.0","datum":{"SomeColor":"Red","CurrentFolder":"/Users/steven/FableDemo1"},"msg":"What are you doing, Dave?","time":"2015-08-31T03:55:02.555Z","v":0}
```

From this example, you can learn the following:

* It is pretty simple to start using the library
* The logging output looks really wierd on a standard terminal.

## Logging

Fable uses the [bunyan](https://github.com/trentm/node-bunyan) logging library.  By default, the log messages all get sent to stdout.

To make the console log messages prettier, you can install the global bunyan library:

```sh
nim install -g bunyan
```

After which you can send logging output through bunyan, turning this from the quickstart above:

```
$ node index.js 
{"name":"Fable","hostname":"MathBookAir","pid":38807,"level":30,"Source":"0x53e0793606800000","ver":"0.0.0","datum":{"SomeColor":"Red","CurrentFolder":"/Users/steven/FableDemo1"},"msg":"What are you doing, Dave?","time":"2015-08-31T03:55:02.555Z","v":0}
```

Into something more readable:

```
$ node index.js |bunyan
[2015-08-31T04:06:10.230Z]  INFO: Fable/38992 on MathBookAir: What are you doing, Dave? (Source=0x53e07bc20d400000, ver=0.0.0)
    datum: {
      "SomeColor": "Red",
      "CurrentFolder": "/Users/steven/FableDemo1"
    }
```

If you want logging to go to a file, you can do that too.  Just configure the `LogStreams` array in the settings object like so:

```
{
	"Product": "MyApplicationNameHere",
	"ProductVersion": "2.1.8",

	"UUID":
		{
			"DataCenter": 0,
			"Worker": 0
		},
	"LogStreams":
		[
			{
				"level": "trace",
				"path": "./Logs/MyFavoriteLogFile.log"
			}
		]
}
```

As long as the `./Logs` folder exists, Bunyan will write to this log file instead.

We can stream log entries from a certain level or higher (e.g. in the previous example we are writing `trace` and higher log lines to the file).  You can then have a text log on rotation per application server, and a centralized mongodb log for the whole farm.

There are three log stream types supported:

 - console
 - text file
 - mongodb

Below is a JSON configuration example of each of the three log streams supported:

```
{
	"Product": "MyApplicationNameHere",
	"ProductVersion": "2.1.8",

	"UUID":
		{
			"DataCenter": 0,
			"Worker": 0
		},
	"LogStreams":
		[
			{
				"level": "trace",
				"path": "./Logs/Application.log"
			},
			{
				"level": "trace",
				"streamtype": "process.stdout"
			},
			{
				"level": "info",
				"streamtype": "mongodb"
			}
		]
}
```

## Application Settings

The excellent white paper (Out of the Tar Pit)[http://shaffner.us/cs/papers/tarpit.pdf] exposes a critical problem with how we deal with state in most large-scale application designs.  One of the fronts we use to combat this state management issue is by separating the non-business state of the application out.  The easiest example of this is the address list for other servers in your data center.  We certainly need to know the address of the database server, but the address has nothing to do with how many widgets are in stock for your site visitors to purchase.

Therefore we provide a configuration management system in Fable.  You can load thse configurations from files, pass them in or modify them in real-time.

You can pass settings into fable in the constructor:

```js
var _Fable = require('fable').new({Product: 'MyProduct', ProductVersion: '1.3.8'});
// Merge in passed-in settings
_Fable.settingsManager.fill(_SettingsDefaults);
```

## Universally Unique Identifiers

When instantiating fable, you can define a couple configuration values which will help generate UUIDs with some encoded information.  This includes DataCenter and Worker.  These two values are then deconstructible from the UUIDs that get generated using the following code:


```js
var fable = require('fable').new();

var uuid = fable.getUUID();
```
