import React, { type MouseEvent, type ReactNode } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Loader2 } from 'lucide-react';
import Button from '@/modules/app/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/modules/app/components/ui/variants/button-variants';

// ✅ Define props
export type TRBtnProps = React.ComponentProps<typeof Button> & {
  debounceMs?: number;
  loading?: boolean;
  loadingLabel?: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
};

// ✅ Use new React 19 forwardRef style (no more ElementRef)
const RBtn = React.forwardRef(function RBtn(
  {
    debounceMs = 200,
    loading = false,
    loadingLabel = 'Loading...',
    disabled,
    onClick,
    children,
    iconStart,
    iconEnd,
    ...rest
  }: TRBtnProps,
  ref: React.ForwardedRef<HTMLButtonElement>, // 👈 direct ref type
) {
  // Use useDebouncedCallback to debounce click handler
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

  return (
    <Button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      data-loading={loading ? '' : undefined}
      onClick={debouncedOnClick}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 className='size-4 animate-spin' aria-hidden='true' />
          <span className='sr-only'>{loadingLabel}</span>
        </>
      ) : (
        <>
          {iconStart && (
            <span className='mr-0.5 flex items-center'>{iconStart}</span>
          )}
          {children}
          {iconEnd && (
            <span className='ml-0.5 flex items-center'>{iconEnd}</span>
          )}
        </>
      )}
    </Button>
  );
});

export type TRBtnVariantProps = React.ComponentProps<typeof RBtn> &
  VariantProps<typeof buttonVariants>;

export default RBtn;
