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
	'DataArithmatic Number',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Format Number Strings',
			()=>
			{
				test
				(
					'Test adding commas to a number',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatterAddCommasToNumber(1000))
							.to.equal('1,000');
						Expect(_DataFormat
							.formatterAddCommasToNumber('This is not a number'))
							.to.equal('This is not a number');
						Expect(_DataFormat
							.formatterAddCommasToNumber(102931021))
							.to.equal('102,931,021');
						Expect(_DataFormat
							.formatterAddCommasToNumber(-100000000.7333312))
							.to.equal('-100,000,000.7333312');
						Expect(_DataFormat
							.formatterAddCommasToNumber(`$8675309.75`))
							.to.equal('$8675309.75');
						return fTestComplete();
					}
				);
				test
				(
					'Test formatting dollars',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatterDollars(1000))
							.to.equal('$1,000.00');
						Expect(_DataFormat
							.formatterDollars(1000.011))
							.to.equal('$1,000.01');
						Expect(_DataFormat
							.formatterDollars(1000.013))
							.to.equal('$1,000.01');
						Expect(_DataFormat
							.formatterDollars(1000.014))
							.to.equal('$1,000.01');
						Expect(_DataFormat
							.formatterDollars(1000.015))
							.to.equal('$1,000.02');
						Expect(_DataFormat
							.formatterDollars(1000.017))
							.to.equal('$1,000.02');
						Expect(_DataFormat
							.formatterDollars(1000.019))
							.to.equal('$1,000.02');
						Expect(_DataFormat
							.formatterDollars(1000.021))
							.to.equal('$1,000.02');
						Expect(_DataFormat
							.formatterDollars(1000.515))
							.to.equal('$1,000.52');
						Expect(_DataFormat
							.formatterDollars('Not dollars!'))
							.to.equal('--');
						Expect(_DataFormat
							.formatterDollars(10000))
							.to.equal('$10,000.00');
						Expect(_DataFormat
							.formatterDollars(null))
							.to.equal('--');
						Expect(_DataFormat
							.formatterDollars(-8675309.75))
							.to.equal('$-8,675,309.75');
						Expect(_DataFormat
							.formatterDollars(72.3198))
							.to.equal('$72.32');
						Expect(_DataFormat
							.formatterDollars(72.3119))
							.to.equal('$72.31');
						return fTestComplete();
					}
				);
				test
				(
					'Test rounding numbers',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.formatterRoundNumber(1000, 2))
							.to.equal('1000.00');
						Expect(_DataFormat
							.formatterRoundNumber(null, 2))
							.to.equal('');
						Expect(_DataFormat
							.formatterRoundNumber(1000.129, 2))
							.to.equal('1000.13');
						Expect(_DataFormat
							.formatterRoundNumber(1000.781))
							.to.equal('1000.78');
						Expect(_DataFormat
							.formatterRoundNumber(867.5309, 3))
							.to.equal('867.531');
						Expect(_DataFormat
							.formatterRoundNumber(-732.777, 2))
							.to.equal('-732.78');
						Expect(_DataFormat
							.formatterRoundNumber('Not a number'))
							.to.equal('0.00');
						return fTestComplete();
					}
				);
			}
		);
		suite
		(
			'String Manipulation',
			()=>
			{
				test
				(
					'concatenateStrings concatenates an array of string-like objects',
					() =>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.concatenateStrings(undefined, 'test', 123))
							.to.equal('test123');
						Expect(_DataFormat
							.concatenateStrings('waffle', { }, null))
							.to.equal('waffle');
					}
				);
				test
				(
					'concatenateStringsRaw stringifies then concatenates an array of anything',
					() =>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.concatenateStringsRaw(undefined, 'test', 123))
							.to.equal('undefinedtest123');
						Expect(_DataFormat
							.concatenateStringsRaw('waffle', { }, null))
							.to.equal('waffle[object Object]null');
					}
				);
				test
				(
					'joinStrings joins an array of string-like objects',
					() =>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.joinStrings('/', undefined, 'test', 123))
							.to.equal('test/123');
						Expect(_DataFormat
							.joinStrings('/', 'waffle', { }, null))
							.to.equal('waffle');
					}
				);
				test
				(
					'joinStringsRaw stringifies then joins an array of anything',
					() =>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.joinStringsRaw('/', undefined, 'test', 123))
							.to.equal('undefined/test/123');
						Expect(_DataFormat
							.joinStringsRaw('/', 'waffle', { }, null))
							.to.equal('waffle/[object Object]/null');
					}
				);
			}
		);
	}
);
