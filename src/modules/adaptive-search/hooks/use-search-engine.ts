import { useMemo, useState, useCallback, useEffect } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import type { TSearchableItem } from '../types/adaptive-search.type';
import {
  parseSearchQuery,
  SEARCH_IDENTIFIERS,
} from '@/modules/app/libs/search-identifier.lib';

/**
 * Fuse.js options for fuzzy search
 */
const FUSE_OPTIONS: IFuseOptions<TSearchableItem> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'moduleTitle', weight: 1 },
    { name: 'keywordsText', weight: 2 },
    { name: 'badge', weight: 1.5 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  distance: 100,
  findAllMatches: true,
};

/**
 * Props for useSearchEngine hook
 */
type TUseSearchEngineProps = {
  items: TSearchableItem[];
  query: string;
  onSelect?: (item: TSearchableItem) => void;
};

/**
 * Core search engine hook using Fuse.js
 *
 * This hook provides:
 * - Fuzzy search with debouncing
 * - Identifier-based filtering (search, create, profile)
 * - Query state management
 * - Search results
 *
 * @param props - Configuration props
 * @returns Search state and handlers
 */
export function useSearchEngine(props: TUseSearchEngineProps) {
  const { items, query, onSelect } = props;

  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce query with 300ms delay
  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(items, FUSE_OPTIONS);
  }, [items]);

  // Parse query for identifier
  const parsedQuery = useMemo(() => {
    return parseSearchQuery(debouncedQuery);
  }, [debouncedQuery]);

  // Helper to dedupe items by id
  const dedupeById = useCallback((itemList: TSearchableItem[]) => {
    const seen = new Set<string>();
    return itemList.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    // If has identifier, filter by action type
    if (parsedQuery.hasIdentifier && parsedQuery.identifier) {
      const identifierType =
        SEARCH_IDENTIFIERS[
          parsedQuery.identifier as keyof typeof SEARCH_IDENTIFIERS
        ];

      if (identifierType === 'search') {
        // Find all search actions from all modules
        const searchActions = items.filter(
          (item) =>
            item.type === 'action' &&
            item.keywords?.some(
              (k) => k.includes('search') || k.includes('cari'),
            ),
        );

        // If user provided query after identifier, combine with fuzzy search
        if (parsedQuery.query) {
          const relevantResults = fuse.search(parsedQuery.query);
          const relevantItems = relevantResults.map((r) => r.item);

          // Prioritize fuzzy results first, then search actions
          return dedupeById([...relevantItems, ...searchActions]);
        }

        // No query after identifier, show all search actions (deduped)
        return dedupeById(searchActions);
      }

      if (identifierType === 'profile') {
        // Find profile actions (deduped)
        const profileActions = items.filter(
          (item) =>
            item.type === 'action' &&
            item.keywords?.some(
              (k) => k.includes('profile') || k.includes('profil'),
            ),
        );
        return dedupeById(profileActions);
      }

      if (identifierType === 'create') {
        // Find create actions (deduped)
        const createActions = items.filter(
          (item) =>
            item.type === 'action' &&
            item.keywords?.some(
              (k) => k.includes('create') || k.includes('tambah'),
            ),
        );
        return dedupeById(createActions);
      }
    }

    // Normal fuzzy search
    const results = fuse.search(debouncedQuery);
    const resultItems = results.map((result) => result.item);

    // Remove duplicates by id
    return dedupeById(resultItems);
  }, [debouncedQuery, items, fuse, parsedQuery, dedupeById]);

  // Handle item selection
  const handleSelect = useCallback(
    (item: TSearchableItem) => {
      if (onSelect) {
        onSelect(item);
      }
    },
    [onSelect],
  );

  return {
    searchResults,
    parsedQuery,
    handleSelect,
    hasQuery: debouncedQuery.trim().length > 0,
    isSearching,
  };
}
