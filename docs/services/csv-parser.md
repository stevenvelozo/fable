# CSVParser Service

The CSVParser service provides line-by-line CSV parsing with support for multi-line quoted fields, escaped quotes, and configurable delimiters. It is designed for streaming line-by-line parsing rather than whole-string parsing.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'CSVDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const csvParser = fable.instantiateServiceProvider('CSVParser', {}, 'CSV Parser-123');
console.log('csvParser:', typeof csvParser);
```

## Basic Usage

### Line-by-Line Parsing

The primary method is `parseCSVLine()`, which processes one line at a time and returns a parsed record (or `false` if the line is part of a multi-line quoted field or is the header row):

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'CSVDemo', ProductVersion: '1.0.0' });
const csvParser = fable.instantiateServiceProvider('CSVParser');

// In Node.js the typical streaming pattern is:
//   const libFS = require('fs');
//   const libReadline = require('readline');
//   const rl = libReadline.createInterface({ input: libFS.createReadStream('data.csv'), crlfDelay: Infinity });
//   rl.on('line', line => { const rec = csvParser.parseCSVLine(line); if (rec) records.push(rec); });
//   rl.on('close', () => console.log(`Parsed ${records.length} records`));
//
// The browser playground has no fs/readline, so the snippet below parses an
// in-memory CSV string line-by-line using the exact same parseCSVLine() loop:

const csvSource = "name,age,city\nJohn,30,New York\nJane,25,Boston";
const records   = [];
for (const line of csvSource.split('\n'))
{
    const record = csvParser.parseCSVLine(line);
    if (record)
    {
        records.push(record);
    }
}
console.log(`Parsed ${records.length} records`);
console.log('records[0]:', records[0]);
```

### Using FilePersistence Wrapper

The FilePersistence service provides a convenience method for CSV reading:

```javascript
// Node.js reference - fable.FilePersistence.readFileCSV uses fs, which the
// browser playground doesn't expose. The shape of the call:
console.info("In Node.js:");
console.info("    fable.instantiateServiceProvider('FilePersistence');");
console.info("    fable.FilePersistence.readFileCSV('data.csv', {},");
console.info("        (record) => console.log(record.name, record.age),");
console.info("        () => console.log('Done!'));");
```

## How Parsing Works

The CSVParser is stateful and processes lines sequentially:

1. The first line is treated as a header row by default (sets column names)
2. Each subsequent line is parsed and emitted as a JSON object keyed by header names
3. Multi-line quoted fields are accumulated across calls to `parseCSVLine()` until the closing quote is found

### Return Values from `parseCSVLine()`

- Returns a **JSON object** (keyed by header names) for a successfully parsed data row
- Returns **`false`** for header rows (when `EmitHeader` is `false`, the default)
- Returns **`false`** when in the middle of a multi-line quoted field

## Configuration Properties

Set these properties on the parser instance after creation:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'CSVDemo', ProductVersion: '1.0.0' });

const csvParser = fable.instantiateServiceProvider('CSVParser');

csvParser.Delimiter = ';';           // Default: ','
csvParser.QuoteCharacter = "'";      // Default: '"'
csvParser.HasHeader = true;          // Default: true - first line is header
csvParser.HeaderLineIndex = 0;       // Default: 0 - which line is the header
csvParser.EmitJSON = true;           // Default: true - emit objects vs arrays
csvParser.EmitHeader = false;        // Default: false - return header row or skip it
csvParser.EscapedQuoteString = '&quot;';  // Default: '&quot;' - replacement for escaped quotes

console.log('Delimiter:',       csvParser.Delimiter);
console.log('QuoteCharacter:',  csvParser.QuoteCharacter);
console.log('HasHeader:',       csvParser.HasHeader);
console.log('EmitJSON:',        csvParser.EmitJSON);
```

## Methods

### `parseCSVLine(lineString)`

Parse a single line of CSV. Returns a record object, an array, or `false`.

### `setHeader(headerArray)`

Manually set column headers (an array of strings):

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'CSVDemo', ProductVersion: '1.0.0' });
const csvParser = fable.instantiateServiceProvider('CSVParser');

csvParser.setHeader(['name', 'age', 'city']);
console.log('Header set; field names:', csvParser.HeaderFieldNames);
```

### `marshalRowToJSON(rowArray)`

Convert a row array into a JSON object using the current headers:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'CSVDemo', ProductVersion: '1.0.0' });
const csvParser = fable.instantiateServiceProvider('CSVParser');

csvParser.setHeader(['name', 'age']);
console.log(csvParser.marshalRowToJSON(['John', '30']));
// Returns { name: 'John', age: '30' }
```

### `resetRowState()`

Reset the current row accumulation state. Useful if you need to discard a partially parsed row.

### `emitRow(formatAsJSON)`

Emit the currently accumulated row. If `formatAsJSON` is true (default), returns a JSON object; otherwise returns the raw array.

## Parser State Properties

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'CSVDemo', ProductVersion: '1.0.0' });
const csvParser = fable.instantiateServiceProvider('CSVParser');

// Parse a small CSV inline so the state properties have something to show:
for (const line of "name,age\nJohn,30".split('\n')) csvParser.parseCSVLine(line);

console.log('LinesParsed:',       csvParser.LinesParsed);
console.log('RowsEmitted:',       csvParser.RowsEmitted);
console.log('InQuote:',           csvParser.InQuote);
console.log('Header:',            csvParser.Header);
console.log('HeaderFieldNames:',  csvParser.HeaderFieldNames);
```

## Handling Special Cases

### Multi-line Quoted Fields

The parser handles fields that span multiple lines when enclosed in quotes. It tracks quote state across calls to `parseCSVLine()` and accumulates the field until the closing quote is found.

### Escaped Quotes

Double quotes within a quoted field (e.g., `""`) are replaced with the `EscapedQuoteString` value (default `&quot;`).

### Extra Columns

If a row has more columns than the header, extra columns are keyed by their numeric index (e.g., `'3'`, `'4'`).

## Notes

- All values are returned as strings
- The parser is designed for streaming/line-by-line use, not whole-file-at-once parsing
- Carriage returns (`\r`) are automatically stripped from fields
- The parser is stateful -- create a new instance for each file you parse
