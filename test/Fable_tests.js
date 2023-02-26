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

let libFable = require('../source/Fable.js');

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

		suite
		(
			'Utility',
			function()
			{
				test
				(
					'merging objects should work like old underscore did with 1 paramter',
					function()
					{
						testFable = new libFable();
						let tmpResult = testFable.Utility.extend({SomeValue:'here'});
						Expect(tmpResult).to.have.a.property('SomeValue')
							.that.is.a('string');
						Expect(tmpResult.SomeValue).to.equal('here')
					}
				);
				test
				(
					'merging objects should work like old underscore did with 2 paramter',
					function()
					{
						testFable = new libFable();
						let tmpResult = testFable.Utility.extend({SomeValue:'here',Size:10},{Color:'Red',Size:20});
						Expect(tmpResult).to.have.a.property('SomeValue')
							.that.is.a('string');
						Expect(tmpResult.SomeValue).to.equal('here');
						Expect(tmpResult.Color).to.equal('Red');
						Expect(tmpResult.Size).to.equal(20);
					}
				);
				test
				(
					'merging objects should work like old underscore did with more paramters',
					function()
					{
						testFable = new libFable();
						let tmpResult = testFable.Utility.extend(
							{SomeValue:'here',Size:10, Race:'Human'},
							{Color:'Red',Size:20, Band:'Metalocalypse'},
							{Name:'Bilbo', Size:15, Race:'Hobbit', Band:'The dead hobbitz'});
						Expect(tmpResult).to.have.a.property('SomeValue')
							.that.is.a('string');
						Expect(tmpResult.SomeValue).to.equal('here')
						Expect(tmpResult.Color).to.equal('Red');
						Expect(tmpResult.Band).to.equal('The dead hobbitz');
						Expect(tmpResult.Race).to.equal('Hobbit');
						Expect(tmpResult.Name).to.equal('Bilbo');
						Expect(tmpResult.Size).to.equal(15);
					}
				);
			}
		);
	}
);