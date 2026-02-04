# randomintegerbetween

Generates a random integer between two values (inclusive).

## Syntax

```
randomintegerbetween(min, max)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | Number | Minimum value (inclusive) |
| `max` | Number | Maximum value (inclusive) |

## Returns

String - A random integer between min and max.

## Description

The `randomintegerbetween` function generates a random integer within a specified range, including both the minimum and maximum values.

## Examples

### Basic Usage

```expression
Result = RANDOMINTEGERBETWEEN(1, 10)
// Result: "7" (random between 1 and 10)
```

### Dice Roll

```expression
DiceRoll = RANDOMINTEGERBETWEEN(1, 6)
// Result: "4" (simulates rolling a die)
```

### Random Selection Index

```expression
// Select random item from list of 5 items
Index = RANDOMINTEGERBETWEEN(0, 4)
```

### Random Age in Range

```expression
RandomAge = RANDOMINTEGERBETWEEN(18, 65)
```

## Use Cases

- **Games**: Dice rolls, card draws
- **Testing**: Generate bounded random values
- **Sampling**: Random selection from range
- **Simulation**: Random parameters

## Related Functions

- [randominteger](./randominteger.md) - Unbounded random integer
- [randomintegerupto](./randomintegerupto.md) - Random integer from 0 to max
- [randomfloatbetween](./randomfloatbetween.md) - Random decimal in range

## Notes

- Both min and max are inclusive
- Returns result as string
- Uses the DataGeneration service
