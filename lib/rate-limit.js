// Simple in-memory rate limiter
const requestCounts = new Map();

function rateLimitByIP(ip, limitPerMinute) {
  const now = Math.floor(Date.now() / 60000); // Current minute
  const key = `${ip}:${now}`;
  
  const currentCount = requestCounts.get(key) || 0;
  
  if (currentCount >= limitPerMinute) {
    return false; // Rate limited
  }
  
  requestCounts.set(key, currentCount + 1);
  
  // Cleanup old entries
  const cutoff = now - 2; // Keep last 2 minutes
  for (const [mapKey] of requestCounts) {
    const keyParts = mapKey.split(':');
    if (keyParts.length > 1) {
      const keyMinute = parseInt(keyParts[1]);
      if (keyMinute < cutoff) {
        requestCounts.delete(mapKey);
      }
    }
  }
  
  return true; // Allowed
}

module.exports = { rateLimitByIP };
