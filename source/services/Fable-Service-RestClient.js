const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

const libSimpleGet = require('simple-get');

class FableServiceRestClient extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'RestClient';
	}

	getJSON(pOptionsOrURL, fCallback)
	{
		let tmpRequestOptions = (typeof(pOptions) == 'object') ? pOptions : {};
		if (typeof(pOptionsOrURL) == 'string')
		{
			tmpRequestOptions.url = pOptionsOrURL;
		}

		let tmpRequestStartTime = this.fable.log.getTimeStamp();

		libSimpleGet.get(tmpRequestOptions,
			(pError, pResponse)=>
			{
				if (pError)
				{
					return fCallback(pError, pResponse, tmpRequestOptions);
				}

				if (this.options.DebugLog)
				{
					this.fable.log.debug(`--> GET connected in ${this._Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);
				}

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this.options.DebugLog)
						{
							this.fable.log.debug(`--> GET data chunk size ${pChunk.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`);
						}
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						let tmpResult = false;

						if (tmpData)
						{
							tmpResult = JSON.parse(tmpData);
						}

						if (this.options.DebugLog)
						{
							this.fable.log.debug(`==> GET completed data size ${tmpData.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
						}
						return fCallback(pError, pResponse, tmpResult);
					});
			});
	}
}

module.exports = FableServiceRestClient;