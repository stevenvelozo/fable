# joinraw

Joins array elements into a string without any separator.

## Syntax

```
joinraw(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | The array of values to join |

## Returns

String - All array elements joined with no separator.

## Description

The `joinraw` function combines all elements of an array into a single string without placing any separator between elements.

## Examples

### Basic Usage

```expression
Result = JOINRAW(["H", "e", "l", "l", "o"])
// Result: "Hello"
```

### Building Identifiers

```expression
Code = JOINRAW([Prefix, Number, Suffix])
// Result: "ABC123XYZ"
```

### Character Array to String

```expression
Word = JOINRAW(Characters)
// Result: combined string
```

## Use Cases

- **String reconstruction**: Rebuild strings from character arrays
- **Code generation**: Build identifiers
- **Data transformation**: Combine array into string

## Related Functions

- [join](./join.md) - Join with custom separator
- [concat](./concat.md) - Concatenate with spaces
- [concatraw](./concatraw.md) - Concatenate without spaces

## Notes

- No separator between elements
- Uses the DataFormat service internally
- Useful when working with character arrays
