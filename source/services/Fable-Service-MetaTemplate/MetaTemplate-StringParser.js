/**
* String Parser
* @author      Steven Velozo <steven@velozo.com>
* @description Parse a string, properly processing each matched token in the word tree.
*/

class StringParser
{
	/**
	 * StringParser Constructor
	 */
	constructor(fEachLimit)
	{
		this.eachLimit = fEachLimit;
	}

	/**
	 * Create a fresh parsing state object to work with.
	 * @method newParserState
	 * @param {Object} pParseTree - A node on the parse tree to begin parsing from (usually root)
	 * @return {Object} A new parser state object for running a character parser on
	 * @private
	 */
	newParserState (pParseTree)
	{
		return (
		{
			ParseTree: pParseTree,

			Asynchronous: false,

			Output: '',
			OutputBuffer: '',

			Pattern: {},

			PatternMatch: false,
			PatternMatchEnd: false
		});
	}

	/**
	 * Append a character to the output buffer in the parser state.
	 * This output buffer is used when a potential match is being explored, or a match is being explored.
	 * @method appendOutputBuffer
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	appendOutputBuffer (pCharacter, pParserState)
	{
		pParserState.OutputBuffer += pCharacter;
	}

	/**
	 * Flush the output buffer to the output and clear it.
	 * @method flushOutputBuffer
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	flushOutputBuffer (pParserState)
	{
		pParserState.Output += pParserState.OutputBuffer;
		pParserState.OutputBuffer = '';
	}

	resetOutputBuffer (pParserState)
	{
		// Flush the output buffer.
		this.flushOutputBuffer(pParserState);
		// End pattern mode
		pParserState.Pattern = false;
		pParserState.PatternStartNode = false;
		pParserState.StartPatternMatchComplete = false;
		pParserState.EndPatternMatchBegan = false;
		pParserState.PatternMatch = false;

		return true;
	}

	/**
	 * Parse a character in the buffer.
	 * @method parseCharacter
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	parseCharacter (pCharacter, pParserState, pData)
	{
		// If we are already in a pattern match traversal
		if (pParserState.PatternMatch)
		{
			// If the pattern is still matching the start and we haven't passed the buffer
			if (!pParserState.StartPatternMatchComplete && pParserState.Pattern.hasOwnProperty(pCharacter))
			{
				pParserState.Pattern = pParserState.Pattern[pCharacter];
				this.appendOutputBuffer(pCharacter, pParserState);
			}
			else if (pParserState.EndPatternMatchBegan)
			{
				if (pParserState.Pattern.PatternEnd.hasOwnProperty(pCharacter))
				{
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// Flush the output buffer.
					this.appendOutputBuffer(pCharacter, pParserState);
					// If this last character is the end of the pattern, parse it.
					if (pParserState.Pattern.hasOwnProperty('Parse') && (!pParserState.Pattern.isAsync || pParserState.Pattern.isBoth))
					{
						// Run the function
						pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData);
						return this.resetOutputBuffer(pParserState);
					}
					else
					{
						console.log(`MetaTemplate: The pattern ${pParserState.Pattern.PatternStartString} is asynchronous and cannot be used in a synchronous parser.`);
						return this.resetOutputBuffer(pParserState);
					}
				}
				else if (pParserState.PatternStartNode.PatternEnd.hasOwnProperty(pCharacter))
				{
					// We broke out of the end -- see if this is a new start of the end.
					pParserState.Pattern = pParserState.PatternStartNode.PatternEnd[pCharacter];
					this.appendOutputBuffer(pCharacter, pParserState);
				}
				else
				{
					pParserState.EndPatternMatchBegan = false;
					this.appendOutputBuffer(pCharacter, pParserState);
				}
			}
			else if (pParserState.Pattern.hasOwnProperty('PatternEnd'))
			{
				if (!pParserState.StartPatternMatchComplete)
				{
					pParserState.StartPatternMatchComplete = true;
					pParserState.PatternStartNode = pParserState.Pattern;
				}

				this.appendOutputBuffer(pCharacter, pParserState);

				if (pParserState.Pattern.PatternEnd.hasOwnProperty(pCharacter))
				{
					// This is the first character of the end pattern.
					pParserState.EndPatternMatchBegan = true;
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// If this last character is the end of the pattern, parse it.
					if (pParserState.Pattern.hasOwnProperty('Parse'))
					{
						if (pParserState.Pattern.isAsync && !pParserState.Pattern.isBoth)
						{
							console.log(`MetaTemplate: The pattern ${pParserState.Pattern.PatternStartString} is asynchronous and cannot be used in a synchronous parser.`);
							this.resetOutputBuffer(pParserState);
						}
						else
						{
							// Run the t*mplate function
							pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData);
							return this.resetOutputBuffer(pParserState);
						}
					}
				}
			}
			else
			{
				// We are in a pattern start but didn't match one; reset and start trying again from this character.
				this.resetOutputBuffer(pParserState);
			}
		}
		// If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
		if (!pParserState.PatternMatch)
		{
			// This may be the start of a new pattern....
			if (pParserState.ParseTree.hasOwnProperty(pCharacter))
			{
				// ... assign the root node as the matched node.
				this.resetOutputBuffer(pParserState);
				this.appendOutputBuffer(pCharacter, pParserState);
				pParserState.Pattern = pParserState.ParseTree[pCharacter];
				pParserState.PatternMatch = true;
				return true;
			}
			else
			{
				this.appendOutputBuffer(pCharacter, pParserState);
			}
		}
		return false;
	}

	/**
	 * Parse a character in the buffer.
	 * @method parseCharacter
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	parseCharacterAsync (pCharacter, pParserState, pData, fCallback)
	{
		// If we are already in a pattern match traversal
		if (pParserState.PatternMatch)
		{
			// If the pattern is still matching the start and we haven't passed the buffer
			if (!pParserState.StartPatternMatchComplete && pParserState.Pattern.hasOwnProperty(pCharacter))
			{
				pParserState.Pattern = pParserState.Pattern[pCharacter];
				this.appendOutputBuffer(pCharacter, pParserState);
			}
			else if (pParserState.EndPatternMatchBegan)
			{
				if (pParserState.Pattern.PatternEnd.hasOwnProperty(pCharacter))
				{
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// Flush the output buffer.
					this.appendOutputBuffer(pCharacter, pParserState);
					// If this last character is the end of the pattern, parse it.
					if (pParserState.Pattern.hasOwnProperty('Parse'))
					{
						// ... this is the end of a pattern, cut off the end tag and parse it.
						// Trim the start and end tags off the output buffer now
						if (pParserState.Pattern.isAsync && !pParserState.Pattern.isBoth)
						{
							// Run the function
							return pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData,
								(pError, pAsyncOutput) =>
								{
									if (pError)
									{
										console.log(`Precedent ERROR: Async template error happened parsing ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd}: ${pError}`);
									}

									pParserState.OutputBuffer = pAsyncOutput;
									this.resetOutputBuffer(pParserState);
									return fCallback();
								});
						}
						else if (pParserState.Pattern.isAsync && pParserState.Pattern.isBoth)
						{
							// Run the function when both async and non async were provided with the pattern
							return pParserState.Pattern.ParseAsync(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData,
								(pError, pAsyncOutput) =>
								{
									if (pError)
									{
										console.log(`Precedent ERROR: Async template error happened parsing ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd}: ${pError}`);
									}

									pParserState.OutputBuffer = pAsyncOutput;
									this.resetOutputBuffer(pParserState);
									return fCallback();
								});
						}
						else
						{
							// Run the t*mplate function
							pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData);
							this.resetOutputBuffer(pParserState);
							return fCallback();
						}
					}
				}
				else if (pParserState.PatternStartNode.PatternEnd.hasOwnProperty(pCharacter))
				{
					// We broke out of the end -- see if this is a new start of the end.
					pParserState.Pattern = pParserState.PatternStartNode.PatternEnd[pCharacter];
					this.appendOutputBuffer(pCharacter, pParserState);
				}
				else
				{
					pParserState.EndPatternMatchBegan = false;
					this.appendOutputBuffer(pCharacter, pParserState);
				}
			}
			else if (pParserState.Pattern.hasOwnProperty('PatternEnd'))
			{
				if (!pParserState.StartPatternMatchComplete)
				{
					pParserState.StartPatternMatchComplete = true;
					pParserState.PatternStartNode = pParserState.Pattern;
				}

				this.appendOutputBuffer(pCharacter, pParserState);

				if (pParserState.Pattern.PatternEnd.hasOwnProperty(pCharacter))
				{
					// This is the first character of the end pattern.
					pParserState.EndPatternMatchBegan = true;
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// If this last character is the end of the pattern, parse it.
					if (pParserState.Pattern.hasOwnProperty('Parse'))
					{
						// ... this is the end of a pattern, cut off the end tag and parse it.
						// Trim the start and end tags off the output buffer now
						if (pParserState.Pattern.isAsync)
						{
							// Run the function
							return pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData,
								(pError, pAsyncOutput) =>
								{
									if (pError)
									{
										console.log(`Precedent ERROR: Async template error happened parsing ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd}: ${pError}`);
									}

									pParserState.OutputBuffer = pAsyncOutput;
									this.resetOutputBuffer(pParserState);
									return fCallback();
								});
						}
						else
						{
							// Run the t*mplate function
							pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData);
							this.resetOutputBuffer(pParserState);
							return fCallback();
						}
					}
				}
			}
			else
			{
				// We are in a pattern start but didn't match one; reset and start trying again from this character.
				this.resetOutputBuffer(pParserState);
				return fCallback();
			}
		}
		// If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
		if (!pParserState.PatternMatch)
		{
			// This may be the start of a new pattern....
			if (pParserState.ParseTree.hasOwnProperty(pCharacter))
			{
				// ... assign the root node as the matched node.
				this.resetOutputBuffer(pParserState);
				this.appendOutputBuffer(pCharacter, pParserState);
				pParserState.Pattern = pParserState.ParseTree[pCharacter];
				pParserState.PatternMatch = true;
			}
			else
			{
				this.appendOutputBuffer(pCharacter, pParserState);
			}
		}
		return fCallback();
	}

	/**
	 * Parse a string for matches, and process any template segments that occur.
	 * @method parseString
	 * @param {string} pString - The string to parse.
	 * @param {Object} pParseTree - The parse tree to begin parsing from (usually root)
	 * @param {Object} pData - The data to pass to the function as a second parameter
	 * @param {function} fCallback - The callback function to call when the parse is complete
	 */
	parseString (pString, pParseTree, pData, fCallback)
	{
		if (typeof(fCallback) !== 'function')
		{
			let tmpParserState = this.newParserState(pParseTree);

			for (var i = 0; i < pString.length; i++)
			{
				// TODO: This is not fast.
				this.parseCharacter(pString[i], tmpParserState, pData, fCallback);
			}

			this.flushOutputBuffer(tmpParserState);

			return tmpParserState.Output;
		}
		else
		{
			// This is the async mode
			let tmpParserState = this.newParserState(pParseTree);
			tmpParserState.Asynchronous = true;

			this.eachLimit(pString, 1,
				(pCharacter, fCharacterCallback) =>
				{
					this.parseCharacterAsync(pCharacter, tmpParserState, pData, fCharacterCallback);
				},
				(pError) =>
				{
					// Flush the remaining data
					this.flushOutputBuffer(tmpParserState);
					fCallback(pError, tmpParserState.Output);
				});

		}
	}
}

module.exports = StringParser;
