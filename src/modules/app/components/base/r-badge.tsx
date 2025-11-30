import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { badgeVariants } from '@/modules/app/libs/ui-variants';

export type TRBadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    onRemove?: () => void;
    removable?: boolean;
    dot?: boolean;
  };

export const RBadge = forwardRef<HTMLDivElement, TRBadgeProps>(
  (
    {
      className,
      variant,
      size,
      children,
      onRemove,
      removable = false,
      dot = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span className='h-1.5 w-1.5 rounded-full bg-current opacity-75' />
        )}
        {children}
        {(removable || onRemove) && (
          <button
            type='button'
            onClick={onRemove}
            className='ml-0.5 rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current'
            aria-label='Remove'
          >
            <X className='h-3 w-3' />
          </button>
        )}
      </div>
    );
  },
);

RBadge.displayName = 'RBadge';
