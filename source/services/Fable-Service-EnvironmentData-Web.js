const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

class FableServiceEnvironmentData extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'EnvironmentData';

		this.Environment = `web`;
	}
}

module.exports = FableServiceEnvironmentData;