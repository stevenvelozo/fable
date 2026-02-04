# cumulativesummation

Calculates cumulative (running) sums across a set of records.

## Syntax

```
cumulativesummation(array, valueProperty, resultProperty)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | Array of objects to process |
| `valueProperty` | String | Property name containing values to sum |
| `resultProperty` | String | Property name to store the cumulative result |

## Returns

Array - The input array with a new property added to each object containing the cumulative sum.

## Description

The `cumulativesummation` function iterates through an array of objects and calculates a running total. Each object receives a new property containing the sum of all values up to and including that point.

## Examples

### Basic Usage

```expression
// Input data
Data = [
    { Value: 10 },
    { Value: 20 },
    { Value: 5 }
]

Result = cumulativesummation(Data, "Value", "RunningTotal")

// Result:
// [
//     { Value: 10, RunningTotal: "10" },
//     { Value: 20, RunningTotal: "30" },
//     { Value: 5, RunningTotal: "35" }
// ]
```

### Financial Running Balance

```expression
// Track cumulative spending
Transactions = [
    { Amount: 100, Description: "Purchase 1" },
    { Amount: 50, Description: "Purchase 2" },
    { Amount: 75, Description: "Purchase 3" }
]

Result = cumulativesummation(Transactions, "Amount", "TotalSpent")
// TotalSpent values: 100, 150, 225
```

### Inventory Tracking

```expression
// Track cumulative inventory received
Shipments = [
    { Quantity: 500 },
    { Quantity: 300 },
    { Quantity: 200 }
]

Result = cumulativesummation(Shipments, "Quantity", "TotalReceived")
// TotalReceived values: 500, 800, 1000
```

## Use Cases

- **Financial tracking**: Running balances, cumulative spending
- **Inventory management**: Cumulative receipts or shipments
- **Progress tracking**: Cumulative completion amounts
- **Statistical analysis**: Cumulative distribution functions
- **Reporting**: Year-to-date totals

## Related Functions

- [subtractingsummation](./subtractingsummation.md) - Subtracting cumulative
- [iterativeseries](./iterativeseries.md) - General iterative operations
- [sum](./sum.md) - Simple sum of all values

## Notes

- Modifies the input array by adding the result property
- Uses arbitrary precision arithmetic
- Works with the Math service's `cumulativeSummation` method
- The result property values are strings (arbitrary precision)
