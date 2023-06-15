const libFableServiceBase = require('../Fable-ServiceManager.js').ServiceProviderBase;

const libFS = require('fs');
const libPath = require('path');


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

		this.currentInputFolder = `/tmp`;
		this.currentOutputFolder = `/tmp`;
	}

	joinPath(...pPathArray)
	{
		return libPath.resolve(...pPathArray);
	}

	existsSync(pPath)
	{
		return libFS.existsSync(pPath);
	}

	exists(pPath, fCallback)
	{
		let tmpFileExists = this.existsSync(pPath);;

		return fCallback(null, tmpFileExists);
	}

	writeFileSync(pFileName, pFileContent, pOptions)
	{
		let tmpOptions = (typeof(pOptions) === 'undefined') ? 'utf8' : pOptions;
		return libFS.writeFileSync(pFileName, pFileContent, tmpOptions);
	}

	appendFileSync(pFileName, pAppendContent, pOptions)
	{
		let tmpOptions = (typeof(pOptions) === 'undefined') ? 'utf8' : pOptions;
		return libFS.appendFileSync(pFileName, pAppendContent, tmpOptions);
	}

	deleteFileSync(pFileName)
	{
		return libFS.unlinkSync(pFileName);
	}

	deleteFolderSync(pFileName)
	{
		return libFS.rmdirSync(pFileName);
	}

	writeFileSyncFromObject(pFileName, pObject)
	{
		return this.writeFileSync(pFileName, JSON.stringify(pObject, null, 4));
	}

	writeFileSyncFromArray(pFileName, pFileArray)
	{
		if (!Array.isArray(pFileArray))
		{
			this.log.error(`File Persistence Service attempted to write ${pFileName} from array but the expected array was not an array (it was a ${typeof(pFileArray)}).`);
			return Error('Attempted to write ${pFileName} from array but the expected array was not an array (it was a ${typeof(pFileArray)}).');
		}
		else
		{
			for (let i = 0; i < pFileArray.length; i++)
			{
				return this.appendFileSync(pFileName, `${pFileArray[i]}\n`);
			}
		}
	}

	// Default folder behaviors

	getDefaultOutputPath(pFileName)
	{
		return libPath.join(this.currentOutputFolder, pFileName);
	}

	dataFolderWriteSync(pFileName, pFileContent)
	{
		return this.writeFileSync(this.getDefaultOutputPath(pFileName), pFileContent);
	}

	dataFolderWriteSyncFromObject(pFileName, pObject)
	{
		return this.writeFileSyncFromObject(this.getDefaultOutputPath(pFileName), pObject);
	}

	dataFolderWriteSyncFromArray(pFileName, pFileArray)
	{
		return this.writeFileSyncFromArray(this.getDefaultOutputPath(pFileName), pFileArray);
	}

	// Folder management
	makeFolderRecursive(pParameters, fCallback)
	{
		let tmpParameters = pParameters;

		if (typeof(pParameters) == 'string')
		{
			tmpParameters = { Path: pParameters };
		}
		else if (typeof(pParameters) !== 'object')
		{
			fCallback(new Error('Parameters object or string not properly passed to recursive folder create.'));
			return false;
		}

		if ((typeof(tmpParameters.Path) !== 'string'))
		{
			fCallback(new Error('Parameters object needs a path to run the folder create operation.'));
			return false;
		}

		if (!tmpParameters.hasOwnProperty('Mode'))
		{
			tmpParameters.Mode = this.options.Mode;
		}

		// Check if we are just starting .. if so, build the initial state for our recursive function
		if (typeof(tmpParameters.CurrentPathIndex) === 'undefined')
		{
			// Build the tools to start recursing
			tmpParameters.ActualPath = libPath.normalize(tmpParameters.Path);
			tmpParameters.ActualPathParts = tmpParameters.ActualPath.split(libPath.sep);
			tmpParameters.CurrentPathIndex = 0;
			tmpParameters.CurrentPath = '';
		}
		else
		{
			// This is not our first run, so we will continue the recursion.
			// Build the new base path
			if (tmpParameters.CurrentPath == libPath.sep)
			{
				tmpParameters.CurrentPath = tmpParameters.CurrentPath + tmpParameters.ActualPathParts[tmpParameters.CurrentPathIndex];
			}
			else
			{
				tmpParameters.CurrentPath = tmpParameters.CurrentPath + libPath.sep + tmpParameters.ActualPathParts[tmpParameters.CurrentPathIndex];
			}

			// Increment the path index
			tmpParameters.CurrentPathIndex++;
		}

		// Check if the path is fully complete
		if (tmpParameters.CurrentPathIndex >= tmpParameters.ActualPathParts.length)
		{
			fCallback(null);
			return true;
		}

		// Check if the path exists (and is a folder)
		libFS.open(tmpParameters.CurrentPath + libPath.sep + tmpParameters.ActualPathParts[tmpParameters.CurrentPathIndex], 'r',
			(pError, pFileDescriptor)=>
			{
				if (pFileDescriptor)
				{
					libFS.closeSync(pFileDescriptor);
				}

				if (pError && pError.code=='ENOENT')
				{
					/* Path doesn't exist, create it */
					libFS.mkdir(tmpParameters.CurrentPath + libPath.sep + tmpParameters.ActualPathParts[tmpParameters.CurrentPathIndex], tmpParameters.Mode,
						(pCreateError) =>
						{
							if (!pCreateError)
							{
								// We have now created our folder and there was no error -- continue.
								return this.makeFolderRecursive(tmpParameters, fCallback);
							}
							else if (pCreateError.code =='EEXIST')
							{
								// The folder exists -- our dev might be running this in parallel/async/whatnot.
								return this.makeFolderRecursive(tmpParameters, fCallback);
							}
							else
							{
								console.log(pCreateError.code);
								fCallback(pCreateError);
								return false;
							}
						});
				}
				else
				{
					return this.makeFolderRecursive(tmpParameters, fCallback);
				}
			});
	}
}

module.exports = FableServiceFilePersistence;