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
	'DataArithmatic String Tokenization',
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
					'Test getting a string before a match',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringBeforeMatch('Dogs are cool', 'are'))
							.to.equal('Dogs ');
						Expect(_DataFormat
							.stringBeforeMatch('These.Are.All.Words', '.'))
							.to.equal('These');
						Expect(_DataFormat
							.stringBeforeMatch('These.Are.All.Words', 'NoMatchesHere'))
							.to.equal('These.Are.All.Words');
						return fTestComplete();
					}
				);
				test
				(
					'Test getting a string after a match',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringAfterMatch('Dogs are cool', 'are'))
							.to.equal(' cool');
						Expect(_DataFormat
							.stringAfterMatch('These.Are.All.Words', '.'))
							.to.equal('Are.All.Words');
						Expect(_DataFormat
							.stringAfterMatch('These.Are.All.Words', 'NoMatchesHere'))
							.to.equal('');
						return fTestComplete();
					}
				);
				test
				(
					'Test counting enclosures',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringCountEnclosures('Dogs (are) cool'))
							.to.equal(1);
						Expect(_DataFormat
							.stringCountEnclosures('Dogs are cool'))
							.to.equal(0);
						// It should not count nested enclosures.
						// Although with getEnclosureValueByIndex and recalling this, you can recursively get them.
						Expect(_DataFormat
							.stringCountEnclosures('There (are (many)) of these (things)'))
							.to.equal(2);
						Expect(_DataFormat
							.stringCountEnclosures('There [are (many)] of these (things)'))
							.to.equal(2);
						// You can also specify the enclosure characters
						Expect(_DataFormat
							.stringCountEnclosures('There [are (many)] of these (things)', '[', ']'))
							.to.equal(1);
						// It does not *require* a closing character and still counts the enclosure.
						// Hotly debated topic.  A setting could be added to change this behavior.
						Expect(_DataFormat
							.stringCountEnclosures('There [are (many) of these (things)', '[', ']'))
							.to.equal(1);
						return fTestComplete();
					}
				);
				test
				(
					'Test getting an enclosure value by index',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('Dogs (are) cool', 0))
							.to.equal('are');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('Dogs are cool', 0))
							.to.equal('');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('There (are (many)) of these (things)', 0))
							.to.equal('are (many)');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('There [are (many)] of these (things)', 1))
							.to.equal('things');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('There [are (many)] of these (things)', 2))
							.to.equal('');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('(This enclosure is the whole string)', 0))
							.to.equal('This enclosure is the whole string');
						// You can also specify the enclosure characters
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('There [are (many)] of these (things)', 0, '[', ']'))
							.to.equal('are (many)');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('There [are (many) of these (things)', 0, '[', ']'))
							.to.equal('are (many) of these (things)');
						Expect(_DataFormat
							.stringGetEnclosureValueByIndex('There (are (many) of these (things))', 0))
							.to.equal('are (many) of these (things)');
						return fTestComplete();
					}
				);
				test
				(
					'Test removing an enclosure',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('Dogs (are) cool', 0))
							.to.equal('Dogs  cool');
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('Dogs are cool', 0))
							.to.equal('Dogs are cool');
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('There (are (many)) of these (things)', 0))
							.to.equal('There  of these (things)');
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('There [are (many)] of these (things)', 1))
							.to.equal('There [are (many)] of these ');
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('There [are (many)] of these (things)', 2))
							.to.equal('There [are (many)] of these (things)');
						// You can also specify the enclosure characters
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('There [are (many)] of these (things)', 0, '[', ']'))
							.to.equal('There  of these (things)');
						Expect(_DataFormat
							.stringRemoveEnclosureByIndex('There [are (many) of these (things)', 0, '[', ']'))
							.to.equal('There ');
						return fTestComplete();
					}
				);
				test
				(
					'Test counting segments and respecting enclosures',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringCountSegments('Dogs.are.cool'))
							.to.equal(3);
						Expect(_DataFormat
							.stringCountSegments('Dogs.are.cool'))
							.to.equal(3);
						Expect(_DataFormat
							.stringCountSegments('Dogs.are(.)cool'))
							.to.equal(2);
						Expect(_DataFormat
							.stringCountSegments('Dogs.are(.[....])co.(.)ol'))
							.to.equal(3);
						Expect(_DataFormat
							.stringCountSegments('Dogs.are(.[....]),co.(.)ol', ','))
							.to.equal(2);
						return fTestComplete();
					}
				);
				test
				(
					'Get the first segment of a string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringGetFirstSegment('Dogs.are.cool'))
							.to.equal('Dogs');
						Expect(_DataFormat
							.stringGetFirstSegment('Dogs().are.cool'))
							.to.equal('Dogs()');
						Expect(_DataFormat
							.stringGetFirstSegment('Dogs[This.That(),Equals(THEM)].are(.)cool'))
							.to.equal('Dogs[This.That(),Equals(THEM)]');
						Expect(_DataFormat
							.stringGetFirstSegment('Dogs(.are(.[....])co.(.)ol'))
							.to.equal('Dogs(.are(.[....])co.(.)ol');
						Expect(_DataFormat
							.stringGetFirstSegment('Dogs(.are(,[....])co.(.)ol', ','))
							.to.equal('Dogs(.are(,[....])co.(.)ol');
						Expect(_DataFormat
							.stringGetFirstSegment('Dogs.are(,[....]),co.(.)ol', ','))
							.to.equal('Dogs.are(,[....])');
						return fTestComplete();
					}
				);
				test
				(
					'Get all segments of a string',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringGetSegments('Dogs.are.cool')[1])
							.to.equal('are');
						Expect(_DataFormat
							.stringGetSegments('Dogs().are.cool'))
							.to.deep.equal(['Dogs()', 'are', 'cool']);
						Expect(_DataFormat
							.stringGetSegments('Dogs[This.That(),Equals(THEM)].are(.)cool'))
							.to.deep.equal(['Dogs[This.That(),Equals(THEM)]', 'are(.)cool']);
						Expect(_DataFormat
							.stringGetSegments('Dogs(.are(.[....])co.(.)ol')[0])
							.to.equal('Dogs(.are(.[....])co.(.)ol');
						Expect(_DataFormat
							.stringGetSegments('..Dogs.are(,[....]),co.(.)ol'))
							.to.deep.equal(['','','Dogs','are(,[....]),co','(.)ol']);
						return fTestComplete();
					}
				);
				test
				(
					'Get Enclosures',
					(fTestComplete)=>
					{
						let testFable = new libFable({LogStreams: false});
						let _DataFormat = testFable.services.DataFormat;
						Expect(_DataFormat
							.stringGetSegments('Dogs.are.cool')[1])
							.to.equal('are');
						Expect(_DataFormat
							.stringGetSegments('Dogs().are.cool'))
							.to.deep.equal(['Dogs()', 'are', 'cool']);
						Expect(_DataFormat
							.stringGetSegments('Dogs[This.That(),Equals(THEM)].are(.)cool'))
							.to.deep.equal(['Dogs[This.That(),Equals(THEM)]', 'are(.)cool']);
						Expect(_DataFormat
							.stringGetSegments('Dogs(.are(.[....])co.(.)ol')[0])
							.to.equal('Dogs(.are(.[....])co.(.)ol');
						Expect(_DataFormat
							.stringGetSegments('..Dogs.are(,[....]),co.(.)ol'))
							.to.deep.equal(['','','Dogs','are(,[....]),co','(.)ol']);
						return fTestComplete();
					}
				);
			}
		);
	}
);
