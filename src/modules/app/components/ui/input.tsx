import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';
import { getFieldWrapperClassName } from '@/modules/app/components/ui/variants/field-variants';
import { cn } from '@/modules/app/libs/utils';
import { X } from 'lucide-react';
import React, {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';

export type TInputProps = React.ComponentProps<'input'> & {
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  clearable?: boolean;
  density?: TInputSize;
  showCount?: boolean;
  countLimit?: number;
  countFormatter?: (count: number, limit?: number) => React.ReactNode;
  countType?: 'character' | 'word';
};

function countValue(value: string, type: 'character' | 'word') {
  if (type === 'word') {
    const matches = value.trim().match(/\S+/g);
    return matches ? matches.length : 0;
  }
  return value.length;
}

const Input = forwardRef<HTMLInputElement, TInputProps>(function Input(
  {
    className,
    type,
    append,
    prepend,
    'aria-invalid': ariaInvalid,
    onChange,
    clearable = true,
    density,
    disabled,
    showCount = false,
    countLimit,
    countFormatter,
    countType = 'character',
    value,
    defaultValue,
    ...props
  },
  ref,
) {
  const hasError = useMemo<boolean>(() => !!ariaInvalid, [ariaInvalid]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    () => (defaultValue ?? '') as string,
  );

  useEffect(() => {
    if (isControlled) {
      setInternalValue((value ?? '') as string);
    }
  }, [isControlled, value]);

  const currentValue = isControlled
    ? ((value ?? '') as string)
    : (internalValue ?? '');

  const currentCount = useMemo(
    () => countValue(currentValue ?? '', countType),
    [currentValue, countType],
  );

  const limit = countLimit ?? props.maxLength ?? undefined;
  const formattedCount = useMemo(() => {
    if (!showCount) return null;

    if (countFormatter) {
      return countFormatter(currentCount, limit);
    }

    return limit !== undefined
      ? `${currentCount} / ${limit}`
      : `${currentCount}`;
  }, [showCount, countFormatter, currentCount, limit]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(() => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue('');
    }
    if (onChange) {
      onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [disabled, isControlled, onChange]);

  const shouldShowClear =
    clearable && !disabled && currentValue && currentValue.length > 0;

  return (
    <div className={cn('w-full', showCount && 'space-y-1')}>
      <div
        className={getFieldWrapperClassName({
          hasError,
          disabled,
        })}
      >
        {prepend && <span className='flex items-center pl-3'>{prepend}</span>}

        <input
          ref={ref}
          type={type}
          data-slot='input'
          className={cn(
            inputVariants({ size: density }),
            'placeholder:text-[var(--form-placeholder)] pr-3 pl-3',
            append && 'pr-2',
            prepend && 'pl-2',
            className,
          )}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          onChange={handleChange}
          value={isControlled ? value : currentValue}
          defaultValue={isControlled ? undefined : defaultValue}
          {...props}
        />

        {append && <span className='flex items-center'>{append}</span>}

        {shouldShowClear ? (
          <button
            tabIndex={-1}
            type='button'
            className='hover:bg-muted/80 mr-2 rounded p-1 text-muted-foreground transition'
            onClick={handleClear}
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {showCount ? (
        <div className='flex justify-end px-1 text-xs text-muted-foreground'>
          <span
            className={cn(limit && currentCount > limit && 'text-destructive')}
          >
            {formattedCount}
          </span>
        </div>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
