/**
* Unit tests for Fable
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

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
						testFable = require('../source/Fable.js').new({LogStreams: false});
						// Instantiate the logger
						Expect(testFable).to.be.an('object', 'Fable should initialize as an object directly from the require statement.');
						Expect(testFable).to.have.a.property('log')
						.that.is.a('object');
						Expect(testFable).to.have.a.property('settings')
						.that.is.a('object');
						Expect(testFable).to.have.a.property('fable')
						.that.is.a('object');
						Expect(testFable.settings.Product)
							.to.equal('Fable')
					}
				);
				test
				(
					'Logging should happen...',
					function(fDone)
					{
						testFable = require('../source/Fable.js').new({Product:'LogTest', LogStreams:[{streamtype:'process.stdout'}]});
						Expect(testFable).to.have.a.property('log')
						.that.is.a('object');
						testFable.log.info('There should be a visible log entry here...');
						fDone();
					}
				);
				test
				(
					'Change some settings later...',
					function(fDone)
					{
						testFable = require('../source/Fable.js').new();
						Expect(testFable).to.have.a.property('settings')
						.that.is.a('object');
						Expect(testFable.settings.Product)
							.to.equal('Fable');
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