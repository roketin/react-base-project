import RDataTableFooter from '@/modules/app/components/base/r-data-table-footer';
import { Input } from '@/modules/app/components/ui/input';
import { Skeleton } from '@/modules/app/components/ui/skeleton';
import {
  Table as TableCom,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/app/components/ui/table';
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
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

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
  header?: React.ReactNode;
  footer?: React.ReactNode;
  allowSearch?: boolean;
  initialSelected?: TRDataTableSelected;
  searchPlaceholder?: string;
  striped?: boolean;
  hoverable?: boolean;
};

export type TRDataTableRef<TData = unknown> = {
  getTable: () => Table<TData>;
};

export type TRDataTableSelected = {
  [key: string]: boolean;
};

const ALIGN_CLASS_MAP: Record<Alignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const JUSTIFY_CLASS_MAP: Record<Alignment, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

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
    header,
    footer,
    initialSelected = {},
    searchPlaceholder = 'Search...',
    striped = true,
    hoverable = true,
  }: TRDataTableProps<TData, TValue>,
  ref: React.Ref<TRDataTableRef<TData>>,
) => {
  // State for tracking selected rows keyed by row ID.
  const [rowSelection, setRowSelection] =
    useState<TRDataTableSelected>(initialSelected);

  // State for managing sorting state of the table.
  const [sorting, setSorting] = useState<SortingState>([]);

  // Initialize the TanStack React Table instance with manual sorting and pagination support.
  // Row selection and sorting state are controlled externally via state hooks.
  const table = useReactTable({
    state: {
      rowSelection,
      sorting,
    },
    data,
    columns,
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: rowId
      ? // Provide a custom row ID getter if rowId prop is specified.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any, index: number) => String(row[rowId] ?? index)
      : undefined,
  });

  /**
   * Callback to notify parent components about changes in table query parameters such as
   * sorting, pagination, and search.
   *
   * @param {Partial<TApiDefaultQueryParams>} params - Partial query parameters to update.
   */
  const onChangeTable = useCallback(
    (params: Partial<TApiDefaultQueryParams>) => {
      if (onChange) {
        onChange(params);
      }
    },
    [onChange],
  );

  /**
   * Effect to synchronize sorting changes with the parent component.
   * Transforms the sorting state into API query parameters and resets page to 1.
   * Runs whenever sorting or transformSort function changes.
   */
  useEffect(() => {
    const actualSort = sorting?.[0];
    const sortParams = (
      actualSort
        ? {
            sort_field: transformSort
              ? transformSort(actualSort.id)
              : actualSort.id,
            sort_order: actualSort.desc ? 'desc' : 'asc',
          }
        : {
            sort_field: undefined,
            sort_order: undefined,
          }
    ) as Partial<TApiDefaultQueryParams>;

    onChangeTable({ ...sortParams, page: 1 });
  }, [onChangeTable, sorting, transformSort]);

  /**
   * Effect to notify parent components when the selected rows change.
   * Runs whenever rowSelection state updates.
   */
  useEffect(() => {
    if (onChangeSelected) {
      onChangeSelected(rowSelection);
    }
  }, [onChangeSelected, rowSelection]);

  /**
   * Expose imperative methods to parent components using ref.
   * Provides access to the underlying TanStack table instance.
   */
  useImperativeHandle(ref, () => ({
    getTable() {
      return table;
    },
  }));

  /**
   * Handles sorting toggles on column headers.
   * Cycles through sorting states: none -> ascending -> descending -> none.
   *
   * @param {Header<TData, unknown>} header - The header cell that was clicked.
   */
  const handleSort = useCallback((header: Header<TData, unknown>) => {
    if (!header.column.getCanSort()) return;
    const isSorted = header.column.getIsSorted();
    if (!isSorted) return header.column.toggleSorting(false);
    if (isSorted === 'asc') return header.column.toggleSorting(true);
    if (isSorted === 'desc') return header.column.clearSorting();
  }, []);

  /**
   * Renders placeholder skeleton rows to maintain table layout while data is loading.
   * Always displays 8 skeleton rows, with skeleton cells matching the number of columns.
   *
   * @returns {JSX.Element} Skeleton rows for loading state.
   */
  const renderSkeletonRows = () => {
    // Get the first header group (assume all header groups have same columns)
    const headerGroups = table.getHeaderGroups();
    const headerGroup = headerGroups[0];
    const headers = headerGroup ? headerGroup.headers : [];
    return (
      <>
        {Array.from({ length: 8 }).map((_, idx) => (
          <TableRow key={idx}>
            {headers.map((header) => (
              <TableCell key={header.id} className='bg-inherit'>
                <Skeleton className='h-5 w-full rounded-md' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  /**
   * Debounced callback for handling search input changes.
   * Delays invoking onChangeTable to reduce frequent queries.
   */
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebouncedCallback((search: string) => {
    onChangeTable({ search, page: 1 });
  }, 300);

  const tableClassName = cn(
    'rt-table',
    { 'table-fixed': fixed },
    { 'rt-table--striped': striped },
    hoverable ? 'rt-table--hoverable' : 'rt-table--no-hover',
  );

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center gap-3 md:justify-between'>
        {allowSearch && (
          <div className='w-full md:max-w-[250px]'>
            <Input
              clearable
              placeholder={searchPlaceholder}
              onChange={(e) => {
                const val = e.target.value;
                debouncedSearch(val);
                setSearch(val);
              }}
              prepend={<Search size={16} />}
              value={search}
            />
          </div>
        )}
        {header}
      </div>

      <div className='rounded-md border overflow-x-auto w-full min-w-0'>
        <TableCom className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnDef = header.column
                    .columnDef as TRDataTableColumnDef<TData, TValue>;
                  const sticky = columnDef.sticky ?? 'none';
                  const offset = columnDef.stickyOffset ?? 0;
                  const headerAlign = (columnDef.headerAlign ??
                    'left') as Alignment;
                  const headerAlignClass =
                    headerAlign === 'left'
                      ? ALIGN_CLASS_MAP.left
                      : `!${ALIGN_CLASS_MAP[headerAlign]}`;
                  const headerJustifyClass = JUSTIFY_CLASS_MAP[headerAlign];
                  const headerDirectionClass =
                    headerAlign === 'right' ? 'flex-row-reverse' : 'flex-row';
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        position: sticky === 'none' ? undefined : 'sticky',
                        left: sticky === 'left' ? offset : undefined,
                        right: sticky === 'right' ? offset : undefined,
                        zIndex: sticky === 'none' ? undefined : 10,
                      }}
                      className={cn('bg-slate-50', headerAlignClass)}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          role='presentation'
                          className={cn(
                            'select-none flex items-center gap-1',
                            headerJustifyClass,
                            headerDirectionClass,
                            header.column.getCanSort()
                              ? 'cursor-pointer hover:text-black'
                              : 'cursor-default',
                          )}
                          onClick={() => handleSort(header)}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <div className='ml-auto'>
                              {{
                                asc: <ArrowUp size={12} />,
                                desc: <ArrowDown size={12} />,
                              }[header.column.getIsSorted() as string] ?? (
                                <ChevronsUpDown
                                  size={12}
                                  className='opacity-20'
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : (
              <>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const columnDef = cell.column
                          .columnDef as TRDataTableColumnDef<TData, TValue>;
                        const sticky = columnDef.sticky ?? 'none';
                        const offset = columnDef.stickyOffset ?? 0;
                        const cellAlign = (columnDef.cellAlign ??
                          columnDef.headerAlign ??
                          'left') as Alignment;
                        const cellAlignClass = ALIGN_CLASS_MAP[cellAlign];
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              position:
                                sticky === 'none' ? undefined : 'sticky',
                              left: sticky === 'left' ? offset : undefined,
                              right: sticky === 'right' ? offset : undefined,
                              zIndex: sticky === 'none' ? undefined : 5,
                              backgroundColor: 'inherit',
                            }}
                            className={cn('bg-inherit', cellAlignClass)}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns?.length ?? 1}
                      className='bg-inherit'
                    >
                      <div className='flex h-24 w-full items-center justify-center text-sm text-muted-foreground'>
                        No results.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </TableCom>
      </div>

      {pagination && (
        <RDataTableFooter
          meta={meta}
          pagesToShow={5}
          onChange={onChangeTable}
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
