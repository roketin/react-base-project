import Cookies from 'js-cookie';
import type { PersistStorage } from 'zustand/middleware';
import { decrypt, encrypt } from '@/modules/app/libs/crypto-utils';

/**
 * Custom `zustand` storage implementation based on cookies,
 * with AES-encrypted data using CryptoJS.
 */
export const cookieStorage: PersistStorage<unknown> = {
  getItem: <T>(name: string): T | null => {
    const value = Cookies.get(name);
    if (!value) return null;
    return decrypt<T>(value);
  },

  setItem: (name: string, value: unknown): void => {
    const encrypted = encrypt(value);
    Cookies.set(name, encrypted, {
      expires: 1, // 1 day
      sameSite: 'Strict',
      secure: true, // can only be accessed via HTTPS
    });
  },

  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};
