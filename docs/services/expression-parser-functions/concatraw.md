# concatraw

Concatenates values into a single string without any separation.

## Syntax

```
concatraw(value1, value2, ...)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Any | Values to concatenate |

## Returns

String - All values joined with no separator.

## Description

The `concatraw` function joins multiple values into a single string without adding any spaces or separators between them. This is useful for building identifiers, codes, and other concatenated strings where spaces would be inappropriate.

## Examples

### Basic Usage

```expression
Result = CONCATRAW("Hello", "World")
// Result: "HelloWorld"
```

### Building Codes

```expression
ProductCode = CONCATRAW(Category, "-", ItemNumber)
// Result: "ELEC-12345"
```

### File Names

```expression
FileName = CONCATRAW(BaseName, "_", Version, ".txt")
// Result: "report_v2.txt"
```

### Identifiers

```expression
UniqueID = CONCATRAW(Prefix, ID, Suffix)
// Result: "USR00123ACT"
```

## Use Cases

- **Identifiers**: Build unique IDs
- **File names**: Construct file names
- **Codes**: Create product/reference codes
- **URLs**: Build URL components

## Related Functions

- [concat](./concat.md) - Concatenate with spaces
- [join](./join.md) - Join with custom separator
- [joinraw](./joinraw.md) - Join array without spaces

## Notes

- No separator between values
- Converts non-string values to strings
- Useful when spaces are not wanted
- Uses the DataFormat service internally
