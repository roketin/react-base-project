import { cn } from '@/modules/app/libs/utils';

type FieldWrapperOptions = {
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
};

const baseFieldWrapperClass =
  'relative flex w-full items-center rounded-[var(--form-radius)] border border-[var(--form-border-color)] bg-[var(--form-bg)] transition-[color,box-shadow] shadow-[var(--form-shadow)] dark:bg-input/30';

/**
 * Returns a consistent wrapper class name for interactive form fields.
 * Ensures uniform sizing, focus ring, disabled, and error states across components.
 */
export const getFieldWrapperClassName = ({
  hasError,
  disabled,
  className,
}: FieldWrapperOptions = {}) =>
  cn(
    baseFieldWrapperClass,
    hasError
      ? 'border-destructive ring-destructive/40'
      : 'focus-within:ring-[var(--form-focus-ring)]/50 focus-within:ring-[3px]',
    disabled
      ? 'pointer-events-none opacity-[var(--form-disabled-opacity)] bg-[var(--form-disabled-bg)]'
      : '',
    className,
  );

export { baseFieldWrapperClass };
