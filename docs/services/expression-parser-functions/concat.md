# concat

Concatenates values into a single string with space separation.

## Syntax

```
concat(value1, value2, ...)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Any | Values to concatenate |

## Returns

String - All values joined with spaces.

## Description

The `concat` function joins multiple values into a single string, automatically adding spaces between each value. This is useful for building display strings and messages.

## Examples

### Basic Usage

```expression
Result = CONCAT("Hello", "World")
// Result: "Hello World"
```

### Multiple Values

```expression
FullName = CONCAT(FirstName, MiddleName, LastName)
// Result: "John William Smith"
```

### With Numbers

```expression
Message = CONCAT("Total:", 42, "items")
// Result: "Total: 42 items"
```

### Building Labels

```expression
Label = CONCAT(ProductName, "-", Size, Color)
// Result: "Widget - Large Blue"
```

## Use Cases

- **Display strings**: Build user-facing text
- **Labels**: Create composite labels
- **Messages**: Construct messages from parts
- **Reports**: Combine data for display

## Related Functions

- [concatraw](./concatraw.md) - Concatenate without spaces
- [join](./join.md) - Join with custom separator
- [joinraw](./joinraw.md) - Join without spaces

## Notes

- Automatically adds spaces between values
- Converts non-string values to strings
- Use `concatraw` for no separator
- Uses the DataFormat service internally
