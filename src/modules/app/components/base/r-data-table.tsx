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
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

export type TRDataTableProps<TData, TValue> = TLoadable & {
  columns?: ColumnDef<TData, TValue>[];
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
};

export type TRDataTableRef<TData = unknown> = {
  getTable: () => Table<TData>;
};

export type TRDataTableSelected = {
  [key: string]: boolean;
};

/**
 * RDataTableInner is the main internal component that integrates TanStack Table with
 * pagination, sorting, selection, and search functionalities.
 * It manages the table state and communicates changes back to the parent component.
 *
 * @template TData - The type of data displayed in the table rows.
 * @template TValue - The type of values in the table columns.
 * @param {TRDataTableProps<TData, TValue>} props - The properties for configuring the data table.
 * @param {React.Ref<TRDataTableRef<TData>>} ref - The forwarded ref to expose table methods externally.
 * @returns {JSX.Element} The rendered data table component.
 */
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
   * Displays skeleton cells matching the number of headers.
   *
   * @returns {JSX.Element} Skeleton rows for loading state.
   */
  const renderSkeletonRows = () => (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableCell key={header.id}>
                <Skeleton className='h-[20px] w-full rounded-md' />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );

  /**
   * Debounced callback for handling search input changes.
   * Delays invoking onChangeTable to reduce frequent queries.
   */
  const debouncedSearch = useDebouncedCallback((search: string) => {
    onChangeTable({ search, page: 1 });
  }, 300);

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center gap-3 md:justify-between'>
        {allowSearch && (
          <div>
            <Input
              type='search'
              placeholder={searchPlaceholder}
              onChange={(e) => debouncedSearch(e.target.value)}
              prepend={<Search size={16} />}
              className='min-w-[220px]'
            />
          </div>
        )}
        {header}
      </div>

      <div className='rounded-md border'>
        <TableCom className={cn({ 'table-fixed': fixed })}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          role='presentation'
                          className={cn(
                            header.column.getCanSort()
                              ? 'select-none cursor-pointer flex items-center gap-1 hover:text-black'
                              : 'select-none cursor-default',
                          )}
                          onClick={() => handleSort(header)}
                        >
                          {
                            {
                              asc: <ArrowUp size={14} />,
                              desc: <ArrowDown size={14} />,
                            }[header.column.getIsSorted() as string]
                          }
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns?.length ?? 1}>
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
