# CSVParser Service

The CSVParser service provides line-by-line CSV parsing with support for multi-line quoted fields, escaped quotes, and configurable delimiters. It is designed for streaming line-by-line parsing rather than whole-string parsing.

## Access

```javascript
// On-demand service - instantiate when needed
const csvParser = fable.instantiateServiceProvider('CSVParser', {}, 'CSV Parser-123');
```

## Basic Usage

### Line-by-Line Parsing

The primary method is `parseCSVLine()`, which processes one line at a time and returns a parsed record (or `false` if the line is part of a multi-line quoted field or is the header row):

```javascript
const libFS = require('fs');
const libReadline = require('readline');

const csvParser = fable.instantiateServiceProvider('CSVParser');
const records = [];

const rl = libReadline.createInterface({
    input: libFS.createReadStream('data.csv'),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    let record = csvParser.parseCSVLine(line);
    if (record) {
        records.push(record);
    }
});

rl.on('close', () => {
    console.log(`Parsed ${records.length} records`);
    // records[0] is an object like { name: 'John', age: '30', city: 'New York' }
});
```

### Using FilePersistence Wrapper

The FilePersistence service provides a convenience method for CSV reading:

```javascript
fable.instantiateServiceProvider('FilePersistence');

fable.FilePersistence.readFileCSV('data.csv', {},
    (record) => {
        // Called for each parsed record (as a JSON object)
        console.log(record.name, record.age);
    },
    () => {
        // Called when parsing is complete
        console.log('Done!');
    });
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
const csvParser = fable.instantiateServiceProvider('CSVParser');

csvParser.Delimiter = ';';           // Default: ','
csvParser.QuoteCharacter = "'";      // Default: '"'
csvParser.HasHeader = true;          // Default: true - first line is header
csvParser.HeaderLineIndex = 0;       // Default: 0 - which line is the header
csvParser.EmitJSON = true;           // Default: true - emit objects vs arrays
csvParser.EmitHeader = false;        // Default: false - return header row or skip it
csvParser.EscapedQuoteString = '&quot;';  // Default: '&quot;' - replacement for escaped quotes
```

## Methods

### `parseCSVLine(lineString)`

Parse a single line of CSV. Returns a record object, an array, or `false`.

### `setHeader(headerArray)`

Manually set column headers (an array of strings):

```javascript
csvParser.setHeader(['name', 'age', 'city']);
```

### `marshalRowToJSON(rowArray)`

Convert a row array into a JSON object using the current headers:

```javascript
csvParser.setHeader(['name', 'age']);
csvParser.marshalRowToJSON(['John', '30']);
// Returns { name: 'John', age: '30' }
```

### `resetRowState()`

Reset the current row accumulation state. Useful if you need to discard a partially parsed row.

### `emitRow(formatAsJSON)`

Emit the currently accumulated row. If `formatAsJSON` is true (default), returns a JSON object; otherwise returns the raw array.

## Parser State Properties

```javascript
csvParser.LinesParsed   // Total number of lines processed
csvParser.RowsEmitted   // Total number of data rows emitted
csvParser.InQuote       // Whether currently inside a quoted field
csvParser.Header        // Current header array
csvParser.HeaderFieldNames  // Trimmed header field names used as object keys
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
- The parser is stateful — create a new instance for each file you parse
