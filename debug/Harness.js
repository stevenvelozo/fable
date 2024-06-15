//let libBookstore = require('../retold-harness/bookstore-serve-meadow-endpoint-apis-run.js');
const libFable = require('../source/Fable.js');

let testFable = new libFable({"Product": "Ti"});

testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

let tmpExpression = '';
//tmpExpression = 'Result = 5+3 - sqrt(75 / (3 + Depth) * Width)^ 3';
//tmpExpression = 'Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))';
//tmpExpression = '1.5 * sqrt(8 * 2.423782342^2) / 10';
//tmpExpression = 'Result = ((15000 * 2) / 4)^2 + 100 - 10 * (35 + 5)';
//tmpExpression = 'Result = 1 * sqrt(16)';
//tmpExpression = 'Result = sqrt(100 * (C + 30)) + sin(Depth - Width) / 10';
tmpExpression = 'Result = 3.5 + 50 + 10 * 10 / 5 - 1.5';
let tmpSimpleDataObject = { "PR": 1.5, "Z": "20.036237", "C": -13, Depth: 100.203, Width: 10.5};

testFable.log.info(`tmpExpression: ${tmpExpression}`);

let tmpResultsObject = {};
let complexTokenizedResults = testFable.ExpressionParser.tokenize(tmpExpression, tmpResultsObject);
let complexLintedResults = testFable.ExpressionParser.lintTokenizedExpression(complexTokenizedResults, tmpResultsObject);
let complexPostfixedResults = testFable.ExpressionParser.buildPostfixedSolveList(complexTokenizedResults, tmpResultsObject);
testFable.ExpressionParser.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpSimpleDataObject);
for (let i = 0; i < tmpResultsObject.PostfixSolveList.length; i++)
{
	let tmpToken = tmpResultsObject.PostfixSolveList[i];
	console.log(`${i}: ${tmpToken.VirtualSymbolName} = ${getTokenString(tmpToken.LeftValue)}  ${tmpToken.Operation.Token}  ${getTokenString(tmpToken.RightValue)}`)
}
let tmpResultValue = testFable.ExpressionParser.solvePostfixedExpression(tmpResultsObject.PostfixSolveList, tmpSimpleDataObject, tmpResultsObject);
console.log(`Result: ${tmpResultValue}`);
console.log('QED');
//41.32965489638783839821'

function getTokenString(pToken)
{
	switch (pToken.Type)
	{
		case 'Token.Symbol':
			return `(${pToken.Token} = ${pToken.Value})`;
		case 'Token.StateAddress':
			return `({${pToken.Token}} = ${pToken.Value})`;
		case 'Token.Constant':
			default:
			return pToken.Token;
	}
}