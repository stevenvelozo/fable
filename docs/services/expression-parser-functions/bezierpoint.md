# bezierpoint

Evaluates a point on a cubic Bezier curve at a given parameter t.

## Syntax

```
bezierpoint(p0, p1, p2, p3, t)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `p0` | Number/String | Start point |
| `p1` | Number/String | First control point |
| `p2` | Number/String | Second control point |
| `p3` | Number/String | End point |
| `t` | Number/String | Parameter value (0 to 1) |

## Returns

String - The computed point on the cubic Bezier curve at parameter t.

## Description

The `bezierpoint` function evaluates the cubic Bezier curve defined by four control points at a given parameter value t. When t=0 the result is the start point, when t=1 the result is the end point, and values in between trace the curve.

## Examples

### Basic Usage

```expression
Result = bezierpoint(0, 0.25, 0.75, 1, 0.5)
// Evaluate midpoint of a cubic Bezier curve
```

### Endpoint Values

```expression
Start = bezierpoint(10, 20, 80, 100, 0)
// Result: "10" (t=0 returns start point)

End = bezierpoint(10, 20, 80, 100, 1)
// Result: "100" (t=1 returns end point)
```

## Related Functions

- [beziercurvefit](./beziercurvefit.md) - Fit a cubic Bezier curve to data points

## Notes

- Uses the Math service's `bezierPoint` method internally
- Parameter t should be between 0 and 1
