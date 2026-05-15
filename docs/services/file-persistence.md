# FilePersistence Service

The FilePersistence service provides file system operations for reading and writing files, with special support for CSV file handling.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'FilePersistDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
// (Browser implementation is a stub; full file system access requires Node.js.)
const filePersistence = fable.instantiateServiceProvider('FilePersistence');
console.log('filePersistence:', typeof filePersistence);
```

## Browser vs Node.js

Fable automatically uses the appropriate implementation:

- **Node.js**: Full file system access
- **Browser**: `FilePersistence-Web.js` - Stub implementation

## Reading Files

### Read File (Async)

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.readFile('/path/to/file.txt', 'utf8', (error, content) => {");
console.info("        if (error) { console.error('Read error:', error); return; }");
console.info("        console.log('Content:', content);");
console.info("    });");
```

### Read File Sync

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    const content = filePersistence.readFileSync('/path/to/file.txt', 'utf8');");
```

### Read JSON File

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.readJSONFile('/path/to/data.json', (error, data) => {");
console.info("        if (error) { console.error('Failed to read JSON:', error); return; }");
console.info("        console.log('Data:', data);");
console.info("    });");
```

## Writing Files

### Write File (Async)

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.writeFile('/path/to/file.txt', 'Hello, World!', 'utf8', (error) => {");
console.info("        if (error) { console.error('Write error:', error); return; }");
console.info("        console.log('File written successfully');");
console.info("    });");
```

### Write File Sync

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.writeFileSync('/path/to/file.txt', 'Hello, World!', 'utf8');");
```

### Write JSON File

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    const data = { name: 'John', age: 30 };");
console.info("    filePersistence.writeJSONFile('/path/to/data.json', data, (error) => {");
console.info("        if (error) { console.error('Failed to write JSON:', error); return; }");
console.info("        console.log('JSON written successfully');");
console.info("    });");
```

## CSV File Operations

### Read CSV File

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.readCSVFile('/path/to/data.csv', (error, rows) => {");
console.info("        if (error) { console.error('Failed to read CSV:', error); return; }");
console.info("        // rows is an array of arrays");
console.info("        rows.forEach(row => console.log(row.join(', ')));");
console.info("    });");
```

### Read CSV to Objects

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.readCSVFileToObjects('/path/to/data.csv', (error, objects) => {");
console.info("        if (error) { console.error('Failed to read CSV:', error); return; }");
console.info("        // objects is an array of objects with headers as keys");
console.info("        objects.forEach(obj => console.log(obj.name, obj.age));");
console.info("    });");
```

### Write CSV File

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    const rows = [");
console.info("        ['name', 'age', 'city'],");
console.info("        ['John', '30', 'New York'],");
console.info("        ['Jane', '25', 'Los Angeles']");
console.info("    ];");
console.info("    filePersistence.writeCSVFile('/path/to/output.csv', rows, (error) => {");
console.info("        if (error) { console.error('Failed to write CSV:', error); return; }");
console.info("        console.log('CSV written successfully');");
console.info("    });");
```

## Directory Operations

### Check if File Exists

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    const exists = filePersistence.fileExists('/path/to/file.txt');");
```

### Check if Directory Exists

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    const exists = filePersistence.directoryExists('/path/to/directory');");
```

### Create Directory

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.createDirectory('/path/to/new/directory', (error) => {");
console.info("        if (error) { console.error('Failed to create directory:', error); return; }");
console.info("        console.log('Directory created');");
console.info("    });");
```

### Create Directory Sync

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.createDirectorySync('/path/to/new/directory');");
```

### List Directory

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.listDirectory('/path/to/directory', (error, files) => {");
console.info("        if (error) { console.error('Failed to list directory:', error); return; }");
console.info("        files.forEach(file => console.log(file));");
console.info("    });");
```

## Use Cases

### Configuration Loading

```javascript
// Node.js reference — wraps the callback API in a Promise. Browser playground has no fs.
console.info("In Node.js:");
console.info("    function loadConfig(configPath) {");
console.info("        const filePersistence = fable.instantiateServiceProvider('FilePersistence');");
console.info("        return new Promise((resolve, reject) => {");
console.info("            filePersistence.readJSONFile(configPath, (error, config) => {");
console.info("                if (error) reject(error);");
console.info("                else resolve(config);");
console.info("            });");
console.info("        });");
console.info("    }");
```

### Log File Writing

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    function appendToLog(message) {");
console.info("        const filePersistence = fable.instantiateServiceProvider('FilePersistence');");
console.info("        const logPath = '/var/log/myapp/app.log';");
console.info("        const timestamp = new Date().toISOString();");
console.info("        const line = `${timestamp} - ${message}\\n`;");
console.info("        filePersistence.appendFile(logPath, line, 'utf8', (error) => {");
console.info("            if (error) console.error('Failed to write log:', error);");
console.info("        });");
console.info("    }");
```

### Data Export

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    async function exportData(data, format, outputPath) {");
console.info("        const filePersistence = fable.instantiateServiceProvider('FilePersistence');");
console.info("        return new Promise((resolve, reject) => {");
console.info("            if (format === 'json') {");
console.info("                filePersistence.writeJSONFile(outputPath, data, (err) => err ? reject(err) : resolve());");
console.info("            } else if (format === 'csv') {");
console.info("                filePersistence.writeCSVFile(outputPath, data, (err) => err ? reject(err) : resolve());");
console.info("            }");
console.info("        });");
console.info("    }");
```

### Batch File Processing

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    function processFiles(directory, processor) {");
console.info("        const filePersistence = fable.instantiateServiceProvider('FilePersistence');");
console.info("        filePersistence.listDirectory(directory, (error, files) => {");
console.info("            if (error) throw error;");
console.info("            files.forEach(file => {");
console.info("                const fullPath = `${directory}/${file}`;");
console.info("                filePersistence.readFile(fullPath, 'utf8', (err, content) => {");
console.info("                    if (err) { console.error(`Failed to read ${file}:`, err); return; }");
console.info("                    processor(file, content);");
console.info("                });");
console.info("            });");
console.info("        });");
console.info("    }");
```

## Error Handling

```javascript
// Node.js reference — browser playground has no fs.
console.info("In Node.js:");
console.info("    filePersistence.readFile('/nonexistent/file.txt', 'utf8', (error, content) => {");
console.info("        if (error) {");
console.info("            if (error.code === 'ENOENT') console.log('File does not exist');");
console.info("            else if (error.code === 'EACCES') console.log('Permission denied');");
console.info("            else console.error('Unexpected error:', error);");
console.info("            return;");
console.info("        }");
console.info("        // Process content");
console.info("    });");
```

## Notes

- Browser version provides stub implementations that may not work
- Use async methods for better performance with large files
- JSON files are automatically parsed/stringified
- CSV operations integrate with the CSVParser service
