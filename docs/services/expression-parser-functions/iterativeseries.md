# iterativeseries

Performs iterative mathematical operations on set elements.

## Syntax

```
iterativeseries(array, valueProperty, resultProperty, startValue, operation)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `array` | Array | Array of objects to process |
| `valueProperty` | String | Property name containing values |
| `resultProperty` | String | Property name to store results |
| `startValue` | Number/String | Initial value for the series |
| `operation` | String | Operation to perform ("add", "subtract", "multiply", "divide") |

## Returns

Array - The input array with results added to each object.

## Description

The `iterativeseries` function performs a specified mathematical operation iteratively across an array of objects. It starts with an initial value and applies the operation with each element's value, storing the cumulative result.

## Examples

### Cumulative Addition

```expression
Result = ITERATIVESERIES(Values, "Value", "Resultant", 1, "add")

// Input:
Values = [
    { Value: 10 },
    { Value: 20 },
    { Value: 5 }
]

// Output:
// [
//     { Value: 10, Resultant: "10" },   // 1 - 1 + 10 = 10
//     { Value: 20, Resultant: "30" },   // 10 + 20 = 30
//     { Value: 5, Resultant: "35" }     // 30 + 5 = 35
// ]
```

### Running Product

```expression
Result = ITERATIVESERIES(Data, "Factor", "Product", 1, "multiply")

// Input:
Data = [
    { Factor: 2 },
    { Factor: 3 },
    { Factor: 4 }
]

// Output: Products: 2, 6, 24
```

### Depreciation Calculation

```expression
// Calculate declining balance
Assets = [
    { DepreciationRate: 0.1 },
    { DepreciationRate: 0.1 },
    { DepreciationRate: 0.1 }
]

// Start with initial value and multiply by (1 - rate) each period
Result = ITERATIVESERIES(Assets, "DepreciationRate", "RemainingValue", 1000, "custom")
```

## Available Operations

| Operation | Description |
|-----------|-------------|
| `"add"` | Cumulative addition |
| `"subtract"` | Cumulative subtraction |
| `"multiply"` | Cumulative multiplication |
| `"divide"` | Cumulative division |

## Use Cases

- **Financial calculations**: Compound interest, depreciation
- **Inventory**: Running balance calculations
- **Statistics**: Cumulative products, geometric series
- **Process modeling**: Sequential transformations

## Related Functions

- [cumulativesummation](./cumulativesummation.md) - Specifically for cumulative sums
- [subtractingsummation](./subtractingsummation.md) - Specifically for subtracting
- [sum](./sum.md) - Simple sum of all values

## Notes

- Modifies the input array by adding the result property
- Uses arbitrary precision arithmetic
- The start value is used as the initial accumulator
- Works with the Math service's `iterativeSeries` method
