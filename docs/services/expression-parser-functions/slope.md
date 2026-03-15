# slope

Calculates the slope of a linear regression line from a set of X and Y values. Equivalent to Excel's SLOPE function.

## Syntax

```
slope(yValues, xValues)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `yValues` | Array | The dependent data points (Y values) |
| `xValues` | Array | The independent data points (X values) |

## Returns

String - The slope of the least-squares regression line through the data points.

## Description

The `slope` function computes the slope (m) of the best-fit linear regression line y = mx + b for a given set of data points. This is equivalent to Excel's SLOPE function. Uses arbitrary precision arithmetic.

## Examples

### Basic Usage

```expression
Result = slope(YValues, XValues)
// With YValues=[2, 4, 6, 8], XValues=[1, 2, 3, 4]
// Result: "2" (perfect linear relationship)
```

### With FLATTEN for Internal Data

```expression
Slope = slope(FLATTEN(AppData.Points[].y), FLATTEN(AppData.Points[].x))
```

## Related Functions

- [intercept](./intercept.md) - Y-intercept of linear regression line
- [linest](./linest.md) - Full least squares regression
- [polynomialregression](./polynomialregression.md) - Polynomial regression

## Notes

- Both arrays must have the same length
- Uses the Math service's `slopePrecise` method internally
