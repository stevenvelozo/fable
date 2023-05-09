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
			'Format Dates and Times',
			()=>
			{
				test
				(
					'Format a time span in milliseconds to a human readable string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
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
						let _DataFormat = testFable.defaultServices.DataFormat;
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
						let _DataFormat = testFable.defaultServices.DataFormat;
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
						let _DataFormat = testFable.defaultServices.DataFormat;
						Expect(_DataFormat
							.formatSortableStringFromDate(new Date('10/20/1986')))
							.to.equal('19860920');
						return fTestComplete();
					}
				)
			}
		);
	}
);
