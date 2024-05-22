//let libBookstore = require('../retold-harness/bookstore-serve-meadow-endpoint-apis-run.js');
const libFable = require('../source/Fable.js');

let testFable = new libFable({"Product": "ProgressTrackerExample"});


let tmpTestArray = [
	{Name:'Jimbo', Age: 12},
    {Name:'Susan', Age: 17},
    {Name:'Chris', Age: 15},
    {Name:'Reginald', Age: 19},
    {Name:'Wendy', Age: 14},
    {Name:'Dwight', Age: 16},
    {Name:'Jimbo2', Age: 18},
    {Name:'Susan2', Age: 13},
    {Name:'Chris2', Age: 15},
    {Name:'Reginald2', Age: 19}
];

let tmpProgressTracker = testFable.instantiateServiceProvider('ProgressTrackerSet');

let tmpTestIterations = 50000000;
// How many interstitial messages we want.
let tmpMessageChunkSize = tmpTestIterations / 5;

tmpProgressTracker.createProgressTracker('ArrayFromPerformance', tmpTestIterations);
tmpProgressTracker.logProgressTrackerStatus('ArrayFromPerformance');
for (let i = 0; i < tmpTestIterations; i++)
{
    let tmpArray = Array.from(tmpTestArray);
    tmpArray.push({Name:'NewGuy', Age: 21});

    tmpProgressTracker.incrementProgressTracker('ArrayFromPerformance', 1);

    if (i % tmpMessageChunkSize == 0)
    {
        tmpProgressTracker.logProgressTrackerStatus('ArrayFromPerformance');
    }
}
tmpProgressTracker.endProgressTracker('ArrayFromPerformance');
tmpProgressTracker.logProgressTrackerStatus('ArrayFromPerformance');

tmpProgressTracker.createProgressTracker('ForLoopPerformance', tmpTestIterations);
tmpProgressTracker.logProgressTrackerStatus('ForLoopPerformance');
for (let i = 0; i < tmpTestIterations; i++)
{
    let tmpArray = [];
    for (let j = 0; j < tmpTestArray.length; j++)
    {
        tmpArray.push(tmpTestArray[j]);
    }
    tmpArray.push({Name:'NewGuy', Age: 21});

    tmpProgressTracker.incrementProgressTracker('ForLoopPerformance', 1);

    if (i % tmpMessageChunkSize == 0)
    {
        tmpProgressTracker.logProgressTrackerStatus('ForLoopPerformance');
    }
}
tmpProgressTracker.endProgressTracker('ForLoopPerformance');
tmpProgressTracker.logProgressTrackerStatus('ForLoopPerformance');

