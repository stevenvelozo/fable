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

    makeFolderRecursive (pParameters, fCallback)
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

        // Check if the path exists
        libFS.open(tmpParameters.CurrentPath + libPath.sep + tmpParameters.ActualPathParts[tmpParameters.CurrentPathIndex], 'r',
            function(pError, pFileDescriptor)
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
                            else
                            {
                                fCallback(pCreateError);
                                return false;
                            }
                        });
                }
                else
                {
                    return this.makeFolderRecursive(tmpParameters, fCallback);
                }
            }
        );
    }
}

module.exports = FableServiceFilePersistence;