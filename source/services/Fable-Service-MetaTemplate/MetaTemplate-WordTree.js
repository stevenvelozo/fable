/**
* Word Tree
* @author      Steven Velozo <steven@velozo.com>
* @description Create a tree (directed graph) of Javascript objects, one character per object.
*/

class WordTree
{
	/**
	 * WordTree Constructor
	 */
	constructor()
	{
		this.ParseTree = {};
	}

	/**
	 * Add a child character to a Parse Tree node
	 * @method addChild
	 * @param {Object} pTree - A parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @returns {Object} The resulting leaf node that was added (or found)
	 * @private
	 */
	addChild (pTree, pPattern)
	{
		if (!(pPattern in pTree))
		{
			pTree[pPattern] = {};
		}

		return pTree[pPattern];
	}

	/**
	 * Add a child character to a Parse Tree PatternEnd subtree
	 * @method addChild
	 * @param {Object} pTree - A parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @returns {Object} The resulting leaf node that was added (or found)
	 * @private
	 */
	addEndChild (pTree, pPattern)
	{
		if (!('PatternEnd' in pTree))
		{
			pTree.PatternEnd = {};
		}

		pTree.PatternEnd[pPattern] = {};

		return pTree.PatternEnd[pPattern];
	}

	/** Add a Pattern to the Parse Tree with both function parameter types
	 * @method addPatternAll
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {function} fParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @param {function} fParserAsync - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @param {Object} pParserContext - The context to pass to the parser function
	 * @return {Object} The leaf parser from the tree
	 */
	addPatternBoth (pPatternStart, pPatternEnd, fParser, fParserAsync, pParserContext)
	{
		if (pPatternStart.length < 1)
		{
			return false;
		}

		if ((typeof(pPatternEnd) === 'string') && (pPatternEnd.length < 1))
		{
			return false;
		}

		let tmpLeaf = this.ParseTree;

		// Add the tree of leaves iteratively
		for (var i = 0; i < pPatternStart.length; i++)
		{
			tmpLeaf = this.addChild(tmpLeaf, pPatternStart[i], i);
		}

		if (!('PatternEnd' in tmpLeaf))
		{
			tmpLeaf.PatternEnd = {};
		}

		let tmpPatternEnd = (typeof(pPatternEnd) === 'string') ? pPatternEnd : pPatternStart;
		for (let i = 0; i < tmpPatternEnd.length; i++)
		{
			tmpLeaf = this.addEndChild(tmpLeaf, tmpPatternEnd[i], i);
		}

		tmpLeaf.PatternStartString = pPatternStart;
		tmpLeaf.PatternEndString = tmpPatternEnd;
		tmpLeaf.Parse = (typeof(fParser) === 'function') ? fParser :
						(typeof(fParser) === 'string') ? (pHash, pData) => { return fParser; } :
						(pHash, pData) => { return pHash; };

		tmpLeaf.ParseAsync = (typeof(fParserAsync) === 'function') ? fParserAsync :
						(typeof(fParserAsync) === 'string') ? (pHash, pData, fCallback) => { return fCallback(null, fParserAsync); } :
						(pHash, pData, fCallback) => { return fCallback(null, tmpLeaf.Parse(pHash, pData)); }

		// A "this" for every object
		if (pParserContext)
		{
			tmpLeaf.ParserContext = pParserContext;
		}

		tmpLeaf.isAsync = true;

		return tmpLeaf;
	}

	/** Add a Pattern to the Parse Tree with both function parameter types
	 * @method addPatternAll
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {function} fParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @param {Object} pParserContext - The context to pass to the parser function
	 */
	addPattern (pPatternStart, pPatternEnd, fParser, pParserContext)
	{
		return this.addPatternBoth(pPatternStart, pPatternEnd, fParser, null, pParserContext);
	}
}

module.exports = WordTree;
