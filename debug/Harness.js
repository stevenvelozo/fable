// const libFable = require('../source/Fable.js');

// const _Fable = new libFable({"Product": "Harness"});

// let tmpValue;

// tmpValue = _Fable.Dates.dateDayDifference("2023-10-01", "2023-09-01");
// console.log(`Difference in days: ${tmpValue}`);


// tmpValue = _Fable.Dates.dateWeekDifference("2023-10-01", "2023-09-01");
// console.log(`Difference in weeks: ${tmpValue}`);


// tmpValue = _Fable.Dates.dateMonthDifference("2016-10-01", "2023-09-01");
// console.log(`Difference in months: ${tmpValue}`);

// tmpValue = _Fable.Dates.dateYearDifference("1963-10-01", "2023-09-01");
// console.log(`Difference in years: ${tmpValue}`);

// const _ExpressionParser = _Fable.instantiateServiceProviderIfNotExists('ExpressionParser');

// const _Expression = "TotalCost = SUM(ItemCosts)";
// const _Values = (
// 	{
// 		"ItemCosts": [100,200,50,45,5]
// 	});
// const _Manyfest = _Fable.newManyfest(
// 	{
// 		"Scope":"None", 
// 		"Descriptors":
// 			{
// 				"Bill.Items[].Cost":
// 				{
// 					"Name":"Costs of the Bill Items",
// 					"Hash":"BillItemCosts"
// 				}
// 			}
// 	});

// const _SolveResultsObject = {};
// const _DataDestinationObject = {};

// let tmpResult = _ExpressionParser.solve(_Expression, _Values, _SolveResultsObject, _Manyfest, _DataDestinationObject);
// for (let i = 0; i < _SolveResultsObject.PostfixSolveList.length; i++)
// {
// 	let tmpToken = _SolveResultsObject.PostfixSolveList[i];
// 	console.log(`${i}: ${tmpToken.VirtualSymbolName} = (${tmpToken.LeftValue.Token}::${tmpToken.LeftValue.Value})  ${tmpToken.Operation.Token}  (${tmpToken.RightValue.Token}::${tmpToken.RightValue.Value}) `)
// }
// console.log(`Result: ${tmpResult}`);

const libMathHarness = require('../example_applications/mathematical_playground/Math-Solver-Harness.js');
