# randomfloat

Generates a random floating-point number.

## Syntax

```
randomfloat()
```

## Parameters

None

## Returns

String - A random floating-point number between 0 and 1.

## Description

The `randomfloat` function generates a random decimal number, typically between 0 and 1. This is useful for probability calculations and generating random decimal values.

## Examples

### Basic Usage

```expression
Result = RANDOMFLOAT()
// Result: "0.7423589" (random each time)
```

### Probability Check

```expression
// 50% chance
Happened = RANDOMFLOAT() < 0.5
```

### Scale to Range

```expression
// Random value between 0 and 100
Scaled = RANDOMFLOAT() * 100
```

## Use Cases

- **Probability**: Random chance calculations
- **Simulation**: Monte Carlo simulations
- **Weighting**: Random weighted selection
- **Testing**: Generate decimal test data

## Related Functions

- [randomfloatbetween](./randomfloatbetween.md) - Random decimal in range
- [randomfloatupto](./randomfloatupto.md) - Random decimal up to max
- [randominteger](./randominteger.md) - Random whole number

## Notes

- Returns value between 0 and 1
- Returns result as string
- Uses the DataGeneration service
