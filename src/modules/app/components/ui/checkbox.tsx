'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import { Label } from '@/modules/app/components/ui/label';

function Checkbox({
  className,
  label,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: React.ReactNode;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckboxPrimitive.Root
        data-slot='checkbox'
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-[var(--form-border-color)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--form-focus-ring)]/50 focus-visible:border-[var(--form-focus-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)] data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot='checkbox-indicator'
          className='flex items-center justify-center text-current transition-none'
        >
          <CheckIcon className='size-3.5' />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <Label htmlFor={props.id}>{label}</Label>}
    </div>
  );
}

export { Checkbox };
