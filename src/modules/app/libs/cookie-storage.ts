// cookieStorage.ts
import Cookies from 'js-cookie';
import type { PersistStorage } from 'zustand/middleware';

export const cookieStorage: PersistStorage<unknown> = {
  getItem: (name) => {
    const value = Cookies.get(name);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    Cookies.set(name, JSON.stringify(value), { expires: 1 });
  },
  removeItem: (name) => {
    Cookies.remove(name);
  },
};
