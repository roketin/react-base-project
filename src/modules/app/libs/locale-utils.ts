import type { TLocale } from '@/modules/app/types/locale.type';
import i18n from '@/plugins/i18n';

// Translate function
// Accepts a combined key of the form "namespace:key" and returns the corresponding translation string.
// If the format is invalid, it logs an error and returns the input string.
export function tl<T extends TLocale>(
  combinedKey: T,
  options?: Record<string, unknown>,
): string {
  const translated = (
    options
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        i18n.t(combinedKey as any, options)
      : i18n.t(combinedKey)
  ) as unknown;
  return typeof translated === 'string' ? translated : combinedKey;
}
