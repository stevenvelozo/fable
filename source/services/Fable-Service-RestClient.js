const libFableServiceBase = require('fable-serviceproviderbase');

const libSimpleGet = require('simple-get');
const libCookie = require('cookie');
const libHttp = require('http');
const libHttps = require('https');

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

		this.dataFormat = this.fable.services.DataFormat;

		this.serviceType = 'RestClient';

		this.cookie = false;

		// This is a function that can be overridden, to allow the management
		// of the request options before they are passed to the request library.
		this.prepareRequestOptions = (pOptions) => { return pOptions; };

		// Default per-request timeout (ms). Applied in preRequest when a caller
		// does not supply their own. Node 20+ installs a ~5s socket timeout on
		// http.globalAgent that aborts legitimately long-running requests; any
		// explicit `timeout` on the request options takes that default out of
		// play. See the "Request Timeout" test suite for the behaviors covered.
		if (typeof this.options.RequestTimeout === 'number')
		{
			this.defaultRequestTimeout = this.options.RequestTimeout;
		}
		else if (typeof this.fable.settings.RestClientRequestTimeout === 'number')
		{
			this.defaultRequestTimeout = this.fable.settings.RestClientRequestTimeout;
		}
		else
		{
			this.defaultRequestTimeout = 60000;
		}

		// Always install our own http/https agents so every request bypasses
		// http.globalAgent (and its Node 20+ mystery socket timeout). The
		// KeepAlive flag only controls whether keepAlive is enabled on our own
		// agents, not whether we have agents at all. Additional tuning
		// (maxSockets, agent timeout, etc.) flows through KeepAliveAgentOptions.
		let tmpKeepAlive = Boolean(this.options.KeepAlive || this.fable.settings.RestClientKeepAlive);
		let tmpAgentOptions = Object.assign({}, this.options.KeepAliveAgentOptions);
		if (tmpKeepAlive)
		{
			tmpAgentOptions.keepAlive = true;
		}
		this._installHttpAgents(tmpAgentOptions);
	}

	/**
	 * Initialize HTTP keep-alive agents and wire them into prepareRequestOptions.
	 * Back-compat entry point: always forces keepAlive on. Prefer configuring
	 * the RestClient via the KeepAlive / KeepAliveAgentOptions constructor
	 * options instead of calling this method directly.
	 *
	 * @param {Object} [pAgentOptions] - Additional options passed to the Http/Https Agent constructors (e.g. timeout).
	 */
	initializeKeepAliveAgent(pAgentOptions)
	{
		let tmpAgentOptions = Object.assign({ keepAlive: true }, pAgentOptions);
		this._installHttpAgents(tmpAgentOptions);
	}

	/**
	 * Construct http/https Agents from the given options and wire them into
	 * prepareRequestOptions so every request carries an explicit agent.
	 *
	 * @param {Object} pAgentOptions - Options passed directly to the Http/Https Agent constructors.
	 * @private
	 */
	_installHttpAgents(pAgentOptions)
	{
		this.httpAgent = new libHttp.Agent(pAgentOptions);
		this.httpsAgent = new libHttps.Agent(pAgentOptions);

		// Capture any previously set prepareRequestOptions so we can chain
		let tmpPreviousPrepareRequestOptions = this.prepareRequestOptions;

		this.prepareRequestOptions = (pOptions) =>
		{
			if (typeof pOptions.url === 'string' && pOptions.url.startsWith('http:'))
			{
				pOptions.agent = this.httpAgent;
			}
			else
			{
				pOptions.agent = this.httpsAgent;
			}
			return tmpPreviousPrepareRequestOptions(pOptions);
		};
	}

	get simpleGet()
	{
		return libSimpleGet;
	}

	prepareCookies(pRequestOptions)
	{
		if (this.cookie)
		{
			let tmpCookieObject = this.cookie;
			if (!('headers' in pRequestOptions))
			{
				pRequestOptions.headers = {};
			}
			let tmpCookieKeys = Object.keys(tmpCookieObject);
			if (tmpCookieKeys.length > 0)
			{
				// Only grab the first for now.
				pRequestOptions.headers.cookie = libCookie.serialize(tmpCookieKeys[0], tmpCookieObject[tmpCookieKeys[0]]);
			}
		}
		return pRequestOptions;
	}

	preRequest(pOptions)
	{
		// Validate the options object
		let tmpOptions = this.prepareCookies(pOptions);

		// Prepend a string to the URL if it exists in the Fable Config
		if ('RestClientURLPrefix' in this.fable.settings)
		{
			tmpOptions.url = this.fable.settings.RestClientURLPrefix + tmpOptions.url;
		}

		// Apply the default request timeout when the caller hasn't supplied
		// one. Setting any numeric value (including 0) suppresses the Node 20+
		// http.globalAgent ~5s socket timeout.
		if (typeof tmpOptions.timeout !== 'number')
		{
			tmpOptions.timeout = this.defaultRequestTimeout;
		}

		return this.prepareRequestOptions(tmpOptions);
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

	executeChunkedRequestBinary(pOptions, fCallback)
	{
		let tmpOptions = this.preRequest(pOptions);

		tmpOptions.RequestStartTime = this.fable.log.getTimeStamp();

		if (this.TraceLog)
		{
			this.fable.log.debug(`Beginning ${tmpOptions.method} request to ${tmpOptions.url} at ${tmpOptions.RequestStartTime}`);
		}

		tmpOptions.json = false;
		tmpOptions.encoding = null;

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

				let tmpDataBuffer = false;

				pResponse.on('data', (pChunk) =>
					{
						// For JSON, the chunk is the serialized object.
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> ${tmpOptions.method} data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						// TODO: Potentially create a third option that streams this to a file?  So it doesn't have to hold it all in memory.
						if (!tmpDataBuffer)
						{
							tmpDataBuffer = Buffer.from(pChunk);
						}
						else
						{
							tmpDataBuffer = Buffer.concat([tmpDataBuffer, pChunk]);
						}
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> ${tmpOptions.method} completed data size ${tmpDataBuffer.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
						return fCallback(pError, pResponse, tmpDataBuffer);
					});
			});
	}

	executeJSONRequest(pOptions, fCallback)
	{
		pOptions.json = true;

		let tmpOptions = this.preRequest(pOptions);

		if (!('headers' in tmpOptions))
		{
			tmpOptions.headers = {};
		}
		/* Automated headers break some APIs
		if (!('Content-Type' in tmpOptions.headers))
		{
			tmpOptions.headers['Content-Type'] = 'application/json';
		}
		*/

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

				let tmpJSONData = '';

				pResponse.on('data', (pChunk) =>
					{
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> JSON ${tmpOptions.method} data chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						tmpJSONData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> JSON ${tmpOptions.method} completed - received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
						let tmpParsedJSON;
						try
						{
							tmpParsedJSON = JSON.parse(tmpJSONData);
						}
						catch (pParseError)
						{
							let tmpStatusCode = pResponse ? pResponse.statusCode : 'unknown';
							return fCallback(new Error(`JSON parse failed (HTTP ${tmpStatusCode}): ${tmpJSONData.substring(0, 200)}`), pResponse, null);
						}
						return fCallback(pError, pResponse, tmpParsedJSON);
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

	/**
	 * Upload binary data via POST.
	 *
	 * Accepts Buffer, Blob, or File as the body. In the browser, Blob/File
	 * bodies are converted to Buffer (via ArrayBuffer) before being passed
	 * to simple-get so the stream-http shim can send them correctly.
	 *
	 * The response body is read as a string (servers typically return JSON
	 * status for upload endpoints).
	 *
	 * @param {Record<string, any>} pOptions - Request options (url, body, headers, method)
	 * @param {(pError?: Error, pResponse: any, pBody?: any) => void} fCallback - Callback (pError, pResponse, pBody)
	 * @param {(pProgress: number) => void} [fOnProgress] - Optional progress callback (0.0 to 1.0); called with 1.0 on completion
	 */
	executeBinaryUpload(pOptions, fCallback, fOnProgress)
	{
		// Blob/File → Buffer conversion for simple-get compatibility
		let tmpBody = pOptions.body;

		if (typeof Blob !== 'undefined' && tmpBody instanceof Blob)
		{
			let tmpSelf = this;
			tmpBody.arrayBuffer()
				.then(
					(pArrayBuffer) =>
					{
						pOptions.body = Buffer.from(pArrayBuffer);
						tmpSelf._executeBinaryUploadInternal(pOptions, fCallback, fOnProgress);
					})
				.catch(
					(pError) =>
					{
						return fCallback(pError);
					});
			return;
		}

		// Already a Buffer, string, or stream — proceed directly
		return this._executeBinaryUploadInternal(pOptions, fCallback, fOnProgress);
	}

	/**
	 * Internal binary upload implementation using simple-get.
	 *
	 * @param {Record<string, any>} pOptions - Request options with body already as Buffer
	 * @param {(pError?: Error, pResponse: any, pBody?: any) => void} fCallback - Callback (pError, pResponse, pBody)
	 * @param {(pProgress: number) => void} [fOnProgress] - Optional progress callback (0.0 to 1.0); called with 1.0 on completion
	 * @private
	 */
	_executeBinaryUploadInternal(pOptions, fCallback, fOnProgress)
	{
		let tmpOptions = this.preRequest(pOptions);

		tmpOptions.RequestStartTime = this.fable.log.getTimeStamp();

		if (this.TraceLog)
		{
			this.fable.log.debug(`Beginning ${tmpOptions.method} binary upload to ${tmpOptions.url} at ${tmpOptions.RequestStartTime}`);
		}

		tmpOptions.json = false;

		return libSimpleGet(tmpOptions,
			(pError, pResponse) =>
			{
				if (pError)
				{
					return fCallback(pError, pResponse);
				}

				if (this.TraceLog)
				{
					let tmpConnectTime = this.fable.log.getTimeStamp();
					this.fable.log.debug(`--> Binary upload ${tmpOptions.method} connected in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpConnectTime)}ms code ${pResponse.statusCode}`);
				}

				let tmpData = '';

				pResponse.on('data', (pChunk) =>
					{
						if (this.TraceLog)
						{
							let tmpChunkTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`--> Binary upload ${tmpOptions.method} response chunk size ${pChunk.length}b received in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpChunkTime)}ms`);
						}
						tmpData += pChunk;
					});

				pResponse.on('end', () =>
					{
						if (this.TraceLog)
						{
							let tmpCompletionTime = this.fable.log.getTimeStamp();
							this.fable.log.debug(`==> Binary upload ${tmpOptions.method} completed in ${this.dataFormat.formatTimeDelta(tmpOptions.RequestStartTime, tmpCompletionTime)}ms`);
						}
						// Signal completion via progress callback
						if (typeof fOnProgress === 'function')
						{
							fOnProgress(1.0);
						}
						return fCallback(pError, pResponse, tmpData);
					});
			});
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
