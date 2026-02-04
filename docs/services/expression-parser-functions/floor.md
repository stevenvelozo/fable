# floor

Returns the largest integer less than or equal to a number.

## Syntax

```
floor(value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number/String | The value to floor |

## Returns

String - The largest integer less than or equal to the input.

## Description

The `floor` function rounds a number down to the nearest integer. For positive numbers, this truncates the decimal portion. For negative numbers, it rounds away from zero (more negative).

## Examples

### Basic Usage

```expression
Result = floor(3.7)
// Result: "3"

Result = floor(3.2)
// Result: "3"

Result = floor(3.0)
// Result: "3"

Result = floor(-2.3)
// Result: "-3" (rounds toward negative infinity)
```

### With Expressions

```expression
// Get the integer part of a calculation
WholeUnits = floor(TotalAmount / UnitPrice)

// Determine array index from position
Index = floor(Position / ItemSize)
```

## Use Cases

- **Integer division**: Getting the quotient without remainder
- **Array indexing**: Converting continuous values to discrete indices
- **Pagination**: Calculating page numbers
- **Time calculations**: Converting decimal hours to whole hours

## Related Functions

- [ceil](./ceil.md) - Round up (ceiling)
- [round](./round.md) - Round to nearest
- [tofixed](./tofixed.md) - Format to fixed decimal places

## Notes

- Uses arbitrary precision arithmetic
- Returns a string representation
- For negative numbers, floor(-2.3) = -3, not -2
