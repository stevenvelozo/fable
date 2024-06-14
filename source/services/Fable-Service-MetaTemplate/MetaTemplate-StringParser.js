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
	constructor(pFable)
	{
		this.fable = pFable;
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
	parseCharacter (pCharacter, pParserState, pData, pDataContext)
	{
		// If we are already in a pattern match traversal
		if (pParserState.PatternMatch)
		{
			// If the pattern is still matching the start and we haven't passed the buffer
			if (!pParserState.StartPatternMatchComplete && (pCharacter in pParserState.Pattern))
			{
				pParserState.Pattern = pParserState.Pattern[pCharacter];
				this.appendOutputBuffer(pCharacter, pParserState);
			}
			else if (pParserState.EndPatternMatchBegan)
			{
				if (pCharacter in pParserState.Pattern.PatternEnd)
				{
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// Flush the output buffer.
					this.appendOutputBuffer(pCharacter, pParserState);
					// If this last character is the end of the pattern, parse it.
					// Run the function
					let tmpFunctionContext = ('ParserContext' in pParserState.Pattern) ? pParserState.Pattern.ParserContext : false;
					if (tmpFunctionContext)
					{
						pParserState.OutputBuffer = pParserState.Pattern.Parse.call(tmpFunctionContext, pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData, pDataContext);
					}
					else
					{
						pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData, pDataContext);
					}
					return this.resetOutputBuffer(pParserState);
				}
				else if (pCharacter in pParserState.PatternStartNode.PatternEnd)
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
			else if ('PatternEnd' in pParserState.Pattern)
			{
				if (!pParserState.StartPatternMatchComplete)
				{
					pParserState.StartPatternMatchComplete = true;
					pParserState.PatternStartNode = pParserState.Pattern;
				}

				this.appendOutputBuffer(pCharacter, pParserState);

				if (pCharacter in pParserState.Pattern.PatternEnd)
				{
					// This is the first character of the end pattern.
					pParserState.EndPatternMatchBegan = true;
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// If this last character is the end of the pattern, parse it.
					if ('Parse' in pParserState.Pattern)
					{
						// Run the t*mplate function
						let tmpFunctionContext = ('ParserContext' in pParserState.Pattern) ? pParserState.Pattern.ParserContext : false;
						if (tmpFunctionContext)
						{
							pParserState.OutputBuffer = pParserState.Pattern.Parse.call(tmpFunctionContext, pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData, pDataContext);
						}
						else
						{
							pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData, pDataContext);
						}
						return this.resetOutputBuffer(pParserState);
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
			if (pCharacter in pParserState.ParseTree)
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

	executePatternAsync(pParserState, pData, fCallback, pDataContext)
	{
		// ... this is the end of a pattern, cut off the end tag and parse it.
		// Trim the start and end tags off the output buffer now
		if (pParserState.Pattern.isAsync)
		{
			// Run the function
			let tmpFunctionContext = ('ParserContext' in pParserState.Pattern) ? pParserState.Pattern.ParserContext : false;
			if (tmpFunctionContext)
			{
				return pParserState.Pattern.ParseAsync.call(tmpFunctionContext, pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData,
					(pError, pAsyncOutput) =>
					{
						if (pError)
						{
							this.fable.log.info(`Precedent ERROR: Async template error happened parsing ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd}: ${pError}`);
						}

						pParserState.OutputBuffer = pAsyncOutput;
						this.resetOutputBuffer(pParserState);
						return fCallback();
					}, pDataContext);
			}
			else
			{
				return pParserState.Pattern.ParseAsync(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData,
					(pError, pAsyncOutput) =>
					{
						if (pError)
						{
							this.fable.log.info(`Precedent ERROR: Async template error happened parsing ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd}: ${pError}`);
						}

						pParserState.OutputBuffer = pAsyncOutput;
						this.resetOutputBuffer(pParserState);
						return fCallback();
					}, pDataContext);
			}
		}
		else
		{
			// Run the t*mplate function
			let tmpFunctionContext = ('ParserContext' in pParserState.Pattern) ? pParserState.Pattern.ParserContext : false;
			if (tmpFunctionContext)
			{
				pParserState.OutputBuffer = pParserState.Pattern.Parse.call(tmpFunctionContext, pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData, pDataContext);
			}
			else
			{
				pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStartString.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStartString.length+pParserState.Pattern.PatternEndString.length)), pData, pDataContext);
			}
			this.resetOutputBuffer(pParserState);
			return fCallback();
		}
	}


	/**
	 * Parse a character in the buffer.
	 * @method parseCharacterAsync
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @param {Object} pData - The data to pass to the function as a second parameter
	 * @param {function} fCallback - The callback function to call when the parse is complete
	 * @param {array} pDataContext - The history of data objects/context already passed in
	 * @private
	 */
	parseCharacterAsync (pCharacter, pParserState, pData, fCallback, pDataContext)
	{
		// If we are already in a pattern match traversal
		if (pParserState.PatternMatch)
		{
			// If the pattern is still matching the start and we haven't passed the buffer
			if (!pParserState.StartPatternMatchComplete && (pCharacter in pParserState.Pattern))
			{
				pParserState.Pattern = pParserState.Pattern[pCharacter];
				this.appendOutputBuffer(pCharacter, pParserState);
			}
			else if (pParserState.EndPatternMatchBegan)
			{
				if (pCharacter in pParserState.Pattern.PatternEnd)
				{
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// Flush the output buffer.
					this.appendOutputBuffer(pCharacter, pParserState);
					// If this last character is the end of the pattern, parse it.
					if ('Parse' in pParserState.Pattern)
					{
						return this.executePatternAsync(pParserState, pData, fCallback, pDataContext);
					}
				}
				else if (pCharacter in pParserState.PatternStartNode.PatternEnd)
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
			else if ('PatternEnd' in pParserState.Pattern)
			{
				if (!pParserState.StartPatternMatchComplete)
				{
					pParserState.StartPatternMatchComplete = true;
					pParserState.PatternStartNode = pParserState.Pattern;
				}

				this.appendOutputBuffer(pCharacter, pParserState);

				if (pCharacter in pParserState.Pattern.PatternEnd)
				{
					// This is the first character of the end pattern.
					pParserState.EndPatternMatchBegan = true;
					// This leaf has a PatternEnd tree, so we will wait until that end is met.
					pParserState.Pattern = pParserState.Pattern.PatternEnd[pCharacter];
					// If this last character is the end of the pattern, parse it.
					if ('Parse' in pParserState.Pattern)
					{
						return this.executePatternAsync(pParserState, pData, fCallback, pDataContext);
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
		else
		{
			// This may be the start of a new pattern....
			if (pCharacter in pParserState.ParseTree)
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
		// Without this, templates of all sizes work fine in node.  They do not in the browser.
		// Trying this out without the timout on non asynchronous template flips.
		return fCallback();
	}

	/**
	 * Parse a string for matches, and process any template segments that occur.
	 * @method parseString
	 * @param {string} pString - The string to parse.
	 * @param {Object} pParseTree - The parse tree to begin parsing from (usually root)
	 * @param {Object} pData - The data to pass to the function as a second parameter
	 * @param {function} fCallback - The callback function to call when the parse is complete
	 * @param {array} pDataContext - The history of data objects/context already passed in
	 */
	parseString (pString, pParseTree, pData, fCallback, pDataContext)
	{
		// TODO: There is danger here if a template function attempts to functionally recurse and doesn't pass this in.
		let tmpPreviousDataContext = (Array.isArray(pDataContext)) ? pDataContext : [];
		let tmpDataContext = Array.from(tmpPreviousDataContext);
		tmpDataContext.push(pData)

		if (typeof(fCallback) !== 'function')
		{
			let tmpParserState = this.newParserState(pParseTree);

			for (var i = 0; i < pString.length; i++)
			{
				// TODO: This is not fast.
				this.parseCharacter(pString[i], tmpParserState, pData, tmpDataContext);
			}

			this.flushOutputBuffer(tmpParserState);

			return tmpParserState.Output;
		}
		else
		{
			// This is the async mode
			let tmpParserState = this.newParserState(pParseTree);
			tmpParserState.Asynchronous = true;

			let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

			for (let i = 0; i < pString.length; i++)
			{
				tmpAnticipate.anticipate(
					(fCallback) =>
					{
						this.parseCharacterAsync(pString[i], tmpParserState, pData, fCallback, tmpDataContext);
					});
			}

			tmpAnticipate.wait(
				(pError) =>
				{
					// Flush the remaining data
					this.flushOutputBuffer(tmpParserState);
					return fCallback(pError, tmpParserState.Output);
				});
		}
	}
}

module.exports = StringParser;
