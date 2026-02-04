# resolvehtmlentities

Converts HTML entities to their corresponding characters.

## Syntax

```
resolvehtmlentities(text)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | String | Text containing HTML entities |

## Returns

String - Text with HTML entities decoded.

## Description

The `resolvehtmlentities` function converts HTML entities (like `&amp;`, `&lt;`, `&gt;`) back to their original characters.

## Examples

### Basic Usage

```expression
Result = RESOLVEHTMLENTITIES("Hello &amp; World")
// Result: "Hello & World"
```

### Multiple Entities

```expression
Result = RESOLVEHTMLENTITIES("&lt;div&gt;Content&lt;/div&gt;")
// Result: "<div>Content</div>"
```

### Special Characters

```expression
Result = RESOLVEHTMLENTITIES("Price: &pound;100 &copy; 2025")
// Result: "Price: £100 © 2025"
```

## Use Cases

- **Data cleaning**: Decode HTML-encoded data
- **Display**: Show proper characters
- **Import**: Process HTML data
- **Text processing**: Normalize text

## Related Functions

- [concat](./concat.md) - Combine strings
- [join](./join.md) - Join strings

## Notes

- Decodes common HTML entities
- Handles numeric entities
- Uses the DataFormat service
