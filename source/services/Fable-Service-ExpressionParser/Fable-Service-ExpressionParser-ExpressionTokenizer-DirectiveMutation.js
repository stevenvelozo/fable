const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');

class ExpressionTokenizerDirectiveMutation extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'ExpressionParser-TokenizerDirectiveMutation';

		this.directiveTypes = (
			{
				'SOLVE': { Name: 'Solve Expression', Code: 'SOLVE' },
				'SERIES': { Name: 'Series', Code: 'SERIES', From: null, To: null, Step: null },
				'MONTECARLO': { Name: 'Monte Carlo Simulation', Code: 'MONTECARLO', Iterations: null, Values: {} }
			});
		
		this.defaultDirective = this.directiveTypes.SOLVE;
	}

	parseSeriesDirective(pTokens)
	{
		// This isn't a fancy real parse it's just taking words and stealing values after them.
		let tmpNewSeriesDirectiveDescription = Object.assign({}, this.directiveTypes.SERIES);

		for (let i = 0; i < pTokens.length; i++)
		{
			let tmpToken = pTokens[i].toUpperCase();
			switch(tmpToken)
			{
				case 'FROM':
					if ((i + 1) < pTokens.length)
					{
						tmpNewSeriesDirectiveDescription.From = pTokens[i + 1];
					}
					break;

				case 'TO':
					if ((i + 1) < pTokens.length)
					{
						tmpNewSeriesDirectiveDescription.To = pTokens[i + 1];
					}
					break;

				case 'STEP':
					if ((i + 1) < pTokens.length)
					{
						tmpNewSeriesDirectiveDescription.Step = pTokens[i + 1];
					}
					break;

				default:
					// Ignore other tokens
					break;
			}
		}

		return tmpNewSeriesDirectiveDescription;
	}

	parseDirectives(pResultObject)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		tmpResults.SolverDirectives = this.defaultDirective;
		tmpResults.SolverDirectiveTokens = [];

		if (tmpResults.RawTokens.length < 2)
		{
			tmpResults.ExpressionParserLog.push(`ExpressionParser.tokenizeDirectiveMutation postprocessor received insufficient tokens to process directives.`);
			this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return tmpResults.SolverDirectives;
		}

		// Enumerate each of the tmpResults.RawTokens to see if one of the values in the directiveTypeMap exists and is either at the beginning or after the assignment (= or ?=) operator
		for (let i = 0; i < tmpResults.RawTokens.length; i++)
		{
			let tmpToken = tmpResults.RawTokens[i].toUpperCase();
			if (tmpToken in this.directiveTypes)
			{
				// Check if it's at the beginning or after an assignment operator
				// FIXME: This is hard coded assignment operators which is bad juju
				if ((i === 0) || (tmpResults.RawTokens[i-1] === '=') || (tmpResults.RawTokens[i-1] === '?='))
				{
					// We have a directive!
					tmpResults.SolverDirectives.Type = this.directiveTypes[tmpToken];

					tmpResults.ExpressionParserLog.push(`ExpressionParser.tokenizeDirectiveMutation identified solver directive: ${tmpToken}`);
					this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);

					// Extract the Directive name and everything else from it up until the : token
					let tmpDirectiveTokenStartIndex = i;
					let tmpDirectiveTokenEndIndex = -1;
					for (let j = tmpDirectiveTokenStartIndex + 1; j < tmpResults.RawTokens.length; j++)
					{
						if (tmpResults.RawTokens[j] === ':')
						{
							tmpDirectiveTokenEndIndex = j;
							break;
						}
					}

					// If the directive token end is not in the expression we don't know what to do
					if (tmpDirectiveTokenEndIndex === -1)
					{
						tmpResults.ExpressionParserLog.push(`ExpressionParser.tokenizeDirectiveMutation could not find the end of the directive token set for directive: ${tmpToken}`);
						this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						continue;
					}

					// Set the tmpResults.SolverDirectiveTokens to the slice of tokens that represent the directive
					tmpResults.SolverDirectiveTokens = tmpResults.RawTokens.slice(tmpDirectiveTokenStartIndex, tmpDirectiveTokenEndIndex);

					// Remove the directive tokens and the assignment to the left of it from the array of raw tokens
					// the colonoscopy if you will
					tmpResults.RawTokens.splice(0, tmpDirectiveTokenEndIndex + 1);		

					// Further parsing based on directive type could go here
					// e.g. parseSeriesDirective for SERIES, etc.
					switch(tmpToken)
					{
						case 'SERIES':
							tmpResults.SolverDirectives = this.parseSeriesDirective(tmpResults.SolverDirectiveTokens);
							break;
						default:
							// No further parsing needed
							break;
					}
				}
			}
		}

		return tmpResults.SolverDirectives;
	}
}

module.exports = ExpressionTokenizerDirectiveMutation;