import React, { useMemo } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/modules/app/components/ui/form';
import type {
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
} from 'react-hook-form';
import { useFormConfig } from '@/modules/app/contexts/form-config-context';

type TRenderFn<T extends FieldValues, N extends Path<T>> = (args: {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}) => React.ReactNode;

type TRFormFieldProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
  label?: string | React.ReactNode;
  description?: string;
  layout?: 'vertical' | 'horizontal';
  children?: React.ReactElement; // Mode 1
  render?: TRenderFn<T, N>; // Mode 2
  notRequired?: boolean;
  withPlaceholder?: boolean;
  labelWidth?: string;
  valuePropName?: 'value' | 'checked' | 'radio';
};

export function RFormField<T extends FieldValues, N extends Path<T>>({
  control,
  name,
  label,
  description,
  layout,
  children,
  render,
  notRequired = false,
  withPlaceholder = false,
  labelWidth,
  valuePropName = 'value',
}: TRFormFieldProps<T, N>) {
  const formConfig = useFormConfig();

  // Get label width from form or from self component
  // Only work on horizontal layout
  const computedWidth = useMemo<string>(
    () => labelWidth ?? formConfig?.labelWidth ?? '200px',
    [formConfig?.labelWidth, labelWidth],
  );

  // Get type layout from form or from self component
  const computedLayout = useMemo<string>(
    () => layout ?? formConfig?.layout ?? 'vertical',
    [formConfig?.layout, layout],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={(renderProps) => {
        const { value, onChange, ...restField } = renderProps.field;

        const controlProps = () => {
          switch (valuePropName) {
            case 'checked':
              return { checked: value, onCheckedChange: onChange };
            case 'radio':
              return { value, onValueChange: onChange };
            default:
              return { value, onChange };
          }
        };

        return (
          <FormItem>
            <div
              className={computedLayout === 'horizontal' ? `grid` : undefined}
              style={{
                gridTemplateColumns: `${computedWidth} 1fr`,
              }}
            >
              {label && (
                <FormLabel className='block' htmlFor={name}>
                  {label}
                  {!notRequired && (
                    <span className='text-destructive text-lg'>*</span>
                  )}{' '}
                </FormLabel>
              )}
              <div>
                <FormControl>
                  {render
                    ? render(renderProps)
                    : React.cloneElement(
                        children as React.ReactElement<Record<string, unknown>>,
                        {
                          ...restField,
                          ...controlProps(),
                          ...(withPlaceholder && typeof label === 'string'
                            ? { placeholder: 'Enter ' + label.toLowerCase() }
                            : {}),
                          id: String(name),
                          name: String(name),
                        },
                      )}
                </FormControl>

                {description && (
                  <FormDescription className='mt-1.5'>
                    {description}
                  </FormDescription>
                )}
                <FormMessage className='mt-1.5' />
              </div>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
