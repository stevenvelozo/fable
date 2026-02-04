# compare

Compares two values and returns their relationship.

## Syntax

```
compare(value1, value2)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value1` | Number | First value to compare |
| `value2` | Number | Second value to compare |

## Returns

String - Returns "-1" if value1 < value2, "0" if equal, "1" if value1 > value2.

## Description

The `compare` function compares two numeric values and returns a value indicating their relative order. This is useful for sorting and conditional logic.

## Examples

### Basic Comparisons

```expression
Result = COMPARE(5, 10)
// Result: "-1" (5 is less than 10)

Result = COMPARE(10, 5)
// Result: "1" (10 is greater than 5)

Result = COMPARE(5, 5)
// Result: "0" (equal)
```

### With Variables

```expression
Comparison = COMPARE(ActualValue, ExpectedValue)
```

### Conditional Logic

```expression
// Check if over budget
OverBudget = COMPARE(Spending, Budget) == 1
```

## Use Cases

- **Sorting**: Determine sort order
- **Validation**: Check thresholds
- **Business logic**: Compare metrics
- **Conditional processing**: Branch based on comparison

## Related Functions

- [max](./max.md) - Find maximum value
- [min](./min.md) - Find minimum value
- [if](./if.md) - Conditional logic
- [when](./when.md) - Conditional expression

## Notes

- Returns string: "-1", "0", or "1"
- Uses the Math service's `comparePrecise` method
- Works with arbitrary precision numbers
