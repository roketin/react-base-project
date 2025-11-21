'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CircleIcon } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import { Label } from '@/modules/app/components/ui/label';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot='radio-group'
      className={cn('grid gap-3', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  label,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  label?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className='flex items-center gap-2'>
      <RadioGroupPrimitive.Item
        data-slot='radio-group-item'
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-[var(--form-border-color)] text-primary shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--form-focus-ring)]/50 focus-visible:border-[var(--form-focus-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 transition-[color,box-shadow]',
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          data-slot='radio-group-indicator'
          className='relative flex items-center justify-center'
        >
          <CircleIcon className='fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2' />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {(children || label) && (
        <Label htmlFor={props.id}>{children ?? label}</Label>
      )}
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
