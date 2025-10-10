import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/modules/app/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/modules/app/components/ui/variants/button-variants';

// ✅ Define props
type RBtnProps = React.ComponentProps<typeof Button> & {
  debounceMs?: number;
  loading?: boolean;
  loadingLabel?: ReactNode;
};

// ✅ Use new React 19 forwardRef style (no more ElementRef)
const RBtn = React.forwardRef(function RBtn(
  {
    debounceMs = 500,
    loading = false,
    loadingLabel = 'Loading...',
    disabled,
    onClick,
    children,
    ...rest
  }: RBtnProps,
  ref: React.ForwardedRef<HTMLButtonElement>, // 👈 direct ref type
) {
  const [isDebounced, setIsDebounced] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (loading || isDebounced) {
        event.preventDefault();
        return;
      }

      onClick?.(event);

      if (event.defaultPrevented || debounceMs <= 0) return;

      setIsDebounced(true);
      timeoutRef.current = setTimeout(() => {
        setIsDebounced(false);
        timeoutRef.current = null;
      }, debounceMs);
    },
    [debounceMs, isDebounced, loading, onClick],
  );

  return (
    <Button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      data-loading={loading ? '' : undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 className='size-4 animate-spin' aria-hidden='true' />
          <span className='sr-only'>{loadingLabel}</span>
        </>
      ) : null}
      {children}
    </Button>
  );
});

export type TRBtnProps = React.ComponentProps<typeof RBtn> &
  VariantProps<typeof buttonVariants>;

export default RBtn;
