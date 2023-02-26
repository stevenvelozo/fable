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
	'FableUtility',
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
			'Utility',
			function()
			{
				test
				(
					'Process Template like Underscore',
					function()
					{
						testFable = new libFable();
						let tmpTemplate = testFable.Utility.template('Something');
						Expect(tmpTemplate).to.be.a('function');
					}
				);
				test
				(
					'Processed Template like Underscore Work Without Variables',
					function()
					{
						testFable = new libFable();
						let tmpTemplate = testFable.Utility.template('Something');
						Expect(tmpTemplate).to.be.a('function');
						Expect(tmpTemplate()).to.equal('Something');
					}
				);
				test
				(
					'Processed Template like Underscore Work With Variables',
					function()
					{
						testFable = new libFable();
						let tmpTemplate = testFable.Utility.template('There are <%= Count %> things....');
						Expect(tmpTemplate).to.be.a('function');
						Expect(tmpTemplate({Count:1000})).to.equal('There are 1000 things....');
					}
				);
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