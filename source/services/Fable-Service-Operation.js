const { PE } = require('big.js');
const libFableServiceBase = require('fable-serviceproviderbase');

const _OperationStatePrototypeString = JSON.stringify(require('./Fable-Service-Operation-DefaultSettings.js'));

class FableOperation extends libFableServiceBase
{

	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

		// Timestamps will just be the long ints
		this.timeStamps = {};

        this.serviceType = 'PhasedOperation';

		this.state = JSON.parse(_OperationStatePrototypeString);

		this.stepMap = {};
		this.stepFunctions = {};

		// Match the service instantiation to the operation.
		this.state.Metadata.Hash = this.Hash;
		this.state.Metadata.UUID = this.UUID;

		this.state.Metadata.Name = (typeof(this.options.Name) == 'string') ? this.options.Name : `Unnamed Operation ${this.state.Metadata.UUID}`;
		this.name = this.state.Metadata.Name;

		this.progressTrackerSet = this.fable.instantiateServiceProviderWithoutRegistration('ProgressTrackerSet');

		this.state.OverallProgressTracker = this.progressTrackerSet.createProgressTracker(`Overall-${this.state.Metadata.UUID}`);

		// This is here to use the pass-through logging functions in the operation itself.
		this.log = this;
	}

	execute(fExecutionCompleteCallback)
	{
		// TODO: Should the same operation be allowed to execute more than one time?
		if (this.state.OverallProgressTracker.StartTimeStamp > 0)
		{
			return fExecutionCompleteCallback(new Error(`Operation [${this.state.Metadata.UUID}] ${this.state.Metadata.Name} has already been executed!`));
		}

		let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
		
		this.progressTrackerSet.setProgressTrackerTotalOperations(this.state.OverallProgressTracker.Hash, this.state.Status.StepCount);
		this.progressTrackerSet.startProgressTracker(this.state.OverallProgressTracker.Hash);
		this.info(`Operation [${this.state.Metadata.UUID}] ${this.state.Metadata.Name} starting...`);

		for (let i = 0; i < this.state.Steps.length; i++)
		{
			tmpAnticipate.anticipate(
				function(fNext)
				{
					this.fable.log.info(`Step #${i} [${this.state.Steps[i].GUIDStep}] ${this.state.Steps[i].Name} starting...`);
					this.progressTrackerSet.startProgressTracker(this.state.Steps[i].ProgressTracker.Hash);
					return fNext();
				}.bind(this));
			// Steps are executed in a custom context with 
			tmpAnticipate.anticipate(this.stepFunctions[this.state.Steps[i].GUIDStep].bind(
				{
					log:this,
					fable:this.fable,
					options:this.state.Steps[i].Metadata,
					metadata:this.state.Steps[i].Metadata,
					ProgressTracker:this.progressTrackerSet.getProgressTracker(this.state.Steps[i].ProgressTracker.Hash),
					logProgressTrackerStatus: function() 
						{
							return this.log.info(`Step #${i} [${this.state.Steps[i].GUIDStep}]: ${this.progressTrackerSet.getProgressTrackerStatusString(this.state.Steps[i].ProgressTracker.Hash)}`);
						}.bind(this),
					OperationState:this.state,
					StepState:this.state.Steps[i]
				}));
			tmpAnticipate.anticipate(
				function(fNext)
				{
					this.progressTrackerSet.endProgressTracker(this.state.Steps[i].ProgressTracker.Hash);
					let tmpStepTimingMessage = this.progressTrackerSet.getProgressTrackerStatusString(this.state.Steps[i].ProgressTracker.Hash);
					this.fable.log.info(`Step #${i} [${this.state.Steps[i].GUIDStep}] ${this.state.Steps[i].Name} complete.`);
					this.fable.log.info(`Step #${i} [${this.state.Steps[i].GUIDStep}] ${this.state.Steps[i].Name} ${tmpStepTimingMessage}.`);
			
					this.progressTrackerSet.incrementProgressTracker(this.state.OverallProgressTracker.Hash, 1);
					let tmpOperationTimingMessage = this.progressTrackerSet.getProgressTrackerStatusString(this.state.OverallProgressTracker.Hash);
					this.fable.log.info(`Operation [${this.state.Metadata.UUID}] ${tmpOperationTimingMessage}.`);
					return fNext();
				}.bind(this));
		}

		// Wait for the anticipation to complete
		tmpAnticipate.wait(
			(pError) =>
			{
				if (pError)
				{
					this.fable.log.error(`Operation [${this.state.Metadata.UUID}] ${this.state.Metadata.Name} had an error: ${pError}`, pError);
					return fExecutionCompleteCallback(pError);
				}
				this.info(`Operation [${this.state.Metadata.UUID}] ${this.state.Metadata.Name} complete.`);
				let tmpOperationTimingMessage = this.progressTrackerSet.getProgressTrackerStatusString(this.state.OverallProgressTracker.Hash);
				this.progressTrackerSet.endProgressTracker(this.state.OverallProgressTracker.Hash);
				this.fable.log.info(`Operation [${this.state.Metadata.UUID}] ${tmpOperationTimingMessage}.`);
				return fExecutionCompleteCallback();
			});
	}

	// There are three ways to add steps:
	// 1. As a basic javascript function
	//    --
	//    This is the most basic, java"script" way to add a step.  It will
	//    setup a "this" context that has the following properties:
	//    - log: A reference to the operation's log object

	addStep(fStepFunction, pStepMetadata, pStepName, pStepDescription, pGUIDStep)
	{
		let tmpStep = {};

		// GUID is optional
		tmpStep.GUIDStep = (typeof(pGUIDStep) !== 'undefined') ? pGUIDStep : `STEP-${this.state.Steps.length}-${this.fable.DataGeneration.randomNumericString()}`;


		// Name is optional
		tmpStep.Name = (typeof(pStepName) !== 'undefined') ? pStepName : `Step [${tmpStep.GUIDStep}]`;
		tmpStep.Description = (typeof(pStepDescription) !== 'undefined') ? pStepDescription : `Step execution of ${tmpStep.Name}.`;

		tmpStep.ProgressTracker = this.progressTrackerSet.createProgressTracker(tmpStep.GUIDStep);

		tmpStep.Metadata = (typeof(pStepMetadata) === 'object') ? pStepMetadata : {};

		// There is an array of steps, in the Operation State itself ... push a step there
		this.state.Steps.push(tmpStep);

		this.stepMap[tmpStep.GUIDStep] = tmpStep;

		this.stepFunctions[tmpStep.GUIDStep] = typeof(fStepFunction) == 'function' ? fStepFunction : function (fDone) { return fDone(); };

		this.state.Status.StepCount++;

		return tmpStep;
	}

	setStepTotalOperations(pGUIDStep, pTotalOperationCount)
	{
		if (!(pGUIDStep in this.stepMap))
		{
			return new Error(`Step [${pGUIDStep}] does not exist in operation [${this.state.Metadata.UUID}] ${this.state.Metadata.Name} when attempting to set total operations to ${pTotalOperationCount}.`);
		}

		this.progressTrackerSet.setProgressTrackerTotalOperations(this.stepMap[pGUIDStep].ProgressTracker.Hash, pTotalOperationCount);
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