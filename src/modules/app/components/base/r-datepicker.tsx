import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import Button from '@/modules/app/components/ui/button';
import { Calendar } from '@/modules/app/components/ui/calendar';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';
import { getFieldWrapperClassName } from '@/modules/app/components/ui/variants/field-variants';
import type {
  TAriaInvalidProp,
  TDisableable,
} from '@/modules/app/types/component.type';
import { cn } from '@/modules/app/libs/utils';
import { format } from 'date-fns';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';
import type { DateRange, Matcher, OnSelectHandler } from 'react-day-picker';

// --- TYPE DEFINITIONS (Disertakan agar kode lengkap) ---
export type RDatePickerBaseProps = Omit<
  ComponentProps<typeof Calendar>,
  'selected' | 'onSelect' | 'onChange'
> &
  TDisableable &
  TAriaInvalidProp & {
    disabledDate?: Matcher | Matcher[];
    formatString?: string;
    placeholder?: string;
    density?: TInputSize;
  };

type RDatePickerProps =
  | (RDatePickerBaseProps & {
      mode: 'single';
      value?: Date;
      onChange?: OnSelectHandler<Date | undefined>;
    })
  | (RDatePickerBaseProps & {
      mode: 'range';
      value?: DateRange;
      onChange?: OnSelectHandler<DateRange>;
    });

/**
 * RDatePicker component provides a customizable date picker UI supporting both single date and date range selection modes.
 * It leverages a popover to display the calendar and allows disabling dates, formatting display, and customizing appearance.
 *
 * @param {RDatePickerProps} props - Properties to configure the date picker behavior and appearance.
 * @returns JSX.Element representing the date picker input and popover calendar.
 */
const RDatePicker = ({
  disabled,
  disabledDate,
  value,
  onChange,
  formatString,
  placeholder,
  mode,
  density,
  'aria-invalid': ariaInvalid,
  ...props
}: RDatePickerProps) => {
  const hasError = !!ariaInvalid;
  const triggerClassName = getFieldWrapperClassName({
    hasError,
    disabled,
    className: cn(
      inputVariants({ size: density }),
      'justify-between cursor-pointer',
    ),
  });

  // State to control the open/close state of the popover calendar
  const [open, setOpen] = useState(false);

  // State to hold the temporary range selection during the interaction.
  const [tempRange, setTempRange] = useState<DateRange | undefined>(
    mode === 'range' ? (value as DateRange) : undefined,
  );

  // Synchronize tempRange with the controlled prop 'value' when the prop changes.
  useEffect(() => {
    if (mode !== 'range') return;
    setTempRange(value as DateRange | undefined);
  }, [mode, value]);

  useEffect(() => {
    if (mode !== 'range' || !open) return;
    const rangeValue = value as DateRange | undefined;
    if (rangeValue?.from) {
      setTempRange({ from: rangeValue.from, to: undefined });
    } else {
      setTempRange(undefined);
    }
  }, [mode, open, value]);

  /**
   * Memoized label rendering logic based on mode and selected value.
   */
  const effectiveRange = useMemo(() => {
    if (mode !== 'range') return undefined;
    return (open ? tempRange : (value as DateRange | undefined)) ?? undefined;
  }, [mode, open, tempRange, value]);

  const renderLabel = useMemo<string>(() => {
    if (mode === 'single') {
      return value
        ? format(value as Date, formatString ?? 'dd/MM/yyyy')
        : (placeholder ?? 'Select date');
    }
    const range = effectiveRange;
    if (range?.from && range?.to) {
      return `${format(range.from, formatString ?? 'dd/MM/yyyy')} - ${format(
        range.to,
        formatString ?? 'dd/MM/yyyy',
      )}`;
    }
    if (range?.from) {
      return `${format(range.from, formatString ?? 'dd/MM/yyyy')} -`;
    }
    return placeholder ?? 'Select date range';
  }, [effectiveRange, formatString, mode, placeholder, value]);

  /**
   * Callback handler invoked when a date or date range is selected in the calendar.
   * Logic modified to fix the stability and UX issues in Range Mode.
   */
  const handleSelect = useCallback(
    (date: Date | DateRange | undefined) => {
      if (mode === 'single') {
        // Single Mode Logic: Call onChange immediately and close the popover.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (onChange as ((value: any) => void) | undefined)?.(date);
        setOpen(false);
      } else {
        const nextRange = date as DateRange | undefined;

        if (!nextRange || !nextRange.from) {
          setTempRange(undefined);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onChange as ((value: any) => void) | undefined)?.({
            from: undefined,
            to: undefined,
          });
          return;
        }

        setTempRange(nextRange);

        if (nextRange.from && nextRange.to) {
          const isSameDay = nextRange.from.getTime() === nextRange.to.getTime();
          if (isSameDay) {
            const partialRange: DateRange = {
              from: nextRange.from,
              to: undefined,
            };
            setTempRange(partialRange);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (onChange as ((value: any) => void) | undefined)?.(partialRange);
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onChange as ((value: any) => void) | undefined)?.(nextRange);
          setOpen(false);
          return;
        }

        if (nextRange.from && !nextRange.to) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onChange as ((value: any) => void) | undefined)?.(nextRange);
          return;
        }
      }
    },
    [mode, onChange],
  );

  if (mode === 'single') {
    // Single Mode Implementation
    const selectedProp: Date | undefined = value;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={triggerClassName}>
            <div className='flex items-center gap-3'>
              <CalendarIcon size={14} />
              {renderLabel}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            {...props}
            mode={mode}
            required
            disabled={disabledDate}
            disableNavigation={disabled}
            selected={selectedProp}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    );
  } else {
    const rangeValue: DateRange | undefined = value as DateRange | undefined;
    const selectedProp = tempRange;

    const defaultMonth =
      selectedProp?.from ??
      rangeValue?.from ??
      selectedProp?.to ??
      rangeValue?.to ??
      new Date();

    const hasSelection =
      !!selectedProp?.from ||
      !!selectedProp?.to ||
      !!rangeValue?.from ||
      !!rangeValue?.to;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={triggerClassName}>
            <div className='flex items-center gap-3'>
              <CalendarIcon size={14} />
              {renderLabel}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0 flex flex-col' align='start'>
          <Calendar
            {...props}
            mode={mode}
            required={false}
            disabled={disabledDate}
            disableNavigation={disabled}
            selected={selectedProp}
            onSelect={handleSelect}
            numberOfMonths={2}
            defaultMonth={defaultMonth}
          />

          {hasSelection && (
            <div className='border-t border-slate-100 p-2 flex justify-end'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setTempRange(undefined);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (onChange as ((val: any) => void) | undefined)?.({
                    from: undefined,
                    to: undefined,
                  });
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
};

export { RDatePicker };
