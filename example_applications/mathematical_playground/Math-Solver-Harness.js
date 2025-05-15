const libFable = require('../../source/Fable.js');

const _Fable = new libFable({"Product": "Ti"});
// This instantiates the ExpressionParser service provider
_Fable.instantiateServiceProviderIfNotExists('ExpressionParser');

/* * * * * * * * * * * * * * * * *
 *
 * Solve a basic math problem.
 * 
 */
_Fable.log.info(`Beginning Basic Math Exercises....`);
// Just type numbers and watch it go brrr
_Fable.log.info(`One-liner solve is: ${_Fable.ExpressionParser.solve("Result = 73.5 * 28.8 * 200.5")}`);
// Let's put it in a variable for easier exercises
const _ExpressionParser = _Fable.ExpressionParser;
// Look up somoe variables in an object
_Fable.log.info(`One-liner solve with variables is: ${_ExpressionParser.solve("Volume = Width * Height * Depth", {"Width": 73.5, "Height": 28.8, "Depth": 200.5})}`);


/* * * * * * * * * * * * * * * * *
 *
 * A simple run through of some mathematical expressions
 * 
 */
_Fable.log.info(`Beginning Run-through for Set of Test Expressions....`);
// An array of equations with expected values
let _Equations = require(`./Equations.json`);
// The application state is a plain javascript object we pass into the solver to pull variables from
let _AppData = require(`./AppData.json`);
// The manifest is a Manyfest which describes hashes for complex addresses in the application state object
// For example you can't use "Student[0].Age" as a variable in the expression
// ...but you can use "Student[0].Age" as an address in the manifest with a hash of "StudentAge"
// ...and then reference "StudentAge" in the expression.
let tmpManifestConfiguration = { "Scope":"None", "Descriptors":[] };
let tmpManifest = _Fable.newManyfest(tmpManifestConfiguration);
// Run each expression in the Equations.json file through the expression parser.
for (let i = 0; i < _Equations.Expressions.length; i++)
{
	let tmpResultObject = {};
	let tmpResultValue = _ExpressionParser.solve(_Equations.Expressions[i].Equation, _AppData, tmpResultObject, tmpManifest);
	console.log(`Expression [${i}]: [${_Equations.Expressions[i].Equation}] ==> ${tmpResultValue}`);
	console.log(`           Expected: ${_Equations.Expressions[i].ExpectedResult}`);
	//_Fable.ExpressionParser.Messaging.logFunctionOutcome(tmpResultObject);

	if (tmpResultValue !== _Equations.Expressions[i].ExpectedResult)
	{
		console.log(`Error: Equation ${_Equations.Expressions[i].Equation} expected [${_Equations.Expressions[i].ExpectedResult}] but got [${tmpResultValue}]`);
	}
}


/* * * * * * * * * * * * * * * * *
 *
 * A manual run through of each phase of the expression parser
 * 
 */
// Load up some fruit data to play around with
let _FruitData = require(`../data/Fruit-Data.json`);
let _FruitManifestDescription = require(`../data/Fruit-Manyfest.json`);
let _FruitManifest = _Fable.newManyfest(_FruitManifestDescription);

_Fable.AppData = _FruitData;
_Fable.log.info(`Beginning Manual Solve with Embedded Fruit Data....`);

// // The expression we pass into the solver is just a string
let tmpExpression = 'HyperMax.HealthIndex = (SUM(Calories) / SUM(Sugar)) * MEDIAN(Fat) + (SQRT(AVG(Protein)) - (PI() + 99))';
//tmpExpression = `aggregationhistogram("AppData.FruityVice", "family", "nutritions.calories")`;
tmpExpression = "Result = 3.5 + 50 + 10 * \"taco\" / 5 - 1.5", "ExpectedResult";
//tmpExpression = 'Out.Match = FindFirstValueByStringIncludes("AppData.FruityVice", "name", "uria", "id")';
_Fable.log.info(`Solving tmpExpression: [${tmpExpression}]`);

// // This is an object where the parser will write out the results of each phase of the compiler/parser/solver
let tmpExpressionParseOutcome = {};
let tmpSolverResultsObject = {};

// Step 1: Tokenize the expression
let complexTokenizedResults = _ExpressionParser.tokenize(tmpExpression, tmpExpressionParseOutcome);
// Step 2: Lint the tokenized expression (this is optional but very helpful for user feedback)
let complexLintedResults = _ExpressionParser.lintTokenizedExpression(complexTokenizedResults, tmpExpressionParseOutcome);
// Step 3: Parse the tokenized expression (this generates a postfix expression)
let complexPostfixedResults = _ExpressionParser.buildPostfixedSolveList(complexTokenizedResults, tmpExpressionParseOutcome);
// Step 4: Substitute the values references in the tokenized objects representing data within the postfixed expression
_ExpressionParser.substituteValuesInTokenizedObjects(tmpExpressionParseOutcome.PostfixTokenObjects, _FruitData, tmpExpressionParseOutcome, _FruitManifest);
// Step 5: Solve the postfixed expression
let tmpResultValue = _ExpressionParser.solvePostfixedExpression(tmpExpressionParseOutcome.PostfixSolveList, tmpSolverResultsObject, tmpExpressionParseOutcome, _FruitManifest);

// Now that we have a solved expression and the mapped-in values, show the user the solution
_Fable.ExpressionParser.Messaging.logFunctionOutcome(tmpExpressionParseOutcome);


// Step 6: Look at the results.
console.log(`Outcome object: ${JSON.stringify(tmpSolverResultsObject)}`);
console.log(`Result of ${tmpExpression} solve: ${tmpResultValue}`);
console.log('QED');
