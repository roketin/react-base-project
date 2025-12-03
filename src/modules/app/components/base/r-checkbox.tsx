import { forwardRef, type InputHTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { Check, Minus } from 'lucide-react';

export type TRCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const RCheckbox = forwardRef<HTMLInputElement, TRCheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      wrapperClassName,
      indeterminate = false,
      className,
      disabled,
      id,
      checked,
      onCheckedChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Keep the native indeterminate state in sync for mixed selections
    useEffect(() => {
      if (!inputRef.current) return;
      inputRef.current.indeterminate = !!indeterminate && !checked;
    }, [indeterminate, checked]);

    const handleRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        <div className='flex items-start gap-2'>
          <div className='relative flex items-center'>
            <input
              ref={handleRef}
              type='checkbox'
              id={checkboxId}
              disabled={disabled}
              checked={checked}
              onChange={handleChange}
              className='peer sr-only'
              {...props}
            />
            <label
              htmlFor={checkboxId}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border-2',
                'transition-all duration-200 cursor-pointer',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-0',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                hasError
                  ? 'border-destructive peer-focus-visible:ring-destructive/20'
                  : 'border-input peer-focus-visible:ring-primary/20',
                checked || indeterminate
                  ? hasError
                    ? 'bg-destructive border-destructive'
                    : 'bg-primary border-primary'
                  : 'bg-background hover:border-muted-foreground',
                className,
              )}
            >
              {checked && !indeterminate && (
                <Check className='h-3.5 w-3.5 text-white' strokeWidth={3} />
              )}
              {indeterminate && (
                <Minus className='h-3.5 w-3.5 text-white' strokeWidth={3} />
              )}
            </label>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm text-foreground cursor-pointer select-none leading-5',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {label}
            </label>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-xs ml-7',
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

RCheckbox.displayName = 'RCheckbox';
