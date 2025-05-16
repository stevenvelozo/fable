const libFableServiceBase = require('fable-serviceproviderbase');

class FableServiceLogic extends libFableServiceBase
{
	/**
	 * @param {import('../Fable.js')} pFable - The fable object
	 * @param {Record<string, any>} [pOptions] - The options object
	 * @param {string} [pServiceHash] - The hash of the service
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Find the first value in an object that contains a specific value
	 *
	 * @param {string|number} pLeft - The left value to check
	 * @param {string} pComparisonOperator - The comparison operator to use
	 * @param {string|number} pRight - The right value to check
	 * @param {any} pOnTrue - The value to return if the comparison is true
	 * @param {any} [pOnFalse = ''] - The value to return if the comparison is false
	 * @return {any} - The selected value
	 */
	checkIf(pLeft, pComparisonOperator, pRight, pOnTrue, pOnFalse)
	{
		// precise numeric
		// string (non-numeric)
		let tmpMathLeft = this.fable.Math.parsePrecise(pLeft, null);
		let tmpMathRight = this.fable.Math.parsePrecise(pRight, null);
		let tmpCheckResult = false;
		if (tmpMathLeft === null || tmpMathRight === null)
		{
			if (typeof pOnFalse === 'undefined')
			{
				pOnFalse = '';
			}
			switch (pComparisonOperator)
			{
				case '<':
				case 'LT':
					tmpCheckResult = pLeft < pRight;
					break;
				case '<=':
				case 'LTE':
					tmpCheckResult = pLeft <= pRight;
					break;
				case '>':
				case 'GT':
					tmpCheckResult = pLeft > pRight;
					break;
				case '>=':
				case 'GTE':
					tmpCheckResult = pLeft >= pRight;
					break;
				case '==':
					tmpCheckResult = pLeft == pRight;
					break;
				case '===':
					tmpCheckResult = pLeft === pRight;
					break;
				default:
					this.fable.log.warn(`[FableServiceLogic.checkIf] Invalid comparison operator: ${pComparisonOperator}`);
					tmpCheckResult = pLeft == pRight;
			}
		}
		else
		{
			if (typeof pOnFalse === 'undefined')
			{
				pOnFalse = '0';
			}
			switch (pComparisonOperator)
			{
				case '<':
				case 'LT':
					tmpCheckResult = this.fable.Math.ltPrecise(tmpMathLeft, tmpMathRight);
					break;
				case '<=':
				case 'LTE':
					tmpCheckResult = this.fable.Math.ltePrecise(tmpMathLeft, tmpMathRight);
					break;
				case '>':
				case 'GT':
					tmpCheckResult = this.fable.Math.gtPrecise(tmpMathLeft, tmpMathRight);
					break;
				case '>=':
				case 'GTE':
					tmpCheckResult = this.fable.Math.gtePrecise(tmpMathLeft, tmpMathRight);
					break;
				case '==':
					tmpCheckResult = this.fable.Math.comparePreciseWithin(tmpMathLeft, tmpMathRight, '0.000001') == 0;
					break;
				case '===':
					tmpCheckResult = this.fable.Math.comparePrecise(tmpMathLeft, tmpMathRight) == 0;
					break;
				default:
					this.fable.log.warn(`[FableServiceLogic.checkIf] Invalid comparison operator: ${pComparisonOperator}`);
					tmpCheckResult = pLeft == pRight ? pOnTrue : pOnFalse;
			}
		}
		return tmpCheckResult ? pOnTrue : pOnFalse;
	}

	/**
	 * Find the first value in an object that contains a specific value
	 *
	 * @param {any} pCheckForTruthy - The object to check
	 * @param {any} pOnTrue - The value to return if the object is truthy
	 * @param {any} [pOnFalse = ''] - The value to return if the object is falsy
	 * @return {any} - The value from the object
	 */
	when(pCheckForTruthy, pOnTrue, pOnFalse = '')
	{
		if (!pCheckForTruthy)
		{
			return pOnFalse;
		}
		if (Array.isArray(pCheckForTruthy) && pCheckForTruthy.length < 1)
		{
			return pOnFalse;
		}
		if (typeof pCheckForTruthy === 'object' && Object.keys(pCheckForTruthy).length < 1)
		{
			return pOnFalse;
		}
		return pOnTrue;
	}
}

module.exports = FableServiceLogic;
