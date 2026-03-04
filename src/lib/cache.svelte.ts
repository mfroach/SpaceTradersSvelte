interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = $state<Map<string, CacheEntry<any>>>(new Map());

const TTL = {
    agent: 60000,        // 1 min - changes with credits/reputation
    ships: 30000,        // 30s - changes with actions
    ship: 30000,         // 30s
    systems: 300000,     // 5 min - static
    system: 300000,      // 5 min - static
    waypoint: 300000,    // 5 min - mostly static
    market: 120000,      // 2 min - prices change
    shipyard: 300000,    // 5 min - mostly static
    jumpGate: 300000,    // 5 min - static
    construction: 60000, // 1 min - changes with supply
    contracts: 60000,    // 1 min - changes with actions
    contract: 60000,     // 1 min
    factions: 300000,    // 5 min - static
    faction: 300000      // 5 min - static
};

function getCacheKey(type: string, ...params: string[]): string {
    return `${type}:${params.join(':')}`;
}

function isExpired(entry: CacheEntry<any>, ttl: number): boolean {
    return Date.now() - entry.timestamp > ttl;
}

export function getCached<T>(type: keyof typeof TTL, ...params: string[]): T | null {
    const key = getCacheKey(type, ...params);
    const entry = cache.get(key);
    if (!entry || isExpired(entry, TTL[type])) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

export function setCached<T>(type: keyof typeof TTL, data: T, ...params: string[]): void {
    const key = getCacheKey(type, ...params);
    cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(type: keyof typeof TTL, ...params: string[]): void {
    if (params.length === 0) {
        // Invalidate all entries of this type
        for (const key of cache.keys()) {
            if (key.startsWith(`${type}:`)) {
                cache.delete(key);
            }
        }
    } else {
        const key = getCacheKey(type, ...params);
        cache.delete(key);
    }
}

export function clearCache(): void {
    cache.clear();
}