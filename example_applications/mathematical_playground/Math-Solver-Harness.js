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
//tmpExpression = "Result = 3.5 + 50 + 10 * \"taco\" / 5 - 1.5", "ExpectedResult";
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


/* * * * * * * * * * * * * * * * *
 *
 * Excel-compatible SLOPE and INTERCEPT functions
 *
 */
_Fable.log.info(`Beginning Slope and Intercept Exercises....`);

// Simple linear regression: given monthly sales data, find the trend line
// SalesMonths = [1, 2, 3, 4, 5, 6], SalesRevenue = [150, 200, 250, 310, 350, 400]
let tmpSlopeInterceptResults = {};
_ExpressionParser.solve('TrendSlope = SLOPE(SalesRevenue, SalesMonths)', _AppData, tmpSlopeInterceptResults, false, tmpSlopeInterceptResults);
_ExpressionParser.solve('TrendIntercept = INTERCEPT(SalesRevenue, SalesMonths)', _AppData, tmpSlopeInterceptResults, false, tmpSlopeInterceptResults);

console.log(`Sales trend line: Revenue = ${tmpSlopeInterceptResults.TrendIntercept} + ${tmpSlopeInterceptResults.TrendSlope} * Month`);
console.log(`  Slope (revenue per month): ${tmpSlopeInterceptResults.TrendSlope}`);
console.log(`  Intercept (baseline): ${tmpSlopeInterceptResults.TrendIntercept}`);

// Predict next month's revenue using slope and intercept
_ExpressionParser.solve('Month7Prediction = TrendIntercept + TrendSlope * 7', tmpSlopeInterceptResults, tmpSlopeInterceptResults, false, tmpSlopeInterceptResults);
console.log(`  Predicted month 7 revenue: ${tmpSlopeInterceptResults.Month7Prediction}`);

/* * * * * * * * * * * * * * * * *
 *
 * MULTIROWMAP: Multi-Row Lookback Series Solver
 *
 * MULTIROWMAP lets you iterate over an array of objects (rows) and reference
 * values from the current row, previous rows, and even future rows.
 *
 * Syntax:
 *   Result = MULTIROWMAP ROWS FROM <address>
 *     [SERIESSTART <n>]
 *     [SERIESSTEP <n>]
 *     VAR <name> FROM <property> [OFFSET <n>] [DEFAULT <value>]
 *     ...
 *     : <expression>
 *
 * OFFSET 0 (default) = current row
 * OFFSET -1 = previous row, OFFSET -2 = two rows back, etc.
 * OFFSET 1 = next row, OFFSET 2 = two rows ahead, etc.
 * DEFAULT provides a fallback when the referenced row is out of bounds.
 * SERIESSTART controls which row index to start iterating from (negative counts from end).
 * SERIESSTEP controls the iteration step (default 1, use -1 to go backwards).
 *
 */
_Fable.log.info(`Beginning MULTIROWMAP Exercises....`);

let tmpMultiRowResults = {};

// --- Example 1: Fibonacci Verification ---
// Verify that each value in a Fibonacci sequence equals the sum of the two previous values
_ExpressionParser.solve(
	'FibCheck = MULTIROWMAP ROWS FROM FibonacciRows VAR Current FROM Fib VAR Prev1 FROM Fib OFFSET -1 DEFAULT 0 VAR Prev2 FROM Fib OFFSET -2 DEFAULT 0 : Current - (Prev1 + Prev2)',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nFibonacci verification (should be 0 from row 2 onward):`);
console.log(`  FibCheck: [${tmpMultiRowResults.FibCheck.join(', ')}]`);

// --- Example 2: Stock Price Day-over-Day Change ---
// Calculate the daily price change for a stock
_ExpressionParser.solve(
	'DailyChange = MULTIROWMAP ROWS FROM StockPrices VAR Today FROM Close VAR Yesterday FROM Close OFFSET -1 DEFAULT 0 : Today - Yesterday',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nStock daily price change:`);
console.log(`  DailyChange: [${tmpMultiRowResults.DailyChange.join(', ')}]`);

// --- Example 3: 3-Period Moving Average ---
// Compute a 3-day moving average of stock closing prices
_ExpressionParser.solve(
	'MA3 = MULTIROWMAP ROWS FROM StockPrices VAR c0 FROM Close VAR c1 FROM Close OFFSET -1 DEFAULT 0 VAR c2 FROM Close OFFSET -2 DEFAULT 0 : (c0 + c1 + c2) / 3',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\n3-period moving average of stock prices:`);
console.log(`  MA3: [${tmpMultiRowResults.MA3.join(', ')}]`);

// --- Example 4: Forward-Looking (Next Row Reference) ---
// For each temperature reading, compute the difference to the next reading
_ExpressionParser.solve(
	'TempChange = MULTIROWMAP ROWS FROM TemperatureReadings VAR Current FROM Temp VAR Next FROM Temp OFFSET 1 DEFAULT 0 : Next - Current',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nTemperature change to next reading (forward lookback):`);
console.log(`  TempChange: [${tmpMultiRowResults.TempChange.join(', ')}]`);

// --- Example 5: Central Difference (Both Directions) ---
// Approximate the derivative using central difference: (next - prev) / 2
_ExpressionParser.solve(
	'TempDerivative = MULTIROWMAP ROWS FROM TemperatureReadings VAR Prev FROM Temp OFFSET -1 DEFAULT 0 VAR Next FROM Temp OFFSET 1 DEFAULT 0 : (Next - Prev) / 2',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nTemperature central difference derivative:`);
console.log(`  TempDerivative: [${tmpMultiRowResults.TempDerivative.join(', ')}]`);

// --- Example 6: Second Derivative (Two-Row Lookback) ---
// Approximate the second derivative: current - 2*prev + twoprev
_ExpressionParser.solve(
	'TempAcceleration = MULTIROWMAP ROWS FROM TemperatureReadings VAR Current FROM Temp VAR Prev FROM Temp OFFSET -1 DEFAULT 0 VAR TwoBack FROM Temp OFFSET -2 DEFAULT 0 : Current - 2 * Prev + TwoBack',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nTemperature second derivative (acceleration):`);
console.log(`  TempAcceleration: [${tmpMultiRowResults.TempAcceleration.join(', ')}]`);

// --- Example 7: SERIESSTART - Skip Initial Rows ---
// Start the moving average from row 2 so all three periods have valid data
_ExpressionParser.solve(
	'MA3Valid = MULTIROWMAP ROWS FROM StockPrices SERIESSTART 2 VAR c0 FROM Close VAR c1 FROM Close OFFSET -1 DEFAULT 0 VAR c2 FROM Close OFFSET -2 DEFAULT 0 : (c0 + c1 + c2) / 3',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\n3-period MA starting from row 2 (all periods valid):`);
console.log(`  MA3Valid: [${tmpMultiRowResults.MA3Valid.join(', ')}]`);

// --- Example 8: SERIESSTEP -1 - Iterate Backwards ---
// Read stock prices in reverse chronological order
_ExpressionParser.solve(
	'ReversePrices = MULTIROWMAP ROWS FROM StockPrices SERIESSTART -1 SERIESSTEP -1 VAR Price FROM Close : Price + 0',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nStock prices in reverse order:`);
console.log(`  ReversePrices: [${tmpMultiRowResults.ReversePrices.join(', ')}]`);

// --- Example 9: SERIESSTEP 2 - Every Other Row ---
// Sample every other temperature reading
_ExpressionParser.solve(
	'EveryOtherTemp = MULTIROWMAP ROWS FROM TemperatureReadings SERIESSTEP 2 VAR t FROM Temp : t + 0',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nEvery other temperature reading:`);
console.log(`  EveryOtherTemp: [${tmpMultiRowResults.EveryOtherTemp.join(', ')}]`);

// --- Example 10: Three-Row Lookback with Multiple Properties ---
// Weighted volume change: compare current volume to 3 days ago, scaled by price ratio
_ExpressionParser.solve(
	'WeightedVolChange = MULTIROWMAP ROWS FROM StockPrices VAR CurVol FROM Volume VAR CurPrice FROM Close VAR OldVol FROM Volume OFFSET -3 DEFAULT 0 VAR OldPrice FROM Close OFFSET -3 DEFAULT 1 : (CurVol - OldVol) * (CurPrice / OldPrice)',
	_AppData, {}, false, tmpMultiRowResults);
console.log(`\nWeighted volume change (3-day lookback with price ratio):`);
console.log(`  WeightedVolChange: [${tmpMultiRowResults.WeightedVolChange.join(', ')}]`);

console.log('QED');

/* * * * * * * * * * * * * * * * *
 *
 * Third-Party Test Suite Runner
 *
 * Run with: node Math-Solver-Harness.js --test-suite <name>
 * Valid names: identities, spreadsheet, precision, acidtest, all
 *
 */
let SUITE_MAP =
	{
		'identities': 'TestSuite-Identities.json',
		'spreadsheet': 'TestSuite-Spreadsheet.json',
		'precision': 'TestSuite-Precision.json',
		'acidtest': 'TestSuite-AcidTest.json'
	};

let tmpRequestedSuites = [];
for (let i = 0; i < process.argv.length; i++)
{
	if (process.argv[i] === '--test-suite' && i + 1 < process.argv.length)
	{
		let tmpSuiteName = process.argv[i + 1].toLowerCase();
		if (tmpSuiteName === 'all')
		{
			tmpRequestedSuites = Object.keys(SUITE_MAP);
		}
		else if (tmpSuiteName in SUITE_MAP)
		{
			tmpRequestedSuites.push(tmpSuiteName);
		}
		else
		{
			console.log(`\x1b[31mUnknown test suite: ${tmpSuiteName}\x1b[0m`);
			console.log(`Valid suites: ${Object.keys(SUITE_MAP).join(', ')}, all`);
		}
		i++;
	}
}

if (tmpRequestedSuites.length > 0)
{
	let tmpTotalPass = 0;
	let tmpTotalFail = 0;
	let tmpSuiteSummaries = [];

	for (let s = 0; s < tmpRequestedSuites.length; s++)
	{
		let tmpSuiteKey = tmpRequestedSuites[s];
		let tmpSuiteData = require(`./${SUITE_MAP[tmpSuiteKey]}`);
		let tmpSuitePass = 0;
		let tmpSuiteFail = 0;
		let tmpCurrentCategory = '';

		console.log(`\n\x1b[1m=== ${tmpSuiteData.Name} ===\x1b[0m`);
		console.log(`${tmpSuiteData.Description}\n`);

		for (let i = 0; i < tmpSuiteData.Expressions.length; i++)
		{
			let tmpTest = tmpSuiteData.Expressions[i];
			if (tmpTest.Category && tmpTest.Category !== tmpCurrentCategory)
			{
				tmpCurrentCategory = tmpTest.Category;
				console.log(`  \x1b[4m${tmpCurrentCategory}\x1b[0m`);
			}

			let tmpData = tmpTest.Data || _AppData;
			let tmpResultObject = {};
			let tmpResultValue;
			try
			{
				tmpResultValue = _ExpressionParser.solve(tmpTest.Equation, tmpData, tmpResultObject, false);
			}
			catch (pError)
			{
				tmpResultValue = `ERROR: ${pError.message}`;
			}

			let tmpPassed = (String(tmpResultValue) === String(tmpTest.ExpectedResult));
			if (tmpPassed)
			{
				tmpSuitePass++;
				console.log(`    \x1b[32m PASS\x1b[0m ${tmpTest.Description}`);
			}
			else
			{
				tmpSuiteFail++;
				console.log(`    \x1b[31m FAIL\x1b[0m ${tmpTest.Description}`);
				console.log(`          Expected: ${tmpTest.ExpectedResult}`);
				console.log(`          Got:      ${tmpResultValue}`);
			}
		}

		tmpTotalPass += tmpSuitePass;
		tmpTotalFail += tmpSuiteFail;
		tmpSuiteSummaries.push({ Name: tmpSuiteData.Name, Pass: tmpSuitePass, Fail: tmpSuiteFail, Total: tmpSuitePass + tmpSuiteFail });
	}

	console.log(`\n\x1b[1m=== Test Suite Summary ===\x1b[0m`);
	for (let i = 0; i < tmpSuiteSummaries.length; i++)
	{
		let tmpSummary = tmpSuiteSummaries[i];
		let tmpColor = tmpSummary.Fail > 0 ? '\x1b[31m' : '\x1b[32m';
		console.log(`  ${tmpColor}${tmpSummary.Pass}/${tmpSummary.Total}\x1b[0m ${tmpSummary.Name}`);
	}
	let tmpOverallColor = tmpTotalFail > 0 ? '\x1b[31m' : '\x1b[32m';
	console.log(`\n  ${tmpOverallColor}Total: ${tmpTotalPass}/${tmpTotalPass + tmpTotalFail} passed\x1b[0m`);
}
