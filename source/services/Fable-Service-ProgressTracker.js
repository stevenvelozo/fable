const libFableServiceBase = require('fable-serviceproviderbase');

class FableServiceProgressTracker extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'ProgressTracker';

		this.progressTrackers = {};

		// Create an internal PorgressTime service to track timestamps
		this.progressTimes = this.fable.instantiateServiceProviderWithoutRegistration('ProgressTime');

		// This timestamp is used and updated by *all* progress trackers.
		this.progressTimes.createTimeStamp('CurrentTime');
	}

	getProgressTracker(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.fable.log.warn(`Progress Tracker ${tmpProgressTrackerHash} does not exist!  Creating a new tracker...`);
			this.createProgressTracker(tmpProgressTrackerHash, 100);
		}

		return this.progressTrackers[tmpProgressTrackerHash];
	}

	createProgressTracker(pProgressTrackerHash, pTotalOperations)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';
		let tmpTotalOperations = (typeof(pTotalOperations) == 'number') ? pTotalOperations : 100;

		let tmpProgressTracker = (
			{
				Hash: tmpProgressTrackerHash,

				StartTimeHash: `${tmpProgressTrackerHash}-Start`,
				StartTimeStamp: -1,
				CurrentTimeStamp: -1,
				EndTimeHash: `${tmpProgressTrackerHash}-End`,
				EndTimeStamp: -1,

				PercentComplete: -1,

				ElapsedTime: -1,
				AverageOperationTime: -1,
				EstimatedCompletionTime: -1,

				TotalCount: tmpTotalOperations,

				CurrentCount:-1
			});

		if (this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.fable.log.warn(`Progress Tracker ${tmpProgressTrackerHash} already exists!  Overwriting with a new tracker...`);
			this.progressTimes.removeTimeStamp(tmpProgressTracker.StartTimeHash);
			this.progressTimes.removeTimeStamp(tmpProgressTracker.EndTimeHash);
		}

		this.progressTrackers[tmpProgressTrackerHash] = tmpProgressTracker;

		return tmpProgressTracker;
	}

	startProgressTracker(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		// This is the only method to lazily create Progress Trackers now
		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.createProgressTracker(tmpProgressTrackerHash, 100);
		}

		let tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		this.progressTimes.createTimeStamp(this.progressTrackers[tmpProgressTrackerHash].StartTimeHash);
		tmpProgressTracker.StartTimeStamp = this.progressTimes.getTimeStampValue(this.progressTrackers[tmpProgressTrackerHash].StartTimeHash);

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	endProgressTracker(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.fable.log.error(`Attempted to end Progress Tracker ${tmpProgressTrackerHash} that does not exist!`);
			return false;
		}

		this.progressTimes.createTimeStamp(this.progressTrackers[tmpProgressTrackerHash].EndTimeHash);
		tmpProgressTracker.EndTimeStamp = this.progressTimes.getTimeStampValue(this.progressTrackers[tmpProgressTrackerHash].EndTimeHash);

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	solveProgressTrackerStatus(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.fable.log.error(`Attempted to solve Progress Tracker ${tmpProgressTrackerHash} that does not exist!`);
			return false;
		}

		let tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		if ((tmpProgressTracker.TotalCount < 1) || isNaN(tmpProgressTracker.TotalCount))
		{
			this.fable.log.error(`Progress Tracker ${tmpProgressTracker.Hash} has an invalid total count of operations (${tmpProgressTracker.TotalCount}!  Setting it to the default of 100...`);
			tmpProgressTracker.TotalCount = 100;
		}

		// Compute the percentage of progress that is complete.
		if (tmpProgressTracker.CurrentCount < 1)
		{
			tmpProgressTracker.PercentComplete = 0;
			return tmpProgressTracker;
		}
		else
		{
			tmpProgressTracker.PercentComplete = (tmpProgressTracker.CurrentCount / tmpProgressTracker.TotalCount) * 100.0;
		}

		// Compute the average time per operation
		this.progressTimes.updateTimeStampValue('CurrentTime');
		tmpProgressTracker.CurrentTimeStamp = this.progressTimes.getTimeStampValue('CurrentTime');
		tmpProgressTracker.ElapsedTime = tmpProgressTracker.CurrentTimeStamp - tmpProgressTracker.StartTimeStamp;

		if (tmpProgressTracker.CurrentCount > 0)
		{
			tmpProgressTracker.AverageOperationTime = (tmpProgressTracker.CurrentTimeStamp-tmpProgressTracker.StartTimeStamp) / tmpProgressTracker.CurrentCount;
		}
		else
		{
			tmpProgressTracker.AverageOperationTime = -1;
		}

		// Compute the estimated completion
		if (tmpProgressTracker.AverageOperationTime > 0)
		{
			tmpProgressTracker.EstimatedCompletionTime = Math.max((tmpProgressTracker.TotalCount - tmpProgressTracker.CurrentCount), 0) * tmpProgressTracker.AverageOperationTime;
		}
		else
		{
			tmpProgressTracker.EstimatedCompletionTime = -1;
		}

		return tmpProgressTracker;
	}

	updateProgressTracker(pProgressTrackerHash, pCurrentOperations)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';
		let tmpCurrentOperations = parseInt(pCurrentOperations);

		if (isNaN(tmpCurrentOperations))
		{
			this.fable.log.warn(`Attempted to update Progress Tracker ${tmpProgressTrackerHash} with an invalid number of operations!`)
			return false;
		}

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.createProgressTracker(100, tmpProgressTrackerHash);
		}

		this.progressTrackers[tmpProgressTrackerHash].CurrentCount = tmpCurrentOperations;

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	incrementProgressTracker(pProgressTrackerHash, pOperationIncrementAmount)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';
		let tmpOperationIncrementAmount = parseInt(pOperationIncrementAmount);

		if (isNaN(tmpOperationIncrementAmount))
		{
			tmpOperationIncrementAmount = 1;
		}

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.fable.log.warn(`Attempted to increment Progress Tracker ${tmpProgressTrackerHash} but it did not exist.`);
			return false;
		}

		if (this.progressTrackers[tmpProgressTrackerHash].StartTimeStamp < 1)
		{
			this.fable.log.warn(`Attempted to increment Progress Tracker ${tmpProgressTrackerHash} but it was not started.. starting now.`);
			this.startProgressTracker(tmpProgressTrackerHash);
		}

		this.progressTrackers[tmpProgressTrackerHash].CurrentCount = this.progressTrackers[tmpProgressTrackerHash].CurrentCount + tmpOperationIncrementAmount;

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	logProgressTrackerStatus(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!this.progressTrackers.hasOwnProperty(tmpProgressTrackerHash))
		{
			this.fable.log.info(`>> Progress Tracker ${tmpProgressTrackerHash} does not exist!  No stats to display.`);
		}
		else
		{
			const tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

			if (tmpProgressTracker.CurrentCount < 1)
			{
				this.fable.log.info(`>> Progress Tracker ${tmpProgressTracker.Hash} has no completed operations.  ${tmpProgressTracker.CurrentTime}ms have elapsed since it was started.`);
			}
			else if (tmpProgressTracker.EndTimeStamp < 1)
			{
				this.fable.log.info(`>> Progress Tracker ${tmpProgressTracker.Hash} is ${tmpProgressTracker.PercentComplete.toFixed(3)}% completed - ${tmpProgressTracker.CurrentCount} / ${tmpProgressTracker.TotalCount} operations over ${this.progressTimes.formatTimeDuration(tmpProgressTracker.ElapsedTime)} (median ${this.progressTimes.formatTimeDuration(tmpProgressTracker.AverageOperationTime)} per).  Estimated completion in ${this.progressTimes.formatTimeDuration(tmpProgressTracker.EstimatedCompletionTime)}`)
			}
			else
			{
				this.fable.log.info(`>> Progress Tracker ${tmpProgressTracker.Hash} is done and completed ${tmpProgressTracker.CurrentCount} / ${tmpProgressTracker.TotalCount} operations in ${tmpProgressTracker.EndTime}ms.`)
			}
		}
	}
}

module.exports = FableServiceProgressTracker;