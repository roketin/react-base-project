import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/modules/app/libs/utils';
import { textareaVariants } from '@/modules/app/libs/ui-variants';
import { type VariantProps } from 'class-variance-authority';

export type TRTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> &
  VariantProps<typeof textareaVariants> & {
    label?: string;
    error?: string;
    helperText?: string;
    wrapperClassName?: string;
    fullWidth?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    autoGrow?: boolean;
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
      autoGrow = false,
      onInput,
      value,
      defaultValue,
      style,
      size = 'default',
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const handleAutoGrow = useCallback(
      (element: HTMLTextAreaElement | null) => {
        if (!autoGrow || !element) return;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      },
      [autoGrow],
    );

    useEffect(() => {
      handleAutoGrow(textareaRef.current);
    }, [handleAutoGrow, value, defaultValue]);

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>): void => {
      handleAutoGrow(event.currentTarget);
      onInput?.(event);
    };

    const setRefs = (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const resizeClass = autoGrow
      ? 'resize-none'
      : resize === 'none'
        ? 'resize-none'
        : resize === 'vertical'
          ? 'resize-y'
          : resize === 'horizontal'
            ? 'resize-x'
            : 'resize';

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
          ref={setRefs}
          id={textareaId}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(textareaVariants({ size }), resizeClass, className)}
          value={value}
          defaultValue={defaultValue}
          onInput={handleInput}
          style={{
            ...(autoGrow ? { overflow: 'hidden' } : {}),
            ...style,
          }}
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
