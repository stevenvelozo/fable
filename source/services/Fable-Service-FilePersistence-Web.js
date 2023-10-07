const libFableServiceBase = require('fable-serviceproviderbase');
//const libLokiDB = require('@lokidb/loki');

class FableServiceFilePersistence extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'FilePersistence';
	}

	existsSync(pPath)
	{
		//return libFS.existsSync(pPath);
		console.log('I SHOULD BE IN YOUR BUILD YO');
		return false;
	}

	exists(pPath, fCallback)
	{
		let tmpFileExists = this.existsSync(pPath);;

		return fCallback(null, tmpFileExists);
	}

	makeFolderRecursive(pParameters, fCallback)
	{
		return fCallback();
	}
}

module.exports = FableServiceFilePersistence;