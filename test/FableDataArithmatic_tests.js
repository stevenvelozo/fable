/**
* Unit tests for Fable's DataArithmatic service
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
						let _DataArithmatic = testFable.DataArithmatic;
						Expect(_DataArithmatic
							.stringReverse('Dogs'))
							.to.equal('sgoD');
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						Expect(_DataArithmatic
							.insecureStringHash('Dogs'))
							.to.equal('HSH2135767');
						Expect(_DataArithmatic
							.insecureStringHash('Dogs1'))
							.to.equal('HSH66208826');
						Expect(_DataArithmatic
							.insecureStringHash('This string is longer'))
							.to.equal('HSH53260210');
						// This repeat is intentional, to ensure stable hash generation after multiple runs.
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						// Test the enclosure cleaning function
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('`', '`Dogs`'))
							.to.equal('Dogs');
						// Tests a cleaning where the enclosure is not wrapped with the expected character
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', '`Cats`'))
							.to.equal('`Cats`');
						// Tests a cleaning where the enclosure is not wrapped with the expected character
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', '"Dogs"'))
							.to.equal('Dogs');
						// Test cleaning an enclosure with multiple enclosures of the same type which are expected to stay intact
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('[', '[Array[with]weird other] Dogs in it['))
							.to.equal('Array[with]weird other] Dogs in it');
						// Test cleaning a string where the enclosure character is on one side but not the other
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', '"Dogs'))
							.to.equal('"Dogs');
						// Test cleaning a string where the enclosure character is on one side but not the other
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Do'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						_DataArithmatic._UseEngineStringStartsWith = false;
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Do'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'gs'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						_DataArithmatic._UseEngineStringEndsWith = false;
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'gs'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						// We should be able to tell it a midpoint to "end" the string at
						Expect(_DataArithmatic
							.stringEndsWith('Start from a median point', 'median', 19))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Start from a median point', 'median', 20))
							.to.equal(false);
						Expect(_DataArithmatic
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
						let _DataArithmatic = testFable.DataArithmatic;
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs'))
							.to.equal('Dogs');
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs are cool'))
							.to.equal('Dogs_are_cool');
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs are cool!'))
							.to.equal('Dogs_are_cool_');
						// Test cleaning with no character
						_DataArithmatic._Value_Clean_formatterCleanNonAlpha = '';
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs are cool!'))
							.to.equal('Dogsarecool');
						return fTestComplete();
					}
				);
			}
		);
	}
);
