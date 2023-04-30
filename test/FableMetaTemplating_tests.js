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


var loadPrecedentModule = () =>
{
	let tmpFable = new libFable();
	return tmpFable.serviceManager.instantiateServiceProviderWithoutRegistration('MetaTemplate', {});
};

var configPrecedent = (pModule) =>
{
	pModule.addPattern('<%', '%>', 'JUNKED_THIS_DATA');
	// This one gets the count of the inner string...
	pModule.addPattern('<%#', '%>', (pData)=>{return pData.length});
	// Replaces the string with the settings object...
	pModule.addPattern('<%=', '%>', (pData)=>{return JSON.stringify(pModule.settings);});
	// This just escapes out pairs of $
	pModule.addPattern('$');
};

suite
(
	'Fable MetaTemplating',
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
			'MetaTemplating',
			function()
			{
				test
				(
					'No Matches...',
					(fDone) =>
					{
						var tmpTestString = 'ABC123';
						var tmpExpectedResult = tmpTestString;
						var testPrecedent = loadPrecedentModule();
						configPrecedent(testPrecedent);
						var	tmpResult = testPrecedent.parseString(tmpTestString);
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Count function...',
					(fDone) =>
					{
						var tmpTestString = 'There are <%#0123456789%> characters in here';
						var tmpExpectedResult = 'There are 10 characters in here';
						var testPrecedent = loadPrecedentModule();
						configPrecedent(testPrecedent);
						var	tmpResult = testPrecedent.parseString(tmpTestString);
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Multiple terms...',
					(fDone) =>
					{
						var tmpTestString = 'There are <%#12345%> characters in here and a $comment$ as well.  And we <% Some data in here %> right up.';
						var tmpExpectedResult = 'There are 5 characters in here and a comment as well.  And we JUNKED_THIS_DATA right up.';
						var testPrecedent = loadPrecedentModule();
						configPrecedent(testPrecedent);
						var	tmpResult = testPrecedent.parseString(tmpTestString);
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
			}
		);
	}
);