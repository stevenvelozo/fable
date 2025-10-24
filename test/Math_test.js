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

						tmpTestValueSet = (
							[
								{ Item: 'NoCost', Quantity: 2 },
								...tmpTestValueSet
							]);

						testFable.Math.cumulativeSummation(tmpTestValueSet, 'Price', 'RunningTotal');

						Expect(tmpTestValueSet[0].RunningTotal).to.equal('0');
						Expect(tmpTestValueSet[1].RunningTotal).to.equal('7.99');
						Expect(tmpTestValueSet[2].RunningTotal).to.equal('11.98');
						Expect(tmpTestValueSet[3].RunningTotal).to.equal('13.97');
						Expect(tmpTestValueSet[4].RunningTotal).to.equal('16.96');
						Expect(tmpTestValueSet[5].RunningTotal).to.equal('18.95');
						Expect(tmpTestValueSet[6].RunningTotal).to.equal('20.44');

						return fDone();
					}
				);

				test
				(
					'Subtractive Summation',
					function(fDone)
					{
						let testFable = new libFable();

						let tmpTestValueSet = (
							[
								{ Item: 'GroceryBag', Volume: '150.00' },

								{ Item: 'Lettuce', Volume: '80' },
								{ Item: 'Tomato', Volume: '30.17' },
								{ Item: 'Onion', Volume: '10.9' },
								{ Item: 'Cucumber', Volume: '15.032' }
							]);

						testFable.Math.subtractingSummation(tmpTestValueSet, 'Volume', 'SpaceLeftInBag');

						Expect(tmpTestValueSet[0].SpaceLeftInBag).to.equal('150');
						Expect(tmpTestValueSet[1].SpaceLeftInBag).to.equal('70');
						Expect(tmpTestValueSet[2].SpaceLeftInBag).to.equal('39.83');
						Expect(tmpTestValueSet[3].SpaceLeftInBag).to.equal('28.93');
						Expect(tmpTestValueSet[4].SpaceLeftInBag).to.equal('13.898');

						return fDone();
					}
				);

				test
				(
					'Iterative Series Operations',
					function(fDone)
					{
						let testFable = new libFable();

						let tmpTestValueSet = (
							[
								{ Item: 'FirstSplit', Amount: '8' },
								{ Item: 'SecondSplit', Amount: '2' },
								{ Item: 'ThirdSplit', Amount: '4' },
								{ Item: 'FourthSplit', Amount: '2' }
							]);

						testFable.Math.iterativeSeries(tmpTestValueSet, 'Amount', 'RAMLeft', '1.25', 'divide', '1024', true);
						Expect(tmpTestValueSet[0].RAMLeft).to.equal('102.4');
						Expect(tmpTestValueSet[1].RAMLeft).to.equal('40.96');
						Expect(tmpTestValueSet[2].RAMLeft).to.equal('8.192');
						Expect(tmpTestValueSet[3].RAMLeft).to.equal('3.2768');

						testFable.Math.iterativeSeries(tmpTestValueSet, 'Amount', 'RAMLeft', '1.0', 'divide', '1024', true);
						Expect(tmpTestValueSet[0].RAMLeft).to.equal('128');
						Expect(tmpTestValueSet[1].RAMLeft).to.equal('64');
						Expect(tmpTestValueSet[2].RAMLeft).to.equal('16');
						Expect(tmpTestValueSet[3].RAMLeft).to.equal('8');

						testFable.Math.iterativeSeries(tmpTestValueSet, 'Amount', 'RAMLeft', '0.7512', 'mul', '1024', true);
						Expect(tmpTestValueSet[0].RAMLeft).to.equal('6153.8304');
						Expect(tmpTestValueSet[1].RAMLeft).to.equal('9245.51479296');
						Expect(tmpTestValueSet[2].RAMLeft).to.equal('27780.922849886208');
						Expect(tmpTestValueSet[3].RAMLeft).to.equal('41738.0584896690388992');

						testFable.Math.iterativeSeries(tmpTestValueSet, 'Amount', 'RAMLeft', null, 'sub');
						Expect(tmpTestValueSet[0].RAMLeft).to.equal('8');
						Expect(tmpTestValueSet[1].RAMLeft).to.equal('6');
						Expect(tmpTestValueSet[2].RAMLeft).to.equal('2');
						Expect(tmpTestValueSet[3].RAMLeft).to.equal('0');

						testFable.Math.iterativeSeries(tmpTestValueSet, 'Amount', 'RAMLeft', undefined, 'sub', 1100);
						Expect(tmpTestValueSet[0].RAMLeft).to.equal('1092');
						Expect(tmpTestValueSet[1].RAMLeft).to.equal('1090');
						Expect(tmpTestValueSet[2].RAMLeft).to.equal('1086');
						Expect(tmpTestValueSet[3].RAMLeft).to.equal('1084');

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
						Expect(testFable.Math.parsePrecise('')).to.equal('0.0');

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

				test
				(
					'Logarithms',
					function(fDone)
					{
						let testFable = new libFable();
						
						Expect(testFable.Math.logPrecise(0)).to.be.NaN;
						Expect(testFable.Math.logPrecise(1.124)).to.equal('0.050766311');
						Expect(testFable.Math.logPrecise('1.124')).to.equal('0.050766311');
						Expect(testFable.Math.logPrecise('1.4')).to.equal('0.146128036');
						Expect(testFable.Math.logPrecise('1.874232')).to.equal('0.272823349');
						Expect(testFable.Math.logPrecise('1.9')).to.equal('0.278753601');
						Expect(testFable.Math.logPrecise('2.2')).to.equal('0.342422681');
						Expect(testFable.Math.logPrecise('3.324')).to.equal('0.521661015');
						Expect(testFable.Math.logPrecise('6.32423')).to.equal('0.801007656');
						Expect(testFable.Math.logPrecise('7')).to.equal('0.845098040');
						Expect(testFable.Math.logPrecise('16')).to.equal('1.204119983');
						Expect(testFable.Math.logPrecise('10000')).to.equal('4.000000000');
						Expect(testFable.Math.logPrecise('87')).to.equal('1.939519253');
						Expect(testFable.Math.logPrecise('100')).to.equal('2.000000000');
						Expect(testFable.Math.logPrecise('110')).to.equal('2.041392685');
						Expect(testFable.Math.logPrecise('130')).to.equal('2.113943352');
						Expect(testFable.Math.logPrecise('400')).to.equal('2.602059991');
						Expect(testFable.Math.logPrecise('500')).to.equal('2.698970004');
						Expect(testFable.Math.logPrecise('600')).to.equal('2.778151250');
						Expect(testFable.Math.logPrecise('900')).to.equal('2.954242509');
						Expect(testFable.Math.logPrecise('999')).to.equal('2.999565488');
						Expect(testFable.Math.logPrecise('1000')).to.equal('3.000000000');
						Expect(testFable.Math.logPrecise('1001')).to.equal('3.000434077');
						Expect(testFable.Math.logPrecise('1200')).to.equal('3.079181246');
						Expect(testFable.Math.logPrecise('1300')).to.equal('3.113943352');
						Expect(testFable.Math.logPrecise('1999')).to.equal('3.300812794');
						Expect(testFable.Math.logPrecise('2000')).to.equal('3.301029996');
						Expect(testFable.Math.logPrecise('3000')).to.equal('3.477121255');
						Expect(testFable.Math.logPrecise('4000')).to.equal('3.602059991');
						Expect(testFable.Math.logPrecise('5000')).to.equal('3.698970004');
						Expect(testFable.Math.logPrecise('100000')).to.equal('5.000000000');
						Expect(testFable.Math.logPrecise('1005000901')).to.equal('9.002166451');

						return fDone();
					}
				);

				test
				(
					'Eulers to an Exponent of N',
					function(fDone)
					{
						let testFable = new libFable();

						Expect(testFable.Math.expPrecise('0')).to.equal('1');
						Expect(testFable.Math.expPrecise('1.124')).to.equal('3.077138172');
						Expect(testFable.Math.expPrecise('1.4')).to.equal('4.055199967');
						Expect(testFable.Math.expPrecise('1.874232')).to.equal('6.515813054');
						Expect(testFable.Math.expPrecise('1.9')).to.equal('6.685894442');
						Expect(testFable.Math.expPrecise('2.2')).to.equal('9.025013499');
						Expect(testFable.Math.expPrecise('3.324')).to.equal('27.771213539');
						Expect(testFable.Math.expPrecise('6.32423')).to.equal('557.928043628');
						Expect(testFable.Math.expPrecise('7')).to.equal('1096.633158427');
						Expect(testFable.Math.expPrecise('16')).to.equal('8886110.52050434');
						Expect(testFable.Math.expPrecise('87')).to.equal('6.0760302250165910226862305668049228933571005991e+37');
						Expect(testFable.Math.expPrecise('100')).to.equal('2.6881171418144006498361355299904430489510323068101727e+43');
						Expect(testFable.Math.expPrecise('110')).to.equal('5.92097202763302871775566547178919934033680861763789992544e+47');
						Expect(testFable.Math.expPrecise('130')).to.equal('2.87264955081656835249498360594656214322410986618852673463510287128e+56');
						Expect(testFable.Math.expPrecise('400')).to.equal('5.22146968976280766823448917819312119928757838636294365087229965314955319234363035967068090474969920921229926737521823711259606341428359454445036263563446386876069161748564476869487107e+173');
						Expect(testFable.Math.expPrecise('500')).to.equal('1.4035922178443322635139346187029106729839029888278346358090479055036847329857327659066066346423163346684518112330560812299308307757301544400486805796338124141628072493187592353782193348029633841832360152127536485213047179412609e+217');
						Expect(testFable.Math.expPrecise('600')).to.equal('3.77302030092434336419695838674700740088354673638834622388500325660794131835628047153390042345698138347361656320402231485978980283954189824175081056524926295674148482949243810250377530201023308557571234567617672508975937688969808748216814845636042130603884174370820531865e+260');

						return fDone();
					}
				)

			}
		);
	}
);
