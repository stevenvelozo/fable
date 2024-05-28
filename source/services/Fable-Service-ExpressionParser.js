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
 * There were two problems with the codebase...
 * 
 * First, the code was very unreadable and determining it was correct or extending it
 * was out of the question.
 * 
 * Second, and this is a larger issue, is that we need the expressions to be parsed as
 * arbitrary precision.  When I determined that extending the library to use string-based
 * numbers and an arbitrary precision library as the back-end would have taken a significantly
 * longer amount of time than just writing the parser from scratch, et voila.
 */

class FableServiceExpressionParser extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.tokenMap = require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-TokenMap.json');
		// This precedence is higher than defined in our token map
		this.tokenMaxPrecedence = 5;

		this.functionMap = require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-FunctionMap.json');

		this.serviceType = 'ExpressionParser';

		this.fable.addServiceTypeIfNotExists('ExpressionParser-Tokenizer', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-ExpressionTokenizer.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Linter', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Linter.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Postfix', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Postfix.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Solver', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-SolvePostfixedExpression.js'));

		this.Tokenizer = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Tokenizer');
		this.Linter = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Linter');
		this.Postfix = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Postfix');
		this.Solver = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Solver');

		// Now wire each of these up.  Not in love with this pattern but better than a giant file here.
		this.Tokenizer.connectExpressionParser(this);
		this.Linter.connectExpressionParser(this);
		this.Postfix.connectExpressionParser(this);
		this.Solver.connectExpressionParser(this);
	}

	substituteValuesInTokenizedObjects(pTokenizedObjects, pDataSource, pResultObject, pManifestDefinition)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		if (!Array.isArray(pTokenizedObjects))
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects was passed a non-array tokenized object list.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return pTokenizedObjects;
		}
		if (typeof(pDataSource) !== 'object')
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects either was passed no data source, or was passed a non-object data source.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return pTokenizedObjects;
		}

		let tmpDataSource = pDataSource;

		// TODO: Allow the calling API to pass in an already constructed manifest.
		let tmpManifest = this.fable.newManyfest(pManifestDefinition);

		for (let i = 0; i < pTokenizedObjects.length; i++)
		{
			if (typeof(pTokenizedObjects[i]) !== 'object')
			{
				tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.substituteValuesInTokenizedObjects found a non-object tokenized object at index ${i}`);
				this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				continue;
			}
			let tmpToken = pTokenizedObjects[i];
			if ((pTokenizedObjects[i].Type === 'Token.Symbol') && !tmpToken.Resolved)
			{
				// Symbols always look up values by hash first
				let tmpValue = tmpManifest.getValueByHash(tmpDataSource, tmpToken.Token);
				// if (!tmpValue)
				// {
				// 	// If no hash resolves, try by address.
				// 	tmpValue = tmpManifest.getValueAtAddress(tmpToken.Token, tmpDataSource);
				// }
				if (!tmpValue)
				{
					tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.substituteValuesInTokenizedObjects found no value for the symbol hash or address ${tmpToken.Token} at index ${i}`);
					this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					continue;
				}
				else
				{
					tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpValue}] for the state address ${tmpToken.Token} at index ${i}`);
					this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					try
					{
						let tmpValueParsed = new this.fable.Utility.bigNumber(tmpValue);
						tmpToken.Resolved = true;
						tmpToken.Value = tmpValueParsed.toString();
					}
					catch(pError)
					{
						tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects found a non-numeric value for the state address ${tmpToken.Token} at index ${i}`);
						this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						tmpToken.Resolved = false;
					}
				}
			}
			if ((pTokenizedObjects[i].Type === 'Token.StateAddress') && !tmpToken.Resolved)
			{
				// Symbols are always hashes.  This gracefully works for simple shallow objects because hashes default to the address in Manyfest.
				let tmpValue = tmpManifest.getValueAtAddress(tmpDataSource, tmpToken.Token);
				if (!tmpValue)
				{
					tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.substituteValuesInTokenizedObjects found no value for the state address ${tmpToken.Token} at index ${i}`);
					this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					continue;
				}
				else
				{
					tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpValue}] for the state address ${tmpToken.Token} at index ${i}`);
					this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					try
					{
						let tmpValueParsed = new this.fable.Utility.bigNumber(tmpValue);
						tmpToken.Resolved = true;
						tmpToken.Value = tmpValueParsed.toString();
					}
					catch(pError)
					{
						tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects found a non-numeric value for the state address ${tmpToken.Token} at index ${i}`);
						this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						tmpToken.Resolved = false;
					}
				}
			}
			if ((pTokenizedObjects[i].Type === 'Token.Constant') && !tmpToken.Resolved)
			{
				tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpToken.Token}] for the constant ${tmpToken.Token} at index ${i}`);
				this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				try
				{
					let tmpValueParsed = new this.fable.Utility.bigNumber(tmpToken.Token);
					tmpToken.Resolved = true;
					tmpToken.Value = tmpValueParsed.toString();
				}
				catch(pError)
				{
					// This constant has the right symbols but apparently isn't a parsable number.
					tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects found a non-numeric value for the state address ${tmpToken.Token} at index ${i}`);
					this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					tmpToken.Resolved = false;
				}
			}
		}

		return pTokenizedObjects;
	}

	tokenize(pExpression, pResultObject)
	{
		return this.Tokenizer.tokenize(pExpression, pResultObject);
	}

	lintTokenizedExpression(pTokenizedExpression, pResultObject)
	{
		return this.Linter.lintTokenizedExpression(pTokenizedExpression, pResultObject);
	}

	buildPostfixedSolveList(pTokenizedExpression, pResultObject)
	{
		return this.Postfix.buildPostfixedSolveList(pTokenizedExpression, pResultObject);
	}

	solvePostfixedExpression(pPostfixedExpression, pDataDestinationObject, pResultObject, pManifest)
	{
		return this.Solver.solvePostfixedExpression(pPostfixedExpression, pDataDestinationObject, pResultObject, pManifest);
	}

	solve(pExpression, pDataSourceObject, pResultObject, pManifestDefinition, pDataDestinationObject)
	{
		let tmpResultsObject = (typeof(pResultObject) === 'object') ? pResultObject : {};
		let tmpDataSourceObject = (typeof(pDataSourceObject) === 'object') ? pDataSourceObject : {};
		let tmpDataDestinationObject = (typeof(pDataDestinationObject) === 'object') ? pDataDestinationObject : {};

		this.tokenize(pExpression, tmpResultsObject);
		this.lintTokenizedExpression(tmpResultsObject.RawTokens, tmpResultsObject);
		this.buildPostfixedSolveList(tmpResultsObject.RawTokens, tmpResultsObject);
		
		this.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpDataSourceObject, tmpResultsObject, pManifestDefinition);

		return this.solvePostfixedExpression(tmpResultsObject.PostfixSolveList, tmpDataDestinationObject, tmpResultsObject, pManifestDefinition);
	}
}

module.exports = FableServiceExpressionParser;