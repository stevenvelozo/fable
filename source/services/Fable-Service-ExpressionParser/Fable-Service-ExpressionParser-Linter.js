const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');

class ExpressionParserLinter extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'ExpressionParser-Linter';
	}

	lintTokenizedExpression(pTokenizedExpression, pResultObject)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		tmpResults.LinterResults = [];

		// Guard against bad data being passed in
		if (!Array.isArray(pTokenizedExpression))
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.lintTokenizedExpression was passed a non-array tokenized expression.`);
			tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return pTokenizedExpression;
		}
		if (pTokenizedExpression.length < 1)
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.lintTokenizedExpression was passed an empty tokenized expression.`);
			tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return pTokenizedExpression;
		}

		// 1. Check for balanced parenthesis
		let tmpParenthesisDepth = 0;
		// If it is in a state address, we don't care about the parenthesis
		// State addresses are between squiggly brackets
		let tmpInStateAddress = false;
		for (let i = 0; i < pTokenizedExpression.length; i++)
		{
			if ((pTokenizedExpression[i] === '(') && (!tmpInStateAddress))
			{
				tmpParenthesisDepth++;
			}
			if ((pTokenizedExpression[i] === ')') && (!tmpInStateAddress))
			{
				tmpParenthesisDepth--;
			}

			if (pTokenizedExpression[i] === '{')
			{
				tmpInStateAddress = true;
			}
			if (pTokenizedExpression[i] === '}')
			{
				tmpInStateAddress = false;
			}

			if (tmpParenthesisDepth < 0)
			{
				tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.lintTokenizedExpression found an unbalanced parenthesis in the tokenized expression at token index ${i}`);
				tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			}
		}
		if (tmpParenthesisDepth > 0)
		{
			// TODO: Should we add the closing parenthesis?
			tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.lintTokenizedExpression found an unbalanced parenthesis in the tokenized expression (ended without closing last set of parenthesis) -- appropriate closing parenthesis will be added.`);
			tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
		}

		// 2. Check for balanced squiggly braces
		tmpInStateAddress = false;

		for (let i = 0; i < pTokenizedExpression.length; i++)
		{
			if (pTokenizedExpression[i] === '{')
			{
				tmpInStateAddress = true;
			}
			if ((pTokenizedExpression[i] === '}') && (tmpInStateAddress))
			{
				tmpInStateAddress = false;
			}
			if ((pTokenizedExpression[i] === '}') && (!tmpInStateAddress))
			{
				tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.lintTokenizedExpression found an unbalanced closing squiggly brace "}" in the tokenized expression at token index ${i}`);
				tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			}

			if (tmpInStateAddress)
			{
				tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.lintTokenizedExpression found an open squiggly brace in the tokenized expression at index ${i}`);
				tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			}
		}

		// 3. Check for an equality assignment
		let tmpEqualityAssignmentCount = 0;
		let tmpEqualityAssignmentIndex = false;
		for (let i = 0; i < pTokenizedExpression.length; i++)
		{
			if ((this.ExpressionParser.tokenMap[pTokenizedExpression[i]]) && (this.ExpressionParser.tokenMap[pTokenizedExpression[i]].Type === 'Assignment'))
			{
				tmpEqualityAssignmentCount++;
				tmpEqualityAssignmentIndex = i;

				if (tmpEqualityAssignmentCount > 1)
				{
					tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.lintTokenizedExpression found multiple equality assignments in the tokenized expression; equality assignment #${tmpEqualityAssignmentCount} operator '${pTokenizedExpression[i]}' at token index ${i}.`);
					tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				}
			}
		}
		if (tmpEqualityAssignmentCount < 1)
		{
			tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.lintTokenizedExpression found no equality assignment in the tokenized expression.  One called Result will be added automatically.`);
			tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
		}

		// 4. Make sure the equality assignment only has a single value on the other side of it
		//    (no, this is not a magical algebraic solver, do your own simplification)
		//    IF there is only one equality assignment (otherwise we don't even lint this because it's syntax errors all the way down)
		if (tmpEqualityAssignmentCount === 1)
		{
			// If there are exactly three tokens, make sure at least one is an assignable-ish address
			// This can still fail, but we aren't linting all the way into the manifest here; just the expression
			if (pTokenizedExpression.length === 3)
			{
				if (
					// The first token in our expression is a potentially assignable symbol
					(this.getTokenType(pTokenizedExpression[0]) === 'Token.StateAddress') || (this.getTokenType(pTokenizedExpression[2]) === 'Token.Symbol')
					// NOTE: For now we are only going to support assignment to the first symbol in the expression, which seems okay.
					// OR the last token in our expression is a potentially assignable symbol
					//|| (this.getTokenType(pTokenizedExpression[2]) === 'Token.StateAddress') || (this.getTokenType(pTokenizedExpression[0]) === 'Token.Symbol')
					)
				{
					tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.lintTokenizedExpression found a single equality assignment in the tokenized expression with no assignable address on the left side of the assignment.`);
					tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				}
			}
		}

		// 5. Check that there are no operators adjacent to each other
		//    This is a simple lint check, not a full-blown syntax check
		let tmpTokenPrevious = false;
		for (let i = 0; i < pTokenizedExpression.length - 1; i++)
		{
			if ((pTokenizedExpression[i] in this.ExpressionParser.tokenMap) && (this.ExpressionParser.tokenMap[pTokenizedExpression[i]].Type != 'Parenthesis') && !tmpTokenPrevious)
			{
				tmpTokenPrevious = true;
			}
			else if ((pTokenizedExpression[i] in this.ExpressionParser.tokenMap) && (this.ExpressionParser.tokenMap[pTokenizedExpression[i]].Type != 'Parenthesis'))
			{
				// If this isn't a + or - positivity/negativity multiplier, it's an error.
				if ((pTokenizedExpression[i] !== '+') && (pTokenizedExpression[i] !== '-'))
				{
					tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.lintTokenizedExpression found an ${pTokenizedExpression[i]} operator adjacent to another operator in the tokenized expression at token index ${i}`);
					tmpResults.LinterResults.push(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				}
			}
			else
			{
				tmpTokenPrevious = false;
			}
		}

		return tmpResults.LinterResults;
	}
}

module.exports = ExpressionParserLinter;
