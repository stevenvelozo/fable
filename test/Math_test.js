/**
* Unit tests for Fable Math
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const libFable = require('../source/Fable.js');

const Chai = require("chai");
const Expect = Chai.expect;

const _ChocoData = require(`./data/chocodata.json`);

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

						Expect(testFable.Math.powerPrecise(4,4)).to.equal('256');
						Expect(testFable.Math.powerPrecise(5,2)).to.equal('25');
						Expect(testFable.Math.powerPrecise(50,7)).to.equal('781250000000');
						Expect(testFable.Math.sqrtPrecise(4)).to.equal('2');

						Expect(testFable.Math.gtPrecise(4, 5)).to.equal(false);
						Expect(testFable.Math.gtePrecise(1000, 5)).to.equal(true);
						Expect(testFable.Math.gtePrecise('0.00', '0.0')).to.equal(true);
						Expect(testFable.Math.gtePrecise('0.00', '0.0000000000000000000000000000000001')).to.equal(false);
						Expect(testFable.Math.gtePrecise('0.00', 0.01)).to.equal(false);
						Expect(testFable.Math.gtePrecise('0.00', '-0.0000000000000000000000000000000001')).to.equal(true);
						Expect(testFable.Math.gtePrecise('0.00', -0.01)).to.equal(true);
						Expect(testFable.Math.gtePrecise('0.00000000000000000000000000000000099', '0.000000000000000000000000000000001')).to.equal(false);
						Expect(testFable.Math.gtePrecise('0.000000000000000000000000000000001', '0.00000000000000000000000000000000099')).to.equal(true);
						Expect(testFable.Math.ltePrecise(1000, 5)).to.equal(false);
						Expect(testFable.Math.ltePrecise('0.00', '0.0')).to.equal(true);
						Expect(testFable.Math.ltePrecise('0.00', '0.0000000000000000000000000000000001')).to.equal(true);
						Expect(testFable.Math.ltePrecise('0.00', 0.01)).to.equal(true);
						Expect(testFable.Math.ltePrecise('0.00', '-0.0000000000000000000000000000000001')).to.equal(false);
						Expect(testFable.Math.ltePrecise('0.00', -0.01)).to.equal(false);
						Expect(testFable.Math.ltePrecise('0.00000000000000000000000000000000099', '0.000000000000000000000000000000001')).to.equal(true);
						Expect(testFable.Math.ltePrecise('0.000000000000000000000000000000001', '0.00000000000000000000000000000000099')).to.equal(false);
						Expect(testFable.Math.ltPrecise(4, 5)).to.equal(true);

						Expect(testFable.Math.floorPrecise(4.939323)).to.equal('4');
						Expect(testFable.Math.ceilPrecise(-4.939323)).to.equal('-4');
						Expect(testFable.Math.ceilPrecise(4.939323)).to.equal('5');
						Expect(testFable.Math.ceilPrecise('BARF')).to.equal('0');
						Expect(testFable.Math.ceilPrecise(undefined)).to.equal('0');

						Expect(testFable.Math.comparePrecise(4, 5)).to.equal(-1);

						Expect(testFable.Math.modPrecise(4.939323, 4)).to.equal('0.939323');

						Expect(testFable.Math.absPrecise('-492')).to.equal('492');

						return fDone();
					}
				);
				test
				(
					'Cumulative Summation',
					function(fDone)
					{
						let testFable = new libFable();

						let tmpTestValueSet = (
							[
								{ Item: 'Lettuce', Quantity: 2, Price: "7.99" },
								{ Item: 'Tomato', Quantity: 3, Price: "3.99" },
								{ Item: 'Onion', Quantity: 1, Price: "1.99" },
								{ Item: 'Cucumber', Quantity: 4, Price: "2.99" },
								{ Item: 'Carrot', Quantity: 3, Price: "1.99" },
								{ Item: 'Radish', Quantity: 2, Price: "1.49" },
								{ Item: 'Celery', Quantity: 1, Price: "0.99" },
								{ Item: 'Parsley', Quantity: 2, Price: "0.49" }
							]);

						testFable.Math.cumulativeSummation(tmpTestValueSet, 'Price', 'RunningTotal');

						Expect(tmpTestValueSet[0].RunningTotal).to.equal('7.99');
						Expect(tmpTestValueSet[1].RunningTotal).to.equal('11.98');
						Expect(tmpTestValueSet[2].RunningTotal).to.equal('13.97');
						Expect(tmpTestValueSet[3].RunningTotal).to.equal('16.96');
						Expect(tmpTestValueSet[4].RunningTotal).to.equal('18.95');
						Expect(tmpTestValueSet[5].RunningTotal).to.equal('20.44');

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
					'Eulers Number',
					function(fDone)
					{
						let testFable = new libFable();

						Expect(testFable.Math.eulerPrecise()).to.equal('2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664');
						return fDone();
					}
				);

				test
				(
					'Histograms by Count',
					function(fDone)
					{

						let testFable = new libFable();

						let tmpTestValueSet = (
							[
								{ City: 'New York', State: 'NY', GDP: 1000000 },
								{ City: 'Seattle', State: 'WA', GDP: 500000 },
								{ City: 'Portland', State: 'OR', GDP: 250000 },
								{ City: 'San Francisco', State: 'CA', GDP: 750000 },
								{ City: 'Los Angeles', State: 'CA', GDP: 500000 },
								{ City: 'San Diego', State: 'CA', GDP: 250000 },
								{ City: 'Atlanta', State: 'GA', GDP: 100000 },
								{ City: 'Savannah', State: 'GA', GDP: 50000 },
								{ City: 'Athens', State: 'GA', GDP: 25000 }
							]);

						let tmpHistogramByDistribution = testFable.Math.histogramDistributionByExactValue(tmpTestValueSet, 'State');
						Expect(tmpHistogramByDistribution).to.deep.equal({ CA: 3, GA: 3, NY: 1, OR: 1, WA: 1 });
						let tmpHistogramByAggregation = testFable.Math.histogramAggregationByExactValue(tmpTestValueSet, 'State', 'GDP');
						Expect(tmpHistogramByAggregation).to.deep.equal({ CA: "1500000", GA: "175000", NY: "1000000", OR: "250000", WA: "500000" });
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
					'Set Math Operations',
					function(fDone)
					{
						let testFable = new libFable();
						let testManyfest = testFable.newManyfest();

						let tmpChocoSizes = testManyfest.getValueAtAddress(_ChocoData, 'files[].size');

						Expect(testFable.Math.maxPrecise(tmpChocoSizes)).to.equal("31625216");
						Expect(testFable.Math.minPrecise(tmpChocoSizes)).to.equal("620");
						Expect(testFable.Math.sumPrecise(tmpChocoSizes)).to.equal("36431778");
						Expect(testFable.Math.countSetElements(tmpChocoSizes)).to.equal(17);
						Expect(testFable.Math.meanPrecise(tmpChocoSizes)).to.equal("2143045.76470588235294117647");
						Expect(testFable.Math.medianPrecise(tmpChocoSizes)).to.equal("5993");
						// Since the file sizes are all different, this is just the whole list.
						Expect(testFable.Math.modePrecise(tmpChocoSizes)).to.deep.equal(["620","838","1371","3383","3503","4093","4951","5993","6843","7481","8388","31141","101114","2248166","2378677","31625216","NaN"]);

						Expect(testFable.Math.maxPrecise([100, 101, 400, "20", "dog"])).to.equal("400");
						Expect(testFable.Math.modePrecise([100, 20, 101, 400, "20", "dog"])).to.deep.equal(["20"]);
						Expect(testFable.Math.modePrecise([100, 20, 101, 400, "20", "dog", 101])).to.deep.equal(["20", "101"]);

						Expect(testFable.Math.maxPrecise([100, 101, 400, "20", "dog"])).to.equal("400");
						Expect(testFable.Math.modePrecise([100, 20, 101, 400, "20", "dog"])).to.deep.equal(["20"]);
						Expect(testFable.Math.modePrecise([100, 20, 101, 400, "20", "dog", 101])).to.deep.equal(["20", "101"]);

						Expect(testFable.Math.sumPrecise([])).to.equal('0.0');
						Expect(testFable.Math.countSetElements([])).to.equal(0);
						Expect(testFable.Math.meanPrecise([])).to.equal('0.0');
						Expect(testFable.Math.medianPrecise([])).to.equal('0.0');
						Expect(testFable.Math.modePrecise([])).to.deep.equal([]);

						Expect(testFable.Math.sumPrecise([1,2,3,4,5,6,7,8,9,10])).to.equal('55');
						Expect(testFable.Math.countSetElements([1,2,3,4,5,6,7,8,9,10])).to.equal(10);
						Expect(testFable.Math.meanPrecise([1,2,3,4,5,6,7,8,9,10])).to.equal('5.5');
						Expect(testFable.Math.meanPrecise([0,1,2,3,4,5,6,7,8,9,10])).to.equal('5');
						Expect(testFable.Math.medianPrecise([1,2,3,4,5,6,7,8,9,10])).to.equal('5.5');
						Expect(testFable.Math.modePrecise([1,2,3,4,5,6,7,8,9,10])).to.deep.equal(['1','2','3','4','5','6','7','8','9','10']);

						Expect(testFable.Math.sumPrecise([1,2,3,4,5,6,7,8,9,10,11])).to.equal('66');
						Expect(testFable.Math.countSetElements([1,2,3,4,5,6,7,8,9,10,11])).to.equal(11);
						Expect(testFable.Math.meanPrecise([1,2,3,4,5,6,7,8,9,10,11])).to.equal('6');
						Expect(testFable.Math.medianPrecise([1,2,3,4,5,6,7,8,9,10,11])).to.equal('6');
						Expect(testFable.Math.modePrecise([1,2,3,4,5,6,7,8,9,10,11])).to.deep.equal(['1','2','3','4','5','6','7','8','9','10','11']);

						return fDone();
					}
				)
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
