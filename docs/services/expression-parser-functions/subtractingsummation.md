# subtractingsummation

Generates a subtracting running total from an array of values.

## Syntax

```
subtractingsummation(array)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | Array of numeric values |

## Returns

Array - Array of running differences.

## Description

The `subtractingsummation` function creates an array where each element is the result of subtracting subsequent values from a running total. This is the opposite of cumulative summation.

## Examples

### Basic Usage

```expression
Result = SUBTRACTINGSUMMATION([100, 20, 30, 10])
// Result: [100, 80, 50, 40]
// 100, 100-20=80, 80-30=50, 50-10=40
```

### Budget Tracking

```expression
// Start with budget, subtract expenses
RemainingBudget = SUBTRACTINGSUMMATION([1000, 250, 150, 75, 200])
// Shows remaining after each expense
```

### Inventory Depletion

```expression
InventoryLevels = SUBTRACTINGSUMMATION([500, 50, 30, 100, 25])
```

## Use Cases

- **Budget tracking**: Remaining funds after expenses
- **Inventory**: Stock levels after withdrawals
- **Resource depletion**: Tracking consumption
- **Countdown**: Decreasing totals

## Related Functions

- [cumulativesummation](./cumulativesummation.md) - Running total (adding)
- [sum](./sum.md) - Simple sum
- [iterativeseries](./iterativeseries.md) - Custom iterative calculation

## Notes

- First element is starting value
- Each subsequent element subtracts from running total
- Uses the Math service's `subtractingSummation` method
