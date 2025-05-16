const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');

class ExpressionTokenizer extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'ExpressionParser-Tokenizer';
	}

	tokenize(pExpression, pResultObject)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		tmpResults.RawExpression = pExpression;
		tmpResults.RawTokens = [];
		tmpResults.ExpressionParserLog = [];

		if (typeof(pExpression) !== 'string')
		{
			this.log.warn('ExpressionParser.tokenize was passed a non-string expression.');
			return tmpResults.RawTokens;
		}

		/* Tokenize the expression
		 *
		 * Current token types:
		 * 	- Value
		 *    : could be a symbol representation e.g. "x", "depth", "Cost", etc. --- symbol representations are looked up first as manifest hashes
		 *    : could be a number e.g. "5", "3.14159", etc.
		 *    : could be a function name e.g. sin(x), sqrt(3+5) where sin or sqrt are known function names
		 *  - StateAddress
		 *    : these are always wrapped in squiggly brackets
		 *    : e.g. {Moisture.Percentage}, {Ending.Temperature.Fahrenheit}, {AppData.Download.Size}, etc.
		 *  - Token
		 *    : could be an operator e.g. "+", "-", "*", "/"
		 *    : could be a parenthesis e.g. "(", ")"
		 *  - String
		 *    : Wrapped in double quotes e.g. "Hello World", "This is a test", etc.
		 */
		let tmpCurrentTokenType = false;
		let tmpCurrentToken = '';
		for (let i = 0; i < pExpression.length; i++)
		{
			let tmpCharacter = pExpression[i];

			// [ WHITESPACE ]
			// 1. Space breaks tokens except when we're in an address that's been scoped by a {} or ""
			if ((tmpCharacter === ' ' || tmpCharacter === '\t') && ((tmpCurrentTokenType !== 'StateAddress') && (tmpCurrentTokenType !== 'String')))
			{
				if (tmpCurrentToken.length > 0)
				{
					tmpResults.RawTokens.push(tmpCurrentToken);
				}
				tmpCurrentToken = '';
				tmpCurrentTokenType = false;
				continue;
			}

			// [ STATE ADDRESS AND STRING BLOCKS ]
			// 2. If we're in an address, we keep going until we hit the closing brace
			if ((tmpCurrentTokenType === 'StateAddress') && (tmpCharacter !== '}'))
			{
				tmpCurrentToken += tmpCharacter;
				continue;
			}
			if ((tmpCurrentTokenType === 'String') && (tmpCharacter !== '"'))
			{
				tmpCurrentToken += tmpCharacter;
				continue;
			}
			// 3. If we're in an address and we hit the closing brace, we close the token, push it and reset
			if ((tmpCurrentTokenType === 'StateAddress') && (tmpCharacter === '}'))
			{
				tmpCurrentToken += tmpCharacter;
				tmpResults.RawTokens.push(tmpCurrentToken);
				tmpCurrentToken = '';
				tmpCurrentTokenType = false;
				continue;
			}
			if ((tmpCurrentTokenType === 'String') && (tmpCharacter === '"'))
			{
				tmpCurrentToken += tmpCharacter;
				tmpResults.RawTokens.push(tmpCurrentToken);
				tmpCurrentToken = '';
				tmpCurrentTokenType = false;
				continue;
			}
			// 4. If we're not in an address and we hit a closing brace it's a problem
			//    TODO: Should we just ignore it?  We do at the moment.
			if (tmpCharacter == '}')
			{
				if (tmpCurrentToken.length > 0)
				{
					tmpResults.RawTokens.push(tmpCurrentToken);
				}
				tmpCurrentToken = '';
				tmpCurrentTokenType = false;
				tmpResults.ExpressionParserLog.push(`ExpressionParser.tokenize found a closing brace without an opening brace in the expression: ${pExpression} at character index ${i}`);
				this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				continue;
			}
			// 5. If we're not in an address and we hit an opening brace, we start an address
			if (tmpCharacter == '{')
			{
				if (tmpCurrentToken.length > 0)
				{
					tmpResults.RawTokens.push(tmpCurrentToken);
				}
				tmpCurrentToken = '';
				tmpCurrentTokenType = 'StateAddress';
				tmpCurrentToken = tmpCharacter;
				continue;
			}
			if ((tmpCurrentTokenType !== 'String') && (tmpCharacter == '"'))
			{
				if (tmpCurrentToken.length > 0)
				{
					tmpResults.RawTokens.push(tmpCurrentToken);
				}
				tmpCurrentToken = '';
				tmpCurrentTokenType = 'String';
				tmpCurrentToken = tmpCharacter;
				continue;
			}

			// [ TOKENS ]
			if (tmpCharacter in this.ExpressionParser.tokenRadix)
			{
				let tmpTokenRadix = this.ExpressionParser.tokenRadix[tmpCharacter];
				// If the token is a literal and has only one entry, it is a single character token and we can just safely add it.
				if (tmpTokenRadix.TokenCount == 1 && tmpTokenRadix.Literal)
				{
					if (tmpCurrentToken.length > 0)
					{
						tmpResults.RawTokens.push(tmpCurrentToken);
					}
					tmpCurrentToken = '';
					tmpCurrentTokenType = false;
					tmpResults.RawTokens.push(tmpCharacter);
					continue;
				}
				else
				{
					// This one has multiple options, so literals don't matter.  We need to check the token map.
					// The token radix TokenKeys array is sorted longest to shortest
					for (let j = 0; j < tmpTokenRadix.TokenKeys.length; j++)
					{
						let tmpTokenKey = tmpTokenRadix.TokenKeys[j];
						if (pExpression.substr(i, tmpTokenKey.length) == tmpTokenKey)
						{
							if (tmpCurrentToken.length > 0)
							{
								tmpResults.RawTokens.push(tmpTokenKey);
							}
							tmpCurrentToken = '';
							tmpCurrentTokenType = false;
							tmpResults.RawTokens.push(tmpTokenKey);
							i += tmpTokenKey.length - 1;
							break;
						}
					}
					continue;
				}
			}

			// If it's not an operator, it's a number or address.
			// At the moment we aren't going to gate it on whether it's a valid address or not
			// Just treat anything not a known token on its own as a value identifier

			/* Per this stack overflow article: https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
			 * We could use a regex but it is slower than the charCodeAt method.
			 * This also doesn't solve the problem of unicode characters, but we won't support those for now.
			 */
			// if (pExpression.charAt(i) == '.')
			// {
			// 	console.log('Found a period')
			// }
			// let tmpCharCode = pExpression.charCodeAt(i);
			// // Match that the character code is any of...
			// if (
			// 	// Number [0-9]
			// 	(tmpCharCode > 47 && tmpCharCode < 58)
			// 	// Upper Case
			// 	|| (tmpCharCode > 64 && tmpCharCode < 91)
			// 	// LOWER CASE
			// 	|| (tmpCharCode > 96 && tmpCharCode < 123)
			// 	)
			// {

				// NOTE: Not having this guard makes a lot of interesting things possible.
			tmpCurrentTokenType = 'Value';
			tmpCurrentToken += tmpCharacter;
			// 	continue;
			// }

			// tmpResults.ExpressionParserLog.push(`ExpressionParser.tokenize found an unknown character code ${tmpCharCode} character ${tmpCharacter} in the expression: ${pExpression} at index ${i}`);
			// this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
		}

		if ((tmpCurrentTokenType) && (tmpCurrentToken.length > 0))
		{
			tmpResults.RawTokens.push(tmpCurrentToken);
		}

		return tmpResults.RawTokens;
	}
}

module.exports = ExpressionTokenizer;