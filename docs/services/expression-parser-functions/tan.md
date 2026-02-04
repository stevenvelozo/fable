# tan

Calculates the tangent of an angle (in radians).

## Syntax

```
tan(radians)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `radians` | Number/String | The angle in radians |

## Returns

String - The tangent of the angle.

## Description

The `tan` function calculates the tangent of an angle, which equals sin(angle)/cos(angle). The input must be in radians. Use the `rad()` function to convert degrees to radians if needed.

## Examples

### Basic Usage

```expression
Result = tan(0)
// Result: "0"

Result = tan(0.7853981633974483)  // π/4 (45 degrees)
// Result: "1" (approximately)
```

### Converting from Degrees

```expression
// Tangent of 45 degrees
Result = tan(rad(45))
// Result: "1"

// Tangent of 30 degrees
Result = tan(rad(30))
// Result: "0.5773502691896257"
```

### Slope Calculations

```expression
// Calculate slope from angle
Slope = tan(rad(AngleDegrees))

// Rise over run
Rise = Run * tan(Angle)
```

## Use Cases

- **Trigonometry**: Slope and angle calculations
- **Surveying**: Elevation changes
- **Physics**: Incline problems
- **Graphics**: Perspective calculations

## Related Functions

- [sin](./sin.md) - Sine
- [cos](./cos.md) - Cosine
- [rad](./rad.md) - Convert degrees to radians
- [pi](./pi.md) - Pi constant

## Notes

- Input must be in radians, not degrees
- Use `rad(degrees)` to convert from degrees
- Tangent is undefined at 90°, 270°, etc. (π/2, 3π/2, ...)
- Uses JavaScript's `Math.tan()` internally
