const libFableServiceBase = require('fable-serviceproviderbase');

class FableServiceProgressTime extends libFableServiceBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'ProgressTime';

		this.timeStamps = {};
	}

	formatTimeDuration(pTimeDurationInMilliseconds)
	{
		let tmpTimeDuration = typeof(pTimeDurationInMilliseconds) == 'number' ? pTimeDurationInMilliseconds : 0;

		if (pTimeDurationInMilliseconds < 0)
		{
			return 'unknown';
		}

		let tmpTimeDurationString = '';
		if (tmpTimeDuration > 3600000)
		{
			tmpTimeDurationString += Math.floor(tmpTimeDuration/3600000)+'h ';
			tmpTimeDuration = tmpTimeDuration % 3600000;
		}
		if (tmpTimeDuration > 60000)
		{
			tmpTimeDurationString += Math.floor(tmpTimeDuration/60000)+'m ';
			tmpTimeDuration = tmpTimeDuration % 60000;
		}
		if (tmpTimeDuration > 1000)
		{
			tmpTimeDurationString += Math.floor(tmpTimeDuration/1000)+'s ';
			tmpTimeDuration = tmpTimeDuration % 1000;
		}
		tmpTimeDurationString += Math.round(tmpTimeDuration)+'ms';

		return tmpTimeDurationString;
	}

	createTimeStamp(pTimeStampHash)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		this.timeStamps[tmpTimeStampHash] = +new Date();
		return this.timeStamps[tmpTimeStampHash];
	}

	getTimeStampValue(pTimeStampHash)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		return (tmpTimeStampHash in this.timeStamps) ? this.timeStamps[tmpTimeStampHash] : -1;
	}

	updateTimeStampValue(pTimeStampHash, pReferenceTime)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		let tmpReferenceTime = false;
		
		// This function allows the user to pass in either a reference time in ms, or, a hash of a timestamp.
		if (typeof(pReferenceTime) == 'string')
		{
			tmpReferenceTime = (tmpReference in this.timeStamps) ? this.timeStamps[tmpReference] : false;
		}
		else if (typeof(pReferenceTime) == 'number')
		{
			tmpReferenceTime = pReferenceTime;
		}
		else
		{
			tmpReferenceTime = +new Date();
		}

		if ((tmpTimeStampHash in this.timeStamps) && tmpReferenceTime)
		{
			this.timeStamps[tmpTimeStampHash] = tmpReferenceTime;
			return this.timeStamps[tmpTimeStampHash];
		}
		else
		{
			return -1;
		}
	}

	removeTimeStamp(pTimeStampHash)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		if (tmpTimeStampHash in this.timeStamps)
		{
			delete this.timeStamps[tmpTimeStampHash];
			return true;
		}
		else
		{
			return false;
		}
	}

	getTimeStampDelta(pTimeStampHash, pReferenceTime)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		let tmpReferenceTime = false;
		
		// This function allows the user to pass in either a reference time in ms, or, a hash of a timestamp.
		if (typeof(pReferenceTime) == 'string')
		{
			tmpReferenceTime = (tmpReference in this.timeStamps) ? this.timeStamps[tmpReference] : false;
		}
		else if (typeof(pReferenceTime) == 'number')
		{
			tmpReferenceTime = pReferenceTime;
		}
		else
		{
			tmpReferenceTime = +new Date();
		}

		if ((tmpTimeStampHash in this.timeStamps) && tmpReferenceTime)
		{
			return tmpReferenceTime-this.timeStamps[tmpTimeStampHash];
		}
		else
		{
			return -1;
		}
	}

	getDurationBetweenTimestamps(pTimeStampHashStart, pTimeStampHashEnd)
	{
		let tmpTimeStampHashStart = (typeof(pTimeStampHashStart) == 'string') ? pTimeStampHashStart : 'Default';
		let tmpTimeStampHashEnd = (typeof(pTimeStampHashEnd) == 'string') ? pTimeStampHashEnd : 'Default';
		if ((tmpTimeStampHashStart in this.timeStamps) && (tmpTimeStampHashEnd in this.timeStamps))
		{
			return this.timeStamps[tmpTimeStampHashEnd]-this.timeStamps[tmpTimeStampHashStart];
		}
		else
		{
			return -1;
		}
	}

	getTimeStampDeltaMessage(pTimeStampHash, pMessage, pReferenceTime)
	{
		let tmpTimeStampHash = (typeof(pTimeStampHash) == 'string') ? pTimeStampHash : 'Default';
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : `Elapsed for ${tmpTimeStampHash}: `;
		let tmpOperationTime = this.getTimeStampDelta(tmpTimeStampHash, pReferenceTime);

		return `${tmpMessage} ${this.formatTimeDuration(tmpOperationTime)}`;
	}

	logTimeStampDelta(pTimeStampHash, pMessage, pReferenceTime)
	{
		this.fable.log.info(this.getTimeStampDeltaMessage(pTimeStampHash, pMessage, pReferenceTime));
	}
}

module.exports = FableServiceProgressTime;