/**
* Unit tests for the Anticipate pattern
* @author      Steven Velozo <steven@velozo.com>
*/

const libFable = require('../source/Fable.js');

const Chai = require("chai");
const Expect = Chai.expect;

suite
	(
		'Fable Data Generation',
		() =>
		{
			setup(() => { });

			suite
				(
					'Generate random numbers and strings',
					function ()
					{
						test
							(
								'Just get me a random number',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									Expect(tmpDataGeneration.randomIntegerUpTo(100)).to.be.within(0, 100);
									return fTestComplete();
								}
							);
						test
							(
								'Just get me a random floating point number',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									Expect(tmpDataGeneration.randomFloat()).to.not.be.NaN;
									Expect(parseFloat(tmpDataGeneration.randomFloatBetween(0, 100))).to.be.within(0, 100);
									Expect(parseFloat(tmpDataGeneration.randomFloatBetween(4.3, 5.1))).to.be.within(4.3, 5.1);
									Expect(parseFloat(tmpDataGeneration.randomFloatUpTo(7.65))).to.be.within(0, 7.65);
									return fTestComplete();
								}
							);
						test
							(
								'How about a random number string!',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									Expect(tmpDataGeneration.randomNumericString()).to.be.a('string');
									// Ok non deterministic was hilarious for a while.
									Expect(tmpDataGeneration.randomNumericString().length).to.be.lessThanOrEqual(10);
									Expect(tmpDataGeneration.randomNumericString().length).to.be.greaterThanOrEqual(9);
									return fTestComplete();
								}
							);
						test
							(
								'How about a random color?',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									testFable.log.info(`Random color: ${tmpDataGeneration.randomColor()}`);
									Expect(tmpDataGeneration.randomColor()).to.be.a('string');
									return fTestComplete();
								}
							);
						test
							(
								'DayOfWeek',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									testFable.log.info(`Random Day of Week: ${tmpDataGeneration.randomDayOfWeek()}`);
									Expect(tmpDataGeneration.randomDayOfWeek()).to.be.a('string');
									return fTestComplete();
								}
							);
						test
							(
								'Month',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									testFable.log.info(`Random Month: ${tmpDataGeneration.randomMonth()}`);
									Expect(tmpDataGeneration.randomMonth()).to.be.a('string');
									return fTestComplete();
								}
							);
						test
							(
								'First name',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									testFable.log.info(`Random Name: ${tmpDataGeneration.randomName()}`);
									Expect(tmpDataGeneration.randomName()).to.be.a('string');
									return fTestComplete();
								}
							);
						test
							(
								'Surname',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');
									testFable.log.info(`Random Surname: ${tmpDataGeneration.randomSurname()}`);
									Expect(tmpDataGeneration.randomSurname()).to.be.a('string');
									return fTestComplete();
								}
							);
					}
				);
		}
	);