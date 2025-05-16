const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');
const libSetConcatArray = require('../Fable-SetConcatArray.js');

class ExpressionParserSolver extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'ExpressionParser-Solver';
	}

	solvePostfixedExpression(pPostfixedExpression, pDataDestinationObject, pResultObject, pManifest)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		let tmpManifest = (typeof(pManifest) === 'object') ? pManifest : this.fable.newManyfest();

		let tmpDataDestinationObject = (typeof(pDataDestinationObject) === 'object') ? pDataDestinationObject : {};

		// If there was a fable passed in (e.g. the results object was a service or such), we won't decorate
		let tmpPassedInFable = ('fable' in tmpResults);
		if (!tmpPassedInFable)
		{
			tmpResults.fable = this.fable;
		}

		if (!Array.isArray(pPostfixedExpression))
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.solvePostfixedExpression was passed a non-array postfixed expression.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return false;
		}
		if (pPostfixedExpression.length < 1)
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.solvePostfixedExpression was passed an empty postfixed expression.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return false;
		}

		// This is how the user communication magic happens.
		tmpResults.VirtualSymbols = {};

		for (let i = 0; i < pPostfixedExpression.length; i++)
		{
			// X = SUM(15, SUM(SIN(25), 10), (5 + 2), 3)
			if (pPostfixedExpression[i].Operation.Type === 'Token.SolverInstruction')
			{
				continue;
			}
			let tmpStepResultObject = { ExpressionStep: pPostfixedExpression[i], ExpressionStepIndex: i, ResultsObject: tmpResults, Manifest: tmpManifest};

			if (tmpStepResultObject.ExpressionStep.LeftValue.Type === 'Token.LastResult')
			{
				tmpStepResultObject.ExpressionStep.LeftValue.Value = tmpResults.LastResult;
			}
			if (tmpStepResultObject.ExpressionStep.RightValue.Type === 'Token.LastResult')
			{
				tmpStepResultObject.ExpressionStep.RightValue.Value = tmpResults.LastResult;
			}

			if (tmpStepResultObject.ExpressionStep.LeftValue.Type === 'Token.VirtualSymbol')
			{
				tmpStepResultObject.ExpressionStep.LeftValue.Value = tmpManifest.getValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.LeftValue.Token);
			}
			if (tmpStepResultObject.ExpressionStep.RightValue.Type === 'Token.VirtualSymbol')
			{
				tmpStepResultObject.ExpressionStep.RightValue.Value = tmpManifest.getValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.RightValue.Token);
			}

			// Resolve the parenthesis to their actual values
			if (tmpStepResultObject.ExpressionStep.LeftValue.Type === 'Token.Parenthesis')
			{
				tmpStepResultObject.ExpressionStep.LeftValue.Value = tmpManifest.getValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.LeftValue.VirtualSymbolName);
			}
			if (tmpStepResultObject.ExpressionStep.RightValue.Type === 'Token.Parenthesis')
			{
				tmpStepResultObject.ExpressionStep.RightValue.Value = tmpManifest.getValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.RightValue.VirtualSymbolName);
			}

			// Virtual Constants
			if (tmpStepResultObject.ExpressionStep.LeftValue.Type === 'Token.Constant' && !('Value' in tmpStepResultObject.ExpressionStep.LeftValue))
			{
				tmpStepResultObject.ExpressionStep.LeftValue.Value = tmpStepResultObject.ExpressionStep.LeftValue.Token;
			}
			if (tmpStepResultObject.ExpressionStep.RightValue.Type === 'Token.Constant' && !('Value' in tmpStepResultObject.ExpressionStep.RightValue))
			{
				tmpStepResultObject.ExpressionStep.RightValue.Value = tmpStepResultObject.ExpressionStep.RightValue.Token;
			}

			if (tmpStepResultObject.ExpressionStep.Operation.Type = 'Operator')
			{
				// TODO: This can be optimized.   A lot.  If necessary.  Seems pretty fast honestly for even thousands of operations.  Slowest part is arbitrary precision.
				// An operator always has a left and right value.
				let tmpFunctionAddress;
				// Note: There are easier, passive ways of managing this state.  But this is complex.
				let tmpIsFunction = false;
				if (tmpStepResultObject.ExpressionStep.Operation.Token in this.ExpressionParser.tokenMap)
				{
					tmpFunctionAddress = `ResultsObject.${tmpStepResultObject.ExpressionStep.Operation.Descriptor.Function}`;
				}
				else if (tmpStepResultObject.ExpressionStep.Operation.Token.toLowerCase() in this.ExpressionParser.functionMap)
				{
					tmpIsFunction = true;
					tmpFunctionAddress = `ResultsObject.${this.ExpressionParser.functionMap[tmpStepResultObject.ExpressionStep.Operation.Token.toLowerCase()].Address}`;
				}

				if (tmpIsFunction)
				{
					try
					{
						let tmpResult;
						const tmpFunction = tmpManifest.getValueAtAddress(tmpStepResultObject, tmpFunctionAddress);
						if (typeof tmpFunction === 'function')
						{
							let tmpFunctionBinding = null;
							if (tmpFunctionAddress.includes('.'))
							{
								tmpFunctionBinding = tmpManifest.getValueAtAddress(tmpStepResultObject, tmpFunctionAddress.split('.').slice(0, -1).join('.'));
							}
							let tmpArguments = tmpStepResultObject.ExpressionStep.LeftValue.Value;
							if (!(tmpArguments instanceof libSetConcatArray))
							{
								tmpArguments = [ tmpArguments ];
							}
							else
							{
								tmpArguments = tmpArguments.values;
							}
							tmpResult = tmpFunction.apply(tmpFunctionBinding, tmpArguments);
						}
						tmpManifest.setValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.VirtualSymbolName, tmpResult);
						tmpResults.LastResult = tmpManifest.getValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.VirtualSymbolName);
						//this.log.trace(`   ---> Step ${i}: ${tmpResults.VirtualSymbols[tmpStepResultObject.ExpressionStep.VirtualSymbolName]}`)
					}
					catch (pError)
					{
						tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.solvePostfixedExpression failed to solve step ${i} with function ${tmpStepResultObject.ExpressionStep.Operation.Token}: ${pError}`);
						this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						return false;
					}
				}
				else
				{
					try
					{
						//this.log.trace(`Solving Step ${i} [${tmpStepResultObject.ExpressionStep.VirtualSymbolName}] --> [${tmpStepResultObject.ExpressionStep.Operation.Token}]: ( ${tmpStepResultObject.ExpressionStep.LeftValue.Value} , ${tmpStepResultObject.ExpressionStep.RightValue.Value} )`);
						tmpManifest.setValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.VirtualSymbolName, tmpManifest.getValueAtAddress(tmpStepResultObject, `${tmpFunctionAddress}(ExpressionStep.LeftValue.Value,ExpressionStep.RightValue.Value)`));
						tmpResults.LastResult = tmpManifest.getValueAtAddress(tmpResults.VirtualSymbols, tmpStepResultObject.ExpressionStep.VirtualSymbolName);
						//this.log.trace(`   ---> Step ${i}: ${tmpResults.VirtualSymbols[tmpStepResultObject.ExpressionStep.VirtualSymbolName]}`)
					}
					catch (pError)
					{
						tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.solvePostfixedExpression failed to solve step ${i} with function ${tmpStepResultObject.ExpressionStep.Operation.Token}: ${pError}`);
						this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						return false;
					}
				}

				// Equations don't always solve in virtual symbol order.
				tmpResults.SolverFinalVirtualSymbol = tmpStepResultObject.ExpressionStep.VirtualSymbolName;
			}
		}

		let tmpSolverResultValue = tmpManifest.getValueAtAddress(tmpResults, `VirtualSymbols.${tmpResults.SolverFinalVirtualSymbol}`);

		// Now deal with final assignment(s)
		for (let i = 0; i < pPostfixedExpression.length; i++)
		{
			if (pPostfixedExpression[i].RightValue.Type === 'Token.SolverMarshal')
			{
				// Set the result in the virtual symbols
				tmpManifest.setValueAtAddress(tmpResults.VirtualSymbols, pPostfixedExpression[i].VirtualSymbolName, tmpSolverResultValue);
				// Set the value in the destination object
				if (pPostfixedExpression[i].Operation.Descriptor.OnlyEmpty)
				{
					// If it is only on "empty" values, check if the value is empty before assigning
					if (this.fable.Utility.addressIsNullOrEmpty(tmpDataDestinationObject, pPostfixedExpression[i].VirtualSymbolName))
					{
						tmpManifest.setValueByHash(tmpDataDestinationObject, pPostfixedExpression[i].VirtualSymbolName, tmpSolverResultValue);
					}
				}
				else
				{
					// Otherwise, just assign it.
					tmpManifest.setValueByHash(tmpDataDestinationObject, pPostfixedExpression[i].VirtualSymbolName, tmpSolverResultValue);
				}
			}
		}
		tmpResults.RawResult = tmpSolverResultValue;

		// Clean up the fable reference if we added it to the object.
		if (!tmpPassedInFable)
		{
			delete tmpResults.fable;
		}

		if (typeof(tmpSolverResultValue) === 'object')
		{
			return tmpSolverResultValue;
		}
		else if (typeof(tmpSolverResultValue) !== 'undefined')
		{
			return tmpSolverResultValue.toString();
		}
		else
		{
			return tmpSolverResultValue;
		}
	}
}

module.exports = ExpressionParserSolver;
