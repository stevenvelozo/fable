# linest

Performs linear estimation (alias for leastsquares).

## Syntax

```
linest(xValues, yValues)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `xValues` | Array | Array of x-coordinates (independent variable) |
| `yValues` | Array | Array of y-coordinates (dependent variable) |

## Returns

Object - Regression results including slope, intercept, and statistics.

## Description

The `linest` function is an alias for `leastsquares`, performing linear regression to find the best-fit line through data points. Named after the Excel LINEST function.

## Examples

### Basic Usage

```expression
Result = LINEST([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])
// Returns: { slope: 2, intercept: 0, ... }
```

### Spreadsheet-Style Usage

```expression
// Similar to Excel LINEST
Regression = LINEST(IndependentData, DependentData)
```

## Use Cases

- **Spreadsheet compatibility**: Excel-like function
- **Trend analysis**: Linear trends
- **Forecasting**: Project values

## Related Functions

- [leastsquares](./leastsquares.md) - Same function, different name
- [polynomialregression](./polynomialregression.md) - Higher-order regression
- [predict](./predict.md) - Predict using results

## Notes

- Alias for `leastsquares`
- Excel-compatible naming
- Uses the Math service's `leastSquares` method
