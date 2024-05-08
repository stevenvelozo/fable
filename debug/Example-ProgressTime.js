//let libBookstore = require('../retold-harness/bookstore-serve-meadow-endpoint-apis-run.js');
const libFable = require('../source/Fable.js');

let testFable = new libFable({"Product": "ProgressTrackerExample"});

let tmpProgressTracker = testFable.instantiateServiceProvider('ProgressTrackerSet');

// 10000 takes about a minute on the beefy box
tmpProgressTracker.createProgressTracker('TestTracker', 5000);
tmpProgressTracker.logProgressTrackerStatus('TestTracker');

let tmpAnticipate = testFable.newAnticipate();

tmpAnticipate.anticipate(
    function (fDone)
    {
        let tmpWaitTime = Math.floor(Math.random() * 150) + 150;
        this.log.trace(`Starting tracker in ${tmpWaitTime}ms...`);
        setTimeout(
            () =>
            {
                testFable.ProgressTrackerSet.startProgressTracker('TestTracker');
                testFable.ProgressTrackerSet.logProgressTrackerStatus('TestTracker');
                return fDone();
            }, tmpWaitTime);
    }.bind(testFable));

for (let i = 0; i < 10000; i++)
{
    tmpAnticipate.anticipate(
        function (fDone)
        {
            let tmpTracker = testFable.ProgressTrackerSet.getProgressTracker('TestTracker');

            if (tmpTracker.data.PercentComplete >= 100)
            {
                return fDone();
            }

            let tmpWaitTime = Math.floor(Math.random() * 150) + 150;
            let tmpIncrementAmount = Math.floor(Math.random() * 50) + 50;
            //this.log.trace(`Incrementing tracker by ${tmpIncrementAmount} in ${tmpWaitTime}ms...`);

            setTimeout(
                () =>
                {
                    if (tmpTracker.data.PercentComplete < 100)
                    {
                        testFable.ProgressTrackerSet.incrementProgressTracker('TestTracker', tmpIncrementAmount);
                        testFable.ProgressTrackerSet.logProgressTrackerStatus('TestTracker');
                    }
                    return fDone();
                }, tmpWaitTime);
        }.bind(testFable));
}

tmpAnticipate.wait(
    function (pError)
    {
		if (pError)
		{
			testFable.log.error(`Error: ${pError}`);
		}

        let tmpWaitTime = Math.floor(Math.random() * 150) + 150;
        this.log.trace(`Ending tracker in ${tmpWaitTime}ms...`);

        setTimeout(
            () =>
            {
				testFable.ProgressTrackerSet.endProgressTracker('TestTracker');
                testFable.ProgressTrackerSet.logProgressTrackerStatus('TestTracker');
            }, tmpWaitTime);
    }.bind(testFable));
