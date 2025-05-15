
class SetConcatArray
{
	/**
	 * @param {Array<any>|SetConcatArray} pLeftValue - The left value to concatenate.
	 * @param {Array<any>|SetConcatArray} pRightValue - The right value to concatenate.
	 */
	constructor(pLeftValue, pRightValue)
	{
		if (pLeftValue instanceof SetConcatArray)
		{
			this.values = pLeftValue.values.concat([ pRightValue ]);
		}
		else if (pRightValue instanceof SetConcatArray)
		{
			this.values = [ pLeftValue ].concat(pRightValue.values);
		}
		else
		{
			this.values = [ pLeftValue, pRightValue ];
		}
	}
}

module.exports = SetConcatArray;
