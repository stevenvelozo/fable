# randomintegerupto

Generates a random integer from 0 up to a maximum value.

## Syntax

```
randomintegerupto(max)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `max` | Number | Maximum value (exclusive or inclusive based on implementation) |

## Returns

String - A random integer from 0 to max.

## Description

The `randomintegerupto` function generates a random integer starting from 0 up to the specified maximum value. This is useful for array indexing and random selection from lists.

## Examples

### Basic Usage

```expression
Result = RANDOMINTEGERUPTO(100)
// Result: "42" (random between 0 and 100)
```

### Array Index Selection

```expression
// Select random index for 10-element array
Index = RANDOMINTEGERUPTO(10)
```

### Percentage Simulation

```expression
RandomPercent = RANDOMINTEGERUPTO(100)
```

## Use Cases

- **Array indexing**: Random element selection
- **Percentages**: Random percentage values
- **Simulation**: Random values from zero
- **Testing**: Generate test indices

## Related Functions

- [randominteger](./randominteger.md) - Unbounded random integer
- [randomintegerbetween](./randomintegerbetween.md) - Random integer in range
- [randomfloatupto](./randomfloatupto.md) - Random decimal up to max

## Notes

- Starts from 0
- Returns result as string
- Uses the DataGeneration service
