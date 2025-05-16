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

						let testFable = new libFable();
						testFable.AppData = {Pit: "Bottomless" };
						let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

						let tmpDataObject = {X: 5.867, Y: 3.1, Z: 75, Depth: 3, Width: 2};
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

						Expect(_Parser.solve('Result = sqrt(100 * (C + 30)) + sin(Depth - Width) / 10', { "PR": 1.5, "Z": "20.036237", "C": -13, Depth: 100.203, Width: 10.5})).to.equal('41.32965489638783839821');

						Expect(_Parser.solve('((15000 * 2) / 4)^2 + 100 - 10 * (35 + 5)')).to.equal("56249700");

						Expect(_Parser.solve('1.5 * sqrt(8 * 2.423782342^2) / 10')).to.equal('1.02832375808904701855')
						Expect(_Parser.solve('1 * sqrt(16)')).to.equal('4');

						Expect(_Parser.solve('sin(rad(60))')).to.equal('0.8660254037844386');

						Expect(_Parser.solve('Result = 5+3 - sqrt(75 / (3 + Depth) * Width)^ 3', { "PR": 1.5, "Z": "20.036237", "C": -13, Depth: 100.203, Width: 10.5}))
							.to.equal('-13.078386362213538715906797395732300153182132216343566001917247')

						let tmpResult = _Parser.solve('Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))', {C:-13,PR:1.5,Z:20.03})
						Expect(tmpResult).to.equal("-1110837.0769230769230769230307");

						let tmpResultPrecise = _Parser.solve('Result = (160 * PR * Z) / (C / 100) * PR * Z + (160 * (1 - C / 100))', {C:"-13",PR:"1.5",Z:"20.03"})
						Expect(tmpResultPrecise).to.equal("-1110837.0769230769230769230307");

						return fDone();
					}
				);
				test
				(
					'Exercise End-to-End Expression Parsing with Sets',
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						Expect(_Parser.solve('1 + 1')).to.equal("2");
						Expect(_Parser.solve("Volume = Width * Height * Depth", {"Width": 73.5, "Height": 28.8, "Depth": 200.5})).to.equal("424418.4");
						Expect(_Parser.solve("TotalCost = SUM(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("400");
						Expect(_Parser.solve("TotalCost = MEAN(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("80");
						Expect(_Parser.solve("TotalCost = MEDIAN(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("50");
						Expect(_Parser.solve("TotalCost = COUNT(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("5");

						return fDone();
					}
				);
				test
				(
					'Exercise Value Marshaling',
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						Expect(_Parser.solve('1 + 1')).to.equal("2");
						Expect(_Parser.solve("Volume = Width * Height * Depth", {"Width": 73.5, "Height": 28.8, "Depth": 200.5})).to.equal("424418.4");
						Expect(_Parser.solve("TotalCost = SUM(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("400");
						Expect(_Parser.solve("TotalCost = MEAN(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("80");
						Expect(_Parser.solve("TotalCost = MEDIAN(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("50");
						Expect(_Parser.solve("TotalCost = COUNT(ItemCosts)", {"ItemCosts": [100,200,50,45,5]})).to.equal("5");

						return fDone();
					}
				);
				test
				(
					'Exercise Rounding',
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						let tmpSolveResults = {};
						let tmpDataObject = {X: 5.867, Y: 3.1, Z: 75, Depth: 3, Width: 2};
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
					(fDone)=>
					{
						let _Parser = getExpressionParser();

						let tmpSolveResults = {};
						let tmpDataObject = {X: 5.867, Y: 3.5, Z: 75.248923423, Depth: 3, Width: 2};
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
					(fDone)=>
					{
						let testFable = new libFable();

						testFable.AppData = {Students: ["Kim","Jim", "Joan Jett", "Tank Girl"] };

						let _Parser = testFable.instantiateServiceProviderIfNotExists('ExpressionParser');

						let tmpResultObject = {};

						let tmpSolveResults = {};
						let tmpDataObject = {X: 5.867, Y: 3.5, Z: 75.248923423, Depth: 3, Width: 2, Name: "Jerry"};

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
					(fDone)=>
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
					'Complex Histogram Arithmatic',
					(fDone)=>
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
						let tmpResultsObject = {};
						let tmpDestinationObject = {};

						_Parser.solve('DistributionResult = distributionhistogram("AppData.Cities", "state")', testFable, tmpResultsObject, false, tmpDestinationObject);
						_Parser.solve('AggregationResult = aggregationHistogram("AppData.Cities", "state", "population")', testFable, tmpResultsObject, false, tmpDestinationObject);
						_Parser.solve('PopSum = sum(flatten(AppData.Cities[].population, AppData.Cities[].latitude))', testFable, tmpResultsObject, false, tmpDestinationObject);


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
			function()
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
						testFable.AppData.CityNames[2] = { };
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
			function()
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
					}
				);
			}
		);
	}
);
