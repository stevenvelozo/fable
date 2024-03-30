/**
* Unit tests for Fable Math
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
	'Math',
	function()
	{
		suite
		(
			'Math Operations',
			function()
			{
				test
				(
					'Exercise Math Tests',
					function(fDone)
					{
						let testFable = new libFable();

						Expect(testFable.Math.addPrecise(1, 1)).to.equal('2');
						// 3.3333333333333333333333333333333 in the current node.js implementation collapses to 3.3333333333333335
						Expect(testFable.Math.addPrecise(1, '3.3333333333333333333333333333333')).to.equal('4.3333333333333333333333333333333');
						// Similarly mantissa problems occur with decimals
						// So for plain javascript:     0.1 + 0.2 = 0.30000000000000004
						Expect(testFable.Math.addPrecise(0.1, 0.2)).to.equal('0.3');
						Expect(testFable.Math.subtractPrecise(1, 1)).to.equal('0');
						Expect(testFable.Math.multiplyPrecise(1, 1)).to.equal('1');
						Expect(testFable.Math.dividePrecise(1, 1)).to.equal('1');
						Expect(testFable.Math.percentagePrecise(1, 1)).to.equal('100');
						Expect(testFable.Math.percentagePrecise(1, 0)).to.equal('0');
						Expect(testFable.Math.percentagePrecise(0, 1)).to.equal('0');
						Expect(testFable.Math.percentagePrecise(0, 0)).to.equal('0');
						Expect(testFable.Math.percentagePrecise(500, 100)).to.equal('500');
						Expect(testFable.Math.percentagePrecise(100, 500)).to.equal('20');
						
						return fDone();
					}
				);
				test
				(
					'Parse Numbers',
					function(fDone)
					{
						let testFable = new libFable();

						Expect(testFable.Math.parsePrecise(1)).to.equal('1');
						// 3.3333333333333333333333333333333 in the current node.js implementation collapses to 3.3333333333333335
						Expect(testFable.Math.parsePrecise('4.3333333333333333333333333333333')).to.equal('4.3333333333333333333333333333333');
						Expect(testFable.Math.parsePrecise(undefined)).to.equal('0.0');
						
						return fDone();
					}
				);

				test
				(
					'Round Numbers',
					function(fDone)
					{
						let testFable = new libFable();

						Expect(testFable.Math.roundPrecise(1.123456789, 2)).to.equal('1.12');
						Expect(testFable.Math.roundPrecise(1.123456789, 4)).to.equal('1.1235');
						Expect(testFable.Math.roundPrecise(1.123456789, 8)).to.equal('1.12345679');
						Expect(testFable.Math.roundPrecise(1.123456789, 10)).to.equal('1.123456789');
						Expect(testFable.Math.roundPrecise(1.123456789, 12)).to.equal('1.123456789');
						Expect(testFable.Math.roundPrecise(1.123456789, 14)).to.equal('1.123456789');

						Expect(testFable.Math.roundPrecise(undefined, 2)).to.equal('0');

						try
						{
							testFable.Math.roundPrecise(null, 2, testFable.Math.roundHalfUp)
						}
						catch(pError)
						{
							Expect(pError).to.be.an.instanceof(Error);
							Expect(pError.message).to.equal('[big.js] Invalid number');
						}

						Expect(testFable.Math.roundPrecise('867530999999999.71263219214217312', 15, testFable.Math.roundDown)).to.equal('867530999999999.712632192142173');
						Expect(testFable.Math.roundPrecise('867530999999999.71263519214217312', 5, testFable.Math.roundUp)).to.equal('867530999999999.71264');
						Expect(testFable.Math.roundPrecise('867530999999999.71263519214217312', 5, testFable.Math.roundHalfUp)).to.equal('867530999999999.71264');
						Expect(testFable.Math.roundPrecise('867530999999999.71263519214217312', 5, testFable.Math.roundHalfEven)).to.equal('867530999999999.71264');
						Expect(testFable.Math.roundPrecise('867530999999999.71663519214217312', 2, testFable.Math.roundHalfEven)).to.equal('867530999999999.72');
						Expect(testFable.Math.roundPrecise('867530999999999.71263519214217312', 4, testFable.Math.roundHalfEven)).to.equal('867530999999999.7126');

						return fDone();
					}
				);
				test
				(
					'Cast To Fixed Numbers',
					function(fDone)
					{
						let testFable = new libFable();

						Expect(testFable.Math.toFixedPrecise(1.123456789, 2)).to.equal('1.12');
						Expect(testFable.Math.toFixedPrecise(1.123456789, 4)).to.equal('1.1235');
						Expect(testFable.Math.toFixedPrecise(1.123456789, 8)).to.equal('1.12345679');
						Expect(testFable.Math.toFixedPrecise(1.123456789, 10)).to.equal('1.1234567890');
						Expect(testFable.Math.toFixedPrecise(1.123456789, 12)).to.equal('1.123456789000');
						Expect(testFable.Math.toFixedPrecise(1.123456789, 14)).to.equal('1.12345678900000');

						Expect(testFable.Math.toFixedPrecise(undefined, 2)).to.equal('0.00');

						try
						{
							testFable.Math.toFixedPrecise(null, 2, testFable.Math.roundHalfUp)
						}
						catch(pError)
						{
							Expect(pError).to.be.an.instanceof(Error);
							Expect(pError.message).to.equal('[big.js] Invalid number');
						}

						Expect(testFable.Math.toFixedPrecise('867530999999999.71263219214217312', 15, testFable.Math.roundDown)).to.equal('867530999999999.712632192142173');
						Expect(testFable.Math.toFixedPrecise('867530999999999.71263519214217312', 5, testFable.Math.roundUp)).to.equal('867530999999999.71264');
						Expect(testFable.Math.toFixedPrecise('867530999999999.71263519214217312', 5, testFable.Math.roundHalfUp)).to.equal('867530999999999.71264');
						Expect(testFable.Math.toFixedPrecise('867530999999999.71263519214217312', 5, testFable.Math.roundHalfEven)).to.equal('867530999999999.71264');
						Expect(testFable.Math.toFixedPrecise('867530999999999.71663519214217312', 2, testFable.Math.roundHalfEven)).to.equal('867530999999999.72');
						Expect(testFable.Math.toFixedPrecise('867530999999999.71', 4, testFable.Math.roundHalfEven)).to.equal('867530999999999.7100');

						return fDone();
					}
				);
			}
		);
	}
);