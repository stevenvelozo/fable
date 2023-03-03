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
	'Fable',
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
			'Object Sanity',
			function()
			{
				test
				(
					'The class should initialize itself into a happy little object.',
					function()
					{
						testFable = new libFable({LogStreams: false});
						// Instantiate the logger
						Expect(testFable).to.be.an('object', 'Fable should initialize as an object directly from the require statement.');
						Expect(testFable).to.have.a.property('log')
							.that.is.a('object');
						Expect(testFable).to.have.a.property('settings')
							.that.is.a('object');
						Expect(testFable).to.have.a.property('fable')
							.that.is.a('object');
						Expect(testFable.settings.Product)
							.to.equal('ApplicationNameHere')
					}
				);
				test
				(
					'The class should initialize itself into a happy little object.',
					function()
					{
						testFable = libFable.new({Product:'LegacyApplicationNameHere', LogStreams: false});
						// Instantiate the logger
						Expect(testFable).to.be.an('object', 'Fable should initialize as an object directly from the require statement.');
						Expect(testFable).to.have.a.property('log')
						.that.is.a('object');
						Expect(testFable).to.have.a.property('settings')
						.that.is.a('object');
						Expect(testFable).to.have.a.property('fable')
						.that.is.a('object');
						Expect(testFable.settings.Product)
							.to.equal('LegacyApplicationNameHere')
					}
				);
				test
				(
					'Logging should happen...',
					function(fDone)
					{
						testFable = new libFable({Product:'LogTest', LogStreams:[{streamtype:'process.stdout'}]});
						Expect(testFable).to.have.a.property('log')
						.that.is.a('object');
						testFable.log.info('There should be a visible log entry here...');
						fDone();
					}
				);
				test
				(
					'Generate a uuid...',
					function(fDone)
					{
						testFable = new libFable({Product:'LogTest', LogStreams:[{streamtype:'process.stdout'}]});
						Expect(testFable).to.have.a.property('log')
							.that.is.a('object');
						var tmpUUID = testFable.getUUID();
						testFable.log.info('Generating a uuid: '+tmpUUID);
						Expect(tmpUUID)
							.to.be.a('string')
							.to.not.be.empty;
						fDone();
					}
				);
				test
				(
					'Change some settings later...',
					function(fDone)
					{
						testFable = new libFable();
						Expect(testFable).to.have.a.property('settings')
						.that.is.a('object');
						Expect(testFable.settings.Product)
							.to.equal('ApplicationNameHere');
						Expect(testFable.settings.ProductVersion)
							.to.equal('0.0.0');
						testFable.settingsManager.merge({Product:'TestProduct'});
						Expect(testFable.settings.Product)
							.to.equal('TestProduct');
						Expect(testFable.settings.ProductVersion)
							.to.equal('0.0.0');
						fDone();
					}
				);
			}
		);
	}
);