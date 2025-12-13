import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from '@/modules/app/components/base/r-command';
import { useAdaptiveSearchStore } from '../stores/adaptive-search.store';
import { useSearchEngine } from '../hooks/use-search-engine';
import { useAppSearchAdapter } from '../adapters/app-adapter';
import { collectApiMappingConfigs } from '../adapters/action-collector';
import type { TSearchableItem } from '../types/adaptive-search.type';
import { RSearchResultItem } from './r-search-result-item';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Props for RAdaptiveSearch component
 */
type TRAdaptiveSearchProps = {
  apiEnabled?: boolean;
};

/**
 * Adaptive Search Component
 *
 * Main search dialog with:
 * - Fuzzy search
 * - Static actions (from *.config.search.ts)
 * - Dynamic data (from API)
 * - Recent history
 * - Module filtering
 *
 * @param props - Component props
 */
export function RAdaptiveSearch({ apiEnabled = false }: TRAdaptiveSearchProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { navigate: navigateByName } = useNamedRoute();
  const { isOpen, setIsOpen, trackAccess, trackingData } =
    useAdaptiveSearchStore();

  // Local query state
  const [query, setQuery] = useState('');

  // Get items from adapter (local + API)
  const { items, isLoading } = useAppSearchAdapter({
    query,
    apiEnabled,
  });

  // Use search engine with adapter items
  const { searchResults, parsedQuery, isSearching } = useSearchEngine({
    items,
    query,
    onSelect: () => {},
  });

  // Get API mappings for onSelect
  const apiMappings = useMemo(() => collectApiMappingConfigs(), []);

  // Get recent items
  const recentItems = useMemo(() => {
    const recentIds = trackingData.recent.slice(0, 5);
    return recentIds
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is TSearchableItem => item !== undefined);
  }, [items, trackingData.recent]);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  // Handler for dynamic data items (from API)
  const handleDataItemSelect = (item: TSearchableItem) => {
    const mapping = apiMappings.find((m) => m.moduleId === item.module);
    if (!mapping?.onSelect || !item._raw) return false;

    const context = {
      getCurrentQuery: () => query,
      navigate: (path: string) => navigate(path),
      navigateByName: (
        name: string,
        params?: Record<string, string>,
        options?: { query?: Record<string, string | number | boolean> },
      ) => navigateByName(name, params || {}, options),
      openDialog: (id: string, data?: unknown) => {
        console.log('Open dialog:', id, data);
      },
    };
    mapping.onSelect(item._raw, context);
    return true;
  };

  // Handler for navigate-with-query action type
  const handleNavigateWithQuery = (
    item: TSearchableItem,
    searchTerm: string,
  ) => {
    if (item.actionType !== 'navigate-with-query' || !item.actionPayload)
      return false;

    const { path, routeName, queryParamKey } = item.actionPayload;
    const queryParams: Record<string, string> = {};
    if (queryParamKey && searchTerm) {
      queryParams[queryParamKey] = searchTerm;
    }

    if (routeName) {
      navigateByName(routeName, {}, { query: queryParams });
    } else if (path) {
      const searchParams = new URLSearchParams(queryParams);
      const url =
        Object.keys(queryParams).length > 0
          ? `${path}?${searchParams.toString()}`
          : path;
      navigate(url);
    }
    return true;
  };

  // Handler for navigate action type
  const handleNavigateAction = (item: TSearchableItem) => {
    if (item.actionType !== 'navigate' || !item.actionPayload) return false;

    const { path, routeName, params } = item.actionPayload;
    if (routeName) {
      navigateByName(routeName, params || {});
    } else if (path) {
      navigate(path);
    }
    return true;
  };

  // Handle item selection
  const onSelect = (item: TSearchableItem) => {
    // Track access
    trackAccess(item.id, query);

    // Handle dynamic data items (from API)
    if (item.type === 'data' && item._raw) {
      if (handleDataItemSelect(item)) {
        setIsOpen(false);
        setQuery('');
        return;
      }
    }

    // Handle static actions
    if (item.type === 'action') {
      const searchTerm = parsedQuery.hasIdentifier ? parsedQuery.query : query;

      if (handleNavigateWithQuery(item, searchTerm)) {
        setIsOpen(false);
        setQuery('');
        return;
      }

      if (handleNavigateAction(item)) {
        setIsOpen(false);
        setQuery('');
        return;
      }

      // Legacy: Navigation action with path
      if (item.path) {
        navigate(item.path);
        setIsOpen(false);
        setQuery('');
      }
      return;
    }

    // Handle menu items
    if (item.type === 'menu' && item.path) {
      navigate(item.path);
      setIsOpen(false);
      setQuery('');
    }
  };

  // Separate results by type
  const { menuResults, actionResults, dataResults } = useMemo(() => {
    const menus = searchResults.filter((item) => item.type === 'menu');
    const actions = searchResults.filter((item) => item.type === 'action');
    const data = searchResults.filter((item) => item.type === 'data');
    return {
      menuResults: menus,
      actionResults: actions,
      dataResults: data,
    };
  }, [searchResults]);

  const hasQuery = query.trim().length > 0;
  const hasResults = searchResults.length > 0;

  // Clear query when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={t('search.placeholder')}
          value={query}
          onValueChange={(value) => setQuery(value)}
        />

        <CommandList>
          {/* Show identifier hint */}
          {parsedQuery.hasIdentifier && (
            <div className='px-3 py-2 mx-2 mt-2 text-xs bg-primary/10 text-primary rounded-md'>
              {parsedQuery.identifier === 'search' ||
              parsedQuery.identifier === 'cari' ||
              parsedQuery.identifier === 'find' ? (
                <>
                  🔍 {t('search.willSearchFor')}{' '}
                  <strong>
                    {parsedQuery.query || t('search.typeSearchTerm')}
                  </strong>
                </>
              ) : parsedQuery.identifier === 'profile' ||
                parsedQuery.identifier === 'profil' ||
                parsedQuery.identifier === 'user' ? (
                <>👤 {t('search.willOpenProfile')}</>
              ) : parsedQuery.identifier === 'create' ||
                parsedQuery.identifier === 'tambah' ||
                parsedQuery.identifier === 'add' ||
                parsedQuery.identifier === 'new' ||
                parsedQuery.identifier === 'buat' ? (
                <>➕ {t('search.willOpenCreateForm')}</>
              ) : (
                <>
                  ✨ {t('search.command')} {parsedQuery.identifier}
                </>
              )}
            </div>
          )}

          {/* Loading indicator */}
          {(isSearching || isLoading) && (
            <div className='py-6 text-center text-sm'>
              <div className='flex items-center justify-center gap-2 text-muted-foreground'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                <span>{t('search.searching')}</span>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isSearching && !isLoading && hasQuery && hasResults && (
            <CommandGroup>
              {/* Actions */}
              {actionResults.map((item) => (
                <RSearchResultItem
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                />
              ))}

              {/* Data (from API) */}
              {dataResults.length > 0 && actionResults.length > 0 && (
                <CommandSeparator />
              )}
              {dataResults.map((item) => (
                <RSearchResultItem
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                />
              ))}

              {/* Menus */}
              {menuResults.length > 0 &&
                (actionResults.length > 0 || dataResults.length > 0) && (
                  <CommandSeparator />
                )}
              {menuResults.map((item) => (
                <RSearchResultItem
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                />
              ))}
            </CommandGroup>
          )}

          {/* No results */}
          {!isSearching && !isLoading && hasQuery && !hasResults && (
            <div className='py-6 text-center text-sm'>
              <p className='text-muted-foreground'>{t('search.noResults')}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                {t('search.noResultsHint')}
              </p>
            </div>
          )}

          {/* Recent items */}
          {!hasQuery && (
            <>
              {recentItems.length > 0 ? (
                <CommandGroup
                  heading={
                    <div className='flex items-center gap-2'>
                      <Clock className='w-3.5 h-3.5' />
                      <span>{t('search.recent')}</span>
                    </div>
                  }
                >
                  {recentItems.map((item) => (
                    <RSearchResultItem
                      key={item.id}
                      item={item}
                      onSelect={onSelect}
                    />
                  ))}
                </CommandGroup>
              ) : (
                <div className='py-6 text-center text-sm'>
                  <p className='text-muted-foreground'>
                    {t('search.startSearching')}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {t('search.recentHint')}
                  </p>
                </div>
              )}
            </>
          )}
        </CommandList>

        {/* Footer hint */}
        <div className='border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1'>
              <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                ↑↓
              </kbd>
              <span>{t('search.navigate')}</span>
            </span>
            <span className='flex items-center gap-1'>
              <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                ↵
              </kbd>
              <span>{t('search.select')}</span>
            </span>
            <span className='flex items-center gap-1'>
              <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                ESC
              </kbd>
              <span>{t('search.close')}</span>
            </span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
