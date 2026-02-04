# euler

Returns Euler's number (e) with high precision.

## Syntax

```
euler()
```

## Parameters

None.

## Returns

String - Euler's number (e) to 100 decimal places.

## Description

The `euler` function returns Euler's number (e ≈ 2.71828...), which is the base of natural logarithms. It's one of the most important constants in mathematics and appears in many areas including calculus, probability, and physics.

## Examples

### Basic Usage

```expression
Result = euler()
// Result: "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274..."
```

### Exponential Growth

```expression
// Compound interest with continuous compounding
// A = P * e^(rt)
FinalAmount = Principal * euler()^(Rate * Time)
```

### Natural Logarithm Calculations

```expression
// e^x where x = 1
Result = euler()^1
// Result: e ≈ 2.71828...

// From unit tests:
Result = 2.71828182845905 ^ -0.282444
```

### In Complex Formulas

```expression
// Environmental calculation from unit tests
EGS = ROUND(ROUND(0.0172834*2.71828182845905^(-0.0117685*Temp),5)*SQRT(ROUND(16.294-0.163*HR,1)/60),4)
```

## Use Cases

- **Exponential growth/decay**: Population growth, radioactive decay
- **Finance**: Continuous compound interest
- **Probability**: Normal distribution calculations
- **Calculus**: Natural logarithm and exponential functions
- **Physics**: Decay processes, thermodynamics

## Related Functions

- [pi](./pi.md) - Pi constant
- [exp](./exp.md) - e raised to a power
- [log](./log.md) - Logarithm

## Notes

- Returns the full precision value stored in the Math service
- Uses arbitrary precision arithmetic
- Also known as Napier's constant
- Approximately equal to 2.71828182845904523536...
