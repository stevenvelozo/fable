/**
* Unit tests for Fable
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
	'Object Cache Test',
	function()
	{
		suite
		(
			'Basic object cache',
			function()
			{
				test
				(
					'Leverage the object cache',
					function(fDone)
					{
						let testFable = new libFable();

						let testCache = testFable.instantiateServiceProvider('ObjectCache');

						testCache.maxLength = 2;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						Expect(testCache._List.head.Datum).to.equal('ABC');
						Expect(testCache._List.tail.Datum).to.equal('DEF');
						Expect(testCache._List.length).to.equal(2);

						testCache.put('GHI', 'G');
						Expect(testCache._List.head.Datum).to.equal('DEF');
						Expect(testCache._List.tail.Datum).to.equal('GHI');
						Expect(testCache._List.length).to.equal(2);

						testCache.put('JKL', 'J');
						testCache.put('MNO', 'M');
						Expect(testCache._List.head.Datum).to.equal('JKL');
						Expect(testCache._List.tail.Datum).to.equal('MNO');
						Expect(testCache._List.length).to.equal(2);

						// Now grow the cache, allowing it to hold more items.
						testCache.maxLength = 5
						testCache.put('PQR', 'P');
						testCache.put('STU', 'S');
						Expect(testCache._List.head.Datum).to.equal('JKL');
						Expect(testCache._List.tail.Datum).to.equal('STU');
						Expect(testCache._List.length).to.equal(4);


						testCache.put('VWX', 'V');
						Expect(testCache._List.head.Datum).to.equal('JKL');
						Expect(testCache._List.tail.Datum).to.equal('VWX');
						Expect(testCache._List.length).to.equal(5);

						testCache.put('YZ', 'Y');
						Expect(testCache._List.head.Datum).to.equal('MNO');
						Expect(testCache._List.tail.Datum).to.equal('YZ');
						Expect(testCache._List.length).to.equal(5);

						// Now shrink it again... the list will only maintain its length until a prune occurs
						testCache.maxLength = 2;

						testCache.put('012', '0');
						Expect(testCache._List.head.Datum).to.equal('PQR');
						Expect(testCache._List.tail.Datum).to.equal('012');
						Expect(testCache._List.length).to.equal(5);

						testCache.prune((pRemovedRecords)=>
						{
							Expect(testCache._List.head.Datum).to.equal('YZ');
							Expect(testCache._List.tail.Datum).to.equal('012');
							Expect(testCache._List.length).to.equal(2);
							return fDone();
						});
					}
				);
			}
		);
	}
);