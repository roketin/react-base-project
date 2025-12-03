import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { getTextareaClasses } from '@/modules/app/libs/ui-variants';

export type TRTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
};

export const RTextarea = forwardRef<HTMLTextAreaElement, TRTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      wrapperClassName,
      fullWidth = false,
      resize = 'vertical',
      className,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div
        className={cn(
          'flex flex-col gap-1.5',
          fullWidth && 'w-full',
          wrapperClassName,
        )}
      >
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            getTextareaClasses(hasError),
            resize === 'none' && 'resize-none',
            resize === 'vertical' && 'resize-y',
            resize === 'horizontal' && 'resize-x',
            resize === 'both' && 'resize',
            className,
          )}
          {...props}
        />

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

RTextarea.displayName = 'RTextarea';
