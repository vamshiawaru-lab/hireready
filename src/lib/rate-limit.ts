const requests = new Map<string, number[]>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const limit = parseInt(process.env.RATE_LIMIT_PER_MINUTE || "5", 10);
  const windowMs = 60_000;
  const now = Date.now();

  const timestamps = requests.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldestInWindow = recent[0];
    const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  requests.set(ip, recent);

  // Cleanup old entries periodically
  if (requests.size > 1000) {
    for (const [key, vals] of requests.entries()) {
      const filtered = vals.filter((t) => now - t < windowMs);
      if (filtered.length === 0) requests.delete(key);
      else requests.set(key, filtered);
    }
  }

  return { allowed: true };
}
