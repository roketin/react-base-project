import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/modules/app/components/ui/button-variants';
import { cn } from '@/modules/app/libs/utils';
import { LoaderPinwheel } from 'lucide-react';

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && 'opacity-50 cursor-not-allowed',
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderPinwheel className='animate-spin' />}
      {children}
    </Comp>
  );
}

export default Button;
