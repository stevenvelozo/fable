/**
* MetaTemplate Word Tree
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
	 * @param {number} pIndex - The index of the character in the pattern
	 * @returns {Object} The resulting leaf node that was added (or found)
	 * @private
	 */
	addChild (pTree, pPattern, pIndex)
	{
		if (!pTree.hasOwnProperty(pPattern[pIndex]))
			pTree[pPattern[pIndex]] = {};

		return pTree[pPattern[pIndex]];
	}

	/** Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {number} pParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @return {bool} True if adding the pattern was successful
	 */
	addPattern (pPatternStart, pPatternEnd, pParser)
	{
		if (pPatternStart.length < 1)
			return false;

		if ((typeof(pPatternEnd) === 'string') && (pPatternEnd.length < 1))
			return false;

		let tmpLeaf = this.ParseTree;

		// Add the tree of leaves iteratively
		for (var i = 0; i < pPatternStart.length; i++)
			tmpLeaf = this.addChild(tmpLeaf, pPatternStart, i);

		tmpLeaf.PatternStart = pPatternStart;
		tmpLeaf.PatternEnd = ((typeof(pPatternEnd) === 'string') && (pPatternEnd.length > 0)) ? pPatternEnd : pPatternStart;
		tmpLeaf.Parse = (typeof(pParser) === 'function') ? pParser :
						(typeof(pParser) === 'string') ? () => { return pParser; } :
						(pData) => { return pData; };
		tmpLeaf.isPromise = false;

		return true;
	}

	/** Add a Pattern to the Parse Tree (asynchronous)
	 * @method addPattern
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {number} pParserAsync - The function (with an asynchronous callback) to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @return {bool} True if adding the pattern was successful
	 */
	addPatternAsync (pPatternStart, pPatternEnd, pParserAsync)
	{
		if (pPatternStart.length < 1)
			return false;

		if ((typeof(pPatternEnd) === 'string') && (pPatternEnd.length < 1))
			return false;

		let tmpLeaf = this.ParseTree;

		// Add the tree of leaves iteratively
		for (var i = 0; i < pPatternStart.length; i++)
			tmpLeaf = this.addChild(tmpLeaf, pPatternStart, i);

		tmpLeaf.PatternStart = pPatternStart;
		tmpLeaf.PatternEnd = ((typeof(pPatternEnd) === 'string') && (pPatternEnd.length > 0)) ? pPatternEnd : pPatternStart;
		tmpLeaf.Parse = (typeof(pParserAsync) === 'function') ? pParserAsync :
						(typeof(pParserAsync) === 'string') ? (pHash, pData, fCallback) => { fCallback(pParserPromise); } :
						(pHash, pData, fCallback) => { return fCallback(pHash); };
		tmpLeaf.isAsync = true;

		return true;
	}
}

module.exports = WordTree;
