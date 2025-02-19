const { PE } = require('big.js');
const libFableServiceBase = require('fable-serviceproviderbase');

/* Trying a different pattern for this service ...
 *
 * This service is a simple expression parser that can handle math expressions, with magic(tm) lookup of addresses with a manifest.
 * 
 * Each method works multiple ways.
 * 
 * 1. You can pass in a results object, and, it will put the state for that step outcome into the results object.
 * 2. It always returns the state, and works without the results object.
 * 
 * 
 * Learned a lot from this npm package: https://www.npmjs.com/package/math-expression-evaluator
 * And its related code at github: https://github.com/bugwheels94/math-expression-evaluator
 * 
 * There were two problems with the codebase above...
 * 
 * First, the code was very unreadable and determining it was correct or extending it
 * was out of the question.
 * 
 * Second, and this is a larger issue, is that we need the expressions to be parsed as
 * arbitrary precision.  When I determined that extending the library to use string-based
 * numbers and an arbitrary precision library as the back-end would have taken a significantly
 * longer amount of time than just writing the parser from scratch... et voila.
 */

class FableServiceExpressionParser extends libFableServiceBase
{
	/**
	 * Constructs a new instance of the ExpressionParser service.
	 * @param {Object} pFable - The Fable object.
	 * @param {Object} pOptions - The options for the service.
	 * @param {string} pServiceHash - The hash of the service.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// The configuration for tokens that the solver recognizes, with precedence and friendly names.
		this.tokenMap = require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-TokenMap.json');

		// Keep track of maximum token precedence
		this.tokenMaxPrecedence = 4;
		// This isn't exactly a radix tree but close enough.  It's a map of the first character of the token to the token.
		this.tokenRadix = {};
		let tmpTokenKeys = Object.keys(this.tokenMap);
		for (let i = 0; i < tmpTokenKeys.length; i++)
		{
			let tmpTokenKey = tmpTokenKeys[i];
			let tmpToken = this.tokenMap[tmpTokenKey];

			tmpToken.Token = tmpTokenKey;
			tmpToken.Length = tmpTokenKey.length;

			let tmpTokenStartCharacter = tmpToken.Token[0];
			if (!(tmpTokenStartCharacter in this.tokenRadix))
			{
				// With a token count of 1 and a literal of true, we can assume it being in the radix is the token.
				this.tokenRadix[tmpTokenStartCharacter] = (
					{
						TokenCount: 0,
						Literal: false,
						TokenKeys: [],
						TokenMap: {}
					});
			}

			this.tokenRadix[tmpTokenStartCharacter].TokenCount++;
			if (tmpTokenKey == tmpTokenStartCharacter)
			{
				this.tokenRadix[tmpTokenStartCharacter].Literal = true;
			}
			this.tokenRadix[tmpTokenStartCharacter].TokenMap[tmpToken.Token] = tmpToken;
			this.tokenRadix[tmpTokenStartCharacter].TokenKeys.push(tmpTokenKey);
			this.tokenRadix[tmpTokenStartCharacter].TokenKeys.sort((pLeft, pRight) => pRight.length - pLeft.length);

			if (this.tokenMaxPrecedence < tmpToken.Precedence)
			{
				this.tokenMaxPrecedence = tmpToken.Precedence;
			}
		}

		// The configuration for which functions are available to the solver.
		this.functionMap = require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-FunctionMap.json');

		this.serviceType = 'ExpressionParser';

		// These are sub-services for the tokenizer, linter, compiler, marshaler and solver.
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Tokenizer', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-ExpressionTokenizer.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Linter', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Linter.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Postfix', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Postfix.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-ValueMarshal', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-ValueMarshal.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Solver', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-SolvePostfixedExpression.js'));
		// And the sub-service for the friendly user messaging
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Messaging', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Messaging.js'));


		// This code instantitates these fable services to child objects of this service, but does not pollute the main fable with them.
		this.Tokenizer = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Tokenizer');
		this.Linter = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Linter');
		this.Postfix = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Postfix');
		this.ValueMarshal = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-ValueMarshal');
		this.Solver = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Solver');
		this.Messaging = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Messaging');

		// Wire each sub service into this instance of the solver.
		this.Tokenizer.connectExpressionParser(this);
		this.Linter.connectExpressionParser(this);
		this.Postfix.connectExpressionParser(this);
		this.ValueMarshal.connectExpressionParser(this);
		this.Solver.connectExpressionParser(this);
		this.Messaging.connectExpressionParser(this);

		this.GenericManifest = this.fable.newManyfest();
		
		// This will look for a LogNoisiness on fable (or one that falls in from pict) and if it doesn't exist, set one for this service.
		this.LogNoisiness = ('LogNoisiness' in this.fable) ? this.fable.LogNoisiness : 0;
	}

	/**
	 * Tokenizes the given mathematical expression string.
	 *
	 * @param {string} pExpression - The expression to tokenize.
	 * @param {object} pResultObject - The result object to store the tokenized expression.
	 * @returns {object} - The tokenized expression.
	 */
	tokenize(pExpression, pResultObject)
	{
		return this.Tokenizer.tokenize(pExpression, pResultObject);
	}

	/**
	 * Lints a tokenized expression.
	 *
	 * @param {Array} pTokenizedExpression - The tokenized expression to lint.
	 * @param {Object} pResultObject - The result object where we store the linting result.
	 * @returns {Object} - The linting result object.
	 */
	lintTokenizedExpression(pTokenizedExpression, pResultObject)
	{
		return this.Linter.lintTokenizedExpression(pTokenizedExpression, pResultObject);
	}

	/**
	 * Builds a postfix solve list for the given tokenized expression and result object.
	 *
	 * @param {Array} pTokenizedExpression - The tokenized expression.
	 * @param {Object} pResultObject - The result object where the algorithm "shows its work".
	 * @returns {Array} The postfix solve list.
	 */
	buildPostfixedSolveList(pTokenizedExpression, pResultObject)
	{
		return this.Postfix.buildPostfixedSolveList(pTokenizedExpression, pResultObject);
	}

	/**
	 * Substitutes values in tokenized objects.
	 * 
	 * This means marshaling data from pDataSource into the array of objects with the passed in Manifest (or a generic manifest) to prepare for solving.
	 *
	 * @param {Array} pTokenizedObjects - The array of tokenized objects.
	 * @param {Object} pDataSource - The data source object.
	 * @param {Object} pResultObject - The result object.
	 * @param {Object} pManifest - The manifest object.
	 * @returns {Object} - The updated result object.
	 */
	substituteValuesInTokenizedObjects(pTokenizedObjects, pDataSource, pResultObject, pManifest)
	{
		return this.ValueMarshal.substituteValuesInTokenizedObjects(pTokenizedObjects, pDataSource, pResultObject, pManifest);
	}

	/**
	 * Solves a postfixed expression Array.
	 *
	 * @param {Array} pPostfixedExpression - The postfixed expression to solve.
	 * @param {object} pDataDestinationObject - The data destination object where data gets marshaled to after solving.
	 * @param {object} pResultObject - The result object where the algorithm "shows its work".
	 * @param {object} pManifest - The manifest object.
	 * @returns {any} The result of the solved expression.
	 */
	solvePostfixedExpression(pPostfixedExpression, pDataDestinationObject, pResultObject, pManifest)
	{
		return this.Solver.solvePostfixedExpression(pPostfixedExpression, pDataDestinationObject, pResultObject, pManifest);
	}

	/**
	 * Solves the given expression using the provided data and manifest.
	 * 
	 * @param {string} pExpression - The expression to solve.
	 * @param {object} pDataSourceObject - (optional) The data source object (e.g. AppData).
	 * @param {object} pResultObject - (optional) The result object containing the full postfix expression list, internal variables and solver history.
	 * @param {object} pManifest - (optional) The manifest object for dereferencing variables.
	 * @param {object} pDataDestinationObject - (optional) The data destination object for where to marshal the result into.
	 * @returns {any} - The result of solving the expression.
	 */
	solve(pExpression, pDataSourceObject, pResultObject, pManifest, pDataDestinationObject)
	{
		let tmpResultsObject = (typeof(pResultObject) === 'object') ? pResultObject : {};
		let tmpDataSourceObject = (typeof(pDataSourceObject) === 'object') ? pDataSourceObject : {};
		let tmpDataDestinationObject = (typeof(pDataDestinationObject) === 'object') ? pDataDestinationObject : {};

		// This is technically a "pre-compile" and we can keep this Results Object around to reuse for better performance.  Not required.
		this.tokenize(pExpression, tmpResultsObject);
		this.lintTokenizedExpression(tmpResultsObject.RawTokens, tmpResultsObject);
		this.buildPostfixedSolveList(tmpResultsObject.RawTokens, tmpResultsObject);
		
		// This is where the data from variables gets marshaled into their symbols (from AppData or the like)
		this.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpDataSourceObject, tmpResultsObject, pManifest);
		
		// Finally this is the expr solving method, which returns a string and also marshals it into tmpDataDestinationObject
		return this.solvePostfixedExpression(tmpResultsObject.PostfixSolveList, tmpDataDestinationObject, tmpResultsObject, pManifest);
	}
}

module.exports = FableServiceExpressionParser;