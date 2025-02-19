const libFableServiceBase = require('fable-serviceproviderbase');

/**
 * FableServiceDataGeneration class provides various methods for generating random data.
 * 
 * @extends libFableServiceBase
 */
class FableServiceDataGeneration extends libFableServiceBase
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'DataGeneration';

        this.defaultData = require('./Fable-Service-DataGeneration-DefaultValues.json');
    }

    /**
     * Generates a random integer between the specified minimum and maximum values.
     * 
     * @param {number} pMinimum - The minimum value (inclusive).
     * @param {number} pMaximum - The maximum value (exclusive).
     * @returns {number} A random integer between pMinimum and pMaximum.
     */
    randomIntegerBetween(pMinimum, pMaximum)
    {
        try
        {
            let tmpMinimum = parseInt(pMinimum, 10);
            let tmpMaximum = parseInt(pMaximum, 10);
            return Math.floor(Math.random() * (tmpMaximum - tmpMinimum)) + tmpMinimum;
        }
        catch (pError)
        {
            this.fable.log.error('Error in randomIntegerBetween', pError, { 'Minimum': pMinimum, 'Maximum': pMaximum });
            return NaN;
        }
    }

    /**
     * Generates a random integer between 0 (inclusive) and the specified maximum value (exclusive).
     * 
     * @param {number} pMaximum - The maximum value (exclusive).
     * @returns {number} A random integer between 0 and pMaximum.
     */
    randomIntegerUpTo(pMaximum)
    {
        return this.randomIntegerBetween(0, pMaximum);
    }

    /**
     * Generates a random integer between 0 (inclusive) and the default maximum value.
     * 
     * @returns {number} A random integer between 0 and the default maximum value.
     */
    randomInteger()
    {
        return Math.floor(Math.random() * this.defaultData.DefaultIntegerMaximum);
    }

    /**
     * Generates a random float between the specified minimum and maximum values.
     * 
     * @param {number} pMinimum - The minimum value (inclusive).
     * @param {number} pMaximum - The maximum value (exclusive).
     * @returns {number} A random float between pMinimum and pMaximum.
     */
    randomFloatBetween(pMinimum, pMaximum)
    {
        try
        {
            let tmpMinimum = parseFloat(pMinimum);
            let tmpMaximum = parseFloat(pMaximum);
            return this.fable.Math.addPrecise(this.fable.Math.multiplyPrecise(Math.random(), this.fable.Math.subtractPrecise(tmpMaximum, tmpMinimum)), tmpMinimum);
        }
        catch (pError)
        {
            this.fable.log.error('Error in randomFloatBetween', pError, { 'Minimum': pMinimum, 'Maximum': pMaximum });
            return NaN;
        }
    }

    /**
     * Generates a random float between 0 (inclusive) and the specified maximum value (exclusive).
     * 
     * @param {number} pMaximum - The maximum value (exclusive).
     * @returns {number} A random float between 0 and pMaximum.
     */
    randomFloatUpTo(pMaximum)
    {
        return this.randomFloatBetween(0, pMaximum);
    }

    /**
     * Generates a random float between 0 (inclusive) and 1 (exclusive).
     * 
     * @returns {number} A random float between 0 and 1.
     */
    randomFloat()
    {
        return Math.random();
    }

    /**
     * Generates a random numeric string of the specified length.
     * 
     * @param {number} pLength - The length of the numeric string.
     * @param {number} pMaxNumber - The maximum number to generate.
     * @returns {string} A random numeric string of the specified length.
     */
    randomNumericString(pLength, pMaxNumber)
    {
        let tmpLength = (typeof(pLength) === 'undefined') ? 10 : pLength;
        let tmpMaxNumber = (typeof(pMaxNumber) === 'undefined') ? 9999999999 : pMaxNumber;

        return this.services.DataFormat.stringPadStart(this.randomIntegerUpTo(tmpMaxNumber), pLength, '0');
    }

    /**
     * Generates a random month from the default month set.
     * 
     * @returns {string} A random month.
     */
    randomMonth()
    {
        return this.defaultData.MonthSet[this.randomIntegerUpTo(this.defaultData.MonthSet.length - 1)];
    }

    /**
     * Generates a random day of the week from the default week day set.
     * 
     * @returns {string} A random day of the week.
     */
    randomDayOfWeek()
    {
        return this.defaultData.WeekDaySet[this.randomIntegerUpTo(this.defaultData.WeekDaySet.length - 1)];
    }

    /**
     * Generates a random color from the default color set.
     * 
     * @returns {string} A random color.
     */
    randomColor()
    {
        return this.defaultData.ColorSet[this.randomIntegerUpTo(this.defaultData.ColorSet.length - 1)];
    }

    /**
     * Generates a random name from the default name set.
     * 
     * @returns {string} A random name.
     */
    randomName()
    {
        return this.defaultData.NameSet[this.randomIntegerUpTo(this.defaultData.NameSet.length - 1)];
    }

    /**
     * Generates a random surname from the default surname set.
     * 
     * @returns {string} A random surname.
     */
    randomSurname()
    {
        return this.defaultData.SurNameSet[this.randomIntegerUpTo(this.defaultData.SurNameSet.length - 1)];
    }
}

module.exports = FableServiceDataGeneration;