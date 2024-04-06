const libFableServiceBase = require('fable-serviceproviderbase');

const _OperationStatePrototypeString = JSON.stringify(require('./Fable-Service-Operation-DefaultSettings.js'));

class FableOperation extends libFableServiceBase
{

	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

		// Timestamps will just be the long ints
		this.timeStamps = {};

		// ProgressTrackers have an object format of: {Hash:'SomeHash',EndTime:UINT,CurrentTime:UINT,TotalCount:INT,CurrentCount:INT}
		this.progressTrackers = {};

        this.serviceType = 'PhasedOperation';

		this.state = JSON.parse(_OperationStatePrototypeString);

		this.stepMap = {};
		this.stepFunctions = {};

		// Match the service instantiation to the operation.
		this.state.Metadata.Hash = this.Hash;
		this.state.Metadata.UUID = this.UUID;

		this.state.Metadata.Name = (typeof(this.options.Name) == 'string') ? this.options.Name : `Unnamed Operation ${this.state.Metadata.UUID}`;
		this.name = this.state.Metadata.Name;

		this.log = this;
	}

	execute(fExecutionCompleteCallback)
	{
		// TODO: Should the same operation be allowed to execute more than one time?
		if (this.state.Status.TimeStart)
		{
			return fExecutionCompleteCallback(new Error(`Operation [${this.state.Metadata.UUID}] ${this.state.Metadata.Name} has already been executed!`));
		}

		this.state.Status.TimeStart = +new Date();

		let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');

		for (let i = 0; i < this.state.Steps; i++)
		{
			tmpAnticipate.anticipate(this.stepFunctions[this.state.Steps[i].GUIDStep].bind(this));
		}

		// Wait for the anticipation to complete
		tmpAnticipate.wait(
			(pError) =>
			{
				this.state.Status.TimeEnd = +new Date();
				return fExecutionCompleteCallback();
			});
	}

/*
	TODO: I've gone back and forth on whether this should be an object, JSON 
	object prototype, or set of functions here.  Discuss with colleagues!
*/
	addStep(fStepFunction, pStepName, pStepDescription, pStepMetadata, pGUIDStep)
	{
		let tmpStep = {};

		// GUID is optional
		tmpStep.GUIDStep = (typeof(pGUIDStep) !== 'undefined') ? pGUIDStep : `STEP-${this.state.Steps.length}-${this.fable.DataGeneration.randomNumericString()}`;

		// Name is optional
		tmpStep.Name = (typeof(pStepName) !== 'undefined') ? pStepName : `Step [${tmpStep.GUIDStep}]`;
		tmpStep.Description = (typeof(pStepDescription) !== 'undefined') ? pStepDescription : `Step execution of ${tmpStep.Name}.`;

		tmpStep.Metadata = (typeof(pStepMetadata) === 'object') ? pStepMetadata : {};

		tmpStep.TimeStart = false;
		tmpStep.TimeEnd = false;

		// There is an array of steps, in the Operation State itself ... push a step there
		this.state.Steps.push(tmpStep);

		this.stepFunctions[tmpStep.GUIDStep] = fStepFunction;;

		this.stepMap[tmpStep.GUIDStep];

		this.state.Status.StepCount++;

		return tmpStep;
	}

	/**
	 * Retrieves a step from the step map based on the provided GUID.
	 * @param {string} pGUIDStep - The GUID of the step to retrieve.
	 * @returns {object|boolean} - The step object if found, otherwise false.
	 */
	getStep(pGUIDStep)
	{
		if (this.stepMap.hasOwnProperty(pGUIDStep))
		{
			return this.stepMap[pGUIDStep];
		}

		return false;
	}

	/**
	 * Begins a step in the Fable service operation.
	 * @param {string} pGUIDStep - The GUID of the step to begin.
	 * @returns {object|boolean} - The step object if found, or `false` if not found.
	 */
	beginStep(pGUIDStep)
	{
		let tmpStep = this.getStep(pGUIDStep);

		if (tmpStep === false)
		{
			return false;
		}

		tmpStep.TimeStart = +new Date();

		return tmpStep;
	}

	endStep(pGUIDStep)
	{
		let tmpStep = this.getStep(pGUIDStep);

		if (tmpStep === false)
		{
			return false;
		}

		tmpStep.TimeEnd = +new Date();

		return tmpStep;
	}

	writeOperationLog(pLogLevel, pLogText, pLogObject)
	{
		this.state.Log.push(`[${new Date().toUTCString()}]-[${pLogLevel}]: ${pLogText}`);

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