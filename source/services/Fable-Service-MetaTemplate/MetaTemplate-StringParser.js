/**
* MetaTemplate String Parser
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

			Pattern: false,

			PatternMatch: false,
			PatternMatchOutputBuffer: ''
		});
	}

	/**
	 * Assign a node of the parser tree to be the next potential match.
	 * If the node has a PatternEnd property, it is a valid match and supercedes the last valid match (or becomes the initial match).
	 * @method assignNode
	 * @param {Object} pNode - A node on the parse tree to assign
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	assignNode (pNode, pParserState)
	{
		pParserState.PatternMatch = pNode;

		// If the pattern has a END we can assume it has a parse function...
		if (pParserState.PatternMatch.hasOwnProperty('PatternEnd'))
		{
			// ... this is the legitimate start of a pattern.
			pParserState.Pattern = pParserState.PatternMatch;
		}
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

	/**
	 * Check if the pattern has ended.  If it has, properly flush the buffer and start looking for new patterns.
	 * @method checkPatternEnd
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	checkPatternEnd (pParserState, pData)
	{
		if ((pParserState.OutputBuffer.length >= pParserState.Pattern.PatternEnd.length+pParserState.Pattern.PatternStart.length) &&
			(pParserState.OutputBuffer.substr(-pParserState.Pattern.PatternEnd.length) === pParserState.Pattern.PatternEnd))
		{
			// ... this is the end of a pattern, cut off the end tag and parse it.
			// Trim the start and end tags off the output buffer now
			if (pParserState.Pattern.isAsync)
			{
				console.log(`Precedent ERROR: Async template detected for pattern ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd} but the template engine is being run in non-async mode.`);
				this.OutputBuffer = '';
				// Flush the output buffer.
				this.flushOutputBuffer(pParserState);
				// End pattern mode
				pParserState.Pattern = false;
				pParserState.PatternMatch = false;
			}
			else
			{
				pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStart.length+pParserState.Pattern.PatternEnd.length)), pData);
				// Flush the output buffer.
				this.flushOutputBuffer(pParserState);
				// End pattern mode
				pParserState.Pattern = false;
				pParserState.PatternMatch = false;
			}
		}
	}

	checkPatternEndAsync (pParserState, pData, fCallback)
	{
		if ((pParserState.OutputBuffer.length >= pParserState.Pattern.PatternEnd.length+pParserState.Pattern.PatternStart.length) &&
			(pParserState.OutputBuffer.substr(-pParserState.Pattern.PatternEnd.length) === pParserState.Pattern.PatternEnd))
		{
			// ... this is the end of a pattern, cut off the end tag and parse it.
			// Trim the start and end tags off the output buffer now
			if (pParserState.Pattern.isAsync)
			{
				return pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStart.length+pParserState.Pattern.PatternEnd.length)), pData,
					(pError, pAsyncOutput) =>
					{
						if (pError)
						{
							console.log(`Precedent ERROR: Async template error happened parsing ${pParserState.Pattern.PatternStart} ... ${pParserState.Pattern.PatternEnd}: ${pError}`);
						}

						pParserState.OutputBuffer = pAsyncOutput;
						// Flush the output buffer.
						this.flushOutputBuffer(pParserState);
						// End pattern mode
						pParserState.Pattern = false;
						pParserState.PatternMatch = false;

						return fCallback();
					});
			}
			else
			{
				pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStart.length+pParserState.Pattern.PatternEnd.length)), pData);
				// Flush the output buffer.
				this.flushOutputBuffer(pParserState);
				// End pattern mode
				pParserState.Pattern = false;
				pParserState.PatternMatch = false;
			}
		}

		return fCallback();
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
		// (1) If we aren't in a pattern match, and we aren't potentially matching, and this may be the start of a new pattern....
		if (!pParserState.PatternMatch && pParserState.ParseTree.hasOwnProperty(pCharacter))
		{
			// ... assign the node as the matched node.
			this.assignNode(pParserState.ParseTree[pCharacter], pParserState);
			this.appendOutputBuffer(pCharacter, pParserState);
		}
		// (2) If we are in a pattern match (actively seeing if this is part of a new pattern token)
		else if (pParserState.PatternMatch)
		{
			// If the pattern has a subpattern with this key
			if (pParserState.PatternMatch.hasOwnProperty(pCharacter))
			{
				// Continue matching patterns.
				this.assignNode(pParserState.PatternMatch[pCharacter], pParserState);
			}
			this.appendOutputBuffer(pCharacter, pParserState);
			if (pParserState.Pattern)
			{
				// ... Check if this is the end of the pattern (if we are matching a valid pattern)...
				this.checkPatternEnd(pParserState, pData);
			}
		}
		// (3) If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
		else
		{
			pParserState.Output += pCharacter;
		}
	}

	parseCharacterAsync (pCharacter, pParserState, pData, fCallback)
	{
		// (1) If we aren't in a pattern match, and we aren't potentially matching, and this may be the start of a new pattern....
		if (!pParserState.PatternMatch && pParserState.ParseTree.hasOwnProperty(pCharacter))
		{
			// ... assign the node as the matched node.
			this.assignNode(pParserState.ParseTree[pCharacter], pParserState);
			this.appendOutputBuffer(pCharacter, pParserState);
		}
		// (2) If we are in a pattern match (actively seeing if this is part of a new pattern token)
		else if (pParserState.PatternMatch)
		{
			// If the pattern has a subpattern with this key
			if (pParserState.PatternMatch.hasOwnProperty(pCharacter))
			{
				// Continue matching patterns.
				this.assignNode(pParserState.PatternMatch[pCharacter], pParserState);
			}
			this.appendOutputBuffer(pCharacter, pParserState);
			if (pParserState.Pattern)
			{
				// ... Check if this is the end of the pattern (if we are matching a valid pattern)...
				return this.checkPatternEndAsync(pParserState, pData, fCallback);
			}
		}
		// (3) If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
		else
		{
			pParserState.Output += pCharacter;
		}

		return fCallback(null);
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
