const libFableServiceBase = require('fable-serviceproviderbase');

const libProgressTrackerClass = require('./Fable-Service-ProgressTracker/ProgressTracker.js');

class FableServiceProgressTrackerSet extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'ProgressTrackerSet';

		this.progressTrackers = {};

		// Create an internal PorgressTime service to track timestamps
		this.progressTimes = this.fable.instantiateServiceProviderWithoutRegistration('ProgressTime');

		// This timestamp is used and updated by *all* progress trackers.
		this.progressTimes.createTimeStamp('CurrentTime');
	}

	getProgressTracker(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.fable.log.warn(`ProgressTracker ${tmpProgressTrackerHash} does not exist!  Creating a new tracker...`);
			this.createProgressTracker(tmpProgressTrackerHash, 100);
		}

		return new libProgressTrackerClass(this, pProgressTrackerHash);
	}

	getProgressTrackerData(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.fable.log.warn(`ProgressTracker ${tmpProgressTrackerHash} does not exist!  Creating a new tracker...`);
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
				// If this is set to true, PercentComplete will be calculated as CurrentCount / TotalCount even if it goes over 100%
				AllowTruePercentComplete: false,

				ElapsedTime: -1,
				AverageOperationTime: -1,
				EstimatedCompletionTime: -1,

				TotalCount: tmpTotalOperations,

				CurrentCount:-1
			});

		if (tmpProgressTrackerHash in this.progressTrackers)
		{
			this.fable.log.warn(`ProgressTracker ${tmpProgressTrackerHash} already exists!  Overwriting with a new tracker...`);
			this.progressTimes.removeTimeStamp(tmpProgressTracker.StartTimeHash);
			this.progressTimes.removeTimeStamp(tmpProgressTracker.EndTimeHash);
		}

		this.progressTrackers[tmpProgressTrackerHash] = tmpProgressTracker;

		return tmpProgressTracker;
	}

	setProgressTrackerTotalOperations(pProgressTrackerHash, pTotalOperations)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';
		let tmpTotalOperations = (typeof(pTotalOperations) == 'number') ? pTotalOperations : 100;

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.fable.log.warn(`Attempted to set the total operations of ProgressTracker ${tmpProgressTrackerHash} but it does not exist!  Creating a new tracker...`);
			this.createProgressTracker(tmpProgressTrackerHash, tmpTotalOperations);
		}

		this.progressTrackers[tmpProgressTrackerHash].TotalCount = tmpTotalOperations;

		return this.progressTrackers[tmpProgressTrackerHash];
	}

	startProgressTracker(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		// This is the only method to lazily create ProgressTrackers now
		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.createProgressTracker(tmpProgressTrackerHash, 100);
		}

		let tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		this.progressTimes.createTimeStamp(this.progressTrackers[tmpProgressTrackerHash].StartTimeHash);
		tmpProgressTracker.StartTimeStamp = this.progressTimes.getTimeStampValue(this.progressTrackers[tmpProgressTrackerHash].StartTimeHash);
		if (tmpProgressTracker.CurrentCount < 0)
		{
			tmpProgressTracker.CurrentCount = 0;
		}

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	endProgressTracker(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.fable.log.error(`Attempted to end ProgressTracker ${tmpProgressTrackerHash} that does not exist!`);
			return false;
		}

		let tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		this.progressTimes.createTimeStamp(this.progressTrackers[tmpProgressTrackerHash].EndTimeHash);
		tmpProgressTracker.EndTimeStamp = this.progressTimes.getTimeStampValue(this.progressTrackers[tmpProgressTrackerHash].EndTimeHash);

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	solveProgressTrackerStatus(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.fable.log.error(`Attempted to solve ProgressTracker ${tmpProgressTrackerHash} that does not exist!`);
			return false;
		}

		let tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		if ((tmpProgressTracker.TotalCount < 1) || isNaN(tmpProgressTracker.TotalCount))
		{
			this.fable.log.error(`ProgressTracker ${tmpProgressTracker.Hash} has an invalid total count of operations (${tmpProgressTracker.TotalCount}!  Setting it to the default of 100...`);
			tmpProgressTracker.TotalCount = 100;
		}

		// Compute the percentage of progress that is complete.
		if (tmpProgressTracker.CurrentCount < 1)
		{
			tmpProgressTracker.PercentComplete = 0;
		}
		else
		{
			tmpProgressTracker.PercentComplete = (tmpProgressTracker.CurrentCount / tmpProgressTracker.TotalCount) * 100.0;
		}

		if (!tmpProgressTracker.AllowTruePercentComplete && (tmpProgressTracker.PercentComplete > 100))
		{
			tmpProgressTracker.PercentComplete = 100;
		}

		// Compute the average time per operation
		this.progressTimes.updateTimeStampValue('CurrentTime');
		tmpProgressTracker.CurrentTimeStamp = this.progressTimes.getTimeStampValue('CurrentTime');
		tmpProgressTracker.ElapsedTime = tmpProgressTracker.CurrentTimeStamp - tmpProgressTracker.StartTimeStamp;

		if (tmpProgressTracker.EndTimeStamp > 0)
		{
			tmpProgressTracker.ElapsedTime = tmpProgressTracker.EndTimeStamp - tmpProgressTracker.StartTimeStamp;
		}

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
			this.fable.log.warn(`Attempted to update ProgressTracker ${tmpProgressTrackerHash} with an invalid number of operations!`)
			return false;
		}

		if (!(tmpProgressTrackerHash in this.progressTrackers))
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

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			this.fable.log.warn(`Attempted to increment ProgressTracker ${tmpProgressTrackerHash} but it did not exist.`);
			return false;
		}

		if (this.progressTrackers[tmpProgressTrackerHash].StartTimeStamp < 1)
		{
			this.fable.log.warn(`Attempted to increment ProgressTracker ${tmpProgressTrackerHash} but it was not started.. starting now.`);
			this.startProgressTracker(tmpProgressTrackerHash);
		}

		this.progressTrackers[tmpProgressTrackerHash].CurrentCount = this.progressTrackers[tmpProgressTrackerHash].CurrentCount + tmpOperationIncrementAmount;

		return this.solveProgressTrackerStatus(tmpProgressTrackerHash);
	}

	getProgressTrackerCompletedOperationCountString(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		// This call here can mean if we add operations and then immediately get the string, this function runs twice.
		const tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

		// The states of a progress tracker:
		if (tmpProgressTracker.CurrentCount < 0)
		{
			return `none`;
		}
		else if (tmpProgressTracker.CurrentCount < 1)
		{
			return `0`;
		}
		else
		{
			return `${tmpProgressTracker.CurrentCount}`;
		}
	}

	getProgressTrackerPercentCompleteString(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		// This call here can mean if we add operations and then immediately get the string, this function runs twice.
		// TODO: Is there a pattern to avoid this double call that's worth putting in?
		this.solveProgressTrackerStatus(tmpProgressTrackerHash);

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			return `ProgressTracker ${tmpProgressTrackerHash} does not exist!  No stats to display.`;
		}
		else
		{
			const tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

			// The states of a progress tracker:
			// 1. Not started
			if (tmpProgressTracker.StartTimeStamp < 1)
			{
				return `0%`;
			}
			// 2. Started, but no operations completed

			if (tmpProgressTracker.CurrentCount < 1)
			{
				return `0%`;
			}
			// 3. Started, some operations completed
			else if (tmpProgressTracker.EndTimeStamp < 1)
			{
				return `${tmpProgressTracker.PercentComplete.toFixed(3)}%`;
			}
			// 4. Done
			else
			{
				return `${tmpProgressTracker.PercentComplete.toFixed(3)}%`;
			}
		}
	}

	getProgressTrackerStatusString(pProgressTrackerHash)
	{
		let tmpProgressTrackerHash = (typeof(pProgressTrackerHash) == 'string') ? pProgressTrackerHash : 'Default';

		// This call here can mean if we add operations and then immediately get the string, this function runs twice.
		// TODO: Is there a pattern to avoid this double call that's worth putting in?
		this.solveProgressTrackerStatus(tmpProgressTrackerHash);

		if (!(tmpProgressTrackerHash in this.progressTrackers))
		{
			return `ProgressTracker ${tmpProgressTrackerHash} does not exist!  No stats to display.`;
		}
		else
		{
			const tmpProgressTracker = this.progressTrackers[tmpProgressTrackerHash];

			// The states of a progress tracker:
			// 1. Not started
			if (tmpProgressTracker.StartTimeStamp < 1)
			{
				return `ProgressTracker ${tmpProgressTracker.Hash} has not been started yet.`;
			}
			// 2. Started, but no operations completed

			if ((tmpProgressTracker.CurrentCount < 1) && (tmpProgressTracker.EndTimeStamp < 1))
			{
				return `ProgressTracker ${tmpProgressTracker.Hash} has no completed operations.  ${this.progressTimes.formatTimeDuration(tmpProgressTracker.ElapsedTime)} have elapsed since it was started.`;
			}
			// 3. Started, some operations completed
			else if (tmpProgressTracker.EndTimeStamp < 1)
			{
				return `ProgressTracker ${tmpProgressTracker.Hash} is ${tmpProgressTracker.PercentComplete.toFixed(3)}% completed - ${tmpProgressTracker.CurrentCount} / ${tmpProgressTracker.TotalCount} operations over ${this.progressTimes.formatTimeDuration(tmpProgressTracker.ElapsedTime)} (median ${this.progressTimes.formatTimeDuration(tmpProgressTracker.AverageOperationTime)} per).  Estimated completion: ${this.progressTimes.formatTimeDuration(tmpProgressTracker.EstimatedCompletionTime)}`;			}
			// 4. Done
			else
			{
				return `ProgressTracker ${tmpProgressTracker.Hash} is done.  ${tmpProgressTracker.CurrentCount} / ${tmpProgressTracker.TotalCount} operations were completed in ${this.progressTimes.formatTimeDuration(tmpProgressTracker.ElapsedTime)} (median ${this.progressTimes.formatTimeDuration(tmpProgressTracker.AverageOperationTime)} per).`;
			}
		}
	}

	logProgressTrackerStatus(pProgressTrackerHash)
	{
		this.fable.log.info(this.getProgressTrackerStatusString(pProgressTrackerHash));
	}
}

module.exports = FableServiceProgressTrackerSet;