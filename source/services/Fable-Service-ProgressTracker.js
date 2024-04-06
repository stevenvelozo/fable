const libFableServiceBase = require('fable-serviceproviderbase');

class FableServiceProgressTracker extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'ProgressTracker';
	}

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
}

module.exports = FableServiceProgressTracker;