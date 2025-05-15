/**
* Unit tests for Fable
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');

const libFS = require('fs');
const libReadline = require('readline');

var Chai = require("chai");
var Expect = Chai.expect;

suite
(
	'CSV Parser',
	function()
	{
		suite
		(
			'Parse CSV',
			function()
			{
				test
				(
					'Pull CSV Data',
					function(fDone)
					{
						let testFable = new libFable();
						let tmpCSVParser = testFable.instantiateServiceProvider('CSVParser', {Name: 'Big Complex Integration Operation'}, 'CSV Parser-123');
						let tmpRecords = [];

						const tmpReadline = libReadline.createInterface(
						{
							input: libFS.createReadStream(`${__dirname}/data/books.csv`),
							crlfDelay: Infinity
						});

						tmpReadline.on('line',
							(pLine) =>
							{
								let tmpRecord = tmpCSVParser.parseCSVLine(pLine);
								if (tmpRecord)
								{
									tmpRecords.push(tmpRecord);
								}
							});

						tmpReadline.on('close',
							() =>
							{
								console.log(`Readline closed... testing import!`);
								Expect(tmpRecords.length).to.equal(10000);
								Expect(tmpRecords[0].authors).to.equal('Suzanne Collins');
								return fDone();
							});

					}
				);
				test
				(
					'Pull CSV Data with the Wrapped reader',
					function(fDone)
					{
						let testFable = new libFable();
						testFable.instantiateServiceProvider('FilePersistence');
						let tmpRowCount = 0;
						testFable.FilePersistence.readFileCSV(`${__dirname}/data/books.csv`, {},
							(pRecord) =>
							{
								if (pRecord)
								{
									Expect(pRecord).to.be.an('object');
									Expect(pRecord).to.have.property('authors');
								}
							}, fDone);

					}
				);
			}
		);
	}
);
