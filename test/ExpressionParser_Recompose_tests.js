/**
* Unit tests for Fable ExpressionParser recompose and AddressParameterIndices
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
	'Expression Parser Recompose',
	function ()
	{
		suite
		(
			'Recompose',
			function ()
			{
				test
				(
					'Should recompose a simple arithmetic expression.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('5 + 2', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('5 + 2');
						return fDone();
					}
				);
				test
				(
					'Should recompose an assignment expression.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('C = A + B', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('C = A + B');
						return fDone();
					}
				);
				test
				(
					'Should recompose a function call expression.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('AggregateValue = SUM(ValueArray)', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('AggregateValue = SUM(ValueArray)');
						return fDone();
					}
				);
				test
				(
					'Should recompose a function with a string parameter.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('hidesections("OrderedSolverSection")', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('hidesections("OrderedSolverSection")');
						return fDone();
					}
				);
				test
				(
					'Should recompose a complex expression with state addresses.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('Value = sqrt(75 / (3 + {Depth}) * Width) ^ 3', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('Value = sqrt(75 / (3 + {Depth}) * Width) ^ 3');
						return fDone();
					}
				);
				test
				(
					'Should recompose a function with multiple comma-separated parameters.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('Result = ROUND(5 + 2 * 10, 2)', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('Result = ROUND(5 + 2 * 10, 2)');
						return fDone();
					}
				);
				test
				(
					'Functions recompose with their spaces prettified.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('Result=               ROUND (   5 + 2 * 10 ,  2)', tmpResultObject);
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('Result = ROUND(5 + 2 * 10, 2)');
						return fDone();
					}
				);				test
				(
					'Should handle empty input gracefully.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpRecomposed = _Parser.recompose([]);
						Expect(tmpRecomposed).to.equal('');
						tmpRecomposed = _Parser.recompose(null);
						Expect(tmpRecomposed).to.equal('');
						return fDone();
					}
				);
				test
				(
					'Should recompose a dot-notation address as a single token.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						let tmpResultObject = {};
						_Parser.tokenize('AggregateValue2 = SUM(DataTableAddress[].ValueAddress)', tmpResultObject);
						Expect(tmpResultObject.OriginalRawTokens).to.include('DataTableAddress[].ValueAddress');
						let tmpRecomposed = _Parser.recompose(tmpResultObject.OriginalRawTokens);
						Expect(tmpRecomposed).to.equal('AggregateValue2 = SUM(DataTableAddress[].ValueAddress)');
						return fDone();
					}
				);
				test
				(
					'Should allow direct token array recomposition for modified tokens.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						// Simulate token modification (as createDistinctManifest would do)
						let tmpTokens = ['AggregateValue_abc123', '=', 'SUM', '(', 'ValueArray_abc123', ')'];
						let tmpRecomposed = _Parser.recompose(tmpTokens);
						Expect(tmpRecomposed).to.equal('AggregateValue_abc123 = SUM(ValueArray_abc123)');
						return fDone();
					}
				);
			}
		);
		suite
		(
			'AddressParameterIndices',
			function ()
			{
				test
				(
					'Should store AddressParameterIndices when adding a solver function.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						_Parser.addSolverFunction('testfunc', 'some.address', 'Test function', [0, 2]);
						Expect(_Parser.functionMap['testfunc']).to.be.an('object');
						Expect(_Parser.functionMap['testfunc'].AddressParameterIndices).to.deep.equal([0, 2]);
						return fDone();
					}
				);
				test
				(
					'Should not add AddressParameterIndices when not provided.',
					(fDone) =>
					{
						let _Parser = getExpressionParser();
						_Parser.addSolverFunction('testfunc2', 'some.address', 'Test function 2');
						Expect(_Parser.functionMap['testfunc2']).to.be.an('object');
						Expect(_Parser.functionMap['testfunc2'].AddressParameterIndices).to.equal(undefined);
						return fDone();
					}
				);
			}
		);
	}
);
