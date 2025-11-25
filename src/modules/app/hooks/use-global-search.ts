import { useMemo, useState, useCallback, useEffect } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { useSearchableItems } from '@/modules/app/hooks/use-searchable-items';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import type { SearchableItem } from '@/modules/app/types/global-search.type';
import {
  parseSearchQuery,
  SEARCH_IDENTIFIERS,
} from '@/modules/app/libs/search-identifier.lib';

const FUSE_OPTIONS: IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'moduleTitle', weight: 1 },
    { name: 'keywordsText', weight: 2 }, // Increased weight for keywords
    { name: 'badge', weight: 1.5 },
  ],
  threshold: 0.3, // Back to more strict for better results
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  distance: 100, // Allow matches further apart
  findAllMatches: true,
};

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const allItems = useSearchableItems();
  const { selectedModule, trackAccess, getRecentIds } = useGlobalSearchStore();

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

  // Filter items by selected module
  const filteredItems = useMemo(() => {
    if (!selectedModule || selectedModule === 'all') {
      return allItems;
    }
    return allItems.filter((item) => item.module === selectedModule);
  }, [allItems, selectedModule]);

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(filteredItems, FUSE_OPTIONS);
  }, [filteredItems]);

  // Get recent items
  const recentItems = useMemo(() => {
    const recentIds = getRecentIds();
    return recentIds
      .map((id) => allItems.find((item) => item.id === id))
      .filter((item): item is SearchableItem => item !== undefined);
  }, [allItems, getRecentIds]);

  // Parse query for identifier
  const parsedQuery = useMemo(() => {
    return parseSearchQuery(debouncedQuery);
  }, [debouncedQuery]);

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
        const searchActions = filteredItems.filter(
          (item) =>
            item.type === 'action' &&
            item.keywords?.some(
              (k) => k.includes('search') || k.includes('cari'),
            ),
        );

        // If user provided query, try to find relevant results first
        if (parsedQuery.query) {
          const relevantResults = fuse.search(parsedQuery.query);
          const relevantItems = relevantResults.map((r) => r.item);

          // Combine and remove duplicates by id
          const combined = [...relevantItems, ...searchActions];
          const uniqueItems = Array.from(
            new Map(combined.map((item) => [item.id, item])).values(),
          );

          return uniqueItems;
        }

        // No query, show all search actions and remove duplicates
        return Array.from(
          new Map(searchActions.map((item) => [item.id, item])).values(),
        );
      }

      if (identifierType === 'profile') {
        // Find profile actions
        return filteredItems.filter(
          (item) =>
            item.type === 'action' &&
            item.keywords?.some(
              (k) => k.includes('profile') || k.includes('profil'),
            ),
        );
      }

      if (identifierType === 'create') {
        // Find create actions
        return filteredItems.filter(
          (item) =>
            item.type === 'action' &&
            item.keywords?.some(
              (k) => k.includes('create') || k.includes('tambah'),
            ),
        );
      }
    }

    // Normal fuzzy search
    const results = fuse.search(debouncedQuery);
    const items = results.map((result) => result.item);

    // Remove duplicates by id
    return Array.from(new Map(items.map((item) => [item.id, item])).values());
  }, [fuse, debouncedQuery, parsedQuery, filteredItems]);

  // Handle item selection
  const handleSelect = useCallback(
    (item: SearchableItem) => {
      trackAccess(item.id);
    },
    [trackAccess],
  );

  return {
    query,
    setQuery,
    searchResults,
    recentItems,
    handleSelect,
    hasQuery: debouncedQuery.trim().length > 0,
    parsedQuery,
    isSearching,
  };
}
