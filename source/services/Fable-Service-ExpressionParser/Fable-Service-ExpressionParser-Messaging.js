const { PE } = require('big.js');
const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');

/**
 * Represents a user-friendly messaging service for the ExpressionParser compiler output.
 * @class ExpressionParserMessaging
 * @extends libExpressionParserOperationBase
 */
class ExpressionParserMessaging extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'ExpressionParser-Messaging';
	}

	getOperationVirtualSymbolName(pOperationToken)
	{
		return (pOperationToken && ('VirtualSymbolName' in pOperationToken)) ? pOperationToken.VirtualSymbolName 
			: (pOperationToken.Type === 'Token.VirtualSymbol') ? pOperationToken.Token
			: 'NO_VIRTUAL_SYMBOL_NAME_FOUND';
	}

	getVirtualTokenValue(pToken, pOperationResults)
	{
		let tmpVirtualSymbol = this.getOperationVirtualSymbolName(pToken);

		if ((pToken.Type == 'Token.Symbol' || pToken.Type == 'Token.Constant') && (pToken.Value))
		{
			return pToken.Value.toString();
		}

		let tmpVirtualSymbolData = ('VirtualSymbols' in pOperationResults) ? pOperationResults.VirtualSymbols : {};

		if (this.ExpressionParser.GenericManifest.checkAddressExists(tmpVirtualSymbolData, tmpVirtualSymbol))
		{
			let tmpValue = this.ExpressionParser.GenericManifest.getValueAtAddress(tmpVirtualSymbolData, tmpVirtualSymbol);

			if (typeof(tmpValue) === 'object')
			{
				return `{${Object.keys(tmpValue).length} values}`;
			}
			if (Array.isArray(tmpValue))
			{
				return `[${Object.keys(tmpValue).length} values]`;
			}
			return tmpValue;
		}

		return 'NO_VALUE_FOUND';
	}

	getTokenAddressString(pToken)
	{
		return pExpression.Token;
	}

	getTokenSymbolString(pExpressionToken)
	{
		return pExpressionToken.Token;
	}

	getOperationSymbolMessage(pOperation)
	{
		if (!pOperation)
		{
			return 'INVALID_OPERATION';
		}
		let tmpOperationVirtualSymbol = this.getOperationVirtualSymbolName(pOperation);
		let tmpOperationLeftValue = this.getTokenSymbolString(pOperation.LeftValue);
		let tmpOperationSymbol = this.getTokenSymbolString(pOperation.Operation);
		let tmpOperationRightValue = this.getTokenSymbolString(pOperation.RightValue);

		let tmpVirtualSymbolPrefix = tmpOperationVirtualSymbol.substring(0, 3);

		if (tmpOperationSymbol === '=')
		{
			// Assignment operators are special
			return `${tmpOperationVirtualSymbol} = ${tmpOperationLeftValue}`;
		}

		if (tmpVirtualSymbolPrefix === 'VFE')
		{
			// Virtual Function Expression
			return `${tmpOperationVirtualSymbol} = ${tmpOperationSymbol}(${tmpOperationLeftValue})`;
		}

		return `${tmpOperationVirtualSymbol} = ${tmpOperationLeftValue} ${tmpOperationSymbol} ${tmpOperationRightValue}`;
	}

	getOperationValueMessage(pOperation, pResultObject)
	{
		if (!pOperation)
		{
			return 'INVALID_OPERATION';
		}
		let tmpOperationVirtualSymbol = this.getOperationVirtualSymbolName(pOperation);
		let tmpOperationLeftValue = this.getVirtualTokenValue(pOperation.LeftValue, pResultObject);
		let tmpOperationSymbol = this.getTokenSymbolString(pOperation.Operation);
		let tmpOperationRightValue = this.getVirtualTokenValue(pOperation.RightValue, pResultObject);

		let tmpVirtualSymbolPrefix = tmpOperationVirtualSymbol.substring(0, 3);

		if (tmpOperationSymbol === '=')
		{
			// Assignment operators are special
			return `${tmpOperationVirtualSymbol} = ${tmpOperationLeftValue}`;
		}

		if (tmpVirtualSymbolPrefix === 'VFE')
		{
			// Virtual Function Expression
			return `${tmpOperationVirtualSymbol} = ${tmpOperationSymbol}(${tmpOperationLeftValue})`;
		}

		return `${tmpOperationVirtualSymbol} = ${tmpOperationLeftValue} ${tmpOperationSymbol} ${tmpOperationRightValue}`;
	}

	getOperationOutcomeMessage(pToken, pOperationResults)
	{
		if (!pToken)
		{
			return 'INVALID_TOKEN';
		}
		let tmpOperationVirtualSymbol = this.getOperationVirtualSymbolName(pToken);
		let tmpOperationOutcomeValue = this.getVirtualTokenValue(pToken, pOperationResults);

		return `${tmpOperationVirtualSymbol} = ${tmpOperationOutcomeValue}`;
	}

	logFunctionOutcome(pResultObject)
	{
		if (typeof(pResultObject) !== 'object')
		{
			this.log.error(`Solver results object was not an object.  Cannot log outcome.`);
			return;
		}
		let tmpAssignmentAddress = ('PostfixedAssignmentAddress' in pResultObject) ? pResultObject.PostfixedAssignmentAddress : 'NO_ASSIGNMENT_ADDRESS_FOUND';
		let tmpRawExpression = ('RawExpression' in pResultObject) ? pResultObject.RawExpression : 'NO_EXPRESSION_FOUND';
		let tmpRawResult = ('RawResult' in pResultObject) ? pResultObject.RawResult : 'NO_RESULT_FOUND';

		this.log.info(`Solved f(${tmpAssignmentAddress}) = {${tmpRawExpression}}`);
		for (let i = 0; i < pResultObject.PostfixSolveList.length; i++)
		{
			let tmpToken = pResultObject.PostfixSolveList[i];
			let tmpTokenSymbolMessage = this.getOperationSymbolMessage(tmpToken);
			this.log.info(`${i} Symbols: ${tmpTokenSymbolMessage}`);
			let tmpTokenValueMessage = this.getOperationValueMessage(tmpToken, pResultObject);
			this.log.info(`${i}  Values: ${tmpTokenValueMessage}`);
			let tmpTokenOutcome = this.getOperationOutcomeMessage(tmpToken, pResultObject);
			this.log.info(`${i} Outcome: ${tmpTokenOutcome}`);
		}
		this.log.info(`{${tmpRawExpression}} = ${tmpRawResult}`);
	}

	logFunctionSolve(pResultObject)
	{
		if (typeof(pResultObject) !== 'object')
		{
			this.log.error(`Solver results object was not an object.  Cannot log the solve.`);
			return;
		}
		if (!('PostfixSolveList' in pResultObject) || !Array.isArray(pResultObject.PostfixSolveList))
		{
			this.log.error(`Solver results object did not contain a PostfixSolveList array.  Cannot log the solve.`);
			return;
		}

		for (let i = 0; i < pResultObject.PostfixSolveList.length; i++)
		{
			let tmpToken = pResultObject.PostfixSolveList[i];
			console.log(`${i}: ${tmpToken.VirtualSymbolName} = (${tmpToken.LeftValue.Token}::${tmpToken.LeftValue.Value})  ${tmpToken.Operation.Token}  (${tmpToken.RightValue.Token}::${tmpToken.RightValue.Value}) `)
		}

		this.logFunctionOutcome(pResultObject);
	}
}

module.exports = ExpressionParserMessaging;
