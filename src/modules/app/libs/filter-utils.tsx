import { Input } from '@/modules/app/components/ui/input';
import { Switch } from '@/modules/app/components/ui/switch';
import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';
import { RComboBox } from '@/modules/app/components/base/r-combobox';
import { RMultiComboBox } from '@/modules/app/components/base/r-combobox-multiple';
import { RDatePicker } from '@/modules/app/components/base/r-datepicker';
import { Slider } from '@/modules/app/components/ui/slider';
import { RRadio } from '@/modules/app/components/base/r-radio';
import type { RComboBoxProps } from '@/modules/app/components/base/r-combobox';
import type { RMultiComboBoxProps } from '@/modules/app/components/base/r-combobox-multiple';
import type { RDatePickerBaseProps } from '@/modules/app/components/base/r-datepicker';
import type { TInputProps } from '@/modules/app/components/ui/input';
import { type ComponentProps, type ReactNode } from 'react';
import type { DateRange } from 'react-day-picker';
import type { RRadioOption } from '@/modules/app/components/base/r-radio';

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

type PrimitiveOption = string | number;

type FilterComponentOptions<
  TValue,
  TComponentProps,
  TOmitted extends keyof TComponentProps = never,
  TExtra extends object = Record<never, never>,
> = {
  id: string;
  label?: ReactNode;
  defaultValue?: TValue;
} & Omit<TComponentProps, TOmitted> &
  TExtra;

// ---------------------------------------------------------------------------
// Built-in helper factories
// ---------------------------------------------------------------------------

type TFilterInputOptions = FilterComponentOptions<
  string | null,
  TInputProps,
  'id' | 'value' | 'onChange'
>;

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
  TItem extends object | PrimitiveOption,
  TLabel extends TItem extends object
    ? keyof TItem
    : never = TItem extends object ? keyof TItem : never,
  TValue extends TItem extends object
    ? keyof TItem
    : never = TItem extends object ? keyof TItem : never,
> = FilterComponentOptions<
  string | null,
  RComboBoxProps<TItem, TLabel, TValue>,
  'value' | 'onChange'
>;

export function filterComboBox<
  TItem extends object | PrimitiveOption,
  TLabel extends TItem extends object
    ? keyof TItem
    : never = TItem extends object ? keyof TItem : never,
  TValue extends TItem extends object
    ? keyof TItem
    : never = TItem extends object ? keyof TItem : never,
>({
  id,
  label,
  defaultValue,
  ...props
}: TFilterComboBoxOptions<TItem, TLabel, TValue>): TFilterItem<string | null> {
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
> = FilterComponentOptions<
  string[] | null,
  RMultiComboBoxProps<T, K, V>,
  'values' | 'onChange'
>;

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
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RMultiComboBox
        {...props}
        values={value ?? []}
        onChange={(nextValues) =>
          onChange(nextValues.length > 0 ? nextValues : null)
        }
      />
    ),
  };
}

type TFilterSwitchOptions = FilterComponentOptions<
  boolean | null,
  ComponentProps<typeof Switch>,
  'checked' | 'onCheckedChange' | 'id',
  {
    description?: ReactNode;
  }
>;

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

type TFilterRadioOptions = FilterComponentOptions<
  string | null,
  ComponentProps<typeof RRadio>,
  'value' | 'defaultValue' | 'onChange' | 'options',
  { options: RRadioOption[] }
>;

export function filterRadio({
  id,
  label,
  defaultValue,
  options,
  ...props
}: TFilterRadioOptions): TFilterItem<string | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RRadio
        {...props}
        options={options}
        value={value ?? null}
        onChange={(nextValue) => onChange(nextValue)}
      />
    ),
  };
}

type TFilterCheckboxMultipleOptions = FilterComponentOptions<
  string[] | null,
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

type TFilterSliderOptions = FilterComponentOptions<
  number[] | null,
  ComponentProps<typeof Slider>,
  'value' | 'defaultValue' | 'onValueChange' | 'id',
  {
    formatValue?: (value: number[]) => ReactNode;
  }
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

type TFilterDatepickerOptions = FilterComponentOptions<
  Date | null,
  RDatePickerBaseProps
>;

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

type TFilterDatepickerMultipleOptions = FilterComponentOptions<
  DateRange | null,
  RDatePickerBaseProps
>;

export function filterDatepickerMultiple({
  id,
  label,
  defaultValue,
  ...props
}: TFilterDatepickerMultipleOptions): TFilterItem<DateRange | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RDatePicker
        {...props}
        mode='range'
        value={value ?? undefined}
        onChange={(nextValue) => onChange(nextValue ?? null)}
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
  TFilterDatepickerMultipleOptions,
  CustomFilterOptions,
};
