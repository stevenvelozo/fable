// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
const libFableSettings = require('fable-settings').FableSettings;
const libFableUUID = require('fable-uuid').FableUUID;
const libFableLog = require('fable-log').FableLog;


/**
* Fable Application Services Support Library
*
* @class Fable
*/
class Fable
{
	constructor(pSettings)
	{
		let tmpSettings = new libFableSettings(pSettings);

		this.settingsManager = tmpSettings;

		// Instantiate the UUID generator
		this.libUUID = new libFableUUID(tmpSettings);

		this.log = new libFableLog(tmpSettings);
		this.log.initialize();
	}

	get settings()
	{
		return this.settingsManager.settings;
	}

	get fable()
	{
		return this;
	}

	getUUID()
	{
		return this.libUUID.getUUID();
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new Fable(pSettings);
}

module.exports = {new:autoConstruct, Fable:Fable};