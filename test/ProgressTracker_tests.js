/**
* Unit tests for Fable Progress Tracker
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
	'Progress Tracker Set Tests',
	function()
	{
		suite
		(
			'Basic Progress',
			function()
			{
				test
				(
					'Basic progress tracker management',
					function(fDone)
					{
						let testFable = new libFable();

						let tmpProgressTracker = testFable.instantiateServiceProvider('ProgressTrackerSet');

						Expect(tmpProgressTracker).to.be.an('object');
						Expect(tmpProgressTracker).to.have.property('incrementProgressTracker');

						return fDone();
					}
				);
				test
				(
					'Simple Progress Tracker',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpProgressTracker = testFable.instantiateServiceProvider('ProgressTrackerSet');

						tmpProgressTracker.createProgressTracker('TestTracker', 200);
						tmpProgressTracker.logProgressTrackerStatus('TestTracker');

						let tmpAnticipate = testFable.newAnticipate();

						tmpAnticipate.anticipate(
							function (fDone)
							{
								let tmpWaitTime = Math.floor(Math.random() * 10) + 10;
								this.log.trace(`Starting tracker in ${tmpWaitTime}ms...`);
								setTimeout(
									() =>
									{
										testFable.ProgressTrackerSet.startProgressTracker('TestTracker');
										testFable.ProgressTrackerSet.logProgressTrackerStatus('TestTracker');
										return fDone();
									}, tmpWaitTime);
							}.bind(testFable));

						for (let i = 0; i < 201; i++)
						{
							tmpAnticipate.anticipate(
								function (fDone)
								{
									let tmpTracker = testFable.ProgressTrackerSet.getProgressTracker('TestTracker');

									if (tmpTracker.data.PercentComplete >= 100)
									{
										return fDone();
									}

									let tmpWaitTime = Math.floor(Math.random() * 10) + 10;
									let tmpIncrementAmount = Math.floor(Math.random() * 2) + 2;

									setTimeout(
										() =>
										{
											if (tmpTracker.data.PercentComplete < 100)
											{
												testFable.ProgressTrackerSet.incrementProgressTracker('TestTracker', tmpIncrementAmount);
												testFable.ProgressTrackerSet.logProgressTrackerStatus('TestTracker');
											}
											return fDone();
										}, tmpWaitTime);
								}.bind(testFable));
						}

						tmpAnticipate.wait(
							function (pError)
							{
								if (pError)
								{
									testFable.log.error(`Error: ${pError}`);
								}

								let tmpWaitTime = Math.floor(Math.random() * 10) + 10;
								this.log.trace(`Ending tracker in ${tmpWaitTime}ms...`);

								setTimeout(
									() =>
									{
										testFable.ProgressTrackerSet.endProgressTracker('TestTracker');
										testFable.ProgressTrackerSet.logProgressTrackerStatus('TestTracker');
										return fTestComplete();
									}, tmpWaitTime);
							}.bind(testFable));

					}
				)
			}
		);
	}
);