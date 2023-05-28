const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

class FableServiceDataGeneration extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'DataGeneration';

		this.defaultData = require('./Fable-Service-DataGeneration-DefaultValues.json');
	}

	// Return a random integer between pMinimum and pMaximum
	randomIntegerBetween(pMinimum, pMaximum)
	{
		return Math.floor(Math.random() * (pMaximum - pMinimum + 1)) + pMinimum;
	}
	// Return a random integer up to the passed-in maximum
	randomIntegerUpTo(pMaximum)
	{
		return this.randomIntegerBetween(0, pMaximum);
	}
	// Return a random integer between 0 and 9999999
	randomInteger()
	{
		return Math.floor(Math.random()*this.defaultData.DefaultIntegerMaximum);
	}


	randomNumericString(pLength, pMaxNumber)
	{
		let tmpLength = (typeof(pLength) === 'undefined') ? 10 : pLength;
		let tmpMaxNumber = (typeof(pMaxNumber) === 'undefined') ? ((10 ** tmpLength) - 1) : pMaxNumber;

		return this.defaultServices.DataFormat.stringPadStart(this.randomIntegerUpTo(tmpMaxNumber), pLength, '0');
	}


	randomMonth()
	{
		return this.defaultData.MonthSet[this.randomIntegerUpTo(this.defaultData.MonthSet.length-1)];
	}
	randomDayOfWeek()
	{
		return this.defaultData.WeekDaySet[this.randomIntegerUpTo(this.defaultData.WeekDaySet.length-1)];
	}


	randomColor()
	{
		return this.defaultData.ColorSet[this.randomIntegerUpTo(this.defaultData.ColorSet.length-1)];
	}


	randomName()
	{
		return this.defaultData.NameSet[this.randomIntegerUpTo(this.defaultData.NameSet.length-1)];
	}
	randomSurname()
	{
		return this.defaultData.SurNameSet[this.randomIntegerUpTo(this.defaultData.SurNameSet.length-1)];
	}
}

module.exports = FableServiceDataGeneration;