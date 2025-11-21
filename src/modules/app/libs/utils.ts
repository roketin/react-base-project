import dayjs, { type ConfigType } from 'dayjs';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Round
 * @param value
 * @param numDigits
 * @returns
 */
export const safeRound = (value: number, numDigits: number = 2): number => {
  const factor = Math.pow(10, numDigits);
  return Math.round(value * factor) / factor;
};

/**
 * Handling data replaced to [] when undefined
 * @param data
 * @returns
 */
export function safeArray<T>(data: T[] | null | undefined): T[] {
  return data ?? [];
}

/**
 * Exclude object
 * @param obj
 * @param keys
 * @returns
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = {} as Omit<T, K>;
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result[key as unknown as keyof Omit<T, K>] = obj[key as keyof T] as any;
    }
  }
  return result;
}

/**
 * Format date values consistently.
 * Returns "-" when the value is empty or invalid.
 */
export function appFormatDate(
  value?: ConfigType | null,
  format: string = 'DD MMM YYYY, HH:mm',
) {
  if (!value) return '-';

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(format) : '-';
}

/**
 * Format numbers as IDR currency.
 * Returns "-" when value is null/undefined or not a finite number.
 */
export function appFormatCurrency(
  value: number | string | null | undefined,
  fractionDigits = 0,
  withPrefix = false,
) {
  if (value === null || value === undefined) return '-';

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';

  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);

  return withPrefix ? `Rp ${formatted}` : formatted;
}

// Backward-compatible aliases for older imports
export const _appDate = appFormatDate;
export const _appCurrency = appFormatCurrency;
export const tableDate = appFormatDate;
export const tableCurrency = appFormatCurrency;
