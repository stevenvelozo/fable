# generateguid

Generates a GUID string.

## Syntax

```
generateguid()
```

## Parameters

None

## Returns

String - A newly generated GUID, e.g. `'0x53c7c0bed0010000'`.

## Description

The `generateguid` function returns a unique identifier by delegating to `fable.getUUID()`. The underlying [UUID service](../uuid.md) uses the Snowflake ID pattern, encoding a timestamp together with the configured DataCenter and Worker IDs so that distributed processes can mint IDs without coordination.

Each call produces a new identifier.

## Examples

### Basic Usage

```expression
Result = GENERATEGUID()
// Result: "0x53c7c0bed0010000" (different each call)
```

### Tagging a Record

```expression
// Stamp a synthetic record with a fresh ID
RecordID = GENERATEGUID()
```

## Use Cases

- **Synthetic IDs**: Assign identifiers to records produced inside an expression
- **Test data**: Generate unique keys for fixtures and mocks
- **Correlation IDs**: Mint a trace/correlation token to thread through downstream calls

## Related Functions

- [randominteger](./randominteger.md) - Random integer (not guaranteed unique)

## Notes

- Returns the result as a string
- Backed by `fable.getUUID()` / the Fable UUID service ([details](../uuid.md))
- Configure DataCenter and Worker IDs via the `UUID` settings block on the Fable instance to keep IDs distinct across processes
- Each call produces a different value
