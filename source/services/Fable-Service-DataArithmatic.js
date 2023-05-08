const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

const libDataArithmatic = require('data-arithmatic');

class FableServiceDataArithmatic extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'DataArithmatic';

        this._DataArithmaticLibrary = new libDataArithmatic();
	}
}

module.exports = FableServiceDataArithmatic;