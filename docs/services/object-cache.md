# ObjectCache Service

The ObjectCache service (powered by [cachetrax](https://github.com/stevenvelozo/cachetrax)) provides in-memory object caching with size-based and time-based expiration, backed by a linked list for efficient eviction.

## Access

```javascript
// On-demand service - instantiate when needed
const cache = fable.instantiateServiceProvider('ObjectCache');

// Create named caches for different purposes
const userCache = fable.instantiateServiceProvider('ObjectCache', {}, 'user-cache');
const sessionCache = fable.instantiateServiceProvider('ObjectCache', {}, 'session-cache');
```

## Basic Operations

### Put (Add or Update)

```javascript
cache.put('some-data', 'my-key');
// Stores 'some-data' with hash 'my-key'
// If 'my-key' already exists, updates the stored datum

cache.put({ name: 'John', age: 30 }, 'user-123');
// Stores an object with hash 'user-123'
```

### Read

```javascript
const data = cache.read('my-key');
// Returns the stored datum, or false if not found
```

### Expire (Remove)

```javascript
cache.expire('my-key');
// Removes the entry from the cache and returns the removed node
// Returns false if the key doesn't exist
```

### Touch (Refresh)

```javascript
cache.touch('my-key');
// Moves the entry to the tail of the list and resets its timestamp
// Useful for keeping frequently accessed items fresh
```

## Size-Based Expiration

### maxLength

Set `maxLength` to automatically evict the oldest entry when the cache exceeds the limit:

```javascript
cache.maxLength = 2;

cache.put('A', 'ABC');
cache.put('D', 'DEF');
// Cache: [ABC, DEF] (length 2)

cache.put('G', 'GHI');
// ABC is automatically evicted
// Cache: [DEF, GHI] (length 2)
```

Setting `maxLength` to `0` (the default) disables automatic size-based eviction on insert. To enforce a new smaller `maxLength` on existing entries, call `prune()`.

## Time-Based Expiration

### maxAge

Set `maxAge` (in milliseconds) to expire entries older than the specified age when `prune()` is called:

```javascript
cache.maxAge = 60000; // 1 minute
```

## Pruning

### prune(callback)

Prune the cache based on both `maxAge` and `maxLength` rules. Expired entries are removed first, then size limits are enforced:

```javascript
cache.maxLength = 2;

// After adding many entries...
cache.prune((removedRecords) => {
    console.log(`Pruned ${removedRecords.length} entries`);
    // Cache is now within maxLength
});
```

### pruneBasedOnExpiration(callback, removedRecords)

Prune only entries older than `maxAge`:

```javascript
cache.maxAge = 30000; // 30 seconds
cache.pruneBasedOnExpiration((removed) => {
    console.log(`Expired ${removed.length} old entries`);
});
```

### pruneBasedOnLength(callback, removedRecords)

Prune only based on `maxLength`, popping entries from the head (oldest) of the list:

```javascript
cache.pruneBasedOnLength((removed) => {
    console.log(`Evicted ${removed.length} entries for length`);
});
```

### pruneCustom(callback, pruneFunction, removedRecords)

Prune entries using a custom function. The function receives `(datum, hash, node)` and should return `true` to expire the entry:

```javascript
cache.pruneCustom(
    (removed) => { console.log(`Custom pruned ${removed.length}`); },
    (datum, hash, node) => {
        // Expire entries where datum starts with 'temp'
        return typeof datum === 'string' && datum.startsWith('temp');
    }
);
```

## Low-Level Access

### getNode(hash)

Get the full linked list node (including metadata) for a hash:

```javascript
const node = cache.getNode('my-key');
// node.Datum — the stored data
// node.Hash — the hash key
// node.Metadata.Created — timestamp (ms) when the entry was created
```

### RecordMap

Access the record map directly (a plain object mapping hashes to data):

```javascript
const allRecords = cache.RecordMap;
// { 'my-key': 'some-data', 'user-123': { name: 'John', age: 30 } }
```

### Internal List

The cache is backed by a linked list accessible via `cache._List`:

```javascript
cache._List.length  // Number of entries in the cache
cache._List.head    // First (oldest) node
cache._List.tail    // Last (newest) node
```

## Notes

- Cache is in-memory only; data is lost on restart
- `maxLength` of `0` means no automatic size limit
- `maxAge` of `0` means no automatic time-based expiration
- Automatic eviction on `put()` only removes one entry at a time; use `prune()` for bulk cleanup
- Each node tracks its creation time in `node.Metadata.Created`
