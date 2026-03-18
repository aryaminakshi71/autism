/**
 * Offline Cache Manager
 * Caches API responses locally for offline use
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'offline_cache_';
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class OfflineCache {
  /**
   * Get cached data if still valid
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - item.timestamp > CACHE_EXPIRY;

      if (isExpired) {
        await this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Store data in cache
   */
  async set<T>(key: string, data: T): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Remove item from cache
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    // In a real app, use NetInfo to check connectivity
    return true;
  }
}

export const offlineCache = new OfflineCache();

// Cache keys
export const CACHE_KEYS = {
  PATIENTS: 'patients',
  PATIENTS_STATS: 'patients_stats',
  GOALS: 'goals',
  SESSIONS: 'sessions',
};
