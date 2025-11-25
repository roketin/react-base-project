import { create } from 'zustand';
import { encrypt, decrypt } from '@/modules/app/libs/crypto-utils';
import type { SearchTrackingData } from '@/modules/app/types/global-search.type';

const STORAGE_KEY_PREFIX = 'app_search_tracking';
const RECENT_LIMIT = 5;

// Get storage key based on user ID
function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
}

// Load tracking data from localStorage
function loadTrackingData(userId?: string): SearchTrackingData {
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

    const data = decrypt<SearchTrackingData>(encrypted);
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

// Save tracking data to localStorage
function saveTrackingData(data: SearchTrackingData, userId?: string): void {
  try {
    const storageKey = getStorageKey(userId);
    const encrypted = encrypt(data);
    localStorage.setItem(storageKey, encrypted);
  } catch (error) {
    console.error('Failed to save search tracking data:', error);
  }
}

type GlobalSearchStore = {
  // UI State
  isOpen: boolean;
  selectedModule: string | null;
  currentQuery: string;
  userId: string | undefined;

  // Tracking Data
  trackingData: SearchTrackingData;

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setSelectedModule: (module: string | null) => void;
  setCurrentQuery: (query: string) => void;
  setUserId: (userId: string | undefined) => void;
  trackAccess: (itemId: string) => void;
  getRecentIds: () => string[];
  getFrequentIds: () => string[];
  getSearchKeyword: (itemId: string) => string | undefined;
  clearTracking: () => void;
};

export const useGlobalSearchStore = create<GlobalSearchStore>((set, get) => ({
  // Initial State
  isOpen: false,
  selectedModule: null,
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
  trackAccess: (itemId) => {
    const { trackingData, currentQuery, userId } = get();
    const newData: SearchTrackingData = {
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
        ...(currentQuery && { [itemId]: currentQuery }),
      },
      lastUpdated: Date.now(),
    };

    set({ trackingData: newData });
    saveTrackingData(newData, userId);
  },

  getRecentIds: () => {
    return get().trackingData.recent.slice(0, RECENT_LIMIT);
  },

  getFrequentIds: () => {
    // Keep for backward compatibility but not used in UI
    return [];
  },

  getSearchKeyword: (itemId) => {
    return get().trackingData.searchKeywords?.[itemId];
  },

  clearTracking: () => {
    const { userId } = get();
    const newData: SearchTrackingData = {
      recent: [],
      accessCount: {},
      lastUpdated: Date.now(),
      searchKeywords: {},
    };
    set({ trackingData: newData });
    saveTrackingData(newData, userId);
  },
}));
