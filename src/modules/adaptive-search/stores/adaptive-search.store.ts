import { create } from 'zustand';
import { encrypt, decrypt } from '@/modules/app/libs/crypto-utils';
import type { TSearchTrackingData } from '../types/adaptive-search.type';

const STORAGE_KEY_PREFIX = 'app_adaptive_search_tracking';
const RECENT_LIMIT = 5;

/**
 * Get storage key based on user ID
 */
function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
}

/**
 * Load tracking data from localStorage
 */
function loadTrackingData(userId?: string): TSearchTrackingData {
  try {
    const storageKey = getStorageKey(userId);
    const encrypted = localStorage.getItem(storageKey);
    if (!encrypted) {
      return {
        recent: [],
        accessCount: {},
        lastUpdated: Date.now(),
        searchKeywords: {},
      };
    }

    const data = decrypt<TSearchTrackingData>(encrypted);
    if (!data) {
      return {
        recent: [],
        accessCount: {},
        lastUpdated: Date.now(),
        searchKeywords: {},
      };
    }

    return { ...data, searchKeywords: data.searchKeywords || {} };
  } catch {
    return {
      recent: [],
      accessCount: {},
      lastUpdated: Date.now(),
      searchKeywords: {},
    };
  }
}

/**
 * Save tracking data to localStorage
 */
function saveTrackingData(data: TSearchTrackingData, userId?: string): void {
  try {
    const storageKey = getStorageKey(userId);
    const encrypted = encrypt(data);
    localStorage.setItem(storageKey, encrypted);
  } catch (error) {
    console.error('[Adaptive Search] Failed to save tracking data:', error);
  }
}

/**
 * Type for adaptive search store
 */
type TAdaptiveSearchStore = {
  // UI State
  isOpen: boolean;
  currentQuery: string;
  userId: string | undefined;

  // Tracking Data
  trackingData: TSearchTrackingData;

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setCurrentQuery: (query: string) => void;
  setUserId: (userId: string | undefined) => void;
  trackAccess: (itemId: string, query?: string) => void;
  getRecentIds: () => string[];
  getSearchKeyword: (itemId: string) => string | undefined;
  clearTracking: () => void;
};

/**
 * Zustand store for adaptive search
 */
export const useAdaptiveSearchStore = create<TAdaptiveSearchStore>(
  (set, get) => ({
    // Initial State
    isOpen: false,
    currentQuery: '',
    userId: undefined,
    trackingData: loadTrackingData(),

    // UI Actions
    setIsOpen: (isOpen) => set({ isOpen }),
    setSelectedModule: (module) => set({ selectedModule: module }),
    setCurrentQuery: (query) => set({ currentQuery: query }),
    setUserId: (userId) => {
      set({ userId, trackingData: loadTrackingData(userId) });
    },

    // Tracking Actions
    trackAccess: (itemId, query) => {
      const { trackingData, currentQuery, userId } = get();
      const searchQuery = query || currentQuery;

      const newData: TSearchTrackingData = {
        recent: [
          itemId,
          ...trackingData.recent.filter((id) => id !== itemId),
        ].slice(0, RECENT_LIMIT),
        accessCount: {
          ...trackingData.accessCount,
          [itemId]: (trackingData.accessCount[itemId] || 0) + 1,
        },
        searchKeywords: {
          ...trackingData.searchKeywords,
          ...(searchQuery && { [itemId]: searchQuery }),
        },
        lastUpdated: Date.now(),
      };

      set({ trackingData: newData });
      saveTrackingData(newData, userId);
    },

    getRecentIds: () => {
      return get().trackingData.recent.slice(0, RECENT_LIMIT);
    },

    getSearchKeyword: (itemId) => {
      return get().trackingData.searchKeywords?.[itemId];
    },

    clearTracking: () => {
      const { userId } = get();
      const newData: TSearchTrackingData = {
        recent: [],
        accessCount: {},
        lastUpdated: Date.now(),
        searchKeywords: {},
      };
      set({ trackingData: newData });
      saveTrackingData(newData, userId);
    },
  }),
);
