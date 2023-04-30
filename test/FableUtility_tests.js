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
	'Fable Utility',
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
						let tmpTemplate = testFable.Utility.template('There // %> are \\ */ /* <%= Count %> things....');
						Expect(tmpTemplate).to.be.a('function');
						Expect(tmpTemplate({Count:1000})).to.equal('There // %> are \\ */ /* 1000 things....');
					}
				);
				test
				(
					'Processed Template like Underscore Work With Variables and no scope leakage',
					function()
					{
						testFable = new libFable();
						let tmpTemplate = testFable.Utility.template('There are so many of these things (<%= Count %> to be exact)....');
						Expect(tmpTemplate).to.be.a('function');
						Expect(tmpTemplate({Count:1000})).to.equal('There are so many of these things (1000 to be exact)....');
						let tmpOtherTemplate = testFable.Utility.template('Things count: <%= Count %>');
						Expect(tmpOtherTemplate).to.be.a('function');
						Expect(tmpOtherTemplate({Count:600})).to.equal('Things count: 600');
						Expect(tmpTemplate({Count:256})).to.equal('There are so many of these things (256 to be exact)....');
					}
				);
				test
				(
					'Processed Template like Underscore Work With Variables and no scope leakage',
					function()
					{
						testFable = new libFable();
						testFable.Utility.buildHashedTemplate('HeadLine', '<h1><%= TitleText %> Page</h1>');
						testFable.Utility.buildHashedTemplate('Slogan', '<p>Some people, like <%= Name %>, have all the fun.</p>');
						
						// Access the low level service render function
						Expect(testFable.services.Template.HeadLine.renderFunction({TitleText:'Test'})).to.equal('<h1>Test Page</h1>');
						Expect(testFable.services.Template.Slogan.renderFunction({Name:'Jim'})).to.equal('<p>Some people, like Jim, have all the fun.</p>');

						// Use the high level simpler one
						Expect(testFable.Utility.templates.HeadLine({TitleText:'A New'})).to.equal('<h1>A New Page</h1>');
						Expect(testFable.Utility.templates.Slogan({Name:'Bob'})).to.equal('<p>Some people, like Bob, have all the fun.</p>');
					}
				);
				test
				(
					'Processed Template with default scope',
					function()
					{
						testFable = new libFable();
						let tmpTemplate = testFable.Utility.template('There are <%= Count %> things....', {Count:1000});
						Expect(tmpTemplate).to.equal('There are 1000 things....');
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
				test
				(
					'chunk should work _exactly_ like underscore',
					function()
					{
						testFable = new libFable();
						// These are *literally* the tests from underscore
						/* Here for posterity
						 *

						 *
						 */
						// Regular Expressions for easy conversion of underscore tests:
						// S: assert.deepEqual\(_.chunk\((.*)\), (.*), '
						// R: Expect(testFable.Utility.chunk($1)).to.deep.equal($2);   // $3
					    Expect(testFable.Utility.chunk([], 2)).to.deep.equal([]);   // chunk for empty array returns an empty array');

					    Expect(testFable.Utility.chunk([1, 2, 3], 0)).to.deep.equal([]);   // chunk into parts of 0 elements returns empty array');
					    Expect(testFable.Utility.chunk([1, 2, 3], -1)).to.deep.equal([]);   // chunk into parts of negative amount of elements returns an empty array');
					    Expect(testFable.Utility.chunk([1, 2, 3])).to.deep.equal([]);   // defaults to empty array (chunk size 0)');

					    Expect(testFable.Utility.chunk([1, 2, 3], 1)).to.deep.equal([[1], [2], [3]]);   // chunk into parts of 1 elements returns original array');

					    Expect(testFable.Utility.chunk([1, 2, 3], 3)).to.deep.equal([[1, 2, 3]]);   // chunk into parts of current array length elements returns the original array');
					    Expect(testFable.Utility.chunk([1, 2, 3], 5)).to.deep.equal([[1, 2, 3]]);   // chunk into parts of more then current array length elements returns the original array');

					    Expect(testFable.Utility.chunk([10, 20, 30, 40, 50, 60, 70], 2)).to.deep.equal([[10, 20], [30, 40], [50, 60], [70]]);   // chunk into parts of less then current array length elements');
					    Expect(testFable.Utility.chunk([10, 20, 30, 40, 50, 60, 70], 3)).to.deep.equal([[10, 20, 30], [40, 50, 60], [70]]);   // chunk into parts of less then current array length elements');
					}
				);
				test
				(
					'waterfall should be passed in from async',
					function(fDone)
					{
						testFable = new libFable();

						let tmpState = {};

						testFable.Utility.waterfall([
							(fStageComplete)=>
							{
								tmpState.Name = 'The Pixies';
								fStageComplete();
							},
							(fStageComplete)=>
							{
								tmpState.Type = 'Band';
								fStageComplete();
							}],
							(pError)=>
							{
								Expect(tmpState.Name).to.equal('The Pixies');
								Expect(tmpState.Type).to.equal('Band');
								fDone();
							})
					}
				);
				test
				(
					'eachLimit should be passed in from async',
					function(fDone)
					{
						testFable = new libFable();

						let tmpState = {};

						let tmpData = ['a','b','c','d','e'];

						testFable.Utility.eachLimit(tmpData, 2,
							(pItem, fCallback)=>
							{
								tmpState[pItem] = pItem;
								fCallback();
							},
							(pError)=>
							{
								Expect(tmpState).to.have.a.property('a');
								Expect(tmpState).to.have.a.property('b');
								Expect(tmpState).to.have.a.property('c');
								Expect(tmpState).to.have.a.property('d');
								Expect(tmpState).to.have.a.property('e');
								Expect(tmpState.c).to.equal('c');
								fDone();
							})
					}
				);
			}
		);
	}
);