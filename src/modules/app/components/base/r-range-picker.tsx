import * as React from 'react';
import { RangePicker, type RangePickerProps } from 'rc-picker';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import locale from 'rc-picker/lib/locale/en_US';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import type { RangePickerRef } from 'rc-picker/lib/interface';
import { Minus } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

dayjs.extend(weekOfYear);

/* -------------------------------------------------------------------------- */
/*                                   BASE                                     */
/* -------------------------------------------------------------------------- */

export interface RRangePickerProps
  extends Omit<
    RangePickerProps<Dayjs>,
    'picker' | 'showNow' | 'generateConfig' | 'locale'
  > {
  picker?: RangePickerProps<Dayjs>['picker'];
  showNow?: boolean;
  generateConfig?: typeof dayjsGenerateConfig;
  locale?: typeof locale;
}

/** 🧩 Base Range Date Picker */
export const RRangePicker = React.forwardRef<RangePickerRef, RRangePickerProps>(
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
      <RangePicker<Dayjs>
        ref={ref}
        picker={picker}
        showNow={showNow}
        generateConfig={generateConfig}
        locale={pickerLocale}
        separator={<Minus size={14} />}
        format={format}
        transitionName='slide-up'
        className={cn({ 'rc-invalid': ariaInvalid }, className)}
        {...restProps}
      />
    );
  },
);

RRangePicker.displayName = 'RRangePicker';

/* -------------------------------------------------------------------------- */
/*                            FORM FIELD INTEGRATION                          */
/* -------------------------------------------------------------------------- */

export interface RFormRangePickerProps
  extends Omit<RRangePickerProps, 'value' | 'onChange'> {
  /** Value in { from: Date, to: Date } (for Yup compatibility) */
  value?: { from: Date | null; to: Date | null } | null;
  onChange?: (value: { from: Date | null; to: Date | null } | null) => void;
}

/** 🗓️ RFormRangePicker — Range Date version for react-hook-form */
export const RFormRangePicker: React.FC<RFormRangePickerProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const handleChange = React.useCallback(
    (val: [Dayjs | null, Dayjs | null] | null) => {
      if (!val) return onChange?.(null);
      onChange?.({
        from: val?.[0]?.toDate() ?? null,
        to: val?.[1]?.toDate() ?? null,
      });
    },
    [onChange],
  );

  return (
    <RRangePicker
      {...rest}
      value={[
        value?.from ? dayjs(value.from) : null,
        value?.to ? dayjs(value.to) : null,
      ]}
      onChange={handleChange}
    />
  );
};
