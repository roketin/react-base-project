import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import type {
  TApiDefaultQueryParams,
  TApiResponsePaginateMeta,
} from '@/modules/app/types/api.type';
import type { TLoadable } from '@/modules/app/types/component.type';
import { RInput } from '@/modules/app/components/base/r-input';
import { RList } from '@/modules/app/components/base/r-list';
import { RSkeleton } from '@/modules/app/components/base/r-skeleton';
import { RResult } from '@/modules/app/components/base/r-result';
import RDataTableFooter from '@/modules/app/components/base/r-data-table-footer';
import RMenu, { type TRMenuItem } from '@/modules/app/components/base/r-menu';
import RBtn from '@/modules/app/components/base/r-btn';

export type TRDataListRenderContext = {
  index: number;
  count: number;
  isFirst: boolean;
  isLast: boolean;
};

export type TRDataListProps<TData> = TLoadable & {
  /** Array of data items to display */
  items?: TData[];

  /** Custom render function for each item */
  renderItem: (item: TData, context: TRDataListRenderContext) => ReactNode;

  /** Key extraction function for list items */
  getKey: (item: TData, index: number) => React.Key;

  /** Pagination metadata from API */
  meta?: TApiResponsePaginateMeta | null;

  /** Callback when pagination/search/sort changes */
  onChange?: (params: Partial<TApiDefaultQueryParams>) => void;

  /** Enable/disable search functionality */
  allowSearch?: boolean;

  /** Search input placeholder text */
  searchPlaceholder?: string;

  /** Initial search value */
  initialSearch?: string;

  /** Enable/disable sorting functionality */
  allowSort?: boolean;

  /** Sort menu items configuration */
  sortItems?: TRMenuItem[];

  /** Active sort label to display on sort button */
  activeSortLabel?: string;

  /** CSS class for the list container */
  listClassName?: string;

  /** CSS class for each item wrapper */
  itemClassName?: string | ((item: TData, index: number) => string | undefined);

  /** Custom empty state content */
  emptyContent?: ReactNode;

  /** Number of skeleton rows to show when loading */
  loadingRows?: number;

  /** Enable/disable pagination */
  pagination?: boolean;

  /** Additional toolbar content at the start */
  toolbarStart?: ReactNode;

  /** Additional toolbar content at the end */
  toolbarEnd?: ReactNode;

  /** Container className */
  className?: string;

  /** Callback when search is reset */
  onResetSearch?: () => void;
};

const DEFAULT_LOADING_ROWS = 5;

/**
 * LoadingSkeleton component - renders skeleton UI for loading state
 */
const LoadingSkeleton = memo<{ rows?: number }>(
  ({ rows = DEFAULT_LOADING_ROWS }) => (
    <div className='space-y-3'>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className='rounded-lg border border-border/60 bg-background/80 px-4 py-3'
        >
          <RSkeleton className='mb-2 h-4 w-1/3' />
          <RSkeleton className='h-3 w-1/2' />
        </div>
      ))}
    </div>
  ),
);
LoadingSkeleton.displayName = 'LoadingSkeleton';

/**
 * RDataList - A reusable list component with search, sort, pagination, and loading states
 *
 * @example
 * ```tsx
 * <RDataList
 *   items={roles}
 *   loading={isLoading}
 *   meta={meta}
 *   getKey={(item) => item.id}
 *   renderItem={(item, { index }) => (
 *     <div>{item.name}</div>
 *   )}
 *   sortItems={sortMenuItems}
 *   activeSortLabel={currentSortLabel}
 *   onChange={handleChange}
 * />
 * ```
 */
export function RDataList<TData extends Record<string, unknown>>({
  items = [],
  loading = false,
  renderItem,
  getKey,
  meta = null,
  onChange,
  allowSearch = true,
  searchPlaceholder = 'Search...',
  initialSearch = '',
  allowSort = false,
  sortItems = [],
  activeSortLabel = 'Sort',
  listClassName,
  itemClassName,
  emptyContent,
  loadingRows = DEFAULT_LOADING_ROWS,
  pagination = true,
  toolbarStart,
  toolbarEnd,
  className,
  onResetSearch,
}: TRDataListProps<TData>) {
  const [search, setSearch] = useState(initialSearch);
  const isInitialized = useRef(false);

  // Initialize search from URL/props
  const handleChange = useCallback(
    (params: Partial<TApiDefaultQueryParams>) => onChange?.(params),
    [onChange],
  );

  const debouncedSearch = useDebouncedCallback((value: string) => {
    handleChange({ search: value, page: 1 });
  }, 300);

  // Handle initial search from URL
  useMemo(() => {
    if (initialSearch && !isInitialized.current) {
      setSearch(initialSearch);
      handleChange({ search: initialSearch, page: 1 });
      isInitialized.current = true;
    }
  }, [initialSearch, handleChange]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleResetSearch = useCallback(() => {
    setSearch('');
    handleChange({ search: '', page: 1 });
    onResetSearch?.();
  }, [handleChange, onResetSearch]);

  const handlePaginationChange = useCallback(
    (params: Record<string, number | string>) => handleChange(params),
    [handleChange],
  );

  // Computed values
  const hasData = items.length > 0;
  const isSearching = Boolean(search.trim());

  // Prepare empty content
  const resolvedEmptyContent = useMemo(() => {
    if (emptyContent) return emptyContent;

    return isSearching ? (
      <RResult
        className='border border-dashed border-border/60 p-5'
        size='sm'
        title='No results found'
        description='Try adjusting your search terms'
        action={
          <RBtn variant='outline' onClick={handleResetSearch}>
            Reset Search
          </RBtn>
        }
      />
    ) : (
      <RResult
        className='border border-dashed border-border/60 p-5'
        size='sm'
        title='No data'
        description='No items to display'
      />
    );
  }, [emptyContent, isSearching, handleResetSearch]);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar */}
      {(allowSearch || allowSort || toolbarStart || toolbarEnd) && (
        <div className='flex flex-row items-center justify-between gap-2'>
          <div className='flex flex-1 items-center gap-2'>
            {allowSearch && (
              <div className='flex-1'>
                <RInput
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={handleSearchChange}
                  leftIcon={<Search size={16} />}
                  clearable
                />
              </div>
            )}
            {toolbarStart}
          </div>

          <div className='flex items-center gap-2'>
            {toolbarEnd}
            {allowSort && sortItems.length > 0 && (
              <RMenu
                trigger={
                  <RBtn variant='outline' iconStart={<ArrowUpDown />}>
                    {activeSortLabel}
                  </RBtn>
                }
                items={sortItems}
                contentClassName='[&_div[role=menuitem]]:cursor-pointer'
              />
            )}
          </div>
        </div>
      )}

      {/* List Content */}
      {loading ? (
        <LoadingSkeleton rows={loadingRows} />
      ) : (
        <RList<TData>
          items={items}
          listClassName={cn('space-y-3', listClassName)}
          itemClassName={
            typeof itemClassName === 'function'
              ? itemClassName
              : cn(
                  'shadow-none hover:bg-gray-100 dark:hover:bg-gray-950',
                  itemClassName,
                )
          }
          getKey={getKey}
          renderItem={renderItem}
          emptyContent={resolvedEmptyContent}
        />
      )}

      {/* Pagination */}
      {pagination && (meta || hasData) && (
        <RDataTableFooter meta={meta} onChange={handlePaginationChange} />
      )}
    </div>
  );
}

export default RDataList;
