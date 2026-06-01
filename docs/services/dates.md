# Dates Service

The Dates service provides date manipulation functionality using [day.js](https://day.js.org/) with several plugins pre-loaded.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

// Auto-instantiated, available directly
console.log('fable.Dates:', typeof fable.Dates);
```

## Direct day.js Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

// Access the day.js library directly
console.log('Now:',          fable.Dates.dayJS().toISOString());                              // Current date/time
console.log('Parsed:',       fable.Dates.dayJS('2024-01-15').toISOString());                  // Parse a date
console.log('Formatted:',    fable.Dates.dayJS('2024-01-15').format('YYYY-MM-DD'));
```

## Pre-loaded Plugins

The following day.js plugins are automatically loaded:

- **weekOfYear** - Get the week number of the year
- **weekday** - Get/set the day of the week
- **isoWeek** - ISO week operations
- **timezone** - Timezone support
- **relativeTime** - "2 hours ago" style formatting
- **utc** - UTC mode support
- **advancedFormat** - Additional format tokens

## Date Difference Methods

All difference methods accept dates as strings, Date objects, or timestamps.

### Milliseconds

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateMillisecondDifference('2024-01-01', '2024-01-02'));
// Returns: 86400000
```

### Seconds

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateSecondDifference('2024-01-01 00:00:00', '2024-01-01 00:01:30'));
// Returns: 90
```

### Minutes

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateMinuteDifference('2024-01-01 00:00', '2024-01-01 02:30'));
// Returns: 150
```

### Hours

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateHourDifference('2024-01-01', '2024-01-02'));
// Returns: 24
```

### Days

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateDayDifference('2024-01-01', '2024-01-15'));
// Returns: 14
```

### Weeks

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateWeekDifference('2024-01-01', '2024-02-01'));
// Returns: 4
```

### Months

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateMonthDifference('2024-01-01', '2024-06-01'));
// Returns: 5
```

### Years

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateYearDifference('2020-01-01', '2024-01-01'));
// Returns: 4
```

### Require End Date

All difference methods accept an optional third parameter to require the end date:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

// Returns NaN if end date is not provided
console.log(fable.Dates.dateDayDifference('2024-01-01', null, true));  // Returns NaN
```

## Date Addition Methods

### Add Milliseconds

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddMilliseconds('2024-01-01T00:00:00.000Z', 5000));
// Returns: '2024-01-01T00:00:05.000Z'
```

### Add Seconds

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddSeconds('2024-01-01T00:00:00.000Z', 30));
// Returns: '2024-01-01T00:00:30.000Z'
```

### Add Minutes

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddMinutes('2024-01-01T00:00:00.000Z', 45));
// Returns: '2024-01-01T00:45:00.000Z'
```

### Add Hours

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddHours('2024-01-01T00:00:00.000Z', 3));
// Returns: '2024-01-01T03:00:00.000Z'
```

### Add Days

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddDays('2024-01-01', 10));
// Returns: '2024-01-11T00:00:00.000Z'
```

### Add Weeks

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddWeeks('2024-01-01', 2));
// Returns: '2024-01-15T00:00:00.000Z'
```

### Add Months

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddMonths('2024-01-15', 3));
// Returns: '2024-04-15T00:00:00.000Z'
```

### Add Years

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateAddYears('2024-01-01', 5));
// Returns: '2029-01-01T00:00:00.000Z'
```

## Generic Date Math

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

// Add operation
console.log(fable.Dates.dateMath('2024-01-01', 5, 'day', 'add'));
// Returns: '2024-01-06T00:00:00.000Z'

// Subtract operation
console.log(fable.Dates.dateMath('2024-01-15', 10, 'day', 'subtract'));
// Returns: '2024-01-05T00:00:00.000Z'

// Valid units: 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year'
```

## Create Date from Parts

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

console.log(fable.Dates.dateFromParts(2024, 6, 15));                    // June 15, 2024
console.log(fable.Dates.dateFromParts(2024, 6, 15, 14, 30, 0, 0));     // June 15, 2024 2:30 PM
// Returns: ISO string like '2024-06-15T14:30:00.000Z'
```

## Using day.js Directly

For more complex operations, use the day.js library directly:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'DatesDemo', ProductVersion: '1.0.0' });

const dayjs = fable.Dates.dayJS;

// Format dates
console.log('Formatted now:',  dayjs().format('YYYY-MM-DD HH:mm:ss'));

// Relative time
console.log('fromNow:',        dayjs('2024-01-01').fromNow());

// Timezone support
console.log('NY time:',        dayjs().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss z'));

// Week operations
console.log('Week of year:',   dayjs().week());
console.log('ISO week:',       dayjs().isoWeek());

// UTC mode
console.log('UTC date:',       dayjs.utc('2024-01-01').toISOString());
```

## Adding Locales

Day.js supports localization. You can add locales as needed:

```javascript
// Node.js reference - requires loading dayjs locale packages which are not bundled in the browser playground.
console.info("In Node.js:");
console.info("    const localeDE = require('dayjs/locale/de');");
console.info("    fable.Dates.dayJS.locale('de');");
console.info("    fable.Dates.dayJS().format('MMMM');  // -> 'Januar'");
```

