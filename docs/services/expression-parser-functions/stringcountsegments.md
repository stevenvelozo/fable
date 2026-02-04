# stringcountsegments

Counts the number of segments in a string when split by a delimiter.

## Syntax

```
stringcountsegments(text, delimiter)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | String | The string to count segments in |
| `delimiter` | String | The delimiter to split by |

## Returns

String - The number of segments.

## Description

The `stringcountsegments` function splits a string by a delimiter and returns the count of resulting segments.

## Examples

### Basic Usage

```expression
Result = STRINGCOUNTSEGMENTS("a,b,c,d,e", ",")
// Result: "5"
```

### Path Segments

```expression
PathDepth = STRINGCOUNTSEGMENTS("/home/user/documents", "/")
// Result: "4" (empty first segment + 3 folders)
```

### Word Count

```expression
WordCount = STRINGCOUNTSEGMENTS("Hello World Everyone", " ")
// Result: "3"
```

## Use Cases

- **Validation**: Check expected number of parts
- **Path analysis**: Count path segments
- **Data parsing**: Validate delimited data
- **Text analysis**: Count words or phrases

## Related Functions

- [stringgetsegments](./stringgetsegments.md) - Get the actual segments
- [concat](./concat.md) - Combine strings
- [join](./join.md) - Join with delimiter

## Notes

- Returns count as string
- Empty string returns "1" (one empty segment)
- Uses the Utility service
