import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { getInputClasses } from '@/modules/app/libs/ui-variants';
import { X } from 'lucide-react';

export type TRInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
};

export const RInput = forwardRef<HTMLInputElement, TRInputProps>(
  (
    {
      label,
      error,
      helperText,
      wrapperClassName,
      inputClassName,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      id,
      clearable = false,
      onClear,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const [internalValue, setInternalValue] = useState(value ?? '');
    const currentValue = value !== undefined ? value : internalValue;
    const showClearButton = clearable && currentValue && !disabled;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      onClear?.();
      if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div
        className={cn(
          'flex flex-col gap-1.5',
          fullWidth && 'w-full',
          wrapperClassName,
          className,
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {label}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            value={currentValue}
            onChange={handleChange}
            className={cn(
              getInputClasses(hasError),
              leftIcon && 'pl-10',
              (rightIcon || showClearButton) && 'pr-10',
              inputClassName ?? className,
            )}
            {...props}
          />

          {showClearButton && !rightIcon && (
            <button
              type='button'
              onClick={handleClear}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <X size={16} />
            </button>
          )}

          {rightIcon && (
            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-xs',
              hasError ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

RInput.displayName = 'RInput';
