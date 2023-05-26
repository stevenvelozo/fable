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
		if (!pTree.hasOwnProperty(pPattern))
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
		if (!pTree.hasOwnProperty('PatternEnd'))
		{
			pTree.PatternEnd = {};
		}

		pTree.PatternEnd[pPattern] = {};

		return pTree.PatternEnd[pPattern];
	}

	/** Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {function} fParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @return {bool} True if adding the pattern was successful
	 */
	addPattern (pPatternStart, pPatternEnd, fParser)
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

		if (!tmpLeaf.hasOwnProperty('PatternEnd'))
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
						(typeof(fParser) === 'string') ? () => { return fParser; } :
						(pData) => { return pData; };

		return tmpLeaf;
	}


	/** Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {function} fParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @return {bool} True if adding the pattern was successful
	 */
	addPatternAsync (pPatternStart, pPatternEnd, fParser)
	{
		let tmpLeaf = this.addPattern(pPatternStart, pPatternEnd, fParser);
		if (tmpLeaf)
		{
			tmpLeaf.isAsync = true;
		}
	}
}

module.exports = WordTree;
