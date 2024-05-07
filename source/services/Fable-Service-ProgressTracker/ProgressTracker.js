class ProgressTracker
{
	constructor(pProgressTrackerSet, pProgressTrackerHash)
	{
		this.progressTrackerSet = pProgressTrackerSet;
		this.progressTrackerHash = pProgressTrackerHash;
	}

	updateProgressTracker(pProgressAmount)
	{
		return this.progressTrackerSet.updateProgressTracker(this.progressTrackerHash, pProgressAmount);
	}

	incrementProgressTracker(pProgressIncrementAmount)
	{
		return this.progressTrackerSet.incrementProgressTracker(this.progressTrackerHash, pProgressIncrementAmount);
	}

	setProgressTrackerTotalOperations(pTotalOperationCount)
	{
		return this.progressTrackerSet.setProgressTrackerTotalOperations(this.progressTrackerHash, pTotalOperationCount);
	}

	getProgressTrackerStatusString()
	{
		return this.progressTrackerSet.getProgressTrackerStatusString(this.progressTrackerHash);
	}
}

module.exports = ProgressTracker;