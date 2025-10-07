import CryptoJS from 'crypto-js';
/**
 * Environment variable for the encryption secret key.
 * Make sure it is set in the `.env` file:
 * VITE_CRYPTO_SECRET=my_secret_key
 */
const SECRET_KEY: string = import.meta.env.VITE_CRYPTO_SECRET;

/**
 * Encrypt data before saving to cookie.
 * @param data - Any data (usually object or string) to encrypt.
 * @returns Encrypted string (base64)
 */
export const encrypt = (data: unknown): string => {
  try {
    const json = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encrypt error:', error);
    return '';
  }
};

/**
 * Decrypt encrypted data from cookie.
 * @param cipherText - Encrypted string (base64)
 * @returns Original data (object/string) or `null` if decryption fails.
 */
export const decrypt = <T = unknown>(cipherText: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
};
