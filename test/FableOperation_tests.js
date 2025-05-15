/**
* Unit tests for Fable
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
	'Fable Operations',
	function()
	{
		suite
		(
			'Utility',
			function()
			{
				test
				(
					'Create a basic Integration Operation',
					function()
					{
						let testFable = new libFable();
						let tmpOperation = testFable.instantiateServiceProvider('Operation', {Name: 'Big Complex Integration Operation'}, 'INTEGRATION-123');
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.servicesMap.Operation['INTEGRATION-123']).to.equal(tmpOperation);
						Expect(testFable.servicesMap.Operation['BADHASH']).to.be.undefined;
						Expect(testFable.servicesMap.Operation.hasOwnProperty('INTEGRATION-123')).to.equal(true);
						tmpOperation.log.info(`Operation GUID ${tmpOperation.GUID} ---- Test 123`);
						Expect(tmpOperation.state.Log.length).to.equal(1);
						Expect(tmpOperation.state.Log[0]).to.contain('Test 123');
					}
				);
				test
				(
					'Create an Operation and try to create another with the hash',
					function()
					{
						let testFable = new libFable();
						let tmpOperation = testFable.instantiateServiceProvider('Operation', {Name: 'Big Complex Integration Operation'}, 'INTEGRATION-123');;
						Expect(tmpOperation).to.be.an('object');
						Expect(tmpOperation.name).to.equal('Big Complex Integration Operation');

						let tmpCollisionOperation = testFable.instantiateServiceProvider('Operation', {Name: 'Another Big Complex Integration Operation with Colliding Name'}, 'INTEGRATION-123');;
						Expect(tmpCollisionOperation).to.be.an('object');
						Expect(tmpCollisionOperation.name).to.equal('Another Big Complex Integration Operation with Colliding Name');

						Expect(testFable.servicesMap.Operation['INTEGRATION-123']).to.equal(tmpCollisionOperation);

					}
				);
				test
				(
					'Create a basic Integration Operation without a Hash',
					function()
					{
						let testFable = new libFable();
						let tmpOperation = testFable.instantiateServiceProvider('Operation', {Name:'Another Big Complex Integration Operation'});
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.servicesMap.Operation.hasOwnProperty(tmpOperation.Hash)).to.equal(true);
						Expect(tmpOperation.state.Log.length).to.equal(0);
						let tmpText = `Operation ${tmpOperation.Hash} starting up...`;
						tmpOperation.log.info(tmpText);
						Expect(tmpOperation.state.Log.length).to.equal(1);
						Expect(tmpOperation.state.Log[0]).to.contain(tmpText);
						tmpOperation.log.trace('And the traces are gone...');
						tmpOperation.log.debug('Debug something.', {TestData:'Ignition Complete'});
						tmpOperation.log.warn('Something was almost bad.');
						tmpOperation.log.error('This was an error!');
						tmpOperation.log.error('And this was an error with some sort of data!', {TestData:'Ignition Complete'});
						tmpOperation.log.fatal('It was fatal.');
						Expect(tmpOperation.state.Log.length).to.equal(9);
						Expect(tmpOperation.state.Log[3]).to.equal('{"TestData":"Ignition Complete"}')
						Expect(tmpOperation.state.Errors.length).to.equal(4);
					}
				);
				test
				(
					'Timing Stuff for Operations',
					function(fDone)
					{
						let testFable = new libFable();
						let tmpOperation = testFable.instantiateServiceProvider('Operation', {Name:'MTO - The Mega Test Operation'});
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.servicesMap.Operation.hasOwnProperty(tmpOperation.Hash)).to.equal(true);
						Expect(tmpOperation.state.Log.length).to.equal(0);

						let tmpText = `Created operation ${tmpOperation.Hash}; ready to add a step and start execution...`;
						tmpOperation.log.info(tmpText);
						Expect(tmpOperation.state.Log.length).to.equal(1);
						Expect(tmpOperation.state.Log[0]).to.contain(tmpText);

						let tmpOperationCount = 10;

						tmpOperation.addStep(
							function (fStepComplete)
							{
								this.logProgressTrackerStatus();

								let tmpAnticipate = testFable.newAnticipate();

								for (let i = 1; i <= tmpOperationCount; i++)
								{
									tmpAnticipate.anticipate((fWorkComplete)=>
										{
											let tmpDelay = Math.floor(Math.random() * 100) + 100;
											this.log.info(`Doing some big work for ${tmpDelay}ms on iteration ${i}...`);
											setTimeout(
												() =>
												{
													this.log.info(`Work done for iteration ${i}.`);
													this.ProgressTracker.incrementProgressTracker(1);
													this.logProgressTrackerStatus();
													return fWorkComplete();
												}, tmpDelay);
										});
								}

								tmpAnticipate.wait(fStepComplete);
							}, {}, 'Example Step 1', 'This is the first step of the mega test.', 'STEP1');
						tmpOperation.setStepTotalOperations('STEP1', tmpOperationCount);

						tmpOperation.addStep(
							function (fStepComplete)
							{
								let tmpShortOperationCount = 300;

								this.ProgressTracker.setProgressTrackerTotalOperations(tmpShortOperationCount);
								this.logProgressTrackerStatus();

								let tmpAnticipate = testFable.newAnticipate();

								for (let i = 1; i <= tmpShortOperationCount; i++)
								{
									tmpAnticipate.anticipate((fWorkComplete)=>
										{
											let tmpDelay = Math.floor(Math.random() * 3) + 3;
											this.log.info(`Doing a little work for ${tmpDelay}ms on iteration ${i}...`);
											setTimeout(
												() =>
												{
													this.log.info(`Leetle work done for iteration ${i}.`);
													this.ProgressTracker.incrementProgressTracker(1);
													this.logProgressTrackerStatus();
													return fWorkComplete();
												}, tmpDelay);
										});
								}

								tmpAnticipate.wait(fStepComplete);
							}, {}, 'Example Step 2', 'This is the second step of the mega test.', 'STEP2');

						tmpOperation.execute(fDone);
					}
				);
			}
		);
	}
);
