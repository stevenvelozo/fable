# randomfloatupto

Generates a random floating-point number from 0 up to a maximum value.

## Syntax

```
randomfloatupto(max)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `max` | Number | Maximum value |

## Returns

String - A random floating-point number from 0 to max.

## Description

The `randomfloatupto` function generates a random decimal number starting from 0 up to the specified maximum value.

## Examples

### Basic Usage

```expression
Result = RANDOMFLOATUPTO(100.0)
// Result: "47.832" (random between 0 and 100)
```

### Random Percentage

```expression
RandomPercent = RANDOMFLOATUPTO(100)
// Random percentage with decimals
```

### Random Duration

```expression
RandomSeconds = RANDOMFLOATUPTO(60)
// Random duration up to 1 minute
```

## Use Cases

- **Scaling**: Random values up to a limit
- **Percentages**: Random percent with decimals
- **Time**: Random durations
- **Testing**: Bounded decimal test data

## Related Functions

- [randomfloat](./randomfloat.md) - Random decimal 0-1
- [randomfloatbetween](./randomfloatbetween.md) - Random decimal in range
- [randomintegerupto](./randomintegerupto.md) - Random integer up to max

## Notes

- Starts from 0
- Returns result as string
- Uses the DataGeneration service
