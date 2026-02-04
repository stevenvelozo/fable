# cleanvalueobject

Gets a value from an object with default for missing values.

## Syntax

```
cleanvalueobject(object, key, defaultValue)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `object` | Object | The object to retrieve from |
| `key` | String | The property key |
| `defaultValue` | Any | Value to return if key is missing or value is undefined |

## Returns

Any - The property value, or the default value.

## Description

The `cleanvalueobject` function retrieves a value from an object by key, returning a default value if the key doesn't exist or the value is undefined/null.

## Examples

### Basic Usage

```expression
// Given object: { name: "John" }
Result = CLEANVALUEOBJECT(Person, "email", "no-email@example.com")
// Result: "no-email@example.com" (key doesn't exist)
```

### Safe Configuration

```expression
Timeout = CLEANVALUEOBJECT(Config, "timeout", 30)
// Returns 30 if timeout not configured
```

### Histogram Lookup

```expression
Count = CLEANVALUEOBJECT(Histogram, "MissingCategory", 0)
// Returns 0 if category doesn't exist
```

## Use Cases

- **Configuration**: Default settings
- **Data processing**: Handle missing data
- **Display**: Show placeholder text
- **Calculations**: Default numeric values

## Related Functions

- [getvalueobject](./getvalueobject.md) - Get without default
- [cleanvaluearray](./cleanvaluearray.md) - Clean get from array
- [getvalue](./getvalue.md) - Get from data state

## Notes

- Returns default for undefined/null
- Returns default for missing keys
- Uses the Logic service's `cleanValueObject` method
