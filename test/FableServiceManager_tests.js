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
	'Fable Service Manager',
	function()
	{
		var testFable = false;

		setup
		(
			function()
			{
			}
		);

		suite
		(
			'Service Manager',
			function()
			{
				test
				(
					'Register a Service',
					function()
					{
						testFable = new libFable();
                        testFable.serviceManager.addServiceType('SimpleService');
                        testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');

                        Expect(testFable.serviceManager.services['SimpleService']['SimpleService-123']).to.be.an('object');
					}
				);
				test
				(
					'Use the Default Service',
					function()
					{
						testFable = new libFable();
                        testFable.serviceManager.addServiceType('SimpleService');
                        testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');

                        Expect(testFable.serviceManager.services['SimpleService']['SimpleService-123']).to.be.an('object');

                        Expect(testFable.serviceManager.defaultServices['SimpleService']).to.be.an('object');
                        Expect(testFable.serviceManager.defaultServices['SimpleService'].Hash).to.equal('SimpleService-123');
					}
				);
			}
		);
	}
);