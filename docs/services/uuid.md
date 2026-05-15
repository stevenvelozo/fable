# UUID Service

The UUID service generates unique identifiers with optional DataCenter and Worker encoding, based on the Snowflake ID pattern.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

// Pre-initialized, available directly
console.log('fable.UUID:',      typeof fable.UUID);
console.log('fable.getUUID():', fable.getUUID());  // Convenience method
```

## Basic Usage

### Generate a UUID

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

const uuid = fable.getUUID();
console.log('uuid (via convenience):', uuid);
// Returns something like: '0x53c7c0bed0010000'

// Or via the service directly
const uuidDirect = fable.UUID.getUUID();
console.log('uuid (via service):', uuidDirect);
```

## Configuration

Configure DataCenter and Worker IDs when creating Fable:

```javascript
const libFable = require('fable');
const fable = new libFable({
    UUID: {
        DataCenter: 1,  // 0-31
        Worker: 5       // 0-31
    }
});
console.log('DataCenter:', fable.UUID.datacenter, 'Worker:', fable.UUID.worker);
console.log('Sample UUID:', fable.getUUID());
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
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

const user = {
    id: fable.getUUID(),
    name: 'John Doe',
    email: 'john@example.com'
};
console.log('user:', user);
```

### Request Tracing

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

const requestId = fable.getUUID();
fable.log.info('Processing request', { requestId });

// Pass through the system (stubbed response object for playground demo)
const response = { _headers: {}, setHeader(name, value) { this._headers[name] = value; } };
response.setHeader('X-Request-ID', requestId);
console.log('response headers:', response._headers);
```

### Distributed Systems

Configure each node with unique DataCenter/Worker:

```javascript
const libFable = require('fable');

// Node 1 (DC 0, Worker 0)
const fable1 = new libFable({ UUID: { DataCenter: 0, Worker: 0 } });

// Node 2 (DC 0, Worker 1)
const fable2 = new libFable({ UUID: { DataCenter: 0, Worker: 1 } });

// Node 3 (DC 1, Worker 0)
const fable3 = new libFable({ UUID: { DataCenter: 1, Worker: 0 } });

// All nodes can generate UUIDs without collision
console.log('Node 1 UUID:', fable1.getUUID());
console.log('Node 2 UUID:', fable2.getUUID());
console.log('Node 3 UUID:', fable3.getUUID());
```

### Session IDs

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

function createSession(userId) {
    return {
        sessionId: fable.getUUID(),
        userId: userId,
        createdAt: new Date()
    };
}

console.log('session:', createSession('user-42'));
```

### File Names

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

const uniqueFileName = `upload_${fable.getUUID()}.jpg`;
console.log('uniqueFileName:', uniqueFileName);
```

## Properties

### DataCenter ID

```javascript
const libFable = require('fable');
const fable = new libFable({ UUID: { DataCenter: 3, Worker: 7 } });

console.log('Current DataCenter ID:', fable.UUID.datacenter);
```

### Worker ID

```javascript
const libFable = require('fable');
const fable = new libFable({ UUID: { DataCenter: 3, Worker: 7 } });

console.log('Current Worker ID:', fable.UUID.worker);
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
const libFable = require('fable');
const fable = new libFable({ Product: 'UUIDDemo', ProductVersion: '1.0.0' });

// Continue supporting both formats
function isValidId(id) {
    return id.startsWith('0x') || /^[0-9a-f-]{36}$/i.test(id);
}

// Generate new IDs with Fable
const newId = fable.getUUID();
console.log('newId:', newId, '-> isValidId:', isValidId(newId));

// Check a legacy UUID v4 string as well
const legacy = '550e8400-e29b-41d4-a716-446655440000';
console.log('legacy:', legacy, '-> isValidId:', isValidId(legacy));
```
