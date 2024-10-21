const libFableServiceProviderBase = require('fable-serviceproviderbase');

class ExpressionParserOperationBase extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'ExpressionParserOperationBase';

		this.numberTest = /^-{0,1}\d*\.{0,1}\d+$/;

		this.ExpressionParser = false;
	}

	connectExpressionParser(pExpressionParser)
	{
		this.ExpressionParser = pExpressionParser;
	}

	getTokenType(pToken)
	{
		if (pToken in this.ExpressionParser.tokenMap)
		{
			return `Token.${this.ExpressionParser.tokenMap[pToken].Type}`;
		}
		else if ((pToken.length > 2) && (pToken[0] === '{') && (pToken[pToken.length-1] === '}'))
		{
			return 'Token.StateAddress';
		}
		else if ((pToken.length > 2) && (pToken[0] === '"') && (pToken[pToken.length-1] === '"'))
		{
			return 'Token.String';
		}
		else if (this.numberTest.test(pToken))
		{
			return 'Token.Constant';
		}
		else
		{
			return 'Token.Symbol';
		}
		// Just for documentation sake:
		// There is a fifth token type, VirtualSymbol
		// This is a value that's added during solve and looked up by address in the VirtualSymbol object.
	}

	getTokenContainerObject(pToken, pTokenType)
	{
		return (
			{
				Token: pToken,
				Type: (typeof(pTokenType) === 'undefined') ? this.getTokenType(pToken) : pTokenType,
				Descriptor: (pToken in this.ExpressionParser.tokenMap) ? this.ExpressionParser.tokenMap[pToken] : false
			});
	}
}

module.exports = ExpressionParserOperationBase;