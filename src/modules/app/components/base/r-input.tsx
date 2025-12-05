import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { inputVariants } from '@/modules/app/libs/ui-variants';
import { X } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';

export type TRInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants> & {
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
      size = 'default',
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const [internalValue, setInternalValue] = useState(value ?? '');
    const currentValue = value !== undefined ? value : internalValue;
    const showClearButton = clearable && currentValue && !disabled;

    // Icon padding based on size
    const iconPaddingLeft = {
      xs: 'pl-7',
      sm: 'pl-8',
      default: 'pl-10',
      lg: 'pl-10',
    };

    const iconPaddingRight = {
      xs: 'pr-7',
      sm: 'pr-8',
      default: 'pr-10',
      lg: 'pr-10',
    };

    const iconPositionLeft = {
      xs: 'left-2',
      sm: 'left-2.5',
      default: 'left-3',
      lg: 'left-3',
    };

    const iconPositionRight = {
      xs: 'right-2',
      sm: 'right-2.5',
      default: 'right-3',
      lg: 'right-3',
    };

    const clearIconSize = {
      xs: 12,
      sm: 14,
      default: 16,
      lg: 16,
    };

    const sizeKey = (size ?? 'default') as 'xs' | 'sm' | 'default' | 'lg';

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
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-muted-foreground',
                iconPositionLeft[sizeKey],
              )}
            >
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
              inputVariants({ size: sizeKey }),
              leftIcon && iconPaddingLeft[sizeKey],
              (rightIcon || showClearButton) && iconPaddingRight[sizeKey],
              inputClassName,
            )}
            {...props}
          />

          {showClearButton && !rightIcon && (
            <button
              type='button'
              onClick={handleClear}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors',
                iconPositionRight[sizeKey],
              )}
            >
              <X size={clearIconSize[sizeKey]} />
            </button>
          )}

          {rightIcon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-muted-foreground',
                iconPositionRight[sizeKey],
              )}
            >
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
