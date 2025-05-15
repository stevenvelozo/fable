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
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');
						Expect(tmpFilePersistence).is.an('object');
						Expect(tmpFilePersistence.existsSync(`${__dirname}/../package.json`)).to.equal(true);
						Expect(tmpFilePersistence.existsSync(`${__dirname}/package.json`)).to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Read a file line-by-line',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');
						let tmpFirstLine = 'id,book_id,best_book_id,work_id,books_count,isbn,isbn13,authors,original_publication_year,original_title,title,language_code,average_rating,ratings_count,work_ratings_count,work_text_reviews_count,ratings_1,ratings_2,ratings_3,ratings_4,ratings_5,image_url,small_image_url';

						let tmpLineReader = tmpFilePersistence.lineReaderFactory(`${__dirname}/data/books.csv`,
							(pLine) =>
							{
								if (tmpFirstLine)
								{
									Expect(pLine).to.equal(tmpFirstLine);
									tmpFirstLine = false;
								}
								//console.log(pLine);
							},
							() =>
							{
								console.log('LINE-BY-LINE FILE READING COMPLETE; GOOD DAY SIR.');
								return fTestComplete();
							},
							(pError) =>
							{
								console.log(`Error reading file line-by-line: ${pError}`);
							});
						if (!tmpLineReader)
						{
							Expect(false).to.equal(true, 'The line reader was not initialized properly!')
							return fTestComplete();
						}
					}
				);
				test
				(
					'Create, write, read and then delete a file.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');
						let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');

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
					'Join a path.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');

						Expect(tmpFilePersistence.joinPath('/tmp/tests/../othertests/names/'))
							.to.equal('/tmp/othertests/names');

						return fTestComplete();
					}
				);
				test
				(
					'Resolve a path.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');

						Expect(tmpFilePersistence.resolvePath('tmp/tests/../othertests/names/'))
							.to.equal(process.cwd()+'/tmp/othertests/names');

						return fTestComplete();
					}
				);
				test
				(
					'Create a recursive folder.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');
						let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');

						let tmpFolderExtras = [];

						for (let i = 0; i < 3; i++)
						{
							tmpFolderExtras.push(tmpDataGeneration.randomName());
						}

						let tmpFullPathName = `/tmp/${tmpFolderExtras.join('/')}`;
						testFable.log.info(`Creating test folder recursively: [${tmpFullPathName}]`);

						tmpFilePersistence.makeFolderRecursive(tmpFullPathName, (pError)=>
						{
							// Now clean up the folder
							for (let i = 0; i < 3; i++)
							{
								tmpFullPathName = `/tmp/${tmpFolderExtras.join('/')}`;
								testFable.log.info(`Deleting test folder recursively: [${tmpFullPathName}]`);
								tmpFilePersistence.deleteFolderSync(tmpFullPathName);
								tmpFolderExtras.pop();
							}
							return fTestComplete();
						});
					}
				);
				test
				(
					'Create, write, read and then delete a file.',
					function(fTestComplete)
					{
						let testFable = new libFable();
						let tmpFilePersistence = testFable.instantiateServiceProvider('FilePersistence');
						let tmpDataGeneration = testFable.instantiateServiceProvider('DataGeneration');

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
