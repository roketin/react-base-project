import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-slate-700',
        error: 'text-red-500',
        success: 'text-green-600',
        muted: 'text-slate-500',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      required: false,
    },
  },
);

export type TRLabelProps = LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };

export const RLabel = forwardRef<HTMLLabelElement, TRLabelProps>(
  ({ className, variant, size, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, size, required }), className)}
        {...props}
      >
        {children}
      </label>
    );
  },
);

RLabel.displayName = 'RLabel';
