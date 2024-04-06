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
	'Progress Tracker Tests',
	function()
	{
		suite
		(
			'Basic Progress',
			function()
			{
				test
				(
					'Leverage the object cache',
					function(fDone)
					{
						let testFable = new libFable();

						let tmpProgressTracker = testFable.instantiateServiceProvider('ProgressTracker');

						Expect(tmpProgressTracker).to.be.an('object');
						Expect(tmpProgressTracker).to.have.property('incrementProgressTrackerStatus');

						return fDone();
					}
				);
			}
		);
	}
);