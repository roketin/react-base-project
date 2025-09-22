import Button from '@/modules/app/components/ui/button';
import { cn } from '@/modules/app/libs/utils';
import React, { useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';

const inputVariants = cva(
  'w-full min-w-0 rounded-md text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      size: {
        default: 'h-9 px-3 py-1',
        sm: 'h-8 px-2 py-1 text-sm',
        lg: 'h-11 px-4 py-2 text-lg',
        icon: 'h-9 w-9 p-0 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

type TInputSize = 'default' | 'sm' | 'lg' | 'icon';

export type TInputProps = React.ComponentProps<'input'> & {
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  clearable?: boolean;
  density?: TInputSize;
};

function Input({
  className,
  type,
  append,
  prepend,
  'aria-invalid': ariaInvalid,
  onChange,
  clearable = false,
  ...props
}: TInputProps) {
  const hasError = !!ariaInvalid;

  /**
   * Clear value
   */
  const handleClear = useCallback(() => {
    if (onChange) {
      onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [onChange]);

  return (
    <div
      className={cn(
        'relative flex w-full items-center rounded-md border bg-white dark:bg-input/30 transition-[color,box-shadow] shadow-md shadow-slate-100',
        hasError
          ? 'border-destructive ring-destructive/40'
          : 'border-border focus-within:ring-ring/50 focus-within:ring-[3px]',
        className,
      )}
    >
      {prepend && <span className='flex items-center pl-3'>{prepend}</span>}

      <input
        type={type}
        data-slot='input'
        className={cn(
          inputVariants({ size: props.density }),
          prepend ? 'pl-3' : 'pl-3',
          append ? 'pr-3' : 'pr-3',
          className,
        )}
        aria-invalid={ariaInvalid}
        onChange={onChange}
        {...props}
      />

      {append && <span className='flex items-center'>{append}</span>}

      {clearable && (
        <Button
          type='button'
          className='px-2.5'
          variant='ghost'
          onClick={handleClear}
        >
          <X />
        </Button>
      )}
    </div>
  );
}

export { Input };
