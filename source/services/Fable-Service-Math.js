/**
 * @file Fable-Service-Math.js
 * @description This file contains the implementation of the FableServiceMath class, which provides simple functions for performing arbitrary precision math operations.
 * @module FableServiceMath
 * @extends libFableServiceBase
 */
const libFableServiceBase = require('fable-serviceproviderbase');
const libSetConcatArray = require('./Fable-SetConcatArray.js');

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

		this.pi = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
		// From NASA: https://apod.nasa.gov/htmltest/gifcity/e.2mil
		this.euler = '2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664';

//		this.manifest = this.fable.newManyfest();
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

	/**
	 * Parses a precise number value.
	 *
	 * @param {number} pValue - The value to parse.
	 * @param {any} pNonNumberValue - The value to use if parsing fails.
	 * @returns {string} - The parsed number as a string.
	 */
	parsePrecise(pValue, pNonNumberValue)
	{
		let tmpNumber;

		try
		{
			tmpNumber = new this.fable.Utility.bigNumber(pValue);
		}
		catch (pError)
		{
			this.log.warn(`Error parsing number (type ${typeof (pValue)}): ${pError}`);
			tmpNumber = (typeof (pNonNumberValue) === 'undefined') ? "0.0" : pNonNumberValue;
		}

		return tmpNumber ? tmpNumber.toString() : tmpNumber;
	}

	/**
	 * Assigns the given value.  For equals operations in the solver.
	 * @param {*} pValue - The value to be assigned.
	 * @returns {*} The assigned value.
	 */
	assignValue(pValue)
	{
		return pValue;
	}

	/**
	 * Calculates the precise percentage of a given value compared to another value.
	 *
	 * @param {number} pIs - The value to calculate the percentage of.
	 * @param {number} pOf - The value to calculate the percentage against.
	 * @returns {string} The precise percentage as a string.
	 */
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

	/**
	 * Concatenates two value sets and returns the result as a string.
	 * 
	 * Value sets are comma separated.
	 * 
	 * Used for arbitrary precision set generation.
	 *
	 * @param {any} pLeftValue - The left value to append.
	 * @param {any} pRightValue - The right value to append.
	 * @returns {InstanceType<libSetConcatArray>} The concatenated string of the left and right values.
	 */
	setConcatenate(pLeftValue, pRightValue)
	{
		return new libSetConcatArray(pLeftValue, pRightValue);
	}

	/**
	 * Rounds a value to a specified number of decimal places using a specified rounding method.
	 *
	 * @param {number} pValue - The value to be rounded.
	 * @param {number} pDecimals - The number of decimal places to round to.
	 * @param {function} [pRoundingMethod] - The rounding method to use. Defaults to `this.roundHalfUp`.
	 * @returns {string} - The rounded value as a string.
	 */
	roundPrecise(pValue, pDecimals, pRoundingMethod)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;
		let tmpDecimals = isNaN(pDecimals) ? 0 : parseInt(pDecimals, 10);
		let tmpRoundingMethod = (typeof (pRoundingMethod) === 'undefined') ? this.roundHalfUp : parseInt(pRoundingMethod, 10);

		let tmpArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpArbitraryValue.round(tmpDecimals, tmpRoundingMethod);
		return tmpResult.toString();
	}

	/**
	 * Returns a string representation of a number with a specified number of decimals.
	 * 
	 * @param {number} pValue - The number to be formatted.
	 * @param {number} pDecimals - The number of decimals to include in the formatted string.
	 * @param {string} [pRoundingMethod] - The rounding method to use. Defaults to 'roundHalfUp'.
	 * @returns {string} - The formatted number as a string.
	 */
	toFixedPrecise(pValue, pDecimals, pRoundingMethod)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;
		let tmpDecimals = isNaN(pDecimals) ? 0 : pDecimals;
		let tmpRoundingMethod = (typeof (pRoundingMethod) === 'undefined') ? this.roundHalfUp : pRoundingMethod;

		let tmpArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpArbitraryValue.toFixed(tmpDecimals, tmpRoundingMethod);

		return tmpResult.toString();
	}

	/**
	 * Adds two values precisely.
	 * @param {number} pLeftValue - The left value to be added.
	 * @param {number} pRightValue - The right value to be added.
	 * @returns {string} - The result of adding the two values as a string.
	 */
	addPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.plus(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Subtracts two values precisely.
	 *
	 * @param {number} pLeftValue - The left value to subtract.
	 * @param {number} pRightValue - The right value to subtract.
	 * @returns {string} The result of the subtraction as a string.
	 */
	subtractPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.minus(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Calculates the precise power of two numbers.
	 * 
	 * @param {number} pLeftValue - The base value.
	 * @param {number} pRightValue - The exponent value.
	 * @returns {string} The result of raising the base value to the exponent value.
	 */
	powerPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : parseInt(pRightValue);
		let tmpResult;
		if (tmpRightValue == Number(pRightValue))
		{
			const tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
			tmpResult = tmpLeftArbitraryValue.pow(tmpRightValue);
		}
		else
		{
			//FIXME: big.js shits itself on non-integer exponents........................
			tmpResult = Math.pow(tmpLeftValue, Number(pRightValue));
		}

		return tmpResult.toString();
	}

	/**
	 * Multiplies two values precisely.
	 *
	 * @param {number} pLeftValue - The left value to multiply.
	 * @param {number} pRightValue - The right value to multiply.
	 * @returns {string} The result of the multiplication as a string.
	 */
	multiplyPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.times(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Divides two values precisely.
	 *
	 * @param {number} pLeftValue - The left value to be divided.
	 * @param {number} pRightValue - The right value to divide by.
	 * @returns {string} The result of the division as a string.
	 */
	dividePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.div(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Calculates the modulus of two values with precision.
	 *
	 * @param {number} pLeftValue - The left value.
	 * @param {number} pRightValue - The right value.
	 * @returns {string} The result of the modulus operation as a string.
	 */
	modPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.mod(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Calculates the square root of a number with precise decimal places.
	 *
	 * @param {number} pValue - The number to calculate the square root of.
	 * @returns {string} The square root of the input number as a string.
	 */
	sqrtPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpLeftArbitraryValue.sqrt();
		return tmpResult.toString();
	}

	/**
	 * Calculates the absolute value of a number precisely.
	 *
	 * @param {number} pValue - The number to calculate the absolute value of.
	 * @returns {string} The absolute value of the input number as a string.
	 */
	absPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpValue);
		let tmpResult = tmpLeftArbitraryValue.abs();
		return tmpResult.toString();
	}

	/**
	 * Calculates the floor of a number precisely.
	 *
	 * @param {number} pValue - The number to calculate the floor value of.
	 * @returns {string} The floor value of the input number as a string.
	 */
	floorPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpResult = Math.floor(tmpValue);
		return tmpResult.toString();
	}

	/**
	 * Calculates the ceiling of a number precisely.
	 *
	 * @param {number} pValue - The number to calculate the ceiling value of.
	 * @returns {string} The ceiling value of the input number as a string.
	 */
	ceilPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpResult = Math.ceil(tmpValue);
		return tmpResult.toString();
	}

	/**
	 * Compares two values precisely.
	 *
	 * @param {number|string} pLeftValue - The left value to compare.
	 * @param {number|string} pRightValue - The right value to compare.
	 * @returns {number} - Returns the result of the comparison.
	 */
	comparePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.cmp(tmpRightValue);
	}

	/**
	 * Compares two values precisely within a tolerance.
	 *
	 * @param {number|string} pLeftValue - The left value to compare.
	 * @param {number|string} pRightValue - The right value to compare.
	 * @param {number|string} pEpsilon - The epsilon value for comparison.
	 * @returns {number} - Returns the result of the comparison.
	 */
	comparePreciseWithin(pLeftValue, pRightValue, pEpsilon)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		const diff = tmpLeftArbitraryValue.minus(tmpRightValue).abs();
		if (diff.lte(pEpsilon))
		{
			return 0;
		}
		if (tmpLeftArbitraryValue.lt(tmpRightValue))
		{
			return -1;
		}
		return 1;
	}

	/**
	 * Determines if the left value is greater than the right value precisely.
	 *
	 * @param {number} pLeftValue - The left value to compare.
	 * @param {number} pRightValue - The right value to compare.
	 * @returns {boolean} - Returns true if the left value is greater than the right value, otherwise returns false.
	 */
	gtPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.gt(tmpRightValue);
	}

	/**
	 * Checks if the left value is greater than or equal to the right value.
	 * If either value is not a number, it is treated as 0.
	 *
	 * @param {number} pLeftValue - The left value to compare.
	 * @param {number} pRightValue - The right value to compare.
	 * @returns {boolean} - True if the left value is greater than or equal to the right value, false otherwise.
	 */
	gtePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.gte(tmpRightValue);
	}

	/**
	 * Determines if the left value is less than the right value precisely.
	 *
	 * @param {number} pLeftValue - The left value to compare.
	 * @param {number} pRightValue - The right value to compare.
	 * @returns {boolean} - Returns true if the left value is less than the right value, otherwise returns false.
	 */
	ltPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.lt(tmpRightValue);
	}

	/**
	 * Determines if the left value is less than or equal to the right value.
	 *
	 * @param {number} pLeftValue - The left value to compare.
	 * @param {number} pRightValue - The right value to compare.
	 * @returns {boolean} - Returns true if the left value is less than or equal to the right value, otherwise returns false.
	 */
	ltePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.fable.Utility.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.lte(tmpRightValue);
	}

	/**
	 * Converts degrees to radians with arbitrary precision.
	 * 
	 * @param {number} pDegrees - The degrees to convert to radians.
	 * @returns {string} - The converted radians as a string.
	 */
	radPrecise(pDegrees)
	{
		let tmpDegrees = isNaN(pDegrees) ? 0 : pDegrees;

		let tmpDegreesArbitraryValue = new this.fable.Utility.bigNumber(tmpDegrees);
		// TODO: Const for pi in arbitrary precision?
		let tmpResult = tmpDegreesArbitraryValue.times(Math.PI).div(180);
		return tmpResult.toString();
	}

	/**
	 * Calculates the value of pi with the specified precision.
	 * If no precision is provided, returns 100 digits after the decimal.
	 *
	 * @param {number} [pPrecision] - The precision to use for calculating pi.
	 * @returns {number} - The calculated value of pi.
	 */
	piPrecise(pPrecision)
	{
		if (typeof (pPrecision) === 'undefined')
		{
			return this.pi;
		}
		else
		{
			return this.roundPrecise(this.pi, pPrecision);
		}
	}

	/**
	 * Calculates the value of euler with the specified precision.
	 *
	 * @param {number} [pPrecision] - The precision to use for calculating E.
	 * @returns {number} - The calculated value of E.
	 */
	eulerPrecise(pPrecision)
	{
		if (typeof (pPrecision) === 'undefined')
		{
			return this.euler;
		}
		else
		{
			return this.roundPrecise(this.euler, pPrecision);
		}
	}

	/**
	 * Calculates the sine of the given angle in radians.
	 *
	 * @param {number} pRadians - The angle in radians.
	 * @returns {number} The sine of the angle.
	 */
	sin(pRadians)
	{
		let tmpRadians = isNaN(pRadians) ? 0 : pRadians;
		return Math.sin(tmpRadians);
	}

	/**
	 * Calculates the cosine of the given angle in radians.
	 * 
	 * @param {number} pRadians - The angle in radians.
	 * @returns {number} The cosine of the angle.
	 */
	cos(pRadians)
	{
		let tmpRadians = isNaN(pRadians) ? 0 : pRadians;
		return Math.cos(tmpRadians);
	}

	/**
	 * Calculates the tangent of an angle in radians.
	 *
	 * @param {number} pRadians - The angle in radians.
	 * @returns {number} The tangent of the angle.
	 */
	tan(pRadians)
	{
		let tmpRadians = isNaN(pRadians) ? 0 : pRadians;
		return Math.tan(tmpRadians);
	}

	/* * * * * * * * * * * * * * * *
	 * Set functions
	 * These are meant to work fine with arrays and more complex set descriptions returned by Manyfest.
	 * Manyfest sometimes returns values as arrays and sometimes as a map of addresses with values depending
	 * on what was requested.
	 * 
	 * The following functions will likely be broken into their own service.
	 */

	/**
	 * Counts the number of elements in a set.
	 *
	 * @param {Array|Object|any} pValueSet - The set to count the elements of.
	 * @returns {number} The number of elements in the set.
	 */
	countSetElements(pValueSet)
	{
		if (Array.isArray(pValueSet))
		{
			return pValueSet.length;
		}
		else if (typeof (pValueSet) === 'object')
		{
			return Object.keys(pValueSet).length;
		}
		else if (pValueSet)
		{
			// This is controversial.  Discuss with colleagues!
			return 1;
		}
		return 0;
	}

	/**
	 * Sorts the elements in the given value set in ascending order using the precise parsing and comparison.
	 * 
	 * @param {Array|Object} pValueSet - The value set to be sorted.
	 * @returns {Array} - The sorted value set.
	 */
	sortSetPrecise(pValueSet)
	{
		let tmpSortedSet = [];
		if (Array.isArray(pValueSet))
		{
			for (let i = 0; i < pValueSet.length; i++)
			{
				tmpSortedSet.push(this.parsePrecise(pValueSet[i], NaN));
			}
		}
		else if (typeof (pValueSet) === 'object')
		{
			let tmpKeys = Object.keys(pValueSet);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				tmpSortedSet.push(this.parsePrecise(pValueSet[tmpKeys[i]], NaN));
			}
		}

		tmpSortedSet.sort((pLeft, pRight) => { return this.comparePrecise(pLeft, pRight); });

		return tmpSortedSet;
	}

	/**
	 * Bucketizes a set of values based on a specified bucket size.
	 *
	 * @param {Array|Object} pValueSet - The set of values to be bucketized.
	 * @param {number} pBucketSize - The size of each bucket. Optional - If NaN, the values will be bucketized by their value.
	 * @returns {Object} - The bucketized set of values.
	 */
	bucketSetPrecise(pValueSet, pBucketSize)
	{
		let tmpBucketedSet = {};
		let tmpBucketSize = this.parsePrecise(pBucketSize, NaN);

		if (Array.isArray(pValueSet))
		{
			for (let i = 0; i < pValueSet.length; i++)
			{
				let tmpValue = this.parsePrecise(pValueSet[i], NaN);
				let tmpBucket = tmpValue.toString();
				if (!isNaN(tmpBucketSize))
				{
					tmpBucket = this.dividePrecise(pValueSet[i], tmpBucketSize);
				}
				if (!(tmpBucket in tmpBucketedSet))
				{
					tmpBucketedSet[tmpBucket] = 0;
				}
				tmpBucketedSet[tmpBucket] = tmpBucketedSet[tmpBucket] + 1;
			}
		}
		else if (typeof (pValueSet) === 'object')
		{
			let tmpKeys = Object.keys(pValueSet);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				let tmpValue = this.parsePrecise(pValueSet[tmpKeys[i]], NaN);
				let tmpBucket = tmpValue.toString();
				if (!isNaN(tmpBucketSize))
				{
					tmpBucket = this.dividePrecise(pValueSet[i], tmpBucketSize);
				}
				if (!(tmpBucket in tmpBucketedSet))
				{
					tmpBucketedSet[tmpBucket] = 0;
				}
				tmpBucketedSet[tmpBucket] = tmpBucketedSet[tmpBucket] + 1;
			}
		}

		return tmpBucketedSet;
	}

	/**
	 * Calculates the histogram using precise bucket set for the given pValueSet.
	 * 
	 * @param {Array<number>} pValueSet - The array of p-values.
	 * @returns {Array<number>} The histogram of the p-values.
	 */
	histogramPrecise(pValueSet)
	{
		return this.bucketSetPrecise(pValueSet);
	}

	/**
	 * Sorts the histogram object in ascending order based on the frequencies of the buckets.
	 * 
	 * @param {Object} pHistogram - The histogram object to be sorted.
	 * @returns {Object} - The sorted histogram object.
	 */
	sortHistogramPrecise(pHistogram)
	{
		let tmpSortedHistogram =  {};
		let tmpKeys = Object.keys(pHistogram);

		tmpKeys.sort((pLeft, pRight) => { return pHistogram[pLeft] - pHistogram[pRight]; });

		for (let i = 0; i < tmpKeys.length; i++)
		{
			tmpSortedHistogram[tmpKeys[i]] = pHistogram[tmpKeys[i]];
		}

		return tmpSortedHistogram;
	}

	cleanValueArray(pValueArray)
	{
		if (!Array.isArray(pValueArray))
		{
			return [];
		}

		let tmpCleanedArray = [];
		for (let i = 0; i < pValueArray.length; i++)
		{
			let tmpValue = this.parsePrecise(pValueArray[i], NaN);
			if (!isNaN(tmpValue))
			{
				tmpCleanedArray.push(tmpValue);
			}
		}
		return tmpCleanedArray;
	}

	cleanValueObject(pValueObject)
	{
		if (typeof (pValueObject) !== 'object')
		{
			return {};
		}

		//TODO: is this right?
		let tmpCleanedObject = {};
		let tmpKeys = Object.keys(pValueObject);
		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpValue = this.parsePrecise(pValueObject[tmpKeys[i]], NaN);
			if (!isNaN(tmpValue))
			{
				tmpCleanedObject[tmpKeys[i]] = tmpValue;
			}
		}
		return tmpCleanedObject;
	}

	/**
	 * Make a histogram of representative counts for exact values (.tostring() is the keys to count)
	 * @param {Array} pValueSet 
	 * @param {string} pValueAddress 
	 */
	histogramDistributionByExactValue(pValueObjectSet, pValueAddress, pManifest)
	{
		if (!Array.isArray(pValueObjectSet))
		{
			return pValueObjectSet;
		}

		if (!pValueAddress)
		{
			return {};
		}

		let tmpHistogram = {};
		for (let i = 0; i < pValueObjectSet.length; i++)
		{
			let tmpValue = this.fable.Utility.getValueByHash(pValueObjectSet[i], pValueAddress, pManifest).toString();

			if (!(tmpValue in tmpHistogram))
			{
				tmpHistogram[tmpValue] = 0;
			}
			tmpHistogram[tmpValue] = tmpHistogram[tmpValue] + 1;
		}

		return tmpHistogram;
	}

	histogramDistributionByExactValueFromInternalState(pValueObjectSetAddress, pValueAddress)
	{
		if (!pValueObjectSetAddress)
		{
			return {};
		}

		let tmpValueObjectSet = this.fable.Utility.getInternalValueByHash(pValueObjectSetAddress);
		return this.histogramDistributionByExactValue(tmpValueObjectSet, pValueAddress);
	}

	/**
	 * Make a histogram of representative counts for exact values (.tostring() is the keys to count)
	 * @param {Array} pValueSet 
	 * @param {string} pValueAddress 
	 */
	histogramAggregationByExactValue(pValueObjectSet, pValueAddress, pValueAmountAddress, pManifest)
	{
		if (!Array.isArray(pValueObjectSet))
		{
			return pValueObjectSet;
		}

		if (!pValueAddress || !pValueAmountAddress)
		{
			return {};
		}

		let tmpHistogram = {};
		for (let i = 0; i < pValueObjectSet.length; i++)
		{
			let tmpValue = this.fable.Utility.getValueByHash(pValueObjectSet[i], pValueAddress, pManifest).toString();
			let tmpAmount = this.parsePrecise(this.fable.Utility.getValueByHash(pValueObjectSet[i], pValueAmountAddress, pManifest), NaN);

			if (!(tmpValue in tmpHistogram))
			{
				tmpHistogram[tmpValue] = 0;
			}

			if (!isNaN(tmpAmount))
			{
				tmpHistogram[tmpValue] = this.addPrecise(tmpHistogram[tmpValue], tmpAmount);
			}
		}

		return tmpHistogram;
	}

	/**
	 * Aggregates a histogram by exact value from an internal state object.
	 *
	 * @param {string} pValueObjectSetAddress - The address of the internal value object set.
	 * @param {string} pValueAddress - The address of the value to aggregate by.
	 * @param {string} pValueAmountAddress - The address of the amount to aggregate.
	 * @returns {Object} The aggregated histogram object. Returns an empty object if the value object set address is not provided.
	 */
	histogramAggregationByExactValueFromInternalState(pValueObjectSetAddress, pValueAddress, pValueAmountAddress)
	{
		if (!pValueObjectSetAddress)
		{
			return {};
		}

		let tmpValueObjectSet = this.fable.Utility.getInternalValueByHash(pValueObjectSetAddress);
		return this.histogramAggregationByExactValue(tmpValueObjectSet, pValueAddress, pValueAmountAddress);
	}

	/**
	 * Given a value object set (an array of objects), find a specific entry when 
	 * sorted by a specific value address.  Supports -1 syntax for last entry.
	 * @param {Array} pValueObjectSet 
	 * @param {string} pValueAddress 
	 * @param {Object} pManifest 
	 */
	entryInSet(pValueObjectSet, pValueAddress, pEntryIndex)
	{
		const tmpEntryIndex = typeof pEntryIndex === 'number' ? pEntryIndex : parseInt(pEntryIndex);
		if (!Array.isArray(pValueObjectSet))
		{
			return pValueObjectSet;
		}

		if (!pValueAddress)
		{
			return false;
		}

		if (isNaN(tmpEntryIndex) || tmpEntryIndex >= pValueObjectSet.length)
		{
			return false;
		}

		let tmpValueArray = pValueObjectSet.toSorted((pLeft, pRight) => { return this.comparePrecise(pLeft[pValueAddress], pRight[pValueAddress]); });
		let tmpIndex = (tmpEntryIndex < 0) ? tmpValueArray.length + tmpEntryIndex : tmpEntryIndex;
		return tmpValueArray[tmpIndex];
	}

	/**
	 * Finds the smallest value in a set of objects based on a specified value address.
	 *
	 * @param {Object[]} pValueObjectSet - An array of objects to search through.
	 * @param {string} pValueAddress - The key or path used to access the value within each object.
	 * @returns {*} The smallest value found in the set at the specified value address.
	 */
	smallestInSet(pValueObjectSet, pValueAddress)
	{
		return this.entryInSet(pValueObjectSet, pValueAddress, 0);
	}

	/**
	 * Finds the largest value in a set of objects based on a specified value address.
	 *
	 * @param {Object[]} pValueObjectSet - An array of objects to search through.
	 * @param {string} pValueAddress - The address (key or path) within each object to compare values.
	 * @returns {*} The largest value found at the specified address in the set of objects.
	 */
	largestInSet(pValueObjectSet, pValueAddress)
	{
		return this.entryInSet(pValueObjectSet, pValueAddress, -1);
	}

	/**
	 * Expects an array of objects, and an address in each object to sum.  Expects 
	 * an address to put the cumulative summation as well.
	 * @param {Array} pValueObjectSet 
	 */
	cumulativeSummation(pValueObjectSet, pValueAddress, pCumulationResultAddress, pManifest)
	{
		if (!Array.isArray(pValueObjectSet))
		{
			return pValueObjectSet;
		}

		if (!pValueAddress || !pCumulationResultAddress)
		{
			return pValueObjectSet;
		}

		let tmpSummationValue = '0.0';
		for (let i = 0; i < pValueObjectSet.length; i++)
		{
			let tmpValue = this.parsePrecise(this.fable.Utility.getValueByHash(pValueObjectSet[i], pValueAddress, pManifest));

			if (isNaN(tmpValue))
			{
				this.fable.Utility.setValueByHash(pValueObjectSet[i], pCumulationResultAddress, tmpSummationValue, pManifest);
				continue;
			}

			tmpSummationValue = this.addPrecise(tmpValue, tmpSummationValue);
			this.fable.Utility.setValueByHash(pValueObjectSet[i], pCumulationResultAddress, tmpSummationValue, pManifest);
		}

		return pValueObjectSet;
	}

	/**
	 * Finds the maximum value from a set of precise values.
	 * 
	 * @param {Array|Object} pValueSet - The set of values to find the maximum from.
	 * @returns {number} - The maximum value from the set.
	 */
	maxPrecise(pValueSet)
	{
		let tmpMaxValue = NaN;
		if (Array.isArray(pValueSet))
		{
			for (let i = 0; i < pValueSet.length; i++)
			{
				if (!tmpMaxValue)
				{
					tmpMaxValue = this.parsePrecise(pValueSet[i], NaN);
				}
				else
				{
					let tmpComparisonValue = this.parsePrecise(pValueSet[i], NaN);
					if (this.gtPrecise(tmpComparisonValue, tmpMaxValue))
					{
						tmpMaxValue = tmpComparisonValue;
					}
				}
			}
		}
		else if (typeof (pValueSet) === 'object')
		{
			let tmpKeys = Object.keys(pValueSet);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				if (!tmpMaxValue)
				{
					tmpMaxValue = this.parsePrecise(pValueSet[tmpKeys[i]], NaN);
				}
				else
				{
					let tmpComparisonValue = this.parsePrecise(pValueSet[tmpKeys[i]], NaN);
					if (this.gtPrecise(tmpComparisonValue, tmpMaxValue))
					{
						tmpMaxValue = tmpComparisonValue;
					}
				}
			}
		}
		return tmpMaxValue;
	}

	/**
	 * Finds the minimum value from a set of values.
	 *
	 * @param {Array|Object} pValueSet - The set of values to find the minimum from.
	 * @returns {number} The minimum value from the set.
	 */
	minPrecise(pValueSet)
	{
		let tmpMinValue = NaN;
		if (Array.isArray(pValueSet))
		{
			for (let i = 0; i < pValueSet.length; i++)
			{
				if (!tmpMinValue)
				{
					tmpMinValue = this.parsePrecise(pValueSet[i], NaN);
				}
				else
				{
					let tmpComparisonValue = this.parsePrecise(pValueSet[i], NaN);
					if (!isNaN(tmpComparisonValue) && this.ltPrecise(tmpComparisonValue, tmpMinValue))
					{
						tmpMinValue = tmpComparisonValue;
					}
				}
			}
		}
		else if (typeof (pValueSet) === 'object')
		{
			let tmpKeys = Object.keys(pValueSet);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				if (!tmpMinValue)
				{
					tmpMinValue = this.parsePrecise(pValueSet[tmpKeys[i]], NaN);
				}
				else
				{
					let tmpComparisonValue = this.parsePrecise(pValueSet[tmpKeys[i]], NaN);
					if (!isNaN(tmpComparisonValue) && this.ltPrecise(tmpComparisonValue, tmpMinValue))
					{
						tmpMinValue = tmpComparisonValue;
					}
				}
			}
		}
		return tmpMinValue;
	}

	/**
	 * Calculates the precise sum of values in the given value set.
	 * 
	 * @param {Array|Object} pValueSet - The value set to calculate the sum from.
	 * @returns {string} The precise sum value as a string.
	 */
	sumPrecise(pValueSet)
	{
		let tmpSumValue = "0.0";
		if (Array.isArray(pValueSet))
		{
			for (let i = 0; i < pValueSet.length; i++)
			{
				let tmpComparisonValue = this.parsePrecise(pValueSet[i], NaN);
				if (!isNaN(tmpComparisonValue))
				{
					tmpSumValue = this.addPrecise(tmpSumValue, tmpComparisonValue);
				}
			}
		}
		else if (typeof (pValueSet) === 'object')
		{
			let tmpKeys = Object.keys(pValueSet);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				let tmpComparisonValue = this.parsePrecise(pValueSet[tmpKeys[i]], NaN);
				if (!isNaN(tmpComparisonValue))
				{
					tmpSumValue = this.addPrecise(tmpSumValue, tmpComparisonValue);
				}
			}
		}
		return tmpSumValue;
	}

	/**
	 * Calculates the precise mean of a given value set.
	 *
	 * @param {Array<number>} pValueSet - The array of values to calculate the mean.
	 * @returns {string} The precise mean value as a string.
	 */
	meanPrecise(pValueSet)
	{
		let tmpSumValue = this.sumPrecise(pValueSet);
		let tmpCount = this.countSetElements(pValueSet);
		if (tmpCount == 0)
		{
			return '0.0';
		}
		return this.dividePrecise(tmpSumValue, tmpCount);
	}

	/**
	 * Calculates the average of an array of values precisely.
	 *
	 * @param {Array<number>} pValueSet - The array of values to calculate the average of.
	 * @returns {number} The precise average of the values.
	 */
	averagePrecise(pValueSet)
	{
		return this.meanPrecise(pValueSet);
	}

	/**
	 * Calculates the precise median value of a given value set.
	 *
	 * @param {Array<number>} pValueSet - The array of values to calculate the median from.
	 * @returns {number|string} - The median value of the given value set. If the value set is empty, returns '0.0'.
	 */
	medianPrecise(pValueSet)
	{
		let tmpCount = this.countSetElements(pValueSet);
		// If there are no elements, return 0 ... should this be NaN?
		if (tmpCount == 0)
		{
			return '0.0';
		}

		let tmpSortedValueSet = this.sortSetPrecise(pValueSet);
		let tmpMiddleElement = Math.floor(tmpCount / 2);

		// If the count is odd, return the middle element
		if (tmpCount % 2 == 1)
		{
			return tmpSortedValueSet[tmpMiddleElement];
		}
		// If the count is even, return the average of the two middle elements
		else
		{
			let tmpLeftMiddleValue = tmpSortedValueSet[tmpMiddleElement - 1];
			let tmpRightMiddleValue = tmpSortedValueSet[tmpMiddleElement];
			return this.dividePrecise(this.addPrecise(tmpLeftMiddleValue, tmpRightMiddleValue), 2);
		}
	}

	/**
	 * Calculates the mode (most frequently occurring value) of a given value set using precise mode calculation.
	 * 
	 * @param {Array} pValueSet - The array of values to calculate the mode from.
	 * @returns {Array} - An array containing the mode value(s) from the given value set.
	 */
	modePrecise(pValueSet)
	{
		let tmpHistogram = this.bucketSetPrecise(pValueSet);
		let tmpMaxCount = 0;

		// Philosophical question about whether the values should be returned sorted.
		let tmpHistogramValueSet = Object.keys(tmpHistogram);

		let tmpModeValueSet = [];

		for (let i = 0; i < tmpHistogramValueSet.length; i++)
		{
			if (tmpHistogram[tmpHistogramValueSet[i]] > tmpMaxCount)
			{
				tmpMaxCount = tmpHistogram[tmpHistogramValueSet[i]];
				tmpModeValueSet = [tmpHistogramValueSet[i]];
			}
			else if (tmpHistogram[tmpHistogramValueSet[i]] == tmpMaxCount)
			{
				tmpModeValueSet.push(tmpHistogramValueSet[i]);
			}
		}

		return tmpModeValueSet;
	}
}

module.exports = FableServiceMath;
