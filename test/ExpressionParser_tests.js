/**
* Unit tests for Fable Math
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');

var Chai = require("chai");
var Expect = Chai.expect;

function getExpressionParser()
{
	let testFable = new libFable();
	return testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
}

suite
(
	'Expressions',
	function()
	{
		suite
		(
			'Math Expressions',
			function()
			{
				test
				(
					'Exercise the Tokenizer',
					(fDone)=>
					{
						let tmpResultObject = {};
						let _Parser = getExpressionParser();
						let tokenizedResults = _Parser.tokenize('5 + 2', tmpResultObject);
						Expect(tokenizedResults.length).to.equal(3);
						Expect(tokenizedResults).to.deep.equal(['5', '+', '2']);
						Expect(tmpResultObject.RawExpression).to.equal('5 + 2');
						Expect(tmpResultObject.RawTokens).to.deep.equal(tokenizedResults);
						let complexTokenizedResults = _Parser.tokenize('5+3 - sqrt(75 / (3 + {Depth}) * Width)^ 3');
						Expect(complexTokenizedResults.length).to.equal(18);
						Expect(complexTokenizedResults).to.deep.equal(['5', '+', '3', '-', 'sqrt', '(', '75', '/', '(', '3', '+', '{Depth}', ')', '*', 'Width', ')', '^', '3']);
						return fDone();
					}
				);
				test
				(
					'Exercise the Linter',
					(fDone)=>
					{
						let tmpResultObject = {};
						let _Parser = getExpressionParser();

						let tokenizedResults = _Parser.tokenize('5 + 2', tmpResultObject);
						let lintedResults = _Parser.lintTokenizedExpression(tokenizedResults, tmpResultObject);
						Expect(lintedResults.length).to.equal(1);
						Expect(lintedResults[0]).to.contain('lintTokenizedExpression found no equality assignment in the tokenized')

						let complexTokenizedResults = _Parser.tokenize('Value = 5+3 - sqrt(75 / (3 + -{Depth}) * Width)^ 3');
						let complexLintedResults = _Parser.lintTokenizedExpression(complexTokenizedResults, tmpResultObject);
						Expect(complexLintedResults.length).to.equal(0);

						let brokenTokenizedResults = _Parser.tokenize('Value = 5+3 - sqrt(75 */ (3 + {Depth}) * Width)^ 3');
						let brokenLintedResults = _Parser.lintTokenizedExpression(brokenTokenizedResults, tmpResultObject);
						// The */ is invalid!!!!
						Expect(brokenLintedResults.length).to.equal(1);
						return fDone();
					}
				);
				test
				(
					'Exercise Postfix Notation Conversion',
					(fDone)=>
					{
						let tmpResultObject = {};

						let _Parser = getExpressionParser();

						let tokenizedResults = _Parser.tokenize('= 5 + 2', tmpResultObject);
						let lintedResults = _Parser.lintTokenizedExpression(tokenizedResults, tmpResultObject);
						let postfixResults = _Parser.buildPostfixedSolveList(tokenizedResults, tmpResultObject);
						Expect(postfixResults.length).to.equal(2);

						let complexTokenizedResults = _Parser.tokenize('Value = 5+3 - sqrt(75 / (3 + -{Depth}) * Width)^ 3');
						let complexLintedResults = _Parser.lintTokenizedExpression(complexTokenizedResults);
						let complexPostfixResults = _Parser.buildPostfixedSolveList(complexTokenizedResults);
						Expect(complexPostfixResults.length).to.equal(0);

						return fDone();
					}
				);
				test
				(
					'Exercise Variable Lookup and Substitution',
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						let tmpResultObject = {};
						let tmpDataObject = {X: 5, Y: 3, Z: 75, Depth: 3, Width: 2};
						let tmpDestinationObject = {};

						let tmpArea = _Parser.solve('Area = X * Y  * Z', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

						Expect(tmpArea).to.equal("1125");

						Expect(tmpDestinationObject.Area).to.equal("1125");

						return fDone();
					}
				);
				test
				(
					'Exercise Marshaling to Value at a Hashed Address',
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						let tmpResultObject = {};
						let tmpDataObject = {X: 5.867, Y: 3.1, Z: 75, Depth: 3, Width: 2};
						let tmpDestinationObject = {};

						_Parser.solve('Area = X * Y  * Z', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

						Expect(tmpDestinationObject.Area).to.equal("1364.0775");

						return fDone();
					}
				);
				test
				(
					'Exercise End-to-End Expression Parsing',
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						Expect(_Parser.solve('1 + 1')).to.equal("2");
						Expect(_Parser.solve('1 * 1')).to.equal("1");
						Expect(_Parser.solve('1 / 1')).to.equal("1");
						Expect(_Parser.solve('1 - 1')).to.equal("0");
						Expect(_Parser.solve('10 * 2')).to.equal("20");

						Expect(_Parser.solve('200 * 1.5')).to.equal("300");
						Expect(_Parser.solve('7 +13')).to.equal("20");
						Expect(_Parser.solve('7+14')).to.equal("21");


						Expect(_Parser.solve('5 + 2 * 10')).to.equal("25");
						Expect(_Parser.solve('3.5 + 5 + 10 * 10 / 5')).to.equal("28.5");

						Expect(_Parser.solve('3.5 + 5 + 10 * 10 / 5 - 1.5')).to.equal("27");

						Expect(_Parser.solve('(100 - 10)')).to.equal("90");

						Expect(_Parser.solve('100.55 - 1.55')).to.equal("99");

						Expect(_Parser.solve('5 + 2')).to.equal('7');

						Expect(_Parser.solve('50.22 + 2')).to.equal('52.22');

						Expect(_Parser.solve('5 ^ 2')).to.equal('25');

						Expect(_Parser.solve('((15000 * 2) / 4)^2 + 100 - 10 * (35 + 5)')).to.equal("56249700");

						Expect(_Parser.solve('1.5 * sqrt(8 * 2.423782342^2) / 10')).to.equal('1.02832375808904701855')
						Expect(_Parser.solve('1 * sqrt(16)')).to.equal('4');

						Expect(_Parser.solve('sin(rad(60))')).to.equal('0.8660254037844386');

						Expect(_Parser.solve('Result = 5+3 - sqrt(75 / (3 + Depth) * Width)^ 3', { "PR": 1.5, "Z": "20.036237", "C": -13, Depth: 100.203, Width: 10.5}))
							.to.equal('-436.298371634749698156043404501049817281022489463053365091209703125')

						let tmpResult = _Parser.solve('Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))', {C:-13,PR:1.5,Z:20.03})
						Expect(tmpResult).to.equal("-1110837.0769230769230769230307");

						let tmpResultPrecise = _Parser.solve('Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))', {C:"-13",PR:"1.5",Z:"20.03"})
						Expect(tmpResultPrecise).to.equal("-1110837.0769230769230769230307");

						return fDone();
					}
				);
			}
		);
	}
);