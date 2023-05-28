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
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
									Expect(tmpDataGeneration.randomIntegerUpTo(100)).to.be.within(0, 99);
									return fTestComplete();
								}
							);
						test
							(
								'How about a random number string!',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
									Expect(tmpDataGeneration.randomNumericString()).to.be.a('string');
									Expect(tmpDataGeneration.randomNumericString().length).to.equal(10);
									return fTestComplete();
								}
							);
						test
							(
								'How about a random color?',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
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
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
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
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
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
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
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
									let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');
									testFable.log.info(`Random Surname: ${tmpDataGeneration.randomSurname()}`);
									Expect(tmpDataGeneration.randomSurname()).to.be.a('string');
									return fTestComplete();
								}
							);
					}
				);
		}
	);