/**
* Unit tests for DataArithmatic
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
	'DataArithmatic String',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Manipulate Strings',
			()=>
			{
				test
				(
					'Reverse a String',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						Expect(_DataFormat
							.stringReverse('Dogs'))
							.to.equal('sgoD');
						Expect(_DataFormat
							.stringReverse('Florence and the Machine'))
							.to.equal('enihcaM eht dna ecnerolF');
						return fTestComplete();
					}
				)
				test
				(
					'Insecure String Hash',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						Expect(_DataFormat
							.insecureStringHash('Dogs'))
							.to.equal('HSH2135767');
						Expect(_DataFormat
							.insecureStringHash('Dogs1'))
							.to.equal('HSH66208826');
						Expect(_DataFormat
							.insecureStringHash('This string is longer'))
							.to.equal('HSH53260210');
						// This repeat is intentional, to ensure stable hash generation after multiple runs.
						Expect(_DataFormat
							.insecureStringHash('Dogs'))
							.to.equal('HSH2135767');
						return fTestComplete();
					}
				)
				test
				(
					'Clean wrapping characters from a valid enclosure.',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						// Test the enclosure cleaning function
						Expect(_DataFormat
							.cleanEnclosureWrapCharacters('`', '`Dogs`'))
							.to.equal('Dogs');
						// Tests a cleaning where the enclosure is not wrapped with the expected character
						Expect(_DataFormat
							.cleanEnclosureWrapCharacters('"', '`Cats`'))
							.to.equal('`Cats`');
						// Tests a cleaning where the enclosure is not wrapped with the expected character
						Expect(_DataFormat
							.cleanEnclosureWrapCharacters('"', '"Dogs"'))
							.to.equal('Dogs');
						// Test cleaning an enclosure with multiple enclosures of the same type which are expected to stay intact
						Expect(_DataFormat
							.cleanEnclosureWrapCharacters('[', '[Array[with]weird other] Dogs in it['))
							.to.equal('Array[with]weird other] Dogs in it');
						// Test cleaning a string where the enclosure character is on one side but not the other
						Expect(_DataFormat
							.cleanEnclosureWrapCharacters('"', '"Dogs'))
							.to.equal('"Dogs');
						// Test cleaning a string where the enclosure character is on one side but not the other
						Expect(_DataFormat
							.cleanEnclosureWrapCharacters('"', 'Dogs"'))
							.to.equal('Dogs"');
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string starts with a given substring - Javascript Engine startsWith',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						Expect(_DataFormat
							.stringStartsWith('Dogs', 'Do'))
							.to.equal(true);
						Expect(_DataFormat
							.stringStartsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataFormat
							.stringStartsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataFormat
							.stringStartsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string starts with a given substring - Internal startsWith',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						_DataFormat._UseEngineStringStartsWith = false;
						Expect(_DataFormat
							.stringStartsWith('Dogs', 'Do'))
							.to.equal(true);
						Expect(_DataFormat
							.stringStartsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataFormat
							.stringStartsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataFormat
							.stringStartsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string ends with a given substring - Javascript Engine endsWith',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						Expect(_DataFormat
							.stringEndsWith('Dogs', 'gs'))
							.to.equal(true);
						Expect(_DataFormat
							.stringEndsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataFormat
							.stringEndsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataFormat
							.stringEndsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string ends with a given substring - Internal endsWith',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						_DataFormat._UseEngineStringEndsWith = false;
						Expect(_DataFormat
							.stringEndsWith('Dogs', 'gs'))
							.to.equal(true);
						Expect(_DataFormat
							.stringEndsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataFormat
							.stringEndsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						// We should be able to tell it a midpoint to "end" the string at
						Expect(_DataFormat
							.stringEndsWith('Start from a median point', 'median', 19))
							.to.equal(true);
						Expect(_DataFormat
							.stringEndsWith('Start from a median point', 'median', 20))
							.to.equal(false);
						Expect(_DataFormat
							.stringEndsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test cleaning nonalpha characters from a string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						Expect(_DataFormat
							.cleanNonAlphaCharacters('Dogs'))
							.to.equal('Dogs');
						Expect(_DataFormat
							.cleanNonAlphaCharacters('Dogs are cool'))
							.to.equal('Dogs_are_cool');
						Expect(_DataFormat
							.cleanNonAlphaCharacters('Dogs are cool!'))
							.to.equal('Dogs_are_cool_');
						// Test cleaning with no character
						_DataFormat._Value_Clean_formatterCleanNonAlpha = '';
						Expect(_DataFormat
							.cleanNonAlphaCharacters('Dogs are cool!'))
							.to.equal('Dogsarecool');
						return fTestComplete();
					}
				);
				test
				(
					'Pad the beginning of a string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						// The usual use case (e.g. for zero padding dates)
						Expect(_DataFormat.stringPadStart('9', 2, '0'))
							.to.equal('09');
						Expect(_DataFormat.stringPadStart('11', 2, '0'))
							.to.equal('11');
						// Try some longer paddings
						Expect(_DataFormat.stringPadStart('8675309', 20, '0'))
							.to.equal('00000000000008675309');
						// Should not be destructive
						Expect(_DataFormat.stringPadStart('8675309', 1, '0'))
							.to.equal('8675309');
						// Pad with a longer filler string with shifting data
						Expect(_DataFormat.stringPadStart('ning', 20, 'aaaaw'))
							.to.equal('aaaawaaaawaaaawaning');
						// Table of contents?
						Expect(_DataFormat.stringPadStart('Chapter 1', 20, '.'))
							.to.equal('...........Chapter 1');

						return fTestComplete();
					}
				);
				test
				(
					'Pad the end of a string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.defaultServices.DataFormat;
						// The usual use case (e.g. for left justifying text in fixed-width scenarios)
						Expect(_DataFormat.stringPadEnd('Bob', 10, ' '))
							.to.equal('Bob       ');

						return fTestComplete();
					}
				)
			}
		);
	}
);
