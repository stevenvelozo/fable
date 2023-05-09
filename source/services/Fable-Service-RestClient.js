const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

const libSimpleGet = require('simple-get');

class FableServiceRestClient extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.TraceLog = false;
		if (this.options.TraceLog || this.fable.TraceLog)
		{
			this.TraceLog = true;
		}

		this.dataFormat = this.fable.defaultServices.DataFormat;

		this.serviceType = 'RestClient';
	}

	getJSON(pOptionsOrURL, fCallback)
	{
		return this.getRaw(pOptionsOrURL, 
			(pError, pResponse, pResult) =>
			{
				if (pError)
				{
					return fCallback(pError, pResponse, pResult);
				}

				if (pResponse.statusCode != 200)
				{
					return fCallback(new Error(`Invalid status code ${pResponse.statusCode}`), pResponse, pResult);
				}

				return fCallback(pError, pResponse, JSON.parse(pResult));
			});
	}

	getRaw(pOptionsOrURL, fCallback)
	{
		let tmpRequestOptions = (typeof(pOptions) == 'object') ? pOptions : {};
		if (typeof(pOptionsOrURL) == 'string')
		{
			tmpRequestOptions.url = pOptionsOrURL;
		}

		let tmpRequestStartTime = this.fable.log.getTimeStamp();
		if (this.TraceLog)
		{
			let tmpConnectTime = this.fable.log.getTimeStamp();
			this.fable.log.debug(`Beginning GET request to ${tmpRequestOptions.url} at ${tmpRequestStartTime}`);
		}

		libSimpleGet.get(tmpRequestOptions,
			(pError, pResponse)=>
			{
				if (pError)
				{
					return fCallback(pError, pResponse, tmpRequestOptions);
				}

				if (this.TraceLog)
				{
					let tmpConnectTime = this.fable.log.getTimeStamp();
					this.fable.log.debug(`--> GET connected in ${this.dataFormat.formatTimeDelta(tmpRequestStartTime, tmpConnectTime)}ms code ${pResponse.statusCode}`);
				}

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> GET data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(tmpRequestStartTime, tmpChunkTime)}ms`);
						}
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> GET completed data size ${tmpData.length}b received in ${this.dataFormat.formatTimeDelta(tmpRequestStartTime, tmpCompletionTime)}ms`);
						}
						return fCallback(pError, pResponse, tmpData);
					});
			});
	}
}

module.exports = FableServiceRestClient;