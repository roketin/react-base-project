'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/app/components/base/r-dialog-primitives';

// Context for command state
type CommandContextValue = {
  search: string;
  setSearch: (search: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  items: HTMLElement[];
  registerItem: (el: HTMLElement) => void;
  unregisterItem: (el: HTMLElement) => void;
  shouldFilter: boolean;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error('Command components must be used within Command');
  }
  return context;
}

// Root component
function Command({
  className,
  children,
  shouldFilter = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  shouldFilter?: boolean;
}) {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [items, setItems] = React.useState<HTMLElement[]>([]);

  const registerItem = React.useCallback((el: HTMLElement) => {
    setItems((prev) => {
      if (prev.includes(el)) return prev;
      return [...prev, el];
    });
  }, []);

  const unregisterItem = React.useCallback((el: HTMLElement) => {
    setItems((prev) => prev.filter((item) => item !== el));
  }, []);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const visibleItems = items.filter(
      (item) => !item.hasAttribute('data-hidden'),
    );

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < visibleItems.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : visibleItems.length - 1,
        );
        break;
      case 'Enter': {
        e.preventDefault();
        const selectedItem = visibleItems[selectedIndex];
        if (selectedItem) {
          selectedItem.click();
        }
        break;
      }
    }
  };

  React.useEffect(() => {
    const visibleItems = items.filter(
      (item) => !item.hasAttribute('data-hidden'),
    );
    visibleItems.forEach((item, index) => {
      if (index === selectedIndex) {
        item.setAttribute('data-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.removeAttribute('data-selected');
      }
    });
  }, [items, selectedIndex, search]);

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch,
        selectedIndex,
        setSelectedIndex,
        items,
        registerItem,
        unregisterItem,
        shouldFilter,
      }}
    >
      <div
        data-slot='command'
        className={cn(
          'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  shouldFilter,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  shouldFilter?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className='sr-only'>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('overflow-hidden p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command
          shouldFilter={shouldFilter}
          className='**:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-input-wrapper]:*:svg:h-5 **:data-[slot=command-input-wrapper]:*:svg:w-5 **:data-[slot=command-input]:h-12 **:data-[slot=command-item]:px-2 **:data-[slot=command-item]:py-3 **:data-[slot=command-item]:*:svg:h-5 **:data-[slot=command-item]:*:svg:w-5'
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

type CommandInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

function CommandInput({
  className,
  value,
  onValueChange,
  ...props
}: CommandInputProps) {
  const { search, setSearch } = useCommand();

  // Use external value/onChange if provided, otherwise use context
  const inputValue = value !== undefined ? value : search;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onValueChange) {
      onValueChange(newValue);
    }
    // Always update context so filtering works
    setSearch(newValue);
  };

  return (
    <div
      data-slot='command-input-wrapper'
      className='flex h-9 items-center gap-2 border-b px-3'
    >
      <SearchIcon className='size-4 shrink-0 opacity-50' />
      <input
        data-slot='command-input'
        type='text'
        value={inputValue}
        onChange={handleChange}
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot='command-list'
      className={cn(
        'min-h-[300px] max-h-[400px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { search, items } = useCommand();
  const visibleItems = items.filter(
    (item) => !item.hasAttribute('data-hidden'),
  );

  if (visibleItems.length > 0 || !search) return null;

  return (
    <div
      data-slot='command-empty'
      className='py-6 text-center text-sm'
      {...props}
    >
      {children || 'No results found.'}
    </div>
  );
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  heading?: string;
}) {
  return (
    <div
      data-slot='command-group'
      className={cn('text-foreground overflow-hidden p-1', className)}
      {...props}
    >
      {heading && (
        <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

function CommandSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot='command-separator'
      className={cn('bg-border -mx-1 h-px', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  value,
  disabled,
  onSelect,
  keywords,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  keywords?: string[];
}) {
  const { search, registerItem, unregisterItem, shouldFilter } = useCommand();
  const itemRef = React.useRef<HTMLDivElement>(null);

  // Register/unregister item
  React.useEffect(() => {
    const el = itemRef.current;
    if (el) {
      registerItem(el);
      return () => unregisterItem(el);
    }
  }, [registerItem, unregisterItem]);

  // Filter logic
  const isHidden = React.useMemo(() => {
    if (!shouldFilter || !search) return false;

    const searchLower = search.toLowerCase();
    const itemValue = (value || '').toLowerCase();
    const itemText = (
      typeof children === 'string' ? children : ''
    ).toLowerCase();
    const keywordsText = (keywords || []).join(' ').toLowerCase();

    return (
      !itemValue.includes(searchLower) &&
      !itemText.includes(searchLower) &&
      !keywordsText.includes(searchLower)
    );
  }, [search, value, children, keywords, shouldFilter]);

  const handleClick = () => {
    if (disabled) return;
    onSelect?.(value || '');
  };

  return (
    <div
      ref={itemRef}
      data-slot='command-item'
      data-value={value}
      data-disabled={disabled || undefined}
      data-hidden={isHidden || undefined}
      role='option'
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-selected={false}
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        isHidden && 'hidden',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot='command-shortcut'
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
