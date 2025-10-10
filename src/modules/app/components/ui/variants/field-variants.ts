import { cn } from '@/modules/app/libs/utils';

type FieldWrapperOptions = {
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
};

const baseFieldWrapperClass =
  'relative flex w-full items-center rounded border bg-white transition-[color,box-shadow] shadow-md shadow-slate-100 dark:bg-input/30';

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
      : 'border-slate-150 focus-within:ring-ring/50 focus-within:ring-[3px]',
    disabled ? 'pointer-events-none opacity-60' : '',
    className,
  );

export { baseFieldWrapperClass };
