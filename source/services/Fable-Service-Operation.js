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
	addStep(pGUIDStep, fStepFunction, pStepName, pStepDescription, pStepMetadata)
	{
		let tmpStep = {};
		tmpStep.GUIDStep = (typeof(pGUIDStep) !== 'undefined') ? pGUIDStep : `STEP-${this.state.Steps.length}-${this.fable.DataGeneration.randomNumericString()}`;
		tmpStep.Name = (typeof(pStepName) !== 'undefined') ? pStepName : `Step [${tmpStep.GUIDStep}]`;
		tmpStep.Description = (typeof(pStepDescription) !== 'undefined') ? pStepDescription : `Step execution of ${tmpStep.Name}.`;
		// TODO: Right now this allows an Array... do we want to block that?
		tmpStep.Metadata = (typeof(pStepMetadata) === 'object') ? pStepMetadata : {};

		tmpStep.TimeStart = false;
		tmpStep.TimeEnd = false;

		// There is an array of steps, in the Operation State itself ... push a step there
		this.state.Steps.push(tmpStep);

		this.stepMap[tmpStep.GUIDStep]
		this.stepFunctions[tmpStep.GUIDStep] = fStepFunction;

		this.state.Status.StepCount++;
		return tmpStep;
	}

	getStep(pGUIDStep)
	{
		if (this.stepMap.hasOwnProperty(pGUIDStep))
		{
			return this.stepMap[pGUIDStep];
		}

		return false;
	}

	startStep(pGUIDStep)
	{
		let tmpStep = this.getStep(pGUIDStep);

		if (tmpStep === false)
		{
			return false;
		}

		tmpStep.TimeStart = +new Date();

		return tmpStep;
	}

	stopStep(pGUIDStep)
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


	/************************************************************************
	 * BEGINNING OF -->  Telemetry Helpers
	 */
	createTimeStamp(pTimeStampHash)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		this.timeStamps[tmpTimeStampHash] = +new Date();
		return this.timeStamps[tmpTimeStampHash];
	}

	getTimeDelta(pTimeStampHash)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		if (this.timeStamps.hasOwnProperty(tmpTimeStampHash))
		{
			let tmpEndTime = +new Date();
			return tmpEndTime-this.timeStamps[tmpTimeStampHash];
		}
		else
		{
			return -1;
		}
	}

	logTimeDelta(pTimeStampHash, pMessage)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : `Elapsed for ${tmpTimeStampHash}: `;
		let tmpOperationTime = this.getTimeDelta(pTimeStampHash);
		this.info(tmpMessage +' ('+tmpOperationTime+'ms)');
		return tmpOperationTime;
	}

	createProgressTracker(pTotalOperations, pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'DefaultProgressTracker';
		let tmpTotalOperations = (typeof(pTotalOperations) == 'number') ? pTotalOperations : 100;

		let tmpProgressTracker = (
			{
				Hash: tmpProgressTrackerHash,
				StartTime: this.createTimeStamp(tmpProgressTrackerHash),
				EndTime: 0,
				CurrentTime: 0,
				PercentComplete: -1,
				AverageOperationTime: -1,
				EstimatedCompletionTime: -1,
				TotalCount: tmpTotalOperations,
				CurrentCount:-1
			});

		this.progressTrackers[tmpProgressTrackerHash] = tmpProgressTracker;

		return tmpProgressTracker;
	}

	solveProgressTrackerStatus(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'DefaultProgressTracker';

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.createProgressTracker(100, tmpProgressTrackerHash);
		}

		let tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		tmpProgressTracker.CurrentTime = this.getTimeDelta(tmpProgressTracker.Hash);

		if ((tmpProgressTracker.CurrentCount > 0) && (tmpProgressTracker.TotalCount > 0))
		{
			tmpProgressTracker.PercentComplete = (tmpProgressTracker.CurrentCount / tmpProgressTracker.TotalCount) * 100.0;
		}

		if ((tmpProgressTracker.CurrentCount > 0) && (tmpProgressTracker.CurrentTime > 0))
		{
			tmpProgressTracker.AverageOperationTime = tmpProgressTracker.CurrentTime / tmpProgressTracker.CurrentCount;
		}

		if ((tmpProgressTracker.CurrentCount < tmpProgressTracker.TotalCount) && (tmpProgressTracker.AverageOperationTime > 0))
		{
			tmpProgressTracker.EstimatedCompletionTime = (tmpProgressTracker.TotalCount - tmpProgressTracker.CurrentCount) * tmpProgressTracker.AverageOperationTime;
		}
	}

	updateProgressTrackerStatus(pProgressTrackerHash, pCurrentOperations)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'DefaultProgressTracker';
		let tmpCurrentOperations = parseInt(pCurrentOperations);

		if (isNaN(tmpCurrentOperations))
		{
			return false;
		}

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.createProgressTracker(100, tmpProgressTrackerHash);
		}

		this.progressTrackers[tmpProgressTrackerHash].CurrentCount = tmpCurrentOperations;
		this.progressTrackers[tmpProgressTrackerHash].CurrentTime = this.getTimeDelta(tmpProgressTrackerHash);

		this.solveProgressTrackerStatus(tmpProgressTrackerHash);

		return this.progressTrackers[tmpProgressTrackerHash];
	}

	incrementProgressTrackerStatus(pProgressTrackerHash, pIncrementSize)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'DefaultProgressTracker';
		let tmpIncrementSize = parseInt(pIncrementSize);

		if (isNaN(tmpIncrementSize))
		{
			return false;
		}

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.createProgressTracker(100, tmpProgressTrackerHash);
		}

		this.progressTrackers[tmpProgressTrackerHash].CurrentCount = this.progressTrackers[tmpProgressTrackerHash].CurrentCount + tmpIncrementSize;
		this.progressTrackers[tmpProgressTrackerHash].CurrentTime = this.getTimeDelta(tmpProgressTrackerHash);

		this.solveProgressTrackerStatus(tmpProgressTrackerHash);

		return this.progressTrackers[tmpProgressTrackerHash];
	}

	setProgressTrackerEndTime(pProgressTrackerHash, pCurrentOperations)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'DefaultProgressTracker';
		let tmpCurrentOperations = parseInt(pCurrentOperations);

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			return false;
		}
		if (!isNaN(tmpCurrentOperations))
		{
			this.updateProgressTrackerStatus(tmpProgressTrackerHash, tmpCurrentOperations);
		}

		this.progressTrackers[tmpProgressTrackerHash].EndTime = this.getTimeDelta(tmpProgressTrackerHash);

		this.solveProgressTrackerStatus(tmpProgressTrackerHash);

		return this.progressTrackers[tmpProgressTrackerHash];
	}

	printProgressTrackerStatus(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'DefaultProgressTracker';

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.info(`>> Progress Tracker ${tmpProgressTrackerHash} does not exist!  No stats to display.`);
		}
		else
		{
			const tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

			if (tmpProgressTracker.CurrentCount < 1)
			{
				this.info(`>> Progress Tracker ${tmpProgressTracker.Hash} has no completed operations.  ${tmpProgressTracker.CurrentTime}ms have elapsed since it was started.`);
			}
			else if (tmpProgressTracker.EndTime < 1)
			{
				this.info(`>> Progress Tracker ${tmpProgressTracker.Hash} is ${tmpProgressTracker.PercentComplete.toFixed(3)}% completed - ${tmpProgressTracker.CurrentCount} / ${tmpProgressTracker.TotalCount} operations over ${tmpProgressTracker.CurrentTime}ms (median ${tmpProgressTracker.AverageOperationTime.toFixed(3)} per).  Estimated completion in ${tmpProgressTracker.EstimatedCompletionTime.toFixed(0)}ms or ${(tmpProgressTracker.EstimatedCompletionTime / 1000 / 60).toFixed(2)}minutes`)
			}
			else
			{
				this.info(`>> Progress Tracker ${tmpProgressTracker.Hash} is done and completed ${tmpProgressTracker.CurrentCount} / ${tmpProgressTracker.TotalCount} operations in ${tmpProgressTracker.EndTime}ms.`)
			}
		}
	}
	// logMemoryResourcesUsed()
	// {
	//
	// 	const tmpResourcesUsed = process.memoryUsage().heapUsed / 1024 / 1024;
	// 	this.info(`Memory usage at ${Math.round(tmpResourcesUsed * 100) / 100} MB`);
	// }
	/*
	 * END OF       -->  Logging and Telemetry Helpers
	 ************************************************************************/
}

module.exports = FableOperation;