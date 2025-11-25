/**
 * Parse search query with identifier pattern
 * Examples:
 * - search laptop gaming → { identifier: 'search', query: 'laptop gaming' }
 * - profile → { identifier: 'profile', query: '' }
 * - laptop gaming → { identifier: null, query: 'laptop gaming' }
 */
export function parseSearchQuery(input: string): {
  identifier: string | null;
  query: string;
  hasIdentifier: boolean;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { identifier: null, query: '', hasIdentifier: false };
  }

  // Split by first space
  const parts = trimmed.split(/\s+/);
  const firstWord = parts[0].toLowerCase();

  // Check if first word is a known identifier
  if (firstWord in SEARCH_IDENTIFIERS) {
    return {
      identifier: firstWord,
      query: parts.slice(1).join(' '),
      hasIdentifier: true,
    };
  }

  return {
    identifier: null,
    query: input,
    hasIdentifier: false,
  };
}

/**
 * Search identifier mappings
 */
export const SEARCH_IDENTIFIERS = {
  // Search in modules
  search: 'search',
  cari: 'search',
  find: 'search',

  // Profile
  profile: 'profile',
  profil: 'profile',
  user: 'profile',

  // Create/Add
  create: 'create',
  add: 'create',
  new: 'create',
  tambah: 'create',
  buat: 'create',
} as const;

export type SearchIdentifier = keyof typeof SEARCH_IDENTIFIERS;
