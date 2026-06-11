// Rate limiter simple en memoria (suficiente para un sitio de bajo tráfico).
const hits = new Map();

export function rateLimit(ip, { limit = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (entry.count >= limit) return { allowed: false };
  entry.count++;
  return { allowed: true };
}

// Limpieza periódica para no acumular memoria.
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now();
      for (const [ip, e] of hits) if (now > e.resetAt) hits.delete(ip);
    },
    10 * 60 * 1000
  );
}
