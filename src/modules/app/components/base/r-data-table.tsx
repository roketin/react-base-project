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
  type ColumnSizingState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Search,
  Columns3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/modules/app/components/base/r-dropdown-menu';
import { RCheckbox } from '@/modules/app/components/base/r-checkbox';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';

export type StickyPosition = 'left' | 'right' | 'none';
type Alignment = 'left' | 'center' | 'right';

export type TRDataTableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  sticky?: StickyPosition;
  stickyOffset?: number;
  headerAlign?: Alignment;
  cellAlign?: Alignment;
  enableResizing?: boolean;
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
  emptyContent?: React.ReactNode;
  /** Enable column resizing */
  resizableColumns?: boolean;
  /** Storage key for persisting column widths */
  columnSizingStorageKey?: string;
  /** Show column visibility toggle button */
  showColumnToggle?: boolean;
  /** Initial column visibility state */
  initialColumnVisibility?: VisibilityState;
  /** Callback when column visibility changes */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Storage key for persisting column visibility */
  columnVisibilityStorageKey?: string;
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

// Column sizing storage helpers
function getStoredColumnSizing(key: string): ColumnSizingState | null {
  try {
    const stored = localStorage.getItem(`table_cols_${key}`);
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore
  }
  return null;
}

function storeColumnSizing(key: string, sizing: ColumnSizingState): void {
  try {
    localStorage.setItem(`table_cols_${key}`, JSON.stringify(sizing));
  } catch {
    // Ignore
  }
}

// Column visibility storage helpers
function getStoredColumnVisibility(key: string): VisibilityState | null {
  try {
    const stored = localStorage.getItem(`table_vis_${key}`);
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore
  }
  return null;
}

function storeColumnVisibility(key: string, visibility: VisibilityState): void {
  try {
    localStorage.setItem(`table_vis_${key}`, JSON.stringify(visibility));
  } catch {
    // Ignore
  }
}

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
    emptyContent,
    resizableColumns = false,
    columnSizingStorageKey,
    showColumnToggle = false,
    initialColumnVisibility = {},
    onColumnVisibilityChange,
    columnVisibilityStorageKey,
  }: TRDataTableProps<TData, TValue>,
  ref: React.Ref<TRDataTableRef<TData>>,
) => {
  const { t } = useTranslation('app');
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialSelected);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState(initialSearch);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    if (columnSizingStorageKey) {
      return getStoredColumnSizing(columnSizingStorageKey) ?? {};
    }
    return {};
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (columnVisibilityStorageKey) {
        return (
          getStoredColumnVisibility(columnVisibilityStorageKey) ??
          initialColumnVisibility
        );
      }
      return initialColumnVisibility;
    },
  );
  const isInitialized = useRef(false);
  const isMobile = useIsMobile();

  // Refs for live resizing (no re-render during drag)
  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumnId = useRef<string | null>(null);
  const resizingStartWidth = useRef(0);

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

  // Handle column visibility change
  const handleColumnVisibilityChange = useCallback(
    (
      updater: VisibilityState | ((old: VisibilityState) => VisibilityState),
    ) => {
      setColumnVisibility((prev) => {
        const newVisibility =
          typeof updater === 'function' ? updater(prev) : updater;
        if (columnVisibilityStorageKey) {
          storeColumnVisibility(columnVisibilityStorageKey, newVisibility);
        }
        onColumnVisibilityChange?.(newVisibility);
        return newVisibility;
      });
    },
    [columnVisibilityStorageKey, onColumnVisibilityChange],
  );

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, sorting, columnSizing, columnVisibility },
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: true,
    enableColumnResizing: resizableColumns,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  // Handle column resize - direct DOM manipulation for performance
  const handleColumnResize = useCallback((headerId: string, delta: number) => {
    if (!tableRef.current) return;

    const th = tableRef.current.querySelector(`[data-column-id="${headerId}"]`);
    if (!th) return;

    if (!resizingColumnId.current) {
      resizingColumnId.current = headerId;
      resizingStartWidth.current = th.getBoundingClientRect().width;
    }

    const newWidth = Math.max(50, resizingStartWidth.current + delta);
    (th as HTMLElement).style.width = `${newWidth}px`;

    // Also update corresponding td cells
    const cells = tableRef.current.querySelectorAll(
      `[data-cell-column="${headerId}"]`,
    );
    cells.forEach((cell) => {
      (cell as HTMLElement).style.width = `${newWidth}px`;
    });
  }, []);

  const handleColumnResizeEnd = useCallback(
    (headerId: string, delta: number) => {
      const newWidth = Math.max(50, resizingStartWidth.current + delta);

      setColumnSizing((prev) => {
        const updated = { ...prev, [headerId]: newWidth };
        if (columnSizingStorageKey) {
          storeColumnSizing(columnSizingStorageKey, updated);
        }
        return updated;
      });

      resizingColumnId.current = null;
      resizingStartWidth.current = 0;
    },
    [columnSizingStorageKey],
  );

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
      sort_by: sort
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

  // Get all toggleable columns (exclude selection column, etc.)
  const toggleableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    );

  const hiddenColumns = toggleableColumns.filter(
    (column) => !column.getIsVisible(),
  );

  const hasColumnToggle = showColumnToggle && toggleableColumns.length > 0;

  const getColumnLabel = (column: (typeof toggleableColumns)[0]) => {
    const header = column.columnDef.header;
    return typeof header === 'string'
      ? header
      : column.id.charAt(0).toUpperCase() +
          column.id.slice(1).replace(/_/g, ' ');
  };

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
        emptyContent ?? (
          <div className='rounded-md border py-8'>
            <RResult
              status='empty'
              size='sm'
              title='No results'
              description='No data available to display'
            />
          </div>
        )
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
    const canResize = resizableColumns && def.enableResizing !== false;
    const columnWidth = columnSizing[header.id] ?? header.getSize();

    return (
      <RTh
        key={header.id}
        data-column-id={header.id}
        sticky={sticky}
        stickyOffset={offset}
        align={align}
        resizable={canResize}
        onResize={(delta) => handleColumnResize(header.id, delta)}
        onResizeEnd={(delta) => handleColumnResizeEnd(header.id, delta)}
        style={{ width: columnWidth, minWidth: canResize ? 50 : undefined }}
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

  const visibleColumnsCount = toggleableColumns.filter((col) =>
    col.getIsVisible(),
  ).length;

  const handleToggleColumn = (
    column: (typeof toggleableColumns)[0],
    value: boolean,
  ) => {
    // Prevent hiding if it's the last visible column
    if (!value && visibleColumnsCount <= 1) return;
    column.toggleVisibility(value);
  };

  const renderColumnToggleHeader = () => {
    if (!showColumnToggle || toggleableColumns.length === 0) return null;

    const tooltipText =
      hiddenColumns.length > 0
        ? t('table.columnsHidden', { count: hiddenColumns.length })
        : t('table.toggleColumns');

    const allVisible = hiddenColumns.length === 0;
    const someVisible =
      visibleColumnsCount > 0 && visibleColumnsCount < toggleableColumns.length;

    const handleSelectAllChange = (checked: boolean) => {
      if (checked) {
        // Show all
        toggleableColumns.forEach((col) => col.toggleVisibility(true));
      } else {
        // Hide all except first
        toggleableColumns.forEach((col, idx) =>
          col.toggleVisibility(idx === 0),
        );
      }
    };

    return (
      <RTh
        align='center'
        className='w-10 px-1!'
        style={{ width: 40, minWidth: 40 }}
      >
        <RTooltip content={tooltipText} side='left' delayDuration={0}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className={cn(
                  'inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  hiddenColumns.length > 0
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              >
                <Columns3 size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <div className='px-2 py-1.5'>
                <RCheckbox
                  checked={allVisible}
                  indeterminate={someVisible}
                  onCheckedChange={handleSelectAllChange}
                  label={t('table.toggleColumns')}
                  className='h-4 w-4'
                />
              </div>
              <DropdownMenuSeparator />
              {toggleableColumns.map((column) => {
                const isVisible = column.getIsVisible();
                return (
                  <div key={column.id} className='px-2 py-1'>
                    <RCheckbox
                      checked={isVisible}
                      onCheckedChange={(value) =>
                        handleToggleColumn(column, value)
                      }
                      label={getColumnLabel(column)}
                      className='h-4 w-4'
                    />
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </RTooltip>
      </RTh>
    );
  };

  const renderTableContent = () => (
    <RTable
      ref={tableRef}
      key={columnKey}
      fixed={fixed}
      className={tableClassName}
    >
      <RThead>
        {table.getHeaderGroups().map((headerGroup) => (
          <RTr key={headerGroup.id} hoverable={false}>
            {headerGroup.headers.map(renderHeaderCell)}
            {renderColumnToggleHeader()}
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
                const columnWidth =
                  columnSizing[cell.column.id] ?? cell.column.getSize();

                return (
                  <RTd
                    key={cell.id}
                    data-cell-column={cell.column.id}
                    sticky={sticky}
                    stickyOffset={offset}
                    align={align}
                    style={
                      resizableColumns ? { width: columnWidth } : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </RTd>
                );
              })}
              {/* Empty cell for column toggle alignment */}
              {hasColumnToggle && <RTd className='w-10 px-1!' />}
            </RTr>
          ))
        ) : (
          <RTr hoverable={false}>
            <RTd colSpan={(columns.length || 1) + (hasColumnToggle ? 1 : 0)}>
              {emptyContent ?? (
                <div className='py-8'>
                  <RResult
                    status='empty'
                    size='sm'
                    title='No results'
                    description='No data available to display'
                  />
                </div>
              )}
            </RTd>
          </RTr>
        )}
      </RTbody>
    </RTable>
  );

  const hasToolbar = allowSearch || toolbarStart || toolbarEnd;

  return (
    <div>
      {/* Main toolbar row */}
      {hasToolbar && (
        <div className='mb-3 flex flex-wrap items-center gap-3 md:justify-between'>
          <div className='flex items-center gap-3 flex-1'>
            {allowSearch && (
              <div className='flex-1 max-w-sm'>
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
          {toolbarEnd && (
            <div className='flex items-center gap-2'>{toolbarEnd}</div>
          )}
        </div>
      )}

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
