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
	'Fable',
	function()
	{
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
						let testFable = new libFable({LogStreams: false});
						// Instantiate the logger
						Expect(testFable).to.be.an('object', 'Fable should initialize as an object directly from the require statement.');
						Expect(testFable).to.have.a.property('log').that.is.a('object');
						Expect(testFable).to.have.a.property('settings').that.is.a('object');
						Expect(testFable).to.have.a.property('fable').that.is.a('object');
						Expect(testFable.settings.Product).to.equal('ApplicationNameHere');

						// Test package anthropology
						Expect(testFable._Package).to.be.an('object', 'Fable should have a _Package object.');
						Expect(testFable._Package.name).to.equal('fable', 'Fable _Package.package.name should be set.');
					}
				);
				test
				(
					'The class should initialize itself into a happy little object with more config.',
					function()
					{
						let testFable = libFable.new({Product:'LegacyApplicationNameHere', LogStreams: false});
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
						Expect(testFable.EnvironmentData.Environment)
							.to.equal('node.js');
					}
				);
				test
				(
					'The static date stamp should work.',
					function()
					{
						let tmpDateStamp = libFable.generateFileNameDateStamp();
						Expect(tmpDateStamp).to.be.a('string');
						Expect(tmpDateStamp.length).to.equal(19);
						Expect(tmpDateStamp).to.match(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/);
					}
				);
				test
				(
					'Logging should happen...',
					function(fDone)
					{
						let testFable = new libFable({Product:'LogTest', LogStreams:[{streamtype:'process.stdout'}]});
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
						let testFable = new libFable({Product:'LogTest', LogStreams:[{streamtype:'process.stdout'}]});
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
						let testFable = new libFable();
						Expect(testFable).to.have.a.property('settings')
						.that.is.a('object');
						Expect(testFable.settings.Product)
							.to.equal('ApplicationNameHere');
						Expect(testFable.settings.ProductVersion)
							.to.equal('0.0.0');
						testFable.services.SettingsManager.merge({Product:'TestProduct'});
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