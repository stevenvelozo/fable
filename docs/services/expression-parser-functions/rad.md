# rad

Converts degrees to radians.

## Syntax

```
rad(degrees)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `degrees` | Number/String | The angle in degrees |

## Returns

String - The angle converted to radians.

## Description

The `rad` function converts an angle from degrees to radians. This is necessary because the trigonometric functions (`sin`, `cos`, `tan`) expect angles in radians.

The conversion formula is: radians = degrees × (π / 180)

## Examples

### Basic Usage

```expression
Result = rad(180)
// Result: "3.14159265358979..." (π)

Result = rad(90)
// Result: "1.5707963267948966..." (π/2)

Result = rad(360)
// Result: "6.28318530717958..." (2π)
```

### With Trigonometric Functions

```expression
// Sine of 60 degrees
Result = sin(rad(60))
// Result: "0.8660254037844386"

// Cosine of 45 degrees
Result = cos(rad(45))
// Result: "0.7071067811865476"
```

### Common Angle Conversions

```expression
rad(0)    // 0
rad(30)   // π/6 ≈ 0.5236
rad(45)   // π/4 ≈ 0.7854
rad(60)   // π/3 ≈ 1.0472
rad(90)   // π/2 ≈ 1.5708
rad(180)  // π ≈ 3.1416
rad(270)  // 3π/2 ≈ 4.7124
rad(360)  // 2π ≈ 6.2832
```

## Use Cases

- **Trigonometry**: Converting user-friendly degree inputs to radians
- **Graphics**: Rotation calculations
- **Physics**: Angular motion calculations
- **Engineering**: Angle-based computations

## Related Functions

- [sin](./sin.md) - Sine (requires radians)
- [cos](./cos.md) - Cosine (requires radians)
- [tan](./tan.md) - Tangent (requires radians)
- [pi](./pi.md) - Pi constant

## Notes

- Uses arbitrary precision arithmetic
- The result is (degrees × π / 180)
- Essential for using trig functions with degree-based inputs
