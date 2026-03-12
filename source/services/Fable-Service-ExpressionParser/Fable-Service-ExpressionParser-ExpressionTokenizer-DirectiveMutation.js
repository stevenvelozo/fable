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
				'MONTECARLO': { Name: 'Monte Carlo Simulation', SampleCount: '1', Code: 'MONTECARLO', Values: {} },
				'MAP': { Name: 'Map', Code: 'MAP', Values: {}, ValueKeys: [] },
				'MULTIROWMAP': { Name: 'Multi-Row Map', Code: 'MULTIROWMAP', RowsAddress: null, SeriesStart: null, SeriesStep: null, Values: {}, ValueKeys: [] },
			});

		this.defaultDirective = this.directiveTypes.SOLVE;
	}

	parseSeriesDirective(pTokens)
	{
		// This isn't a fancy real parse it's just taking words and stealing values after them.
		let tmpNewSeriesDirectiveDescription = JSON.parse(JSON.stringify(this.directiveTypes.SERIES));

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

	parseMonteCarloDirective(pTokens)
	{
		// This isn't a fancy real parse it's just taking words and stealing values after them.
		let tmpNewMonteCarloDirectiveDescription = JSON.parse(JSON.stringify(this.directiveTypes.MONTECARLO));

		for (let i = 0; i < pTokens.length; i++)
		{
			let tmpToken = pTokens[i].toUpperCase();
			switch(tmpToken)
			{
				case 'SAMPLECOUNT':
					if ((i + 1) < pTokens.length)
					{
						tmpNewMonteCarloDirectiveDescription.SampleCount = pTokens[i + 1];
					}
					i = i + 1;
					break;

				case 'VARIABLE':
				case 'VAR':
				case 'V':
					if ((i + 1) < pTokens.length)
					{
						let tmpVariableToken = pTokens[i + 1];
						if (typeof(tmpVariableToken) === 'string' && (tmpVariableToken.length > 0))
						{
							tmpNewMonteCarloDirectiveDescription.Values[tmpVariableToken] =
							{
								Token: tmpVariableToken,
								Easing: 'Linear', // could be parametric, logarithmic, bezier, uniform, normal, etc.
								Points: [] // array of values for points to generate between.
							}
						}
					}
					i = i + 1;
					break;

				case 'POINT':
				case 'PT':
				case 'P':
					if (pTokens.length < i + 2)
					{
						continue;
					}

					let tmpTokenIndexSkip = 2;
					let tmpVariableToken = pTokens[i + 1];
					if (tmpVariableToken in tmpNewMonteCarloDirectiveDescription.Values)
					{
						let tmpVariableValueString = pTokens[i + 2];
						if ((tmpVariableValueString == '-') || (tmpVariableValueString == '+'))
						{
							if (pTokens.length < i + 3)
							{
								continue;
							}
							tmpVariableValueString = tmpVariableValueString + pTokens[i + 3];
							tmpTokenIndexSkip = 3;
						}
						let tmpVariableValue = this.fable.Math.parsePrecise(tmpVariableValueString, NaN);
						if (!isNaN(tmpVariableValue))
						{
							tmpNewMonteCarloDirectiveDescription.Values[tmpVariableToken].Points.push(tmpVariableValue);
						}
					}
					i = i + tmpTokenIndexSkip;
					break;

				case 'EASING':
					if (pTokens.length < i + 2)
					{
						continue;
					}

					tmpVariableToken = pTokens[i + 1];
					let tmpEasingType = pTokens[i + 2].toUpperCase();
					if (tmpVariableToken in tmpNewMonteCarloDirectiveDescription.Values)
					{
						tmpNewMonteCarloDirectiveDescription.Values[tmpVariableToken].Easing = tmpEasingType;
					}
					i = i + 2;
					break;

				default:
					// Ignore other tokens
					break;
			}
		}

		return tmpNewMonteCarloDirectiveDescription;
	}

	parseMapDirective(pTokens)
	{
		// This isn't a fancy real parse it's just taking words and stealing values after them.
		let tmpNewMapDirectiveDescription = JSON.parse(JSON.stringify(this.directiveTypes.MAP));

		for (let i = 0; i < pTokens.length; i++)
		{
			let tmpToken = pTokens[i].toUpperCase();
			switch(tmpToken)
			{
				case 'VARIABLE':
				case 'VAR':
				case 'V':
					if (((i + 3) < pTokens.length) && (pTokens[i+2].toUpperCase() == 'FROM'))
					{
						let tmpVariableToken = pTokens[i + 1];
						if (typeof(tmpVariableToken) === 'string' && (tmpVariableToken.length > 0))
						{
							tmpNewMapDirectiveDescription.ValueKeys.push(tmpVariableToken);
							tmpNewMapDirectiveDescription.Values[tmpVariableToken] =
							{
								Token: tmpVariableToken,
								Address: pTokens[i + 3],
							}
						}
						i = i + 3;
					}
					break;

				default:
					// Ignore other tokens
					break;
			}
		}

		return tmpNewMapDirectiveDescription;
	}

	parseMultiRowMapDirective(pTokens)
	{
		// Parse MULTIROWMAP directive tokens.
		// Syntax: MULTIROWMAP ROWS FROM <address> [SERIESSTART <n>] [SERIESSTEP <n>] VAR <name> FROM <property> OFFSET <n> DEFAULT <defaultValue> ...
		// OFFSET defaults to 0 (current row) if not specified.
		// DEFAULT defaults to '0' if not specified.
		// OFFSET 0 = current row, OFFSET -1 = previous row, OFFSET -2 = two rows back, etc.
		// Positive OFFSET values look forward (e.g., OFFSET 1 = next row, OFFSET 2 = two rows ahead).
		// SERIESSTART defaults to 0 (first row). Negative values count from the end (e.g., -2 = second-to-last row).
		// SERIESSTEP defaults to 1. Use -1 to iterate backwards through rows.
		let tmpNewDirectiveDescription = JSON.parse(JSON.stringify(this.directiveTypes.MULTIROWMAP));

		for (let i = 0; i < pTokens.length; i++)
		{
			let tmpToken = pTokens[i].toUpperCase();
			switch(tmpToken)
			{
				case 'ROWS':
					// Expect ROWS FROM <address>
					if (((i + 2) < pTokens.length) && (pTokens[i + 1].toUpperCase() === 'FROM'))
					{
						tmpNewDirectiveDescription.RowsAddress = pTokens[i + 2];
						i = i + 2;
					}
					break;

				case 'SERIESSTART':
					if ((i + 1) < pTokens.length)
					{
						// Handle negative values which get tokenized as separate - and number tokens
						let tmpStartValue = pTokens[i + 1];
						if ((tmpStartValue === '-') && ((i + 2) < pTokens.length))
						{
							tmpStartValue = '-' + pTokens[i + 2];
							i = i + 2;
						}
						else
						{
							i = i + 1;
						}
						tmpNewDirectiveDescription.SeriesStart = tmpStartValue;
					}
					break;

				case 'SERIESSTEP':
					if ((i + 1) < pTokens.length)
					{
						// Handle negative values which get tokenized as separate - and number tokens
						let tmpStepValue = pTokens[i + 1];
						if ((tmpStepValue === '-') && ((i + 2) < pTokens.length))
						{
							tmpStepValue = '-' + pTokens[i + 2];
							i = i + 2;
						}
						else
						{
							i = i + 1;
						}
						tmpNewDirectiveDescription.SeriesStep = tmpStepValue;
					}
					break;

				case 'VARIABLE':
				case 'VAR':
				case 'V':
					// Expect: VAR <name> FROM <property> [OFFSET <n>] [DEFAULT <defaultValue>]
					if (((i + 3) < pTokens.length) && (pTokens[i + 2].toUpperCase() === 'FROM'))
					{
						let tmpVariableName = pTokens[i + 1];
						let tmpProperty = pTokens[i + 3];

						if (typeof(tmpVariableName) === 'string' && (tmpVariableName.length > 0))
						{
							let tmpVariableDescriptor = {
								Token: tmpVariableName,
								Property: tmpProperty,
								RowOffset: 0,
								Default: '0',
							};

							let tmpCurrentIndex = i + 3;

							// Scan forward for OFFSET and DEFAULT in any order
							while (tmpCurrentIndex + 1 < pTokens.length)
							{
								let tmpNextToken = pTokens[tmpCurrentIndex + 1].toUpperCase();
								if (tmpNextToken === 'OFFSET')
								{
									if (tmpCurrentIndex + 2 < pTokens.length)
									{
										// Handle negative offsets which get tokenized as separate - and number tokens
										let tmpOffsetValue = pTokens[tmpCurrentIndex + 2];
										if ((tmpOffsetValue === '-') && (tmpCurrentIndex + 3 < pTokens.length))
										{
											tmpOffsetValue = '-' + pTokens[tmpCurrentIndex + 3];
											tmpCurrentIndex = tmpCurrentIndex + 3;
										}
										else
										{
											tmpCurrentIndex = tmpCurrentIndex + 2;
										}
										tmpVariableDescriptor.RowOffset = parseInt(tmpOffsetValue);
										if (isNaN(tmpVariableDescriptor.RowOffset))
										{
											tmpVariableDescriptor.RowOffset = 0;
										}
									}
								}
								else if (tmpNextToken === 'DEFAULT')
								{
									if (tmpCurrentIndex + 2 < pTokens.length)
									{
										// Handle negative defaults which get tokenized as separate - and number tokens
										let tmpDefaultValue = pTokens[tmpCurrentIndex + 2];
										if ((tmpDefaultValue === '-') && (tmpCurrentIndex + 3 < pTokens.length))
										{
											tmpDefaultValue = '-' + pTokens[tmpCurrentIndex + 3];
											tmpCurrentIndex = tmpCurrentIndex + 3;
										}
										else
										{
											tmpCurrentIndex = tmpCurrentIndex + 2;
										}
										tmpVariableDescriptor.Default = tmpDefaultValue;
									}
								}
								else
								{
									// Not a recognized sub-keyword for this variable; stop scanning
									break;
								}
							}

							i = tmpCurrentIndex;

							tmpNewDirectiveDescription.ValueKeys.push(tmpVariableName);
							tmpNewDirectiveDescription.Values[tmpVariableName] = tmpVariableDescriptor;
						}
					}
					break;

				default:
					// Ignore other tokens
					break;
			}
		}

		return tmpNewDirectiveDescription;
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
					//this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);

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
						case 'MONTECARLO':
							tmpResults.SolverDirectives = this.parseMonteCarloDirective(tmpResults.SolverDirectiveTokens);
							break;
						case 'MAP':
							tmpResults.SolverDirectives = this.parseMapDirective(tmpResults.SolverDirectiveTokens);
							break;
						case 'MULTIROWMAP':
							tmpResults.SolverDirectives = this.parseMultiRowMapDirective(tmpResults.SolverDirectiveTokens);
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
