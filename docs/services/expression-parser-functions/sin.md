# sin

Calculates the sine of an angle (in radians).

## Syntax

```
sin(radians)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `radians` | Number/String | The angle in radians |

## Returns

String - The sine of the angle.

## Description

The `sin` function calculates the sine of an angle. The input must be in radians. Use the `rad()` function to convert degrees to radians if needed.

## Examples

### Basic Usage

```expression
Result = sin(0)
// Result: "0"

Result = sin(1.5707963267948966)  // π/2
// Result: "1" (approximately)
```

### Converting from Degrees

```expression
// Sine of 60 degrees
Result = sin(rad(60))
// Result: "0.8660254037844386"

// Sine of 90 degrees
Result = sin(rad(90))
// Result: "1"
```

### In Complex Expressions

```expression
// From unit tests
Result = sqrt(100 * (C + 30)) + sin(Depth - Width) / 10
// With C=-13, Depth=100.203, Width=10.5
// Result: "41.32965489638783839821"
```

### Waveform Calculations

```expression
// Simple harmonic motion
Position = Amplitude * sin(Frequency * Time + Phase)
```

## Use Cases

- **Trigonometry**: Triangle calculations
- **Physics**: Wave motion, oscillations, projectile motion
- **Graphics**: Rotation, animation
- **Engineering**: Signal processing, vibration analysis

## Related Functions

- [cos](./cos.md) - Cosine
- [tan](./tan.md) - Tangent
- [rad](./rad.md) - Convert degrees to radians
- [pi](./pi.md) - Pi constant

## Notes

- Input must be in radians, not degrees
- Use `rad(degrees)` to convert from degrees
- Uses JavaScript's `Math.sin()` internally
