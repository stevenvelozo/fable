const libFableServiceBase = require('fable-serviceproviderbase');

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