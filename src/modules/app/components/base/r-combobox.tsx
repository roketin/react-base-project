import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/modules/app/components/ui/command';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';
import type {
  TAriaInvalidProp,
  TDisableable,
  TLoadable,
} from '@/modules/app/types/component.type';
import { cn } from '@/modules/app/libs/utils';
import { useCallback, useMemo, useState } from 'react';

type PrimitiveOption = string | number;

/**
 * Props for the RComboBox component.
 * @template TItem - Type of the item, either object or primitive.
 * @template TLabel - Key of the label property in TItem if object.
 * @template TValue - Key of the value property in TItem if object.
 */
export type RComboBoxProps<
  TItem extends object | PrimitiveOption,
  TLabel extends TItem extends object ? keyof TItem : never = never,
  TValue extends TItem extends object ? keyof TItem : never = never,
> = TDisableable &
  TLoadable &
  TAriaInvalidProp & {
    items?: TItem[];
    labelKey?: TLabel;
    valueKey?: TValue;
    onChange?: (value: string | null, item: TItem | null) => void;
    clearable?: boolean;
    searchValue?: string;
    onSearch?: (query: string) => void;
    density?: TInputSize;
    placeholder?: string;
    value?: string | number | null;
    allowSearch?: boolean;
  };

/**
 * RComboBox component provides a customizable combo box with optional search and clear functionality.
 *
 * Supports both controlled and uncontrolled usage via the `value` prop.
 * When `value` is provided, component acts controlled and relies on `onChange` callback.
 * When `value` is undefined, component manages its own internal state.
 *
 * @template TItem - Type of the item, either object or primitive.
 * @template TLabel - Key of the label property in TItem if object.
 * @template TValue - Key of the value property in TItem if object.
 * @param props - Props for configuring the combo box.
 * @returns JSX.Element
 */
export function RComboBox<
  TItem extends object | PrimitiveOption,
  TLabel extends TItem extends object ? keyof TItem : never,
  TValue extends TItem extends object ? keyof TItem : never,
>({
  items = [],
  labelKey,
  valueKey,
  onChange,
  clearable = true,
  searchValue,
  onSearch,
  density,
  placeholder = 'Select item..',
  value: valueProp,
  allowSearch = true,
  disabled,
  'aria-invalid': ariaInvalid,
  loading,
}: RComboBoxProps<TItem, TLabel, TValue>) {
  const hasError = !!ariaInvalid;

  // State to track whether the popover is open or closed.
  const [open, setOpen] = useState(false);

  // Internal state to manage the selected value when uncontrolled.
  const [internalValue, setInternalValue] = useState<string | number | null>(
    valueProp ?? null,
  );

  // Determine if component is controlled by checking if valueProp is defined.
  const isControlled = valueProp !== undefined;

  // Use controlled value if available, otherwise use internal state.
  const currentValue = isControlled ? (valueProp ?? null) : internalValue;

  // Normalize current value to string for comparison and display.
  const normalizedCurrentValue =
    currentValue == null ? '' : String(currentValue);

  /**
   * Helper to get the label string for a given item.
   * Uses labelKey if item is object, otherwise converts primitive to string.
   */
  const getLabel = useCallback(
    (item: TItem) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return String(item);
      }
      const key = (labelKey ?? ('label' as TLabel)) as keyof TItem;
      return String(item[key] ?? '');
    },
    [labelKey],
  );

  /**
   * Helper to get the value from a given item.
   * Uses valueKey if item is object, otherwise returns the primitive value.
   */
  const getValue = useCallback(
    (item: TItem) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return item;
      }
      const key = (valueKey ?? ('value' as TValue)) as keyof TItem;
      return item[key] as unknown as string | number;
    },
    [valueKey],
  );

  /**
   * Memoized computation of the currently selected item based on currentValue.
   * Returns null if no matching item is found.
   */
  const selectedItem = useMemo(() => {
    if (!normalizedCurrentValue) return null;
    return (
      items.find((item) => String(getValue(item)) === normalizedCurrentValue) ??
      null
    );
  }, [getValue, items, normalizedCurrentValue]);

  // Get the label of the selected item for display.
  const selectedLabel = selectedItem ? getLabel(selectedItem) : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            inputVariants({ size: density }),
            'relative flex w-full items-center rounded-md border bg-white dark:bg-input/30 transition-[color,box-shadow] shadow-md shadow-slate-100 justify-between',
            hasError
              ? 'border-destructive ring-destructive/40'
              : 'border-border focus-within:ring-ring/50 focus-within:ring-[3px]',
            disabled ? 'pointer-events-none opacity-60' : '',
          )}
        >
          <div className='flex items-center w-full justify-between'>
            <span>
              {normalizedCurrentValue ? (
                selectedLabel
              ) : (
                <span className='text-gray-400'>{placeholder}</span>
              )}
            </span>
            <div className='flex items-center gap-1'>
              {/* Clear button to reset the selection */}
              {clearable && currentValue && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    // Clear internal state only if uncontrolled
                    if (!isControlled) {
                      setInternalValue('');
                    }
                    // Notify parent of cleared selection
                    onChange?.(null, null);
                  }}
                  className='rounded text-muted-foreground hover:bg-slate-50 p-1 cursor-pointer'
                  aria-label='Clear selection'
                >
                  <X size={14} />
                </button>
              )}
              <ChevronsUpDown className='opacity-50' size={14} />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='popover-content-width-full p-0'>
        <Command>
          {/* Optional search input inside the dropdown */}
          {allowSearch && (
            <CommandInput
              placeholder='Search...'
              className='h-9'
              value={searchValue ?? undefined}
              onValueChange={onSearch}
            />
          )}
          <CommandList>
            {loading && (
              <div className='p-2 text-sm text-muted-foreground'>
                Loading...
              </div>
            )}
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {/* Render each item as selectable command item */}
              {items.map((item) => (
                <CommandItem
                  key={String(getValue(item))}
                  value={String(getValue(item))}
                  onSelect={(selectedValue) => {
                    const normalizedSelected = String(selectedValue);
                    // Toggle selection: deselect if same value is selected
                    const nextValue =
                      normalizedSelected === normalizedCurrentValue
                        ? ''
                        : normalizedSelected;

                    // Update internal state if uncontrolled
                    if (!isControlled) {
                      setInternalValue(nextValue || null);
                    }

                    // Notify parent of new selection or deselection
                    onChange?.(nextValue || null, nextValue ? item : null);

                    // Close the dropdown after selection
                    setOpen(false);
                  }}
                >
                  {getLabel(item)}
                  <Check
                    className={cn(
                      'ml-auto',
                      normalizedCurrentValue === String(getValue(item))
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
