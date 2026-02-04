# polynomialregression

Fits a polynomial curve to data points.

## Syntax

```
polynomialregression(xValues, yValues, degree)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `xValues` | Array | Array of x-coordinates |
| `yValues` | Array | Array of y-coordinates |
| `degree` | Number | Degree of polynomial to fit |

## Returns

Array - Coefficients of the fitted polynomial.

## Description

The `polynomialregression` function fits a polynomial of specified degree to a set of data points using least squares regression. Returns the coefficients of the polynomial.

## Examples

### Linear Fit (Degree 1)

```expression
// Fit a line: y = mx + b
Coefficients = POLYNOMIALREGRESSION([1, 2, 3, 4, 5], [2, 4, 5, 4, 5], 1)
// Returns [intercept, slope]
```

### Quadratic Fit (Degree 2)

```expression
// Fit a parabola: y = ax² + bx + c
Coefficients = POLYNOMIALREGRESSION(XData, YData, 2)
// Returns [c, b, a]
```

### Higher Degree

```expression
// Fit cubic polynomial
CubicCoeffs = POLYNOMIALREGRESSION(XValues, YValues, 3)
```

## Use Cases

- **Trend analysis**: Fit curves to data
- **Prediction**: Extrapolate from data
- **Curve fitting**: Model relationships
- **Scientific analysis**: Data modeling

## Related Functions

- [leastsquares](./leastsquares.md) - Linear least squares
- [predict](./predict.md) - Predict using coefficients
- [linest](./linest.md) - Linear estimation

## Notes

- Higher degrees may overfit data
- Returns array of coefficients
- Uses the Math service's `polynomialRegression` method
