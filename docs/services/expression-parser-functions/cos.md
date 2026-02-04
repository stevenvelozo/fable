# cos

Calculates the cosine of an angle (in radians).

## Syntax

```
cos(radians)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `radians` | Number/String | The angle in radians |

## Returns

String - The cosine of the angle.

## Description

The `cos` function calculates the cosine of an angle. The input must be in radians. Use the `rad()` function to convert degrees to radians if needed.

## Examples

### Basic Usage

```expression
Result = cos(0)
// Result: "1"

Result = cos(3.14159265358979)  // π
// Result: "-1" (approximately)
```

### Converting from Degrees

```expression
// Cosine of 60 degrees
Result = cos(rad(60))
// Result: "0.5"

// Cosine of 90 degrees
Result = cos(rad(90))
// Result: "0" (approximately)
```

### In Expressions

```expression
// Circle point calculations
X = Radius * cos(Angle)
Y = Radius * sin(Angle)
```

## Use Cases

- **Trigonometry**: Triangle calculations, angle computations
- **Graphics**: Rotation matrices, 3D transformations
- **Physics**: Projectile motion (horizontal component)
- **Engineering**: Phase calculations in AC circuits

## Related Functions

- [sin](./sin.md) - Sine
- [tan](./tan.md) - Tangent
- [rad](./rad.md) - Convert degrees to radians
- [pi](./pi.md) - Pi constant

## Notes

- Input must be in radians, not degrees
- Use `rad(degrees)` to convert from degrees
- Uses JavaScript's `Math.cos()` internally
