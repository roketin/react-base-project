import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/modules/app/libs/ui-variants';

export type TRButtonGroupProps = {
  children?: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
};

export type TRButtonGroupItemProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  soft?: boolean;
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
          !attached && 'gap-2',
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
  (
    {
      children,
      onClick,
      active,
      disabled,
      className,
      variant = 'outline',
      size = 'default',
      soft = false,
    },
    ref,
  ) => {
    const softVariantMap: Record<string, TRButtonGroupItemProps['variant']> = {
      default: 'soft-default',
      destructive: 'soft-destructive',
      info: 'soft-info',
      success: 'soft-success',
      warning: 'soft-warning',
      error: 'soft-error',
      confirm: 'soft-confirm',
    };

    const finalVariant =
      soft && variant && softVariantMap[variant]
        ? softVariantMap[variant]
        : variant;

    // When active, use primary variant styling
    const activeVariant = active ? 'default' : finalVariant;

    return (
      <button
        ref={ref}
        type='button'
        onClick={onClick}
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: activeVariant, size }),
          // Override shadow for button group items
          'shadow-none',
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
