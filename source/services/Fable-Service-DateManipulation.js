const libFableServiceProviderBase = require('fable-serviceproviderbase');
/**
* Date management a la Moment using days.js
*
* @class DateManipulation
*/
class DateManipulation extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash)

		this.serviceType = 'Dates';

		this.dayJS = require('dayjs');

		// Include the `weekOfYear` plugin
		this.plugin_weekOfYear = require('dayjs/plugin/weekOfYear');
		this.dayJS.extend(this.plugin_weekOfYear);
		// Include the `weekday` plugin
		this.plugin_weekday = require('dayjs/plugin/weekday');
		this.dayJS.extend(this.plugin_weekday);
		// Include the `isoWeek` plugin
		this.plugin_isoWeek = require('dayjs/plugin/isoWeek');
		this.dayJS.extend(this.plugin_isoWeek);
		// Include the `timezone` plugin
		this.plugin_timezone = require('dayjs/plugin/timezone');
		this.dayJS.extend(this.plugin_timezone);
		// Include the `relativetime` plugin
		this.plugin_relativetime = require('dayjs/plugin/relativeTime');
		this.dayJS.extend(this.plugin_relativetime);
		// Include the `utc` plugin
		this.plugin_utc = require('dayjs/plugin/utc');
		this.dayJS.extend(this.plugin_utc);
		// Include the `advancedFormat` plugin
		this.plugin_advancedFormat = require('dayjs/plugin/advancedFormat');
		this.dayJS.extend(this.plugin_advancedFormat);

		// A developer can include locales if they want
		// You would do the following:
		// const localeDE = require('dayjs/locale/de');
		// _Fable.Dates.dayJS.locale('de');
	}

	/**
	 * Calculates the difference in days between two dates.
	 *
	 * @param {string|Date|number} pDateStart - The start date. Can be a string, Date object, or timestamp.
	 * @param {string|Date|number} pDateEnd - The end date. Can be a string, Date object, or timestamp. Defaults to the current date if not provided.
	 * @returns {number} The difference in days between the start and end dates. Returns NaN if the start date is invalid.
	 */
	dateDayDifference(pDateStart, pDateEnd)
	{
		// If there is not a valid start date, return NaN
		if ((pDateStart === undefined) || (pDateStart === null) || (pDateStart === ''))
		{
			return NaN;
		}
		let tmpStartDate = this.dayJS(pDateStart);
		// Without a valid end date, dayJS defaults to the current date
		let tmpEndDate = this.dayJS(pDateEnd);
		// Returns the difference in days between two dates
		return tmpEndDate.diff(tmpStartDate, 'day');
	}

	/**
	 * Calculates the difference in weeks between two dates.
	 *
	 * @param {string|Date|number} pDateStart - The start date. Can be a string, Date object, or timestamp.
	 * @param {string|Date|number} pDateEnd - The end date. Can be a string, Date object, or timestamp. Defaults to the current date if not provided.
	 * @returns {number} The difference in weeks between the two dates. Returns NaN if the start date is invalid.
	 */
	dateWeekDifference(pDateStart, pDateEnd)
	{
		// If there is not a valid start date, return NaN
		if ((pDateStart === undefined) || (pDateStart === null) || (pDateStart === ''))
		{
			return NaN;
		}
		let tmpStartDate = this.dayJS(pDateStart);
		// Without a valid end date, dayJS defaults to the current date
		let tmpEndDate = this.dayJS(pDateEnd);
		// Returns the difference in weeks between two dates
		return tmpEndDate.diff(tmpStartDate, 'week');
	}

	/**
	 * Calculates the difference in months between two dates.
	 *
	 * @param {string|Date|number} pDateStart - The start date. Can be a string, Date object, or timestamp.
	 * @param {string|Date|number} pDateEnd - The end date. Can be a string, Date object, or timestamp. Defaults to the current date if not provided.
	 * @returns {number} The difference in months between the two dates. Returns NaN if the start date is invalid.
	 */
	dateMonthDifference(pDateStart, pDateEnd)
	{
		// If there is not a valid start date, return NaN
		if ((pDateStart === undefined) || (pDateStart === null) || (pDateStart === ''))
		{
			return NaN;
		}
		let tmpStartDate = this.dayJS(pDateStart);
		// Without a valid end date, dayJS defaults to the current date
		let tmpEndDate = this.dayJS(pDateEnd);
		// Returns the difference in months between two dates
		return tmpEndDate.diff(tmpStartDate, 'month');
	}

	/**
	 * Calculates the difference in years between two dates.
	 *
	 * @param {string|Date|number} pDateStart - The start date. Can be a string, Date object, or timestamp.
	 * @param {string|Date|number} pDateEnd - The end date. Can be a string, Date object, or timestamp. Defaults to the current date if not provided.
	 * @returns {number} The difference in years between the two dates. Returns NaN if the start date is invalid.
	 */
	dateYearDifference(pDateStart, pDateEnd)
	{
		// If there is not a valid start date, return NaN
		if ((pDateStart === undefined) || (pDateStart === null) || (pDateStart === ''))
		{
			return NaN;
		}
		let tmpStartDate = this.dayJS(pDateStart);
		// Without a valid end date, dayJS defaults to the current date
		let tmpEndDate = this.dayJS(pDateEnd);
		// Returns the difference in years between two dates
		return tmpEndDate.diff(tmpStartDate, 'year');
	}
}

module.exports = DateManipulation;