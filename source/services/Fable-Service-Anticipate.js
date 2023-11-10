const libFableServiceBase = require('fable-serviceproviderbase');

class FableServiceAnticipate extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'AsyncAnticipate';

		// The queue of operations waiting to run.
		this.operationQueue = [];
		this.erroredOperations = [];

		this.executingOperationCount = 0;
		this.completedOperationCount = 0;

		this.maxOperations = 1;

		this.lastError = undefined;
		this.waitingFunctions = [];
	}

	checkQueue()
	{
		// This checks to see if we need to start any operations.
		if (this.operationQueue.length > 0 && this.executingOperationCount < this.maxOperations)
		{
			let tmpOperation = this.operationQueue.shift();
			this.executingOperationCount += 1;
			tmpOperation(this.buildAnticipatorCallback());
		}
		else if (this.waitingFunctions.length > 0 && this.executingOperationCount < 1)
		{
			// If there are no operations left, and we have waiting functions, call them.
			for (let i = 0; i < this.waitingFunctions.length; i++)
			{
				this.log.trace('Calling waiting function.')
				this.waitingFunctions[i](this.lastError);
			}
			// Reset our state
			this.lastError = undefined;
			this.waitingFunctions = [];
		}
	}

	// Expects a function fAsynchronousFunction(fCallback)
	anticipate(fAsynchronousFunction)
	{
		this.log.trace('Adding a function...')
		this.operationQueue.push(fAsynchronousFunction);
		this.checkQueue();
	}

	buildAnticipatorCallback()
	{
		// This uses closure-scoped state to track the callback state
		let tmpCallbackState = (
			{
				Called: false,
				Error: undefined,
				OperationSet: this
			});		
		return hoistedCallback;
		function hoistedCallback(pError)
		{
			if (tmpCallbackState.Called)
			{
				// If they call the callback twice, throw an error
				throw new Error("Anticipation async callback called twice...");
			}
			tmpCallbackState.Called = true;
			tmpCallbackState.error = pError;

			tmpCallbackState.OperationSet.executingOperationCount -= 1;
			tmpCallbackState.OperationSet.completedOperationCount += 1;

			tmpCallbackState.OperationSet.checkQueue();
		}
	}

	wait(fCallback)
	{
		this.waitingFunctions.push(fCallback);
		this.checkQueue();
	}
}

module.exports = FableServiceAnticipate;