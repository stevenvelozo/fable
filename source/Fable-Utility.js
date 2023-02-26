class FableUtility
{
	constructor(pFable)
	{
		this.fable = pFable;
	}

	// Underscore and lodash both had a behavior, _.extend, which merged objects
	// Now that es6 gives us this, use the native thingy.
	extend(pDestinationObject, ...pSourceObjects)
	{
		return Object.assign(pDestinationObject, ...pSourceObjects);
	}
}

module.exports = FableUtility;