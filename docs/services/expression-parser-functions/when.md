# when

Performs a truthy check and returns one of two values.

## Syntax

```
when(checkValue, onTrue)
when(checkValue, onTrue, onFalse)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `checkValue` | Any | required | Value to check for truthiness |
| `onTrue` | Any | required | Value returned if truthy |
| `onFalse` | Any | `""` | Value returned if falsy |

## Returns

The `onTrue` value if `checkValue` is truthy, otherwise `onFalse`.

## Description

The `when` function provides a simpler conditional than `if` - it just checks if a value is "truthy" (exists and has content) and returns one of two values accordingly.

### Falsy Values

The following are considered falsy:
- `false`, `null`, `undefined`, `0`, `""`
- Empty arrays `[]`
- Empty objects `{}`

## Examples

### Basic Truthy Check

```expression
Name = When(AppData.Cities[0].city, AppData.Cities[0].city)
// If city exists and is truthy, return the city name
// Result: "New York"
```

### With Default Value

```expression
// Returns empty string when value is missing
Overrun = When(AppData.Cities[10000000].city, AppData.Cities[10000000].city)
// Result: "" (index out of bounds, so falsy)
```

### Combining with Other Functions

```expression
EstimatedCompletionDate = ResolveHtmlEntities(When(AppData.ECDMonth, Join("&comma; ", AppData.ECDMonth, AppData.ECDYear)))
// With ECDMonth="January", ECDYear="2023"
// Result: "January, 2023"
```

### Conditional Display

```expression
// Show value if exists, otherwise show placeholder
DisplayValue = When(UserInput, UserInput, "Not specified")
```

## Comparison with IF

| `when` | `if` |
|--------|------|
| Checks truthiness | Compares two values |
| 2-3 parameters | 5 parameters |
| Simpler syntax | More flexible |
| No operators needed | Requires operator |

```expression
// These are similar:
When(Value, "yes", "no")
If(Value, "==", "", "no", "yes")  // Inverted logic
```

## Use Cases

- **Null checking**: Provide defaults for missing values
- **Conditional display**: Show/hide content based on data presence
- **Safe property access**: Return fallback when property doesn't exist
- **Template logic**: Conditional content rendering

## Related Functions

- [if](./if.md) - Full conditional comparison

## Notes

- Empty arrays and objects are considered falsy
- The third parameter (`onFalse`) defaults to empty string if not provided
- Works with the Logic service's `when` method
