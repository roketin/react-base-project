import RDataTableFooter from '@/modules/app/components/base/r-data-table-footer';
import {
  RTable,
  RThead,
  RTbody,
  RTr,
  RTh,
  RTd,
} from '@/modules/app/components/base/r-simple-table';
import { cn } from '@/modules/app/libs/utils';
import type {
  TApiDefaultQueryParams,
  TApiResponsePaginateMeta,
} from '@/modules/app/types/api.type';
import type { TLoadable } from '@/modules/app/types/component.type';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Table,
  type Header,
  type RowSelectionState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useIsMobile } from '@/modules/app/hooks/use-media-query';
import { RSkeleton } from '@/modules/app/components/base/r-skeleton';
import { RInput } from '@/modules/app/components/base/r-input';
import { RResult } from '@/modules/app/components/base/r-result';

export type StickyPosition = 'left' | 'right' | 'none';
type Alignment = 'left' | 'center' | 'right';

export type TRDataTableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  sticky?: StickyPosition;
  stickyOffset?: number;
  headerAlign?: Alignment;
  cellAlign?: Alignment;
};

export type TRDataTableProps<TData, TValue> = TLoadable & {
  columns?: TRDataTableColumnDef<TData, TValue>[];
  data?: TData[];
  fixed?: boolean;
  pagination?: boolean;
  onChange?: (params: Partial<TApiDefaultQueryParams>) => void;
  onChangeSelected?: (ids: TRDataTableSelected) => void;
  meta?: TApiResponsePaginateMeta | null;
  transformSort?: (key: string) => string;
  rowId?: string | null;
  footer?: React.ReactNode;
  allowSearch?: boolean;
  initialSelected?: TRDataTableSelected;
  initialSearch?: string;
  searchPlaceholder?: string;
  striped?: boolean;
  hoverable?: boolean;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  renderOnMobile?: (row: TData, index: number) => React.ReactNode;
};

export type TRDataTableRef<TData = unknown> = {
  getTable: () => Table<TData>;
};

export type TRDataTableSelected = Record<string, boolean>;

const JUSTIFY_CLASS: Record<Alignment, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const RSkeleton_ROWS = Array.from({ length: 8 });
const MOBILE_RSkeleton_ROWS = Array.from({ length: 5 });

const RDataTableInner = <TData, TValue>(
  {
    columns = [],
    data = [],
    loading = false,
    fixed = false,
    pagination = true,
    onChange,
    onChangeSelected,
    meta = null,
    transformSort,
    rowId = 'id',
    allowSearch = true,
    footer,
    initialSelected = {},
    initialSearch = '',
    searchPlaceholder = 'Search...',
    striped = false,
    hoverable = true,
    toolbarStart,
    toolbarEnd,
    renderOnMobile,
  }: TRDataTableProps<TData, TValue>,
  ref: React.Ref<TRDataTableRef<TData>>,
) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialSelected);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState(initialSearch);
  const isInitialized = useRef(false);
  const isMobile = useIsMobile();

  // Debounced view mode with fade transition (like iPadOS)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    isMobile ? 'mobile' : 'desktop',
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const targetMode = isMobile ? 'mobile' : 'desktop';
    if (targetMode === viewMode) return;

    // Clear any pending transition
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }

    // Start fade out
    setIsTransitioning(true);

    // Wait for fade out, then switch view, then fade in
    transitionTimeout.current = setTimeout(() => {
      setViewMode(targetMode);
      // Small delay before fade in
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);

    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, [isMobile, viewMode]);

  const getRowId = useMemo(() => {
    if (!rowId) return undefined;
    return (row: TData, index: number) =>
      String((row as Record<string, unknown>)[rowId] ?? index);
  }, [rowId]);

  // Generate stable column key for hot reload support
  const columnKey = useMemo(
    () =>
      columns
        .map((c) => c.id ?? (c as { accessorKey?: string }).accessorKey ?? '')
        .join('-'),
    [columns],
  );

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, sorting },
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  const handleChange = useCallback(
    (params: Partial<TApiDefaultQueryParams>) => onChange?.(params),
    [onChange],
  );

  const debouncedSearch = useDebouncedCallback((value: string) => {
    handleChange({ search: value, page: 1 });
  }, 300);

  // Sync sorting to parent
  useEffect(() => {
    const sort = sorting[0];
    handleChange({
      sort_field: sort
        ? transformSort
          ? transformSort(sort.id)
          : sort.id
        : undefined,
      sort_order: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
      page: 1,
    });
  }, [sorting, transformSort, handleChange]);

  // Sync selection to parent
  useEffect(() => {
    onChangeSelected?.(rowSelection);
  }, [rowSelection, onChangeSelected]);

  // Handle initial search from URL
  useEffect(() => {
    if (initialSearch && !isInitialized.current) {
      setSearch(initialSearch);
      handleChange({ search: initialSearch, page: 1 });
      isInitialized.current = true;
    }
  }, [initialSearch, handleChange]);

  useImperativeHandle(ref, () => ({ getTable: () => table }), [table]);

  const handleSort = useCallback((header: Header<TData, unknown>) => {
    if (!header.column.getCanSort()) return;
    const sorted = header.column.getIsSorted();
    if (!sorted) header.column.toggleSorting(false);
    else if (sorted === 'asc') header.column.toggleSorting(true);
    else header.column.clearSorting();
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearch(val);
      debouncedSearch(val);
    },
    [debouncedSearch],
  );

  const tableClassName = cn('rt-table');

  const showMobileView = viewMode === 'mobile' && !!renderOnMobile;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const rows = table.getRowModel().rows;

  const renderRSkeletonRows = () =>
    RSkeleton_ROWS.map((_, idx) => (
      <RTr key={idx} hoverable={false}>
        {headers.map((header) => (
          <RTd key={header.id}>
            <RSkeleton className='h-9 w-full rounded-md' />
          </RTd>
        ))}
      </RTr>
    ));

  const renderMobileContent = () => {
    if (loading) {
      return (
        <div className='space-y-3'>
          {MOBILE_RSkeleton_ROWS.map((_, idx) => (
            <RSkeleton key={idx} className='h-24 w-full rounded-md' />
          ))}
        </div>
      );
    }
    if (!data.length) {
      return (
        <div className='rounded-md border py-8'>
          <RResult
            status='empty'
            size='sm'
            title='No results'
            description='No data available to display'
          />
        </div>
      );
    }
    return (
      <div className='space-y-3'>
        {data.map((row, index) => renderOnMobile!(row, index))}
      </div>
    );
  };

  const renderHeaderCell = (header: Header<TData, unknown>) => {
    const def = header.column.columnDef as TRDataTableColumnDef<TData, TValue>;
    const sticky = def.sticky ?? 'none';
    const offset = def.stickyOffset ?? 0;
    const align = (def.headerAlign ?? 'left') as Alignment;

    return (
      <RTh
        key={header.id}
        sticky={sticky}
        stickyOffset={offset}
        align={align}
        style={{ width: header.getSize() }}
        className={cn(header.column.getCanSort() && 'hover:bg-muted/70')}
      >
        {!header.isPlaceholder && (
          <div
            role='presentation'
            className={cn(
              'flex select-none items-center gap-1',
              JUSTIFY_CLASS[align],
              align === 'right' ? 'flex-row-reverse' : 'flex-row',
              header.column.getCanSort()
                ? 'cursor-pointer hover:text-foreground'
                : 'cursor-default',
            )}
            onClick={() => handleSort(header)}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {header.column.getCanSort() && (
              <div className='ml-3'>
                {header.column.getIsSorted() === 'asc' ? (
                  <ArrowUp size={16} />
                ) : header.column.getIsSorted() === 'desc' ? (
                  <ArrowDown size={16} />
                ) : (
                  <ChevronsUpDown size={16} className='opacity-20' />
                )}
              </div>
            )}
          </div>
        )}
      </RTh>
    );
  };

  const renderTableContent = () => (
    <RTable key={columnKey} fixed={fixed} className={tableClassName}>
      <RThead>
        {table.getHeaderGroups().map((headerGroup) => (
          <RTr key={headerGroup.id} hoverable={false}>
            {headerGroup.headers.map(renderHeaderCell)}
          </RTr>
        ))}
      </RThead>
      <RTbody>
        {loading ? (
          renderRSkeletonRows()
        ) : rows.length > 0 ? (
          rows.map((row) => (
            <RTr
              key={row.id}
              striped={striped}
              hoverable={hoverable}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => {
                const def = cell.column.columnDef as TRDataTableColumnDef<
                  TData,
                  TValue
                >;
                const sticky = def.sticky ?? 'none';
                const offset = def.stickyOffset ?? 0;
                const align = (def.cellAlign ??
                  def.headerAlign ??
                  'left') as Alignment;

                return (
                  <RTd
                    key={cell.id}
                    sticky={sticky}
                    stickyOffset={offset}
                    align={align}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </RTd>
                );
              })}
            </RTr>
          ))
        ) : (
          <RTr hoverable={false}>
            <RTd colSpan={columns.length || 1}>
              <div className='py-8'>
                <RResult
                  status='empty'
                  size='sm'
                  title='No results'
                  description='No data available to display'
                />
              </div>
            </RTd>
          </RTr>
        )}
      </RTbody>
    </RTable>
  );

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center gap-3 md:justify-between'>
        <div className='flex items-center gap-3 flex-1'>
          {allowSearch && (
            <div className='flex-1'>
              <RInput
                placeholder={searchPlaceholder}
                onChange={handleSearchChange}
                leftIcon={<Search size={16} />}
                value={search}
              />
            </div>
          )}
          {toolbarStart}
        </div>
        {toolbarEnd}
      </div>

      <div
        className={cn(
          'transition-opacity duration-150 ease-in-out',
          isTransitioning ? 'opacity-0' : 'opacity-100',
        )}
      >
        {showMobileView ? renderMobileContent() : renderTableContent()}
      </div>

      {pagination && (
        <RDataTableFooter
          meta={meta}
          pagesToShow={5}
          onChange={handleChange}
          disabled={loading}
        />
      )}

      {footer}
    </div>
  );
};

export const RDataTable = forwardRef(RDataTableInner) as <TData, TValue>(
  props: TRDataTableProps<TData, TValue> & {
    ref?: React.Ref<TRDataTableRef<TData>>;
  },
) => ReturnType<typeof RDataTableInner>;
