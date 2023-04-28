const libFable = require('../source/Fable.js');

let testFable = new libFable({});

testFable.serviceManager.addServiceType('SimpleService');

testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');

console.log(`Initialized Service ${testFable.serviceManager.services['SimpleService']['SimpleService-123'].serviceType} as UUID ${testFable.serviceManager.services['SimpleService']['SimpleService-123'].UUID} with hash ${testFable.serviceManager.services['SimpleService']['SimpleService-123'].Hash}`);