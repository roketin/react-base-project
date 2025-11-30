import React, { type MouseEvent, type ReactNode } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Loader2 } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/modules/app/libs/ui-variants';

export type TRBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    debounceMs?: number;
    loading?: boolean;
    loadingLabel?: ReactNode;
    iconStart?: ReactNode;
    iconEnd?: ReactNode;
    soft?: boolean;
  };

const RBtn = React.forwardRef<HTMLButtonElement, TRBtnProps>(
  (
    {
      debounceMs = 200,
      loading = false,
      loadingLabel = 'Loading...',
      disabled,
      onClick,
      children,
      iconStart,
      iconEnd,
      soft = false,
      variant = 'default',
      size = 'default',
      className,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const debouncedOnClick = useDebouncedCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      debounceMs,
      { leading: true, trailing: false },
    );

    const softVariantMap: Record<string, TRBtnProps['variant']> = {
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

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading}
        data-loading={loading ? '' : undefined}
        onClick={debouncedOnClick}
        className={cn(
          buttonVariants({ variant: finalVariant, size }),
          className,
        )}
        {...rest}
      >
        {loading ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
            {loadingLabel && <span className='sr-only'>{loadingLabel}</span>}
          </>
        ) : (
          <>
            {iconStart && (
              <span className='flex items-center'>{iconStart}</span>
            )}
            {children}
            {iconEnd && <span className='flex items-center'>{iconEnd}</span>}
          </>
        )}
      </button>
    );
  },
);

RBtn.displayName = 'RBtn';

export type TRBtnVariantProps = VariantProps<typeof buttonVariants>;

export default RBtn;
