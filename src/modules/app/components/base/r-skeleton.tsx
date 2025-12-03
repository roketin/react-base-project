import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRSkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
};

export const RSkeleton = forwardRef<HTMLDivElement, TRSkeletonProps>(
  ({ className, variant = 'default', animation = 'pulse', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted',
          animation === 'pulse' && 'animate-pulse',
          animation === 'wave' &&
            'animate-shimmer bg-linear-to-r from-muted via-muted/50 to-muted bg-size-[200%_100%]',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-md',
          variant === 'text' && 'rounded h-4',
          variant === 'default' && 'rounded-md',
          className,
        )}
        {...props}
      />
    );
  },
);

RSkeleton.displayName = 'RSkeleton';
