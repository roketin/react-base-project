import {
  createContext,
  forwardRef,
  useContext,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '@/modules/app/libs/utils';

type TRadioGroupContext = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<TRadioGroupContext | null>(null);

export type TRRadioGroupProps = {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  children?: React.ReactNode;
};

export type TRRadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name'
> & {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export const RRadio = forwardRef<HTMLInputElement, TRRadioProps>(
  (
    {
      value,
      label,
      description,
      className,
      disabled: itemDisabled,
      id,
      ...props
    },
    ref,
  ) => {
    const context = useContext(RadioGroupContext);

    if (!context) {
      throw new Error('RRadio must be used within RRadioGroup');
    }

    const {
      name,
      value: groupValue,
      onChange,
      disabled: groupDisabled,
    } = context;
    const isChecked = groupValue === value;
    const isDisabled = groupDisabled || itemDisabled;
    const radioId = id || `radio-${name}-${value}`;

    const handleChange = () => {
      if (!isDisabled && onChange) {
        onChange(value);
      }
    };

    return (
      <div className='flex items-start gap-2'>
        <div className='relative flex items-center'>
          <input
            ref={ref}
            type='radio'
            id={radioId}
            name={name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={handleChange}
            className='peer sr-only'
            {...props}
          />
          <label
            htmlFor={radioId}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2',
              'transition-all duration-200 cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-offset-0 peer-focus:ring-primary/20',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              isChecked
                ? 'border-primary bg-white'
                : 'border-slate-300 bg-white',
              className,
            )}
          >
            {isChecked && (
              <div className='h-2.5 w-2.5 rounded-full bg-primary' />
            )}
          </label>
        </div>

        {(label || description) && (
          <div className='flex flex-col gap-0.5'>
            {label && (
              <label
                htmlFor={radioId}
                className={cn(
                  'text-sm text-slate-700 cursor-pointer select-none',
                  isDisabled && 'opacity-50 cursor-not-allowed',
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
    );
  },
);

RRadio.displayName = 'RRadio';

export const RRadioGroup = forwardRef<HTMLDivElement, TRRadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onChange,
      label,
      error,
      helperText,
      wrapperClassName,
      orientation = 'vertical',
      disabled = false,
      children,
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', wrapperClassName)}>
        {label && (
          <p
            className={cn(
              'text-sm font-medium text-slate-700',
              disabled && 'opacity-50',
            )}
          >
            {label}
          </p>
        )}

        <RadioGroupContext.Provider
          value={{
            name,
            value: value ?? defaultValue,
            onChange,
            disabled,
          }}
        >
          <div
            className={cn(
              'flex gap-4',
              orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            )}
          >
            {children}
          </div>
        </RadioGroupContext.Provider>

        {(error || helperText) && (
          <p
            className={cn(
              'text-xs',
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

RRadioGroup.displayName = 'RRadioGroup';
