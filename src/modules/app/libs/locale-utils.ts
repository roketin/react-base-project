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
export function tl<T extends CombinedKeys>(combinedKey: T): string {
  // Split the combined key into namespace and key parts
  const [ns, key] = combinedKey.split(':');
  if (!ns || !key) {
    // Log an error if the combined key format is invalid
    console.error(
      `Invalid combined key format: ${combinedKey}. Expected 'ns:key'`,
    );
    // Return the original combined key as fallback
    return combinedKey as string;
  }
  // Here you can use i18next.t(ns, key) to get the translation
  // For now, it just returns the combined string for demonstration
  return ns + ':' + key.toString();
}
