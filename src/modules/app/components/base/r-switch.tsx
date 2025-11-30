import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TRSwitchProps<T = boolean> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'size'
> & {
  label?: string;
  description?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  // Custom value support
  value?: T;
  onValueChange?: (value: T) => void;
  trueValue?: T;
  falseValue?: T;
};

export const RSwitch = forwardRef<HTMLInputElement, TRSwitchProps>(
  (
    {
      label,
      description,
      error,
      helperText,
      wrapperClassName,
      className,
      disabled,
      id,
      checked: controlledChecked,
      onCheckedChange,
      value,
      onValueChange,
      trueValue = true,
      falseValue = false,
      ...props
    },
    ref,
  ) => {
    const switchId =
      id || `switch-${Math.random().toString(36).substring(2, 11)}`;
    const hasError = !!error;

    // Determine checked state
    const isChecked =
      controlledChecked !== undefined
        ? controlledChecked
        : value !== undefined
          ? value === trueValue
          : false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;

      // Call onCheckedChange if provided
      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }

      // Call onValueChange if provided
      if (onValueChange) {
        onValueChange(newChecked ? trueValue : falseValue);
      }

      // Call original onChange if provided
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        <div className='flex items-start gap-3'>
          <div className='relative flex items-center'>
            <input
              ref={ref}
              type='checkbox'
              id={switchId}
              disabled={disabled}
              checked={isChecked}
              onChange={handleChange}
              className='peer sr-only'
              {...props}
            />
            <label
              htmlFor={switchId}
              className={cn(
                'relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                hasError
                  ? 'bg-red-200 peer-checked:bg-red-500 peer-focus-visible:ring-red-500/20'
                  : 'bg-slate-200 peer-checked:bg-primary peer-focus-visible:ring-primary/20',
                className,
              )}
            >
              <span
                className={cn(
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                  isChecked ? 'translate-x-5' : 'translate-x-0.5',
                )}
              />
            </label>
          </div>

          {(label || description) && (
            <div className='flex flex-col gap-0.5'>
              {label && (
                <label
                  htmlFor={switchId}
                  className={cn(
                    'text-sm font-medium text-slate-700 cursor-pointer select-none',
                    disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className='text-xs text-slate-500'>{description}</p>
              )}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-xs ml-14',
              hasError ? 'text-red-500' : 'text-slate-500',
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

RSwitch.displayName = 'RSwitch';
