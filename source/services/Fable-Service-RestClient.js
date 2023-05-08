const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

const libSimpleGet = require('simple-get');

class FableServiceRestClient extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'RestClient';

        this._SimpleGet = new libSimpleGet();
	}
}

module.exports = FableServiceRestClient;