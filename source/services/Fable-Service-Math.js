const libFableServiceBase = require('fable-serviceproviderbase');

/**
* Arbitrary Precision Math Operations
* @author      Steven Velozo <steven@velozo.com>
* @description Simple functions that perform arbitrary precision math operations and return string resultant values.
*/

class FableServiceMath extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'Math';
	}

	parsePrecise(pValue)
	{
		let tmpNumber = "0.0";

		try
		{
		    tmpNumber = new this.fable.Utility.bigNumber(pValue);
		}
		catch(pError)
		{
		    console.log(`Error parsing number (type ${typeof(pValue)}): ${pError}`);
		}

		return tmpNumber.toString();
	}

	addPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.plus(tmpRightValue);
		return tmpResult.toString();
	}

	subtractPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.minus(tmpRightValue);
		return tmpResult.toString();
	}

	multiplyPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.times(tmpRightValue);
		return tmpResult.toString();
	}

	dividePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.div(tmpRightValue);
		return tmpResult.toString();
	}

	percentagePrecise(pIs, pOf)
	{
		let tmpLeftValue = isNaN(pIs) ? 0 : pIs;
		let tmpRightValue = isNaN(pOf) ? 0 : pOf;

		if (tmpRightValue == 0)
		{
			return '0';
		}

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.div(tmpRightValue);
		tmpResult = tmpResult.times(100);
		return tmpResult.toString();
	}
}

module.exports = FableServiceMath;
