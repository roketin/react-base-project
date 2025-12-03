import React, { type RefObject as MutableRefObject } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  FormField,
  FormItem,
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
import { RSeparator } from '@/modules/app/components/base/r-separator';
import { RSkeleton } from '@/modules/app/components/base/r-skeleton';

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
  className?: string;
  withPlaceholder?: boolean;
  labelWidth?: string;
  valuePropName?: ValuePropName;
  isPreview?: boolean;
  previewContent?: React.ReactNode;
  isLoading?: boolean;
};

// Helper Components
const FieldLabel = ({
  label,
  labelDescription,
  fieldId,
  shouldShowRequired,
  isHorizontal,
}: {
  label: string | React.ReactNode;
  labelDescription?: string | React.ReactNode;
  fieldId?: string;
  shouldShowRequired: boolean;
  isHorizontal: boolean;
}) => (
  <label
    className='block text-sm font-medium text-foreground'
    htmlFor={fieldId}
  >
    {label}
    {shouldShowRequired && <span className='text-lg text-destructive'>*</span>}

    {labelDescription && (
      <div
        className={cn('text-xs text-muted-foreground', {
          'pr-5': isHorizontal,
        })}
      >
        {labelDescription}
      </div>
    )}
  </label>
);

const FieldLabelSkeleton = ({
  labelDescription,
}: {
  labelDescription?: string | React.ReactNode;
}) => (
  <div className='block'>
    <RSkeleton className='h-5 w-32' />
    {labelDescription && <RSkeleton className='h-3 w-24 mt-1' />}
  </div>
);

const FieldWrapper = ({
  isHorizontal,
  computedWidth,
  children,
}: {
  isHorizontal: boolean;
  computedWidth: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn('flex flex-col gap-2', isHorizontal && 'md:grid md:gap-0')}
    style={
      isHorizontal ? { gridTemplateColumns: `${computedWidth} 1fr` } : undefined
    }
  >
    {children}
  </div>
);

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
  className,
  withPlaceholder = false,
  labelWidth,
  valuePropName = 'value',
  isPreview = false,
  previewContent,
  isLoading = false,
}: TRFormFieldProps<T, N>) {
  const { t } = useTranslation();
  const formConfig = useFormConfig();

  const fieldId = String(name);
  const computedWidth = labelWidth ?? formConfig?.labelWidth ?? '200px';
  const layoutOrientation = (layout ??
    formConfig?.layout ??
    'vertical') as TLayoutOrientation;
  const isHorizontal = layoutOrientation === 'horizontal';
  const isPreviewMode = isPreview || formConfig?.isPreview || false;
  const isLoadingMode = isLoading || formConfig?.isLoading || false;
  const shouldShowRequired = !notRequired && !isPreviewMode;
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

        // Loading mode: show skeleton
        if (isLoadingMode) {
          return (
            <FormItem className={className}>
              <FieldWrapper
                isHorizontal={isHorizontal}
                computedWidth={computedWidth}
              >
                {label && (
                  <FieldLabelSkeleton labelDescription={labelDescription} />
                )}

                <div>
                  <RSkeleton className='h-8 w-full' />
                  {description && <RSkeleton className='h-3 w-48 mt-1.5' />}
                </div>
              </FieldWrapper>
              {showSeparator && (
                <RSeparator className='mt-4 border-t border-border' />
              )}
            </FormItem>
          );
        }

        // Preview mode: show preview content or field value
        if (isPreviewMode) {
          const displayContent =
            previewContent !== undefined
              ? previewContent
              : renderProps.field.value?.toString() || '-';

          return (
            <FormItem className={className}>
              <FieldWrapper
                isHorizontal={isHorizontal}
                computedWidth={computedWidth}
              >
                {label && (
                  <label className='block text-sm font-medium text-foreground'>
                    {label}

                    {labelDescription && (
                      <div
                        className={cn('text-xs text-muted-foreground', {
                          'pr-5': isHorizontal,
                        })}
                      >
                        {labelDescription}
                      </div>
                    )}
                  </label>
                )}

                <div>
                  <div className='text-sm text-foreground'>
                    {displayContent}
                  </div>

                  {description && (
                    <FormDescription className='mt-1.5 text-xs'>
                      {description}
                    </FormDescription>
                  )}
                </div>
              </FieldWrapper>
              {showSeparator && (
                <RSeparator className='mt-4 border-t border-border' />
              )}
            </FormItem>
          );
        }

        // Normal mode: editable form field
        return (
          <FormItem className={className}>
            <FieldWrapper
              isHorizontal={isHorizontal}
              computedWidth={computedWidth}
            >
              {label && (
                <FieldLabel
                  label={label}
                  labelDescription={labelDescription}
                  fieldId={fieldId}
                  shouldShowRequired={shouldShowRequired}
                  isHorizontal={isHorizontal}
                />
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
            </FieldWrapper>
            {showSeparator && (
              <RSeparator className='mt-4 border-t border-border' />
            )}
          </FormItem>
        );
      }}
    />
  );
}
