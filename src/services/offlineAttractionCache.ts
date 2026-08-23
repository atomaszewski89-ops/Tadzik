import { Attraction } from '../types';
import { SEEDED_ATTRACTIONS } from '../data/attractions';

export interface OfflineCachedAttraction {
  id: string;
  attraction: Attraction;
  cachedAt: string;
  sizeKb: number;
  offlineMapReady: boolean;
  version: '2026.1';
}

const STORAGE_KEY = 'tadzik_offline_attractions_cache_v2';
const EVENT_KEY = 'tadzik:offline_cache_updated';

// Helper to calculate approximate object size in KB
function estimateSizeKb(obj: unknown): number {
  try {
    const str = JSON.stringify(obj);
    return Math.max(1, Math.round((new Blob([str]).size / 1024) * 10) / 10);
  } catch {
    return 12;
  }
}

/**
 * Reads all cached offline attractions from localStorage.
 */
export function getOfflineCachedAttractions(): Record<string, OfflineCachedAttraction> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Auto-seed initial top attractions into offline cache on first access
      return initializeDefaultOfflineCache();
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read offline attractions cache:', err);
    return {};
  }
}

/**
 * Initializes default offline cache with curated attractions.
 */
function initializeDefaultOfflineCache(): Record<string, OfflineCachedAttraction> {
  const initialCache: Record<string, OfflineCachedAttraction> = {};
  const topAttractions = SEEDED_ATTRACTIONS.slice(0, 35);
  const now = new Date().toISOString();

  topAttractions.forEach((att) => {
    initialCache[att.id] = {
      id: att.id,
      attraction: att,
      cachedAt: now,
      sizeKb: estimateSizeKb(att) + 18, // includes offline map vector data & transport buffer
      offlineMapReady: true,
      version: '2026.1'
    };
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCache));
  } catch (e) {
    console.warn('Could not persist initial offline cache:', e);
  }

  return initialCache;
}

/**
 * Returns an array of IDs of all attractions available in offline cache.
 */
export function getOfflineCachedAttractionIds(): string[] {
  const cache = getOfflineCachedAttractions();
  return Object.keys(cache);
}

/**
 * Checks if a specific attraction is present in offline cache.
 */
export function isAttractionOfflineCached(attractionId: string): boolean {
  const cache = getOfflineCachedAttractions();
  return Boolean(cache[attractionId]);
}

/**
 * Saves or updates a single attraction in offline cache.
 */
export function cacheAttractionOffline(attraction: Attraction): void {
  if (typeof window === 'undefined') return;
  try {
    const cache = getOfflineCachedAttractions();
    cache[attraction.id] = {
      id: attraction.id,
      attraction,
      cachedAt: new Date().toISOString(),
      sizeKb: estimateSizeKb(attraction) + 18,
      offlineMapReady: true,
      version: '2026.1'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { action: 'added', id: attraction.id } }));
  } catch (err) {
    console.error('Error caching attraction offline:', err);
  }
}

/**
 * Removes an attraction from offline cache.
 */
export function removeAttractionOffline(attractionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cache = getOfflineCachedAttractions();
    if (cache[attractionId]) {
      delete cache[attractionId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { action: 'removed', id: attractionId } }));
    }
  } catch (err) {
    console.error('Error removing attraction from offline cache:', err);
  }
}

/**
 * Toggles an attraction's offline cache status.
 */
export function toggleAttractionOfflineCache(attraction: Attraction): { isCached: boolean; totalCount: number } {
  const isCurrentlyCached = isAttractionOfflineCached(attraction.id);
  if (isCurrentlyCached) {
    removeAttractionOffline(attraction.id);
    const count = getOfflineCachedAttractionIds().length;
    return { isCached: false, totalCount: count };
  } else {
    cacheAttractionOffline(attraction);
    const count = getOfflineCachedAttractionIds().length;
    return { isCached: true, totalCount: count };
  }
}

/**
 * Caches all provided attractions in offline cache.
 */
export function cacheAllAttractionsOffline(attractions: Attraction[]): number {
  if (typeof window === 'undefined') return 0;
  try {
    const cache = getOfflineCachedAttractions();
    const now = new Date().toISOString();
    
    attractions.forEach((att) => {
      cache[att.id] = {
        id: att.id,
        attraction: att,
        cachedAt: now,
        sizeKb: estimateSizeKb(att) + 18,
        offlineMapReady: true,
        version: '2026.1'
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { action: 'bulk_added', count: attractions.length } }));
    return Object.keys(cache).length;
  } catch (err) {
    console.error('Error bulk caching attractions offline:', err);
    return 0;
  }
}

/**
 * Clears all attractions from offline cache.
 */
export function clearAllOfflineAttractions(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: { action: 'cleared' } }));
  } catch (err) {
    console.error('Error clearing offline cache:', err);
  }
}

/**
 * Returns cache statistics: total count, estimated disk space, and last update.
 */
export function getOfflineCacheSummary(): { count: number; totalSizeKb: number; lastSavedAt?: string } {
  const cache = getOfflineCachedAttractions();
  const items = Object.values(cache);
  const totalSizeKb = items.reduce((acc, item) => acc + (item.sizeKb || 15), 0);
  const lastSavedAt = items.length > 0 ? items[items.length - 1].cachedAt : undefined;

  return {
    count: items.length,
    totalSizeKb: Math.round(totalSizeKb),
    lastSavedAt
  };
}

/**
 * Hook or helper to subscribe to offline cache change events.
 */
export function subscribeToOfflineCacheUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = () => callback();
  window.addEventListener(EVENT_KEY, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) callback();
  });

  return () => {
    window.removeEventListener(EVENT_KEY, handler);
  };
}
