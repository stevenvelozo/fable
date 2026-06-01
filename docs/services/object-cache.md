# ObjectCache Service

The ObjectCache service (powered by [cachetrax](https://fable-retold.github.io/cachetrax/)) provides in-memory object caching with size-based and time-based expiration, backed by a linked list for efficient eviction.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const cache = fable.instantiateServiceProvider('ObjectCache');
console.log('cache:', typeof cache);

// Create named caches for different purposes
const userCache    = fable.instantiateServiceProvider('ObjectCache', {}, 'user-cache');
const sessionCache = fable.instantiateServiceProvider('ObjectCache', {}, 'session-cache');
console.log('userCache and sessionCache instantiated:', typeof userCache, typeof sessionCache);
```

## Basic Operations

### Put (Add or Update)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('some-data', 'my-key');
// Stores 'some-data' with hash 'my-key'
// If 'my-key' already exists, updates the stored datum

cache.put({ name: 'John', age: 30 }, 'user-123');
// Stores an object with hash 'user-123'

console.log('my-key:',   cache.read('my-key'));
console.log('user-123:', cache.read('user-123'));
```

### Read

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('some-data', 'my-key');
const data = cache.read('my-key');
console.log('data:', data);
// Returns the stored datum, or false if not found
```

### Expire (Remove)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('some-data', 'my-key');
console.log(cache.expire('my-key'));
// Removes the entry from the cache and returns the removed node
// Returns false if the key doesn't exist
console.log('After expire - read:', cache.read('my-key'));
```

### Touch (Refresh)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('some-data', 'my-key');
cache.touch('my-key');
// Moves the entry to the tail of the list and resets its timestamp
// Useful for keeping frequently accessed items fresh
console.log('after touch - my-key still present:', cache.read('my-key'));
```

## Size-Based Expiration

### maxLength

Set `maxLength` to automatically evict the oldest entry when the cache exceeds the limit:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.maxLength = 2;

cache.put('A', 'ABC');
cache.put('D', 'DEF');
console.log('After two puts:', Object.keys(cache.RecordMap));

cache.put('G', 'GHI');
// ABC is automatically evicted
console.log('After third put (evicts oldest):', Object.keys(cache.RecordMap));
```

Setting `maxLength` to `0` (the default) disables automatic size-based eviction on insert. To enforce a new smaller `maxLength` on existing entries, call `prune()`.

## Time-Based Expiration

### maxAge

Set `maxAge` (in milliseconds) to expire entries older than the specified age when `prune()` is called:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.maxAge = 60000; // 1 minute
console.log('cache.maxAge:', cache.maxAge);
```

## Pruning

### prune(callback)

Prune the cache based on both `maxAge` and `maxLength` rules. Expired entries are removed first, then size limits are enforced:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.maxLength = 2;

// After adding many entries...
for (let i = 0; i < 5; i++) cache.put('value-' + i, 'key-' + i);

cache.prune((removedRecords) => {
    console.log(`Pruned ${removedRecords.length} entries`);
    // Cache is now within maxLength
});
```

### pruneBasedOnExpiration(callback, removedRecords)

Prune only entries older than `maxAge`:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('fresh', 'recent-key');
cache.maxAge = 30000; // 30 seconds
cache.pruneBasedOnExpiration((removed) => {
    console.log(`Expired ${removed.length} old entries`);
});
```

### pruneBasedOnLength(callback, removedRecords)

Prune only based on `maxLength`, popping entries from the head (oldest) of the list:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.maxLength = 2;
for (let i = 0; i < 5; i++) cache.put('v-' + i, 'k-' + i);
cache.pruneBasedOnLength((removed) => {
    console.log(`Evicted ${removed.length} entries for length`);
});
```

### pruneCustom(callback, pruneFunction, removedRecords)

Prune entries using a custom function. The function receives `(datum, hash, node)` and should return `true` to expire the entry:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('temp-A', 'key-1');
cache.put('keep-me', 'key-2');
cache.put('temp-B', 'key-3');

cache.pruneCustom(
    (removed) => { console.log(`Custom pruned ${removed.length}`); },
    (datum, hash, node) => {
        // Expire entries where datum starts with 'temp'
        return typeof datum === 'string' && datum.startsWith('temp');
    }
);
console.log('Remaining keys:', Object.keys(cache.RecordMap));
```

## Low-Level Access

### getNode(hash)

Get the full linked list node (including metadata) for a hash:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('some-data', 'my-key');
const node = cache.getNode('my-key');
console.log('node.Datum:',            node.Datum);
console.log('node.Hash:',             node.Hash);
console.log('node.Metadata.Created:', node.Metadata.Created);
```

### RecordMap

Access the record map directly (a plain object mapping hashes to data):

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('some-data', 'my-key');
cache.put({ name: 'John', age: 30 }, 'user-123');
const allRecords = cache.RecordMap;
console.log('allRecords:', allRecords);
```

### Internal List

The cache is backed by a linked list accessible via `cache._List`:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'ObjectCacheDemo', ProductVersion: '1.0.0' });
const cache = fable.instantiateServiceProvider('ObjectCache');

cache.put('A', 'a-key');
cache.put('B', 'b-key');

console.log('length:',     cache._List.length);  // Number of entries in the cache
console.log('head.Datum:', cache._List.head ? cache._List.head.Datum : null);
console.log('tail.Datum:', cache._List.tail ? cache._List.tail.Datum : null);
```

## Notes

- Cache is in-memory only; data is lost on restart
- `maxLength` of `0` means no automatic size limit
- `maxAge` of `0` means no automatic time-based expiration
- Automatic eviction on `put()` only removes one entry at a time; use `prune()` for bulk cleanup
- Each node tracks its creation time in `node.Metadata.Created`
