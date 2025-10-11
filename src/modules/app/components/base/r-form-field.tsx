import React, { type RefObject as MutableRefObject } from 'react';
import { cn } from '@/modules/app/libs/utils';
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
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from 'react-hook-form';
import { useFormConfig } from '@/modules/app/contexts/form-config-context';
import type { TLayoutOrientation } from '@/modules/app/types/component.type';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/modules/app/components/ui/separator';

type TRenderFn<T extends FieldValues, N extends Path<T>> = (args: {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}) => React.ReactNode;

type ValuePropName = 'value' | 'checked' | 'radio' | 'slider';

type TRFormFieldProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
  label?: string | React.ReactNode;
  labelDescription?: string | React.ReactNode;
  description?: string;
  layout?: TLayoutOrientation;
  children?: React.ReactElement<Record<string, unknown>>;
  render?: TRenderFn<T, N>;
  notRequired?: boolean;
  withPlaceholder?: boolean;
  labelWidth?: string;
  valuePropName?: ValuePropName;
};

export function RFormField<T extends FieldValues, N extends Path<T>>({
  control,
  name,
  label,
  labelDescription,
  description,
  layout,
  children,
  render,
  notRequired = false,
  withPlaceholder = false,
  labelWidth,
  valuePropName = 'value',
}: TRFormFieldProps<T, N>) {
  const { t } = useTranslation();
  const formConfig = useFormConfig();

  const fieldId = String(name);
  const computedWidth = labelWidth ?? formConfig?.labelWidth ?? '200px';
  const layoutOrientation = (layout ??
    formConfig?.layout ??
    'vertical') as TLayoutOrientation;
  const isHorizontal = layoutOrientation === 'horizontal';
  const shouldShowRequired = !notRequired;
  const isDisabled = formConfig?.disabled ?? false;
  const showSeparator = isHorizontal && !formConfig?.hideHorizontalLine;
  const placeholder =
    withPlaceholder && typeof label === 'string'
      ? `${t('form.enter')} ${label.toLowerCase()}`
      : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={(renderProps) => {
        const {
          ref: fieldRef,
          value,
          onChange,
          ...controllerField
        } = renderProps.field;

        const controlPropMap: Record<ValuePropName, Record<string, unknown>> = {
          value: { value, onChange },
          checked: { checked: value, onCheckedChange: onChange },
          radio: { value, onValueChange: onChange },
          slider: { value, onValueChange: onChange },
        };

        const resolvedControlProps =
          controlPropMap[valuePropName] ?? controlPropMap.value;

        const childRef =
          React.isValidElement(children) &&
          (
            children as React.ReactElement & {
              ref?: React.Ref<HTMLInputElement>;
            }
          ).ref;

        const assignRefs = (node: HTMLInputElement | null) => {
          if (typeof fieldRef === 'function') {
            fieldRef(node);
          } else if (fieldRef) {
            (fieldRef as MutableRefObject<HTMLInputElement | null>).current =
              node;
          }

          if (!childRef) return;

          if (typeof childRef === 'function') {
            childRef(node);
          } else if (childRef) {
            (childRef as MutableRefObject<HTMLInputElement | null>).current =
              node;
          }
        };

        const enhancedField = {
          ...controllerField,
          ...resolvedControlProps,
          id: fieldId as N,
          name: fieldId as N,
          ...(isDisabled ? { disabled: isDisabled } : {}),
          ...(placeholder ? { placeholder } : {}),
          ref: assignRefs,
        };

        const controlContent = render
          ? render({
              ...renderProps,
              field: {
                ...renderProps.field,
                ...enhancedField,
              },
            })
          : React.isValidElement(children)
            ? React.cloneElement(children, enhancedField)
            : null;

        return (
          <FormItem>
            <div
              className={cn(
                'flex flex-col gap-2',
                isHorizontal && 'md:grid md:gap-0',
              )}
              style={
                isHorizontal
                  ? { gridTemplateColumns: `${computedWidth} 1fr` }
                  : undefined
              }
            >
              {label && (
                <FormLabel className='block' htmlFor={fieldId}>
                  {label}
                  {shouldShowRequired && (
                    <span className='text-lg text-destructive'>*</span>
                  )}

                  {labelDescription && (
                    <div
                      className={cn('text-xs text-gray-400', {
                        'pr-5': isHorizontal,
                      })}
                    >
                      {labelDescription}
                    </div>
                  )}
                </FormLabel>
              )}

              <div>
                <FormControl>{controlContent}</FormControl>

                {description && (
                  <FormDescription className='mt-1.5 text-xs'>
                    {description}
                  </FormDescription>
                )}
                <FormMessage className='mt-1.5' />
              </div>
            </div>
            {showSeparator && (
              <Separator className='mt-4 border-t border-slate-100' />
            )}
          </FormItem>
        );
      }}
    />
  );
}
