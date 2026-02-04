# leastsquares

Performs linear least squares regression.

## Syntax

```
leastsquares(xValues, yValues)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `xValues` | Array | Array of x-coordinates (independent variable) |
| `yValues` | Array | Array of y-coordinates (dependent variable) |

## Returns

Object - Regression results including slope, intercept, and statistics.

## Description

The `leastsquares` function performs linear regression to find the best-fit line through a set of data points. It returns the slope, intercept, and other statistical measures.

## Examples

### Basic Usage

```expression
Result = LEASTSQUARES([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])
// Returns: { slope: 2, intercept: 0, ... }
```

### Sales Trend

```expression
// Analyze sales trend over time
SalesTrend = LEASTSQUARES(Months, SalesData)
```

### Temperature Analysis

```expression
TempRegression = LEASTSQUARES(Years, AvgTemperatures)
// slope indicates rate of change
```

## Use Cases

- **Trend analysis**: Find linear trends
- **Forecasting**: Project future values
- **Correlation**: Measure linear relationship
- **Scientific analysis**: Linear modeling

## Related Functions

- [linest](./linest.md) - Alternative linear estimation
- [polynomialregression](./polynomialregression.md) - Higher-order regression
- [predict](./predict.md) - Predict using regression results

## Notes

- Also available as `linest`
- Returns comprehensive statistics
- Uses the Math service's `leastSquares` method
