const libFableServiceBase = require('fable-serviceproviderbase');

/**
 * Arbitrary Precision Math Operations
 * @author      Steven Velozo <steven@velozo.com>
 * @description Simple functions that perform arbitrary precision math operations and return string resultant values.  Wraps big.js
 * @class FableServiceMath
 * @extends libFableServiceBase
 */
class FableServiceMath extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'Math';
	}

/*
	Pass-through Rounding Method Constants

	Property	   Value   BigDecimal Equiv   Description
	----------     -----   ----------------   -----------
	roundDown      0       ROUND_DOWN         Rounds towards zero. (_I.e. truncate, no rounding._)
	roundHalfUp    1       ROUND_HALF_UP      Rounds towards nearest neighbour. (_If equidistant, rounds away from zero._)
	roundHalfEven  2       ROUND_HALF_EVEN    Rounds towards nearest neighbour. (_If equidistant, rounds towards even neighbour._)
	roundUp        3       ROUND_UP           Rounds positively away from zero. (_Always round up._)
*/
	get roundDown() { return this.fable.Utility.bigNumber.roundDown; }
	get roundHalfUp() { return this.fable.Utility.bigNumber.roundHalfUp; }
	get roundHalfEven() { return this.fable.Utility.bigNumber.roundHalfEven; }
	get roundUp() { return this.fable.Utility.bigNumber.roundUp; }

	parsePrecise(pValue, pNonNumberValue)
	{
		let tmpNumber;

		try
		{
			tmpNumber = new this.fable.Utility.bigNumber(pValue);
		}
		catch(pError)
		{
			this.log.warn(`Error parsing number (type ${typeof(pValue)}): ${pError}`);
			tmpNumber = (typeof(pNonNumberValue) === 'undefined') ? "0.0" : pNonNumberValue;
		}

		return tmpNumber.toString();
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

	roundPrecise(pValue, pDecimals, pRoundingMethod)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;
		let tmpDecimals = isNaN(pDecimals) ? 0 : pDecimals;
		let tmpRoundingMethod = (typeof(pRoundingMethod) === 'undefined') ? this.roundHalfUp : pRoundingMethod;

		let tmpArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpArbitraryValue.round(tmpDecimals, tmpRoundingMethod);
		return tmpResult.toString();
	}

	toFixedPrecise(pValue, pDecimals, pRoundingMethod)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;
		let tmpDecimals = isNaN(pDecimals) ? 0 : pDecimals;
		let tmpRoundingMethod = (typeof(pRoundingMethod) === 'undefined') ? this.roundHalfUp : pRoundingMethod;

		let tmpArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpArbitraryValue.toFixed(tmpDecimals, tmpRoundingMethod);
	
		return tmpResult.toString();
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

	// Bignumber does not use precision values for power -- only javascript decimals
	powerPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : parseInt(pRightValue);

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.pow(tmpRightValue);
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

	modPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.mod(tmpRightValue);
		return tmpResult.toString();
	}

	sqrtPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpLeftArbitraryValue.sqrt();
		return tmpResult.toString();
	}

	absPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpLeftArbitraryValue.abs();
		return tmpResult.toString();
	}

	comparePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.cmp(tmpRightValue);
	}

	gtPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.gt(tmpRightValue);
	}

	gtePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.gte(tmpRightValue);
	}

	ltPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.lt(tmpRightValue);
	}

	ltePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.lt(tmpRightValue);
	}

	radPrecise(pDegrees)
	{
		let tmpDegrees = isNaN(pDegrees) ? 0 : pDegrees;

		let tmpDegreesArbitraryValue = new this.fable.Utility.bigNumber(tmpDegrees);
		// TODO: Const for pi in arbitrary precision?
		let tmpResult = tmpDegreesArbitraryValue.times(Math.PI).div(180);
		return tmpResult.toString();
	}

	sin(pRadians)
	{
		let tmpRadians = isNaN(pRadians) ? 0 : pRadians;
		return Math.sin(tmpRadians);
	}

	cos(pRadians)
	{
		let tmpRadians = isNaN(pRadians) ? 0 : pRadians;
		return Math.cos(tmpRadians);
	}

	tan(pRadians)
	{
		let tmpRadians = isNaN(pRadians) ? 0 : pRadians;
		return Math.tan(tmpRadians);
	}
}

module.exports = FableServiceMath;
