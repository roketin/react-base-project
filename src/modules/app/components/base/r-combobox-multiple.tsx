import { Badge } from '@/modules/app/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/modules/app/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import { Separator } from '@/modules/app/components/ui/separator';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';
import { cn } from '@/modules/app/libs/utils';
import { CheckIcon, ChevronsUpDown, X, X as XIcon } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';

type RMultiComboBoxProps<
  T extends object,
  K extends keyof T,
  V extends keyof T,
> = {
  items?: T[];
  labelKey?: K;
  valueKey?: V;
  values?: string[];
  defaultValues?: string[];
  onChange?: (values: string[], items: T[]) => void;
  clearable?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
  density?: TInputSize;
  placeholder?: string;
  'aria-invalid'?: boolean | string;
};

export function RMultiComboBox<
  T extends object,
  K extends keyof T,
  V extends keyof T,
>(props: RMultiComboBoxProps<T, K, V>) {
  const {
    items = [],
    labelKey = 'label' as K,
    valueKey = 'value' as V,
    values,
    defaultValues,
    onChange,
    placeholder = 'Select items..',
    'aria-invalid': ariaInvalid,
  } = props;

  const hasError = !!ariaInvalid;

  const [internalValues, setInternalValues] = useState<string[]>(
    defaultValues ?? [],
  );

  const selectedValues = values !== undefined ? values : internalValues;

  const selectedItems = useMemo(() => {
    return (items ?? []).filter((item) =>
      selectedValues.includes(String(item[valueKey])),
    );
  }, [items, selectedValues, valueKey]);

  const toggleValue = useCallback(
    (value: string) => {
      let newValues: string[];
      if (selectedValues.includes(value)) {
        newValues = selectedValues.filter((v) => v !== value);
      } else {
        newValues = [...selectedValues, value];
      }

      if (values === undefined) {
        setInternalValues(newValues);
      }

      if (onChange) {
        const newSelectedItems = (items ?? []).filter((item) =>
          newValues.includes(String(item[valueKey])),
        );
        onChange(newValues, newSelectedItems);
      }
    },
    [selectedValues, values, setInternalValues, onChange, items, valueKey],
  );

  const toggleSelectAll = useCallback(() => {
    let newValues: string[];
    if (selectedValues.length === items.length) {
      newValues = [];
    } else {
      newValues = (items ?? []).map((item) => String(item[valueKey]));
    }

    if (values === undefined) {
      setInternalValues(newValues);
    }

    if (onChange) {
      const newSelectedItems = (items ?? []).filter((item) =>
        newValues.includes(String(item[valueKey])),
      );
      onChange(newValues, newSelectedItems);
    }
  }, [selectedValues, items, values, setInternalValues, onChange, valueKey]);

  const clearSelection = useCallback(() => {
    if (values === undefined) {
      setInternalValues([]);
    }
    if (onChange) {
      onChange([], []);
    }
  }, [values, setInternalValues, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            inputVariants({ size: props.density }),
            'relative flex w-full items-center rounded-md border bg-white dark:bg-input/30 transition-[color,box-shadow] shadow-md shadow-slate-100 justify-between',
            hasError
              ? 'border-destructive ring-destructive/40'
              : 'border-border focus-within:ring-ring/50 focus-within:ring-[3px]',
          )}
        >
          {selectedItems.length > 0 ? (
            <div className='flex flex-wrap gap-1 items-center w-full'>
              {selectedItems.map((item) => {
                const itemValue = String(item[valueKey]);
                return (
                  <Badge key={itemValue}>
                    {String(item[labelKey])}
                    <button
                      type='button'
                      aria-label={`Remove ${item[labelKey]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValue(itemValue);
                      }}
                      className='ml-1 focus:outline-none'
                      tabIndex={-1}
                    >
                      <XIcon size={14} />
                    </button>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className='text-gray-400'>{placeholder}</span>
          )}

          <div className='flex gap-0.5 items-center'>
            {selectedItems.length > 0 && (
              <>
                <button
                  type='button'
                  className='rounded text-muted-foreground hover:bg-slate-50 p-1 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  aria-label='Clear all'
                  tabIndex={-1}
                >
                  <X size={14} />
                </button>
                <Separator orientation='vertical' />
              </>
            )}
            <ChevronsUpDown className='opacity-50' size={14} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='popover-content-width-full p-0'>
        <Command
          filter={(value, search, keywords) => {
            if (value === 'Select All') {
              return 1;
            }
            const searchLower = search.toLowerCase();
            if (value.toLowerCase().includes(searchLower)) return 1;
            if (keywords?.some((k) => k.toLowerCase().includes(searchLower)))
              return 1;
            return 0;
          }}
        >
          <CommandInput placeholder='Search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={toggleSelectAll}
                className='justify-between'
              >
                Select All
                {selectedValues.length === items.length && (
                  <CheckIcon className='h-5 w-5' />
                )}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {items.map((item) => {
                const itemValue = String(item[valueKey]);
                const isSelected = selectedValues.includes(itemValue);
                return (
                  <CommandItem
                    key={itemValue}
                    onSelect={() => {
                      toggleValue(itemValue);
                    }}
                    className='justify-between'
                  >
                    {String(item[labelKey])}
                    {isSelected && <CheckIcon className='h-5 w-5' />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
