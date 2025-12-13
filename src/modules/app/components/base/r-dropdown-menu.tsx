'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

// Context for dropdown state
type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
}

// Context for radio group
type RadioGroupContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

// Context for sub menu
type SubMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

const SubMenuContext = React.createContext<SubMenuContextValue | null>(null);

// Animation variants
const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1, type: 'tween' as const },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      type: 'spring' as const,
      damping: 25,
      stiffness: 400,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1, type: 'tween' as const },
  },
};

// Root component
function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div data-slot='dropdown-menu' {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Portal (just renders children in portal)
function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-slot='dropdown-menu-portal'>{children}</div>,
    document.body,
  );
}

// Trigger
function DropdownMenuTrigger({
  children,
  className,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen, triggerRef } = useDropdown();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(!open);
    props.onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
    props.onKeyDown?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        ref: triggerRef,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'data-state': open ? 'open' : 'closed',
        'data-slot': 'dropdown-menu-trigger',
      },
    );
  }

  return (
    <button
      ref={triggerRef}
      type='button'
      data-slot='dropdown-menu-trigger'
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      aria-haspopup='menu'
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

// Content
function DropdownMenuContent({
  children,
  className,
  sideOffset = 4,
  align = 'start',
  side = 'bottom',
}: {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const { open, setOpen, triggerRef } = useDropdown();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [mounted, setMounted] = React.useState(false);

  // Calculate position
  React.useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const contentEl = contentRef.current;
      const contentWidth = contentEl?.offsetWidth || 200;
      const contentHeight = contentEl?.offsetHeight || 200;

      let top = 0;
      let left = 0;

      // Calculate based on side
      switch (side) {
        case 'bottom':
          top = rect.bottom + sideOffset;
          break;
        case 'top':
          top = rect.top - contentHeight - sideOffset;
          break;
        case 'left':
          left = rect.left - contentWidth - sideOffset;
          top = rect.top;
          break;
        case 'right':
          left = rect.right + sideOffset;
          top = rect.top;
          break;
      }

      // Calculate based on align (for top/bottom sides)
      if (side === 'bottom' || side === 'top') {
        switch (align) {
          case 'start':
            left = rect.left;
            break;
          case 'center':
            left = rect.left + rect.width / 2 - contentWidth / 2;
            break;
          case 'end':
            left = rect.right - contentWidth;
            break;
        }
      }

      // Boundary checks
      const padding = 8;
      if (left < padding) left = padding;
      if (left + contentWidth > window.innerWidth - padding) {
        left = window.innerWidth - contentWidth - padding;
      }
      if (top < padding) top = padding;
      if (top + contentHeight > window.innerHeight - padding) {
        top = window.innerHeight - contentHeight - padding;
      }

      setPosition({ top, left });
    };

    updatePosition();
    setMounted(true);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, triggerRef, sideOffset, align, side]);

  // Close on click outside
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen, triggerRef]);

  // Focus management
  React.useEffect(() => {
    if (open && contentRef.current) {
      const firstItem = contentRef.current.querySelector(
        '[data-slot="dropdown-menu-item"], [data-slot="dropdown-menu-checkbox-item"], [data-slot="dropdown-menu-radio-item"]',
      ) as HTMLElement;
      firstItem?.focus();
    }
  }, [open, mounted]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          data-slot='dropdown-menu-content'
          data-state={open ? 'open' : 'closed'}
          role='menu'
          aria-orientation='vertical'
          variants={contentVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          className={cn(
            'bg-popover text-popover-foreground z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md',
            className,
          )}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Group
function DropdownMenuGroup({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot='dropdown-menu-group' role='group' {...props}>
      {children}
    </div>
  );
}

// Label
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      data-slot='dropdown-menu-label'
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8',
        className,
      )}
      {...props}
    />
  );
}

// Item
function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  disabled,
  onSelect,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const { setOpen } = useDropdown();
  const itemRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
    props.onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
      setOpen(false);
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = itemRef.current?.nextElementSibling as HTMLElement;
      if (next?.getAttribute('data-slot')?.includes('dropdown-menu-')) {
        next.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = itemRef.current?.previousElementSibling as HTMLElement;
      if (prev?.getAttribute('data-slot')?.includes('dropdown-menu-')) {
        prev.focus();
      }
    }

    props.onKeyDown?.(e);
  };

  return (
    <div
      ref={itemRef}
      data-slot='dropdown-menu-item'
      data-inset={inset}
      data-variant={variant}
      data-disabled={disabled}
      role='menuitem'
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset=true]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

// Checkbox Item
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const itemRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onCheckedChange?.(!checked);
    props.onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCheckedChange?.(!checked);
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = itemRef.current?.nextElementSibling as HTMLElement;
      if (next?.getAttribute('data-slot')?.includes('dropdown-menu-')) {
        next.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = itemRef.current?.previousElementSibling as HTMLElement;
      if (prev?.getAttribute('data-slot')?.includes('dropdown-menu-')) {
        prev.focus();
      }
    }

    props.onKeyDown?.(e);
  };

  return (
    <div
      ref={itemRef}
      data-slot='dropdown-menu-checkbox-item'
      data-disabled={disabled}
      role='menuitemcheckbox'
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        {checked && <CheckIcon className='size-4' />}
      </span>
      {children}
    </div>
  );
}

// Radio Group
function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div data-slot='dropdown-menu-radio-group' role='group' {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// Radio Item
function DropdownMenuRadioItem({
  className,
  children,
  value,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
}) {
  const radioContext = React.useContext(RadioGroupContext);
  const itemRef = React.useRef<HTMLDivElement>(null);
  const isChecked = radioContext?.value === value;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    radioContext?.onValueChange(value);
    props.onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      radioContext?.onValueChange(value);
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = itemRef.current?.nextElementSibling as HTMLElement;
      if (next?.getAttribute('data-slot')?.includes('dropdown-menu-')) {
        next.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = itemRef.current?.previousElementSibling as HTMLElement;
      if (prev?.getAttribute('data-slot')?.includes('dropdown-menu-')) {
        prev.focus();
      }
    }

    props.onKeyDown?.(e);
  };

  return (
    <div
      ref={itemRef}
      data-slot='dropdown-menu-radio-item'
      data-disabled={disabled}
      role='menuitemradio'
      aria-checked={isChecked}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        {isChecked && <CircleIcon className='size-2 fill-current' />}
      </span>
      {children}
    </div>
  );
}

// Separator
function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot='dropdown-menu-separator'
      role='separator'
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

// Shortcut
function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  );
}

// Sub Menu
function DropdownMenuSub({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <SubMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div data-slot='dropdown-menu-sub' className='relative'>
        {children}
      </div>
    </SubMenuContext.Provider>
  );
}

// Sub Trigger
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
  disabled?: boolean;
}) {
  const subContext = React.useContext(SubMenuContext);

  const handleMouseEnter = () => {
    if (disabled) return;
    subContext?.setOpen(true);
  };

  const handleMouseLeave = () => {
    subContext?.setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      subContext?.setOpen(true);
    }

    props.onKeyDown?.(e);
  };

  return (
    <div
      ref={subContext?.triggerRef}
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset}
      data-state={subContext?.open ? 'open' : 'closed'}
      data-disabled={disabled}
      role='menuitem'
      aria-haspopup='menu'
      aria-expanded={subContext?.open}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset=true]:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
      <ChevronRightIcon className='ml-auto size-4' />
    </div>
  );
}

// Sub Content
function DropdownMenuSubContent({
  children,
  className,
  sideOffset = 2,
}: {
  children?: React.ReactNode;
  className?: string;
  sideOffset?: number;
}) {
  const subContext = React.useContext(SubMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!subContext?.open || !subContext.triggerRef.current) return;

    const updatePosition = () => {
      const trigger = subContext.triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const contentEl = contentRef.current;
      const contentWidth = contentEl?.offsetWidth || 200;

      let left = rect.right + sideOffset;
      const top = rect.top;

      // Boundary check - flip to left if no space on right
      if (left + contentWidth > window.innerWidth - 8) {
        left = rect.left - contentWidth - sideOffset;
      }

      setPosition({ top, left });
    };

    updatePosition();
  }, [subContext?.open, subContext?.triggerRef, sideOffset]);

  const handleMouseEnter = () => {
    subContext?.setOpen(true);
  };

  const handleMouseLeave = () => {
    subContext?.setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      e.preventDefault();
      subContext?.setOpen(false);
      subContext?.triggerRef.current?.focus();
    }
  };

  if (!subContext?.open) return null;

  return createPortal(
    <motion.div
      ref={contentRef}
      data-slot='dropdown-menu-sub-content'
      data-state={subContext.open ? 'open' : 'closed'}
      role='menu'
      variants={contentVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      className={cn(
        'bg-popover text-popover-foreground z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg',
        className,
      )}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {children}
    </motion.div>,
    document.body,
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
