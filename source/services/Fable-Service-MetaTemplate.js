const libFableServiceBase = require('fable-serviceproviderbase');

/**
* Precedent Meta-Templating
* @author      Steven Velozo <steven@velozo.com>
* @description Process text stream trie and postfix tree, parsing out meta-template expression functions.
*/
const libWordTree = require(`./Fable-Service-MetaTemplate/MetaTemplate-WordTree.js`);
const libStringParser = require(`./Fable-Service-MetaTemplate/MetaTemplate-StringParser.js`);


class FableServiceMetaTemplate extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'MetaTemplate';

		this.WordTree = new libWordTree();

		this.StringParser = new libStringParser(this.fable);

		this.ParseTree = this.WordTree.ParseTree;
	}


	/**
	 * Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pTree - A node on the parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @param {number} pIndex - callback function
	 * @return {bool} True if adding the pattern was successful
	 */
	addPattern(pPatternStart, pPatternEnd, pParser)
	{
		return this.WordTree.addPattern(pPatternStart, pPatternEnd, pParser);
	}

	addPatternAsync(pPatternStart, pPatternEnd, pParserPromise)
	{
		return this.WordTree.addPatternAsync(pPatternStart, pPatternEnd, pParserPromise);
	}

	addPatternBoth(pPatternStart, pPatternEnd, pParser, pParserPromise)
	{
		return this.WordTree.addPatternBoth(pPatternStart, pPatternEnd, pParser, pParserPromise);
	}

	/**
	 * Parse a string with the existing parse tree
	 * @method parseString
	 * @param {string} pString - The string to parse
	 * @param {object} pData - Data to pass in as the second argument
	 * @param {function} fCallback - The callback function to call when a pattern is matched
	 * @param {array} pDataContext - The history of data objects already passed in
	 * @return {string} The result from the parser
	 */
	parseString(pString, pData, fCallback, pDataContext)
	{
		if (this.LogNoisiness > 4)
		{
			this.fable.log.trace(`Metatemplate parsing template string [${pString}] where the callback is a ${typeof(fCallback)}`, {TemplateData:pData});
		}
		return this.StringParser.parseString(pString, this.ParseTree, pData, fCallback, pDataContext);
	}
}

module.exports = FableServiceMetaTemplate;