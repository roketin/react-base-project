import { Input } from '@/modules/app/components/ui/input';
import { Switch } from '@/modules/app/components/ui/switch';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/modules/app/components/ui/radio-group';
import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';
import { RComboBox } from '@/modules/app/components/base/r-combobox';
import { RMultiComboBox } from '@/modules/app/components/base/r-combobox-multiple';
import { RDatePicker } from '@/modules/app/components/base/r-datepicker';
import { Slider } from '@/modules/app/components/ui/slider';
import type { RComboBoxProps } from '@/modules/app/components/base/r-combobox';
import type { RMultiComboBoxProps } from '@/modules/app/components/base/r-combobox-multiple';
import type { RDatePickerBaseProps } from '@/modules/app/components/base/r-datepicker';
import type { TInputProps } from '@/modules/app/components/ui/input';
import type { ComponentProps, ReactNode } from 'react';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/modules/app/libs/utils';

type TFilterRenderer<TValue> = (args: {
  value: TValue;
  onChange: (value: TValue) => void;
}) => ReactNode;

type TFilterBase<TValue> = {
  id: string;
  label?: ReactNode;
  defaultValue?: TValue;
  render: TFilterRenderer<TValue>;
};

export type TFilterItem<TValue = unknown> = TFilterBase<TValue>;

// ---------------------------------------------------------------------------
// Built-in helper factories
// ---------------------------------------------------------------------------

type TFilterInputOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: string | null;
} & Omit<TInputProps, 'id' | 'value' | 'onChange'>;

export function filterInput({
  id,
  label,
  defaultValue,
  ...inputProps
}: TFilterInputOptions): TFilterItem<string | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <Input
        {...inputProps}
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  };
}

type TFilterComboBoxOptions<
  T extends object,
  K extends keyof T,
  V extends keyof T,
> = {
  id: string;
  label?: ReactNode;
  defaultValue?: string | null;
} & Omit<RComboBoxProps<T, K, V>, 'value' | 'onChange'>;

export function filterComboBox<
  T extends object,
  K extends keyof T,
  V extends keyof T,
>({
  id,
  label,
  defaultValue,
  ...props
}: TFilterComboBoxOptions<T, K, V>): TFilterItem<string | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RComboBox
        {...props}
        value={value ?? null}
        onChange={(nextValue) => onChange(nextValue)}
      />
    ),
  };
}

type TFilterComboBoxMultipleOptions<
  T extends object,
  K extends keyof T,
  V extends keyof T,
> = {
  id: string;
  label?: ReactNode;
  defaultValue?: string[];
} & Omit<RMultiComboBoxProps<T, K, V>, 'values' | 'onChange'>;

export function filterComboBoxMultiple<
  T extends object,
  K extends keyof T,
  V extends keyof T,
>({
  id,
  label,
  defaultValue,
  ...props
}: TFilterComboBoxMultipleOptions<T, K, V>): TFilterItem<string[] | null> {
  const normalizedDefault: string[] | null = defaultValue ?? null;

  return {
    id,
    label,
    defaultValue: normalizedDefault,
    render: ({ value, onChange }) => (
      <RMultiComboBox
        {...props}
        values={value ?? []}
        onChange={(nextValues) => onChange(nextValues)}
      />
    ),
  };
}

type TFilterSwitchOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: boolean;
  description?: ReactNode;
} & Omit<ComponentProps<typeof Switch>, 'checked' | 'onCheckedChange' | 'id'>;

export function filterSwitch({
  id,
  label,
  defaultValue,
  description,
  className,
  ...props
}: TFilterSwitchOptions): TFilterItem<boolean | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <div className='flex items-center gap-3'>
        <Switch
          {...props}
          id={id}
          className={className}
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        {description && (
          <span className='text-sm text-muted-foreground'>{description}</span>
        )}
      </div>
    ),
  };
}

type TFilterRadioOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: string | null;
  options: Array<{ value: string; label: ReactNode }>;
  direction?: 'vertical' | 'horizontal';
} & Omit<
  ComponentProps<typeof RadioGroup>,
  'value' | 'onValueChange' | 'defaultValue'
>;

export function filterRadio({
  id,
  label,
  defaultValue,
  options,
  direction = 'vertical',
  className,
  ...props
}: TFilterRadioOptions): TFilterItem<string | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RadioGroup
        {...props}
        className={cn(
          direction === 'horizontal' ? 'flex flex-wrap gap-4' : 'grid gap-3',
          className,
        )}
        value={value ?? undefined}
        onValueChange={(next) => onChange(next || null)}
      >
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            id={`${id}-${option.value}`}
            label={option.label}
          />
        ))}
      </RadioGroup>
    ),
  };
}

type TFilterCheckboxMultipleOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: string[];
} & Omit<
  ComponentProps<typeof RCheckboxMultiple>,
  'checked' | 'onCheckedChange'
>;

export function filterCheckboxMultiple({
  id,
  label,
  defaultValue,
  ...props
}: TFilterCheckboxMultipleOptions): TFilterItem<string[] | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RCheckboxMultiple
        {...props}
        checked={value ?? []}
        onCheckedChange={(nextValues) =>
          onChange(nextValues.length > 0 ? nextValues : null)
        }
      />
    ),
  };
}

type TFilterSliderOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: number[];
  formatValue?: (value: number[]) => ReactNode;
} & Omit<
  ComponentProps<typeof Slider>,
  'value' | 'defaultValue' | 'onValueChange' | 'id'
>;

export function filterSlider({
  id,
  label,
  defaultValue,
  formatValue,
  ...props
}: TFilterSliderOptions): TFilterItem<number[] | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => {
      const sliderValue = value ?? defaultValue ?? [];
      const effectiveValue =
        sliderValue.length > 0 ? sliderValue : (defaultValue ?? []);
      const handleChange = (next: number[]) => {
        onChange(next.length > 0 ? next : null);
      };

      return (
        <div className='space-y-2'>
          <Slider
            {...props}
            defaultValue={defaultValue ?? undefined}
            value={effectiveValue.length > 0 ? effectiveValue : undefined}
            onValueChange={handleChange}
          />
          {formatValue && (
            <div className='text-xs text-muted-foreground'>
              {formatValue(effectiveValue)}
            </div>
          )}
        </div>
      );
    },
  };
}

type TFilterDatepickerOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: Date | null;
} & RDatePickerBaseProps;

export function filterDatepicker({
  id,
  label,
  defaultValue,
  ...props
}: TFilterDatepickerOptions): TFilterItem<Date | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RDatePicker
        {...props}
        mode='single'
        value={value ?? undefined}
        onChange={(nextValue) => onChange(nextValue ?? null)}
      />
    ),
  };
}

type TFilterDatepickerMultipleOptions = {
  id: string;
  label?: ReactNode;
  defaultValue?: DateRange;
} & RDatePickerBaseProps;

export function filterDatepickerMultiple({
  id,
  label,
  defaultValue,
  ...props
}: TFilterDatepickerMultipleOptions): TFilterItem<DateRange> {
  return {
    id,
    label,
    defaultValue: defaultValue,
    render: ({ value, onChange }) => (
      <RDatePicker
        {...props}
        mode='range'
        value={value ?? undefined}
        onChange={(nextValue) => onChange(nextValue)}
      />
    ),
  };
}

// ---------------------------------------------------------------------------
// Escape hatch for custom components
// ---------------------------------------------------------------------------

type CustomFilterOptions<TValue> = {
  id: string;
  label?: ReactNode;
  defaultValue?: TValue;
  render: TFilterRenderer<TValue>;
};

export function filterCustom<TValue>(
  options: CustomFilterOptions<TValue>,
): TFilterItem<TValue> {
  return options;
}

export const filterItem = {
  input: filterInput,
  combobox: filterComboBox,
  comboboxMultiple: filterComboBoxMultiple,
  switch: filterSwitch,
  radio: filterRadio,
  checkboxMultiple: filterCheckboxMultiple,
  slider: filterSlider,
  datepicker: filterDatepicker,
  datepickerRange: filterDatepickerMultiple,
  custom: filterCustom,
};

export type {
  TFilterInputOptions,
  TFilterComboBoxOptions,
  TFilterComboBoxMultipleOptions,
  TFilterSwitchOptions,
  TFilterRadioOptions,
  TFilterCheckboxMultipleOptions,
  TFilterSliderOptions,
  TFilterDatepickerOptions,
  CustomFilterOptions,
};
