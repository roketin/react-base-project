import Select from 'rc-select';
import type {
  BaseOptionType,
  DefaultOptionType,
  SelectProps,
} from 'rc-select/lib/Select';
import type { BaseSelectRef } from 'rc-select';
import { forwardRef, type ReactElement, type Ref } from 'react';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

type OptionKey<Option extends BaseOptionType> = Extract<keyof Option, string>;

type RSelectFieldNames<Option extends BaseOptionType> = {
  label?: OptionKey<Option>;
  value?: OptionKey<Option>;
  options?: OptionKey<Option>;
  groupLabel?: OptionKey<Option>;
};

export type RSelectProps<
  ValueType = unknown,
  OptionType extends BaseOptionType = DefaultOptionType,
> = Omit<SelectProps<ValueType, OptionType>, 'fieldNames'> & {
  fieldNames?: RSelectFieldNames<OptionType>;
};

type RSelectComponent = <
  ValueType = unknown,
  OptionType extends BaseOptionType = DefaultOptionType,
>(
  props: RSelectProps<ValueType, OptionType> & {
    ref?: Ref<BaseSelectRef>;
  },
) => ReactElement | null;

function RSelectBase<
  ValueType,
  OptionType extends BaseOptionType = DefaultOptionType,
>(props: RSelectProps<ValueType, OptionType>, ref: Ref<BaseSelectRef>) {
  const {
    fieldNames,
    placeholder,
    menuItemSelectedIcon,
    suffixIcon,
    'aria-invalid': ariaInvalid,
    className,
    ...restProps
  } = props;

  const normalizedFieldNames = fieldNames
    ? (fieldNames as SelectProps<ValueType, OptionType>['fieldNames'])
    : undefined;

  const isMultiple = restProps.mode === 'multiple';

  return (
    <Select<ValueType, OptionType>
      ref={ref}
      className={cn({ 'rc-invalid': ariaInvalid }, className)}
      placeholder={placeholder ?? 'Choose..'}
      fieldNames={normalizedFieldNames}
      {...restProps}
      animation='slide-up'
      menuItemSelectedIcon={
        menuItemSelectedIcon ?? (isMultiple ? <Check size={14} /> : null)
      }
      suffixIcon={
        suffixIcon ?? (
          <div role='img'>
            {props.loading ? (
              <LoaderCircle className='animate-spin' size={20} />
            ) : (
              <ChevronsUpDown size={14} />
            )}
          </div>
        )
      }
    />
  );
}

const RSelect = forwardRef(RSelectBase) as RSelectComponent;

export default RSelect;
