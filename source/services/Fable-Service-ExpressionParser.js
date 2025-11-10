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

		/** @type {import('../Fable.js') & { Math: import('./Fable-Service-Math.js') }} */
		this.fable;
		/** @type {any} */
		this.log;

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
		this.fable.addServiceTypeIfNotExists('ExpressionParser-TokenizerDirectiveMutation', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-ExpressionTokenizer-DirectiveMutation.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Linter', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Linter.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Postfix', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Postfix.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-ValueMarshal', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-ValueMarshal.js'));
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Solver', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-SolvePostfixedExpression.js'));
		// And the sub-service for the friendly user messaging
		this.fable.addServiceTypeIfNotExists('ExpressionParser-Messaging', require('./Fable-Service-ExpressionParser/Fable-Service-ExpressionParser-Messaging.js'));


		// This code instantitates these fable services to child objects of this service, but does not pollute the main fable with them.
		this.Tokenizer = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-Tokenizer');
		this.Tokenizer.TokenizerDirectiveMutation = this.fable.instantiateServiceProviderWithoutRegistration('ExpressionParser-TokenizerDirectiveMutation');
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
	 * Prepares the parameters for a SERIES directive by substituting values and applying defaults.
	 *
	 * @param {Array} pParameters
	 * @param {Array} pDefaults
	 * @param {Object} pResultObject
	 * @param {Object} pDataSourceObject
	 * @param {import('manyfest')} [pManifest]
	 */
	_prepareDirectiveParameters(pParameters, pDefaults, pResultObject, pDataSourceObject, pManifest)
	{
		const tmpResults = [];
		for (let i = 0; i < pParameters.length; i++)
		{
			const tmpParameter = pParameters[i];
			let tmpValue = this.fable.Math.parsePrecise(tmpParameter, NaN);
			if (isNaN(tmpValue) && typeof tmpParameter === 'string' && tmpParameter.length > 0)
			{
				const tmpToken = this.fable.ExpressionParser.Postfix.getTokenContainerObject(tmpParameter, 'Token.Symbol');
				this.substituteValuesInTokenizedObjects([tmpToken], pDataSourceObject, pResultObject, pManifest);
				if (tmpToken.Resolved)
				{
					tmpValue = tmpToken.Value;
				}
			}
			if (isNaN(tmpValue) && pDefaults.length > i)
			{
				tmpValue = pDefaults[i];
			}
			tmpResults.push(tmpValue);
		}
		return tmpResults;
	}

	/**
	 * Solves the given expression using the provided data and manifest.
	 *
	 * @param {string} pExpression - The expression to solve.
	 * @param {Record<string, any>} [pDataSourceObject] - (optional) The data source object (e.g. AppData).
	 * @param {Record<string, any>} [pResultObject] - (optional) The result object containing the full postfix expression list, internal variables and solver history.
	 * @param {import('manyfest')} [pManifest] - (optional) The manifest object for dereferencing variables.
	 * @param {Record<string, any>} [pDataDestinationObject] - (optional) The data destination object for where to marshal the result into.
	 * @returns {any} - The result of solving the expression.
	 */
	solve(pExpression, pDataSourceObject, pResultObject, pManifest, pDataDestinationObject)
	{
		let tmpResultsObject = (typeof(pResultObject) === 'object') ? pResultObject : {};
		let tmpDataSourceObject = (typeof(pDataSourceObject) === 'object') ? pDataSourceObject : {};
		let tmpDataDestinationObject = (typeof(pDataDestinationObject) === 'object') ? pDataDestinationObject : {};

		// This is technically a "pre-compile" and we can keep this Results Object around to reuse for better performance.  Not required.
		this.tokenize(pExpression, tmpResultsObject);

		// Lint the tokenized expression to make sure it's valid
		this.lintTokenizedExpression(tmpResultsObject.RawTokens, tmpResultsObject);
		this.buildPostfixedSolveList(tmpResultsObject.RawTokens, tmpResultsObject);

		const tmpManifest = (typeof(pManifest) === 'object') ? pManifest : this.fable.newManyfest();
		if (tmpResultsObject.SolverDirectives.Code == 'SERIES')
		{
			const [ tmpStep , tmpFrom, tmpTo] = this._prepareDirectiveParameters([
				tmpResultsObject.SolverDirectives.Step,
				tmpResultsObject.SolverDirectives.From,
				tmpResultsObject.SolverDirectives.To,
			], [ '1' ], tmpResultsObject, tmpDataSourceObject, tmpManifest);

			if (isNaN(tmpFrom) || isNaN(tmpTo))
			{
				tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid SERIES directive parameters.  FROM, TO must be numeric.`);
				this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
				return null;
			}

			// Make sure from/to are not equal
			if (this.fable.Math.comparePrecise(tmpFrom, tmpTo) == 0)
			{
				tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid SERIES directive parameters.  FROM and TO cannot be equal.`);
				this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
				return null;
			}

			// Make sure that Step is the correct positive/negative based on From and To
			if (this.fable.Math.comparePrecise(tmpStep, '0') == 0)
			{
				tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid SERIES directive parameters.  STEP cannot be zero.`);
				this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
				return null;
			}
			if (this.fable.Math.comparePrecise(tmpFrom, tmpTo) < 0)
			{
				// From < To so Step must be positive
				if (this.fable.Math.comparePrecise(tmpStep, '0') < 0)
				{
					tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid SERIES directive parameters.  STEP must be positive when FROM < TO.`);
					this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
					return null;
				}
			}
			else
			{
				// From >= To so Step must be negative
				if (this.fable.Math.comparePrecise(tmpStep, '0') > 0)
				{
					tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid SERIES directive parameters.  STEP must be negative when FROM >= TO.`);
					this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
					return null;
				}
			}

			// Get the number of iterations we need to perform
			let tmpIterations = parseInt(this.fable.Math.floorPrecise(this.fable.Math.dividePrecise(this.fable.Math.subtractPrecise(tmpTo, tmpFrom), tmpStep)));

			let tmpValueArray = [];

			for (let i = 0; i <= tmpIterations; i++)
			{
				let tmpCurrentValueOfN = this.fable.Math.addPrecise(tmpFrom, this.fable.Math.multiplyPrecise(tmpStep, i.toString()));

				// Jimmy up the data source with the current N value, stepIndex and all the other data from the source object
				// This generates a data source object every time on purpose so we can remarshal in values that changed in the destination
				let tmpSeriesStepDataSourceObject = Object.assign({}, tmpDataSourceObject);
				tmpSeriesStepDataSourceObject.n = tmpCurrentValueOfN;
				tmpSeriesStepDataSourceObject.stepIndex = i;

				let tmpMutatedValues = this.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpSeriesStepDataSourceObject, tmpResultsObject, tmpManifest);

				tmpValueArray.push( this.solvePostfixedExpression( tmpResultsObject.PostfixSolveList, tmpDataDestinationObject, tmpResultsObject, tmpManifest) );

				for (let j = 0; j < tmpMutatedValues.length; j++)
				{
					tmpMutatedValues[j].Resolved = false;
				}
			}

			// Do the assignment
			let tmpAssignmentManifestHash = tmpResultsObject.PostfixedAssignmentAddress;
			if ((tmpResultsObject.OriginalRawTokens[1] === '=') && (typeof(tmpResultsObject.OriginalRawTokens[0]) === 'string') && (tmpResultsObject.OriginalRawTokens[0].length > 0))
			{
				tmpAssignmentManifestHash = tmpResultsObject.OriginalRawTokens[0];
			}

			tmpManifest.setValueByHash(tmpDataDestinationObject, tmpAssignmentManifestHash, tmpValueArray);

			return tmpValueArray;
		}
		else if (tmpResultsObject.SolverDirectives.Code == 'MAP')
		{
			// The values to pull in -- this could be a map but affords better flexibility broken out like this.
			const tmpDirectiveValues = tmpResultsObject.SolverDirectives.Values;
			const tmpDirectiveValueKeys = tmpResultsObject.SolverDirectives.ValueKeys;
			let tmpValueArray = [];

			for (let i = 0; i < tmpDirectiveValueKeys.length; i++)
			{
				const tmpVariableKey = tmpDirectiveValueKeys[i];
				const tmpVariableDescription = tmpDirectiveValues[tmpVariableKey];

				// Get the actual value for this variable's address
				tmpVariableDescription.Value = tmpManifest.getValueByHash(tmpDataSourceObject, tmpVariableDescription.Address);
			}

			// If the first value doesn't have keys, don't do the map.
			if ((tmpDirectiveValueKeys.length < 1) || (tmpDirectiveValues[tmpDirectiveValueKeys[0]].Value == null) || (!Array.isArray(tmpDirectiveValues[tmpDirectiveValueKeys[0]].Value)))
			{
				tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid MAP directive parameters.  The first variable's address must resolve to an array.`);
				this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
				return undefined;
			}

			let tmpControllingSet = tmpDirectiveValues[tmpDirectiveValueKeys[0]].Value;

			for (let i = 0; i < tmpControllingSet.length; i++)
			{
				// Jimmy up the data source with the current N value, stepIndex and all the other data from the source object
				// This generates a data source object every time on purpose so we can remarshal in values that changed in the destination
				let tmpSeriesStepDataSourceObject = Object.assign({}, tmpDataSourceObject);

				for (let j = 0; j < tmpDirectiveValueKeys.length; j++)
				{
					const tmpVariableKey = tmpDirectiveValueKeys[j];
					if (!Array.isArray(tmpDirectiveValues[tmpVariableKey].Value) || (tmpDirectiveValues[tmpVariableKey].Value.length <= j))
					{
						tmpSeriesStepDataSourceObject[tmpVariableKey] = 0;
					}
					else
					{
						tmpSeriesStepDataSourceObject[tmpVariableKey] = tmpDirectiveValues[tmpVariableKey].Value[i];
					}
				}

				let tmpMutatedValues = this.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpSeriesStepDataSourceObject, tmpResultsObject, tmpManifest);

				tmpValueArray.push( this.solvePostfixedExpression( tmpResultsObject.PostfixSolveList, tmpDataDestinationObject, tmpResultsObject, tmpManifest) );

				for (let j = 0; j < tmpMutatedValues.length; j++)
				{
					tmpMutatedValues[j].Resolved = false;
				}
			}

			// Do the assignment
			let tmpAssignmentManifestHash = tmpResultsObject.PostfixedAssignmentAddress;
			if ((tmpResultsObject.OriginalRawTokens[1] === '=') && (typeof(tmpResultsObject.OriginalRawTokens[0]) === 'string') && (tmpResultsObject.OriginalRawTokens[0].length > 0))
			{
				tmpAssignmentManifestHash = tmpResultsObject.OriginalRawTokens[0];
			}

			tmpManifest.setValueByHash(tmpDataDestinationObject, tmpAssignmentManifestHash, tmpValueArray);

			return tmpValueArray;
		}
		else if (tmpResultsObject.SolverDirectives.Code == 'MONTECARLO')
		{
			const [ tmpSampleCount ] = this._prepareDirectiveParameters([
				tmpResultsObject.SolverDirectives.SampleCount
			], [ '1' ], tmpResultsObject, tmpDataSourceObject, tmpManifest);

			if (isNaN(tmpSampleCount))
			{
				tmpResultsObject.ExpressionParserLog.push(`ExpressionParser.solve detected invalid MONTECARLO directive parameters.  SAMPLECOUNT must be numeric.`);
				this.log.warn(tmpResultsObject.ExpressionParserLog[tmpResultsObject.ExpressionParserLog.length-1]);
				return null;
			}

			let tmpMonteCarloOutput = JSON.parse(JSON.stringify(tmpResultsObject.SolverDirectives));
			tmpMonteCarloOutput.Samples = [];

			// Now go through each variable and prepare its object of values
			let tmpVariableKeys = Object.keys(tmpMonteCarloOutput.Values);
			for (let i = 0; i < tmpVariableKeys.length; i++)
			{
				let tmpVariableKey = tmpVariableKeys[i];
				let tmpVariableDescription = tmpMonteCarloOutput.Values[tmpVariableKey];
				
				// For each variable, generate its array of sampled values
				tmpVariableDescription.Distribution = {};
				tmpVariableDescription.ValueSequence = [];

				// Resolve the points if they are tokenized expressions
				const tmpResolvedPoints = [];
				for (let j = 0; j < tmpVariableDescription.Points.length; j++)
				{
					let tmpPointToken = tmpVariableDescription.Points[j];
					let tmpPointValue = this.fable.Math.parsePrecise(tmpPointToken, NaN);
					if (isNaN(tmpPointValue) && typeof tmpPointToken === 'string' && tmpPointToken.length > 0)
					{
						tmpPointValue = tmpManifest.getValueByHash(tmpDataSourceObject, tmpPointToken);
						if (!tmpPointValue || (tmpPointValue == null))
						{
							//TODO: Warn?
						}
						else
						{
							tmpResolvedPoints.push(tmpPointValue);
						}

					}
					else
					{
						tmpResolvedPoints.push(tmpPointToken);
					}
				}
				// Now sort the resolved points
				tmpResolvedPoints.sort((a, b) => this.fable.Math.comparePrecise(a, b));
				tmpVariableDescription.ResolvedPoints = tmpResolvedPoints;

				// Just simple linear until we add more easing types in a separate library (refactoring the below out)
				tmpVariableDescription.FirstPoint = tmpVariableDescription.ResolvedPoints[0];
				tmpVariableDescription.DomainRangeStart = tmpVariableDescription.FirstPoint;
				if (tmpVariableDescription.ResolvedPoints.length < 2)
				{
					tmpVariableDescription.LastPoint = tmpVariableDescription.FirstPoint;
				}
				else
				{
					tmpVariableDescription.LastPoint = this.fable.Math.parsePrecise(tmpVariableDescription.ResolvedPoints[tmpVariableDescription.ResolvedPoints.length - 1], NaN);
					if (isNaN(tmpVariableDescription.LastPoint))
					{
						tmpVariableDescription.LastPoint = tmpVariableDescription.FirstPoint;
					}
				}
				tmpVariableDescription.DomainLength = this.fable.Math.subtractPrecise(tmpVariableDescription.LastPoint, tmpVariableDescription.FirstPoint);
				//this.fable.log.trace(`Monte Carlo variable ${tmpVariableKey} has first point ${tmpVariableDescription.FirstPoint}, last point ${tmpVariableDescription.LastPoint}, domain length ${tmpVariableDescription.DomainLength}`);

				// // This generation of data based on the resolved points (and easing type) should be abstracted.  Most require the same rules.
				// tmpVariableDescription.ResolvedPointDomainStarts = [];
				// tmpVariableDescription.DomainTranslationAmount = [];

				// // Get the length of each domain segment and the multiplier for them
				// tmpVariableDescription.DomainLength = this.fable.Math.subtractPrecise(tmpVariableDescription.ResolvedPoints[tmpVariableDescription.ResolvedPoints.length - 1], tmpVariableDescription.ResolvedPoints[0]);
				// tmpVariableDescription.DomainChunkCount = tmpVariableDescription.ResolvedPoints.length;
				// tmpVariableDescription.DomainStart = tmpVariableDescription.ResolvedPoints[0];

				// let tmpCurrentDomainPosition = tmpVariableDescription.DomainStart;
				// let tmpPreviousDomainTranslationAmount = '0';
				// for (let j = 0; j < tmpVariableDescription.ResolvedPoints.length; j++)
				// {
				// 	let tmpResolvedPointValue = tmpVariableDescription.ResolvedPoints[j];
				// 	// Set the resolved point domain start
				// 	tmpVariableDescription.DomainTranslationAmount.push(this.fable.Math.dividePrecise(tmpResolvedPointValue, tmpVariableDescription.DomainLength));
				// 	// Push the previous translation amount as the start of this domain
				// 	tmpVariableDescription.ResolvedPointDomainStarts.push(tmpPreviousDomainTranslationAmount);
				// 	// Calculate the translation amount, for the start of the next domain
				// 	tmpPreviousDomainTranslationAmount = this.fable.Math.addPrecise(tmpPreviousDomainTranslationAmount, tmpVariableDescription.DomainLength);
				// }
			}
				
			for (let i = 0; i <= tmpSampleCount - 1; i++)
			{
				// Jimmy up the data source with the current N value, stepIndex and all the other data from the source object
				// This generates a data source object every time on purpose so we can remarshal in values that changed in the destination
				let tmpSeriesStepDataSourceObject = Object.assign({}, tmpDataSourceObject);
				tmpSeriesStepDataSourceObject.stepIndex = i;

				// Generate each value from the array of values
				for (let j = 0; j < tmpVariableKeys.length; j++)
				{
					let tmpPointManifestHash = tmpVariableKeys[j];
					let tmpPointManifest = tmpMonteCarloOutput.Values[tmpPointManifestHash];

					// Generate the value for this sample variable
					let tmpPointValue = this.fable.Math.generateValueFromEasingDescription(tmpPointManifest);
					tmpSeriesStepDataSourceObject[tmpVariableKeys[j]] = tmpPointValue;
					tmpPointManifest.ValueSequence.push(tmpPointValue);

					// We keep track of a distribution of generated values here for analysis later
					let tmpDistributionRoundPrecision = tmpPointManifest.DistributionRoundPrecision || 0;
					// Log the value out
					//this.fable.log.info(`Monte Carlo variable ${tmpPointManifestHash} generated value ${tmpPointValue}`);
					let tmpDistributionPointValue = this.fable.Math.roundPrecise(tmpPointValue, tmpDistributionRoundPrecision);
					if (!(tmpDistributionPointValue in tmpPointManifest.Distribution))
					{
						tmpPointManifest.Distribution[tmpDistributionPointValue] = 0;
					}
					tmpPointManifest.Distribution[tmpDistributionPointValue] = tmpPointManifest.Distribution[tmpDistributionPointValue] + 1;
				}

				let tmpMutatedValues = this.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpSeriesStepDataSourceObject, tmpResultsObject, tmpManifest);
				tmpMonteCarloOutput.Samples.push( this.solvePostfixedExpression( tmpResultsObject.PostfixSolveList, tmpDataDestinationObject, tmpResultsObject, tmpManifest ) );

				for (let j = 0; j < tmpMutatedValues.length; j++)
				{
					tmpMutatedValues[j].Resolved = false;
				}
			}

			// Do the assignment
			let tmpAssignmentManifestHash = tmpResultsObject.PostfixedAssignmentAddress;
			if ((tmpResultsObject.OriginalRawTokens[1] === '=') && (typeof(tmpResultsObject.OriginalRawTokens[0]) === 'string') && (tmpResultsObject.OriginalRawTokens[0].length > 0))
			{
				tmpAssignmentManifestHash = tmpResultsObject.OriginalRawTokens[0];
			}

			tmpManifest.setValueByHash(tmpDataDestinationObject, tmpAssignmentManifestHash, tmpMonteCarloOutput);

			return tmpMonteCarloOutput;
		}
		else // For 'SOLVE' or anything else that didn't work
		{
			// This is where the data from variables gets marshaled into their symbols (from AppData or the like)
			this.substituteValuesInTokenizedObjects(tmpResultsObject.PostfixTokenObjects, tmpDataSourceObject, tmpResultsObject, pManifest);
			// Finally this is the expr solving method, which returns a string and also marshals it into tmpDataDestinationObject
			return this.solvePostfixedExpression(tmpResultsObject.PostfixSolveList, tmpDataDestinationObject, tmpResultsObject, pManifest);
		}
	}
}

module.exports = FableServiceExpressionParser;
