import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import Button from '@/modules/app/components/ui/button';
import { Calendar } from '@/modules/app/components/ui/calendar';
import { useCallback, useMemo, useState, type ComponentProps } from 'react';
import type {
  TAriaInvalidProp,
  TDisableable,
} from '@/modules/app/types/component.type';
import { format } from 'date-fns';
import type { DateRange, Matcher, OnSelectHandler } from 'react-day-picker';
import { cn } from '@/modules/app/libs/utils';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';

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
  // Determine if the input should display an error state based on aria-invalid prop
  const hasError = !!ariaInvalid;

  // State to control the open/close state of the popover calendar
  const [open, setOpen] = useState(false);

  /**
   * Memoized label rendering logic based on mode and selected value.
   * - For 'single' mode, formats the selected date or shows placeholder.
   * - For 'range' mode, formats the date range if both from and to are selected, otherwise shows placeholder.
   */
  const renderLabel = useMemo<string>(() => {
    if (mode === 'single') {
      return value
        ? format(value as Date, formatString ?? 'dd/MM/yyyy')
        : (placeholder ?? 'Select date');
    }
    const range = value as DateRange | undefined;
    return range?.from && range?.to
      ? `${format(range.from, formatString ?? 'dd/MM/yyyy')} - ${format(
          range.to,
          formatString ?? 'dd/MM/yyyy',
        )}`
      : (placeholder ?? 'Select date range');
  }, [formatString, mode, placeholder, value]);

  /**
   * Callback handler invoked when a date or date range is selected in the calendar.
   * - Calls the onChange prop with the new value.
   * - Closes the popover automatically for single mode or when a complete range is selected.
   *
   * @param {Date | DateRange | undefined} date - The newly selected date or date range.
   */
  const handleSelect = useCallback(
    (date: Date | DateRange | undefined) => {
      // Invoke the onChange callback with the selected date(s)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (onChange as ((value: any) => void) | undefined)?.(date);

      if (mode === 'single') {
        setOpen(false);
      } else {
        const range = date as DateRange | undefined;
        if (
          range?.from &&
          range?.to &&
          range.from.getTime() !== range.to.getTime()
        ) {
          setOpen(false);
        }
      }
    },
    [mode, onChange],
  );

  if (mode === 'single') {
    // Selected date for single mode
    const selectedProp: Date | undefined = value;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              inputVariants({ size: density }),
              'relative flex w-full items-center rounded-md border bg-white dark:bg-input/30 transition-[color,box-shadow] shadow-md shadow-slate-100 justify-between cursor-pointer',
              hasError
                ? 'border-destructive ring-destructive/40'
                : 'border-border focus-within:ring-ring/50 focus-within:ring-[3px]',
              disabled ? 'pointer-events-none opacity-60' : '',
            )}
          >
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
    // Selected date range for range mode
    const selectedProp: DateRange | undefined = value;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              inputVariants({ size: density }),
              'relative flex w-full items-center rounded-md border bg-white dark:bg-input/30 transition-[color,box-shadow] shadow-md shadow-slate-100 justify-between cursor-pointer',
              hasError
                ? 'border-destructive ring-destructive/40'
                : 'border-border focus-within:ring-ring/50 focus-within:ring-[3px]',
              disabled ? 'pointer-events-none opacity-60' : '',
            )}
          >
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
            required={false}
            disabled={disabledDate}
            disableNavigation={disabled}
            selected={selectedProp}
            onSelect={handleSelect}
          />
          {selectedProp?.to && selectedProp.from && (
            <div className='border-t border-slate-100 p-2 flex justify-end'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  // Reset the selected date range to undefined
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (onChange as ((val: any) => void) | undefined)?.({
                    from: undefined,
                    to: undefined,
                  })
                }
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
