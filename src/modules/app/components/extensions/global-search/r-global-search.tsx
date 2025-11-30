import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from '@/modules/app/components/ui/command';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { useGlobalSearch } from '@/modules/app/hooks/use-global-search';
import type { SearchableItem } from '@/modules/app/types/global-search.type';
import { RSearchResultItem } from './r-search-result-item';
import { RSearchModuleFilter } from './r-search-module-filter';
import { Clock } from 'lucide-react';
import { RInput } from '@/modules/app/components/base/r-input';
import { setGlobalNavigate } from '@/modules/app/libs/navigation-helper';
import { useTranslation } from 'react-i18next';

export function RGlobalSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, setCurrentQuery } = useGlobalSearchStore();
  const {
    query,
    setQuery,
    searchResults,
    recentItems,
    handleSelect,
    hasQuery,
    parsedQuery,
    isSearching,
  } = useGlobalSearch();

  // Set global navigate for module configs
  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  // Update store query when local query changes
  useEffect(() => {
    // Store the actual query (without identifier)
    const actualQuery = parsedQuery.hasIdentifier ? parsedQuery.query : query;
    setCurrentQuery(actualQuery);
  }, [query, parsedQuery, setCurrentQuery]);

  // Handle Enter key for quick execution
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && parsedQuery.hasIdentifier && parsedQuery.query) {
        // If only 1 search action, auto-select it
        if (searchResults.length === 1) {
          e.preventDefault();
          const firstResult = searchResults[0];
          if (firstResult) {
            onSelect(firstResult);
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, parsedQuery, searchResults]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onSelect = (item: SearchableItem) => {
    // Track access first (this saves to recent)
    handleSelect(item);

    // Handle action with onExecute (custom execution)
    if (item.type === 'action' && item.onExecute) {
      // For search actions from recent, restore the keyword
      const { getSearchKeyword } = useGlobalSearchStore.getState();
      const savedKeyword = getSearchKeyword(item.id);
      if (savedKeyword && !parsedQuery.query) {
        setCurrentQuery(savedKeyword);
      }

      item.onExecute();
      setIsOpen(false);
      setQuery('');
      return;
    }

    // Handle navigation (menu or action with path)
    if (item.type === 'menu' || (item.type === 'action' && item.path)) {
      navigate(item.path!);
      setIsOpen(false);
      setQuery('');
    }
  };

  // Separate search results by type
  const { menuResults, actionResults } = useMemo(() => {
    const menus = searchResults.filter((item) => item.type === 'menu');
    const actions = searchResults.filter((item) => item.type === 'action');
    return {
      menuResults: menus,
      actionResults: actions,
    };
  }, [searchResults]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command shouldFilter={false}>
        <div className='p-3 space-y-2'>
          <div className='flex items-center gap-3'>
            <RSearchModuleFilter />

            <div className='flex-1 pr-10'>
              <RInput
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Helper hints */}
          {!query && (
            <div className='px-2 text-xs text-muted-foreground space-y-1'>
              <p className='font-medium'>{t('search.quickCommands')}</p>
              <div className='flex flex-wrap gap-3'>
                <code className='px-2 py-0.5 bg-muted rounded'>search ...</code>
                <code className='px-2 py-0.5 bg-muted rounded'>profile</code>
                <code className='px-2 py-0.5 bg-muted rounded'>create</code>
              </div>
            </div>
          )}

          {/* Show what will happen when identifier detected */}
          {parsedQuery.hasIdentifier && (
            <div className='px-2 py-1.5 text-xs bg-primary/10 text-primary rounded-md'>
              {parsedQuery.identifier === 'search' ||
              parsedQuery.identifier === 'cari' ? (
                <>
                  🔍 {t('search.willSearchFor')}{' '}
                  <strong>
                    {parsedQuery.query || t('search.typeSearchTerm')}
                  </strong>
                </>
              ) : parsedQuery.identifier === 'profile' ||
                parsedQuery.identifier === 'profil' ? (
                <>👤 {t('search.willOpenProfile')}</>
              ) : parsedQuery.identifier === 'create' ||
                parsedQuery.identifier === 'tambah' ? (
                <>➕ {t('search.willOpenCreateForm')}</>
              ) : (
                <>
                  ✨ {t('search.command')} {parsedQuery.identifier}
                </>
              )}
            </div>
          )}
        </div>
        <CommandList>
          {/* Loading indicator */}
          {isSearching && (
            <div className='py-6 text-center text-sm'>
              <div className='flex items-center justify-center gap-2 text-muted-foreground'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                <span>{t('search.searching')}</span>
              </div>
            </div>
          )}

          {/* Search Results - When user is searching */}
          {!isSearching && hasQuery && searchResults.length > 0 && (
            <CommandGroup>
              {actionResults.map((item) => (
                <RSearchResultItem
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                />
              ))}
              {actionResults.length > 0 && menuResults.length > 0 && (
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

          {/* No results found - When searching but no results */}
          {!isSearching && hasQuery && searchResults.length === 0 && (
            <div className='py-6 text-center text-sm'>
              <p className='text-muted-foreground'>{t('search.noResults')}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                {t('search.noResultsHint')}
              </p>
            </div>
          )}

          {/* Recent - Only show when no search query */}
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
                  {recentItems.map((item) => {
                    const { getSearchKeyword } =
                      useGlobalSearchStore.getState();
                    const savedKeyword = getSearchKeyword(item.id);
                    return (
                      <RSearchResultItem
                        key={item.id}
                        item={item}
                        onSelect={onSelect}
                        searchKeyword={savedKeyword}
                      />
                    );
                  })}
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
