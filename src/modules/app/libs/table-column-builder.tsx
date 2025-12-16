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
import {
  RBadge,
  type TRBadgeProps,
} from '@/modules/app/components/base/r-badge';

type Alignment = 'left' | 'center' | 'right';

/** Helper type to get nested keys with dot notation */
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends
        | string
        | number
        | boolean
        | null
        | undefined
        | Date
        ? K
        : T[K] extends object
          ? K | `${K}.${NestedKeyOf<T[K]>}`
          : K;
    }[keyof T & string]
  : never;

/**
 * Common column options shared across all column types
 */
type CommonColumnOptions = {
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
  /** Hide column by default */
  hidden?: boolean;
};

/**
 * Options for text column
 */
export type TextColumnOptions<
  TData,
  K extends NestedKeyOf<TData> = NestedKeyOf<TData>,
> = CommonColumnOptions & {
  /** Accessor key for the data property */
  accessorKey: K;
  /** Column header text */
  header: string;
  /** Custom render function */
  render?: (value: unknown, row: TData) => ReactNode;
};

/**
 * Options for number column
 */
export type NumberColumnOptions<
  TData,
  K extends NestedKeyOf<TData> = NestedKeyOf<TData>,
> = CommonColumnOptions & {
  /** Accessor key for the data property */
  accessorKey: K;
  /** Column header text */
  header: string;
  /** Number formatter */
  format?: (value: number) => string;
  /** Fallback value when null/undefined */
  fallback?: string;
};

/**
 * Options for date column
 */
export type DateColumnOptions<
  TData,
  K extends NestedKeyOf<TData> = NestedKeyOf<TData>,
> = CommonColumnOptions & {
  /** Accessor key for the data property */
  accessorKey: K;
  /** Column header text */
  header: string;
  /** Date format (dayjs format) */
  format?: string;
  /** Fallback value when null/undefined */
  fallback?: string;
};

/**
 * Options for currency column
 */
export type CurrencyColumnOptions<
  TData,
  K extends NestedKeyOf<TData> = NestedKeyOf<TData>,
> = CommonColumnOptions & {
  /** Accessor key for the data property */
  accessorKey: K;
  /** Column header text */
  header: string;
  /** Currency prefix */
  prefix?: string;
  /** Fallback value when null/undefined */
  fallback?: string;
};

/**
 * Badge variant type extracted from RBadge props
 */
type BadgeVariant = TRBadgeProps['variant'];
type BadgeSize = TRBadgeProps['size'];

/**
 * Options for badge column
 */
export type BadgeColumnOptions<
  TData,
  K extends NestedKeyOf<TData> = NestedKeyOf<TData>,
> = CommonColumnOptions & {
  /** Accessor key for the data property */
  accessorKey: K;
  /** Column header text */
  header: string;
  /** Custom render function for badge (overrides variant/badgeSize/label) */
  render?: (value: unknown, row: TData) => ReactNode;
  /** Static variant or function to determine variant based on value */
  variant?: BadgeVariant | ((value: unknown, row: TData) => BadgeVariant);
  /** Static badge size or function to determine size based on value */
  badgeSize?: BadgeSize | ((value: unknown, row: TData) => BadgeSize);
  /** Static label or function to transform the displayed text */
  label?: string | ((value: unknown, row: TData) => string);
};

/**
 * Options for action column
 */
export type ActionColumnOptions<TData> = Omit<
  CommonColumnOptions,
  'enableSorting'
> & {
  /** Column header text */
  header?: string;
  /** Render function for action buttons */
  render: (row: TData) => ReactNode;
};

/**
 * Options for checkbox column
 */
export type CheckboxColumnOptions = Pick<
  CommonColumnOptions,
  'size' | 'sticky' | 'hidden'
>;

/**
 * Options for row number column
 */
export type RowNumberColumnOptions = Omit<
  CommonColumnOptions,
  'enableSorting'
> & {
  /** Column header text */
  header?: string;
};

/**
 * Options for link column
 */
export type LinkColumnOptions<
  TData,
  K extends NestedKeyOf<TData> = NestedKeyOf<TData>,
> = CommonColumnOptions & {
  /** Accessor key for the data property */
  accessorKey: K;
  /** Column header text */
  header: string;
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
  text<K extends NestedKeyOf<TData>>(
    options: TextColumnOptions<TData, K>,
  ): this {
    const {
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      hidden,
      render,
    } = options;

    this.columns.push({
      accessorKey: accessorKey as string,
      header,
      size,
      sticky,
      enableSorting,
      enableHiding: !hidden,
      headerAlign,
      cellAlign,
      cell: render
        ? ({ row }) =>
            render(row.original[accessorKey as keyof TData], row.original)
        : ({ getValue }) => String(getValue() ?? '-'),
    });

    return this;
  }

  /**
   * Add a number column with optional formatting
   */
  number<K extends NestedKeyOf<TData>>(
    options: NumberColumnOptions<TData, K>,
  ): this {
    const {
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      hidden,
      format,
      fallback = '-',
    } = options;

    this.columns.push({
      accessorKey: accessorKey as string,
      header,
      size,
      sticky,
      enableSorting,
      enableHiding: !hidden,
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
  date<K extends NestedKeyOf<TData>>(
    options: DateColumnOptions<TData, K>,
  ): this {
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
      hidden,
    } = options;

    this.columns.push({
      accessorKey: accessorKey as string,
      header,
      size,
      sticky,
      enableSorting,
      enableHiding: !hidden,
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
  currency<K extends NestedKeyOf<TData>>(
    options: CurrencyColumnOptions<TData, K>,
  ): this {
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
      hidden,
    } = options;

    this.columns.push({
      accessorKey: accessorKey as string,
      header,
      size,
      sticky,
      enableSorting,
      enableHiding: !hidden,
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
  badge<K extends NestedKeyOf<TData>>(
    options: BadgeColumnOptions<TData, K>,
  ): this {
    const {
      accessorKey,
      header,
      size: columnSize,
      render,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      hidden,
    } = options;

    const variantOption = options.variant ?? 'secondary';
    const sizeOption = options.badgeSize ?? 'lg';
    const labelOption = options.label;

    this.columns.push({
      accessorKey: accessorKey as string,
      header,
      size: columnSize,
      sticky,
      enableSorting,
      enableHiding: !hidden,
      headerAlign,
      cellAlign,
      cell: render
        ? ({ row }) => {
            // Support nested accessor like 'status.value'
            const value = this.getNestedValue(
              row.original,
              accessorKey as string,
            );
            return render(value, row.original);
          }
        : ({ row, getValue }) => {
            const value = getValue();
            const resolvedVariant =
              typeof variantOption === 'function'
                ? variantOption(value, row.original)
                : variantOption;
            const resolvedSize =
              typeof sizeOption === 'function'
                ? sizeOption(value, row.original)
                : sizeOption;
            const resolvedLabel =
              typeof labelOption === 'function'
                ? labelOption(value, row.original)
                : (labelOption ?? String(value ?? '-'));
            return (
              <RBadge variant={resolvedVariant} size={resolvedSize}>
                {resolvedLabel}
              </RBadge>
            );
          },
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
      hidden,
    } = options;

    this.columns.push({
      id: 'actions',
      header,
      size,
      sticky,
      enableSorting: false,
      enableHiding: !hidden,
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
    const { size = 50, sticky, hidden } = options || {};

    this.columns.push({
      id: 'select',
      size,
      sticky,
      enableSorting: false,
      enableHiding: !hidden,
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
   * Add a row number column
   */
  rowNumber(options?: RowNumberColumnOptions): this {
    const {
      header = 'No',
      size = 60,
      sticky,
      headerAlign = 'center',
      cellAlign = 'center',
      hidden,
    } = options || {};

    this.columns.push({
      id: 'rowNumber',
      header,
      size,
      sticky,
      enableSorting: false,
      enableHiding: !hidden,
      headerAlign,
      cellAlign,
      cell: ({ row }) => row.index + 1,
    });

    return this;
  }

  /**
   * Helper to get nested value from object using dot notation
   * e.g. getNestedValue({ client: { value: 'Test' } }, 'client.value') => 'Test'
   */
  private getNestedValue(obj: TData, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  /**
   * Add a link column
   */
  link<K extends NestedKeyOf<TData>>(
    options: LinkColumnOptions<TData, K>,
  ): this {
    const {
      accessorKey,
      header,
      size,
      sticky,
      enableSorting,
      headerAlign,
      cellAlign,
      hidden,
      href,
      routeName,
      routeParams,
      routeQuery,
      target,
      renderLabel,
    } = options;

    this.columns.push({
      accessorKey: accessorKey as string,
      header,
      size,
      sticky,
      enableSorting,
      enableHiding: !hidden,
      headerAlign,
      cellAlign,
      cell: ({ row }) => {
        // Support nested accessor like 'client.value'
        const value = this.getNestedValue(row.original, accessorKey as string);
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
