/**
* Unit tests for Fable
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');

const libFS = require('fs');

var Chai = require("chai");
var Expect = Chai.expect;

suite
(
	'Date Manipulation',
	function()
	{
		suite
		(
			'Manipulate Dates',
			function()
			{
				test
				(
					'Get a Date and Format it',
					function(fDone)
					{
						let testFable = new libFable();
						let tmpDates = testFable.instantiateServiceProvider('Dates');

						testFable.log.info(`Guessing your timezone: ${tmpDates.dayJS.tz.guess()}`);

						let tmpDate = tmpDates.dayJS.utc("2023-08-10T05:00:00.000Z");
						testFable.log.trace(`Date formats to: ${tmpDate.format()}`);
						let tmpDateCentral = tmpDate.tz("America/Chicago");
						testFable.log.trace(`Date Central formats to: ${tmpDateCentral.format()}`);
						let tmpDatePacific = tmpDate.tz("America/Los_Angeles");
						testFable.log.trace(`Date Pacific formats to: ${tmpDatePacific.format()}`);

						return fDone();
					}
				);
			}
		);
	}
);