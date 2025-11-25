import { create } from 'zustand';
import CryptoJS from 'crypto-js';
import type { SearchTrackingData } from '@/modules/app/types/global-search.type';

const STORAGE_KEY = 'app_search_tracking';
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET || '';
const RECENT_LIMIT = 5;

// Encrypt data before storing
function encryptData(data: SearchTrackingData): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

// Decrypt data from storage
function decryptData(encrypted: string): SearchTrackingData | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

// Load tracking data from localStorage
function loadTrackingData(): SearchTrackingData {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) {
      return { recent: [], accessCount: {}, lastUpdated: Date.now() };
    }

    const data = decryptData(encrypted);
    if (!data) {
      return { recent: [], accessCount: {}, lastUpdated: Date.now() };
    }

    return data;
  } catch {
    return { recent: [], accessCount: {}, lastUpdated: Date.now() };
  }
}

// Save tracking data to localStorage
function saveTrackingData(data: SearchTrackingData): void {
  try {
    const encrypted = encryptData(data);
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Failed to save search tracking data:', error);
  }
}

type GlobalSearchStore = {
  // UI State
  isOpen: boolean;
  selectedModule: string | null;
  currentQuery: string;

  // Tracking Data
  trackingData: SearchTrackingData;

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setSelectedModule: (module: string | null) => void;
  setCurrentQuery: (query: string) => void;
  trackAccess: (itemId: string) => void;
  getRecentIds: () => string[];
  getFrequentIds: () => string[];
  clearTracking: () => void;
};

export const useGlobalSearchStore = create<GlobalSearchStore>((set, get) => ({
  // Initial State
  isOpen: false,
  selectedModule: null,
  currentQuery: '',
  trackingData: loadTrackingData(),

  // UI Actions
  setIsOpen: (isOpen) => set({ isOpen }),
  setSelectedModule: (module) => set({ selectedModule: module }),
  setCurrentQuery: (query) => set({ currentQuery: query }),

  // Tracking Actions
  trackAccess: (itemId) => {
    const { trackingData } = get();
    const newData: SearchTrackingData = {
      recent: [
        itemId,
        ...trackingData.recent.filter((id) => id !== itemId),
      ].slice(0, RECENT_LIMIT),
      accessCount: {
        ...trackingData.accessCount,
        [itemId]: (trackingData.accessCount[itemId] || 0) + 1,
      },
      lastUpdated: Date.now(),
    };

    set({ trackingData: newData });
    saveTrackingData(newData);
  },

  getRecentIds: () => {
    return get().trackingData.recent.slice(0, RECENT_LIMIT);
  },

  getFrequentIds: () => {
    // Keep for backward compatibility but not used in UI
    return [];
  },

  clearTracking: () => {
    const newData: SearchTrackingData = {
      recent: [],
      accessCount: {},
      lastUpdated: Date.now(),
    };
    set({ trackingData: newData });
    saveTrackingData(newData);
  },
}));
