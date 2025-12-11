import { cn } from '@/modules/app/libs/utils';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

// Base Table Component
export type TRTableProps = ComponentPropsWithoutRef<'table'> & {
  fixed?: boolean;
  bordered?: boolean;
};

export const RTable = forwardRef<HTMLTableElement, TRTableProps>(
  ({ className, fixed = false, bordered = false, ...props }, ref) => {
    return (
      <div className='w-full min-w-0 overflow-x-auto rounded-md border border-b-0 p-px'>
        <table
          ref={ref}
          className={cn(
            'w-full border-collapse',
            fixed && 'table-fixed',
            bordered && '[&_td]:border [&_th]:border',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
RTable.displayName = 'RTable';

// Table Head Component
export type TRTheadProps = ComponentPropsWithoutRef<'thead'>;

export const RThead = forwardRef<HTMLTableSectionElement, TRTheadProps>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn(className)} {...props} />;
  },
);
RThead.displayName = 'RThead';

// Table Body Component
export type TRTbodyProps = ComponentPropsWithoutRef<'tbody'>;

export const RTbody = forwardRef<HTMLTableSectionElement, TRTbodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn(className)} {...props} />;
  },
);
RTbody.displayName = 'RTbody';

// Table Footer Component
export type TRTfootProps = ComponentPropsWithoutRef<'tfoot'>;

export const RTfoot = forwardRef<HTMLTableSectionElement, TRTfootProps>(
  ({ className, ...props }, ref) => {
    return <tfoot ref={ref} className={cn(className)} {...props} />;
  },
);
RTfoot.displayName = 'RTfoot';

// Table Row Component
export type TRTrProps = ComponentPropsWithoutRef<'tr'> & {
  striped?: boolean;
  hoverable?: boolean;
};

export const RTr = forwardRef<HTMLTableRowElement, TRTrProps>(
  ({ className, striped = false, hoverable = true, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          striped && 'even:bg-muted/50',
          hoverable && 'transition-colors hover:bg-muted/50',
          className,
        )}
        {...props}
      />
    );
  },
);
RTr.displayName = 'RTr';

// Table Header Cell Component
export type TRThProps = ComponentPropsWithoutRef<'th'> & {
  sticky?: 'left' | 'right' | 'none';
  stickyOffset?: number;
  align?: 'left' | 'center' | 'right';
};

export const RTh = forwardRef<HTMLTableCellElement, TRThProps>(
  (
    {
      className,
      sticky = 'none',
      stickyOffset = 0,
      align = 'left',
      style,
      ...props
    },
    ref,
  ) => {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    return (
      <th
        ref={ref}
        style={{
          ...style,
          position: sticky !== 'none' ? 'sticky' : undefined,
          left: sticky === 'left' ? stickyOffset : undefined,
          right: sticky === 'right' ? stickyOffset : undefined,
          zIndex: sticky !== 'none' ? 10 : undefined,
        }}
        className={cn(
          'border-b bg-muted px-4 py-3 font-medium text-muted-foreground transition-colors',
          'text-(length:--table-header-font-size)',
          alignClass,
          className,
        )}
        {...props}
      />
    );
  },
);
RTh.displayName = 'RTh';

// Table Data Cell Component
export type TRTdProps = ComponentPropsWithoutRef<'td'> & {
  sticky?: 'left' | 'right' | 'none';
  stickyOffset?: number;
  align?: 'left' | 'center' | 'right';
};

export const RTd = forwardRef<HTMLTableCellElement, TRTdProps>(
  (
    {
      className,
      sticky = 'none',
      stickyOffset = 0,
      align = 'left',
      style,
      ...props
    },
    ref,
  ) => {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    return (
      <td
        ref={ref}
        style={{
          ...style,
          position: sticky !== 'none' ? 'sticky' : undefined,
          left: sticky === 'left' ? stickyOffset : undefined,
          right: sticky === 'right' ? stickyOffset : undefined,
          zIndex: sticky !== 'none' ? 5 : undefined,
        }}
        className={cn(
          'border-b bg-background px-4 py-3',
          'text-(length:--table-font-size)',
          alignClass,
          className,
        )}
        {...props}
      />
    );
  },
);
RTd.displayName = 'RTd';
