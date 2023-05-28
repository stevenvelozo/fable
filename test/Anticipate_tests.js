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
									let tmpAnticipate = testFable.serviceManager.instantiateServiceProvider('Anticipate');
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
									let tmpAnticipate = testFable.serviceManager.instantiateServiceProvider('Anticipate');
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
					}
				);
		}
	);