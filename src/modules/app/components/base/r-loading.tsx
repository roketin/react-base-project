import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

type TRLoadingProps = {
  label?: ReactNode;
  fullScreen?: boolean;
  className?: string;
  iconClassName?: string;
  hideLabel?: boolean;
  labelClassName?: string;
};

export function RLoading({
  label = 'Loading...',
  fullScreen = false,
  className,
  iconClassName,
  hideLabel = false,
  labelClassName,
}: TRLoadingProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-3',
        fullScreen && 'min-h-screen',
        className,
      )}
    >
      <Loader2
        className={clsx('size-5 animate-spin text-primary', iconClassName)}
      />
      {!hideLabel && label ? (
        <span
          className={clsx(
            'text-sm font-medium text-muted-foreground',
            labelClassName,
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
