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


	addPattern(pPatternStart, pPatternEnd, pParser, pParserContext)
	{
		return this.WordTree.addPattern(pPatternStart, pPatternEnd, pParser, pParserContext);
	}

	addPatternBoth(pPatternStart, pPatternEnd, pParser, pParserPromise, pParserContext)
	{
		return this.WordTree.addPatternBoth(pPatternStart, pPatternEnd, pParser, pParserPromise, pParserContext);
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