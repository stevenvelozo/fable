# pi

Returns the mathematical constant Pi (π) with high precision.

## Syntax

```
pi()
```

## Parameters

None.

## Returns

String - Pi to 100 decimal places.

## Description

The `pi` function returns the mathematical constant π (pi), which is the ratio of a circle's circumference to its diameter. The value is provided with 100 decimal places of precision.

## Examples

### Basic Usage

```expression
Result = pi()
// Result: "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679..."
```

### Circle Calculations

```expression
// Circumference of a circle
Circumference = 2 * pi() * Radius

// Area of a circle
Area = pi() * Radius^2
```

### Trigonometry

```expression
// Convert degrees to radians manually
Radians = Degrees * pi() / 180

// Or use the rad() function
Radians = rad(Degrees)
```

### With Trigonometric Functions

```expression
// Sine of 90 degrees (π/2 radians)
Result = sin(pi() / 2)
// Result: "1" (approximately)
```

## Use Cases

- **Circle geometry**: Circumference, area, arc length
- **Trigonometry**: Converting between degrees and radians
- **Physics**: Wave calculations, oscillations
- **Engineering**: Rotational calculations

## Related Functions

- [euler](./euler.md) - Euler's number (e)
- [rad](./rad.md) - Convert degrees to radians
- [sin](./sin.md), [cos](./cos.md), [tan](./tan.md) - Trigonometric functions

## Notes

- Returns the full precision value stored in the Math service
- Uses arbitrary precision arithmetic
- The value is constant and pre-computed
