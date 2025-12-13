import React, { type RefObject as MutableRefObject } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/modules/app/components/base/r-form-primitives';
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
  control?: Control<T>;
  name?: N;
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

type FieldMode = 'normal' | 'preview' | 'loading';

// ============================================================================
// Helper Components
// ============================================================================

const FieldLabel = ({
  label,
  labelDescription,
  fieldId,
  showRequired,
  isPreview,
  isHorizontal,
}: {
  label: React.ReactNode;
  labelDescription?: React.ReactNode;
  fieldId?: string;
  showRequired: boolean;
  isPreview: boolean;
  isHorizontal: boolean;
}) => (
  <label
    className={cn(
      'block text-sm text-foreground',
      isPreview ? 'font-bold' : 'font-medium',
    )}
    htmlFor={fieldId}
  >
    {label}
    {showRequired && <span className='text-lg text-destructive'>*</span>}
    {labelDescription && (
      <div
        className={cn('text-xs text-muted-foreground', isHorizontal && 'pr-5')}
      >
        {labelDescription}
      </div>
    )}
  </label>
);

const FieldLabelSkeleton = ({
  hasDescription,
}: {
  hasDescription: boolean;
}) => (
  <div className='block'>
    <RSkeleton className='h-5 w-32' />
    {hasDescription && <RSkeleton className='h-3 w-24 mt-1' />}
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

const FieldContent = ({
  mode,
  content,
  description,
  showMessage,
}: {
  mode: FieldMode;
  content: React.ReactNode;
  description?: string;
  showMessage?: boolean;
}) => {
  if (mode === 'loading') {
    return (
      <div>
        <RSkeleton className='h-8 w-full' />
        {description && <RSkeleton className='h-3 w-48 mt-1.5' />}
      </div>
    );
  }

  if (mode === 'preview') {
    return (
      <div>
        <div className='text-sm text-muted-foreground'>{content}</div>
        {description && (
          <FormDescription className='mt-1.5 text-xs'>
            {description}
          </FormDescription>
        )}
      </div>
    );
  }

  return (
    <div>
      <FormControl>{content}</FormControl>
      {description && (
        <FormDescription className='mt-1.5 text-xs'>
          {description}
        </FormDescription>
      )}
      {showMessage && <FormMessage className='mt-1.5' />}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

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

  // Computed values from props and context
  const fieldId = name ? String(name) : undefined;
  const computedWidth = labelWidth ?? formConfig?.labelWidth ?? '200px';
  const layoutOrientation = (layout ??
    formConfig?.layout ??
    'vertical') as TLayoutOrientation;
  const isHorizontal = layoutOrientation === 'horizontal';
  const isPreviewMode = isPreview || formConfig?.isPreview || false;
  const isLoadingMode = isLoading || formConfig?.isLoading || false;
  const isDisabled = formConfig?.disabled ?? false;
  const showSeparator = isHorizontal && !formConfig?.hideHorizontalLine;

  // Determine field mode
  const mode: FieldMode = isLoadingMode
    ? 'loading'
    : isPreviewMode
      ? 'preview'
      : 'normal';
  const showRequired = !notRequired && mode === 'normal';

  const placeholder =
    withPlaceholder && typeof label === 'string'
      ? `${t('form.enter')} ${label.toLowerCase()}`
      : undefined;

  // Render wrapper with separator
  const renderWithWrapper = (content: React.ReactNode) => (
    <FormItem className={className}>
      <FieldWrapper isHorizontal={isHorizontal} computedWidth={computedWidth}>
        {content}
      </FieldWrapper>
      {showSeparator && <RSeparator className='mt-4 border-t border-border' />}
    </FormItem>
  );

  // Render label based on mode
  const renderLabel = () => {
    if (!label) return null;

    if (mode === 'loading') {
      return <FieldLabelSkeleton hasDescription={!!labelDescription} />;
    }

    return (
      <FieldLabel
        label={label}
        labelDescription={labelDescription}
        fieldId={fieldId}
        showRequired={showRequired}
        isPreview={mode === 'preview'}
        isHorizontal={isHorizontal}
      />
    );
  };

  // ============================================================================
  // Without control/name - simple wrapper mode
  // ============================================================================
  if (!control || !name) {
    const displayContent =
      mode === 'preview'
        ? previewContent !== undefined
          ? previewContent
          : children
        : children;

    return renderWithWrapper(
      <>
        {renderLabel()}
        <FieldContent
          mode={mode}
          content={displayContent}
          description={description}
        />
      </>,
    );
  }

  // ============================================================================
  // With control/name - full form field mode
  // ============================================================================
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

        // Map value props based on component type
        const controlPropMap: Record<ValuePropName, Record<string, unknown>> = {
          value: { value, onChange },
          checked: { checked: value, onCheckedChange: onChange },
          radio: { value, onValueChange: onChange },
          slider: { value, onValueChange: onChange },
        };
        const resolvedControlProps =
          controlPropMap[valuePropName] ?? controlPropMap.value;

        // Handle ref forwarding
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
          if (childRef) {
            if (typeof childRef === 'function') {
              childRef(node);
            } else {
              (childRef as MutableRefObject<HTMLInputElement | null>).current =
                node;
            }
          }
        };

        // Enhanced field props
        const enhancedField = {
          ...controllerField,
          ...resolvedControlProps,
          id: fieldId as N,
          name: fieldId as N,
          ...(isDisabled && { disabled: isDisabled }),
          ...(placeholder && { placeholder }),
          ref: assignRefs,
        };

        // Build control content
        const controlContent = render
          ? render({
              ...renderProps,
              field: { ...renderProps.field, ...enhancedField },
            })
          : React.isValidElement(children)
            ? React.cloneElement(children, enhancedField)
            : null;

        // Determine display content for preview mode
        const displayContent =
          previewContent !== undefined
            ? previewContent
            : renderProps.field.value?.toString() || '-';

        return renderWithWrapper(
          <>
            {renderLabel()}
            <FieldContent
              mode={mode}
              content={mode === 'preview' ? displayContent : controlContent}
              description={description}
              showMessage={mode === 'normal'}
            />
          </>,
        );
      }}
    />
  );
}
