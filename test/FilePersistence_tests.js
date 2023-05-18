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
	'File Persistence',
	function()
	{
		suite
		(
			'Work with Files',
			function()
			{
				test
				(
					'Recursively Create a Folder',
					function(fDone)
					{
						let testFable = new libFable();

						return fDone();
					}
				);
			}
		);
	}
);