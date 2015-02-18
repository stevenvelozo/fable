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
				testFable = require('../source/Fable.js');
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
						Expect(testFable).to.be.an('object', 'Fable should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'There should be some basic metadata on the class parameters',
					function()
					{
						Expect(testFable).to.have.a.property('scope')
						.that.is.a('string'); // Scope is always a string

						Expect(testFable).to.have.a.property('uuid')
						.that.is.a('string')
						.that.is.not.empty;
					}
				);
			}
		);
	}
);