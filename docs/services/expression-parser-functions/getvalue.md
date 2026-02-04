# getvalue

Retrieves a value from application state using a hash/path address.

## Syntax

```
getvalue(path)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | String | Dot-notation path to the value (in quotes) |

## Returns

The value at the specified path, or `undefined` if not found.

## Description

The `getvalue` function retrieves values from the Fable application state (AppData, services, etc.) using a dot-notation path. This allows expressions to access data stored elsewhere in the application.

## Examples

### Basic Usage

```expression
// Access a simple value
PitSize = getvalue("AppData.Pit")
// If AppData.Pit = "Bottomless"
// Result: "Bottomless"
```

### Array Access

```expression
// Access array elements
FirstStudent = GETVALUE("AppData.Students[0]")
// If AppData.Students = ["Kim", "Jim", "Joan Jett", "Tank Girl"]
// Result: "Kim"

ThirdStudent = GETVALUE("AppData.Students[2]")
// Result: "Joan Jett"
```

### Nested Object Access

```expression
// Access nested properties
CityName = getvalue("AppData.Cities[0].city")
// If AppData.Cities[0] = { city: "New York", state: "New York" }
// Result: "New York"
```

### With Null Coalescence Assignment

```expression
// Only assign if target doesn't already have a value
Name ?= GETVALUE("AppData.Students[0]")
// Sets Name to "Kim" only if Name is currently empty/undefined
```

### In Complex Expressions

```expression
// Combine with other functions
Histogram = aggregationhistogrambyobject(getvalue("AppData.Teams"), "States", "Score")
```

## Use Cases

- **Configuration access**: Reading application settings
- **Data lookup**: Retrieving stored values
- **Dynamic references**: Access paths determined at runtime
- **Cross-module data**: Sharing data between components

## Related Functions

- [getvaluearray](./getvaluearray.md) - Get array of values
- [getvalueobject](./getvalueobject.md) - Get object of values

## Notes

- The path must be quoted (it's a string)
- Accesses `fable.Utility.getInternalValueByHash`
- Returns `undefined` if the path doesn't exist
- Array indices use bracket notation: `[0]`, `[1]`, etc.
- Works with any data stored on the Fable instance
