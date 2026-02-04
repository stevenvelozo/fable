# randominteger

Generates a random integer.

## Syntax

```
randominteger()
```

## Parameters

None

## Returns

String - A random integer value.

## Description

The `randominteger` function generates a random integer. This is useful for creating random test data, unique identifiers, or implementing random selection.

## Examples

### Basic Usage

```expression
Result = RANDOMINTEGER()
// Result: "7342985621" (random each time)
```

### Random Selection

```expression
// Generate random index for array selection
Index = RANDOMINTEGER() % ArrayLength
```

## Use Cases

- **Test data**: Generate random values
- **Randomization**: Random selection
- **IDs**: Generate identifiers
- **Games**: Random number generation

## Related Functions

- [randomintegerbetween](./randomintegerbetween.md) - Random integer in range
- [randomintegerupto](./randomintegerupto.md) - Random integer up to max
- [randomfloat](./randomfloat.md) - Random decimal number

## Notes

- Returns result as string
- Uses the DataGeneration service
- Each call produces different result
