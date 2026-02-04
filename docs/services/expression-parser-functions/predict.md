# predict

Predicts a value using polynomial regression coefficients.

## Syntax

```
predict(coefficients, xValue)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `coefficients` | Array | Polynomial coefficients from regression |
| `xValue` | Number | X value to predict for |

## Returns

String - The predicted y-value.

## Description

The `predict` function uses polynomial coefficients (from polynomialregression or similar) to calculate the predicted y-value for a given x-value.

## Examples

### Basic Usage

```expression
// Using linear coefficients [intercept, slope]
Coefficients = [10, 2]  // y = 2x + 10
Predicted = PREDICT(Coefficients, 5)
// Result: "20" (2*5 + 10)
```

### With Regression Results

```expression
// First fit the data
Coeffs = POLYNOMIALREGRESSION(XData, YData, 2)
// Then predict new values
FutureValue = PREDICT(Coeffs, NewX)
```

### Forecasting

```expression
// Predict future sales
TrendCoeffs = POLYNOMIALREGRESSION(Months, Sales, 1)
NextMonthSales = PREDICT(TrendCoeffs, NextMonth)
```

## Use Cases

- **Forecasting**: Predict future values
- **Interpolation**: Estimate values between data points
- **Extrapolation**: Project beyond data range
- **Modeling**: Apply regression models

## Related Functions

- [polynomialregression](./polynomialregression.md) - Generate coefficients
- [leastsquares](./leastsquares.md) - Linear regression
- [linest](./linest.md) - Linear estimation

## Notes

- Uses polynomial evaluation
- Works with any degree polynomial
- Uses the Math service's `predict` method
