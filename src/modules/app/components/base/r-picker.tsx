import * as React from 'react';
import Picker, { type PickerProps, type PickerRef } from 'rc-picker';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import locale from 'rc-picker/lib/locale/en_US';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import { cn } from '@/modules/app/libs/utils';

dayjs.extend(weekOfYear);

/* -------------------------------------------------------------------------- */
/*                                   BASE                                     */
/* -------------------------------------------------------------------------- */

export interface RPickerProps
  extends Omit<
    PickerProps<Dayjs>,
    'picker' | 'showNow' | 'generateConfig' | 'locale'
  > {
  picker?: PickerProps<Dayjs>['picker'];
  showNow?: boolean;
  generateConfig?: typeof dayjsGenerateConfig;
  locale?: typeof locale;
}

/** 🧩 Base Single Date Picker */
export const RPicker = React.forwardRef<PickerRef, RPickerProps>(
  (props, ref) => {
    const {
      picker = 'date',
      showNow = true,
      generateConfig = dayjsGenerateConfig,
      locale: pickerLocale = locale,
      format = 'DD-MM-YYYY',
      className,
      'aria-invalid': ariaInvalid,
      ...restProps
    } = props;

    return (
      <Picker<Dayjs>
        ref={ref}
        picker={picker}
        showNow={showNow}
        generateConfig={generateConfig}
        locale={pickerLocale}
        format={format}
        className={cn({ 'rc-invalid': ariaInvalid }, className)}
        transitionName='slide-up'
        {...restProps}
      />
    );
  },
);

RPicker.displayName = 'RPicker';

/* -------------------------------------------------------------------------- */
/*                            FORM FIELD INTEGRATION                          */
/* -------------------------------------------------------------------------- */

export interface RFormDatePickerProps
  extends Omit<RPickerProps, 'value' | 'onChange'> {
  /** Value in Date (for Yup compatibility) */
  value?: Date | null;
  onChange?: (value: Date | null) => void;
}

/** 🗓️ RFormDatePicker — Single Date version for react-hook-form */
export const RFormDatePicker: React.FC<RFormDatePickerProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const handleChange = React.useCallback(
    (val: Dayjs | Dayjs[] | null) => {
      let valueToConvert: Dayjs | null = null;
      if (Array.isArray(val)) {
        valueToConvert = val[0] ?? null;
      } else {
        valueToConvert = val;
      }
      onChange?.(valueToConvert ? valueToConvert.toDate() : null);
    },
    [onChange],
  );

  return (
    <RPicker
      value={value ? dayjs(value) : null}
      onChange={handleChange}
      {...rest}
    />
  );
};
