import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import Button from '@/modules/app/components/ui/button';
import { Calendar } from '@/modules/app/components/ui/calendar';
import { useCallback, useMemo, useState, type ComponentProps } from 'react';
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
> & {
  disabled?: boolean;
  disabledDate?: Matcher | Matcher[];
  formatString?: string;
  placeholder?: string;
  density?: TInputSize;
  'aria-invalid'?: boolean | string;
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

  const [open, setOpen] = useState(false);

  // Label by mode
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
   * Handle date selected event
   * @param date
   */
  const handleSelect = useCallback(
    (date: Date | DateRange | undefined) => {
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
