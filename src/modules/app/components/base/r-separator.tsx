import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

export const RSeparator = forwardRef<HTMLDivElement, TRSeparatorProps>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
        {...props}
      />
    );
  },
);

RSeparator.displayName = 'RSeparator';
