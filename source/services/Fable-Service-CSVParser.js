const libFableServiceProviderBase = require('fable-serviceproviderbase');
/**
* Parsing CSVs.  Why?  Because it's a thing that needs to be done.
*
* 1. And the other node CSV parsers had issues with the really messy files we had.
* 
*
* 2. None of the CSV parsers dealt with and multi-line quoted string columns
*    which are apparently a-ok according to the official spec.
* Plus a lot of them are asynchronous because apparently that's the best way to
* do anything; unfortunately some files have a sequence issue with that.
*
* @class CSVParser
*/
class CSVParser extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'CSVParser';

        this.Header = [];
        this.HeaderFieldNames = [];

        this.Delimiter = ',';
        this.QuoteCharacter = '"';

        this.CleanCharacters = ['\r'];

        this.HeaderLineIndex = 0;
        this.HasHeader = true;
        this.HasSetHeader = false;
        this.EmitHeader = false;

        this.EmitJSON = true;

        this.EscapedQuoteString = '&quot;';

        // Current Line Parsing State
        this.CurrentLine = '';
        this.CurrentRecord = [];

        this.InQuote = false;
        this.InEscapedQuote = false;

        this.LinesParsed = 0;
        this.RowsEmitted = 0;
    }

    marshalRowToJSON(pRowArray)
    {
        if (!Array.isArray(pRowArray))
        {
            return false;
        }

        for (let i = this.HeaderFieldNames.length; i < pRowArray.length; i++)
        {
            this.HeaderFieldNames[i] = `${i}`;
        }

        let tmpObject = {};

        for (let i = 0; i < pRowArray.length; i++)
        {
            tmpObject[this.HeaderFieldNames[i]] = pRowArray[i];
        }

        return tmpObject;
    }

    // Set the header data, for use in marshalling to JSON.
    setHeader (pHeaderArray)
    {
        this.Header = pHeaderArray;

        for (let i = 0; i < this.Header.length; i++)
        {
            if (typeof(this.Header[i]) == 'undefined')
            {
                this.HeaderFieldNames[i] = `${i}`;
            }
            else
            {
                this.HeaderFieldNames[i] = this.Header[i].toString().trim();
            }
        }
    }

    resetRowState()
    {
        this.CurrentRecord = [];
    }

    pushLine()
    {
        for (let i = 0; i < this.CleanCharacters.length; i++)
        {
            this.CurrentLine = this.CurrentLine.replace(this.CleanCharacters[i],'');
        }
        this.CurrentRecord.push(this.CurrentLine);
        this.CurrentLine = '';
    }

    emitRow(pFormatAsJSON)
    {
        let tmpFormatAsJSON = (typeof(pFormatAsJSON) == 'undefined') ? this.EmitJSON : pFormatAsJSON;

        this.RowsEmitted++;
        let tmpCompletedRecord = this.CurrentRecord;
        this.CurrentRecord = [];

        if (tmpFormatAsJSON)
        {
            return this.marshalRowToJSON(tmpCompletedRecord);
        }
        else
        {
            return tmpCompletedRecord;
        }
    }

    parseCSVLine (pLineString)
    {
        this.LinesParsed++;

        for (let i = 0; i < pLineString.length; i++)
        {
            if ((!this.InQuote) && (pLineString[i] == this.Delimiter))
            {
                this.pushLine();
            }
            else if (pLineString[i] == this.QuoteCharacter)
            {
                // If we are in the second part of an escaped quote, ignore it.
                if (this.InEscapedQuote)
                {
                    this.InEscapedQuote = false;
                }
                // If we aren't in a quote, enter quote
                else if (!this.InQuote)
                {
                    this.InQuote = true;
                }
                // We are in a quote, so peek forward to see if this is an "escaped" quote pair
                else if ((i < pLineString.length) && (pLineString[i+1] == this.QuoteCharacter))
                {
                    this.CurrentLine += this.EscapedQuoteString;
                    this.InEscapedQuote = true;
                }
                // We are in a quote, this isn't an "escaped" quote pair, so go out of quote mode
                else
                {
                    this.InQuote = false;
                }
            }
            else
            {
                this.CurrentLine += pLineString[i];
            }
        }

        // See if we are in a multiline quoted entry -- if not, emit the row.
        if (!this.InQuote)
        {
            // Push the last remaining column from the buffer to the current line.
            this.pushLine();

            // Check to see if there is a header -- and if so, if this is the header row
            if (this.HasHeader && !this.HasSetHeader && (this.RowsEmitted == this.HeaderLineIndex))
            {
                this.HasSetHeader = true;
                // Override the format as json bit
                this.setHeader(this.emitRow(false));

                // No matter what, formatting this as JSON is silly and we don't want to go there anyway.
                if (this.EmitHeader)
                {
                    return this.Header;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return this.emitRow();
            }
        }
        else
        {
            return false;
        }
    };
}

module.exports = CSVParser;