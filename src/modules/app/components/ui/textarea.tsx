import { cn } from '@/modules/app/libs/utils';
import * as React from 'react';
import { forwardRef, useMemo, useState, useEffect, useCallback } from 'react';

export type TextareaProps = React.ComponentProps<'textarea'> & {
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

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      showCount = false,
      countLimit,
      countFormatter,
      countType = 'character',
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) {
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
      if (!showCount) {
        return null;
      }

      if (countFormatter) {
        return countFormatter(currentCount, limit);
      }

      return limit !== undefined
        ? `${currentCount} / ${limit}`
        : `${currentCount}`;
    }, [showCount, countFormatter, currentCount, limit]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        onChange?.(event);
      },
      [isControlled, onChange],
    );

    return (
      <div className='flex w-full flex-col'>
        <textarea
          ref={ref}
          data-slot='textarea'
          className={cn(
            'border-[var(--form-border-color)] placeholder:text-[var(--form-placeholder)] focus-visible:border-[var(--form-focus-ring)] focus-visible:ring-[var(--form-focus-ring)]/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-[var(--form-radius)] border bg-transparent px-3 py-2 text-[length:var(--form-font-size)] shadow-[var(--form-shadow)] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)] disabled:bg-[var(--form-disabled-bg)] md:text-sm',
            showCount && 'pb-6',
            className,
          )}
          value={isControlled ? value : currentValue}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          {...props}
        />

        {showCount ? (
          <div className='flex justify-end px-2 pt-1 text-xs text-muted-foreground'>
            <span
              className={cn(
                limit && currentCount > limit && 'text-destructive',
              )}
            >
              {formattedCount}
            </span>
          </div>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
