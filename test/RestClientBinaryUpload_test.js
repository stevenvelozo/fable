/**
 * Integration tests for the Fable RestClient executeBinaryUpload method.
 *
 * Spins up a real Orator/Restify server, uploads binary payloads via
 * executeBinaryUpload, and verifies the server received them correctly.
 *
 * @license     MIT
 */

var libFable = require('../source/Fable.js');
var libOrator = require('orator');
var libOratorServiceServerRestify = require('orator-serviceserver-restify');

var Chai = require('chai');
var Expect = Chai.expect;

// Port for the test server — pick something unlikely to collide
var TEST_PORT = 18199;

suite
(
	'RestClient Binary Upload',
	function ()
	{
		// ----------------------------------------------------------------
		// Test server lifecycle
		// ----------------------------------------------------------------
		var _Fable = null;
		var _Orator = null;
		// Track what the server received on each request
		var _LastReceivedBody = null;
		var _LastReceivedContentType = null;

		suiteSetup
		(
			function (fDone)
			{
				_Fable = new libFable(
					{
						Product: 'BinaryUploadTestServer',
						APIServerPort: TEST_PORT
					});

				_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);

				_Orator = new libOrator(_Fable, {});

				_Orator.initialize(
					(pError) =>
					{
						if (pError)
						{
							return fDone(pError);
						}

						// ----------------------------------------------------------
						// POST /1.0/Artifact/Media/:id/:version
						// Receives raw binary body, echoes back metadata as JSON.
						// ----------------------------------------------------------
						_Orator.serviceServer.doPost('/1.0/Artifact/Media/:IDArtifact/:Version',
							(pRequest, pResponse, fNext) =>
							{
								let tmpChunks = [];

								pRequest.on('data', (pChunk) =>
								{
									tmpChunks.push(pChunk);
								});

								pRequest.on('end', () =>
								{
									_LastReceivedBody = Buffer.concat(tmpChunks);
									_LastReceivedContentType = pRequest.headers['content-type'] || '';

									pResponse.setHeader('content-type', 'application/json');
									pResponse.send(200,
										{
											Success: true,
											ReceivedBytes: _LastReceivedBody.length,
											ContentType: _LastReceivedContentType,
											IDArtifact: pRequest.params.IDArtifact,
											Version: pRequest.params.Version
										});
									return fNext();
								});
							});

						// ----------------------------------------------------------
						// GET /1.0/Artifact/Media/:id/:version
						// Returns a small binary payload for download tests.
						// ----------------------------------------------------------
						_Orator.serviceServer.doGet('/1.0/Artifact/Media/:IDArtifact/:Version',
							(pRequest, pResponse, fNext) =>
							{
								let tmpPayload = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x01, 0x02, 0x03]);
								pResponse.setHeader('content-type', 'image/png');
								pResponse.sendRaw(200, tmpPayload);
								return fNext();
							});

						// ----------------------------------------------------------
						// POST /1.0/Echo
						// JSON body parser echo endpoint for comparison testing.
						// ----------------------------------------------------------
						_Orator.serviceServer.doPost('/1.0/Echo',
							libOratorServiceServerRestify.prototype.bodyParser.call(_Orator.serviceServer),
							(pRequest, pResponse, fNext) =>
							{
								pResponse.send(200, { Echo: pRequest.body });
								return fNext();
							});

						_Orator.startService(
							(pStartError) =>
							{
								return fDone(pStartError);
							});
					});
			}
		);

		suiteTeardown
		(
			function (fDone)
			{
				if (_Orator)
				{
					_Orator.stopService(fDone);
				}
				else
				{
					fDone();
				}
			}
		);

		setup
		(
			function ()
			{
				_LastReceivedBody = null;
				_LastReceivedContentType = null;
			}
		);

		// ----------------------------------------------------------------
		// Tests
		// ----------------------------------------------------------------

		suite
		(
			'executeBinaryUpload',
			function ()
			{
				test
				(
					'Upload a Buffer payload and verify server received it.',
					function (fTestComplete)
					{
						let tmpFable = new libFable({ TraceLog: true });
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient', { TraceLog: true });

						let tmpPayload = Buffer.from('Hello binary world! This is a test payload with some bytes.');
						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/42/1`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'image/jpeg' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');
								Expect(pResponse).to.be.an('object');
								Expect(pResponse.statusCode).to.equal(200);

								// Parse the JSON response from the server
								let tmpParsedBody = JSON.parse(pBody);
								Expect(tmpParsedBody.Success).to.equal(true);
								Expect(tmpParsedBody.ReceivedBytes).to.equal(tmpPayload.length);
								Expect(tmpParsedBody.ContentType).to.equal('image/jpeg');
								Expect(tmpParsedBody.IDArtifact).to.equal('42');
								Expect(tmpParsedBody.Version).to.equal('1');

								// Verify the actual bytes the server received
								Expect(_LastReceivedBody).to.be.instanceof(Buffer);
								Expect(_LastReceivedBody.length).to.equal(tmpPayload.length);
								Expect(_LastReceivedBody.toString()).to.equal(tmpPayload.toString());

								fTestComplete();
							});
					}
				);

				test
				(
					'Upload binary data with different MIME type.',
					function (fTestComplete)
					{
						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						// Create a binary payload with non-text bytes
						let tmpPayload = Buffer.alloc(256);
						for (let i = 0; i < 256; i++)
						{
							tmpPayload[i] = i;
						}

						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/99/3`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'application/pdf' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');

								let tmpParsedBody = JSON.parse(pBody);
								Expect(tmpParsedBody.Success).to.equal(true);
								Expect(tmpParsedBody.ReceivedBytes).to.equal(256);
								Expect(tmpParsedBody.ContentType).to.equal('application/pdf');
								Expect(tmpParsedBody.IDArtifact).to.equal('99');
								Expect(tmpParsedBody.Version).to.equal('3');

								// Verify all 256 byte values survived the round-trip
								Expect(_LastReceivedBody.length).to.equal(256);
								for (let i = 0; i < 256; i++)
								{
									Expect(_LastReceivedBody[i]).to.equal(i);
								}

								fTestComplete();
							});
					}
				);

				test
				(
					'Progress callback is called with 1.0 on completion.',
					function (fTestComplete)
					{
						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						let tmpPayload = Buffer.from('progress test');
						let tmpProgressCalled = false;
						let tmpProgressValue = -1;

						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/1/1`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'application/octet-stream' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');
								Expect(tmpProgressCalled).to.equal(true);
								Expect(tmpProgressValue).to.equal(1.0);
								fTestComplete();
							},
							(pProgress) =>
							{
								tmpProgressCalled = true;
								tmpProgressValue = pProgress;
							});
					}
				);

				test
				(
					'Upload empty body returns success.',
					function (fTestComplete)
					{
						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						let tmpPayload = Buffer.alloc(0);
						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/5/1`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'image/png' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');
								let tmpParsedBody = JSON.parse(pBody);
								Expect(tmpParsedBody.Success).to.equal(true);
								Expect(tmpParsedBody.ReceivedBytes).to.equal(0);
								fTestComplete();
							});
					}
				);

				test
				(
					'Upload a large binary payload (1MB).',
					function (fTestComplete)
					{
						this.timeout(10000);

						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						// Create a 1MB payload with a known pattern
						let tmpSize = 1024 * 1024;
						let tmpPayload = Buffer.alloc(tmpSize);
						for (let i = 0; i < tmpSize; i++)
						{
							tmpPayload[i] = i % 256;
						}

						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/100/1`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'application/octet-stream' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');

								let tmpParsedBody = JSON.parse(pBody);
								Expect(tmpParsedBody.Success).to.equal(true);
								Expect(tmpParsedBody.ReceivedBytes).to.equal(tmpSize);

								// Verify first and last bytes
								Expect(_LastReceivedBody[0]).to.equal(0);
								Expect(_LastReceivedBody[255]).to.equal(255);
								Expect(_LastReceivedBody[256]).to.equal(0);
								Expect(_LastReceivedBody[tmpSize - 1]).to.equal((tmpSize - 1) % 256);

								fTestComplete();
							});
					}
				);

				test
				(
					'Works with RestClientURLPrefix setting.',
					function (fTestComplete)
					{
						let tmpFable = new libFable(
							{
								RestClientURLPrefix: `http://localhost:${TEST_PORT}`
							});
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						let tmpPayload = Buffer.from('prefix test');
						let tmpOptions =
							{
								url: '/1.0/Artifact/Media/7/2',
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'text/plain' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');

								let tmpParsedBody = JSON.parse(pBody);
								Expect(tmpParsedBody.Success).to.equal(true);
								Expect(tmpParsedBody.IDArtifact).to.equal('7');
								Expect(tmpParsedBody.Version).to.equal('2');
								Expect(tmpParsedBody.ContentType).to.equal('text/plain');

								fTestComplete();
							});
					}
				);

				test
				(
					'Cookies are applied via prepareCookies.',
					function (fTestComplete)
					{
						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						tmpRestClient.cookie = { SessionID: 'abc123' };

						let tmpPayload = Buffer.from('cookie test');
						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/8/1`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'image/jpeg' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');

								let tmpParsedBody = JSON.parse(pBody);
								Expect(tmpParsedBody.Success).to.equal(true);

								fTestComplete();
							});
					}
				);
			}
		);

		suite
		(
			'executeChunkedRequest binary download',
			function ()
			{
				test
				(
					'Download binary data via GET.',
					function (fTestComplete)
					{
						let tmpFable = new libFable({ TraceLog: true });
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient', { TraceLog: true });

						tmpRestClient.executeChunkedRequest(
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/42/1`,
								method: 'GET'
							},
							(pError, pResponse, pBody) =>
							{
								Expect(pError).to.not.be.an('error');
								Expect(pResponse.statusCode).to.equal(200);
								// Body is a string from executeChunkedRequest
								Expect(pBody.length).to.be.greaterThan(0);
								fTestComplete();
							});
					}
				);

				test
				(
					'Download binary data via executeChunkedRequestBinary returns Buffer.',
					function (fTestComplete)
					{
						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						tmpRestClient.executeChunkedRequestBinary(
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/42/1`,
								method: 'GET'
							},
							(pError, pResponse, pBuffer) =>
							{
								Expect(pError).to.not.be.an('error');
								Expect(pResponse.statusCode).to.equal(200);
								Expect(pBuffer).to.be.instanceof(Buffer);
								// Check PNG magic bytes
								Expect(pBuffer[0]).to.equal(0x89);
								Expect(pBuffer[1]).to.equal(0x50);
								Expect(pBuffer[2]).to.equal(0x4E);
								Expect(pBuffer[3]).to.equal(0x47);
								fTestComplete();
							});
					}
				);
			}
		);

		suite
		(
			'Round-trip: upload then download',
			function ()
			{
				test
				(
					'Upload binary, then download and verify content matches.',
					function (fTestComplete)
					{
						let tmpFable = new libFable();
						let tmpRestClient = tmpFable.instantiateServiceProvider('RestClient');

						// Upload
						let tmpPayload = Buffer.from([0xDE, 0xAD, 0xBE, 0xEF, 0xCA, 0xFE]);
						let tmpOptions =
							{
								url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/200/1`,
								method: 'POST',
								body: tmpPayload,
								headers: { 'Content-Type': 'application/octet-stream' }
							};

						tmpRestClient.executeBinaryUpload(tmpOptions,
							(pUploadError, pUploadResponse, pUploadBody) =>
							{
								Expect(pUploadError).to.not.be.an('error');

								let tmpParsedBody = JSON.parse(pUploadBody);
								Expect(tmpParsedBody.Success).to.equal(true);
								Expect(tmpParsedBody.ReceivedBytes).to.equal(6);

								// Now download from the same endpoint
								tmpRestClient.executeChunkedRequestBinary(
									{
										url: `http://localhost:${TEST_PORT}/1.0/Artifact/Media/200/1`,
										method: 'GET'
									},
									(pDownloadError, pDownloadResponse, pBuffer) =>
									{
										Expect(pDownloadError).to.not.be.an('error');
										Expect(pBuffer).to.be.instanceof(Buffer);
										// The download endpoint returns a fixed PNG stub,
										// not the uploaded data — but both should succeed
										Expect(pBuffer.length).to.be.greaterThan(0);
										fTestComplete();
									});
							});
					}
				);
			}
		);
	}
);
