const libFableServiceBase = require('../Fable-ServiceProviderBase.js');

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