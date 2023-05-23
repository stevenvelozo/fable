const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

const libPrecedent = require('precedent');

class FableServiceMetaTemplate extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'MetaTemplate';

        this._MetaTemplateLibrary = new libPrecedent(this.options);
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
		return this._MetaTemplateLibrary.addPattern(pPatternStart, pPatternEnd, pParser);
	}

	addPatternAsync(pPatternStart, pPatternEnd, pParser)
	{
		return this._MetaTemplateLibrary.addPatternAsync(pPatternStart, pPatternEnd, pParser);
	}

	/**
	 * Parse a string with the existing parse tree
	 * @method parseString
	 * @param {string} pString - The string to parse
	 * @return {string} The result from the parser
	 */
	parseString(pString, pData, fCallback)
	{
		return this._MetaTemplateLibrary.parseString(pString, pData, fCallback);
	}
}

module.exports = FableServiceMetaTemplate;