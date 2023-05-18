const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

class FableServiceFilePersistence extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'FilePersistence';

        if (!this.options.hasOwnProperty('Mode'))
        {
            this.options.Mode = parseInt('0777', 8) & ~process.umask();
        }
	}

    existsSync(pPath)
    {
        //return libFS.existsSync(pPath);
        return false;
    }

    exists(pPath, fCallback)
    {
        let tmpFileExists = this.existsSync(pPath);;

        return fCallback(null, tmpFileExists);
    }

    makeFolderRecursive (pParameters, fCallback)
    {
        return fCallback();
    }
}

module.exports = FableServiceFilePersistence;