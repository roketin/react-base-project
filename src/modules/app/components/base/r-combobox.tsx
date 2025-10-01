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
import { cn } from '@/modules/app/libs/utils';
import {
  inputVariants,
  type TInputSize,
} from '@/modules/app/components/ui/variants/input-variants';
import { useState } from 'react';

type RComboBoxProps<T extends object, K extends keyof T, V extends keyof T> = {
  items: T[];
  labelKey: K;
  valueKey: V;
  onChange?: (value: string | null, item: T | null) => void;
  clearable?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
  density?: TInputSize;
  placeholder?: string;
  'aria-invalid'?: boolean | string;
  disabled?: boolean;
  loading?: boolean;
};

export function RComboBox<
  T extends object,
  K extends keyof T,
  V extends keyof T,
>({
  items,
  labelKey,
  valueKey,
  onChange,
  clearable = true,
  searchValue,
  onSearch,
  density,
  placeholder = 'Select item..',
  disabled,
  'aria-invalid': ariaInvalid,
  loading,
}: RComboBoxProps<T, K, V>) {
  const hasError = !!ariaInvalid;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

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
              {value ? (
                String(
                  items.find((item) => item[valueKey] === value)?.[labelKey] ??
                    '',
                )
              ) : (
                <span className='text-gray-400'>{placeholder}</span>
              )}
            </span>
            <div className='flex items-center gap-1'>
              {clearable && value && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue('');
                    onChange?.(null, null);
                  }}
                  className='rounded text-muted-foreground hover:bg-slate-50 p-1 cursor-pointer'
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
          <CommandInput
            placeholder='Search...'
            className='h-9'
            value={searchValue}
            onValueChange={onSearch}
          />
          <CommandList>
            {loading && (
              <div className='p-2 text-sm text-muted-foreground'>
                Loading...
              </div>
            )}
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={String(item[valueKey])}
                  value={String(item[valueKey])}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? '' : currentValue;
                    setValue(newValue);
                    onChange?.(newValue || null, item);
                    setOpen(false);
                  }}
                >
                  {String(item[labelKey])}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === String(item[valueKey])
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
