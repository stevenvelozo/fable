# intercept

Calculates the Y-intercept of a linear regression line from a set of X and Y values. Equivalent to Excel's INTERCEPT function.

## Syntax

```
intercept(yValues, xValues)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `yValues` | Array | The dependent data points (Y values) |
| `xValues` | Array | The independent data points (X values) |

## Returns

String - The Y-intercept (b) of the least-squares regression line through the data points.

## Description

The `intercept` function computes the Y-intercept (b) of the best-fit linear regression line y = mx + b for a given set of data points. This is equivalent to Excel's INTERCEPT function. Uses arbitrary precision arithmetic.

## Examples

### Basic Usage

```expression
Result = intercept(YValues, XValues)
// With YValues=[2, 4, 6, 8], XValues=[1, 2, 3, 4]
// Result: "0" (line passes through origin)
```

### With FLATTEN for Internal Data

```expression
YIntercept = intercept(FLATTEN(AppData.Points[].y), FLATTEN(AppData.Points[].x))
```

### Combined with Slope

```expression
// Compute full regression: y = slope * x + intercept
M = slope(YValues, XValues)
B = intercept(YValues, XValues)
```

## Related Functions

- [slope](./slope.md) - Slope of linear regression line
- [linest](./linest.md) - Full least squares regression
- [predict](./predict.md) - Predict from regression model

## Notes

- Both arrays must have the same length
- Uses the Math service's `interceptPrecise` method internally
