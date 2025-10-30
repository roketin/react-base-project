import { forwardRef, useId } from 'react';
import type { ReactNode } from 'react';
import { Input, type TInputProps } from '@/modules/app/components/ui/input';
import { cn } from '@/modules/app/libs/utils';

export type RInputProps = TInputProps & {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  requiredIndicator?: ReactNode;
  wrapperClassName?: string;
};

export const RInput = forwardRef<HTMLInputElement, RInputProps>(function RInput(
  {
    label,
    description,
    error,
    requiredIndicator,
    id,
    className,
    wrapperClassName,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('flex flex-col gap-2', wrapperClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className='flex items-center gap-1 text-sm font-medium text-foreground'
        >
          {label}
          {requiredIndicator ??
            (props.required ? (
              <span className='text-destructive'>*</span>
            ) : null)}
        </label>
      ) : null}

      <Input id={inputId} ref={ref} className={className} {...props} />

      {description ? (
        <p className='text-xs text-muted-foreground'>{description}</p>
      ) : null}
      {!description && error ? (
        <p className='text-xs text-destructive'>{error}</p>
      ) : null}
      {description && error ? (
        <p className='text-xs text-destructive'>{error}</p>
      ) : null}
    </div>
  );
});

RInput.displayName = 'RInput';

export default RInput;
