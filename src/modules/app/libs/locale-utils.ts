import i18n from '@/plugins/i18n';
import type { CustomTypeOptions } from 'i18next';

// Type-safe combined keys
// This type constructs a union of strings in the format "namespace:key" for all keys in the i18next resource types.
type CombinedKeys = {
  [N in keyof CustomTypeOptions['resources']]: {
    [K in keyof CustomTypeOptions['resources'][N]]: `${N & string}:${K & string}`;
  }[keyof CustomTypeOptions['resources'][N]];
}[keyof CustomTypeOptions['resources']] extends infer A
  ? A extends string
    ? A
    : never
  : never;

// Translate function
// Accepts a combined key of the form "namespace:key" and returns the corresponding translation string.
// If the format is invalid, it logs an error and returns the input string.
export function tl<T extends CombinedKeys>(
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
