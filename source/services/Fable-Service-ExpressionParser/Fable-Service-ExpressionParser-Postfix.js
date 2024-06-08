const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');

class ExpressionParserPostfix extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'ExpressionParser-Postfix';
	}

	getPosfixSolveListOperation(pOperation, pLeftValue, pRightValue, pDepthSolveList, pDepthSolveIndex)
	{
		let tmpOperation = ({
			VirtualSymbolName: pOperation.VirtualSymbolName,
			Operation: pOperation,
			LeftValue: pLeftValue,
			RightValue: pRightValue
		});

		let tmpDepthSolveList = Array.isArray(pDepthSolveList) ? pDepthSolveList : false;

		// // Although we have a `Token.Type == "Parenthesis"` option to check on, keeping these explicit means the solver won't
		// // allow users to pass in parenthesis in the wrong order.
		// // The linter does blow up as does the postfix, but, just in case we'll leave these explicit.
		// // It really doesn't hurt anything.
		// if (pLeftValue.Token === ')')
		// {
		// 	// We have found a close parenthesis which needs to pull the proper virtual symbol for the last operation on this stack.
		// 	// This ensures we are not expressing the parenthesis virtual symbols to the solver.
		// 	pLeftValue.VirtualSymbolName = pLayerStackMap[pLeftValue.SolveLayerStack];
		// 	this.log.error(`ERROR: ExpressionParser.getPosfixSolveListOperation found a close parenthesis in the left value of an operation.`);
		// }
		// else if (pRightValue.Token === '(')
		// {
		// 	// We have found a close parenthesis which needs to pull the proper virtual symbol for the last operation on this stack.
		// 	// This ensures we are not expressing the parenthesis virtual symbols to the solver.
		// 	pRightValue.VirtualSymbolName = pLayerStackMap[pRightValue.SolveLayerStack];
		// 	this.log.error(`ERROR: ExpressionParser.getPosfixSolveListOperation found a close parenthesis in the left value of an operation.`);
		// }

		// // Set the layer stack map virtual symbol name to the last operation performed on this stack.
		// pLayerStackMap[pOperation.SolveLayerStack] = pOperation.VirtualSymbolName;

		/* These two if blocks are very complex -- they basically provide a
		 * way to deal with recursion that can be expressed to the user in
		 * a meaningful way.
		 * 
		 * The reason we are doing it as such is to show exactly how the
		 * solver resolves the passed-in tokens into a solvable expression.
		 */
		if (!tmpOperation.LeftValue.VirtualSymbolName)
		{
			tmpOperation.LeftValue.VirtualSymbolName = tmpOperation.VirtualSymbolName;
		}
		else
		{
			// We need to set the left value to a virtual symbol instead of the looked up value if it's already used in another operation
			tmpOperation.LeftValue = this.getTokenContainerObject(tmpOperation.LeftValue.VirtualSymbolName, 'Token.VirtualSymbol');
			// Now walk backwards and see if we need to update a previous symbol for a previously unparsed operator
			if (tmpDepthSolveList)
			{
				for (let i = pDepthSolveIndex - 1; i >= 0; i--)
				{
					if ((tmpDepthSolveList[i].Type === 'Token.Operator') && (!tmpDepthSolveList[i].Parsed) && 
						// When walking backward, we only want to mutate if the .
						('Descriptor' in tmpDepthSolveList[i]) && ('Descriptor' in tmpOperation.Operation) &&
						// Anything >3 does not have commutative properties
						(tmpDepthSolveList[i].Descriptor.Precedence > 3))
					{
						// If the symbol to its right is not the same as this operation
						if (tmpDepthSolveList[i+1].VirtualSymbolName !== tmpOperation.VirtualSymbolName)
						{
							// This is the recursive "shunting" being simulated
							tmpDepthSolveList[i+1].VirtualSymbolName = tmpOperation.VirtualSymbolName;
						}
						break;
					}
				}
			}
		}
		if (!tmpOperation.RightValue.VirtualSymbolName)
		{
			tmpOperation.RightValue.VirtualSymbolName = tmpOperation.VirtualSymbolName;
		}
		else
		{
			// We need to set the right value to a virtual symbol instead of the looked up value if it's already used in another operation
			tmpOperation.RightValue = this.getTokenContainerObject(tmpOperation.RightValue.VirtualSymbolName, 'Token.VirtualSymbol');
			// Now walk forwards and see if we need to update an upcoming symbol for a previously unparsed operator
			if (tmpDepthSolveList)
			{
				for (let i = pDepthSolveIndex + 1; i < tmpDepthSolveList.length; i++)
				{
					if ((tmpDepthSolveList[i].Type === 'Token.Operator') && (!tmpDepthSolveList[i].Parsed) && 
						// When walking forward, we only want to mutate if the precedence hasn't been solved.
						('Descriptor' in tmpDepthSolveList[i]) && ('Descriptor' in tmpOperation.Operation) &&
						// Anything >3 does not have commutative properties
						(tmpDepthSolveList[i].Descriptor.Precedence > 3))
					{
						// If the symbol to its right is not the same as this operation
						if (tmpDepthSolveList[i-1].VirtualSymbolName !== tmpOperation.VirtualSymbolName)
						{
							// This is the recursive "shunting" being simulated
							tmpDepthSolveList[i-1].VirtualSymbolName = tmpOperation.VirtualSymbolName;
						}
						break;
					}
					else if ((tmpDepthSolveList[i].Type === 'Token.Operator') && (!tmpDepthSolveList[i].Parsed))
					{
						break;
					}
				}
			}
		}

		tmpOperation.Operation.Parsed = true;

		return tmpOperation;
	}

	buildPostfixedSolveList(pTokenizedExpression, pResultObject)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		tmpResults.PostfixedAssignmentAddress = 'Result'
		tmpResults.PostfixTokenObjects = [];
		tmpResults.PostfixSolveList = [];

		if (pTokenizedExpression.length < 3)
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList was passed a tokenized expression with less than three tokens.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return tmpResults.PostfixTokenObjects;
		}

		// 1. Figure out the Equality Assignment
		let tmpEqualsIndex = -1;
		for (let i = 0; i < pTokenizedExpression.length; i++)
		{
			if ((pTokenizedExpression[i] === '=') && (tmpEqualsIndex < 0))
			{
				tmpEqualsIndex = i;
			}
			// If there are two equality assignments, error and bail out.
			else if (pTokenizedExpression[i] === '=')
			{
				tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList found multiple equality assignments in the tokenized expression; equality assignment #${tmpEqualsIndex} at token index ${i}.`);
				this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				return tmpResults.PostfixTokenObjects;
			}
		}

		if (tmpEqualsIndex == -1)
		{
			tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.buildPostfixedSolveList found no equality assignment in the tokenized expression; defaulting to Result`);
			this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
		}
		else if (tmpEqualsIndex > 1)
		{
			tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.buildPostfixedSolveList found an equality assignment in the tokenized expression at an unexpected location (token index ${tmpEqualsIndex}); the expression cannot be parsed.`);
			this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
		}
		else if (tmpEqualsIndex === 0)
		{
			// This is an implicit function -- just go to result and return the value.
			// That is... the user entered something like "= 5 + 3" so we should just return 8, and use the default Result quietly.
		}
		else
		{
			tmpResults.PostfixedAssignmentAddress = pTokenizedExpression[0];
		}

		// 2. Categorize tokens in the expression, put them in the "expression list" as a token object
		for (let i = tmpEqualsIndex + 1; i < pTokenizedExpression.length; i++)
		{
			tmpResults.PostfixTokenObjects.push(this.getTokenContainerObject(pTokenizedExpression[i]));
		}

		// 3. Decorate mathematical parsing depth and detect functions at the same time
		//    Having written this a few times now, it's easier to detect functions *while* parsing depth.
		//    Especially if we want our system to be able to communicate with the user when there is an issue.
		let tmpDepth = 0;
		// The virtual symbol index is used for the abstract interim values that are generated at each step of the solve
		let tmpVirtualParenthesisIndex = 0;
		let tmpSolveLayerStack = [];
		// Kick off the solve layer stack with the first solve set identifier
		tmpSolveLayerStack.push(`SolveSet_${tmpVirtualParenthesisIndex}_D_${tmpDepth}`);
		for (let i = 0; i < tmpResults.PostfixTokenObjects.length; i++)
		{
			// 1. If it's an open parenthesis, set the parenthesis at the current depth and increment the depth
			if (tmpResults.PostfixTokenObjects[i].Token === '(')
			{
				// Set the depth of the open parenthesis to the current solution depth
				tmpResults.PostfixTokenObjects[i].Depth = tmpDepth;
				// Generate the virtual symbol name for user output
				tmpResults.PostfixTokenObjects[i].VirtualSymbolName = `Pr_${tmpVirtualParenthesisIndex}_D_${tmpDepth}`;

				// 1a. Detect if this parenthesis is signaling a function
				//     If the previous token is a Symbol (e.g. it say sin(x) or sqrt(3+5) or something) then the parser will interpret it as a function
				if (i > 0)
				{
					if (tmpResults.PostfixTokenObjects[i-1].Type === 'Token.Symbol')
					{
						// Set the type of this to be a function
						tmpResults.PostfixTokenObjects[i-1].Type = 'Token.Function';
//						tmpResults.PostfixTokenObjects[i-1].Descriptor = this.ExpressionParser.tokenMap[pTokenizedExpression[i-1]];
						// Rename the virtual symbol n ame to include the function
//						tmpResults.PostfixTokenObjects[i].VirtualSymbolName = `Fn_${tmpVirtualParenthesisIndex}_D_${tmpDepth}_${this.fable.DataFormat.cleanNonAlphaCharacters(tmpResults.PostfixTokenObjects[i-1].Token)}`;
						// The function and the parenthesis are at the same depth and virtual symbol
//						tmpResults.PostfixTokenObjects[i-1].VirtualSymbolName = tmpResults.PostfixTokenObjects[i].VirtualSymbolName;
					}
				}

				// Parenthesis manage the solve layer stack
				// For adding a new parenthesis solve layer, we put the parenthesis in the stack we are in and then make all the contained tokens be within the stack of the parenthesis
				tmpResults.PostfixTokenObjects[i].SolveLayerStack = tmpSolveLayerStack[tmpSolveLayerStack.length-1];
				tmpSolveLayerStack.push(tmpResults.PostfixTokenObjects[i].VirtualSymbolName);

				tmpVirtualParenthesisIndex++;
				tmpDepth++;
			}

			// 2. If it's a closed parenthesis, decrease the depth
			else if (tmpResults.PostfixTokenObjects[i].Token === ')')
			{
				tmpDepth--;

				tmpResults.PostfixTokenObjects[i].Depth = tmpDepth;

				// Check to see that the depth of the closed parenthesis is greater than 0
				if (tmpDepth < 0)
				{
					tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList found a closing parenthesis at token index ${i} with no corresponding opening parenthesis.`);
					this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				}

				// Parenthesis manage the solve layer stack
				// For closing parenthesis solve layer with a close paren, we put it in the same stack as the opening parenthesis.
				// Give the closing parenthesis the same virtual symbol name as the opening parenthesis
				// (do the both above at the same time)
				tmpResults.PostfixTokenObjects[i].VirtualSymbolName = tmpSolveLayerStack.pop();
				tmpResults.PostfixTokenObjects[i].SolveLayerStack = tmpSolveLayerStack[tmpSolveLayerStack.length-1];
			}

			// 3. If it's a state address or Symbol, set depth
			//    It was much more complex later on solving these as virtual symbols of their own.
			//    We are saving the value resolution for the very end.
			else if ((tmpResults.PostfixTokenObjects[i].Type === 'Token.Symbol'))
			{
				// Set the depth of the current solution depth
				tmpResults.PostfixTokenObjects[i].Depth = tmpDepth;
				tmpResults.PostfixTokenObjects[i].SolveLayerStack = tmpSolveLayerStack[tmpSolveLayerStack.length-1];
				// Generate a virtual symbol name that's somewhat human readable
				//tmpResults.PostfixTokenObjects[i].VirtualSymbolName = `Sm_${tmpVirtualParenthesisIndex}_D_${tmpDepth}_${this.fable.DataFormat.cleanNonAlphaCharacters(tmpResults.PostfixTokenObjects[i].Token)}`;

				// We've used up this virtual symbol index so increment it
				// The reason we only use these once is to make sure if we use, say, sin(x) twice at the same depth we still have unique names for each virtual solution
				//tmpVirtualParenthesisIndex++;
			}

			// 4. If it's an operator or constant or comment, just set the depth
			else
			{
				tmpResults.PostfixTokenObjects[i].Depth = tmpDepth;
				tmpResults.PostfixTokenObjects[i].SolveLayerStack = tmpSolveLayerStack[tmpSolveLayerStack.length-1];
			}
		}

		// 4. Walk through the decorated symbols and generate the postfix solve list
		//    We are going to start by creating a map of the solve layers:
		let tmpSolveLayerMap = {};
		let tmpSolveLayerMaxDepth = 0;
		for (let i = 0; i < tmpResults.PostfixTokenObjects.length; i++)
		{
			if (!(tmpResults.PostfixTokenObjects[i].SolveLayerStack in tmpSolveLayerMap))
			{
				tmpSolveLayerMap[tmpResults.PostfixTokenObjects[i].SolveLayerStack] = [];
			}
			tmpSolveLayerMap[tmpResults.PostfixTokenObjects[i].SolveLayerStack].push(tmpResults.PostfixTokenObjects[i]);

			// See what our max depth is.  This is super important to the postfix operation
			// The programmer in me thinks it would be funny to not track this and just use the map key length as the max size, which would work (logically impossible to have a depth > key length) but it would be quite a bit more confusing to grok the algorithm.
			if (tmpResults.PostfixTokenObjects[i].Depth > tmpSolveLayerMaxDepth)
			{
				tmpSolveLayerMaxDepth = tmpResults.PostfixTokenObjects[i].Depth;
			}
		}

		let tmpSolveLayerKeys = Object.keys(tmpSolveLayerMap);
		// Reset the virtual symbol index -- it was used above for uniquenes when creating abstract symbols for parenthesis and layer stacks.
		let tmpVirtualSymbolIndex = 0;
		tmpSolveLayerKeys.sort(
			// Sort the solve layers by depth.
			(pLeftLayer, pRightLayer)=>
			{
				// It is impossible to have a layer with no entries in it.  
				// If that ever happens, the bug is actually above and we actively want this to blow up.
				if (tmpSolveLayerMap[pLeftLayer][0].Depth < tmpSolveLayerMap[pRightLayer][0].Depth)
				{
					return 1;
				}
				if (tmpSolveLayerMap[pLeftLayer][0].Depth > tmpSolveLayerMap[pRightLayer][0].Depth)
				{
					return -1;
				}
				return 0;
			});

		// 5. Generate the postfix solve list
		//    The most important thing is going backwards in the depth order (a la reverse polish).
		//    Specifically not using shunting yard to provide in-depth "show your work" notes
		//    Yes it is possible to do a somewhat similar thing with shunting yard but the code is almost unreadable

		// 5.1 Build the Virtual Symbol Names
		// This maps layer stack addresses (which match parenthesis virtual symbol names) to the resultant value for that layer stack.
		// These values change as it solves but the last assignment is the proper assignment because math only reads forward in a line
		tmpResults.PostfixLayerstackMap = {};
		for (let tmpSolveLayerIndex = 0; tmpSolveLayerIndex < tmpSolveLayerKeys.length; tmpSolveLayerIndex++)
		{
			let tmpSolveLayerTokens = tmpSolveLayerMap[tmpSolveLayerKeys[tmpSolveLayerIndex]];
			// For each precedence (this isn't strictly required here but makes the outcome for the user more readable)
			for (let tmpPrecedence = 0; tmpPrecedence <= this.ExpressionParser.tokenMaxPrecedence; tmpPrecedence++)
			{
				// Enumerate all tokens in a layer's expression.
				// There is a recursive way to do this, but given the short length of even the most complex equations we're favoring readability.
				for (let i = 0; i < tmpSolveLayerTokens.length; i++)
				{
					// If the token is an operator and at the current precedence, add it to the postfix solve list and mutate the array.
					if ((tmpSolveLayerTokens[i].Type === 'Token.Operator') &&
						(tmpSolveLayerTokens[i].Descriptor.Precedence === tmpPrecedence))
					{
						let tmpToken = tmpSolveLayerTokens[i];
						// If there is a token and nothing else in this layer, then it's an error.
						if (tmpSolveLayerTokens.length === 1)
						{
							tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList found a single operator in a solve layer expression at token index ${i}`);
							this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
							return tmpResults.PostfixSolveList;
						}
						// If the token is at the beginning of the expression and not a number line orientation modifier, it's an error.
						else if ((i == 0) && ((tmpToken.Token != '+') || (tmpToken.Token != '-')))
						{
							tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList found an operator at the beginning of a solve layer expression at token index ${i}`);
							this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
							return tmpResults.PostfixSolveList;
						}
						// If the token is at the end of the expression, it is an error.
						else if (i == tmpSolveLayerTokens.length - 1)
						{
							tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList found an operator at the end of a solve layer expression at token index ${i}`);
							this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
							return tmpResults.PostfixSolveList;
						}

						// The - at the beginning of an expression is a number line orientation modifier
						else if ((i == 0) && (tmpToken.Token == '-'))
						{
							tmpToken.VirtualSymbolName = `V_${tmpVirtualSymbolIndex}`;
							tmpResults.PostfixLayerstackMap[tmpToken.SolveLayerStack] = tmpToken.VirtualSymbolName;
							tmpVirtualSymbolIndex++;
						}
						// The - after an operator or an open parenthesis is also a number line orientation modifier
						else if ((i > 0) && (tmpToken.Token == '-') && ((tmpSolveLayerTokens[i-1].Type === 'Token.Operator') || (tmpSolveLayerTokens[i-1].Token === '(')))
						{
							// The number line negation operator is a special case that generates a virtual constant (-1.0) and multiplies it by the next token
							tmpToken.VirtualSymbolName = `V_${tmpVirtualSymbolIndex}`;
							tmpVirtualSymbolIndex++;
						}
						// The + at the beginning is also a number line orientation modifier ... THAT WE IGNORE
						else if ((i == 0) && (tmpToken.Token == '+'))
						{
							continue;
						}
						// The + after an operator or a parenthesis is also a number line orientation modifier ... THAT WE IGNORE
						else if ((i > 0) && (tmpToken.Token == '+') && ((tmpSolveLayerTokens[i-1].Type === 'Token.Operator') || (tmpSolveLayerTokens[i-1].Token === '(')))
						{
							continue;
						}

						// If the token is next to another operator it's a parsing error
						else if ((tmpSolveLayerTokens[i-1].Type === 'Token.Operator') || (tmpSolveLayerTokens[i+1].Type === 'Token.Operator'))
						{
							tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.buildPostfixedSolveList found an operator at token index ${i} that is not surrounded by two values.`);
							this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
							return tmpResults.PostfixSolveList;
						}

						// Finally add a virtual symbol name to the dang thing.
						else
						{
							tmpToken.VirtualSymbolName = `V_${tmpVirtualSymbolIndex}`;
							tmpResults.PostfixLayerstackMap[tmpToken.SolveLayerStack] = tmpToken.VirtualSymbolName;
							tmpVirtualSymbolIndex++;
						}
					}
					else if ((tmpSolveLayerTokens[i].Type === 'Token.Function') && (tmpPrecedence === 0))
					{
						let tmpToken = tmpSolveLayerTokens[i];
						tmpToken.VirtualSymbolName = `V_${tmpVirtualSymbolIndex}`;
						tmpVirtualSymbolIndex++;
						tmpResults.PostfixLayerstackMap[tmpToken.SolveLayerStack] = tmpToken.VirtualSymbolName;
					}
				}
			}
		}

		// 5.2: Decorate the Parenthesis with Virtual Symbol Names
		//      ... this gets funny because of precedence of operations surrounding them, parenthesis and functions.
		let tmpParenthesisCacheLIFOStack = [];
		for (let i = 0; i < tmpResults.PostfixTokenObjects.length; i++)
		{
			let tmpPostfixTokenObject = tmpResults.PostfixTokenObjects[i];

			if (tmpPostfixTokenObject.Type === 'Token.Parenthesis')
			{
				// This is just to track the parenthesis stack level in User feedback
				tmpPostfixTokenObject.ParenthesisStack = tmpPostfixTokenObject.VirtualSymbolName;

				if (tmpPostfixTokenObject.Token === '(')
				{
					// It's an open parenthesis.  If the previous token was an operator, get its precedence.
					if (i > 0)
					{
						if (tmpResults.PostfixTokenObjects[i-1].Type === 'Token.Operator')
						{
							tmpPostfixTokenObject.PreviousPrecedence = tmpResults.PostfixTokenObjects[i-1].Descriptor.Precedence;
							tmpPostfixTokenObject.IsFunction = false;
							tmpPostfixTokenObject.PreviousVirtualSymbolName = tmpResults.PostfixTokenObjects[i-1].VirtualSymbolName;
							tmpPostfixTokenObject.VirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpPostfixTokenObject.VirtualSymbolName];
						}
						// This is a function, we will create a virtual symbol for the discrete parenthesis
						else if (tmpResults.PostfixTokenObjects[i-1].Type === 'Token.Function')
						{
							tmpPostfixTokenObject.PreviousPrecedence = 0;
							tmpPostfixTokenObject.IsFunction = true;
							tmpPostfixTokenObject.PreviousVirtualSymbolName = tmpResults.PostfixTokenObjects[i-1].VirtualSymbolName;
							let tmpVirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpPostfixTokenObject.VirtualSymbolName];
							if (!tmpVirtualSymbolName)
							{
								// This is a parenthesis group with no operators in it; make a virtual symbol name.
								tmpVirtualSymbolName = `V_${tmpVirtualSymbolIndex}`;
								tmpVirtualSymbolIndex++;
							}
							tmpPostfixTokenObject.VirtualSymbolName = tmpVirtualSymbolName;

							if (i > 1)
							{
								// Todo: This needs to be enhanced to deal with negations
								let tmpTokenBeforeFunction = tmpResults.PostfixTokenObjects[i-2];
								if (tmpTokenBeforeFunction.Type === 'Token.Operator')
								{
									tmpPostfixTokenObject.PreviousVirtualSymbolName = tmpResults.PostfixTokenObjects[i-2].VirtualSymbolName;
									tmpPostfixTokenObject.PreviousPrecedence = tmpResults.PostfixTokenObjects[i-2].Descriptor.Precedence;
								}
							}
						}
					}
					else
					{
						tmpPostfixTokenObject.VirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpPostfixTokenObject.VirtualSymbolName];
					}
					tmpParenthesisCacheLIFOStack.push(tmpPostfixTokenObject);
				}
				if (tmpPostfixTokenObject.Token === ')')
				{
					// There are three options for assigning this:
					let tmpOpenParenthesis = tmpParenthesisCacheLIFOStack.pop();
					// It's at the end of the tokens -- use the stack's identifier
					if (i >= tmpResults.PostfixTokenObjects.length - 1)
					{
						if (tmpOpenParenthesis.IsFunction)
						{
							tmpPostfixTokenObject.VirtualSymbolName = tmpOpenParenthesis.PreviousVirtualSymbolName;
						}
						else
						{
							tmpPostfixTokenObject.VirtualSymbolName = tmpOpenParenthesis.VirtualSymbolName;
						}
					}
					else
					{
						// The next token is an operator and we're a function
						let tmpPeekedNextToken = tmpResults.PostfixTokenObjects[i+1];
						if (tmpPeekedNextToken.Type == 'Token.Operator' && tmpOpenParenthesis.IsFunction)
						{
							// This is the most complex case -- the next token is an operator AND this is a function.
							// The following is just pointer math.
							// If the operater is at the same precedence or higher than the open parenthesis previous operator, use the previous operator's identifier
							// NOTE: This line of code is insanely complex

							//tmpPostfixTokenObject.VirtualSymbolName = tmpOpenParenthesis.PreviousVirtualSymbolName;

							// If the next token has higher precedence than what's before the open parenthesis, use it for the open as well
							if (tmpPeekedNextToken.Descriptor.Precedence < tmpOpenParenthesis.PreviousPrecedence)
							{
								tmpOpenParenthesis.VirtualSymbolName = tmpPeekedNextToken.VirtualSymbolName;
								tmpPostfixTokenObject.VirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpPostfixTokenObject.VirtualSymbolName];
							}
							// Otherwise use this one -- it is the higher precedence.  And update the previous parenthesis operator's virtual symbol to be the peeked token's virtual symbol.
							else
							{
								tmpPostfixTokenObject.VirtualSymbolName = tmpOpenParenthesis.PreviousVirtualSymbolName;
							}
						}
						// The next token is an operator and it isn't a function
						else if (tmpPeekedNextToken.Type == 'Token.Operator' && ('PreviousPrecedence' in tmpOpenParenthesis))
						{
							// This is the second most complex case -- the next token is an operator.
							// If the operater is at the same precedence or higher than the open parenthesis previous operator, use the previous operator's identifier
							// NOTE: This line of code is insanely complex
							if (tmpPeekedNextToken.Descriptor.Precedence <= tmpOpenParenthesis.PreviousPrecedence)
							{
								tmpPostfixTokenObject.VirtualSymbolName = tmpOpenParenthesis.PreviousVirtualSymbolName;
							}
							// Otherwise use this one -- it is the higher precedence.  And update the previous parenthesis operator's virtual symbol to be the peeked token's virtual symbol.
							else
							{
								tmpPostfixTokenObject.VirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpPostfixTokenObject.VirtualSymbolName];
								tmpOpenParenthesis.VirtualSymbolName = tmpPeekedNextToken.VirtualSymbolName;
							}
						}
						else
						{
							// If this is a function, dereference the function's previous virtual symbol name
							if (tmpOpenParenthesis.IsFunction)
							{
								tmpPostfixTokenObject.VirtualSymbolName = tmpOpenParenthesis.PreviousVirtualSymbolName;
							}
							else
							{
								tmpPostfixTokenObject.VirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpPostfixTokenObject.VirtualSymbolName];
							}
						}
					}
					
					// If there isn't an operator in the layer stack, push forward the assignment
					if (!tmpResults.PostfixLayerstackMap[tmpOpenParenthesis.ParenthesisStack])
					{
						tmpResults.PostfixLayerstackMap[tmpOpenParenthesis.ParenthesisStack] = tmpOpenParenthesis.VirtualSymbolName;
					}
				}
			}
		}

		for (let tmpSolveLayerIndex = 0; tmpSolveLayerIndex < tmpSolveLayerKeys.length; tmpSolveLayerIndex++)
		{
			let tmpSolveLayerTokens = tmpSolveLayerMap[tmpSolveLayerKeys[tmpSolveLayerIndex]];

			if (tmpSolveLayerTokens.length === 1)
			{
				// This is just a simple value assignment -- use a simple addition virtual operation.
				// We often see these inside functions.
				let tmpAbstractAddToken = this.getTokenContainerObject('+');
				//let tmpVirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpSolveLayerTokens[0].SolveLayerStack];
				tmpAbstractAddToken.VirtualSymbolName = tmpResults.PostfixLayerstackMap[tmpSolveLayerTokens[0].SolveLayerStack];
				tmpResults.PostfixSolveList.push(this.getPosfixSolveListOperation(tmpAbstractAddToken, this.getTokenContainerObject('0.0'), tmpSolveLayerTokens[0]));
			}
		}

		// 5.3: Generate the Postfix Solve List
		for (let tmpSolveLayerIndex = 0; tmpSolveLayerIndex < tmpSolveLayerKeys.length; tmpSolveLayerIndex++)
		{
			let tmpSolveLayerTokens = tmpSolveLayerMap[tmpSolveLayerKeys[tmpSolveLayerIndex]];

			// For each precedence level in the layer
			for (let tmpPrecedence = 0; tmpPrecedence <= this.ExpressionParser.tokenMaxPrecedence; tmpPrecedence++)
			{
				// Enumerate all tokens in a layer's expression.
				// There is a recursive way to do this, but given the short length of even the most complex equations we're favoring readability.
				for (let i = 0; i < tmpSolveLayerTokens.length; i++)
				{
					// If the token is an operator and at the current precedence, add it to the postfix solve list and mutate the array.
					if ((tmpSolveLayerTokens[i].Type === 'Token.Operator') &&
						(tmpSolveLayerTokens[i].Descriptor.Precedence === tmpPrecedence))
					{
						let tmpToken = tmpSolveLayerTokens[i];
						// The - at the beginning of an expression is a number line orientation modifier
						if ((i == 0) && (tmpToken.Token == '-'))
						{
							// The number line negation operator is a special case that generates a virtual constant (-1.0) and multiplies it by the next token
							// This is an abstract operation that isn't in the expression.
							let tmpAbstractMultiplyToken = this.getTokenContianerObject('*');
							tmpAbstractMultiplyToken.VirtualSymbolName = tmpToken.VirtualSymbolName;
							tmpResults.PostfixSolveList.push(this.getPosfixSolveListOperation(tmpAbstractMultiplyToken, this.getTokenContainerObject('-1.0'), tmpSolveLayerTokens[i+1]));
						}
						// The - after an operator or an open parenthesis is also a number line orientation modifier
						else if ((i > 0) && (tmpToken.Token == '-') && ((tmpSolveLayerTokens[i-1].Type === 'Token.Operator') || (tmpSolveLayerTokens[i-1].Token === '(')))
						{
							// The number line negation operator is a special case that generates a virtual constant (-1.0) and multiplies it by the next token
							let tmpAbstractMultiplyToken = this.getTokenContianerObject('*');
							tmpAbstractMultiplyToken.VirtualSymbolName = tmpToken.VirtualSymbolName;
							tmpResults.PostfixSolveList.push(this.getPosfixSolveListOperation(tmpAbstractMultiplyToken, this.getTokenContainerObject('-1.0'), tmpSolveLayerTokens[i+1]));
						}
						// The + at the beginning is also a number line orientation modifier ... THAT WE IGNORE
						else if ((i == 0) && (tmpToken.Token == '+'))
						{
							continue;
						}
						// The + after an operator or a parenthesis is also a number line orientation modifier ... THAT WE IGNORE
						else if ((i > 0) && (tmpToken.Token == '+') && ((tmpSolveLayerTokens[i-1].Type === 'Token.Operator') || (tmpSolveLayerTokens[i-1].Token === '(')))
						{
							continue;
						}

						// Finally add the dang thing.
						else
						{
							tmpResults.PostfixSolveList.push(this.getPosfixSolveListOperation(tmpToken, tmpSolveLayerTokens[i-1], tmpSolveLayerTokens[i+1], tmpSolveLayerTokens, i));
						}
					}
					else if ((tmpSolveLayerTokens[i].Type === 'Token.Function') && (tmpPrecedence === 0))
					{
						let tmpToken = tmpSolveLayerTokens[i];
						// Not sure what to do with the other token.
						tmpResults.PostfixSolveList.push(this.getPosfixSolveListOperation(tmpToken, tmpSolveLayerTokens[i+1], this.getTokenContainerObject('0.0')));
					}
				}
			}
		}

		// Now set the assignment address.
		let tmpAssignmentInstruction = this.getPosfixSolveListOperation(this.getTokenContainerObject('Assign', 'Token.SolverInstruction'), this.getTokenContainerObject('DestinationHash', 'Token.SolverInstruction'), this.getTokenContainerObject('Resulting', 'Token.SolverInstruction'));
		tmpAssignmentInstruction.VirtualSymbolName = tmpResults.PostfixedAssignmentAddress;
		tmpResults.PostfixSolveList.push(tmpAssignmentInstruction);

		return tmpResults.PostfixSolveList;
	}
}

module.exports = ExpressionParserPostfix;
