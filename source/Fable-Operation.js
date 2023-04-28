const _OperationStatePrototype = JSON.stringify(
{
	"Metadata": {
		"GUID": false,
		"Hash": false,

		"Title": "",
		"Summary": "",

		"Version": 0
	},
	"Status": {
        "Completed": false,

        "CompletionProgress": 0,
        "CompletionTimeElapsed": 0,

        "Steps": 1,
        "StepsCompleted": 0,

        "StartTime": 0,
        "EndTime": 0
	},
	"Errors": [],
	"Log": []
});

class FableOperation
{
	constructor(pFable, pOperationName, pOperationHash)
	{
		this.fable = pFable;

		this.name = pOperationName;

		this.state = JSON.parse(_OperationStatePrototype);

		this.state.Metadata.GUID = this.fable.getUUID();
		this.state.Metadata.Hash = this.state.GUID;

		if (typeof(pOperationHash) == 'string')
		{
			this.state.Metadata.Hash = pOperationHash;
		}
	}

	get GUID()
	{
		return this.state.Metadata.GUID;
	}

	get Hash()
	{
		return this.state.Metadata.Hash;
	}

	get log()
	{
		return this;
	}

	writeOperationLog(pLogLevel, pLogText, pLogObject)
	{
		this.state.Log.push(`${new Date().toUTCString()} [${pLogLevel}]: ${pLogText}`);

		if (typeof(pLogObject) == 'object')
		{
			this.state.Log.push(JSON.stringify(pLogObject));
		}
	}

	writeOperationErrors(pLogText, pLogObject)
	{
		this.state.Errors.push(`${pLogText}`);

		if (typeof(pLogObject) == 'object')
		{
			this.state.Errors.push(JSON.stringify(pLogObject));
		}
	}

	trace(pLogText, pLogObject)
	{
		this.writeOperationLog('TRACE', pLogText, pLogObject);
		this.fable.log.trace(pLogText, pLogObject);
	}

	debug(pLogText, pLogObject)
	{
		this.writeOperationLog('DEBUG', pLogText, pLogObject);
		this.fable.log.debug(pLogText, pLogObject);
	}

	info(pLogText, pLogObject)
	{
		this.writeOperationLog('INFO', pLogText, pLogObject);
		this.fable.log.info(pLogText, pLogObject);
	}

	warn(pLogText, pLogObject)
	{
		this.writeOperationLog('WARN', pLogText, pLogObject);
		this.fable.log.warn(pLogText, pLogObject);
	}

	error(pLogText, pLogObject)
	{
		this.writeOperationLog('ERROR', pLogText, pLogObject);
		this.writeOperationErrors(pLogText, pLogObject);
		this.fable.log.error(pLogText, pLogObject);
	}

	fatal(pLogText, pLogObject)
	{
		this.writeOperationLog('FATAL', pLogText, pLogObject);
		this.writeOperationErrors(pLogText, pLogObject);
		this.fable.log.fatal(pLogText, pLogObject);
	}
}

module.exports = FableOperation;