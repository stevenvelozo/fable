# ceil

Returns the smallest integer greater than or equal to a number.

## Syntax

```
ceil(value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number/String | The value to ceiling |

## Returns

String - The smallest integer greater than or equal to the input.

## Description

The `ceil` function rounds a number up to the nearest integer. For positive numbers, this rounds away from zero. For negative numbers, it rounds toward zero (less negative).

## Examples

### Basic Usage

```expression
Result = ceil(3.2)
// Result: "4"

Result = ceil(3.7)
// Result: "4"

Result = ceil(3.0)
// Result: "3"

Result = ceil(-2.7)
// Result: "-2" (rounds toward zero)
```

### With Expressions

```expression
// Calculate pages needed
PagesNeeded = ceil(TotalItems / ItemsPerPage)

// Calculate containers required
ContainersNeeded = ceil(TotalVolume / ContainerCapacity)
```

## Use Cases

- **Resource allocation**: Calculating minimum containers/pages needed
- **Time calculations**: Rounding up to next hour/day
- **Inventory planning**: Ensuring sufficient stock
- **Pricing**: Rounding up prices

## Related Functions

- [floor](./floor.md) - Round down
- [round](./round.md) - Round to nearest
- [tofixed](./tofixed.md) - Format to fixed decimal places

## Notes

- Uses arbitrary precision arithmetic
- Returns a string representation
- For negative numbers, ceil(-2.7) = -2, not -3
