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
var Assert = Chai.assert;

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
						let tmpOperation = testFable.createOperation('Big Complex Integration Operation', 'INTEGRATION-123');
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.Operations.hasOwnProperty('INTEGRATION-123')).to.equal(true);
						tmpOperation.log.info('Test 123');
						Expect(tmpOperation.state.Log.length).to.equal(1);
						Expect(tmpOperation.state.Log[0]).to.contain('Test 123');
					}
				);
				test
				(
					'Create a basic Integration Operation without a Hash',
					function()
					{
						let testFable = new libFable();
						let tmpOperation = testFable.createOperation('Another Big Complex Integration Operation');
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.Operations.hasOwnProperty(tmpOperation.Hash)).to.equal(true);
						Expect(tmpOperation.state.Log.length).to.equal(0);
						let tmpText = `Operation ${tmpOperation.Hash} starting up...`;
						tmpOperation.log.info(tmpText);
						Expect(tmpOperation.state.Log.length).to.equal(1);
						Expect(tmpOperation.state.Log[0]).to.contain(tmpText);
						tmpOperation.log.trace('And the traces are gone...');
						tmpOperation.log.debug('Debug something.', {TestData:'Ignition Complete'});
						tmpOperation.log.warn('Something was almost bad.');
						tmpOperation.log.error('This was an error!');
						tmpOperation.log.fatal('It was fatal.');
						Expect(tmpOperation.state.Log.length).to.equal(7);
						Expect(tmpOperation.state.Log[3]).to.equal('{"TestData":"Ignition Complete"}')
						Expect(tmpOperation.state.Errors.length).to.equal(2);
					}
				);
			}
		);
	}
);