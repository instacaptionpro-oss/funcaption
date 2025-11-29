// Simple in-memory LRU cache
const cache = new Map();
const timestamps = new Map();

function getCachedResponse(key) {
  const now = Date.now();
  const timestamp = timestamps.get(key);
  
  if (!timestamp) return null;
  
  const ttl = parseInt(process.env.CACHE_TTL_SECONDS) || 86400;
  if (now - timestamp > ttl * 1000) {
    cache.delete(key);
    timestamps.delete(key);
    return null;
  }
  
  return cache.get(key);
}

function setCachedResponse(key, value, ttlSeconds) {
  cache.set(key, value);
  timestamps.set(key, Date.now());
  
  // Cleanup old entries (simple cleanup, could be more sophisticated)
  if (cache.size > 1000) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
    timestamps.delete(firstKey);
  }
}

module.exports = { getCachedResponse, setCachedResponse };
