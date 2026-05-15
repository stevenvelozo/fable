# DataFormat Service

The DataFormat service provides string manipulation, number formatting, and data transformation utilities.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

// Auto-instantiated, available directly
console.log('fable.DataFormat:', typeof fable.DataFormat);
```

## String Manipulation

### Reverse String

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringReverse('Hello'));  // Returns 'olleH'
```

### String Starts/Ends With

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringStartsWith('Hello World', 'Hello'));  // true
console.log(fable.DataFormat.stringEndsWith('Hello World', 'World'));    // true

// With index
console.log(fable.DataFormat.stringStartsWith('Hello World', 'World', 6));  // true
```

### Capitalize Each Word

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.capitalizeEachWord('hello world'));  // Returns 'Hello World'
```

### Clean Non-Alpha Characters

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.cleanNonAlphaCharacters('Hello123World!'));  // Returns 'HelloWorld'
```

### Sanitize Object Key

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.sanitizeObjectKey('my-key name!'));  // Returns 'my_key_name_'
```

### Clean Enclosure Wrap Characters

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.cleanEnclosureWrapCharacters('"', '"hello"'));  // Returns 'hello'
console.log(fable.DataFormat.cleanEnclosureWrapCharacters("'", "'world'"));  // Returns 'world'
```

## String Concatenation

### Concatenate Strings

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.concatenateStrings('Hello', ' ', 'World'));  // Returns 'Hello World'
```

### Join Strings

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.joinStrings(', ', 'Apple', 'Banana', 'Cherry'));
// Returns 'Apple, Banana, Cherry'
```

### Raw Concatenation (includes non-strings)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.concatenateStringsRaw('Value: ', 42));  // Returns 'Value: 42'
console.log(fable.DataFormat.joinStringsRaw('-', 1, 2, 3));          // Returns '1-2-3'
```

## String Hashing

Generate a simple (non-cryptographic) hash from a string:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.insecureStringHash('hello'));  // Returns 'HSH99162322'
```

## Number Formatting

### Add Commas to Numbers

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.formatterAddCommasToNumber(1234567.89));
// Returns '1,234,567.89'
```

### Format as Dollars

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.formatterDollars(1234.5));      // Returns '$1,234.50'
console.log(fable.DataFormat.formatterDollars(1234.567, 3)); // Returns '$1,234.567' (3 decimals)
console.log(fable.DataFormat.formatterDollars('invalid'));   // Returns '--'
```

### Round Number

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.formatterRoundNumber(3.14159, 2));  // Returns '3.14'
console.log(fable.DataFormat.formatterRoundNumber(3.14159));     // Returns '3.14' (default 2 digits)
```

## String Padding

### Pad Start

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringPadStart('5', 3, '0'));     // Returns '005'
console.log(fable.DataFormat.stringPadStart('42', 5, ' '));    // Returns '   42'
```

### Pad End

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringPadEnd('5', 3, '0'));       // Returns '500'
console.log(fable.DataFormat.stringPadEnd('Hi', 5, '.'));      // Returns 'Hi...'
```

## Time Formatting

### Format Time Span

Format milliseconds as HH:MM:SS.mmm:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.formatTimeSpan(3661234));  // Returns '01:01:01.234'
```

### Format Time Delta

Format the difference between two timestamps:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

const startTime = Date.now() - 3600000;
const endTime   = Date.now();
console.log(fable.DataFormat.formatTimeDelta(startTime, endTime));  // Returns 'HH:MM:SS.mmm'
```

## Date Formatting

### Get Month Name

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.getMonthFromDate(new Date('2024-06-15')));
// Returns 'June'

console.log(fable.DataFormat.getMonthAbbreviatedFromDate(new Date('2024-06-15')));
// Returns 'Jun'
```

### Format Month/Day/Year

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.formatMonthDayYearFromDate(new Date('2024-06-15')));
// Returns '6/15/2024'

// Strict mode (zero-padded)
console.log(fable.DataFormat.formatMonthDayYearFromDate(new Date('2024-06-05'), true));
// Returns '06/05/2024'
```

### Sortable Date String

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.formatSortableStringFromDate(new Date('2024-06-15')));
// Returns '20240515'
```

## HTML Entity Resolution

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.resolveHtmlEntities('&amp; &lt; &gt;'));
// Returns '& < >'

console.log(fable.DataFormat.resolveHtmlEntities('&#65;'));  // Returns 'A'
```

## String Tokenization

### Before/After Match

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringBeforeMatch('hello-world', '-'));  // Returns 'hello'
console.log(fable.DataFormat.stringAfterMatch('hello-world', '-'));   // Returns 'world'
```

### Count Segments

Count segments respecting enclosures:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringCountSegments('a.b.c', '.'));              // Returns 3
console.log(fable.DataFormat.stringCountSegments('a.{b.c}.d', '.'));          // Returns 3 (respects {})
```

### Get Segments

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringGetSegments('a.b.c', '.'));
// Returns ['a', 'b', 'c']

console.log(fable.DataFormat.stringGetFirstSegment('a.b.c', '.'));
// Returns 'a'
```

## Enclosure Operations

### Count Enclosures

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringCountEnclosures('(a) and (b)'));  // Returns 2
console.log(fable.DataFormat.stringCountEnclosures('((nested))'));   // Returns 1 (outer only)
```

### Get Enclosure Value

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringGetEnclosureValueByIndex('(first) and (second)', 0));
// Returns 'first'

console.log(fable.DataFormat.stringGetEnclosureValueByIndex('(first) and (second)', 1));
// Returns 'second'
```

### Remove Enclosure

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringRemoveEnclosureByIndex('(remove) keep (this)', 0));
// Returns ' keep (this)'
```

## URL Encoding

### Encode URI Component

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringEncodeURIComponent('hello world'));
// Returns 'hello%20world'
```

### Decode URI Component

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringDecodeURIComponent('hello%20world'));
// Returns 'hello world'
```

## JavaScript String Encoding

Encode/decode strings for safe embedding in JavaScript:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

console.log(fable.DataFormat.stringEncodeForJavascript('Hello "World"'));
// Returns 'Hello \\"World\\"'

console.log(fable.DataFormat.stringDecodeForJavascript('Hello \\"World\\"'));
// Returns 'Hello "World"'
```

## Configuration

The service uses configurable values:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DataFormatDemo', ProductVersion: '1.0.0' });

// Currency symbol (default: '$')
fable.DataFormat._Value_MoneySign_Currency = '€';

// NaN display for currency (default: '--')
fable.DataFormat._Value_NaN_Currency = 'N/A';

// Group separator for numbers (default: ',')
fable.DataFormat._Value_GroupSeparator_Number = '.';

console.log('Configured DataFormat:', {
    money:    fable.DataFormat._Value_MoneySign_Currency,
    nanCur:   fable.DataFormat._Value_NaN_Currency,
    grpSep:   fable.DataFormat._Value_GroupSeparator_Number
});
console.log(fable.DataFormat.formatterDollars(1234.5));
```
