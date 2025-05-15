const libExpressionParserOperationBase = require('./Fable-Service-ExpressionParser-Base.js');

class ExpressionParserValueMarshal extends libExpressionParserOperationBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'ExpressionParser-ValueMarshal';
	}

	/**
	 * Substitutes values in tokenized objects based on the provided data source and manifest.
	 * 
	 * TODO: Move this to its own file in the "Fable-Service-ExpressionParser" directory.
	 *
	 * @param {Array} pTokenizedObjects - The array of tokenized objects.
	 * @param {Object} pDataSource - The data source object where we pull values from.
	 * @param {Object} pResultObject - The result object where the algorithm shows its work.
	 * @param {Object} pManifest - The manifest object to use for hash resolution.
	 * @returns {Array} - The modified tokenized objects array.
	 */
	substituteValuesInTokenizedObjects(pTokenizedObjects, pDataSource, pResultObject, pManifest)
	{
		let tmpResults = (typeof(pResultObject) === 'object') ? pResultObject : { ExpressionParserLog: [] };

		if (!Array.isArray(pTokenizedObjects))
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects was passed a non-array tokenized object list.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return pTokenizedObjects;
		}
		if (typeof(pDataSource) !== 'object')
		{
			tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects either was passed no data source, or was passed a non-object data source.`);
			this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
			return pTokenizedObjects;
		}

		let tmpDataSource = pDataSource;

		let tmpManifest = (typeof(pManifest) == 'object') ? pManifest : this.fable.newManyfest(pManifest);

		for (let i = 0; i < pTokenizedObjects.length; i++)
		{
			if (typeof(pTokenizedObjects[i]) !== 'object')
			{
				tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.substituteValuesInTokenizedObjects found a non-object tokenized object at index ${i}`);
				this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				continue;
			}
			let tmpToken = pTokenizedObjects[i];
			if ((pTokenizedObjects[i].Type === 'Token.Symbol') && !tmpToken.Resolved)
			{
				// Symbols always look up values by hash first
				let tmpValue = tmpManifest.getValueByHash(tmpDataSource, tmpToken.Token);
				// if (!tmpValue)
				// {
				// 	// If no hash resolves, try by address.
				// 	tmpValue = tmpManifest.getValueAtAddress(tmpToken.Token, tmpDataSource);
				// }
				if (!tmpValue)
				{
					tmpToken.Value = tmpValue;
					tmpToken.Resolve = true;
					tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.substituteValuesInTokenizedObjects found no value for the symbol hash or address ${tmpToken.Token} at index ${i}`);
					this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					continue;
				}
				else
				{
					tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpValue}] for the state address ${tmpToken.Token} at index ${i}`);
					if (this.LogNoisiness > 1) this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					try
					{
						let tmpValueParsed = new this.fable.Utility.bigNumber(tmpValue);
						tmpToken.Resolved = true;
						tmpToken.Value = tmpValueParsed.toString();
					}
					catch(pError)
					{
						// TODO: Should we allow this to be a function?  Good god the complexity and beauty of that...
						if (Array.isArray(tmpValue) || (typeof(tmpValue) === 'object'))
						{
							tmpToken.Resolved = true;
							tmpToken.Value = tmpValue;
						}
						else
						{
							tmpToken.Resolved = true;
							tmpToken.Value = tmpValue;
							tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a non-numeric value for the state address ${tmpToken.Token} at index ${i}; using raw value.`);
							this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						}
					}
				}
			}
			if ((pTokenizedObjects[i].Type === 'Token.StateAddress') && !tmpToken.Resolved)
			{
				// Symbols are always hashes.  This gracefully works for simple shallow objects because hashes default to the address in Manyfest.
				let tmpValue = tmpManifest.getValueAtAddress(tmpDataSource, tmpToken.Token);
				if (!tmpValue)
				{
					tmpResults.ExpressionParserLog.push(`WARNING: ExpressionParser.substituteValuesInTokenizedObjects found no value for the state address ${tmpToken.Token} at index ${i}`);
					this.log.warn(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					continue;
				}
				else
				{
					//tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpValue}] for the state address ${tmpToken.Token} at index ${i}`);
					this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					try
					{
						let tmpValueParsed = new this.fable.Utility.bigNumber(tmpValue);
						tmpToken.Resolved = true;
						tmpToken.Value = tmpValueParsed.toString();
					}
					catch(pError)
					{
						tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects found a non-numeric value for the state address ${tmpToken.Token} at index ${i}`);
						this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
						tmpToken.Resolved = false;
					}
				}
			}
			if ((pTokenizedObjects[i].Type === 'Token.String') && !tmpToken.Resolved)
			{
				tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpToken.Token}] for the string ${tmpToken.Token} at index ${i}`);
				if (this.LogNoisiness > 1) this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				tmpToken.Resolved = true;
				// Take the quotes off the string
				tmpToken.Value = tmpToken.Token.substring(1, tmpToken.Token.length-1);
			}
			if ((pTokenizedObjects[i].Type === 'Token.Constant') && !tmpToken.Resolved)
			{
				tmpResults.ExpressionParserLog.push(`INFO: ExpressionParser.substituteValuesInTokenizedObjects found a value [${tmpToken.Token}] for the constant ${tmpToken.Token} at index ${i}`);
				if (this.LogNoisiness > 1) this.log.info(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
				try
				{
					let tmpValueParsed = new this.fable.Utility.bigNumber(tmpToken.Token);
					tmpToken.Resolved = true;
					tmpToken.Value = tmpValueParsed.toString();
				}
				catch(pError)
				{
					// This constant has the right symbols but apparently isn't a parsable number.
					tmpResults.ExpressionParserLog.push(`ERROR: ExpressionParser.substituteValuesInTokenizedObjects found a non-numeric value for the state address ${tmpToken.Token} at index ${i}`);
					this.log.error(tmpResults.ExpressionParserLog[tmpResults.ExpressionParserLog.length-1]);
					tmpToken.Resolved = false;
				}
			}
		}

		return pTokenizedObjects;
	}
}

module.exports = ExpressionParserValueMarshal;