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

						Expect(tmpDates.dateFromParts(2023, 8, 10, 5, 0, 0, 0)).to.equal("2023-08-10T05:00:00.000Z");
						Expect(tmpDates.dateFromParts(2023, 8, 10)).to.equal("2023-08-10T00:00:00.000Z");
						Expect(tmpDates.dateFromParts(2023, 12, 31, 23, 59, 59, 999)).to.equal("2023-12-31T23:59:59.999Z");

						return fDone();
					}
				);
				test
				(
					'Get time differences between dates.',
					function(fDone)
					{
						let testFable = new libFable();
						let tmpDates = testFable.instantiateServiceProvider('Dates');

						const tmpFirstDate = "2023-08-10T05:00:00.000Z";
						const tmpSecondDate = "2023-08-11T05:00:00.000Z"; // 1 day later, precisely
						const tmpThirdDate = "2023-03-11T11:01:01.030Z";
						const tmpFourthDate = "2025-12-25T00:00:00.000Z";

						Expect(tmpDates.dateMillisecondDifference(tmpFirstDate, tmpSecondDate)).to.equal(86400000);
						Expect(tmpDates.dateSecondDifference(tmpFirstDate, tmpSecondDate)).to.equal(86400);
						Expect(tmpDates.dateMinuteDifference(tmpFirstDate, tmpSecondDate)).to.equal(1440);
						Expect(tmpDates.dateHourDifference(tmpFirstDate, tmpSecondDate)).to.equal(24);
						Expect(tmpDates.dateDayDifference(tmpFirstDate, tmpSecondDate)).to.equal(1);
						Expect(tmpDates.dateWeekDifference(tmpFirstDate, tmpSecondDate)).to.equal(0);
						Expect(tmpDates.dateMonthDifference(tmpFirstDate, tmpSecondDate)).to.equal(0);
						Expect(tmpDates.dateYearDifference(tmpFirstDate, tmpSecondDate)).to.equal(0);

						Expect(tmpDates.dateMillisecondDifference(tmpFirstDate, tmpThirdDate)).to.equal(-13111138970);
						Expect(tmpDates.dateSecondDifference(tmpFirstDate, tmpThirdDate)).to.equal(-13111138);
						Expect(tmpDates.dateHourDifference(tmpFirstDate, tmpThirdDate)).to.equal(-3641);
						Expect(tmpDates.dateDayDifference(tmpFirstDate, tmpThirdDate)).to.equal(-151);
						Expect(tmpDates.dateWeekDifference(tmpFirstDate, tmpThirdDate)).to.equal(-21);
						Expect(tmpDates.dateMonthDifference(tmpFirstDate, tmpThirdDate)).to.equal(-4);
						Expect(tmpDates.dateYearDifference(tmpFirstDate, tmpThirdDate)).to.equal(0);

						Expect(tmpDates.dateMillisecondDifference(tmpFirstDate, tmpFourthDate)).to.equal(74977200000);
						Expect(tmpDates.dateSecondDifference(tmpFirstDate, tmpFourthDate)).to.equal(74977200);
						Expect(tmpDates.dateHourDifference(tmpFirstDate, tmpFourthDate)).to.equal(20827);
						Expect(tmpDates.dateDayDifference(tmpFirstDate, tmpFourthDate)).to.equal(867);
						Expect(tmpDates.dateWeekDifference(tmpFirstDate, tmpFourthDate)).to.equal(123);
						Expect(tmpDates.dateMonthDifference(tmpFirstDate, tmpFourthDate)).to.equal(28);
						Expect(tmpDates.dateYearDifference(tmpFirstDate, tmpFourthDate)).to.equal(2);

						// Test required end date behavior, specifically for solvers
						Expect(tmpDates.dateYearDifference(tmpFirstDate, null, "1")).to.be.NaN;
						Expect(tmpDates.dateYearDifference(tmpFirstDate, null)).to.not.be.NaN;
						return fDone();
					}
				);
				test
				(
					'Add or remove time from dates.',
					function(fDone)
					{
						let testFable = new libFable();
						let tmpDates = testFable.instantiateServiceProvider('Dates');

						const tmpFirstDate = "2023-08-10T05:00:00.000Z";
						const tmpSecondDate = "2023-08-11T05:00:00.000Z"; // 1 day later, precisely
						const tmpThirdDate = "2023-03-11T11:01:01.030Z";
						const tmpFourthDate = "2025-12-25T00:00:00.000Z";

						Expect(tmpDates.dateAddDays(tmpFirstDate, 1)).to.equal(tmpSecondDate);
						Expect(tmpDates.dateAddHours(tmpFirstDate, 24)).to.equal(tmpSecondDate);
						Expect(tmpDates.dateAddHours(tmpFirstDate, "24")).to.equal(tmpSecondDate);
						Expect(tmpDates.dateAddMinutes(tmpFirstDate, 1440)).to.equal(tmpSecondDate);
						Expect(tmpDates.dateAddSeconds(tmpFirstDate, 86400)).to.equal(tmpSecondDate);
						Expect(tmpDates.dateAddMilliseconds(tmpFirstDate, 86400000)).to.equal(tmpSecondDate);

						Expect(tmpDates.dateAddDays(tmpSecondDate, -1)).to.equal(tmpFirstDate);
						Expect(tmpDates.dateAddDays(tmpSecondDate, "-1")).to.equal(tmpFirstDate);

						return fDone();
					}
				);
			}
		);
	}
);