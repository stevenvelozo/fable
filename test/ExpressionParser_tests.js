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
		function ()
		{
			suite
				(
					'Math Expressions',
					function ()
					{
						test
							(
								'Exercise the Tokenizer',
								(fDone) =>
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
									let complexTokenizedResultsDoubleWidthOperators = _Parser.tokenize('SpecialValue ?= 5+3 - sqrt(75 / (3 + {Depth}) * Width)^ 3');
									Expect(complexTokenizedResultsDoubleWidthOperators.length).to.equal(20);
									Expect(complexTokenizedResultsDoubleWidthOperators).to.deep.equal(['SpecialValue', '?=', '5', '+', '3', '-', 'sqrt', '(', '75', '/', '(', '3', '+', '{Depth}', ')', '*', 'Width', ')', '^', '3']);

									let tokenizedWithSymbologyInQuotes = _Parser.tokenize('5 + 2 * "Hello World"');
									Expect(tokenizedWithSymbologyInQuotes.length).to.equal(5);
									Expect(tokenizedWithSymbologyInQuotes).to.deep.equal(['5', '+', '2', '*', '"Hello World"']);
									// TODO: refresh on the tokenization process and see if this is a valid test
									//Expect(tmpResultObject.RawExpression).to.equal('5 + 2');
									let tokenizedNegativeParams = _Parser.tokenize('SUM(10, -10)');
									//Expect(tokenizedNegativeParams.length).to.equal(6);
									Expect(tokenizedNegativeParams).to.deep.equal(['SUM', '(', '10', ',', '-', '10', ')']);
									let unbalancedParens = _Parser.tokenize('ROUND(5 + (2 * 10), 10))');
									Expect(unbalancedParens).to.deep.equal(['ROUND', '(', '5', '+', '(', '2', '*', '10', ')', ',', '10', ')', ')']);
									return fDone();
								}
							);
						test
							(
								'Exercise the Linter',
								(fDone) =>
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

									let unbalancedParensTokenizedResults = _Parser.tokenize('Value = ROUND(5 + (2 * 10), 10))');
									let unbalancedParensLintedResults = _Parser.lintTokenizedExpression(unbalancedParensTokenizedResults, tmpResultObject);
									// The unbalanced parens should be caught
									Expect(unbalancedParensLintedResults.length).to.equal(1);
									Expect(unbalancedParensLintedResults[0]).to.contain('unbalanced parenthesis');
									return fDone();
								}
							);
						test
							(
								'Exercise Postfix Notation Conversion',
								(fDone) =>
								{
									let tmpResultObject = {};

									let _Parser = getExpressionParser();

									let tokenizedResults = _Parser.tokenize('= 5 + 2', tmpResultObject);
									let lintedResults = _Parser.lintTokenizedExpression(tokenizedResults, tmpResultObject);
									let postfixResults = _Parser.buildPostfixedSolveList(tokenizedResults, tmpResultObject);
									Expect(postfixResults.length).to.equal(2);

									let negativeConstantResults = _Parser.tokenize('Value = (-5 + 3)');
									let negativeConstantValueLintedResults = _Parser.lintTokenizedExpression(negativeConstantResults);
									let negativeConstantValueResults = _Parser.buildPostfixedSolveList(negativeConstantResults);
									Expect(negativeConstantValueResults.length).to.equal(3);

									let complexTokenizedResults = _Parser.tokenize('Value = 5+3 - sqrt(75 / (3 + -{Depth}) * Width)^ 3');
									let complexLintedResults = _Parser.lintTokenizedExpression(complexTokenizedResults);
									let complexPostfixResults = _Parser.buildPostfixedSolveList(complexTokenizedResults);
									Expect(complexPostfixResults.length).to.equal(9);

									return fDone();
								}
							);
						test
							(
								'Exercise Variable Lookup and Substitution',
								(fDone) =>
								{
									let _Parser = getExpressionParser();

									let tmpResultObject = {};
									let tmpDataObject = { X: 5, Y: 3, Z: 75, Depth: 3, Width: 2 };
									let tmpDestinationObject = {};

									let tmpArea = _Parser.solve('Area = X * Y  * Z', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

									Expect(tmpArea).to.equal("1125");
									Expect(tmpDestinationObject.Area).to.equal("1125");


									let tmpVariableAssignment = _Parser.solve('NewX = X', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									let tmpConstantAssignment = _Parser.solve('NewConst = 8.675309', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									let tmpStringAssignment = _Parser.solve('NewString = "Hello World!"', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

									Expect(tmpDestinationObject.NewX).to.equal("5");
									Expect(tmpDestinationObject.NewConst).to.equal("8.675309");
									Expect(tmpDestinationObject.NewString).to.equal("Hello World!");

									return fDone();
								}
							);
						test
							(
								'Capture array -> number bug',
								(fDone) =>
								{
									let _Parser = getExpressionParser();

									let tmpResultObject = {};
									let tmpDataObject = { W: ['3', '4', '5'], X: ['5'], Y: 3, Z: 75, Depth: 3, Width: 2 };
									let tmpDestinationObject = {};

									let tmpArea = _Parser.solve('Area = X * Y * Z', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

									Expect(tmpArea).to.equal("1125");

									let tmpSliced = _Parser.solve('SlicedSingleElementArray = SLICE(X, 0, 1)', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

									Expect(tmpSliced).to.be.an('array');
									Expect(tmpSliced.length).to.equal(1);
									Expect(tmpSliced[0]).to.equal('5');

									let tmpNonNumberTreatedAsZero = _Parser.solve('NonNumberTreatedAsZero = W + 3.456', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

									Expect(tmpNonNumberTreatedAsZero).to.equal('3.456');

									let tmpLargerSlice = _Parser.solve('SLICE(W, 1, 3)', tmpDataObject, tmpResultObject, false, tmpDestinationObject);

									Expect(tmpLargerSlice).to.be.an('array');
									Expect(tmpLargerSlice.length).to.equal(2);
									Expect(tmpLargerSlice[0]).to.equal('4');
									Expect(tmpLargerSlice[1]).to.equal('5');

									return fDone();
								}
							);
						test
							(
								'Exercise Marshaling to Value at a Hashed Address',
								(fDone) =>
								{

									let testFable = new libFable();
									testFable.AppData = { Pit: "Bottomless" };
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									let tmpDataObject = { X: 5.867, Y: 3.1, Z: 75, Depth: 3, Width: 2 };
									let tmpResultObject = {};
									let tmpDestinationObject = {};

									_Parser.solve('Area = X * Y  * Z', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Area).to.equal("1364.0775");

									_Parser.solve('PitSize = getvalue("AppData.Pit")', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.PitSize).to.equal("Bottomless");

									_Parser.solve('Value = -3', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Value).to.equal("-3");

									_Parser.solve('Value2 = (4 + -3)', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Value2).to.equal("1");

									_Parser.solve('ValueN = 5+3 - sqrt(75 / (3 + -1) * 2)^ 3', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(testFable.Math.ltPrecise(
										testFable.Math.absPrecise(
											testFable.Math.subtractPrecise(tmpDestinationObject.ValueN, "-641.5190528383289850727923780647")),
										'0.00000000000000001'))
										.to.equal(true, 'Expected complex expression to be with a small epsilon of the computed value');

									tmpDataObject.Temp = '24';
									tmpDataObject.HR = '20.5';
									_Parser.solve('2.71828182845905 ^ -0.282444', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									testFable.ExpressionParser.Messaging.logFunctionSolve(tmpResultObject);
									_Parser.solve('EGS=ROUND(ROUND(0.0172834*2.71828182845905^(-0.0117685*Temp),5)*SQRT(ROUND(16.294-0.163*HR,1)/60),4)',
										tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									_Parser.solve('EGSR=ROUND(ROUND(0.0172834*2.71828182845905^(((1-2)*0.0117685)*Temp),5)*SQRT(ROUND(16.294-0.163*HR,1)/60),4)',
										tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.EGS).to.equal(tmpDestinationObject.EGSR);
									testFable.ExpressionParser.Messaging.logFunctionSolve(tmpResultObject);
									Expect(tmpDestinationObject.EGS).to.equal("0.0061");
									_Parser.solve('MATH_DP=ROUND(1.2345, 5 - 2)',
										tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.MATH_DP).to.equal("1.235");

									tmpDataObject.EJBinderGb1 = '15.5';
									tmpDataObject.EKPctBinderPb2 = '2.55555';
									_Parser.solve('EGse1 = Round((100 - EJBinderGb1) / EKPctBinderPb2), 2)', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									//TODO: we can consider solving and ignoring this paren, but for now, the error is fatal
									Expect(tmpDestinationObject.EGse1).to.not.exist;
									testFable.ExpressionParser.Messaging.logFunctionSolve(tmpResultObject);

									_Parser.solve('EGse1 = Round((100 - EJBinderGb1) / EKPctBinderPb2, 2)', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.EGse1).to.equal('33.07');

									_Parser.solve('EGse1 = Round((100 - EJBinderGb1) / EKPctBinderPb2), 2)', tmpDataObject, tmpResultObject, false, tmpDestinationObject);
									// ensure that this does mutate the output on error
									Expect(tmpDestinationObject.EGse1).to.not.exist;

									return fDone();
								}
							);
						test
							(
								'Test iterative series',
								(fDone) =>
								{
									let testFable = new libFable();
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									let tmpResult = _Parser.solve('Result = ITERATIVESERIES(Values, "Value", "Resultant", 1, "add")',
										{
											Values: [
												{ Value: 10 },
												{ Value: 20 },
												{ Value: 5 }
											]
										});

									Expect(tmpResult[0].Resultant).to.equal("10");
									Expect(tmpResult[1].Resultant).to.equal("30");
									Expect(tmpResult[2].Resultant).to.equal("35");

									return fDone();
								}
							)
						test
							(
								'Exercise End-to-End Expression Parsing',
								(fDone) =>
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

									Expect(_Parser.solve('Result = datemilliseconddifference("2023-08-10T05:00:00.000Z", "2023-08-11T05:00:00.000Z")')).to.equal("86400000");
									Expect(_Parser.solve('Result = datemilliseconddifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("86400000");
									Expect(_Parser.solve('Result = datemilliseconddifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:11:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("85740000");
									Expect(_Parser.solve('Result = datemilliseconddifference(StartDate, EndDate, 1)', { StartDate: "2023-08-10T05:11:00.000Z" })).to.equal('NaN');
									Expect(_Parser.solve('Result = dateseconddifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("86400");
									Expect(_Parser.solve('Result = datehourdifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("24");
									Expect(_Parser.solve('Result = dateminutedifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("1440");
									Expect(_Parser.solve('Result = datehourdifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("24");
									Expect(_Parser.solve('Result = datedaydifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("1");
									Expect(_Parser.solve('Result = dateweekdifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2023-05-22T05:00:00.000Z" })).to.equal("-11");
									Expect(_Parser.solve('Result = datemonthdifference(StartDate, EndDate)', { StartDate: "2023-08-10T05:00:00.000Z", EndDate: "2021-01-11T05:00:00.000Z" })).to.equal("-30");
									Expect(_Parser.solve('Result = dateyeardifference(StartDate, EndDate)', { StartDate: "1986-08-10T05:00:00.000Z", EndDate: "2023-08-11T05:00:00.000Z" })).to.equal("37");

									Expect(_Parser.solve('5 + 2 * 10')).to.equal("25");
									Expect(_Parser.solve('3.5 + 5 + 10 * 10 / 5')).to.equal("28.5");

									Expect(_Parser.solve('3.5 + 5 + 10 * 10 / 5 - 1.5')).to.equal("27");

									Expect(_Parser.solve('(100 - 10)')).to.equal("90");

									Expect(_Parser.solve('100.55 - 1.55')).to.equal("99");

									Expect(_Parser.solve('5 + 2')).to.equal('7');

									Expect(_Parser.solve('50.22 + 2')).to.equal('52.22');

									Expect(_Parser.solve('5 ^ 2')).to.equal('25');

									Expect(_Parser.solve('Result = sqrt(100 * (C + 30)) + sin(Depth - Width) / 10', { "PR": 1.5, "Z": "20.036237", "C": -13, Depth: 100.203, Width: 10.5 })).to.equal('41.32965489638783839821');

									Expect(_Parser.solve('((15000 * 2) / 4)^2 + 100 - 10 * (35 + 5)')).to.equal("56249700");

									Expect(_Parser.solve('1.5 * sqrt(8 * 2.423782342^2) / 10')).to.equal('1.02832375808904701855')
									Expect(_Parser.solve('1 * sqrt(16)')).to.equal('4');

									Expect(_Parser.solve('sin(rad(60))')).to.equal('0.8660254037844386');

									Expect(_Parser.solve('Result = 5+3 - sqrt(75 / (3 + Depth) * Width)^ 3', { "PR": 1.5, "Z": "20.036237", "C": -13, Depth: 100.203, Width: 10.5 }))
										.to.equal('-13.078386362213538715906797395732300153182132216343566001917247')

									let tmpResult = _Parser.solve('Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))', { C: -13, PR: 1.5, Z: 20.03 })
									Expect(tmpResult).to.equal("-1110837.0769230769230769230307");

									let tmpResultPrecise = _Parser.solve('Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))', { C: "-13", PR: "1.5", Z: "20.03" })
									Expect(tmpResultPrecise).to.equal("-1110837.0769230769230769230307");

									return fDone();
								}
							);
						test
							(
								'Exercise End-to-End Expression Parsing with Sets',
								(fDone) =>
								{
									let _Parser = getExpressionParser();

									Expect(_Parser.solve('1 + 1')).to.equal("2");
									Expect(_Parser.solve("Volume = Width * Height * Depth", { "Width": 73.5, "Height": 28.8, "Depth": 200.5 })).to.equal("424418.4");
									Expect(_Parser.solve("TotalCost = SUM(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("400");
									Expect(_Parser.solve("TotalCost = MEAN(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("80");
									Expect(_Parser.solve("TotalCost = MEDIAN(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("50");
									Expect(_Parser.solve("TotalCost = COUNT(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("5");
									Expect(Number(_Parser.solve("StDev = STDEV(Values)", { "Values": [1,2,3,4,5,6,7,8,9,10,11] }))).to.be.closeTo(3.3166, 0.0001);
									Expect(Number(_Parser.solve("StDevP = STDEVP(Values)", { "Values": [1,2,3,4,5,6,7,8,9,10,11] }))).to.be.closeTo(3.1623, 0.0001);

									_Parser.fable.AppData = {
										Teams: [
											{ Team: 'Mariners', States: 'Washington', Score: 100 },
											{ Team: 'Yankees', States: 'New York', Score: 200 },
											{ Team: 'Mets', States: 'New York', Score: 50 },
											{ Team: 'Giants', States: 'California', Score: 45 },
											{ Team: 'Dodgers', States: 'California', Score: 5 },
											{ Team: 'Astros', States: 'Texas', Score: 75 }
										]
									};

									let tmpHistogramByReference = _Parser.solve(`aggregationhistogram("AppData.Teams", "States", "Score")`);
									Expect(tmpHistogramByReference['New York']).to.equal("250");

									let tmpHistogram = _Parser.solve(`aggregationhistogrambyobject(getvalue("AppData.Teams"), "States", "Score")`);
									Expect(tmpHistogram['New York']).to.equal("250");

									Expect(_Parser.solve("DateFromPartsExample = DATEFROMPARTS(2025, 4, 1)")).to.equal("2025-04-01T00:00:00.000Z");
									Expect(_Parser.solve("DateFromPartsExample = DATEADDDAYS(DATEFROMPARTS(2025, 4, 1, 13, 03, 51, 761),87)")).to.equal("2025-06-27T13:03:51.761Z");

									return fDone();
								}
							);
						test
							(
								'Exercise Value Marshaling',
								(fDone) =>
								{
									let _Parser = getExpressionParser();

									Expect(_Parser.solve('1 + 1')).to.equal("2");
									Expect(_Parser.solve("Volume = Width * Height * Depth", { "Width": 73.5, "Height": 28.8, "Depth": 200.5 })).to.equal("424418.4");
									Expect(_Parser.solve("TotalCost = SUM(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("400");
									Expect(_Parser.solve("TotalCost = MEAN(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("80");
									Expect(_Parser.solve("TotalCost = MEDIAN(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("50");
									Expect(_Parser.solve("TotalCost = COUNT(ItemCosts)", { "ItemCosts": [100, 200, 50, 45, 5] })).to.equal("5");
									Expect(_Parser.solve('NameList = STRINGGETSEGMENTS(Names, ",")}', { "Names": "Jane,John" })).to.deep.equal(["Jane", "John"]);
									Expect(_Parser.solve('NameList = STRINGGETSEGMENTS(Names, ",")}', { "Names": "Jane,John" })).to.deep.equal(["Jane", "John"]);

									return fDone();
								}
							);
						test
							(
								'Exercise Rounding',
								(fDone) =>
								{
									let _Parser = getExpressionParser();

									let tmpSolveResults = {};
									let tmpDataObject = { X: 5.867, Y: 3.1, Z: 75, Depth: 3, Width: 2 };
									// 1364.0775
									let tmpResult = _Parser.solve('Area = ROUND(X * Y  * Z)', tmpDataObject, tmpSolveResults);
									Expect(tmpResult).to.equal("1364");
									tmpResult = _Parser.solve('Area = ROUND(X * Y  * Z, 2)', tmpDataObject, tmpSolveResults);
									Expect(tmpResult).to.equal("1364.08");
									return fDone();
								}
							);
						test
							(
								'Exercise Multi-parameter Functions',
								(fDone) =>
								{
									let _Parser = getExpressionParser();

									let tmpSolveResults = {};
									let tmpDataObject = { X: 5.867, Y: 3.5, Z: 75.248923423, Depth: 3, Width: 2 };
									// 1364.0775
									let tmpResult = _Parser.solve('Area = ROUND(X * Y  * Z)', tmpDataObject, tmpSolveResults);
									Expect(tmpResult).to.equal("1545");
									tmpResult = _Parser.solve('Area = ROUND(X * Y  * Z, 3, 3)', tmpDataObject, tmpSolveResults);
									Expect(tmpResult).to.equal("1545.2");
									// Test the getvaluarray function]
									// TODO: Fix the return values for these expression return functions
									//tmpResult = _Parser.solve('NewSet = GETVALUEARRAY(X, Y, Z)', tmpDataObject, tmpSolveResults);
									//tmpResult = _Parser.solve('NewSetAverage = SUM(NewSet)', tmpDataObject, tmpSolveResults);
									//Expect(tmpResult).to.equal("84.115923423");
									return fDone();
								}
							);
						test
							(
								'Exercise Complex Assignments',
								(fDone) =>
								{
									let testFable = new libFable();

									testFable.AppData = { Students: ["Kim", "Jim", "Joan Jett", "Tank Girl"] };

									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									let tmpResultObject = {};

									let tmpSolveResults = {};
									let tmpDataObject = { X: 5.867, Y: 3.5, Z: 75.248923423, Depth: 3, Width: 2, Name: "Jerry" };

									_Parser.solve('Area = ROUND(X * Y  * Z, 3, 3)', tmpDataObject, tmpSolveResults, false, tmpResultObject);

									// Because the results object doesn't have a name in it, the null coalescence assignment operator should just work
									let tmpResult = _Parser.solve('Name ?= GETVALUE("AppData.Students[0]")', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResultObject.Name).to.equal("Kim");

									tmpResult = _Parser.solve('Area = ROUND(X * Y  * Z, 3, 3)', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResult).to.equal("1545.2");

									// Now that name is set, it shouldn't change.
									tmpResult = _Parser.solve('Name ?= GETVALUE("AppData.Students[1]")', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResultObject.Name).to.equal("Kim");

									// Regular assignment should change it.
									tmpResult = _Parser.solve('Name = GETVALUE("AppData.Students[1]")', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResultObject.Name).to.equal("Jim");

									// Regular assignment should change it.
									tmpResult = _Parser.solve('Name = GETVALUE("AppData.Students[3]")', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResultObject.Name).to.equal("Tank Girl");

									// Regular assignment should change it (with an array out of bounds problem...)
									tmpResult = _Parser.solve('Name = GETVALUE("AppData.Students[4]")', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResultObject.Name).to.equal(undefined);

									return fDone();
								}
							);
						test
							(
								'Exercise Data Generation',
								(fDone) =>
								{
									let testFable = new libFable();
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									let tmpDataObject = {};
									let tmpSolveResults = {};
									let tmpResultObject = {};

									let tmpResult;
									tmpResult = _Parser.solve('RandomIntValue = RANDOMINTEGER()', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResult).to.not.be.NaN;

									tmpResult = _Parser.solve('RandomIntValueBetween = RANDOMINTEGERBETWEEN(10, 13)', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(parseInt(tmpResult)).to.be.at.least(10);
									Expect(parseInt(tmpResult)).to.be.at.most(13);

									tmpResult = _Parser.solve('RandomFloatValue = randomFloat()', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(tmpResult).to.not.be.NaN;

									tmpResult = _Parser.solve('RandomFloatValueBetween = randomFloatBetween(10.5, 13.78)', tmpDataObject, tmpSolveResults, false, tmpResultObject);
									Expect(parseFloat(tmpResult)).to.be.at.least(10.5);
									Expect(parseFloat(tmpResult)).to.be.at.most(13.78);


									return fDone();
								}
							);
						test
							(
								'Test map operation',
								(fDone) =>
								{
									let testFable = new libFable();
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');


									let tmpManifest = testFable.newManyfest();
									let tmpDataSourceObject = {};
									tmpDataSourceObject.CitiesData = require('./data/cities.json');
									/* Records look like:
[
	{
		"city": "New York", 
		"growth_from_2000_to_2013": "4.8%", 
		"latitude": 40.7127837, 
		"longitude": -74.0059413, 
		"population": "8405837", 
		"rank": "1", 
		"state": "New York"
	}, 
	{
		"city": "Los Angeles", 
		"growth_from_2000_to_2013": "4.8%", 
		"latitude": 34.0522342, 
		"longitude": -118.2436849, 
		"population": "3884307", 
		"rank": "2", 
		"state": "California"
	}, 
									*/

									tmpDataSourceObject.MapTest = {};
									tmpDataSourceObject.MapTest.Values = [ 1, 2, 3, 4, 5 ];

									let tmpDataDestinationObject = {};
									let tmpParserResultsObject = {};

									let tmpResult = _Parser.solve('SimpleMapResult = MAP VAR x FROM MapTest.Values : x + 100', tmpDataSourceObject, tmpParserResultsObject, tmpManifest, tmpDataDestinationObject);

									// Should expect 101 -> 105
									Expect(tmpDataDestinationObject.SimpleMapResult.length).to.equal(5);
									Expect(tmpDataDestinationObject.SimpleMapResult[0]).to.equal("101");
									Expect(tmpDataDestinationObject.SimpleMapResult[1]).to.equal("102");
									Expect(tmpDataDestinationObject.SimpleMapResult[2]).to.equal("103");
									Expect(tmpDataDestinationObject.SimpleMapResult[3]).to.equal("104");
									Expect(tmpDataDestinationObject.SimpleMapResult[4]).to.equal("105");

									let tmpComplexMapResult = _Parser.solve('ComplexMapResult = MAP VAR cityRecord FROM CitiesData VAR x FROM MapTest.Values : cityRecord.population + (x * 1000000000000000)', tmpDataSourceObject, tmpParserResultsObject, tmpManifest, tmpDataDestinationObject);

									Expect(tmpDataDestinationObject.ComplexMapResult.length).to.equal(1000);
									Expect(tmpDataDestinationObject.ComplexMapResult[0]).to.equal("1000000008405837");
									Expect(tmpDataDestinationObject.ComplexMapResult[4]).to.equal("5000000001553165");
									// We ran out of values 1-5 so now it's just population
									Expect(tmpDataDestinationObject.ComplexMapResult[10]).to.equal("885400");
									Expect(tmpDataDestinationObject.ComplexMapResult[400]).to.equal("81050");

									return fDone();
								}
							);
						test
							(
								'Test integration prepartion..',
								(fDone) =>
								{
									let testFable = new libFable();
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									let tmpManifest = testFable.newManyfest();
									let tmpDataSourceObject = {};
									let tmpDataDestinationObject = {};
									let tmpParserResultsObject = {};

									/* FIXME: This test is broken since `n` doesn't result in a valid postfix expression for the series generation.
									let tmpPassthroughResult = _Parser.solve('IntegrationApproximationResult = SERIES FROM 13.2 TO 25 STEP 0.2 : n', tmpDataSourceObject, tmpParserResultsObject, tmpManifest, tmpDataDestinationObject);
									Expect(tmpDataDestinationObject.IntegrationApproximationResult[0]).to.equal("13.2");
									Expect(tmpDataDestinationObject.IntegrationApproximationResult[1]).to.equal("13.4");
									Expect(tmpDataDestinationObject.IntegrationApproximationResult[59]).to.equal("25");
									 */

									// Approximate an integration of the function 1000 + (n / 2) from 13.2 and 25 every 0.2 values
									let tmpResult = _Parser.solve('IntegrationApproximationResult = SERIES FROM 13.2 TO 25 STEP 0.2 :  1000 + (n / 2)', tmpDataSourceObject, tmpParserResultsObject, tmpManifest, tmpDataDestinationObject);
									Expect(tmpDataDestinationObject.IntegrationApproximationResult[0]).to.equal("1006.6");
									Expect(tmpDataDestinationObject.IntegrationApproximationResult[1]).to.equal("1006.7");
									Expect(tmpDataDestinationObject.IntegrationApproximationResult[59]).to.equal("1012.5");

									let tmpResultWithStep = _Parser.solve('IntegrationApproximationResultWithStep = SERIES FROM 13.2 TO 25 STEP 0.5 : (1000 * stepIndex) + n', tmpDataSourceObject, tmpParserResultsObject, tmpManifest, tmpDataDestinationObject);
									Expect(tmpDataDestinationObject.IntegrationApproximationResultWithStep[0]).to.equal("13.2");
									Expect(tmpDataDestinationObject.IntegrationApproximationResultWithStep[1]).to.equal("1013.7");
									Expect(tmpDataDestinationObject.IntegrationApproximationResultWithStep[23]).to.equal("23024.7");

									testFable.AppData =
									{
										StartValue: 5,
										EndValue: 10,
										StepValue: 0.5,
										BaseValue: 200,
									};
									let tmpResultWithVariables = _Parser.solve('XValues = SERIES FROM StartValue TO EndValue STEP StepValue : (BaseValue * stepIndex) + n',
										testFable.AppData, tmpParserResultsObject, tmpManifest, testFable.AppData);
									Expect(testFable.AppData.XValues.length).to.equal(11);
									Expect(testFable.AppData.XValues[0]).to.equal('5');
									Expect(testFable.AppData.XValues[5]).to.equal('1007.5');
									Expect(testFable.AppData.XValues[10]).to.equal('2010');

									return fDone();
								}
							);
						test
							(
								'Test monte carlo...',
								(fDone) =>
								{
									let testFable = new libFable();
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
									let tmpManifest = testFable.newManyfest();

									let tmpDataSourceObject = {};
									let tmpDataDestinationObject = {};
									let tmpParserResultsObject = {};

									// Approximate an integration of the function 1000 + (n / 2) from 13.2 and 25 every 0.2 values
									let tmpResult = _Parser.solve('MonteCarloResult = MONTECARLO SAMPLECOUNT 1000 VAR x PT x 50 PT x 100 : 10000000 + x', tmpDataSourceObject, tmpParserResultsObject, tmpManifest, tmpDataDestinationObject);

									// Generate 1000 samples between 50 and 100, added to 10 million
									Expect(tmpResult).to.exist;
									Expect(tmpResult.Samples.length).to.equal(1000);

									// Rosenbrock function test (experimenting with non-deterministic test cases)
									/* Interesting values:

| Purpose                                   | (x)               | (y)               | (z)               | Notes                                                                           |
| ----------------------------------------- | ----------------- | ----------------- | ----------------- | ------------------------------------------------------------------------------- |
| **Exploration (broad view)**              | ([-3, 3])         | ([-1, 5])         | ([-1, 5])         | Shows how the function grows large and steep outside the valley.                |
| **Focused optimization testing**          | ([0, 2])          | ([0, 2])          | ([0, 2])          | Focuses on region around the minimum — ideal for Monte Carlo convergence plots. |
| **High-resolution contour visualization** | ([-1.5, 1.5])     | ([0, 2])          | ([0, 2])          | Best for plotting slices and seeing the curvature of the valley.                |
| **Stress testing**                        | ([-2.048, 2.048]) | ([-2.048, 2.048]) | ([-2.048, 2.048]) | Tests the function's behavior over a wider range, useful for robustness checks. |
*/
									let tmpRosenbrockDataSourceObject = {};
									let tmpRosenbrockDataDestinationObject = {};
									let tmpRosenbrockParserResultsObject = {};
									let tmpRosenbrockResult = _Parser.solve('RosenbrockResult = MONTECARLO SAMPLECOUNT 5000 VAR x PT x -3 PT x 3 VAR y PT y -1 PT y 5 VAR z PT z -1 PT z 5 : (1 - x)^2 + 100 * (y - x^2)^2 + (z - y)^2', tmpRosenbrockDataSourceObject, tmpRosenbrockParserResultsObject, tmpManifest, tmpRosenbrockDataDestinationObject);

									Expect(tmpRosenbrockResult).to.exist;
									Expect(tmpRosenbrockResult.Samples.length).to.equal(5000);

									// Build a histogram of the results to see how many are near zero
									let tmpHistogram = [];
									for (let sampleIndex = 0; sampleIndex < tmpRosenbrockResult.Samples.length; sampleIndex++)
									{
										let tmpSample = tmpRosenbrockResult.Samples[sampleIndex];
										let tmpValue = testFable.Math.roundPrecise(tmpSample, 0);
										if (!tmpHistogram[tmpValue])
											tmpHistogram[tmpValue] = 0;
										tmpHistogram[tmpValue] = tmpHistogram[tmpValue] + 1;
										// Log the output sample for visual inspection
										testFable.log.info(`Rosenbrock Sample ${sampleIndex}: Value: ${tmpSample}, Rounded Value: ${tmpValue} --> Histogram Count: ${tmpHistogram[tmpValue]}`);
									}
									// Output the histogram for visual inspection
									//testFable.ExpressionParser.Messaging.logMessage("Rosenbrock Histogram:");
									let tmpHistogramKeys = Object.keys(tmpHistogram);
									tmpHistogramKeys.sort((a, b) => parseFloat(a) - parseFloat(b));
									for (let i = 0; i < tmpHistogramKeys.length; i++)
									{
										let key = tmpHistogramKeys[i];
										testFable.log.info(`Value: ${key}, Count: ${tmpHistogram[key]}`);
									}
									
									return fDone();
								}
							);
						test
							(
								'Complex Histogram Arithmatic',
								(fDone) =>
								{
									let testFable = new libFable();

									let testCityData = require('./data/cities.json');
									testFable.AppData = { Cities: testCityData };

									// let tmpDistribution = testFable.Math.histogramDistributionByExactValue(testFable.AppData.Cities, 'state');

									// Expect(tmpDistribution.Alabama).to.equal(12);
									// Expect(tmpDistribution.Colorado).to.equal(21);
									// Expect(tmpDistribution.Florida).to.equal(73);
									// Expect(tmpDistribution.Georgia).to.equal(18);

									// Now through the solver

									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									testFable.AppData.Value1 = "100"; // Comment
									testFable.AppData.Value2 = "-80.5"; // Comment
									testFable.AppData.Value3 = "10000"; // Comment
									testFable.AppData.Value4 = "-333.333"; // Comment
									testFable.AppData.Value5 = "0"; // Comment

									let tmpResultsObject = {};
									let tmpDestinationObject = {};

									_Parser.solve('DistributionResult = distributionhistogram("AppData.Cities", "state")', testFable, tmpResultsObject, false, tmpDestinationObject);
									_Parser.solve('AggregationResult = aggregationHistogram("AppData.Cities", "state", "population")', testFable, tmpResultsObject, false, tmpDestinationObject);
									_Parser.solve('PopSum = sum(flatten(AppData.Cities[].population, AppData.Cities[].latitude))', testFable, tmpResultsObject, false, tmpDestinationObject);

									//_Parser.solve('MadeUpValueArray = ROUND(AVG(createarrayfromabsolutevalues(100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100)),2)', testFable, tmpResultsObject, false, tmpDestinationObject);
									//Expect(tmpDestinationObject.MadeUpValueArray).to.equal('600');
									_Parser.solve('MadeUpValueArray = ROUND(AVG(createarrayfromabsolutevalues(AppData.Value1, AppData.Value2, AppData.Value3, AppData.Value4, AppData.Value5)),2)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.MadeUpValueArray).to.equal('1937.23');

									_Parser.solve('MadeUpValueArray = ROUND(AVG(cleanvaluearray(createarrayfromabsolutevalues(AppData.Value1, AppData.Value2, AppData.Value3, AppData.Value4, AppData.Value5), 1)),2)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.MadeUpValueArray).to.equal('2421.54');

									//						_Parser.solve('MadeUpValueArray = ROUND(AVG(createarrayfromabsolutevalues(100, -80.5, 10000, -333.333, 0)),2)', testFable, tmpResultsObject, false, tmpDestinationObject);
									//						Expect(tmpDestinationObject.MadeUpValueArray).to.equal('600');


									_Parser.solve('MadeUpValueArray = ROUND(AVG(createarrayfromabsolutevalues(100, 10, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100)),2)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.MadeUpValueArray).to.equal('550.83');

									// _Parser.solve('MadeUpValueArray = ROUND(AVG(createarrayfromabsolutevalues(-5, 5, 0, -10, 10, -25, 25, -50, 50)),2)', testFable, tmpResultsObject, false, tmpDestinationObject);
									// Expect(tmpDestinationObject.MadeUpValueArray).to.equal('25');


									Expect(tmpDestinationObject.DistributionResult.Alabama).to.equal(12);
									Expect(tmpDestinationObject.DistributionResult.Colorado).to.equal(21);

									Expect(tmpDestinationObject.AggregationResult.Alabama).to.equal('1279813');
									Expect(tmpDestinationObject.PopSum).to.equal(testCityData.reduce((sum, city) => testFable.Math.addPrecise(city.population, sum), '0'));

									return fDone();
								}
							);
						test
							(
								'plumbing histogram into aggregation',
								() =>
								{
									let testFable = new libFable();

									let testCityData = require('./data/cities.json');
									testFable.AppData = { Cities: testCityData };

									// Now through the solver

									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
									let tmpResultsObject = {};
									testFable.AppData.ResultsObject = tmpResultsObject;
									let tmpDestinationObject = {};
									testFable.AppData.DestinationObject = tmpDestinationObject;

									_Parser.solve('DistributionResult = distributionhistogram("AppData.Cities", "state")', testFable, tmpResultsObject, false, tmpDestinationObject);
									_Parser.solve('AggregationResult = aggregationHistogram("AppData.Cities", "state", "population")', testFable, tmpResultsObject, false, tmpDestinationObject);

									Expect(tmpDestinationObject.DistributionResult.Alabama).to.equal(12);
									Expect(tmpDestinationObject.DistributionResult.Colorado).to.equal(21);

									Expect(tmpDestinationObject.AggregationResult.Alabama).to.equal('1279813');

									_Parser.solve('SumByAddress = SUM(FLATTEN(AppData.DestinationObject.AggregationResult))', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.SumByAddress).to.equal(testCityData.reduce((sum, city) => testFable.Math.addPrecise(city.population, sum), '0'));

									_Parser.solve('Smallest = smallestinset(AppData.Cities[], "population")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Smallest.population).to.equal('36877');

									_Parser.solve('Largest = largestinset(AppData.Cities[], "population")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Largest.city).to.equal('New York');

									_Parser.solve('Tenth = entryinset(AppData.Cities[], "population", "-10")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Tenth.city).to.equal('San Jose');

									_Parser.solve('TenthNum = entryinset(AppData.Cities[], "population", -10)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.TenthNum.city).to.equal('San Jose');

									_Parser.solve('TenthNumHacked = entryinset(AppData.Cities[], "population", (10 * -1))', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.TenthNumHacked.city).to.equal('San Jose');
								}
							);
					}
				);
			suite
				(
					'Data Expressions',
					function ()
					{
						test
							(
								'Concatenates Strings',
								() =>
								{
									let testFable = new libFable();

									let testCityData = require('./data/cities.json');
									testFable.AppData =
									{
										Cities: testCityData.slice(0, 4),
										CityNames: testCityData.slice(0, 4).map((c) => c.city),
										Null: null,
									};
									testFable.AppData.CityNames[2] = {};
									testFable.AppData.Cities[2].city = { cat: '12345', dog: 'waffle' };

									// Now through the solver

									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
									let tmpResultsObject = {};
									let tmpDestinationObject = {};

									_Parser.solve('Names = concat(AppData.Cities[].city)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Names).to.equal('New YorkLos AngelesHouston');

									_Parser.solve('Names2 = concat(AppData.CityNames)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Names2).to.equal('New YorkLos AngelesHouston');

									_Parser.solve('RawNames = concatRaw(AppData.CityNames)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.RawNames).to.equal('New YorkLos Angeles[object Object]Houston');

									_Parser.solve('JoinedNames = join("&comma; ", AppData.CityNames)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.JoinedNames).to.equal('New York&comma; Los Angeles&comma; Houston');

									_Parser.solve('RawJoinedNames = joinRaw(" ", AppData.CityNames)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.RawJoinedNames).to.equal('New York Los Angeles [object Object] Houston');

									_Parser.solve('NamesArgs = concat("cat", "dog", "waffle")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.NamesArgs).to.equal('catdogwaffle');

									testFable.AppData.CityName = 'New York';
									_Parser.solve('RawNamesArgs = concatRaw(AppData.CityName, "arg name")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.RawNamesArgs).to.equal('New Yorkarg name');

									_Parser.solve('JoinedNamesArgs = join("&comma; ", AppData.CityNames[1], AppData.CityNames[2])', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.JoinedNamesArgs).to.equal('Los Angeles');

									_Parser.solve('RawJoinedNamesArgs = joinRaw(" ", AppData.Cities[].city, "My Extra City")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.RawJoinedNamesArgs).to.equal('New York Los Angeles [object Object] Houston My Extra City');
								}
							);
					}
				);
			suite
				(
					'Conditional Expressions',
					function ()
					{
						test
							(
								'Conditional When',
								() =>
								{
									let testFable = new libFable();

									let testCityData = require('./data/cities.json');
									testFable.AppData =
									{
										Cities: testCityData.slice(0, 4),
										Null: null,
									};

									// Now through the solver
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
									let tmpResultsObject = {};
									let tmpDestinationObject = {};

									_Parser.solve('Name = When(AppData.Cities[0].city, AppData.Cities[0].city)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Name).to.equal('New York');

									_Parser.solve('Overrun = When(AppData.Cities[10000000].city, AppData.Cities[10000000].city)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Overrun).to.equal('');

									testFable.AppData.ECDMonth = 'January';
									testFable.AppData.ECDYear = '2023';
									_Parser.solve('EstimatedCompletionDate = ResolveHtmlEntities(When(AppData.ECDMonth, Join("&comma; ", AppData.ECDMonth, AppData.ECDYear)))',
										testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.EstimatedCompletionDate).to.equal('January, 2023');
								}
							);

						test
							(
								'Conditional If',
								() =>
								{
									let testFable = new libFable();

									let testCityData = require('./data/cities.json');
									testFable.AppData =
									{
										Cities: testCityData.slice(0, 4),
										Null: null,
									};

									// Now through the solver
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
									let tmpResultsObject = {};
									let tmpDestinationObject = {};

									_Parser.solve('GTE = If(AppData.Cities[0].latitude, "<", "50", "west", "east")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.GTE).to.equal('west');

									_Parser.solve('Equals = If(AppData.Cities[0].city, "==", "New York", "yes", "no")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Equals).to.equal('yes');

									_Parser.solve('EpsilonEquals = If("1.0000000001", "==", "1", "yes", "no")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.EpsilonEquals).to.equal('yes');

									_Parser.solve('PreciseEquals = If("1.0000000001", "===", "1", "yes", "no")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.PreciseEquals).to.equal('no');

									_Parser.solve('Computed = If(AppData.Cities[0].latitude, "<", "50", AppData.Cities[0].latitude + 25, AppData.Cities[0].latitude - 25)', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.Computed).to.equal(testFable.Math.addPrecise(testFable.AppData.Cities[0].latitude, 25));
								}
							);

						test('Solver Quoted Empty Strings', () =>
						{
							const tmpSourceData =
							{
							};
							let testFable = new libFable();
							let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

							let tmpSolverResults = {};

							_Parser.solve('Taco = 3', tmpSourceData, {}, false, tmpSourceData);
							Expect(tmpSourceData.Taco).to.equal('3');

							_Parser.solve('Taco = ""', tmpSourceData, tmpSolverResults, false, tmpSourceData);
							Expect(tmpSourceData.Taco).to.equal('');

							Expect(_Parser.solve('Taco = " "', tmpSourceData, tmpSolverResults, false, tmpSourceData)).to.equal(' ');
							Expect(_Parser.solve('Taco = "Whooo"', tmpSourceData, tmpSolverResults, false, tmpSourceData)).to.equal('Whooo');
						});
						test('Solver Performance', () =>
						{
							const tmpSourceData =
							{
								MethodAB_WWD_Dry_MinMoistureContent: -150,
								MethodAB_WWD_Dry_MaxMoistureContent: -18.3,
							};
							const tmpExpr = 'MethodAB_WWD_Dry_PlotXValues = SERIES FROM MethodAB_WWD_Dry_MinMoistureContent TO MethodAB_WWD_Dry_MaxMoistureContent STEP 0.1 : n + 0';
							let testFable = new libFable();
							let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

							const t0 = performance.now();
							// Execute the expression multiple times to get a measurable time
							_Parser.solve(tmpExpr, tmpSourceData, {}, false, tmpSourceData);
							const t1 = performance.now();
							const duration = t1 - t0;
							testFable.log.info(`Solver Performance Test: Executed in ${duration} milliseconds.`);
							Expect(tmpSourceData.MethodAB_WWD_Dry_PlotXValues.length).to.equal(1318);
							Expect(tmpSourceData.MethodAB_WWD_Dry_PlotXValues[0]).to.equal('-150');
							Expect(tmpSourceData.MethodAB_WWD_Dry_PlotXValues[1317]).to.equal('-18.3');
							Expect(duration).to.be.below(100);
						});
						test
							(
								'Custom Solver Functions',
								(fNext) =>
								{
									let testFable = new libFable();

									testFable.MonkeyFunction = (pParameter) => { return `Monkey says hello to ${pParameter}`; };

									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');
									let tmpResultsObject = {};
									let tmpDestinationObject = {};

									_Parser.addSolverFunction('monkeypatchedfunction', 'fable.MonkeyFunction', 'This is just for documentation.');
									
									_Parser.solve('MonkeyResult = monkeypatchedfunction("Jerry")', testFable, tmpResultsObject, false, tmpDestinationObject);
									Expect(tmpDestinationObject.MonkeyResult).to.equal('Monkey says hello to Jerry');
									return fNext();
								}
							);

						test
							(
								'Series + Regression',
								() =>
								{
									let testFable = new libFable();

									let testCityData = require('./data/cities.json');
									testFable.AppData =
									{
										Cities: testCityData.slice(0, 4),
										Null: null,
									};

									// Now through the solver
									let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

									_Parser.solve('Coefficients = LINEST(FLATTEN(AppData.Cities[].latitude), FLATTEN(AppData.Cities[].population))', testFable, testFable.AppData, false, testFable.AppData);
									testFable.log.info('Regression Coefficients:', testFable.AppData.Coefficients);
									_Parser.solve('SeriesFromCoefficients = SERIES FROM 100 TO 1000 STEP 100 : AppData.Coefficients[0] + n * AppData.Coefficients[1]', testFable, testFable.AppData, false, testFable.AppData);
									testFable.log.info('Series From Coefficients Result:', testFable.AppData.SeriesFromCoefficients);
									_Parser.solve('IntegratedSeries = SUM(FLATTEN(AppData.SeriesFromCoefficients))', testFable, testFable.AppData, false, testFable.AppData);
									testFable.log.info('Integrated Series Result:', testFable.AppData.IntegratedSeries);

									const tmpRawData =
									{
										"StandardSelector": "English",
										"MaxDryDensityTable": [
											{
												"MaxDryDensityTable": {
													"f": "4.19",
													"g": "125.7",
													"j": "0.19",
													"l": "109.1",
													"NTest": "",
													"a": "",
													"b": "",
													"d": "13.51",
													"e": "9.32",
													"h": "1.44",
													"i": "1.25",
													"k": "15.2"
												},
												"MaxDryDensityTablec": "10.00"
											},
											{
												"MaxDryDensityTable": {
													"f": "4.01",
													"g": "120.3",
													"j": "0.16",
													"l": "106.5",
													"NTest": "",
													"a": "",
													"b": "",
													"d": "13.34",
													"e": "9.33",
													"h": "1.39",
													"i": "1.23",
													"k": "13"
												},
												"MaxDryDensityTablec": "11.00"
											},
											{
												"MaxDryDensityTable": {
													"f": "4.19",
													"g": "125.7",
													"j": "0.22",
													"l": "106",
													"NTest": "",
													"a": "",
													"b": "",
													"d": "13.51",
													"e": "9.32",
													"h": "1.40",
													"i": "1.18",
													"k": "18.6"
												},
												"MaxDryDensityTablec": "12.00"
											}
										],
										"NuclearTable": [
											{
												"NuclearTable": {},
												"NDD": "0",
												"ADD": "0",
												"NuclearPercentPR": "0"
											}
										],
										"Pulverization": [
											{
												"PTestNo": "1"
											}
										],
										"FMC": [
											{
												"MassOfWater": "0"
											}
										],
										"MetaTemplate": {},
										"Header": {},
										"SM": {
											"SF": "0",
											"SI": "0",
											"SJ": "0"
										},
										"NM": {},
										"Chart": {
											"Slope": "1.18181818181818181818",
											"Intercept": "91.136363636363636363664",
											"MCZeroAtDD": "21.830887491264849755",
											"ShiftToParallel": "3.230887491264849755",
											"WetSideY2": "0.84615384615384615385",
											"WetSideY1": "-36.84746008708272859272",
											"DomainBegin": "13",
											"DomainEnd": "18.6",
											"WetSideY0": "-6240",
											"OptimalMoistureContent": "16.27122843513086489567",
											"DryCount": 16,
											"WetCount": "16",
											"TotalCount": "32",
											"StartPlot": "12",
											"XValues": [
												"13.2",
												"13.4",
												"13.6",
												"13.8",
												"14",
												"14.2",
												"14.4",
												"14.6",
												"14.8",
												"15",
												"15.2",
												"15.4",
												"15.6",
												"15.8",
												"16",
												"16.2",
												"16.4",
												"16.6",
												"16.8",
												"17",
												"17.2",
												"17.4",
												"17.6",
												"17.8",
												"18",
												"18.2",
												"18.4",
												"18.6",
												"18.8",
												"19",
												"19.2",
												"19.4",
											],
											"PrimaryRoot": "110.3659972415182948767",
											"WetCountIntermediate": "43",
											"ValueLimit": "28"
										},
										"Result": "",
										"FamilyOfCurvesZone": "0.99",
										"MaxDryDensityEnglish": "0",
										"MaxDryDensityMetric": "0",
										"DryX": "15.2",
										"DryY": "109.1",
										"AsIsX": "13",
										"AsIsY": "106.5",
										"WetX": "18.6",
										"WetY": "106",
										"AverageMaxDryDensity": "11",
										"OptimumMoistureOfTotalMaterial": "0.1",
										"om": "0.0",
										"pr": "0.0"
									};

									const tmpBaseMoistures = tmpRawData.Chart.XValues;
									//TODO: compute this form above; 3 stages; dry, wet, combined
									const tmpCombinedDensities = [ '106.7363636','106.9727273','107.2090909','107.4454545','107.6818182','107.9181818',
										'108.1545455','108.3909091','108.6272727','108.8636364','109.1','109.3363636','109.5727273','109.8090909','110.0454545',
										'110.2818182','110.1152028','109.7279363','109.3433842','108.9615182','108.5823101','108.2057322','107.8317574',
										'107.4603587','107.0915096','106.7251839','106.3613559','106','105.6410912','105.2846046','104.9305159','104.5788009'
									];
									const tmpMatrix = [];
									for (let i = 1; i <= 10; ++i)
									{
										const tmpPowArray = [];
										for (let j = 0; j < tmpBaseMoistures.length; ++j)
										{
											tmpPowArray.push(testFable.Math.powerPrecise(tmpBaseMoistures[j], i));
										}
										tmpMatrix.push(tmpPowArray);
									}
									testFable.AppData.FitToDensities = tmpCombinedDensities;
									testFable.AppData.MoistureMatrix = tmpMatrix;
									testFable.log.info('Fit To Densities:', testFable.AppData.FitToDensities);
									testFable.log.info('Moisture Matrix:', testFable.AppData.MoistureMatrix);
									_Parser.solve('LinearRegressionHand = LINEST(AppData.MoistureMatrix, AppData.FitToDensities)', testFable, testFable.AppData, false, testFable.AppData);
									testFable.log.info('Density Regression Coefficients:', testFable.AppData.LinearRegressionHand);

									const tmpSolverInstructions =
									[
										'ChartDomainBegin = MaxDryDensityTable[0].MaxDryDensityTable.k - 2',
										'ChartDomainEnd = ChartDomainBegin + (Chart.TotalCount - 1) * 0.2',
										'XValues = SERIES FROM ChartDomainBegin TO ChartDomainEnd STEP 0.2 : n + 0',
										'DryCount = MATCH(Chart.OptimalMoistureContent, XValues)',
										'WetCountIntermediate = 60 - DryCount',
										'WetCount = IF(DryCount, "<=", 30, DryCount, WetCountIntermediate)',
										'TotalCount = DryCount + WetCount',
										'StartPlot = DryCount - 5',
										'ChartValueLimit = Chart.XValues.length - 1',
										'DryValues = MAP VAR x FROM Chart.XValues : x * Chart.Slope + Chart.Intercept',
										'WetValues = MAP VAR x FROM Chart.XValues : 6240 / (x + 100 / 2.7 + Chart.ShiftToParallel)',
										'CombinedValues = MAP VAR dry FROM DryValues VAR wet FROM WetValues VAR x from XValues : IF(x, "LTE", Chart.OptimalMoistureContent, dry, wet)',
										'FilteredXValues = MAP VAR x FROM XValues : IF(ABS(Chart.OptimalMoistureContent - x), "LT", 1, x, 0)',
										'XValueMatrix = createarrayfromabsolutevalues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)', // Create Placeholders
										'XValueMatrix[0] = MAP VAR x FROM XValues : x + 0',
										'XValueMatrix[1] = MAP VAR x FROM XValues : x^2',
										'XValueMatrix[2] = MAP VAR x FROM XValues : x^3',
										'XValueMatrix[3] = MAP VAR x FROM XValues : x^4',
										'XValueMatrix[4] = MAP VAR x FROM XValues : x^5',
										'XValueMatrix[5] = MAP VAR x FROM XValues : x^6',
										'XValueMatrix[6] = MAP VAR x FROM XValues : x^7',
										'XValueMatrix[7] = MAP VAR x FROM XValues : x^8',
										'XValueMatrix[8] = MAP VAR x FROM XValues : x^9',
										'XValueMatrix[9] = MAP VAR x FROM XValues : x^10',
										'LinearRegression = LINEST(XValueMatrix, CombinedValues)',
										'FilteredXValueVectors = MatrixTranspose(XValueMatrix)',
										'FittedDensities = MAP VAR x FROM XValues VAR vector FROM FilteredXValueVectors : PREDICT(LinearRegression, vector)',
										'FilteredDensities = MAP VAR x FROM FilteredXValues VAR prediction FROM FittedDensities : IF(x, "==", 0, 0, prediction)',
									];
									const tmpResultsObject = {};
									for (const tmpInstruction of tmpSolverInstructions)
									{
										_Parser.solve(tmpInstruction, tmpRawData, tmpResultsObject, false, tmpRawData);
										testFable.log.info(`After instruction: ${tmpInstruction}`, tmpRawData[tmpInstruction.split('=')[0].trim()]);
									}

									Expect(tmpRawData.FilteredDensities[10]).to.equal('0');
									Expect(Number(tmpRawData.FilteredDensities[11])).to.be.closeTo(109.3, 0.1);
									Expect(Number(tmpRawData.FilteredDensities[20])).to.be.closeTo(108.6, 0.1);
									Expect(tmpRawData.FilteredDensities[21]).to.equal('0');

									/*
									testFable.log.info('linest payload (hand):', { MoistureMatrix: testFable.AppData.MoistureMatrix, FitToDensities: testFable.AppData.FitToDensities });
									testFable.log.info('linest payload (solver):', { XValueMatrix: tmpRawData.XValueMatrix, CombinedValues: tmpRawData.CombinedValues });

									testFable.log.info('coefficients (hand):', testFable.AppData.LinearRegressionHand);
									testFable.log.info('coefficients (solver):', tmpRawData.LinearRegression);

									testFable.log.info('filtered densities (solver):', tmpRawData.FilteredDensities);
									*/
								}
							);
					}
				);
		}
	);
