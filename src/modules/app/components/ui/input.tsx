import Button from '@/modules/app/components/ui/button';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';
import { getFieldWrapperClassName } from '@/modules/app/components/ui/variants/field-variants';
import { cn } from '@/modules/app/libs/utils';
import { X } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

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
  density,
  disabled,
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
      className={getFieldWrapperClassName({
        hasError,
        disabled,
        className,
      })}
    >
      {prepend && <span className='flex items-center pl-3'>{prepend}</span>}

      <input
        ref={props.ref}
        type={type}
        data-slot='input'
        className={cn(
          inputVariants({ size: density }),
          'placeholder-gray-400',
          prepend ? 'pl-3' : 'pl-3',
          append ? 'pr-3' : 'pr-3',
          className,
        )}
        aria-invalid={ariaInvalid}
        disabled={disabled}
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
