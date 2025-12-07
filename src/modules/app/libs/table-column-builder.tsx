import type { ReactNode } from 'react';
import type {
  TRDataTableColumnDef,
  StickyPosition,
} from '@/modules/app/components/base/r-data-table';
import {
  tableCellDate,
  tableCurrency,
  tableCellLink,
} from '@/modules/app/libs/table-utils';
import { DATE_FORMAT } from '@/modules/app/constants/app.constant';
import { RCheckbox } from '@/modules/app/components/base/r-checkbox';
import { RBadge } from '@/modules/app/components/base/r-badge';

type Alignment = 'left' | 'center' | 'right';

/**
 * Options for text column
 */
export type TextColumnOptions<TData> = {
  /** Accessor key for the data property */
  accessorKey: string;
  /** Column header text */
  header: string;
  /** Column width */
  size?: number;
  /** Sticky position */
  sticky?: StickyPosition;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Header alignment */
  headerAlign?: Alignment;
  /** Cell alignment */
  cellAlign?: Alignment;
  /** Custom render function */
  render?: (value: unknown, row: TData) => ReactNode;
};

/**
 * Options for number column
 */
export type NumberColumnOptions<TData> = Omit<
  TextColumnOptions<TData>,
  'render'
> & {
  /** Number formatter */
  format?: (value: number) => string;
  /** Fallback value when null/undefined */
  fallback?: string;
};

/**
 * Options for date column
 */
export type DateColumnOptions = {
  /** Accessor key for the data property */
  accessorKey: string;
  /** Column header text */
  header: string;
  /** Column width */
  size?: number;
  /** Date format (dayjs format) */
  format?: string;
  /** Fallback value when null/undefined */
  fallback?: string;
  /** Sticky position */
  sticky?: StickyPosition;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Header alignment */
  headerAlign?: Alignment;
  /** Cell alignment */
  cellAlign?: Alignment;
};

/**
 * Options for currency column
 */
export type CurrencyColumnOptions = {
  /** Accessor key for the data property */
  accessorKey: string;
  /** Column header text */
  header: string;
  /** Column width */
  size?: number;
  /** Currency prefix */
  prefix?: string;
  /** Fallback value when null/undefined */
  fallback?: string;
  /** Sticky position */
  sticky?: StickyPosition;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Header alignment */
  headerAlign?: Alignment;
  /** Cell alignment */
  cellAlign?: Alignment;
};

/**
 * Options for badge column
 */
export type BadgeColumnOptions<TData> = {
  /** Accessor key for the data property */
  accessorKey: string;
  /** Column header text */
  header: string;
  /** Column width */
  size?: number;
  /** Custom render function for badge */
  render?: (value: unknown, row: TData) => ReactNode;
  /** Sticky position */
  sticky?: StickyPosition;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Header alignment */
  headerAlign?: Alignment;
  /** Cell alignment */
  cellAlign?: Alignment;
};

/**
 * Options for action column
 */
export type ActionColumnOptions<TData> = {
  /** Column header text */
  header?: string;
  /** Column width */
  size?: number;
  /** Sticky position */
  sticky?: StickyPosition;
  /** Render function for action buttons */
  render: (row: TData) => ReactNode;
  /** Header alignment */
  headerAlign?: Alignment;
  /** Cell alignment */
  cellAlign?: Alignment;
};

/**
 * Options for checkbox column
 */
export type CheckboxColumnOptions = {
  /** Column width */
  size?: number;
  /** Sticky position */
  sticky?: StickyPosition;
};

/**
 * Options for link column
 */
export type LinkColumnOptions<TData> = {
  /** Accessor key for the data property */
  accessorKey: string;
  /** Column header text */
  header: string;
  /** Column width */
  size?: number;
  /** Sticky position */
  sticky?: StickyPosition;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Header alignment */
  headerAlign?: Alignment;
  /** Cell alignment */
  cellAlign?: Alignment;
  /** Static href */
  href?: string;
  /** Route name for named routes */
  routeName?: string;
  /** Route params - can be static or function to get from row */
  routeParams?:
    | Record<string, string>
    | ((row: TData) => Record<string, string>);
  /** Route query params - can be static or function to get from row */
  routeQuery?:
    | Record<string, string | number | boolean>
    | ((row: TData) => Record<string, string | number | boolean>);
  /** Link target */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Custom label render function */
  renderLabel?: (value: unknown, row: TData) => ReactNode;
};

/**
 * Table Column Builder - Fluent API for building table columns
 *
 * @example
 * ```typescript
 * const columns = createTableColumns<User>()
 *   .text({ header: 'Name', accessorKey: 'name' })
 *   .date({ header: 'Created', accessorKey: 'created_at' })
 *   .action({ render: (user) => <Actions user={user} /> })
 *   .build();
 * ```
 */
export class TableColumnBuilder<TData> {
  private columns: TRDataTableColumnDef<TData, unknown>[] = [];

  /**
   * Add a custom column definition
   */
  column(def: TRDataTableColumnDef<TData, unknown>): this {
    this.columns.push(def);
    return this;
  }

  /**
   * Add a text column
   */
  text(options: TextColumnOptions<TData>): this {
    const {
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      render,
    } = options;

    this.columns.push({
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      cell: render
        ? ({ row }) =>
            render(row.original[accessorKey as keyof TData], row.original)
        : undefined,
    });

    return this;
  }

  /**
   * Add a number column with optional formatting
   */
  number(options: NumberColumnOptions<TData>): this {
    const {
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      format,
      fallback = '-',
    } = options;

    this.columns.push({
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      cell: ({ getValue }) => {
        const value = getValue<number | null | undefined>();
        if (value === null || value === undefined) return fallback;
        return format ? format(value) : value;
      },
    });

    return this;
  }

  /**
   * Add a date column with formatting
   */
  date(options: DateColumnOptions): this {
    const {
      accessorKey,
      header,
      size,
      format = DATE_FORMAT.short,
      fallback = '-',
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
    } = options;

    this.columns.push({
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      cell: ({ getValue }) => {
        const value = getValue<string | null | undefined>();
        return tableCellDate(value, format) || fallback;
      },
    });

    return this;
  }

  /**
   * Add a currency column with formatting
   */
  currency(options: CurrencyColumnOptions): this {
    const {
      accessorKey,
      header,
      size,
      prefix = 'Rp ',
      fallback = '-',
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
    } = options;

    this.columns.push({
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      cell: ({ getValue }) => {
        const value = getValue<number | null | undefined>();
        if (value === null || value === undefined) return fallback;
        const formatted = tableCurrency(value, 0, false);
        return prefix ? `${prefix}${formatted}` : formatted;
      },
    });

    return this;
  }

  /**
   * Add a badge/tag column
   */
  badge(options: BadgeColumnOptions<TData>): this {
    const {
      accessorKey,
      header,
      size,
      render,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
    } = options;

    this.columns.push({
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      cell: render
        ? ({ row }) =>
            render(row.original[accessorKey as keyof TData], row.original)
        : ({ getValue }) => (
            <RBadge variant='secondary'>{String(getValue())}</RBadge>
          ),
    });

    return this;
  }

  /**
   * Add an action column (typically for buttons)
   */
  action(options: ActionColumnOptions<TData>): this {
    const {
      header = 'Action',
      size = 100,
      sticky = 'left',
      render,
      headerAlign,
      cellAlign,
    } = options;

    this.columns.push({
      id: 'actions',
      header,
      size,
      sticky,
      enableSorting: false,
      headerAlign,
      cellAlign,
      cell: ({ row }) => render(row.original),
    });

    return this;
  }

  /**
   * Add a checkbox selection column
   */
  checkbox(options?: CheckboxColumnOptions): this {
    const { size = 50, sticky } = options || {};

    this.columns.push({
      id: 'select',
      size,
      sticky,
      enableSorting: false,
      header: ({ table }) => {
        const checked = table.getIsAllPageRowsSelected();
        const indeterminate = table.getIsSomePageRowsSelected();
        return (
          <RCheckbox
            checked={checked}
            indeterminate={indeterminate}
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        );
      },
      cell: ({ row }) => {
        const checked = row.getIsSelected();
        return (
          <RCheckbox
            checked={checked}
            disabled={!row.getCanSelect()}
            onCheckedChange={() => row.toggleSelected()}
          />
        );
      },
    });

    return this;
  }

  /**
   * Add a link column
   */
  link(options: LinkColumnOptions<TData>): this {
    const {
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      href,
      routeName,
      routeParams,
      routeQuery,
      target,
      renderLabel,
    } = options;

    this.columns.push({
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      cell: ({ row }) => {
        const value = row.original[accessorKey as keyof TData];
        const label = renderLabel
          ? renderLabel(value, row.original)
          : String(value ?? '-');

        const params =
          typeof routeParams === 'function'
            ? routeParams(row.original)
            : routeParams;

        const query =
          typeof routeQuery === 'function'
            ? routeQuery(row.original)
            : routeQuery;

        return tableCellLink(label, {
          href,
          routeName,
          routeParams: params,
          routeQuery: query,
          target,
        });
      },
    });

    return this;
  }

  /**
   * Build and return the columns array
   */
  build(): TRDataTableColumnDef<TData, unknown>[] {
    return this.columns;
  }
}

/**
 * Create a new table column builder
 *
 * @example
 * ```typescript
 * const columns = createTableColumns<User>()
 *   .text({ header: 'Name', accessorKey: 'name' })
 *   .date({ header: 'Created', accessorKey: 'created_at' })
 *   .build();
 * ```
 */
export function createTableColumns<TData>(): TableColumnBuilder<TData> {
  return new TableColumnBuilder<TData>();
}
