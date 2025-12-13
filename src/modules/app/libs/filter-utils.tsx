import { RInput } from '@/modules/app/components/base/r-input';
import { RSwitch } from '@/modules/app/components/base/r-switch';
import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';
import RSelect from '@/modules/app/components/base/r-select';
import { RSelectInfinite } from '@/modules/app/components/base/r-select-infinite';
import type { DefaultOptionType, BaseOptionType } from 'rc-select/lib/Select';
import { RPicker } from '@/modules/app/components/base/r-picker';
import { RRangePicker } from '@/modules/app/components/base/r-range-picker';
import { RSlider } from '@/modules/app/components/base/r-slider';
import { RRadio } from '@/modules/app/components/base/r-radio';
import type { TRPickerProps } from '@/modules/app/components/base/r-picker';
import type { TRRangePickerProps } from '@/modules/app/components/base/r-range-picker';
import type { TRInputProps } from '@/modules/app/components/base/r-input';
import type { TRSelectProps } from '@/modules/app/components/base/r-select';
import { type ComponentProps, type ReactNode } from 'react';
import type { TRRadioOption } from '@/modules/app/components/base/r-radio';
import type { InfiniteData } from '@tanstack/react-query';
import dayjs from 'dayjs';

export type TInputSize = 'default' | 'sm' | 'lg';

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

type TLabeledValue = {
  value: string;
  label?: string;
};

// Shared helper functions for value normalization
const toLabeledValue = (
  val: string | number | TLabeledValue | null | undefined,
): TLabeledValue | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object' && 'value' in val) {
    return {
      value: String((val as TLabeledValue).value),
      label: (val as TLabeledValue).label,
    };
  }
  const stringVal = String(val);
  return { value: stringVal, label: stringVal };
};

const normalizeArrayValue = (
  val: unknown,
): Array<TLabeledValue> | undefined => {
  if (!Array.isArray(val)) return undefined;
  return val
    .map((item) => toLabeledValue(item as string | TLabeledValue))
    .filter((item): item is TLabeledValue => Boolean(item?.value));
};

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
  TRInputProps,
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
      <RInput
        {...inputProps}
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  };
}

type SelectMode = 'single' | 'multiple';

type FilterSelectValue<TMode extends SelectMode> = TMode extends 'multiple'
  ? Array<string | TLabeledValue> | null
  : string | TLabeledValue | null;

type FilterSelectComponentProps<
  TItem extends object | PrimitiveOption,
  TLabel,
  TValue,
  TMode extends SelectMode,
> = {
  items?: TItem[];
  labelKey?: TLabel;
  valueKey?: TValue;
  placeholder?: string;
  clearable?: boolean;
  allowSearch?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  mode?: TMode;
  density?: TInputSize;
  infiniteScroll?: TRSelectProps['infiniteScroll'];
};

type TFilterSelectOptions<
  TItem extends object | PrimitiveOption,
  TLabel extends TItem extends object ? keyof TItem : never =
    TItem extends object ? keyof TItem : never,
  TValue extends TItem extends object ? keyof TItem : never =
    TItem extends object ? keyof TItem : never,
  TMode extends SelectMode = 'single',
> = FilterComponentOptions<
  FilterSelectValue<TMode>,
  FilterSelectComponentProps<TItem, TLabel, TValue, TMode>,
  never
>;

export function filterSelect<
  TItem extends object | PrimitiveOption,
  TLabel extends TItem extends object ? keyof TItem : never =
    TItem extends object ? keyof TItem : never,
  TValue extends TItem extends object ? keyof TItem : never =
    TItem extends object ? keyof TItem : never,
  TMode extends SelectMode = 'single',
>({
  id,
  label,
  defaultValue,
  ...props
}: TFilterSelectOptions<TItem, TLabel, TValue, TMode>): TFilterItem<
  FilterSelectValue<TMode>
> {
  const {
    items = [],
    labelKey,
    valueKey,
    placeholder,
    clearable = true,
    allowSearch = true,
    searchValue,
    onSearch,
    loading,
    disabled,
    dropdownClassName,
    className,
    mode,
    ...restProps
  } = props;

  const selectMode = mode ?? 'single';
  const isMultiple = selectMode === 'multiple';

  const itemsAreObjects =
    items.length > 0 &&
    typeof items[0] === 'object' &&
    items[0] !== null &&
    !Array.isArray(items[0]);

  const fieldNames = itemsAreObjects
    ? {
        label: String(labelKey ?? ('label' as TLabel)),
        value: String(valueKey ?? ('value' as TValue)),
      }
    : undefined;

  const selectOptions: DefaultOptionType[] = itemsAreObjects
    ? (items as unknown as DefaultOptionType[])
    : (items as PrimitiveOption[]).map((item) => {
        const stringValue = String(item);
        return {
          label: stringValue,
          value: stringValue,
        } satisfies DefaultOptionType;
      });

  const optionFilterProp = fieldNames?.label ?? 'label';

  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => (
      <RSelect
        {...restProps}
        mode={isMultiple ? 'multiple' : undefined}
        className={className}
        dropdownClassName={dropdownClassName}
        loading={loading}
        disabled={disabled}
        placeholder={placeholder}
        allowClear={clearable}
        showSearch={allowSearch}
        searchValue={searchValue}
        onSearch={onSearch}
        options={selectOptions}
        fieldNames={fieldNames}
        optionFilterProp={optionFilterProp}
        labelInValue
        value={
          isMultiple
            ? (normalizeArrayValue(value) as unknown)
            : ((toLabeledValue(
                value as string | TLabeledValue | null | undefined,
              ) ?? undefined) as unknown)
        }
        onChange={(nextValue: unknown) => {
          if (isMultiple) {
            const normalizedValues = normalizeArrayValue(nextValue) ?? [];
            onChange(
              (normalizedValues.length > 0
                ? normalizedValues
                : null) as FilterSelectValue<TMode>,
            );
            return;
          }

          if (nextValue === undefined || nextValue === null) {
            onChange(null as FilterSelectValue<TMode>);
            return;
          }

          const normalizedValue = toLabeledValue(
            nextValue as string | TLabeledValue,
          );

          onChange(normalizedValue as FilterSelectValue<TMode>);
        }}
      />
    ),
  };
}

type TFilterSwitchOptions = FilterComponentOptions<
  boolean | null,
  ComponentProps<typeof RSwitch>,
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
        <RSwitch
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
  { options: TRRadioOption[] }
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
  number | null,
  ComponentProps<typeof RSlider>,
  'value' | 'defaultValue' | 'onValueChange' | 'id',
  {
    formatValue?: (value: number) => ReactNode;
  }
>;

export function filterSlider({
  id,
  label,
  defaultValue,
  formatValue,
  ...props
}: TFilterSliderOptions): TFilterItem<number | null> {
  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => {
      const effectiveValue = value ?? defaultValue ?? 0;
      const handleChange = (next: number) => {
        onChange(next);
      };

      return (
        <div className='space-y-2'>
          <RSlider
            {...props}
            defaultValue={defaultValue ?? undefined}
            value={effectiveValue}
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
  TRPickerProps
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
      <RPicker
        {...props}
        className='w-full'
        value={value ? dayjs(value) : null}
        onChange={(nextValue) => {
          if (Array.isArray(nextValue)) {
            const firstValue = nextValue[0]?.toDate() ?? null;
            onChange(firstValue);
            return;
          }

          onChange(nextValue ? nextValue.toDate() : null);
        }}
      />
    ),
  };
}

type DateRange = {
  from?: Date;
  to?: Date;
};

type TFilterDatepickerMultipleOptions = FilterComponentOptions<
  DateRange | null,
  TRRangePickerProps
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
      <RRangePicker
        {...props}
        className='w-full'
        value={[
          value?.from ? dayjs(value.from) : null,
          value?.to ? dayjs(value.to) : null,
        ]}
        onChange={(nextValue) => {
          if (!nextValue) {
            onChange(null);
            return;
          }

          const [start, end] = nextValue;

          if (!start && !end) {
            onChange(null);
            return;
          }

          const range: DateRange = {
            from: undefined,
          };

          if (start) {
            range.from = start.toDate();
          }

          if (end) {
            range.to = end.toDate();
          }

          onChange(range);
        }}
      />
    ),
  };
}

// ---------------------------------------------------------------------------
// Infinite scroll select
// ---------------------------------------------------------------------------

type MinimalInfiniteQueryResult<TPage> = {
  data?: InfiniteData<TPage>;
  fetchNextPage: () => Promise<unknown>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};

type TFilterSelectInfiniteOptions<
  TPage,
  TOption extends BaseOptionType,
  TParams extends Record<string, unknown>,
  TLabel extends keyof TOption = keyof TOption,
  TValue extends keyof TOption = keyof TOption,
> = {
  id: string;
  label?: ReactNode;
  defaultValue?: string | TLabeledValue | Array<string | TLabeledValue> | null;
  query: (options: { variables: TParams }) => MinimalInfiniteQueryResult<TPage>;
  getPageItems: (page: TPage) => TOption[];
  baseParams?: TParams;
  searchParamKey?: string;
  deduplicateKey?: keyof TOption;
  debounceMs?: number;
  labelKey?: TLabel;
  valueKey?: TValue;
  placeholder?: string;
  clearable?: boolean;
  allowSearch?: boolean;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  multiple?: boolean;
};

type FilterSelectInfiniteValue =
  | string
  | TLabeledValue
  | Array<string | TLabeledValue>
  | null;

export function filterSelectInfinite<
  TPage,
  TOption extends BaseOptionType,
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TLabel extends keyof TOption = keyof TOption,
  TValue extends keyof TOption = keyof TOption,
>({
  id,
  label,
  defaultValue,
  query,
  getPageItems,
  baseParams,
  searchParamKey,
  deduplicateKey,
  debounceMs,
  labelKey,
  valueKey,
  placeholder,
  clearable = true,
  allowSearch = true,
  disabled,
  dropdownClassName,
  className,
  multiple,
}: TFilterSelectInfiniteOptions<
  TPage,
  TOption,
  TParams,
  TLabel,
  TValue
>): TFilterItem<FilterSelectInfiniteValue> {
  const isMultiple = multiple === true;

  return {
    id,
    label,
    defaultValue: defaultValue ?? null,
    render: ({ value, onChange }) => {
      const fieldNames =
        labelKey || valueKey
          ? {
              label: String(labelKey ?? 'label') as Extract<
                keyof TOption,
                string
              >,
              value: String(valueKey ?? 'value') as Extract<
                keyof TOption,
                string
              >,
            }
          : undefined;

      return (
        <RSelectInfinite<TPage, TOption, TParams>
          className={className}
          dropdownClassName={dropdownClassName}
          disabled={disabled}
          placeholder={placeholder}
          allowClear={clearable}
          showSearch={allowSearch}
          mode={isMultiple ? 'multiple' : undefined}
          {...(fieldNames ? { fieldNames } : {})}
          labelInValue
          query={query}
          getPageItems={getPageItems}
          baseParams={baseParams}
          searchParamKey={searchParamKey}
          deduplicateKey={deduplicateKey}
          debounceMs={debounceMs}
          value={
            isMultiple
              ? (normalizeArrayValue(value) as unknown)
              : ((toLabeledValue(
                  value as string | TLabeledValue | null | undefined,
                ) ?? undefined) as unknown)
          }
          onChange={(nextValue: unknown) => {
            if (isMultiple) {
              const normalizedValues = normalizeArrayValue(nextValue) ?? [];
              onChange(normalizedValues.length > 0 ? normalizedValues : null);
              return;
            }

            if (nextValue === undefined || nextValue === null) {
              onChange(null);
              return;
            }

            const normalizedValue = toLabeledValue(
              nextValue as string | TLabeledValue,
            );

            onChange(normalizedValue);
          }}
        />
      );
    },
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
  select: filterSelect,
  selectInfinite: filterSelectInfinite,
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
  TFilterSelectOptions,
  TFilterSelectInfiniteOptions,
  TFilterSwitchOptions,
  TFilterRadioOptions,
  TFilterCheckboxMultipleOptions,
  TFilterSliderOptions,
  TFilterDatepickerOptions,
  TFilterDatepickerMultipleOptions,
  CustomFilterOptions,
  SelectMode,
};
