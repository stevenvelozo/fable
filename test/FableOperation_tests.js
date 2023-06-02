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
						let tmpOperation = testFable.serviceManager.instantiateServiceProvider('Operation', {Name: 'Big Complex Integration Operation'}, 'INTEGRATION-123');
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.serviceMap.Operation['INTEGRATION-123']).to.equal(tmpOperation);
						Expect(testFable.serviceMap.Operation['BADHASH']).to.be.undefined;
						Expect(testFable.serviceMap.Operation.hasOwnProperty('INTEGRATION-123')).to.equal(true);
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
						let tmpOperation = testFable.serviceManager.instantiateServiceProvider('Operation', {Name: 'Big Complex Integration Operation'}, 'INTEGRATION-123');;
						Expect(tmpOperation).to.be.an('object');
						Expect(tmpOperation.name).to.equal('Big Complex Integration Operation');

						let tmpCollisionOperation = testFable.serviceManager.instantiateServiceProvider('Operation', {Name: 'Another Big Complex Integration Operation with Colliding Name'}, 'INTEGRATION-123');;
						Expect(tmpCollisionOperation).to.be.an('object');
						Expect(tmpCollisionOperation.name).to.equal('Another Big Complex Integration Operation with Colliding Name');

						Expect(testFable.serviceMap.Operation['INTEGRATION-123']).to.equal(tmpCollisionOperation);

					}
				);
				test
				(
					'Create a basic Integration Operation without a Hash',
					function()
					{
						let testFable = new libFable();
						let tmpOperation = testFable.serviceManager.instantiateServiceProvider('Operation', {Name:'Another Big Complex Integration Operation'});
						Expect(tmpOperation).to.be.an('object');
						Expect(testFable.serviceMap.Operation.hasOwnProperty(tmpOperation.Hash)).to.equal(true);
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
			}
		);
	}
);