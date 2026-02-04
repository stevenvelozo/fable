# CSVParser Service

The CSVParser service provides robust CSV parsing with support for multi-line quoted fields, escaped quotes, and configurable delimiters.

## Access

```javascript
// On-demand service - instantiate when needed
const csvParser = fable.instantiateServiceProvider('CSVParser');
```

## Basic Usage

### Parse CSV String

```javascript
const csvParser = fable.instantiateServiceProvider('CSVParser');

const csvData = `name,age,city
John,30,New York
Jane,25,Los Angeles`;

const rows = csvParser.parseCSV(csvData);
// Returns:
// [
//   ['name', 'age', 'city'],
//   ['John', '30', 'New York'],
//   ['Jane', '25', 'Los Angeles']
// ]
```

### Parse to Objects

```javascript
const csvData = `name,age,city
John,30,New York
Jane,25,Los Angeles`;

const objects = csvParser.parseCSVToObjects(csvData);
// Returns:
// [
//   { name: 'John', age: '30', city: 'New York' },
//   { name: 'Jane', age: '25', city: 'Los Angeles' }
// ]
```

## Handling Special Cases

### Quoted Fields

Fields containing commas or newlines should be quoted:

```javascript
const csv = `name,description
Product,"A great product, with commas"
Service,"Multi-line
description here"`;

const rows = csvParser.parseCSV(csv);
// Correctly handles quoted commas and newlines
```

### Escaped Quotes

Double quotes within fields are escaped with another double quote:

```javascript
const csv = `name,quote
John,"He said ""Hello"""`;

const rows = csvParser.parseCSV(csv);
// Returns: [['name', 'quote'], ['John', 'He said "Hello"']]
```

### Empty Fields

```javascript
const csv = `a,b,c
1,,3
,2,`;

const rows = csvParser.parseCSV(csv);
// Returns: [['a', 'b', 'c'], ['1', '', '3'], ['', '2', '']]
```

## Configuration

### Custom Delimiter

```javascript
const csvParser = fable.instantiateServiceProvider('CSVParser', {
    delimiter: ';'  // Use semicolon instead of comma
});

const csv = `name;age;city
John;30;New York`;

const rows = csvParser.parseCSV(csv);
```

### Custom Quote Character

```javascript
const csvParser = fable.instantiateServiceProvider('CSVParser', {
    quote: "'"  // Use single quotes
});

const csv = `name,description
Product,'Has a comma, inside'`;

const rows = csvParser.parseCSV(csv);
```

## Parsing Files

### With FilePersistence Service

```javascript
const filePersistence = fable.instantiateServiceProvider('FilePersistence');

filePersistence.readFile('data.csv', 'utf8', (error, content) => {
    if (error) throw error;

    const csvParser = fable.instantiateServiceProvider('CSVParser');
    const data = csvParser.parseCSVToObjects(content);

    console.log('Parsed rows:', data.length);
});
```

## Generating CSV

### Array to CSV

```javascript
const data = [
    ['name', 'age', 'city'],
    ['John', '30', 'New York'],
    ['Jane', '25', 'Los Angeles']
];

const csv = csvParser.generateCSV(data);
// Returns:
// name,age,city
// John,30,New York
// Jane,25,Los Angeles
```

### Objects to CSV

```javascript
const objects = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
];

const csv = csvParser.generateCSVFromObjects(objects);
// Returns CSV with headers from object keys
```

## Use Cases

### Data Import

```javascript
function importUsers(csvContent) {
    const parser = fable.instantiateServiceProvider('CSVParser');
    const users = parser.parseCSVToObjects(csvContent);

    users.forEach(user => {
        createUser({
            name: user.name,
            email: user.email,
            role: user.role || 'user'
        });
    });

    return users.length;
}
```

### Data Export

```javascript
function exportReport(data) {
    const parser = fable.instantiateServiceProvider('CSVParser');
    return parser.generateCSVFromObjects(data.map(item => ({
        date: item.date,
        amount: item.amount.toFixed(2),
        description: item.description
    })));
}
```

### Data Transformation

```javascript
function transformCSV(inputCSV, transformFn) {
    const parser = fable.instantiateServiceProvider('CSVParser');
    const data = parser.parseCSVToObjects(inputCSV);
    const transformed = data.map(transformFn);
    return parser.generateCSVFromObjects(transformed);
}

// Usage
const output = transformCSV(input, (row) => ({
    ...row,
    fullName: `${row.firstName} ${row.lastName}`,
    ageInMonths: parseInt(row.age) * 12
}));
```

## Error Handling

```javascript
try {
    const data = csvParser.parseCSV(csvContent);
} catch (error) {
    fable.log.error('CSV parsing failed', { error: error.message });
    // Handle malformed CSV
}
```

## Notes

- All values are returned as strings; convert as needed
- Empty lines are typically skipped
- The parser handles various line ending styles (LF, CRLF)
- Large files should be processed in chunks for memory efficiency
