# ObjectCache Service

The ObjectCache service (powered by [cachetrax](https://github.com/stevenvelozo/cachetrax)) provides in-memory object caching with expiration support.

## Access

```javascript
// On-demand service - instantiate when needed
const cache = fable.instantiateServiceProvider('ObjectCache');

// Create named caches for different purposes
const userCache = fable.instantiateServiceProvider('ObjectCache', {}, 'user-cache');
const sessionCache = fable.instantiateServiceProvider('ObjectCache', {}, 'session-cache');
```

## Basic Operations

### Set Value

```javascript
cache.set('key', { name: 'John', age: 30 });
```

### Get Value

```javascript
const user = cache.get('key');
// Returns { name: 'John', age: 30 } or undefined if not found
```

### Check Existence

```javascript
if (cache.has('key')) {
    console.log('Key exists');
}
```

### Delete Value

```javascript
cache.delete('key');
```

### Clear All

```javascript
cache.clear();
```

## Expiration

### Set with TTL

```javascript
// Cache for 5 minutes (300000 milliseconds)
cache.set('session', sessionData, 300000);
```

### Check if Expired

```javascript
const isExpired = cache.isExpired('session');
```

### Get or Compute

```javascript
// Get from cache or compute if missing/expired
function getCachedUser(userId) {
    let user = cache.get(`user:${userId}`);

    if (!user) {
        user = fetchUserFromDatabase(userId);
        cache.set(`user:${userId}`, user, 60000); // Cache for 1 minute
    }

    return user;
}
```

## Cache Statistics

### Get Size

```javascript
const count = cache.size();
console.log(`Cache contains ${count} items`);
```

### Get All Keys

```javascript
const keys = cache.keys();
keys.forEach(key => console.log(key));
```

## Use Cases

### API Response Caching

```javascript
const apiCache = fable.instantiateServiceProvider('ObjectCache', {}, 'api-cache');

async function fetchWithCache(url) {
    const cached = apiCache.get(url);
    if (cached) {
        return cached;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Cache for 5 minutes
    apiCache.set(url, data, 300000);

    return data;
}
```

### Session Management

```javascript
const sessions = fable.instantiateServiceProvider('ObjectCache', {}, 'sessions');

function createSession(userId) {
    const sessionId = fable.getUUID();
    const session = {
        userId,
        createdAt: Date.now(),
        data: {}
    };

    // Session expires in 30 minutes
    sessions.set(sessionId, session, 1800000);

    return sessionId;
}

function getSession(sessionId) {
    return sessions.get(sessionId);
}

function destroySession(sessionId) {
    sessions.delete(sessionId);
}
```

### Memoization

```javascript
const memoCache = fable.instantiateServiceProvider('ObjectCache', {}, 'memo');

function memoize(fn, keyGenerator) {
    return function(...args) {
        const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

        if (memoCache.has(key)) {
            return memoCache.get(key);
        }

        const result = fn.apply(this, args);
        memoCache.set(key, result);
        return result;
    };
}

// Usage
const expensiveCalculation = memoize((n) => {
    // Complex computation
    return fibonacci(n);
});
```

### Rate Limiting

```javascript
const rateLimiter = fable.instantiateServiceProvider('ObjectCache', {}, 'rate-limits');

function checkRateLimit(clientId, maxRequests = 100, windowMs = 60000) {
    const key = `rate:${clientId}`;
    let count = rateLimiter.get(key) || 0;

    if (count >= maxRequests) {
        return false; // Rate limited
    }

    count++;
    rateLimiter.set(key, count, windowMs);
    return true;
}
```

### Database Query Caching

```javascript
const queryCache = fable.instantiateServiceProvider('ObjectCache', {}, 'db-queries');

async function cachedQuery(query, params, ttl = 60000) {
    const cacheKey = `query:${query}:${JSON.stringify(params)}`;

    const cached = queryCache.get(cacheKey);
    if (cached) {
        fable.log.debug('Cache hit', { query });
        return cached;
    }

    fable.log.debug('Cache miss', { query });
    const result = await database.query(query, params);
    queryCache.set(cacheKey, result, ttl);

    return result;
}
```

## Multiple Cache Instances

Create separate caches for different purposes:

```javascript
// User data cache (longer TTL)
const userCache = fable.instantiateServiceProvider('ObjectCache', {}, 'users');

// Session cache (shorter TTL)
const sessionCache = fable.instantiateServiceProvider('ObjectCache', {}, 'sessions');

// Request cache (very short TTL)
const requestCache = fable.instantiateServiceProvider('ObjectCache', {}, 'requests');
```

## Cache Invalidation Patterns

### Invalidate by Key

```javascript
function updateUser(userId, userData) {
    saveToDatabase(userData);
    cache.delete(`user:${userId}`);
}
```

### Invalidate by Pattern

```javascript
function invalidateUserCaches(userId) {
    const keys = cache.keys();
    keys.forEach(key => {
        if (key.startsWith(`user:${userId}:`)) {
            cache.delete(key);
        }
    });
}
```

### Time-Based Refresh

```javascript
function getWithRefresh(key, fetchFn, ttl) {
    const cached = cache.get(key);

    if (!cached || cache.isExpired(key)) {
        const fresh = fetchFn();
        cache.set(key, fresh, ttl);
        return fresh;
    }

    return cached;
}
```

## Notes

- Cache is in-memory only; data is lost on restart
- No size limits by default; monitor memory usage
- TTL is in milliseconds
- Expired items may not be immediately removed from memory
