/**
 * Offline Sync Manager
 * Handles offline data storage and sync when back online
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// Storage keys
const OFFLINE_QUEUE_KEY = "offline_queue";
const CACHE_PREFIX = "cache_";
const OFFLINE_MODE_KEY = "offline_mode";

// Types
export interface QueuedAction {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  data: any;
  timestamp: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class OfflineSyncManager {
  private isOnline: boolean = true;
  private syncListeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private async init() {
    // Monitor network status
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? true;

    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      // If we just came back online, sync
      if (wasOffline && this.isOnline) {
        this.sync();
      }

      // Notify listeners
      this.notifyListeners();
    });
  }

  /**
   * Check if device is online
   */
  isConnected(): boolean {
    return this.isOnline;
  }

  /**
   * Get offline mode status
   */
  async getOfflineMode(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(OFFLINE_MODE_KEY);
      return value === "true";
    } catch {
      return false;
    }
  }

  /**
   * Set offline mode manually
   */
  async setOfflineMode(offline: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_MODE_KEY, String(offline));
    } catch (error) {
      console.error("Failed to set offline mode:", error);
    }
  }

  /**
   * Add listener for connectivity changes
   */
  addListener(listener: () => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.syncListeners.forEach((listener) => listener());
  }

  /**
   * Queue an action for offline sync
   */
  async queueAction(
    action: Omit<QueuedAction, "id" | "timestamp">,
  ): Promise<void> {
    const queuedAction: QueuedAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    try {
      const existingQueue = await this.getQueue();
      const newQueue = [...existingQueue, queuedAction];
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue));
    } catch (error) {
      console.error("Failed to queue action:", error);
    }
  }

  /**
   * Get all queued actions
   */
  async getQueue(): Promise<QueuedAction[]> {
    try {
      const queueJson = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear the action queue
   */
  async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (error) {
      console.error("Failed to clear queue:", error);
    }
  }

  /**
   * Process queued actions when back online
   */
  async sync(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline) {
      return { success: 0, failed: 0 };
    }

    const queue = await this.getQueue();
    if (queue.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Process each action
    for (const action of queue) {
      try {
        await this.processAction(action);
        success++;
      } catch (error) {
        console.error("Failed to sync action:", error);
        failed++;
      }
    }

    // Clear processed actions
    if (success > 0) {
      await this.clearQueue();
    }

    return { success, failed };
  }

  /**
   * Process a single queued action
   */
  private async processAction(action: QueuedAction): Promise<void> {
    // This would make actual API calls in production
    // For now, simulate the sync
    console.log("Syncing action:", action);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Cache data locally
   */
  async setCache<T>(
    key: string,
    data: T,
    ttlMinutes: number = 5,
  ): Promise<void> {
    try {
      const now = Date.now();
      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt: now + ttlMinutes * 60 * 1000,
      };
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (error) {
      console.error("Failed to set cache:", error);
    }
  }

  /**
   * Get cached data
   */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const entryJson = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!entryJson) return null;

      const entry: CacheEntry<T> = JSON.parse(entryJson);

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  }
}

// Export singleton instance
export const offlineSync = new OfflineSyncManager();

// Hook for using offline sync in components
export function useOfflineSync() {
  const isOnline = offlineSync.isConnected();
  const isOfflineMode = offlineSync.getOfflineMode();

  return {
    isOnline,
    isOfflineMode,
    sync: () => offlineSync.sync(),
    queueAction: (action: Omit<QueuedAction, "id" | "timestamp">) =>
      offlineSync.queueAction(action),
  };
}
