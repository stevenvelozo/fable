//let libBookstore = require('../retold-harness/bookstore-serve-meadow-endpoint-apis-run.js');
const libFable = require('../source/Fable.js');

class SimpleService extends libFable.ServiceProviderBase
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'SimpleService';
    }

    doSomething()
    {
        this.fable.log.info(`SimpleService ${this.UUID}::${this.Hash} is doing something.`);
    }
}

let testFable = new libFable({"Product": "FableDebugHarness"});

let tmpProgressTracker = testFable.instantiateServiceProvider('ProgressTracker');

tmpProgressTracker.createProgressTracker('TestTracker', 10051);

//tmpProgressTracker.startProgressTracker('TestTracker');

let tmpAnticipate = testFable.newAnticipate();

for (let i = 0; i < 11000; i++)
{
    tmpAnticipate.anticipate(
        function (fDone)
        {
            let tmpTracker = this.ProgressTracker.getProgressTracker('TestTracker');

            setTimeout(
                () =>
                {
                    if (tmpTracker.PercentComplete < 100)
                    {
                        this.ProgressTracker.incrementProgressTracker('TestTracker', Math.floor(Math.random() * 10) + 10);
                        this.ProgressTracker.logProgressTrackerStatus('TestTracker');
                    }
                    return fDone();
                }, Math.floor(Math.random() * 100) + 110);
        }.bind(testFable));
}

// testFable.addServiceType('SimpleService', SimpleService);

// testFable.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');


// testFable.servicesMap['SimpleService']['SimpleService-123'].doSomething();

// testFable.SimpleService.doSomething();

// console.log(`Initialized Service ${testFable.servicesMap['SimpleService']['SimpleService-123'].serviceType} as UUID ${testFable.servicesMap['SimpleService']['SimpleService-123'].UUID} with hash ${testFable.servicesMap['SimpleService']['SimpleService-123'].Hash}`);

// testFable.servicesMap['SimpleService']['SimpleService-123'].doSomething();

// // Instantiate the RestClient Service Provider
// let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {TraceLog: true}, 'RestClient-99');

// // Download the wiktionary entry for dog!
// tmpRestClient.getJSON('https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&page=dog',
//     (pError, pResponse, pBody)=>
//     {
//         testFable.log.info('Response received~', pBody);
//     });
