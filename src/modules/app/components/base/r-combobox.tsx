import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import Button from '@/modules/app/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/modules/app/components/ui/command';
import { cn } from '@/modules/app/libs/utils';

type RComboBoxProps<T extends object, K extends keyof T, V extends keyof T> = {
  items: T[];
  labelKey: K;
  valueKey: V;
  onChange?: (value: string | null, item: T | null) => void;
  clearable?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
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
  clearable = false,
  searchValue,
  onSearch,
}: RComboBoxProps<T, K, V>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          <div className='flex items-center w-full justify-between'>
            <span>
              {value
                ? String(
                    items.find((item) => item[valueKey] === value)?.[
                      labelKey
                    ] ?? '',
                  )
                : 'Select...'}
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
                  className='text-muted-foreground hover:text-foreground'
                >
                  ×
                </button>
              )}
              <ChevronsUpDown className='opacity-50' />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput
            placeholder='Search...'
            className='h-9'
            value={searchValue}
            onValueChange={(val) => {
              onSearch?.(val);
            }}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
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
