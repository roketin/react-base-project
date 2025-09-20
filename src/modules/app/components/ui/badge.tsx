import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { badgeVariants } from '@/modules/app/components/ui/variants/badge-variants';
import { cn } from '@/modules/app/libs/utils';
import { Slot } from '@radix-ui/react-slot';

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
