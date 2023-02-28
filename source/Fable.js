/**
* Fable Application Services Support Library
* @license MIT
* @author <steven@velozo.com>
*/
const libFableSettings = require('fable-settings');
const libFableUUID = require('fable-uuid');
const libFableLog = require('fable-log');

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

		// Built-in dependencies ... more can be added here.
		this.Dependencies = (
			{
				precedent: libFableSettings.precedent
			});
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

module.exports = Fable;
module.exports.new = autoConstruct;

module.exports.LogProviderBase = libFableLog.LogProviderBase;

module.exports.precedent = libFableSettings.precedent;