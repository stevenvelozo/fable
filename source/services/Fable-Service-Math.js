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
		this.bigNumber = this.fable.Utility.bigNumber;

		this.ln2Cache = new Map();
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
	get roundDown() { return this.bigNumber.roundDown; }
	get roundHalfUp() { return this.bigNumber.roundHalfUp; }
	get roundHalfEven() { return this.bigNumber.roundHalfEven; }
	get roundUp() { return this.bigNumber.roundUp; }

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
			tmpNumber = new this.bigNumber(pValue);
		}
		catch (pError)
		{
			// TODO: This seems more correct -- we can add a silent or noisy parameter if we want this to export.
			//       Reason: Currently this is absolutely obliterating logs in the data integrations from bad data sources.
			//this.log.warn(`Error parsing number (type ${typeof (pValue)}): ${pError}`);
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
	 * Begins an expression with the given value. For performing colon operations in the solver.
	 * @param {*} pValue - The value to begin the expression with.
	 * @returns {*} The begun expression value.
	 */
	expressionBegin(pValue)
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

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
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

		let tmpArbitraryValue = new this.bigNumber(tmpValue);
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
		let tmpDecimals = isNaN(pDecimals) ? 0 : parseInt(pDecimals, 10);
		let tmpRoundingMethod = (typeof (pRoundingMethod) === 'undefined') ? this.roundHalfUp : pRoundingMethod;

		let tmpArbitraryValue = new this.bigNumber(tmpValue);
		let tmpResult = tmpArbitraryValue.toFixed(tmpDecimals, tmpRoundingMethod);

		return tmpResult.toString();
	}

	/**
	 * Adds two values precisely.
	 * @param {number|string} pLeftValue - The left value to be added.
	 * @param {number|string} pRightValue - The right value to be added.
	 * @returns {string} - The result of adding the two values as a string.
	 */
	addPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.plus(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Subtracts two values precisely.
	 *
	 * @param {number|string} pLeftValue - The left value to subtract.
	 * @param {number|string} pRightValue - The right value to subtract.
	 * @returns {string} The result of the subtraction as a string.
	 */
	subtractPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
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
			const tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
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
	 * @param {number|string} pLeftValue - The left value to multiply.
	 * @param {number|string} pRightValue - The right value to multiply.
	 * @returns {string} The result of the multiplication as a string.
	 */
	multiplyPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.times(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Divides two values precisely.
	 *
	 * @param {number|string} pLeftValue - The left value to be divided.
	 * @param {number|string} pRightValue - The right value to divide by.
	 * @returns {string} The result of the division as a string.
	 */
	dividePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.div(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Calculates the modulus of two values with precision.
	 *
	 * @param {number|string} pLeftValue - The left value.
	 * @param {number|string} pRightValue - The right value.
	 * @returns {string} The result of the modulus operation as a string.
	 */
	modPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		let tmpResult = tmpLeftArbitraryValue.mod(tmpRightValue);
		return tmpResult.toString();
	}

	/**
	 * Calculates the square root of a number with precise decimal places.
	 *
	 * @param {number|string} pValue - The number to calculate the square root of.
	 * @returns {string} The square root of the input number as a string.
	 */
	sqrtPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpValue);
		let tmpResult = tmpLeftArbitraryValue.sqrt();
		return tmpResult.toString();
	}

	/**
	 * Calculates the absolute value of a number precisely.
	 *
	 * @param {number|string} pValue - The number to calculate the absolute value of.
	 * @returns {string} The absolute value of the input number as a string.
	 */
	absPrecise(pValue)
	{
		let tmpValue = isNaN(pValue) ? 0 : pValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpValue);
		let tmpResult = tmpLeftArbitraryValue.abs();
		return tmpResult.toString();
	}

	/**
	 * Calculates the floor of a number precisely.
	 *
	 * @param {string|number} pValue - The number to calculate the floor value of.
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
	 * @param {number|string} pValue - The number to calculate the ceiling value of.
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

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
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

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
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
	 * @param {number|string} pLeftValue - The left value to compare.
	 * @param {number|string} pRightValue - The right value to compare.
	 * @returns {boolean} - Returns true if the left value is greater than the right value, otherwise returns false.
	 */
	gtPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.gt(tmpRightValue);
	}

	/**
	 * Checks if the left value is greater than or equal to the right value.
	 * If either value is not a number, it is treated as 0.
	 *
	 * @param {number|string} pLeftValue - The left value to compare.
	 * @param {number|string} pRightValue - The right value to compare.
	 * @returns {boolean} - True if the left value is greater than or equal to the right value, false otherwise.
	 */
	gtePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.gte(tmpRightValue);
	}

	/**
	 * Determines if the left value is less than the right value precisely.
	 *
	 * @param {number|string} pLeftValue - The left value to compare.
	 * @param {number|string} pRightValue - The right value to compare.
	 * @returns {boolean} - Returns true if the left value is less than the right value, otherwise returns false.
	 */
	ltPrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.lt(tmpRightValue);
	}

	/**
	 * Determines if the left value is less than or equal to the right value.
	 *
	 * @param {number|string} pLeftValue - The left value to compare.
	 * @param {number|string} pRightValue - The right value to compare.
	 * @returns {boolean} - Returns true if the left value is less than or equal to the right value, otherwise returns false.
	 */
	ltePrecise(pLeftValue, pRightValue)
	{
		let tmpLeftValue = isNaN(pLeftValue) ? 0 : pLeftValue;
		let tmpRightValue = isNaN(pRightValue) ? 0 : pRightValue;

		let tmpLeftArbitraryValue = new this.bigNumber(tmpLeftValue);
		return tmpLeftArbitraryValue.lte(tmpRightValue);
	}

	/**
	 * Converts degrees to radians with arbitrary precision.
	 *
	 * @param {number|string} pDegrees - The degrees to convert to radians.
	 * @returns {string} - The converted radians as a string.
	 */
	radPrecise(pDegrees)
	{
		let tmpDegrees = isNaN(pDegrees) ? 0 : pDegrees;

		let tmpDegreesArbitraryValue = new this.bigNumber(tmpDegrees);
		// TODO: Const for pi in arbitrary precision?
		let tmpResult = tmpDegreesArbitraryValue.times(Math.PI).div(180);
		return tmpResult.toString();
	}

	/**
	 * Calculates the value of pi with the specified precision.
	 * If no precision is provided, returns 100 digits after the decimal.
	 *
	 * @param {number|string} [pPrecision] - The precision to use for calculating pi.
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
	 * @param {number|string} [pPrecision] - The precision to use for calculating E.
	 * @returns {string} - The calculated value of E.
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
	 * @param {number} [pBucketSize] - The size of each bucket. Optional - If NaN, the values will be bucketized by their value.
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
		let tmpSortedHistogram = {};
		let tmpKeys = Object.keys(pHistogram);

		tmpKeys.sort((pLeft, pRight) => { return pHistogram[pLeft] - pHistogram[pRight]; });

		for (let i = 0; i < tmpKeys.length; i++)
		{
			tmpSortedHistogram[tmpKeys[i]] = pHistogram[tmpKeys[i]];
		}

		return tmpSortedHistogram;
	}

	/**
	 * Sorts the histogram object in ascending order based on the keys.
	 *
	 * @param {Object} pHistogram - The histogram object to be sorted.
	 * @returns {Object} - The sorted histogram object.
	 */
	sortHistogramByKeys(pHistogram, pDescending)
	{
		let tmpSortedHistogram = {};
		let tmpKeys = Object.keys(pHistogram);
		let tmpDescending = (typeof (pDescending) === 'undefined') ? false : pDescending;

		// Sort tmpKeys by the string comparison
		tmpKeys.sort();

		if (tmpDescending)
		{
			tmpKeys = tmpKeys.reverse();
		}

		for (let i = 0; i < tmpKeys.length; i++)
		{
			tmpSortedHistogram[tmpKeys[i]] = pHistogram[tmpKeys[i]];
		}

		return tmpSortedHistogram;
	}

	cleanValueArray(pValueArray, pRemoveZeroes)
	{
		let tmpRemoveZeroes = (typeof (pRemoveZeroes) === 'undefined') ? false : pRemoveZeroes;

		if (!Array.isArray(pValueArray))
		{
			return [];
		}

		let tmpCleanedArray = [];
		for (let i = 0; i < pValueArray.length; i++)
		{
			let tmpValue = this.parsePrecise(pValueArray[i], NaN);
			if (!isNaN(tmpValue) && (!tmpRemoveZeroes || (tmpValue != "0")))
			{
				tmpCleanedArray.push(tmpValue);
			}
		}
		return tmpCleanedArray;
	}

	/**
	 * Calculate the natural log of 2 to a specific precision, for use in the Taylor series.
	 * Cache outcome so it only runs once per precision.
	 * @param {number} pPrecision - The decimal precision to calculate ln(2) to.
	 * @returns
	 */
	arbitraryNaturalLogOfTwo(pPrecision)
	{
		const tmpPrecisionKey = pPrecision | 0;
		const tmpPrecision = new this.bigNumber(tmpPrecisionKey);
		if (this.ln2Cache.has(tmpPrecisionKey))
		{
			return this.ln2Cache.get(tmpPrecisionKey);
		}

		const tmpTwoConstant = new this.bigNumber(2);
		const y = tmpTwoConstant.minus(1).div(tmpTwoConstant.plus(1)); // 1/3
		const y2 = y.mul(y);
		let tmpSummation = new this.bigNumber(0);
		let tmpTermination = y;
		let tmpDenominator = 1;

		// Use a slightly larger precision for this to prevent numeric drift for larger log requirements
		const tmpEpsilon = this.powerPrecise(10, -(tmpPrecision.add(8))); // target tail < 10^-(precision+8)

		for (let i = 0; i < 200000; i++)
		{
			tmpSummation = tmpSummation.plus(tmpTermination.div(tmpDenominator));
			tmpTermination = tmpTermination.mul(y2);
			tmpDenominator += 2;
			if (tmpTermination.abs().div(tmpDenominator).lt(tmpEpsilon))
			{
				break;
			}
		}
		const tmpNaturalLogOfTwo = tmpSummation.mul(2);
		this.ln2Cache.set(tmpPrecisionKey, tmpNaturalLogOfTwo);
		return tmpNaturalLogOfTwo;
	}

	/**
	 * Calculate the natural log of a number to a specific precision using arbitrary precision numbers.
	 * @param {number} pNumberToCompute
	 * @param {number} pPrecision
	 * @returns
	 */
	arbitraryNaturalLog(pNumberToCompute, pPrecision)
	{
		let tmpNumberToCompute = new this.bigNumber(pNumberToCompute);
		let tmpPrecision = new this.bigNumber(pPrecision);

		if (tmpNumberToCompute.lte(0)) throw new Error('ln undefined for non-positive values.');
		if (tmpNumberToCompute.eq(1)) return new this.bigNumber(0);

		// Reduce x to m in ~[0.75, 1.5] by multiplying/dividing by 2
		const TWO = new this.bigNumber(2);
		let k = 0;
		let m = tmpNumberToCompute;

		const tmpUpperBounds = new this.bigNumber('1.5');
		const tmpLowerBounds = new this.bigNumber('0.75');

		while (m.gt(tmpUpperBounds))
		{
			m = m.div(TWO); k += 1;
		}
		while (m.lt(tmpLowerBounds))
		{
			m = m.mul(TWO); k -= 1;
		}

		// ln(m) via atanh/Taylor
		const y = m.minus(1).div(m.plus(1)); // |y| < 1
		const y2 = y.mul(y);

		let tmpSummation = new this.bigNumber(0);
		let tmpSeriesTermination = y; // y^(2j+1)
		let tmpDenominator = 1;

		const tmpEpsilon = this.powerPrecise(10, -(tmpPrecision.add(6))); // target tail < 10^-(precision+6)

		// Iterate until next term contribution is below eps
		for (let i = 0; i < 200000; i++)
		{
			tmpSummation = tmpSummation.plus(tmpSeriesTermination.div(tmpDenominator));
			tmpSeriesTermination = tmpSeriesTermination.mul(y2);
			tmpDenominator += 2;
			// Stop when |tmpSeriesTermination|/tmpDenominator < eps
			if (tmpSeriesTermination.abs().div(tmpDenominator).lt(tmpEpsilon))
			{
				break;
			}
		}
		const tmpNaturalLog = tmpSummation.mul(2);

		// ln(2) once per precision via same series with m=2 (y = 1/3 ==> for faster convergence)
		const tmpPrecisionNaturalLog = this.arbitraryNaturalLogOfTwo(tmpPrecision);

		return tmpNaturalLog.plus(tmpPrecisionNaturalLog.mul(k));
	}

	/**
	 * High-precision natural log using:
	 *  - Argument reduction by powers of 2: x = m * 2^k with m ~ 1
	 *  - atanh series: ln(m) = 2 * sum_{j>=0} y^(2j+1)/(2j+1), y=(m-1)/(m+1), |y|<1
	 *
	 * Converges rapidly when m is close to 1 with arbitrary precision numbers.
	 *
	 * @param {number} pNumberToGenerateLogarithmFor - The number to generate the logarithm for.
	 * @param {number} [pBase] - The base of the logarithm. Defaults to 10.
	 * @param {number} [pPrecision] - The precision of the result. Defaults to 9 decimal places.
	 * @returns {string} - The logarithm of the number to the specified base and precision.
	 */
	logPrecise(pNumberToGenerateLogarithmFor, pBase, pPrecision)
	{
		let tmpBase = (typeof (pBase) === 'undefined') ? this.bigNumber(10) : this.bigNumber(pBase);
		// Default precision is 9 decimal places -- matches Excel's default for LOG function
		const tmpPrecision = (typeof (pPrecision) === 'undefined') ? 9 : pPrecision;
		// Extra precision to avoid rounding errors since we are using a series
		const tmpExtraPrecision = 8;
		const tmpWorkingPrecision = tmpPrecision + tmpExtraPrecision;

		// Store existing precision since this function integrates on a its own precision terms
		const tmpSavedBigDecimalPrecision = this.bigNumber.DP;
		const tmpSavedBigRoundingMethod = this.bigNumber.RM;

		this.bigNumber.DP = tmpWorkingPrecision;
		this.bigNumber.RM = 1; // round half up for the Taylor series

		const N = this.bigNumber(pNumberToGenerateLogarithmFor);
		const B = this.bigNumber(tmpBase);

		// Run domain checks, which Excel also does
		if (N.lte(0))
		{
			this.log.error(`Fable logPrecise Error: Number must be greater than 0; number was ${pNumberToGenerateLogarithmFor}.`);
			return NaN;
		}
		if (B.lte(0) || B.eq(1))
		{
			this.log.error(`Fable logPrecise Error: Base must be greater than 0 and not equal to 1 -- base ${Base} was passed in.`);
			return NaN;
		}

		const tmpNaturalLogOfN = this.arbitraryNaturalLog(N, tmpPrecision);
		const tmpNaturalLogOfB = this.arbitraryNaturalLog(B, tmpPrecision);

		const tmpResult = tmpNaturalLogOfN.div(tmpNaturalLogOfB);

		// Final rounding to requested precision
		let finalResult = tmpResult.toFixed(tmpPrecision);
		this.bigNumber.DP = tmpSavedBigDecimalPrecision;
		this.bigNumber.RM = tmpSavedBigRoundingMethod;
		return finalResult;
	}

	expPrecise(pValue, pDecimalPrecision)
	{
		let tmpValue = isNaN(pValue) ? this.bigNumber(1) : this.bigNumber(pValue);

		// Constants & thresholds (Excel / IEEE-754 double limits) -- this is required to match Excel's behavior
		const tmpDecimalPrecision = (typeof (pDecimalPrecision) === 'undefined') ? 9 : parseInt(pDecimalPrecision, 10);
		const tmpSavedBigDecimalPrecision = this.bigNumber.DP;
		this.bigNumber.DP = tmpDecimalPrecision + 10; // a bit of extra precision for rounding safety (this makes it match excel)

		// ln(2), min/max natural logs before double overflow/underflow
		const tmpNaturalLogOfTwo = new this.bigNumber('0.693147180559945309417232121458176568'); // This is hilarious that we can compute the value above but this is what Excel uses.
		const tmpNaturalLogMaxDouble = new this.bigNumber('709.782712893384'); // ln(1.7976931348623157e308)
		const tmpNaturalLogMinimumValue = new this.bigNumber('-744.4400719213812'); // ln(5e-324)

		// 1. Guard for Overflow / underflow behavior to match Excel
		if (tmpValue.gt(tmpNaturalLogMaxDouble))
		{
			this.bigNumber.DP = tmpSavedBigDecimalPrecision;
			return NaN; // Excel shows #NUM! when result overflows we will use NaN
		}
		if (tmpValue.lt(tmpNaturalLogMinimumValue))
		{
			this.bigNumber.DP = tmpSavedBigDecimalPrecision;
			return new this.bigNumber(0); // Excel underflows to 0
		}

		// 2. Perform Range reduction: x = k*ln2 + r, with r small
		// k = floor(x / ln2)
		let k;
		try
		{
			k = tmpValue.div(tmpNaturalLogOfTwo).round(0, 0 /* RoundDown toward -infinity */); // floor for positives & negatives
		}
		catch(pErrorRounding)
		{
			this.log.error(`Fable expPrecise Error: Rounding error during range reduction for value of ${pValue}.  Error: ${pErrorRounding}`);
			this.bigNumber.DP = tmpSavedBigDecimalPrecision;
			return NaN;
		}
		const r = tmpValue.minus(k.times(tmpNaturalLogOfTwo));

		// Compute exp(r) via Taylor series with Big arithmetic
		// exp(r) = Summation of r^n / n!, n=0..infinity
		// Sum until termination is below tolerance based on decimal precision
		const tmpTolerance = new this.bigNumber(10).pow(-(tmpDecimalPrecision + 2));
		let tmpTermination = new this.bigNumber(1); // r^0/0! = 1
		let tmpSummation = new this.bigNumber(1);
		let n = 1;

		// 3. Multiply incrementally: term *= r / n
		// SOOOOO close to a fractal!
		while (true)
		{
			tmpTermination = tmpTermination.times(r).div(n);
			if (tmpTermination.abs().lt(tmpTolerance)) break;
			tmpSummation = tmpSummation.plus(tmpTermination);
			n++;
			// Hard safety cap for pathological inputs (shouldn’t be possible with step 2's range reduction):
			if (n > 2000)
			{
				this.log.warn(`Fable expPrecise warning: Taylor series failed to converge after 2000 iterations for value of ${pValue}.`);
				break;
			}
		}

		// 4. Recompose: exp(x) = 2^k * exp(r)
		const tmpTwo = new this.bigNumber(2);
		const tmpAbsoluteValueOfK = k.abs().toNumber(); // k is integer; big.js pow requires a JS integer
		let tmpTwoToThePowerOfAbsoluteK = tmpAbsoluteValueOfK === 0 ? new this.bigNumber(1) : tmpTwo.pow(tmpAbsoluteValueOfK);
		const tmpResult = k.gte(0) ? tmpSummation.times(tmpTwoToThePowerOfAbsoluteK) : tmpSummation.div(tmpTwoToThePowerOfAbsoluteK);

		// 5. Restore global decimal precision
		this.bigNumber.DP = tmpSavedBigDecimalPrecision;
		return tmpResult.round(tmpDecimalPrecision).toString();
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
	 *
	 * @param {Array} pValueObjectSet - The array of objects to perform a cumulative summation on
	 * @param {string} pValueAddress - The address of the column in each object to sum
	 * @param {string} pCumulationResultAddress - The address in each object to put the cumulative summation result
	 * @param {Object} pManifest - The manifest to use for value retrieval and setting
	 * @returns {Array} The updated value object set with cumulative summation results.
	 */
	cumulativeSummation(pValueObjectSet, pValueAddress, pCumulationResultAddress, pManifest)
	{
		return this.iterativeSeries(pValueObjectSet, pValueAddress, pCumulationResultAddress, "1.0", "add", "0.0", true, pManifest);
	}

	/**
	 * Expects an array of objects, and an address in each object to sum.  Expects
	 * an address to put the cumulative summation as well.
	 *
	 * @param {Array} pValueObjectSet - The array of objects to perform a cumulative summation on
	 * @param {string} pValueAddress - The address of the column in each object to sum
	 * @param {string} pCumulationResultAddress - The address in each object to put the cumulative summation result
	 * @param {string} pStartingValue - The (optional) address of the value to start with
	 * @param {Object} pManifest - The manifest to use for value retrieval and setting
	 * @returns {Array} The updated value object set with cumulative summation results.
	 */
	subtractingSummation(pValueObjectSet, pValueAddress, pCumulationResultAddress, pStartingValue, pManifest)
	{
		let tmpProcessFirstRow = true;
		// If the starting value comes from somewhere else, we want to subtract the first row from it.
		if (typeof (pStartingValue) === 'undefined' || pStartingValue === null)
		{
			tmpProcessFirstRow = false;
		}
		return this.iterativeSeries(pValueObjectSet, pValueAddress, pCumulationResultAddress, "1.0", "subtract", pStartingValue, tmpProcessFirstRow, pManifest);
	}

	/**
	 * Expects an array of objects, and an address in each object to perform an iterative mathematical operation on.

	 * @param {Array} pValueObjectSet - The array of objects to perform a cumulative summation on
	 * @param {string} pValueAddress - The address of the column in each object to sum
	 * @param {string} pValueMultiplier - The multiplier to apply to each value before summation
	 * @param {string} pSummationOperation - The operation to perform for summation: +, -, *, / (and some textual equivalents)
	 * @param {string} pCumulationResultAddress - The address in each object to put the cumulative summation result
	 * @param {string} pStartingValue - The address of the value to process from; defaults to the first row
	 * @param {boolean} pProcessFirstRowWithAValue - Whether to process the first row's value from all subsequent rows
	 * @param {Object} pManifest - The manifest to
	 * @returns {Array} The updated value object set with cumulative summation results.
	 */
	iterativeSeries(pValueObjectSet, pValueAddress, pCumulationResultAddress, pValueMultiplier, pSummationOperation, pStartingValue, pProcessFirstRowWithAValue, pManifest)
	{
		if (!Array.isArray(pValueObjectSet))
		{
			return pValueObjectSet;
		}

		if (!pValueAddress || !pCumulationResultAddress)
		{
			return pValueObjectSet;
		}

		// By default don't subtract the first row from the value
		let tmpProcessFirstRow = (typeof(pProcessFirstRowWithAValue) === 'undefined') ? false : pProcessFirstRowWithAValue;

		let tmpValueMultiplier;
		if (pValueMultiplier && pValueMultiplier !== '')
		{
			tmpValueMultiplier = this.parsePrecise(pValueMultiplier);
		}
		if (isNaN(tmpValueMultiplier))
		{
			tmpValueMultiplier = this.parsePrecise("1.0");
		}

		// Default to start from the current value address
		let tmpSummationValue;
		// This logic ensures we don't default to 0 when pStartingValue is an empty string
		if (pStartingValue || (pStartingValue !== ''))
		{
			tmpSummationValue = this.parsePrecise(pStartingValue);
		}
		if (isNaN(tmpSummationValue) || typeof(pStartingValue) === 'undefined' || pStartingValue === null)
		{
			tmpSummationValue = '';
		}

		for (let i = 0; i < pValueObjectSet.length; i++)
		{
			let tmpValue = this.parsePrecise(this.fable.Utility.getValueByHash(pValueObjectSet[i], pValueAddress, pManifest));
			// Since summation might start on a row after the first,
			let tmpFirstRowWithValue = false;
			if ((tmpSummationValue === '') && tmpValue && !isNaN(tmpSummationValue))
			{
				// Try to grab the summation value from the first row with a value
				tmpSummationValue = tmpValue;
				tmpFirstRowWithValue = true;
			}

			// Continue on with the values as they are if the current row doesn't have a change
			if (isNaN(tmpValue))
			{
				this.fable.Utility.setValueByHash(pValueObjectSet[i], pCumulationResultAddress, tmpSummationValue, pManifest);
				continue;
			}

			tmpValue = this.multiplyPrecise(tmpValue, tmpValueMultiplier);

			// Now perform the operation
			if (!tmpFirstRowWithValue || tmpProcessFirstRow)
			{
				switch (pSummationOperation)
				{
					case '+':
					case 'add':
					case 'plus':
					case 'addition':
						tmpSummationValue = this.addPrecise(tmpSummationValue, tmpValue);
						break;

					case '-':
					case 'sub':
					case 'minus':
					case 'subtract':
						tmpSummationValue = this.subtractPrecise(tmpSummationValue, tmpValue);
						break;

					case '*':
					case 'mul':
					case 'times':
					case 'multiply':
						tmpSummationValue = this.multiplyPrecise(tmpSummationValue, tmpValue);
						break;

					case '-':
					case 'div':
					case 'over':
					case 'divide':
						tmpSummationValue = this.dividePrecise(tmpSummationValue, tmpValue);
						break;
				}
			}
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

	/**
	 * Performs an nth degree polynomial regression on the given data points.
	 *
	 * @param {Array<number|string>} pXVector - The x-coordinates of the data points.
	 * @param {Array<number|string>} pYVector - The y-coordinates of the data points.
	 * @param {number} [pDegree=2] - The degree of the polynomial to fit.
	 *
	 * @return {Array<number|string>} The coefficients of the fitted polynomial, starting from the constant term.
	 */
	polynomialRegression(pXVector, pYVector, pDegree = 2)
	{
		const n = pDegree;
		const tmpXMatrix = [];
		const tmpYVector = pYVector;

		// Build Vandermonde matrix
		for (let i = 0; i < pXVector.length; ++i)
		{
			const row = [];
			for (let j = 0; j <= n; j++)
			{
				row.push(this.powerPrecise(pXVector[i], j));
			}
			tmpXMatrix.push(row);
		}

		// Compute coefficients
		const X_T = this.matrixTranspose(tmpXMatrix);
		const XTX = this.matrixMultiply(X_T, tmpXMatrix);
		const XTY = this.matrixMultiply(X_T, tmpYVector.map(v => [v]));
		const XTX_inv = this.matrixInverse(XTX);
		const A = this.matrixMultiply(XTX_inv, XTY);

		// Flatten coefficients
		return A.map((row) => row[0]);
	}

	/**
	 * Compute least squares regression coefficients for multivariable linear interpolation.
	 *
	 * @param {Array<Array<number|string>> | Array<number|string> | string} pIndependentVariableVectors - array of arrays [[x11, x12, ...], [x21, x22, ...], ...] or single array for single variable.
	 * @param {Array<number|string>|string} pDependentVariableVector - array of target values [y1, y2, ...]
	 *
	 * @return {Array<number|string>} - linear coefficients [b0, b1, ..., bn] where y = b0 + b1*x1 + b2*x2 + ... + bn*xn
	 */
	leastSquares(pIndependentVariableVectors, pDependentVariableVector)
	{
		const tmpIndependentVariableVectors = Array.isArray(pIndependentVariableVectors) ? (Array.isArray(pIndependentVariableVectors[0]) ? this.matrixTranspose(pIndependentVariableVectors) : pIndependentVariableVectors.map(value => [value])) : [ [ pIndependentVariableVectors ] ];
		const tmpDependentVariableVector = Array.isArray(pDependentVariableVector) ? pDependentVariableVector : [ pDependentVariableVector ];
		if (tmpIndependentVariableVectors.length  === 1)
		{
			// degenerate case: only one independent variable value, result is just a y-intercept
			return [ tmpDependentVariableVector[0], '0.0' ];
		}
		// Add bias term (intercept)
		const tmpIndependentVariableMatrixWithBiasTerm = tmpIndependentVariableVectors.map(row => [1, ...row]);

		// Compute X^T * X
		const tmpIndependentTermTranpose = this.matrixTranspose(tmpIndependentVariableMatrixWithBiasTerm);
		const tmpDependentTransposeMultiplication = this.matrixMultiply(tmpIndependentTermTranpose, tmpIndependentVariableMatrixWithBiasTerm);

		// Compute X^T * y
		const tmpIndependentTransposeMultiplication = this.matrixVectorMultiply(tmpIndependentTermTranpose, tmpDependentVariableVector);

		// Solve (XtX) * beta = Xty
		const tmpLinearCoefficients = this.gaussianElimination(tmpDependentTransposeMultiplication, tmpIndependentTransposeMultiplication);

		return tmpLinearCoefficients;
	}

	/**
	 * Helper function to transpose a matrix
	 *
	 * @param {Array<Array<number|string>>} pInputMatrix - matrix to transpose
	 *
	 * @return {Array<Array<number|string>>} - transposed matrix
	 */
	matrixTranspose(pInputMatrix)
	{
		return pInputMatrix[0].map((_, i) => pInputMatrix.map((row) => row[i]));
	}

	matrixMultiply(pLHSMatrix, pRHSMatrix)
	{
		const result = Array(pLHSMatrix.length)
			.fill(0)
			.map(() => Array(pRHSMatrix[0].length).fill(0));
		for (let i = 0; i < pLHSMatrix.length; ++i)
		{
			for (let j = 0; j < pRHSMatrix[0].length; ++j)
			{
				for (let k = 0; k < pRHSMatrix.length; ++k)
				{
					result[i][j] = this.addPrecise(result[i][j], this.multiplyPrecise(pLHSMatrix[i][k], pRHSMatrix[k][j]));
				}
			}
		}
		return result;
	}

	/**
	 * @param {Array<Array<number|string>>} pMatrix - matrix to multiply
	 * @param {Array<number|string>} pVector - vector to multiply
	 *
	 * @return {Array<number|string>} - result vector
	 */
	matrixVectorMultiply(pMatrix, pVector)
	{
		const result = Array(pMatrix.length).fill(0);
		for (let i = 0; i < pMatrix.length; ++i)
		{
			for (let j = 0; j < pMatrix[0].length; ++j)
			{
				result[i] = this.addPrecise(result[i], this.multiplyPrecise(pMatrix[i][j], pVector[j]));
			}
		}
		return result;
	}

	/**
	 * Matrix inverse (using Gaussian elimination)
	 *
	 * @param {Array<Array<number|string>>} pMatrix - matrix to invert
	 *
	 * @return {Array<Array<number|string>>} - inverted matrix
	 */
	matrixInverse(pMatrix)
	{
		const n = pMatrix.length;
		const tmpIdentityMatrix = pMatrix.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
		const tmpAugmentedMatrix = pMatrix.map((row, i) => row.concat(tmpIdentityMatrix[i]));

		for (let i = 0; i < n; ++i)
		{
			// Pivot
			let maxRow = i;
			for (let k = i + 1; k < n; ++k)
			{
				if (this.gtPrecise(this.absPrecise(tmpAugmentedMatrix[k][i]), this.absPrecise(tmpAugmentedMatrix[maxRow][i])))
				{
					maxRow = k;
				}
			}
			[tmpAugmentedMatrix[i], tmpAugmentedMatrix[maxRow]] = [tmpAugmentedMatrix[maxRow], tmpAugmentedMatrix[i]];

			// divide by pivot
			const tmpPivotValue = tmpAugmentedMatrix[i][i];
			for (let j = 0; j < 2 * n; ++j)
			{
				tmpAugmentedMatrix[i][j] = this.dividePrecise(tmpAugmentedMatrix[i][j], tmpPivotValue);
			}

			// Eliminate other rows
			for (let k = 0; k < n; ++k)
			{
				if (k === i)
				{
					continue;
				}
				const tmpFactor = tmpAugmentedMatrix[k][i];
				for (let j = 0; j < 2 * n; ++j)
				{
					tmpAugmentedMatrix[k][j] = this.subtractPrecise(tmpAugmentedMatrix[k][j], this.multiplyPrecise(tmpFactor, tmpAugmentedMatrix[i][j]));
				}
			}
		}

		// Extract right half (inverse)
		return tmpAugmentedMatrix.map((row) => row.slice(n));
	}


	/**
	 * Compute solution to linear system using Gaussian elimination.
	 *
	 * @param {Array<Array<number|string>>} pCoefficientMatrix - Coefficient matrix
	 * @param {Array<number|string>} pVector - Right-hand side vector
	 *
	 * @return {Array<number|string>} - Solution vector x
	 */
	gaussianElimination(pCoefficientMatrix, pVector)
	{
		// Solve A*x = b using Gaussian elimination
		const n = pCoefficientMatrix.length;
		const tmpAugmentedMatrix = pCoefficientMatrix.map((row, i) => [...row, pVector[i]]);

		for (let i = 0; i < n; ++i)
		{
			// Pivot
			let maxRow = i;
			for (let k = i + 1; k < n; ++k)
			{
				if (this.gtPrecise(this.absPrecise(tmpAugmentedMatrix[k][i]), this.absPrecise(tmpAugmentedMatrix[maxRow][i])))
				{
					maxRow = k;
				}
			}
			const tmpSwapValue = tmpAugmentedMatrix[i];
			tmpAugmentedMatrix[i] = tmpAugmentedMatrix[maxRow];
			tmpAugmentedMatrix[maxRow] = tmpSwapValue;

			// Normalize pivot row
			const tmpPivotValue = tmpAugmentedMatrix[i][i];
			if (this.comparePrecise(tmpPivotValue, 0) == 0)
			{
				throw new Error('Matrix not invertible');
			}
			for (let j = i; j <= n; ++j)
			{
				tmpAugmentedMatrix[i][j] = this.dividePrecise(tmpAugmentedMatrix[i][j], tmpPivotValue);
			}

			// Eliminate other rows
			for (let k = 0; k < n; ++k)
			{
				if (k === i)
				{
					continue;
				}
				const tmpFactor = tmpAugmentedMatrix[k][i];
				for (let j = i; j <= n; ++j)
				{
					tmpAugmentedMatrix[k][j] = this.subtractPrecise(tmpAugmentedMatrix[k][j], this.multiplyPrecise(tmpFactor, tmpAugmentedMatrix[i][j]));
				}
			}
		}

		// Extract solution
		return tmpAugmentedMatrix.map((row) => row[n]);
	}

	generateValueFromEasingDescription(pEasingConfiguration)
	{
		// Branch based on type
		switch (pEasingConfiguration.Easing)
		{
			case 'LINEAR':
			default:
				let tmpDomainRange = pEasingConfiguration.DomainLength;

				if (this.comparePrecise(tmpDomainRange, 0) == 0)
				{
					return this.parsePrecise(pEasingConfiguration.DomainRangeStart);
				}

				// Now, generate a random number and then multiply it to fit in the domain length
				let tmpRandomFraction = Math.random();
				// Scale it to the domain
				let tmpScaledValue = this.multiplyPrecise(tmpRandomFraction, tmpDomainRange);
				// Shift it to the range start
				return this.addPrecise(pEasingConfiguration.DomainRangeStart, tmpScaledValue);
		}
	}

	/**
	 * Predicts the dependent variable using a regression model.
	 *
	 * @param {Array<number|string>} pRegressionCoefficients - The regression coefficients [b0, b1, ..., bn].
	 * @param {Array<number|string>|number|string} pIndependentVariableVector - The independent variable values [x1, x2, ..., xn] or single value for single variable.
	 *
	 * @return {number|string} - The predicted dependent variable value.
	 */
	predictFromRegressionModel(pRegressionCoefficients, pIndependentVariableVector)
	{
		let tmpIndependentVariableVector = pIndependentVariableVector;
		if (!Array.isArray(pIndependentVariableVector))
		{
			tmpIndependentVariableVector = [ pIndependentVariableVector ];
		}
		return pRegressionCoefficients.slice(1).reduce((sum, b, i) =>
			{
				return this.addPrecise(sum, this.multiplyPrecise(b, tmpIndependentVariableVector[i]));
			}, pRegressionCoefficients[0]);
	}
}

module.exports = FableServiceMath;
