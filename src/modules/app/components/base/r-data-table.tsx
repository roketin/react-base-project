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

export type TRDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  fixed: boolean;
  pagination: boolean;
  onChange: (params: Partial<TApiDefaultQueryParams>) => void;
  onChangeSelected: (ids: TRDataTableSelected) => void;
  meta: TApiResponsePaginateMeta | null;
  transformSort: (key: string) => string;
  rowId: string | null;
  header: React.ReactElement;
  footer: React.ReactElement;
  allowSearch: boolean;
  initialSelected: TRDataTableSelected;
};

export type TRDataTableRef = {
  getTable: () => Table<unknown>;
};

export type TRDataTableFooterProps = {
  meta: TApiResponsePaginateMeta | null;
  pagesToShow: number;
  onChange: (page: number) => void;
  disabled: boolean;
};

export type TRDataTableSelected = {
  [key: string]: boolean;
};

// RDataTableInner wires up tanstack table state along with pagination and selection handlers.
const RDataTableInner = <TData, TValue>(
  {
    columns = [],
    data = [],
    loading = false,
    fixed = false,
    pagination = true,
    onChange,
    onChangeSelected,
    meta,
    transformSort,
    rowId = 'id',
    allowSearch = true,
    header,
    footer,
    initialSelected = {},
  }: Partial<TRDataTableProps<TData, TValue>>,
  ref: React.Ref<TRDataTableRef>,
) => {
  const tableMeta = meta ?? null;

  const [rowSelection, setRowSelection] =
    useState<TRDataTableSelected>(initialSelected);
  const [sorting, setSorting] = useState<SortingState>([]);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowId: (row: any, index) => {
      const id = rowId ? row[rowId] : index;
      return id as string;
    },
  });

  /**
   * Relay table-related query param updates back to the parent consumers.
   */
  const onChangeTable = useCallback(
    (params: Partial<TApiDefaultQueryParams>) => {
      if (onChange) {
        onChange(params);
      }
    },
    [onChange],
  );

  // Tracking sorting
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

  // Tracking selected
  useEffect(() => {
    if (onChangeSelected) {
      onChangeSelected(rowSelection);
    }
  }, [onChangeSelected, rowSelection]);

  // Function for accessing table from outside
  useImperativeHandle(ref, () => ({
    getTable() {
      return table;
    },
  }));

  // Toggle the sorting state of the clicked header, respecting the existing sort order.
  const handleSort = useCallback((header: Header<TData, unknown>) => {
    if (!header.column.getCanSort()) return;
    const isSorted = header.column.getIsSorted();
    if (!isSorted) return header.column.toggleSorting(false);
    if (isSorted === 'asc') return header.column.toggleSorting(true);
    if (isSorted === 'desc') return header.column.clearSorting();
  }, []);

  // Render placeholder rows while data is loading to preserve table layout.
  const renderSkeletonRows = () => (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableCell key={header.id}>
                <Skeleton className='w-full h-[20px] rounded-md' />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );

  // Debounce search
  const debounced = useDebouncedCallback((search) => {
    onChangeTable({ search, page: 1 });
  }, 400);

  return (
    <div>
      <div className='flex items-center gap-2 mb-4'>
        {header}
        {allowSearch && (
          <div className='relative'>
            <Input
              type='search'
              placeholder='Search...'
              onChange={(e) => debounced(e.target.value)}
              prepend={<Search size={16} />}
            />
          </div>
        )}
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
                {table.getRowModel().rows?.length ? (
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
                    <TableCell colSpan={columns.length}>
                      <div className='w-full h-24 flex justify-center items-center'>
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
          meta={tableMeta}
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
  props: Partial<TRDataTableProps<TData, TValue>> & {
    ref?: React.Ref<TRDataTableRef>;
  },
) => ReturnType<typeof RDataTableInner>;
