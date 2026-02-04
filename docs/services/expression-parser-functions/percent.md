# percent

Calculates what percentage one value is of another.

## Syntax

```
percent(part, whole)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `part` | Number | The partial value |
| `whole` | Number | The total value |

## Returns

String - The percentage as a decimal (multiply by 100 for traditional percentage).

## Description

The `percent` function calculates what percentage the first value is of the second value. The result is returned as a decimal ratio.

## Examples

### Basic Usage

```expression
Result = PERCENT(25, 100)
// Result: "0.25" (25%)
```

### Sales Percentage

```expression
// What percentage of goal was achieved?
Achievement = PERCENT(ActualSales, SalesGoal)
```

### With Multiplication for Display

```expression
// Get traditional percentage value
PercentValue = PERCENT(50, 200) * 100
// Result: 25 (25%)
```

### Completion Rate

```expression
// Calculate completion percentage
CompletionRate = PERCENT(CompletedTasks, TotalTasks)
```

## Use Cases

- **Business metrics**: Calculate achievement percentages
- **Data analysis**: Proportion calculations
- **Progress tracking**: Completion percentages
- **Financial reporting**: Ratio analysis

## Related Functions

- [compare](./compare.md) - Compare two values
- [round](./round.md) - Round percentage results
- [tofixed](./tofixed.md) - Format percentage with decimals

## Notes

- Returns decimal, not percentage (0.25 not 25%)
- Multiply by 100 for traditional percentage display
- Uses the Math service's `percentPrecise` method
- Returns result as string for precision
