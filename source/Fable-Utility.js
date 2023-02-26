const libFableUtilityTemplate = require('./Fable-Utility-Template.js');

class FableUtility
{
	constructor(pFable)
	{
		this.fable = pFable;
	}

	// Underscore and lodash have a behavior, _.extend, which merges objects.
	// Now that es6 gives us this, use the native thingy.
	extend(pDestinationObject, ...pSourceObjects)
	{
		return Object.assign(pDestinationObject, ...pSourceObjects);
	}

	// Underscore and lodash have a behavior, _.template, which compiles a
	// string-based template with code snippets into simple executable pieces,
	// with the added twist of returning a precompiled function ready to go.
	template(pTemplateText, pData)
	{
		let tmpTemplate = new libFableUtilityTemplate(this.fable, pTemplateText);

		return tmpTemplate.buildTemplateFunction(pTemplateText, pData);
	}

}

module.exports = FableUtility;