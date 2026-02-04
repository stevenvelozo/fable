# DataFormat Service

The DataFormat service provides string manipulation, number formatting, and data transformation utilities.

## Access

```javascript
// Auto-instantiated, available directly
fable.DataFormat
```

## String Manipulation

### Reverse String

```javascript
fable.DataFormat.stringReverse('Hello');  // Returns 'olleH'
```

### String Starts/Ends With

```javascript
fable.DataFormat.stringStartsWith('Hello World', 'Hello');  // true
fable.DataFormat.stringEndsWith('Hello World', 'World');    // true

// With index
fable.DataFormat.stringStartsWith('Hello World', 'World', 6);  // true
```

### Capitalize Each Word

```javascript
fable.DataFormat.capitalizeEachWord('hello world');  // Returns 'Hello World'
```

### Clean Non-Alpha Characters

```javascript
fable.DataFormat.cleanNonAlphaCharacters('Hello123World!');  // Returns 'HelloWorld'
```

### Sanitize Object Key

```javascript
fable.DataFormat.sanitizeObjectKey('my-key name!');  // Returns 'my_key_name_'
```

### Clean Enclosure Wrap Characters

```javascript
fable.DataFormat.cleanEnclosureWrapCharacters('"', '"hello"');  // Returns 'hello'
fable.DataFormat.cleanEnclosureWrapCharacters("'", "'world'");  // Returns 'world'
```

## String Concatenation

### Concatenate Strings

```javascript
fable.DataFormat.concatenateStrings('Hello', ' ', 'World');  // Returns 'Hello World'
```

### Join Strings

```javascript
fable.DataFormat.joinStrings(', ', 'Apple', 'Banana', 'Cherry');
// Returns 'Apple, Banana, Cherry'
```

### Raw Concatenation (includes non-strings)

```javascript
fable.DataFormat.concatenateStringsRaw('Value: ', 42);  // Returns 'Value: 42'
fable.DataFormat.joinStringsRaw('-', 1, 2, 3);          // Returns '1-2-3'
```

## String Hashing

Generate a simple (non-cryptographic) hash from a string:

```javascript
fable.DataFormat.insecureStringHash('hello');  // Returns 'HSH99162322'
```

## Number Formatting

### Add Commas to Numbers

```javascript
fable.DataFormat.formatterAddCommasToNumber(1234567.89);
// Returns '1,234,567.89'
```

### Format as Dollars

```javascript
fable.DataFormat.formatterDollars(1234.5);      // Returns '$1,234.50'
fable.DataFormat.formatterDollars(1234.567, 3); // Returns '$1,234.567' (3 decimals)
fable.DataFormat.formatterDollars('invalid');   // Returns '--'
```

### Round Number

```javascript
fable.DataFormat.formatterRoundNumber(3.14159, 2);  // Returns '3.14'
fable.DataFormat.formatterRoundNumber(3.14159);     // Returns '3.14' (default 2 digits)
```

## String Padding

### Pad Start

```javascript
fable.DataFormat.stringPadStart('5', 3, '0');     // Returns '005'
fable.DataFormat.stringPadStart('42', 5, ' ');    // Returns '   42'
```

### Pad End

```javascript
fable.DataFormat.stringPadEnd('5', 3, '0');       // Returns '500'
fable.DataFormat.stringPadEnd('Hi', 5, '.');      // Returns 'Hi...'
```

## Time Formatting

### Format Time Span

Format milliseconds as HH:MM:SS.mmm:

```javascript
fable.DataFormat.formatTimeSpan(3661234);  // Returns '01:01:01.234'
```

### Format Time Delta

Format the difference between two timestamps:

```javascript
fable.DataFormat.formatTimeDelta(startTime, endTime);  // Returns 'HH:MM:SS.mmm'
```

## Date Formatting

### Get Month Name

```javascript
fable.DataFormat.getMonthFromDate(new Date('2024-06-15'));
// Returns 'June'

fable.DataFormat.getMonthAbbreviatedFromDate(new Date('2024-06-15'));
// Returns 'Jun'
```

### Format Month/Day/Year

```javascript
fable.DataFormat.formatMonthDayYearFromDate(new Date('2024-06-15'));
// Returns '6/15/2024'

// Strict mode (zero-padded)
fable.DataFormat.formatMonthDayYearFromDate(new Date('2024-06-05'), true);
// Returns '06/05/2024'
```

### Sortable Date String

```javascript
fable.DataFormat.formatSortableStringFromDate(new Date('2024-06-15'));
// Returns '20240515'
```

## HTML Entity Resolution

```javascript
fable.DataFormat.resolveHtmlEntities('&amp; &lt; &gt;');
// Returns '& < >'

fable.DataFormat.resolveHtmlEntities('&#65;');  // Returns 'A'
```

## String Tokenization

### Before/After Match

```javascript
fable.DataFormat.stringBeforeMatch('hello-world', '-');  // Returns 'hello'
fable.DataFormat.stringAfterMatch('hello-world', '-');   // Returns 'world'
```

### Count Segments

Count segments respecting enclosures:

```javascript
fable.DataFormat.stringCountSegments('a.b.c', '.');              // Returns 3
fable.DataFormat.stringCountSegments('a.{b.c}.d', '.');          // Returns 3 (respects {})
```

### Get Segments

```javascript
fable.DataFormat.stringGetSegments('a.b.c', '.');
// Returns ['a', 'b', 'c']

fable.DataFormat.stringGetFirstSegment('a.b.c', '.');
// Returns 'a'
```

## Enclosure Operations

### Count Enclosures

```javascript
fable.DataFormat.stringCountEnclosures('(a) and (b)');  // Returns 2
fable.DataFormat.stringCountEnclosures('((nested))');   // Returns 1 (outer only)
```

### Get Enclosure Value

```javascript
fable.DataFormat.stringGetEnclosureValueByIndex('(first) and (second)', 0);
// Returns 'first'

fable.DataFormat.stringGetEnclosureValueByIndex('(first) and (second)', 1);
// Returns 'second'
```

### Remove Enclosure

```javascript
fable.DataFormat.stringRemoveEnclosureByIndex('(remove) keep (this)', 0);
// Returns ' keep (this)'
```

## URL Encoding

### Encode URI Component

```javascript
fable.DataFormat.stringEncodeURIComponent('hello world');
// Returns 'hello%20world'
```

### Decode URI Component

```javascript
fable.DataFormat.stringDecodeURIComponent('hello%20world');
// Returns 'hello world'
```

## JavaScript String Encoding

Encode/decode strings for safe embedding in JavaScript:

```javascript
fable.DataFormat.stringEncodeForJavascript('Hello "World"');
// Returns 'Hello \\"World\\"'

fable.DataFormat.stringDecodeForJavascript('Hello \\"World\\"');
// Returns 'Hello "World"'
```

## Configuration

The service uses configurable values:

```javascript
// Currency symbol (default: '$')
fable.DataFormat._Value_MoneySign_Currency = '€';

// NaN display for currency (default: '--')
fable.DataFormat._Value_NaN_Currency = 'N/A';

// Group separator for numbers (default: ',')
fable.DataFormat._Value_GroupSeparator_Number = '.';
```
