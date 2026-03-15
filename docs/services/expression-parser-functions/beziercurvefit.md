# beziercurvefit

Fits a cubic Bezier curve to a set of data points.

## Syntax

```
beziercurvefit(dataPoints)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `dataPoints` | Array | Array of numeric values to fit the curve to |

## Returns

Array - The four control points (P0, P1, P2, P3) of the fitted cubic Bezier curve.

## Description

The `beziercurvefit` function computes the four control points of a cubic Bezier curve that best fits the provided data points. This is useful for creating smooth curve approximations of discrete data.

## Examples

### Basic Usage

```expression
Curve = beziercurvefit(DataPoints)
// Returns array of 4 control points defining the fitted Bezier curve
```

### With FLATTEN

```expression
Curve = beziercurvefit(FLATTEN(AppData.Measurements[].value))
```

### Using Fitted Curve

```expression
// First fit the curve
ControlPoints = beziercurvefit(Data)

// Then evaluate points along the fitted curve
Point = bezierpoint(ENTRYINSET(ControlPoints, 0), ENTRYINSET(ControlPoints, 1), ENTRYINSET(ControlPoints, 2), ENTRYINSET(ControlPoints, 3), 0.5)
```

## Related Functions

- [bezierpoint](./bezierpoint.md) - Evaluate point on cubic Bezier curve
- [polynomialregression](./polynomialregression.md) - Polynomial curve fitting

## Notes

- Uses the Math service's `bezierCurveFit` method internally
