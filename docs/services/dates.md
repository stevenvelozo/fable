# Dates Service

The Dates service provides date manipulation functionality using [day.js](https://day.js.org/) with several plugins pre-loaded.

## Access

```javascript
// Auto-instantiated, available directly
fable.Dates
```

## Direct day.js Access

```javascript
// Access the day.js library directly
fable.Dates.dayJS();                           // Current date/time
fable.Dates.dayJS('2024-01-15');               // Parse a date
fable.Dates.dayJS('2024-01-15').format('YYYY-MM-DD');
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
fable.Dates.dateMillisecondDifference('2024-01-01', '2024-01-02');
// Returns: 86400000
```

### Seconds

```javascript
fable.Dates.dateSecondDifference('2024-01-01 00:00:00', '2024-01-01 00:01:30');
// Returns: 90
```

### Minutes

```javascript
fable.Dates.dateMinuteDifference('2024-01-01 00:00', '2024-01-01 02:30');
// Returns: 150
```

### Hours

```javascript
fable.Dates.dateHourDifference('2024-01-01', '2024-01-02');
// Returns: 24
```

### Days

```javascript
fable.Dates.dateDayDifference('2024-01-01', '2024-01-15');
// Returns: 14
```

### Weeks

```javascript
fable.Dates.dateWeekDifference('2024-01-01', '2024-02-01');
// Returns: 4
```

### Months

```javascript
fable.Dates.dateMonthDifference('2024-01-01', '2024-06-01');
// Returns: 5
```

### Years

```javascript
fable.Dates.dateYearDifference('2020-01-01', '2024-01-01');
// Returns: 4
```

### Require End Date

All difference methods accept an optional third parameter to require the end date:

```javascript
// Returns NaN if end date is not provided
fable.Dates.dateDayDifference('2024-01-01', null, true);  // Returns NaN
```

## Date Addition Methods

### Add Milliseconds

```javascript
fable.Dates.dateAddMilliseconds('2024-01-01T00:00:00.000Z', 5000);
// Returns: '2024-01-01T00:00:05.000Z'
```

### Add Seconds

```javascript
fable.Dates.dateAddSeconds('2024-01-01T00:00:00.000Z', 30);
// Returns: '2024-01-01T00:00:30.000Z'
```

### Add Minutes

```javascript
fable.Dates.dateAddMinutes('2024-01-01T00:00:00.000Z', 45);
// Returns: '2024-01-01T00:45:00.000Z'
```

### Add Hours

```javascript
fable.Dates.dateAddHours('2024-01-01T00:00:00.000Z', 3);
// Returns: '2024-01-01T03:00:00.000Z'
```

### Add Days

```javascript
fable.Dates.dateAddDays('2024-01-01', 10);
// Returns: '2024-01-11T00:00:00.000Z'
```

### Add Weeks

```javascript
fable.Dates.dateAddWeeks('2024-01-01', 2);
// Returns: '2024-01-15T00:00:00.000Z'
```

### Add Months

```javascript
fable.Dates.dateAddMonths('2024-01-15', 3);
// Returns: '2024-04-15T00:00:00.000Z'
```

### Add Years

```javascript
fable.Dates.dateAddYears('2024-01-01', 5);
// Returns: '2029-01-01T00:00:00.000Z'
```

## Generic Date Math

```javascript
// Add operation
fable.Dates.dateMath('2024-01-01', 5, 'day', 'add');
// Returns: '2024-01-06T00:00:00.000Z'

// Subtract operation
fable.Dates.dateMath('2024-01-15', 10, 'day', 'subtract');
// Returns: '2024-01-05T00:00:00.000Z'

// Valid units: 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year'
```

## Create Date from Parts

```javascript
fable.Dates.dateFromParts(2024, 6, 15);                    // June 15, 2024
fable.Dates.dateFromParts(2024, 6, 15, 14, 30, 0, 0);     // June 15, 2024 2:30 PM
// Returns: ISO string like '2024-06-15T14:30:00.000Z'
```

## Using day.js Directly

For more complex operations, use the day.js library directly:

```javascript
const dayjs = fable.Dates.dayJS;

// Format dates
dayjs().format('YYYY-MM-DD HH:mm:ss');

// Relative time
dayjs('2024-01-01').fromNow();  // "3 months ago"

// Timezone support
dayjs().tz('America/New_York');

// Week operations
dayjs().week();      // Week of year
dayjs().isoWeek();   // ISO week

// UTC mode
dayjs.utc('2024-01-01');
```

## Adding Locales

Day.js supports localization. You can add locales as needed:

```javascript
const localeDE = require('dayjs/locale/de');
fable.Dates.dayJS.locale('de');

// Now dates format in German
fable.Dates.dayJS().format('MMMM');  // "Januar"
```
