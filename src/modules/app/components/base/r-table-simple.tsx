import {
  forwardRef,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRTableSimpleProps = HTMLAttributes<HTMLTableElement> & {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'default' | 'sm' | 'lg';
};

const RTableSimple = forwardRef<HTMLTableElement, TRTableSimpleProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div className='relative w-full overflow-auto'>
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom text-sm',
            variant === 'bordered' && 'border border-slate-200',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

RTableSimple.displayName = 'RTableSimple';

const RTableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));

RTableHeader.displayName = 'RTableHeader';

const RTableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));

RTableBody.displayName = 'RTableBody';

const RTableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-slate-50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));

RTableFooter.displayName = 'RTableFooter';

const RTableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-slate-50 data-[state=selected]:bg-slate-100',
      className,
    )}
    {...props}
  />
));

RTableRow.displayName = 'RTableRow';

const RTableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));

RTableHead.displayName = 'RTableHead';

const RTableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));

RTableCell.displayName = 'RTableCell';

const RTableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-slate-500', className)}
    {...props}
  />
));

RTableCaption.displayName = 'RTableCaption';

export {
  RTableSimple,
  RTableHeader,
  RTableBody,
  RTableFooter,
  RTableRow,
  RTableHead,
  RTableCell,
  RTableCaption,
};
