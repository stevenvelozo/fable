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
	'Fable FilePersistence',
	function()
	{
		setup
		(
			function() { }
		);

		suite
		(
			'Basic File Management',
			function()
			{
				test
				(
					'Check that a file exists',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.serviceManager.instantiateServiceProvider('FilePersistence');
						Expect(tmpFilePersistence).is.an('object');
						Expect(tmpFilePersistence.existsSync(`${__dirname}/../package.json`)).to.equal(true);
						Expect(tmpFilePersistence.existsSync(`${__dirname}/package.json`)).to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Create, write, read and then delete a file.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.serviceManager.instantiateServiceProvider('FilePersistence');
						let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');

						let tmpLogFilePath = `/tmp/Fable-Test-${tmpDataGeneration.randomNumericString()}.log`;
						testFable.log.info(`Writing test log file: [${tmpLogFilePath}]`);

						Expect(tmpFilePersistence.existsSync(tmpLogFilePath)).to.equal(false);

						// Now write some data to the file.
						tmpFilePersistence.writeFileSyncFromObject(tmpLogFilePath, testFable.settings);

						Expect(tmpFilePersistence.existsSync(tmpLogFilePath)).to.equal(true);

						// Now delete the file
						tmpFilePersistence.deleteFileSync(tmpLogFilePath);
						
						Expect(tmpFilePersistence.existsSync(tmpLogFilePath)).to.equal(false);

						return fTestComplete();
					}
				);
				test
				(
					'Create, write, read and then delete a file.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.serviceManager.instantiateServiceProvider('FilePersistence');
						let tmpDataGeneration = testFable.serviceManager.instantiateServiceProvider('DataGeneration');

						let tmpLogFilePath = `/tmp/Fable-Test-${tmpDataGeneration.randomNumericString()}.log`;
						testFable.log.info(`Writing test log file: [${tmpLogFilePath}]`);

						Expect(tmpFilePersistence.existsSync(tmpLogFilePath)).to.equal(false);

						// Now write some data to the file.
						for (let i = 0; i < 100; i++)
						{
							tmpFilePersistence.appendFileSync(tmpLogFilePath, `Line ${i} got a number like ${tmpDataGeneration.randomColor()} ${tmpDataGeneration.randomNumericString(3,789)} for ${tmpDataGeneration.randomName()} ${tmpDataGeneration.randomSurname()}!\n`);
						}

						Expect(tmpFilePersistence.existsSync(tmpLogFilePath)).to.equal(true);

						// Now delete the file
						tmpFilePersistence.deleteFileSync(tmpLogFilePath);
						
						Expect(tmpFilePersistence.existsSync(tmpLogFilePath)).to.equal(false);

						return fTestComplete();
					}
				);
			}
		);
	}
);