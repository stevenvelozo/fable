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

testFable.addServiceType('SimpleService', SimpleService);

testFable.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');


testFable.servicesMap['SimpleService']['SimpleService-123'].doSomething();

testFable.SimpleService.doSomething();

console.log(`Initialized Service ${testFable.servicesMap['SimpleService']['SimpleService-123'].serviceType} as UUID ${testFable.servicesMap['SimpleService']['SimpleService-123'].UUID} with hash ${testFable.servicesMap['SimpleService']['SimpleService-123'].Hash}`);

testFable.servicesMap['SimpleService']['SimpleService-123'].doSomething();

// Instantiate the RestClient Service Provider
let tmpRestClient = testFable.instantiateServiceProvider('RestClient', {TraceLog: true}, 'RestClient-99');

// Download the wiktionary entry for dog!
tmpRestClient.getJSON('https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&page=dog',
    (pError, pResponse, pBody)=>
    {
        testFable.log.info('Response received~', pBody);
    });
