/**
* Unit tests for Fable
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const libFable = require('../source/Fable.js');

const Chai = require("chai");
const Expect = Chai.expect;


const loadMetaTemplateModule = () =>
{
	let tmpFable = new libFable();
	return tmpFable.instantiateServiceProviderWithoutRegistration('MetaTemplate', {});
};

const configMetaTemplate = (pModule) =>
{

	pModule.addPattern('<%', '%>', 'JUNKED_THIS_DATA');
	// This one gets the count of the inner string...
	pModule.addPattern('<%#', '%>', (pData)=>{return pData.length});
	// Replaces the string with the settings object...
	pModule.addPattern('<%=', '%>', (pData)=>{return JSON.stringify(pModule.settings);});
	// Custom expression hashes
	pModule.addPattern('<*', '*>', (pHash, pData)=>{return `pData is [${pData}] with a hash of [${pHash}]`});
	pModule.addPattern('<^', '^>', (pHash, pData)=>{return `hash of [${pHash}] from pData is ${pData[pHash]}`});
	// This just escapes out pairs of $
	pModule.addPattern('$');
	pModule.addPatternBoth('<%Async', '%>',
		(pHash, pData) =>
		{
			return `NONASYNC DATA IS [${pHash}]`;
		},
		(pHash, pData, fCallback)=>
		{
			return fCallback(null, `ASYNC DATA IS [${pHash}]`);
		});

	pModule.addPatternBoth('<~', '~>',
		(pHash, pData) =>
		{
			return `Non-Async Jellyfish called for pData which is [${pData}] with a hash of [${pHash}]`
		},
		(pHash, pData, fCallback)=>
		{
			return fCallback(null, `Async Jellyfish called for pData which is [${pData}] with a hash of [${pHash}]`);
		});

	// Exercise the history a bit
	pModule.addPatternBoth('{~', '~}',
		(pHash, pData, pContext) =>
		{
			return `Non-AsyncJF with a hash of [${pHash}] with a Context size of [${pContext.length}] and a Context[0] of [${JSON.stringify(pContext[0])}]`
		},
		(pHash, pData, fCallback, pContext)=>
		{
			return fCallback(null, `AsyncJF with a hash of [${pHash}] with a Context size of [${pContext.length}] and a Context[0] of [${JSON.stringify(pContext[0])}]`);
		});

};

suite
(
	'Fable MetaTemplating',
	() =>
	{
		setup (() => {});

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
						let tmpTestString = 'ABC123';
						let tmpExpectedResult = tmpTestString;
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString);
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Count function...',
					(fDone) =>
					{
						let tmpTestString = 'There are <%#0123456789%> characters in here';
						let tmpExpectedResult = 'There are 10 characters in here';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString);
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Multiple terms...',
					(fDone) =>
					{
						let tmpTestString = 'There are <%#12345%> characters in here and a $comment$ as well.  And we <% Some data in here %> right up.';
						let tmpExpectedResult = 'There are 5 characters in here and a comment as well.  And we JUNKED_THIS_DATA right up.';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString);
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Basic pattern replacement...',
					(fDone) =>
					{
						let testMetaTemplate = loadMetaTemplateModule();

						Expect(Object.keys(testMetaTemplate.ParseTree).length).to.equal(0, 'There should be an empty tree on initialization.');
						configMetaTemplate(testMetaTemplate);
						Expect(Object.keys(testMetaTemplate.ParseTree).length).to.equal(3, 'The tree should grow properly.');

						//console.log(JSON.stringify(testMetaTemplate.tree,null,4));

						let tmpResult = testMetaTemplate.parseString('');
						Expect(tmpResult.length).to.equal(0, 'Parsing Empty Strings should Work...');

						fDone();
					}
				);

				test
				(
					'Leveraging pData a bit...',
					(fDone) =>
					{
						let tmpTestString = 'The <*SomeValue*> pData up in here and a $comment$ as well.';
						let tmpExpectedResult = 'The pData is [Yikes] with a hash of [SomeValue] pData up in here and a comment as well.';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString, 'Yikes');
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Custom this',
					(fDone) =>
					{
						let tmpTestString = 'The [^objective^] pData up in here and a $comment$ as well.';
						let tmpExpectedResult = 'The This objective is like {\"BigData\":\"is here\"} pData up in here and a comment as well.';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);

						testMetaTemplate.addPattern('[^', '^]',
							function (pData)
							{
								return `This ${pData} is like ${JSON.stringify(this)}`;
							}, {BigData:'is here'});

						let	tmpResult = testMetaTemplate.parseString(tmpTestString, 'where my big data at');
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Leveraging pData a using subobjects...',
					(fDone) =>
					{
						let tmpTestString = 'The <^SomeValue^> pData up in here and a $comment$ as well.';
						let tmpExpectedResult = 'The hash of [SomeValue] from pData is AirbornLight pData up in here and a comment as well.';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'});
						Expect(tmpResult).to.equal(tmpExpectedResult);
						fDone();
					}
				);
				test
				(
					'Async Function',
					(fDone) =>
					{
						let tmpTestString = 'The <^SomeValue^> pData and Async <%AsyncThe Funny String%> up in here and a $comment$ as well.';
						let tmpExpectedResult = 'The hash of [SomeValue] from pData is AirbornLight pData up in here and a comment as well.';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'},
							(pError, pValue) =>
							{
								Expect(pValue).to.equal('The hash of [SomeValue] from pData is AirbornLight pData and Async ASYNC DATA IS [The Funny String] up in here and a comment as well.');
								return fDone();
							});
					}
				);
				test
				(
					'Passing both Async and Non-async Function',
					(fDone) =>
					{
						let tmpTestString = 'The <^SomeValue^> and <~JELLY FISH~> pData and Async <%AsyncThe Funny String%> up in here and a $comment$ as well.';
						let tmpExpectedResultAsync = 'The hash of [SomeValue] from pData is AirbornLight and Async Jellyfish called for pData which is [[object Object]] with a hash of [JELLY FISH] pData and Async ASYNC DATA IS [The Funny String] up in here and a comment as well.';
						let tmpExpectedResult = 'The hash of [SomeValue] from pData is AirbornLight and Non-Async Jellyfish called for pData which is [[object Object]] with a hash of [JELLY FISH] pData and Async NONASYNC DATA IS [The Funny String] up in here and a comment as well.';
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						let tmpNonAsyncResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'});
						Expect(tmpNonAsyncResult).to.equal(tmpExpectedResult);
						let	tmpResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'},
							(pError, pValue) =>
							{
								Expect(pValue).to.equal(tmpExpectedResultAsync);
								return fDone();
							});
					}
				);				test
				(
					'Bad pattern start parameter...',
					(fDone) =>
					{
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						Expect(testMetaTemplate.addPattern('', '>', 'SHORTEST_MATCH')).to.equal(false);
						fDone();
					}
				);
				test
				(
					'Bad pattern end parameter...',
					(fDone) =>
					{
						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);
						Expect(testMetaTemplate.addPattern('<', '', 'SHORTEST_MATCH')).to.equal(false);
						fDone();
					}
				);
				test
				(
					'Identifier fallback...',
					(fDone) =>
					{
						let testMetaTemplate = loadMetaTemplateModule();
						testMetaTemplate.addPattern('<', '>', 'SHORTEST_MATCH');
						testMetaTemplate.addPattern('<<', '>', 'MEDIUM_MATCH');
						testMetaTemplate.addPattern('<<EXTRALONG', '>', 'EXTRA_LONG_MATCH');

						let tmpTestStrings = [
							'Match this <> and this <here> please.',
							'Match this SHORTEST_MATCH and this SHORTEST_MATCH please.',

							'Match this <<> and this <<here> please.',
							'Match this MEDIUM_MATCH and this MEDIUM_MATCH please.',

							'Match this <<EXTRALONG> and this <<here> please.',
							'Match this EXTRA_LONG_MATCH and this MEDIUM_MATCH please.',

							'Match this <<<<> and this <here> please.',
							'Match this MEDIUM_MATCH and this SHORTEST_MATCH please.'
						];

						let	tmpResult = '';
						// Test every pair in TestStrings
						for (let i = 0; i < tmpTestStrings.length; i+=2)
						{
							tmpResult = testMetaTemplate.parseString(tmpTestStrings[i]);
							Expect(tmpResult).to.equal(tmpTestStrings[i+1]);
						}
						fDone();
					}
				);
				test
				(
					'Config magic example...',
					(fDone) =>
					{
						// Use case is take a string with the following template expressions and translate them into the value from the environment variable if a default isn't passed in:
						//	'Expressions like ${VariableWithDefault|DefaultValue} have a Default value after the pipe; others like ${VariableWithoutDefault} expressions do not have a Default value after the pipe. but should be processed properly.',
						//	'Expressions like DefaultValue have a Default value after the pipe; others like VariableWithoutDefault expressions do not have a Default value after the pipe. but should be processed properly.',

						// The usual case is just expressions in the string, but composability is fine.

						let testMetaTemplate = loadMetaTemplateModule();

						testMetaTemplate.addPattern('${', '}',
							(pTemplateValue)=>
							{
								let tmpTemplateValue = pTemplateValue.trim();

								let tmpSeparatorIndex = tmpTemplateValue.indexOf('|');

								// If there is no pipe, the default value will end up being whatever the variable name is.
								let tmpDefaultValue = tmpTemplateValue.substring(tmpSeparatorIndex+1);

								let tmpEnvironmentVariableName = (tmpSeparatorIndex > -1) ? tmpTemplateValue.substring(0, tmpSeparatorIndex) : tmpTemplateValue;

								if (process.env.hasOwnProperty(tmpEnvironmentVariableName))
								{
									return process.env[tmpEnvironmentVariableName];
								}
								else
								{
									return tmpDefaultValue;
								}
							});

						let tmpTestStrings = [
							'Expressions like ${VariableWithDefault|DefaultValue} have a Default value after the pipe; others like ${VariableWithoutDefault} expressions do not have a Default value after the pipe. but should be processed properly.',
							'Expressions like DefaultValue have a Default value after the pipe; others like VariableWithoutDefault expressions do not have a Default value after the pipe. but should be processed properly.',

							'${PATH}',
							process.env.PATH,

							'AAA ${PATH}',
							'AAA '+process.env.PATH,

							' ${PATH} AAA ${PATH}',
							' '+process.env.PATH+' AAA '+process.env.PATH,

							'AAA ${PATH} BBB',
							'AAA '+process.env.PATH+' BBB',

							'AAA ${PATH} } BBB',
							'AAA '+process.env.PATH+' } BBB',

							'AAA ${ ${PATH} BBB',
							// Two start parameters isn't okay ---
							// ...it passes the pattern processor the following (without quotes):
							// " ${PATH"
							// Which is not going to match an environment variable.  With the second
							'AAA ${PATH BBB',

							'${PATH|Malarky Default Value} ZZZ',
							process.env.PATH+' ZZZ',

							'${THISISNOTANENVIRONMENTVARIABLE|Real Default Value} ZZZed',
							'Real Default Value ZZZed',

							'${ THISISNOTANENVIRONMENTVARIABLETRIMMED|Real Trimmed Default Value } ZZZed',
							'Real Trimmed Default Value ZZZed',

							'${PATH} BBB',
							process.env.PATH+' BBB'
						];

						let	tmpResult = '';
						// Test every pair in TestStrings
						for (let i = 0; i < tmpTestStrings.length; i+=2)
						{
							tmpResult = testMetaTemplate.parseString(tmpTestStrings[i]);
							Expect(tmpResult).to.equal(tmpTestStrings[i+1]);
						}
						fDone();
					}
				);
				test
				(
					'Passing both Async and Non-async Function with history expectations...',
					(fDone) =>
					{
						let tmpTestString = 'A {~SomeValue~} B';
						let tmpExpectedResultAsync = 'A AsyncJF with a hash of [SomeValue] with a Context size of [1] and a Context[0] of [{\"SomeValue\":\"AirbornLight\"}] B';
						let tmpExpectedResult = 'A Non-AsyncJF with a hash of [SomeValue] with a Context size of [1] and a Context[0] of [{\"SomeValue\":\"AirbornLight\"}] B';

						let tmpCustomHistory = [{YouTheMan:'NowDog'}];
						let tmpExpectedResultCustomHistory = 'A Non-AsyncJF with a hash of [SomeValue] with a Context size of [2] and a Context[0] of [{\"YouTheMan\":\"NowDog\"}] B';

						let testMetaTemplate = loadMetaTemplateModule();
						configMetaTemplate(testMetaTemplate);

						let tmpNonAsyncResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'});
						Expect(tmpNonAsyncResult).to.equal(tmpExpectedResult);

						let tmpNonAsyncCustomResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'}, null, tmpCustomHistory);
						Expect(tmpNonAsyncCustomResult).to.equal(tmpExpectedResultCustomHistory);

						let	tmpResult = testMetaTemplate.parseString(tmpTestString, {SomeValue:'AirbornLight'},
							(pError, pValue) =>
							{
								Expect(pValue).to.equal(tmpExpectedResultAsync);
								return fDone();
							});
					}
				);
			}
		);
	}
);
