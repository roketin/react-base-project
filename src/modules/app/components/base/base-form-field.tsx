import React from 'react';
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

type RenderFn<T extends FieldValues, N extends Path<T>> = (args: {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}) => React.ReactNode;

type TBaseFormFieldProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
  label?: string | React.ReactNode;
  description?: string;
  layout?: 'vertical' | 'horizontal';
  children?: React.ReactElement; // Mode 1
  render?: RenderFn<T, N>; // Mode 2
  notRequired?: boolean;
  withPlaceholder?: boolean;
};

export function BaseFormField<T extends FieldValues, N extends Path<T>>({
  control,
  name,
  label,
  description,
  layout = 'vertical',
  children,
  render,
  notRequired = false,
  withPlaceholder = false,
}: TBaseFormFieldProps<T, N>) {
  return (
    <FormField
      control={control}
      name={name}
      render={(renderProps) => (
        <FormItem
          className={
            layout === 'horizontal' ? 'flex items-center space-x-4' : undefined
          }
        >
          {label && (
            <FormLabel className='mb-1 block'>
              {label}
              {!notRequired && (
                <span className='text-red-500 text-lg'>*</span>
              )}{' '}
            </FormLabel>
          )}
          <FormControl>
            {render
              ? render(renderProps)
              : React.cloneElement(
                  children as React.ReactElement<Record<string, unknown>>,
                  {
                    ...renderProps.field,
                    ...(withPlaceholder && typeof label === 'string'
                      ? { placeholder: 'Input ' + label.toLowerCase() }
                      : {}),
                    id: String(name),
                    name: String(name),
                  },
                )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
