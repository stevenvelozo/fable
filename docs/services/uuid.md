# UUID Service

The UUID service generates unique identifiers with optional DataCenter and Worker encoding, based on the Snowflake ID pattern.

## Access

```javascript
// Pre-initialized, available directly
fable.UUID
fable.getUUID()  // Convenience method
```

## Basic Usage

### Generate a UUID

```javascript
const uuid = fable.getUUID();
// Returns something like: '0x53c7c0bed0010000'

// Or via the service directly
const uuid = fable.UUID.getUUID();
```

## Configuration

Configure DataCenter and Worker IDs when creating Fable:

```javascript
const fable = new Fable({
    UUID: {
        DataCenter: 1,  // 0-31
        Worker: 5       // 0-31
    }
});
```

### DataCenter and Worker

- **DataCenter** (5 bits): Identifies the data center (0-31)
- **Worker** (5 bits): Identifies the worker/process within a data center (0-31)

This allows for distributed UUID generation without coordination.

## UUID Structure

The generated UUIDs are based on the Snowflake pattern:

```
| Timestamp (ms) | DataCenter | Worker | Sequence |
|     41 bits    |   5 bits   | 5 bits | 12 bits  |
```

- **Timestamp**: Milliseconds since epoch
- **DataCenter**: Data center identifier (0-31)
- **Worker**: Worker identifier (0-31)
- **Sequence**: Sequence number for same-millisecond generation (0-4095)

## Use Cases

### Database Primary Keys

```javascript
const user = {
    id: fable.getUUID(),
    name: 'John Doe',
    email: 'john@example.com'
};
```

### Request Tracing

```javascript
const requestId = fable.getUUID();
fable.log.info('Processing request', { requestId });

// Pass through the system
response.setHeader('X-Request-ID', requestId);
```

### Distributed Systems

Configure each node with unique DataCenter/Worker:

```javascript
// Node 1 (DC 0, Worker 0)
const fable1 = new Fable({ UUID: { DataCenter: 0, Worker: 0 } });

// Node 2 (DC 0, Worker 1)
const fable2 = new Fable({ UUID: { DataCenter: 0, Worker: 1 } });

// Node 3 (DC 1, Worker 0)
const fable3 = new Fable({ UUID: { DataCenter: 1, Worker: 0 } });

// All nodes can generate UUIDs without collision
```

### Session IDs

```javascript
function createSession(userId) {
    return {
        sessionId: fable.getUUID(),
        userId: userId,
        createdAt: new Date()
    };
}
```

### File Names

```javascript
const uniqueFileName = `upload_${fable.getUUID()}.jpg`;
```

## Properties

### DataCenter ID

```javascript
fable.UUID.datacenter  // Current DataCenter ID
```

### Worker ID

```javascript
fable.UUID.worker  // Current Worker ID
```

## Best Practices

1. **Configure in production**: Set unique DataCenter/Worker IDs for distributed deployments
2. **Use for primary keys**: UUID generation is fast enough for most use cases
3. **Store as strings**: The hex format works well as database keys
4. **Log request IDs**: Include UUIDs in logs for traceability

## Comparison with Other UUID Formats

| Format | Example | Size |
|--------|---------|------|
| Fable UUID | `0x53c7c0bed0010000` | 18 chars |
| UUID v4 | `550e8400-e29b-41d4-a716-446655440000` | 36 chars |
| ULID | `01ARZ3NDEKTSV4RRFFQ69G5FAV` | 26 chars |

Fable UUIDs are:
- Time-ordered (sortable by creation time)
- Compact (18 characters)
- Collision-free across distributed systems (with proper DataCenter/Worker config)

## Migration from Other UUID Systems

If migrating from UUID v4 or other formats:

```javascript
// Continue supporting both formats
function isValidId(id) {
    return id.startsWith('0x') || /^[0-9a-f-]{36}$/i.test(id);
}

// Generate new IDs with Fable
const newId = fable.getUUID();
```
