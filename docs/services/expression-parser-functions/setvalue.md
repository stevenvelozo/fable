# setvalue

Sets a value in application state or services (AppData, etc.).

## Syntax

```
setvalue(address, value)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | String | The address path to set (e.g. `"AppData.Users[0].Name"`) |
| `value` | Any | The value to set at the given address |

## Returns

The value that was set.

## Description

The `setvalue` function writes a value to an internal application state address. It is the counterpart to `getvalue`. The address is resolved using Manyfest path notation, allowing deep property access including array indexing.

## Examples

### Basic Usage

```expression
setvalue("AppData.CurrentUser", "Alice")
// Sets fable.AppData.CurrentUser to "Alice"
```

### With Computed Values

```expression
setvalue("AppData.Total", X + Y)
// With X=10, Y=20: sets AppData.Total to "30"
```

### Array Access

```expression
setvalue("AppData.Items[0].Price", 29.99)
```

## Related Functions

- [getvalue](./getvalue.md) - Get value from application state

## Notes

- The first parameter is treated as an address string and resolved internally
- Uses the Utility service's `setInternalValueByHash` method
