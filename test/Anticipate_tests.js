/**
* Unit tests for the Anticipate pattern
* @author      Steven Velozo <steven@velozo.com>
*/

const libFable = require('../source/Fable.js');

const Chai = require("chai");
const Expect = Chai.expect;

suite
	(
		'Fable Anticipate',
		() =>
		{
			setup(() => { });

			suite
				(
					'Basic Asynchronous Operations',
					function ()
					{
						test
							(
								'Setup some async calls and make sure they run',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpAnticipate = testFable.instantiateServiceProvider('Anticipate');
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation First test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation First test timeout done!`);
											fCallback();
										}, 500);
									});
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation Second test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation Second test timeout done!`);
											fCallback();
										}, 50);
									});
									tmpAnticipate.wait(function (pError)
									{
										testFable.log.info(`Wait 1 completed: ${pError}`)
										return fTestComplete();
									});
								}
							);
						test
							(
								'Setup some async calls to run together and make sure they run',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpAnticipate = testFable.newAnticipate();
									tmpAnticipate.maxOperations = 2;
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation First test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation First test timeout done!`);
											fCallback();
										}, 500);
									});
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation Second test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation Second test timeout done!`);
											fCallback();
										}, 50);
									});
									tmpAnticipate.wait(function (pError)
									{
										testFable.log.info(`Wait 1 completed: ${pError}`)
										return fTestComplete();
									});
								}
							);
						test
							(
								'Error bailout',
								function (fTestComplete)
								{
									let testFable = new libFable();
									let tmpAnticipate = testFable.newAnticipate();
									let tmpPostErrorMethodCalled = false;
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation First test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation First test timeout done!`);
											fCallback();
										}, 500);
									});
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation Second test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation Second test timeout done!`);
											fCallback();
										}, 50);
									});
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation Second test timeout entered...');
										setTimeout(function ()
										{
											testFable.log.info(`Operation Second test timeout done!`);
											fCallback(new Error('Bail out or else!'));
										}, 50);
									});
									tmpAnticipate.anticipate(function (fCallback)
									{
										testFable.log.info('Operation Third test timeout entered...');
										setTimeout(function ()
										{
											tmpPostErrorMethodCalled = true;
											testFable.log.info(`Operation Third test timeout done!`);
											fCallback();
										}, 50);
									});
									tmpAnticipate.wait(function (pError)
									{
										Expect(pError).to.be.an('error');
										Expect(tmpPostErrorMethodCalled).to.equal(false);
										testFable.log.info(`Wait 1 completed: ${pError}`)
										return fTestComplete();
									});
								}
							);
						test
							(
								'Huge call stack',
								function (fTestComplete)
								{
									this.timeout(10000);
									let testFable = new libFable();
									let tmpAnticipate = testFable.instantiateServiceProvider('Anticipate');

									for (let i = 0; i < 50000; i++)
									{
										tmpAnticipate.anticipate(function (fCallback)
										{
											return fCallback();
										});
									}

									tmpAnticipate.wait(function (pError)
									{
										testFable.log.info(`Waits completed!`)
										return fTestComplete();
									});
								}
							);
					}
				);
		}
	);