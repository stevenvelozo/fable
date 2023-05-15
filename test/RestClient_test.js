/**
* Unit tests for the Fable simple-get RestClient
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');

var Chai = require("chai");
var Expect = Chai.expect;

// https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&page=dog

suite
(
	'Fable RestClient',
	function()
	{
		setup
		(
			function() { }
		);

		suite
		(
			'Basic Requests',
			function()
			{
				test
				(
					'Perform a GET request.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						// Instantiate the RestClient Service Provider
                        let tmpRestClient = testFable.serviceManager.instantiateServiceProvider('RestClient', {TraceLog: true}, 'RestClient-99');

						// Download the wiktionary entry for dog!
						tmpRestClient.getJSON('http://localhost:8086/1.0/Author/1',
							(pError, pResponse, pBody)=>
							{
								Expect(pBody).to.be.an('object');
								Expect(pBody.hasOwnProperty('Name')).to.equal(true);
								Expect(pBody.Name).to.equal('Suzanne Collins');
								fTestComplete();
							});
					}
				);
				test
				(
					'Perform a POST request.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						// Instantiate the RestClient Service Provider
                        let tmpRestClient = testFable.serviceManager.instantiateServiceProvider('RestClient', {TraceLog: true}, 'RestClient-99');

						// Download the wiktionary entry for dog!
						tmpRestClient.postJSON({url: 'http://localhost:8086/1.0/Author', body:{Name:'Test Author'}},
							(pError, pResponse, pBody)=>
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
					'Perform a PUT request.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						// Instantiate the RestClient Service Provider
                        let tmpRestClient = testFable.serviceManager.instantiateServiceProvider('RestClient', {TraceLog: true}, 'RestClient-99');

						// Download the wiktionary entry for dog!
						tmpRestClient.putJSON({url: 'http://localhost:8086/1.0/Author/Upsert', body:{GUIDAuthor:'TestAuthor', Name:'Test Author 2'}},
							(pError, pResponse, pBody)=>
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
					function(fTestComplete)
					{
						let testFable = new libFable();
						// Instantiate the RestClient Service Provider
                        let tmpRestClient = testFable.serviceManager.instantiateServiceProvider('RestClient', {TraceLog: true}, 'RestClient-99');

						// Download the wiktionary entry for dog!
						tmpRestClient.putJSON({url: 'http://localhost:8086/1.0/Author/Upsert', body:{Name:'Test Author 2 DELETE'}},
							(pError, pResponse, pBody)=>
							{
								Expect(pBody).to.be.an('object');
								Expect(pBody.hasOwnProperty('Name')).to.equal(true);
								Expect(pBody.Name).to.equal('Test Author 2 DELETE');
								tmpRestClient.delJSON({url: `http://localhost:8086/1.0/Author/${pBody.IDAuthor}`},
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
	}
);