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
			}
		);
	}
);