/**
* Fable Application Services Support Library
* @license MIT
* @author <steven@velozo.com>
*/
const libFableSettings = require('fable-settings').FableSettings;
const libFableUUID = require('fable-uuid').FableUUID;
const libFableLog = require('fable-log').FableLog;

const libFableUtility = require('./Fable-Utility.js')

class Fable
{
	constructor(pSettings)
	{
		let tmpSettings = new libFableSettings(pSettings);

		this.settingsManager = tmpSettings;

		// Instantiate the UUID generator
		this.libUUID = new libFableUUID(this.settingsManager.settings);

		this.log = new libFableLog(this.settingsManager.settings);
		this.log.initialize();

		this.Utility = new libFableUtility(this);
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

module.exports = Fable;