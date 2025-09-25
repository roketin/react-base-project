import Button from '@/modules/app/components/ui/button';
import { cn } from '@/modules/app/libs/utils';
import React, { useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';

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
  const hasError = useMemo<boolean>(() => !!ariaInvalid, [ariaInvalid]);

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
          'placeholder-gray-400',
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
