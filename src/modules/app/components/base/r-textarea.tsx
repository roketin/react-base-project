import { forwardRef, useId } from 'react';
import type { ReactNode } from 'react';
import {
  Textarea,
  type TextareaProps,
} from '@/modules/app/components/ui/textarea';
import { cn } from '@/modules/app/libs/utils';

export type TRTextareaProps = TextareaProps & {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  requiredIndicator?: ReactNode;
  wrapperClassName?: string;
};

export const RTextarea = forwardRef<HTMLTextAreaElement, TRTextareaProps>(
  function RTextarea(
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
    const textareaId = id ?? generatedId;

    return (
      <div className={cn('flex flex-col gap-2', wrapperClassName)}>
        {label ? (
          <label
            htmlFor={textareaId}
            className='flex items-center gap-1 text-sm font-medium text-foreground'
          >
            {label}
            {requiredIndicator ??
              (props.required ? (
                <span className='text-destructive'>*</span>
              ) : null)}
          </label>
        ) : null}

        <Textarea id={textareaId} ref={ref} className={className} {...props} />

        {description ? (
          <p className='text-xs text-muted-foreground'>{description}</p>
        ) : null}

        {error ? <p className='text-xs text-destructive'>{error}</p> : null}
      </div>
    );
  },
);

RTextarea.displayName = 'RTextarea';

export default RTextarea;
