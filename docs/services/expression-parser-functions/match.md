# match

Tests a string against a regular expression pattern.

## Syntax

```
match(text, pattern)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | String | The string to test |
| `pattern` | String | Regular expression pattern |

## Returns

Boolean - True if the pattern matches, false otherwise.

## Description

The `match` function tests whether a string matches a regular expression pattern. Returns true if the pattern is found anywhere in the string.

## Examples

### Basic Usage

```expression
Result = MATCH("Hello World", "World")
// Result: true
```

### Email Validation

```expression
IsEmail = MATCH(InputValue, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
```

### Phone Number Pattern

```expression
IsPhone = MATCH(PhoneNumber, "^\\d{3}-\\d{3}-\\d{4}$")
```

### Contains Digit

```expression
HasDigit = MATCH(Password, "\\d")
```

## Use Cases

- **Validation**: Validate input formats
- **Pattern matching**: Find patterns in text
- **Filtering**: Conditional processing
- **Data quality**: Check data format

## Related Functions

- [findfirstvaluebyexactmatch](./findfirstvaluebyexactmatch.md) - Find in array
- [findfirstvaluebystringincludes](./findfirstvaluebystringincludes.md) - Substring search
- [if](./if.md) - Use with conditional logic

## Notes

- Uses JavaScript regex
- Escape special characters with double backslash
- Returns boolean
- Uses the Utility service's `legacyMatch` method
