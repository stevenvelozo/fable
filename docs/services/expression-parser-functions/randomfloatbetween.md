# randomfloatbetween

Generates a random floating-point number between two values.

## Syntax

```
randomfloatbetween(min, max)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | Number | Minimum value |
| `max` | Number | Maximum value |

## Returns

String - A random floating-point number between min and max.

## Description

The `randomfloatbetween` function generates a random decimal number within a specified range.

## Examples

### Basic Usage

```expression
Result = RANDOMFLOATBETWEEN(1.0, 10.0)
// Result: "5.732" (random between 1 and 10)
```

### Temperature Range

```expression
RandomTemp = RANDOMFLOATBETWEEN(98.0, 99.5)
// Random body temperature
```

### Price Variation

```expression
RandomPrice = RANDOMFLOATBETWEEN(9.99, 19.99)
```

### Coordinate Generation

```expression
RandomLat = RANDOMFLOATBETWEEN(-90, 90)
RandomLng = RANDOMFLOATBETWEEN(-180, 180)
```

## Use Cases

- **Simulation**: Random values in realistic ranges
- **Testing**: Generate bounded decimal test data
- **Coordinates**: Random geographic coordinates
- **Pricing**: Random price generation

## Related Functions

- [randomfloat](./randomfloat.md) - Random decimal 0-1
- [randomfloatupto](./randomfloatupto.md) - Random decimal up to max
- [randomintegerbetween](./randomintegerbetween.md) - Random integer in range

## Notes

- Returns result as string
- Uses the DataGeneration service
- Includes decimal precision
