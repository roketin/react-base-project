import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRButtonGroupProps = {
  children?: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
};

export type TRButtonGroupItemProps = {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

const RButtonGroup = forwardRef<HTMLDivElement, TRButtonGroupProps>(
  (
    { children, className, orientation = 'horizontal', attached = true },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role='group'
        className={cn(
          'inline-flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          attached &&
            orientation === 'horizontal' &&
            '[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:last-child)]:border-r-0',
          attached &&
            orientation === 'vertical' &&
            '[&>button]:rounded-none [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:last-child)]:border-b-0',
          !attached && (orientation === 'horizontal' ? 'gap-2' : 'gap-2'),
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

RButtonGroup.displayName = 'RButtonGroup';

const RButtonGroupItem = forwardRef<HTMLButtonElement, TRButtonGroupItemProps>(
  ({ children, onClick, active, disabled, className }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors',
          'border border-border bg-background hover:bg-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          active && 'bg-primary text-primary-foreground hover:bg-primary/90',
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

RButtonGroupItem.displayName = 'RButtonGroupItem';

export { RButtonGroup, RButtonGroupItem };
