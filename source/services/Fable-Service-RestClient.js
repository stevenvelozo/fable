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

		// This is a function that can be overridden, to allow the management
		// of the request options before they are passed to the request library.
		this.prepareRequestOptions = (pOptions) => { return pOptions; };
	}

	preRequest(pOptions)
	{
		// Validate the options object
		return this.prepareRequestOptions(pOptions);
	}

	executeChunkedRequest(pOptions, fCallback)
	{
		let tmpOptions = this.preRequest(pOptions);

		tmpOptions.RequestStartTime = this.fable.log.getTimeStamp();

		if (this.TraceLog)
		{
			this.fable.log.debug(`Beginning ${tmpOptions.method} request to ${tmpOptions.url} at ${tmpOptions.RequestStartTime}`);
		}

		return libSimpleGet(tmpOptions,
			(pError, pResponse)=>
			{
				if (pError)
				{
					return fCallback(pError, pResponse);
				}

				if (this.TraceLog)
				{
					let tmpConnectTime = this.fable.log.getTimeStamp();
					this.fable.log.debug(`--> ${tmpOptions.method} connected in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpConnectTime)}ms code ${pResponse.statusCode}`);
				}

				let tmpData = '';

				pResponse.on('data', (pChunk) =>
					{
						// For JSON, the chunk is the serialized object.
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> ${tmpOptions.method} data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> ${tmpOptions.method} completed data size ${tmpData.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
						return fCallback(pError, pResponse, tmpData);
					});
			});
	}

	executeJSONRequest(pOptions, fCallback)
	{
		pOptions.json = true;

		let tmpOptions = this.preRequest(pOptions);

		tmpOptions.RequestStartTime = this.fable.log.getTimeStamp();

		if (this.TraceLog)
		{
			this.fable.log.debug(`Beginning ${tmpOptions.method} JSON request to ${tmpOptions.url} at ${tmpOptions.RequestStartTime}`);
		}

		return libSimpleGet(tmpOptions,
			(pError, pResponse)=>
			{
				if (pError)
				{
					return fCallback(pError, pResponse);
				}

				if (this.TraceLog)
				{
					let tmpConnectTime = this.fable.log.getTimeStamp();
					this.fable.log.debug(`--> JSON ${tmpOptions.method} connected in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpConnectTime)}ms code ${pResponse.statusCode}`);
				}

				pResponse.on('data', (pChunk) =>
					{
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> JSON ${tmpOptions.method} data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						// In a JSON request, the chunk is the serialized method.
						return fCallback(pError, pResponse, JSON.parse(pChunk));
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> JSON ${tmpOptions.method} completed - received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
					});
			});
	}

	getJSON(pOptionsOrURL, fCallback)
	{
		let tmpRequestOptions = (typeof(pOptionsOrURL) == 'object') ? pOptionsOrURL : {};
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
		let tmpRequestOptions = (typeof(pOptionsOrURL) == 'object') ? pOptionsOrURL : {};
		if (typeof(pOptionsOrURL) == 'string')
		{
			tmpRequestOptions.url = pOptionsOrURL;
		}

		tmpRequestOptions.method = 'GET';

		return this.executeChunkedRequest(tmpRequestOptions, fCallback);
	}
}

module.exports = FableServiceRestClient;