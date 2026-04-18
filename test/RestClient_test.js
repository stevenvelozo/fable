/**
* Unit tests for the Fable simple-get RestClient
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');
var libHTTP = require('http');

var Chai = require("chai");
var Expect = Chai.expect;

// https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&page=dog

suite
	(
		'Fable RestClient',
		function ()
		{
			setup
				(
					function () { }
				);

			suite
				(
					'Basic Requests',
					function ()
					{
						test
							(
								'Perform a POST request.',
								function (fTestComplete)
								{
									let testFable = new libFable();
									// Instantiate the RestClient Service Provider
									let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { TraceLog: true }, 'RestClient-99');

									tmpRestClient.prepareRequestOptions = (pOptions) =>
									{
										pOptions.headers = { 'Content-Type': 'application/json' };
										return pOptions;
									};

									// Download the wiktionary entry for dog!
									tmpRestClient.postJSON({ url: 'http://localhost:8086/1.0/Author', body: { Name: 'Test Author' } },
										(pError, pResponse, pBody) =>
										{
											Expect(pBody).to.be.an('object');
											Expect(pBody.hasOwnProperty('Name')).to.equal(true);
											Expect(pBody.Name).to.equal('Test Author');
											fTestComplete();
										});
								}
							);
						test
							(
								'Perform a GET request.',
								function (fTestComplete)
								{
									let testFable = new libFable();
									// Instantiate the RestClient Service Provider
									testFable.instantiateServiceProvider('RestClient', { TraceLog: true });

									// Download the wiktionary entry for dog!
									testFable.RestClient.getJSON('http://localhost:8086/1.0/Author/1',
										(pError, pResponse, pBody) =>
										{
											Expect(pBody).to.be.an('object');
											Expect(pBody.hasOwnProperty('Name')).to.equal(true);
											Expect(pBody.Name).to.be.a('string');
											Expect(pBody.Name.length).to.be.greaterThan(0);
											fTestComplete();
										});
								}
							);
						test
							(
								'Get a binary file.',
								function (fTestComplete)
								{
									let testFable = new libFable();
									// Instantiate the RestClient Service Provider
									let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { TraceLog: true }, 'RestClient-99');

									// Download the wiktionary entry for dog!
									tmpRestClient.executeChunkedRequestBinary({ url: 'http://localhost:8086/1.0/Author/1', method: 'GET' },
										(pError, pResponse, pBuffer) =>
										{
											Expect(pBuffer).to.be.instanceof(Buffer);
											testFable.instantiateServiceProvider('FilePersistence');
											// TODO: How to test this on all operating systems safely?
											//testFable.FilePersistence.writeFileSync(`/tmp/RestClient_binary_test.jpg`, pBuffer);
											fTestComplete();
										});
								}
							);
						test
							(
								'Perform a PUT request.',
								function (fTestComplete)
								{
									let testFable = new libFable();
									// Instantiate the RestClient Service Provider
									let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { TraceLog: true }, 'RestClient-99');

									// Download the wiktionary entry for dog!
									tmpRestClient.putJSON({ url: 'http://localhost:8086/1.0/Author/Upsert', body: { GUIDAuthor: 'TestAuthor', Name: 'Test Author 2' } },
										(pError, pResponse, pBody) =>
										{
											Expect(pBody).to.be.an('object');
											Expect(pBody.hasOwnProperty('Name')).to.equal(true);
											Expect(pBody.Name).to.equal('Test Author 2');
											fTestComplete();
										});
								}
							);
						test
							(
								'Perform an UPSERT request then a DELETE.',
								function (fTestComplete)
								{
									let testFable = new libFable();
									// Instantiate the RestClient Service Provider
									let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { TraceLog: true }, 'RestClient-99');

									// Download the wiktionary entry for dog!
									tmpRestClient.putJSON({ url: 'http://localhost:8086/1.0/Author/Upsert', body: { Name: 'Test Author 2 DELETE' } },
										(pError, pResponse, pBody) =>
										{
											Expect(pBody).to.be.an('object');
											Expect(pBody.hasOwnProperty('Name')).to.equal(true);
											Expect(pBody.Name).to.equal('Test Author 2 DELETE');
											tmpRestClient.delJSON({ url: `http://localhost:8086/1.0/Author/${pBody.IDAuthor}` },
												(pDeleteError, pDeleteResponse, pDeleteBody) =>
												{
													Expect(pDeleteBody.Count)
														.to.equal(1);
													fTestComplete();
												});
										});
								}
							);
					}
				);

				suite
					(
						'HTTP Agent',
						function ()
						{
							test
								(
									'Always installs http/https agents, even when KeepAlive is not set.',
									function ()
									{
										// Without an explicit agent, requests would fall through to
										// http.globalAgent and hit the Node 20+ ~5s socket timeout.
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-DefaultAgent');

										Expect(tmpRestClient.httpAgent).to.be.an('object');
										Expect(tmpRestClient.httpsAgent).to.be.an('object');
										Expect(Boolean(tmpRestClient.httpAgent.keepAlive)).to.equal(false);
										Expect(Boolean(tmpRestClient.httpsAgent.keepAlive)).to.equal(false);
									}
								);
							test
								(
									'Enables keepAlive on agents when KeepAlive option is set.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { KeepAlive: true }, 'RestClient-KeepAlive-Options');

										Expect(tmpRestClient.httpAgent.keepAlive).to.equal(true);
										Expect(tmpRestClient.httpsAgent.keepAlive).to.equal(true);
									}
								);
							test
								(
									'Enables keepAlive on agents via fable settings.',
									function ()
									{
										let testFable = new libFable({ RestClientKeepAlive: true });
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-KeepAlive-Settings');

										Expect(tmpRestClient.httpAgent.keepAlive).to.equal(true);
										Expect(tmpRestClient.httpsAgent.keepAlive).to.equal(true);
									}
								);
							test
								(
									'Passes additional agent options through KeepAliveAgentOptions.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient',
											{
												KeepAlive: true,
												KeepAliveAgentOptions: { timeout: 300000, maxSockets: 32 }
											}, 'RestClient-KeepAlive-AgentOpts');

										Expect(tmpRestClient.httpAgent.keepAlive).to.equal(true);
										Expect(tmpRestClient.httpAgent.options.timeout).to.equal(300000);
										Expect(tmpRestClient.httpAgent.options.maxSockets).to.equal(32);
										Expect(tmpRestClient.httpsAgent.options.timeout).to.equal(300000);
									}
								);
							test
								(
									'KeepAliveAgentOptions apply even when KeepAlive is not enabled.',
									function ()
									{
										// Tuning options still flow through when keepAlive is off.
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient',
											{ KeepAliveAgentOptions: { maxSockets: 8 } }, 'RestClient-AgentOpts-NoKeepAlive');

										Expect(Boolean(tmpRestClient.httpAgent.keepAlive)).to.equal(false);
										Expect(tmpRestClient.httpAgent.options.maxSockets).to.equal(8);
									}
								);
							test
								(
									'Injects the http agent on http:// URLs.',
									function (fTestComplete)
									{
										var tmpServer = libHTTP.createServer(function (pReq, pRes)
										{
											pRes.writeHead(200, { 'Content-Type': 'application/json' });
											pRes.end(JSON.stringify({ OK: true }));
										});

										tmpServer.listen(0, function ()
										{
											var tmpPort = tmpServer.address().port;
											var testFable = new libFable();
											var tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-AgentInject-HTTP');

											var tmpOriginalPrepare = tmpRestClient.prepareRequestOptions;
											var tmpCapturedAgent = null;
											tmpRestClient.prepareRequestOptions = function (pOptions)
											{
												let tmpResult = tmpOriginalPrepare(pOptions);
												tmpCapturedAgent = tmpResult.agent;
												return tmpResult;
											};

											tmpRestClient.getJSON('http://localhost:' + tmpPort + '/test',
												function (pError, pResponse, pBody)
												{
													Expect(tmpCapturedAgent).to.equal(tmpRestClient.httpAgent);
													Expect(pBody.OK).to.equal(true);
													tmpServer.close();
													fTestComplete();
												});
										});
									}
								);
							test
								(
									'Selects the https agent for https:// URLs.',
									function ()
									{
										// We don't need a live HTTPS server to verify the selection
										// logic — invoke prepareRequestOptions directly and inspect
										// which agent was chosen.
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-AgentInject-HTTPS');

										let tmpHttps = tmpRestClient.prepareRequestOptions({ url: 'https://example.com/x' });
										let tmpHttp = tmpRestClient.prepareRequestOptions({ url: 'http://example.com/x' });

										Expect(tmpHttps.agent).to.equal(tmpRestClient.httpsAgent);
										Expect(tmpHttp.agent).to.equal(tmpRestClient.httpAgent);
									}
								);
							test
								(
									'Chains with previously set prepareRequestOptions.',
									function (fTestComplete)
									{
										var tmpServer = libHTTP.createServer(function (pReq, pRes)
										{
											pRes.writeHead(200, { 'Content-Type': 'application/json' });
											pRes.end(JSON.stringify({ CustomHeader: pReq.headers['x-custom'] || '' }));
										});

										tmpServer.listen(0, function ()
										{
											var tmpPort = tmpServer.address().port;
											var testFable = new libFable();
											var tmpRestClient = testFable.instantiateServiceProvider('RestClient', { KeepAlive: true }, 'RestClient-KeepAlive-Chain');

											var tmpInstalledPrepare = tmpRestClient.prepareRequestOptions;
											tmpRestClient.prepareRequestOptions = function (pOptions)
											{
												let tmpResult = tmpInstalledPrepare(pOptions);
												if (!tmpResult.headers)
												{
													tmpResult.headers = {};
												}
												tmpResult.headers['X-Custom'] = 'test-value';
												return tmpResult;
											};

											tmpRestClient.getJSON('http://localhost:' + tmpPort + '/test',
												function (pError, pResponse, pBody)
												{
													Expect(pBody.CustomHeader).to.equal('test-value');
													tmpServer.close();
													fTestComplete();
												});
										});
									}
								);
							test
								(
									'initializeKeepAliveAgent remains a back-compat entry point.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-BackCompat');

										// Default constructor: no keepAlive
										Expect(Boolean(tmpRestClient.httpAgent.keepAlive)).to.equal(false);

										// Calling the legacy method flips keepAlive on
										tmpRestClient.initializeKeepAliveAgent({ maxSockets: 4 });
										Expect(tmpRestClient.httpAgent.keepAlive).to.equal(true);
										Expect(tmpRestClient.httpAgent.options.maxSockets).to.equal(4);
									}
								);
						}
					);

				suite
					(
						'Request Timeout',
						function ()
						{
							// Helper: spin up a local HTTP server that never responds so we can
							// verify that the simple-get 'Request timed out' path fires on our
							// configured timeout rather than any ambient http.globalAgent default.
							var createHangingServer = function (fOnListen)
							{
								var tmpServer = libHTTP.createServer(function (pReq, pRes)
								{
									// Intentionally never write or end the response
								});
								tmpServer.listen(0, function ()
								{
									fOnListen(tmpServer, tmpServer.address().port);
								});
								return tmpServer;
							};

							test
								(
									'Applies the library default timeout (60000ms) when none is supplied.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-DefaultTimeout');

										Expect(tmpRestClient.defaultRequestTimeout).to.equal(60000);

										let tmpPrepared = tmpRestClient.preRequest({ url: 'http://example.com/x', method: 'GET' });
										Expect(tmpPrepared.timeout).to.equal(60000);
									}
								);
							test
								(
									'RequestTimeout constructor option overrides the library default.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { RequestTimeout: 60000 }, 'RestClient-OptTimeout');

										Expect(tmpRestClient.defaultRequestTimeout).to.equal(60000);

										let tmpPrepared = tmpRestClient.preRequest({ url: 'http://example.com/x', method: 'GET' });
										Expect(tmpPrepared.timeout).to.equal(60000);
									}
								);
							test
								(
									'RestClientRequestTimeout fable setting overrides the library default.',
									function ()
									{
										let testFable = new libFable({ RestClientRequestTimeout: 45000 });
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-SettingTimeout');

										Expect(tmpRestClient.defaultRequestTimeout).to.equal(45000);
									}
								);
							test
								(
									'Constructor option takes precedence over fable setting.',
									function ()
									{
										let testFable = new libFable({ RestClientRequestTimeout: 45000 });
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { RequestTimeout: 15000 }, 'RestClient-TimeoutPrecedence');

										Expect(tmpRestClient.defaultRequestTimeout).to.equal(15000);
									}
								);
							test
								(
									'Caller-supplied timeout on the request options is preserved.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-CallerTimeout');

										let tmpPrepared = tmpRestClient.preRequest({ url: 'http://example.com/x', method: 'GET', timeout: 1234 });
										Expect(tmpPrepared.timeout).to.equal(1234);
									}
								);
							test
								(
									'Explicit timeout of 0 on the request options is preserved.',
									function ()
									{
										// 0 is a valid numeric value — it signals "override the mystery
										// default with no timeout" and must not be replaced.
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-ZeroTimeout');

										let tmpPrepared = tmpRestClient.preRequest({ url: 'http://example.com/x', method: 'GET', timeout: 0 });
										Expect(tmpPrepared.timeout).to.equal(0);
									}
								);
							test
								(
									'RequestTimeout value of 0 is honored.',
									function ()
									{
										let testFable = new libFable();
										let tmpRestClient = testFable.instantiateServiceProvider('RestClient', { RequestTimeout: 0 }, 'RestClient-ZeroOptTimeout');

										Expect(tmpRestClient.defaultRequestTimeout).to.equal(0);

										let tmpPrepared = tmpRestClient.preRequest({ url: 'http://example.com/x', method: 'GET' });
										Expect(tmpPrepared.timeout).to.equal(0);
									}
								);
							test
								(
									'A short RequestTimeout actually aborts a hanging request.',
									function (fTestComplete)
									{
										this.timeout(5000);
										var tmpServer;
										tmpServer = createHangingServer(function (pServer, pPort)
										{
											var testFable = new libFable();
											var tmpRestClient = testFable.instantiateServiceProvider('RestClient', { RequestTimeout: 300 }, 'RestClient-LiveTimeout');

											var tmpStart = Date.now();
											tmpRestClient.getJSON('http://localhost:' + pPort + '/hangs',
												function (pError, pResponse, pBody)
												{
													var tmpElapsed = Date.now() - tmpStart;
													Expect(pError).to.be.an.instanceof(Error);
													Expect(pError.message).to.contain('timed out');
													// Guard against the Node 20+ ~5s globalAgent timeout
													// silently beating our 300ms setting.
													Expect(tmpElapsed).to.be.lessThan(2500);
													pServer.close();
													fTestComplete();
												});
										});
									}
								);
						}
					);

				suite
					(
						'Error Handling',
						function ()
						{
							test
								(
									'Handle a non-JSON response without crashing.',
									function (fTestComplete)
									{
										// Spin up a tiny HTTP server that returns plain text with a 414 status
										var tmpServer = libHTTP.createServer(function (pReq, pRes)
										{
											pRes.writeHead(414, { 'Content-Type': 'text/plain' });
											pRes.end('URI too long\n');
										});

										tmpServer.listen(0, function ()
										{
											var tmpPort = tmpServer.address().port;
											var testFable = new libFable();
											var tmpRestClient = testFable.instantiateServiceProvider('RestClient', {}, 'RestClient-ErrorTest');

											tmpRestClient.getJSON('http://localhost:' + tmpPort + '/anything',
												function (pError, pResponse, pBody)
												{
													Expect(pError).to.be.an.instanceof(Error);
													Expect(pError.message).to.contain('414');
													Expect(pError.message).to.contain('URI too long');
													Expect(pBody).to.equal(null);
													tmpServer.close();
													fTestComplete();
												});
										});
									}
								);
						}
					);
		}
	);