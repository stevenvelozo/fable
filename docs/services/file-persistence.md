# FilePersistence Service

The FilePersistence service provides file system operations for reading and writing files, with special support for CSV file handling.

## Access

```javascript
// On-demand service - instantiate when needed
const filePersistence = fable.instantiateServiceProvider('FilePersistence');
```

## Browser vs Node.js

Fable automatically uses the appropriate implementation:

- **Node.js**: Full file system access
- **Browser**: `FilePersistence-Web.js` - Stub implementation

## Reading Files

### Read File (Async)

```javascript
filePersistence.readFile('/path/to/file.txt', 'utf8', (error, content) => {
    if (error) {
        console.error('Read error:', error);
        return;
    }
    console.log('Content:', content);
});
```

### Read File Sync

```javascript
const content = filePersistence.readFileSync('/path/to/file.txt', 'utf8');
```

### Read JSON File

```javascript
filePersistence.readJSONFile('/path/to/data.json', (error, data) => {
    if (error) {
        console.error('Failed to read JSON:', error);
        return;
    }
    console.log('Data:', data);
});
```

## Writing Files

### Write File (Async)

```javascript
filePersistence.writeFile('/path/to/file.txt', 'Hello, World!', 'utf8', (error) => {
    if (error) {
        console.error('Write error:', error);
        return;
    }
    console.log('File written successfully');
});
```

### Write File Sync

```javascript
filePersistence.writeFileSync('/path/to/file.txt', 'Hello, World!', 'utf8');
```

### Write JSON File

```javascript
const data = { name: 'John', age: 30 };

filePersistence.writeJSONFile('/path/to/data.json', data, (error) => {
    if (error) {
        console.error('Failed to write JSON:', error);
        return;
    }
    console.log('JSON written successfully');
});
```

## CSV File Operations

### Read CSV File

```javascript
filePersistence.readCSVFile('/path/to/data.csv', (error, rows) => {
    if (error) {
        console.error('Failed to read CSV:', error);
        return;
    }

    // rows is an array of arrays
    rows.forEach(row => {
        console.log(row.join(', '));
    });
});
```

### Read CSV to Objects

```javascript
filePersistence.readCSVFileToObjects('/path/to/data.csv', (error, objects) => {
    if (error) {
        console.error('Failed to read CSV:', error);
        return;
    }

    // objects is an array of objects with headers as keys
    objects.forEach(obj => {
        console.log(obj.name, obj.age);
    });
});
```

### Write CSV File

```javascript
const rows = [
    ['name', 'age', 'city'],
    ['John', '30', 'New York'],
    ['Jane', '25', 'Los Angeles']
];

filePersistence.writeCSVFile('/path/to/output.csv', rows, (error) => {
    if (error) {
        console.error('Failed to write CSV:', error);
        return;
    }
    console.log('CSV written successfully');
});
```

## Directory Operations

### Check if File Exists

```javascript
const exists = filePersistence.fileExists('/path/to/file.txt');
```

### Check if Directory Exists

```javascript
const exists = filePersistence.directoryExists('/path/to/directory');
```

### Create Directory

```javascript
filePersistence.createDirectory('/path/to/new/directory', (error) => {
    if (error) {
        console.error('Failed to create directory:', error);
        return;
    }
    console.log('Directory created');
});
```

### Create Directory Sync

```javascript
filePersistence.createDirectorySync('/path/to/new/directory');
```

### List Directory

```javascript
filePersistence.listDirectory('/path/to/directory', (error, files) => {
    if (error) {
        console.error('Failed to list directory:', error);
        return;
    }
    files.forEach(file => console.log(file));
});
```

## Use Cases

### Configuration Loading

```javascript
function loadConfig(configPath) {
    const filePersistence = fable.instantiateServiceProvider('FilePersistence');

    return new Promise((resolve, reject) => {
        filePersistence.readJSONFile(configPath, (error, config) => {
            if (error) reject(error);
            else resolve(config);
        });
    });
}
```

### Log File Writing

```javascript
function appendToLog(message) {
    const filePersistence = fable.instantiateServiceProvider('FilePersistence');
    const logPath = '/var/log/myapp/app.log';
    const timestamp = new Date().toISOString();
    const line = `${timestamp} - ${message}\n`;

    filePersistence.appendFile(logPath, line, 'utf8', (error) => {
        if (error) console.error('Failed to write log:', error);
    });
}
```

### Data Export

```javascript
async function exportData(data, format, outputPath) {
    const filePersistence = fable.instantiateServiceProvider('FilePersistence');

    return new Promise((resolve, reject) => {
        if (format === 'json') {
            filePersistence.writeJSONFile(outputPath, data, (err) => {
                err ? reject(err) : resolve();
            });
        } else if (format === 'csv') {
            filePersistence.writeCSVFile(outputPath, data, (err) => {
                err ? reject(err) : resolve();
            });
        }
    });
}
```

### Batch File Processing

```javascript
function processFiles(directory, processor) {
    const filePersistence = fable.instantiateServiceProvider('FilePersistence');

    filePersistence.listDirectory(directory, (error, files) => {
        if (error) throw error;

        files.forEach(file => {
            const fullPath = `${directory}/${file}`;
            filePersistence.readFile(fullPath, 'utf8', (err, content) => {
                if (err) {
                    console.error(`Failed to read ${file}:`, err);
                    return;
                }
                processor(file, content);
            });
        });
    });
}
```

## Error Handling

```javascript
filePersistence.readFile('/nonexistent/file.txt', 'utf8', (error, content) => {
    if (error) {
        if (error.code === 'ENOENT') {
            console.log('File does not exist');
        } else if (error.code === 'EACCES') {
            console.log('Permission denied');
        } else {
            console.error('Unexpected error:', error);
        }
        return;
    }
    // Process content
});
```

## Notes

- Browser version provides stub implementations that may not work
- Use async methods for better performance with large files
- JSON files are automatically parsed/stringified
- CSV operations integrate with the CSVParser service
