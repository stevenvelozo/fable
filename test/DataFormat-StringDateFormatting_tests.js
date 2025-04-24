/**
* Unit tests for DataArithmatic
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');

var Chai = require("chai");
var Expect = Chai.expect;

suite
(
	'DataArithmatic Date',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Format and Calculate Dates and Times',
			()=>
			{
				test
				(
					'Calculate the difference in days between two dates',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						Expect(testFable.Dates.dateDayDifference('2021-03-12', '2023-09-01'))
							.to.equal(903);
						Expect(testFable.Dates.dateDayDifference('2023-08-01', '2023-09-01'))
							.to.equal(31);
						Expect(testFable.Dates.dateDayDifference('2023-09-01', '2023-10-01'))
							.to.equal(30);
						Expect(testFable.Dates.dateDayDifference('2023-9-1', '2023-10-01'))
							.to.equal(30);
						Expect(testFable.Dates.dateWeekDifference('2023-9-1', '2023-10-01'))
							.to.equal(4);
						Expect(testFable.Dates.dateMonthDifference('1986-10-01', '2023-09-01'))
							.to.equal(443);
						Expect(testFable.Dates.dateYearDifference('1986-10-01', '2023-09-01'))
							.to.equal(36);
						Expect(testFable.Dates.dateYearDifference('1986-08-01', '2023-09-01'))
							.to.equal(37);
						Expect(testFable.Dates.dateYearDifference('1986-08-31', '2023-09-01'))
							.to.equal(37);
						let tmpValue = testFable.Dates.dateDayDifference('BadDatesIncoming', '2023-09-01');
						Expect(tmpValue)
							.to.be.NaN;

						tmpValue = testFable.Dates.dateDayDifference();
						Expect(tmpValue)
							.to.be.NaN;
						return fTestComplete();
					}
				);
				test
				(
					'Format a time span in milliseconds to a human readable string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatTimeSpan(1000))
							.to.equal('00:00:01.000');
						Expect(_DataFormat
							.formatTimeSpan(100243231))
							.to.equal('27:50:43.231');
						Expect(_DataFormat
							.formatTimeSpan(100299211))
							.to.equal('27:51:39.211');
						Expect(_DataFormat
							.formatTimeSpan())
							.to.equal('');
						return fTestComplete();
					}
				);
				test
				(
					'Format a time span in milliseconds to a human readable string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatTimeSpan(1000))
							.to.equal('00:00:01.000');
						Expect(_DataFormat
							.formatTimeSpan(100243231))
							.to.equal('27:50:43.231');
						Expect(_DataFormat
							.formatTimeSpan(100299211))
							.to.equal('27:51:39.211');
						Expect(_DataFormat
							.formatTimeSpan())
							.to.equal('');
						return fTestComplete();
					}
				);
				test
				(
					'Format a time delta in milliseconds to a human readable string',
					(fTestComplete) =>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatTimeDelta(1000, 2000))
							.to.equal('00:00:01.000');
						Expect(_DataFormat
							.formatTimeDelta(10000, 20234320230))
							.to.equal('5620:38:30.230');
						Expect(_DataFormat
							.formatTimeDelta(10000))
							.to.equal('');
						Expect(_DataFormat
							.formatTimeDelta())
							.to.equal('');
						fTestComplete();
					}
				);
				test
				(
					'Get a month string from a date',
					(fTestComplete) =>
					{
						let testFable = new libFable();
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.getMonthFromDate(new Date('10/20/1988')))
							.to.equal('October');
						Expect(_DataFormat
							.getMonthFromDate(new Date('3/20/1988')))
							.to.equal('March');
						Expect(_DataFormat
							.getMonthAbbreviatedFromDate(new Date('3/20/1988')))
							.to.equal('Mar');
						// TODO: Unsure if this is how we want to deal with these.
						Expect(_DataFormat
							.getMonthAbbreviatedFromDate(new Date('13/20/1988')))
							.to.equal(undefined);
						return fTestComplete();
					}
				);
				test
				(
					'Get a sortable string from a date',
					(fTestComplete) =>
					{
						let testFable = new libFable();
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatSortableStringFromDate(new Date('10/20/1986')))
							.to.equal('19860920');
						return fTestComplete();
					}
				)
				test
				(
					'Get a human readable string from date',
					(fTestComplete) =>
					{
						let testFable = new libFable();
						let _DataFormat = testFable.services.DataFormat;
						let tmpDateInput = new Date('1/02/1986');
						Expect(_DataFormat
							.formatMonthDayYearFromDate(tmpDateInput, true))
							.to.equal('01/02/1986');
						return fTestComplete();
					}
				)
				test
				(
					'Get a human readable string from date no zerofill',
					(fTestComplete) =>
					{
						let testFable = new libFable();
						let _DataFormat = testFable.services.DataFormat;
						let tmpDateInput = new Date('06/02/1999');
						Expect(_DataFormat
							.formatMonthDayYearFromDate(tmpDateInput, false))
							.to.equal('6/2/1999');
						return fTestComplete();
					}
				)
			}
		);
	}
);
