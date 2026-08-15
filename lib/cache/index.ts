/**
 * ToSom — Cache Module (B5.5)
 * 
 * Cache-aside med Redis (Upstash) hvis tilgjengelig, ellers in-memory.
 * Cache nede → gå til DB, aldri feil mot bruker.
 * 
 * Nøkler:
 * - journey:day:<N> — dag-innhold (24 t TTL)
 * - match:active:<userId> — aktiv match (5 min TTL)
 * - quota:free:count — gratiskvote-teller (60 s TTL)
 */

// In-memory fallback (for dev og når Redis er nede)
const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;

interface CacheClient {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
}

/** In-memory cache (fallback) */
const memoryClient: CacheClient = {
  async get<T>(key: string): Promise<T | null> {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value as T;
  },
  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  },
  async del(key: string): Promise<void> {
    memoryCache.delete(key);
  },
};

/** Upstash Redis REST cache (hvis konfigurert) */
function createUpstashClient(): CacheClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return {
    async get<T>(key: string): Promise<T | null> {
      try {
        const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.result === null) return null;
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch {
        return null; // Cache nede → gå til DB
      }
    },
    async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
      try {
        await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}/EX/${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Cache nede → fortsett uten
      }
    },
    async del(key: string): Promise<void> {
      try {
        await fetch(`${url}/del/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Cache nede → fortsett uten
      }
    },
  };
}

const client: CacheClient = createUpstashClient() || memoryClient;

/* ═══════════════════════════════════════════════════════════
   PUBLIC API — cache-aside
   ═══════════════════════════════════════════════════════════ */

/**
 * Hent fra cache, eller kör fetcher og cache resultatet.
 * Cache nede → fetcher kalles alltid, aldri feil mot bruker.
 */
export async function cacheAside<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await client.get<T>(key);
  if (cached !== null) return cached;

  const value = await fetcher();
  await client.set(key, value, ttlSeconds);
  return value;
}

/** Direkte hent fra cache (null hvis ikke funnet) */
export async function cacheGet<T>(key: string): Promise<T | null> {
  return client.get<T>(key);
}

/** Direkte sett i cache */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  return client.set(key, value, ttlSeconds);
}

/** Slett fra cache (invalidering) */
export async function cacheDel(key: string): Promise<void> {
  return client.del(key);
}

/* ═══════════════════════════════════════════════════════════
   KANONISKE NØKLER (B5.5)
   ═══════════════════════════════════════════════════════════ */

export const CACHE_KEYS = {
  /** Journey-dag innhold (24 t TTL) */
  journeyDay: (day: number) => `journey:day:${day}`,
  /** Aktiv match for bruker (5 min TTL) */
  activeMatch: (userId: string) => `match:active:${userId}`,
  /** Gratiskvote-teller (60 s TTL) */
  freeQuotaCount: () => `quota:free:count`,
} as const;

export const CACHE_TTL = {
  journeyDay: 24 * 60 * 60, // 24 timer
  activeMatch: 5 * 60, // 5 minutter
  freeQuotaCount: 60, // 60 sekunder
} as const;