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

	executeChunkedRequest(pOptions, fCallback)
	{
		pOptions.RequestStartTime = this.fable.log.getTimeStamp();

		if (this.TraceLog)
		{
			this.fable.log.debug(`Beginning ${pOptions.method} request to ${pOptions.url} at ${pOptions.RequestStartTime}`);
		}

		return libSimpleGet(pOptions,
			(pError, pResponse)=>
			{
				if (pError)
				{
					return fCallback(pError, pResponse);
				}

				if (this.TraceLog)
				{
					let tmpConnectTime = this.fable.log.getTimeStamp();
					this.fable.log.debug(`--> ${pOptions.method} connected in ${this.dataFormat.formatTimeDelta(pOptions.RequestStartTime, tmpConnectTime)}ms code ${pResponse.statusCode}`);
				}

				let tmpData = '';

				pResponse.on('data', (pChunk) =>
					{
						// For JSON, the chunk is the serialized object.
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> ${pOptions.method} data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(pOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> ${pOptions.method} completed data size ${tmpData.length}b received in ${this.dataFormat.formatTimeDelta(pOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
						return fCallback(pError, pResponse, tmpData);
					});
			});
	}

	executeJSONRequest(pOptions, fCallback)
	{
		pOptions.json = true;

		pOptions.RequestStartTime = this.fable.log.getTimeStamp();

		if (this.TraceLog)
		{
			this.fable.log.debug(`Beginning ${pOptions.method} JSON request to ${pOptions.url} at ${pOptions.RequestStartTime}`);
		}

		return libSimpleGet(pOptions,
			(pError, pResponse)=>
			{
				if (pError)
				{
					return fCallback(pError, pResponse);
				}

				if (this.TraceLog)
				{
					let tmpConnectTime = this.fable.log.getTimeStamp();
					this.fable.log.debug(`--> JSON ${pOptions.method} connected in ${this.dataFormat.formatTimeDelta(pOptions.RequestStartTime, tmpConnectTime)}ms code ${pResponse.statusCode}`);
				}

				pResponse.on('data', (pChunk) =>
					{
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> JSON ${pOptions.method} data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(pOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						// In a JSON request, the chunk is the serialized method.
						return fCallback(pError, pResponse, JSON.parse(pChunk));
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> JSON ${pOptions.method} completed - received in ${this.dataFormat.formatTimeDelta(pOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
					});
			});
	}

	getJSON(pOptionsOrURL, fCallback)
	{
		let tmpRequestOptions = (typeof(pOptions) == 'object') ? pOptions : {};
		if (typeof(pOptionsOrURL) == 'string')
		{
			tmpRequestOptions.url = pOptionsOrURL;
		}

		tmpRequestOptions.method = 'GET';

		return this.executeJSONRequest(tmpRequestOptions, fCallback);
	}

	putJSON(pOptions, fCallback)
	{
		if (typeof(pOptions.body) != 'object')
		{
			return fCallback(new Error(`PUT JSON Error Invalid options object`));
		}

		pOptions.method = 'PUT';

		return this.executeJSONRequest(pOptions, fCallback);
	}

	postJSON(pOptions, fCallback)
	{
		if (typeof(pOptions.body) != 'object')
		{
			return fCallback(new Error(`POST JSON Error Invalid options object`));
		}

		pOptions.method = 'POST';

		return this.executeJSONRequest(pOptions, fCallback);
	}

	patchJSON(pOptions, fCallback)
	{
		if (typeof(pOptions.body) != 'object')
		{
			return fCallback(new Error(`PATCH JSON Error Invalid options object`));
		}

		pOptions.method = 'PATCH';

		return this.executeJSONRequest(pOptions, fCallback);
	}

	headJSON(pOptions, fCallback)
	{
		if (typeof(pOptions.body) != 'object')
		{
			return fCallback(new Error(`HEAD JSON Error Invalid options object`));
		}

		pOptions.method = 'HEAD';

		return this.executeJSONRequest(pOptions, fCallback);
	}
	
	delJSON(pOptions, fCallback)
	{
		pOptions.method = 'DELETE';

		return this.executeJSONRequest(pOptions, fCallback);
	}

	getRawText(pOptionsOrURL, fCallback)
	{
		let tmpRequestOptions = (typeof(pOptions) == 'object') ? pOptions : {};
		if (typeof(pOptionsOrURL) == 'string')
		{
			tmpRequestOptions.url = pOptionsOrURL;
		}

		tmpRequestOptions.method = 'GET';

		return this.executeChunkedRequest(tmpRequestOptions, fCallback);
	}
}

module.exports = FableServiceRestClient;