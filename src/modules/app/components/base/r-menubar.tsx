import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES & CONTEXT
// ============================================================================

type TMenubarContext = {
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  triggerRefs: Map<string, HTMLButtonElement>;
  registerTrigger: (id: string, ref: HTMLButtonElement) => void;
};

const MenubarContext = createContext<TMenubarContext | null>(null);

function useMenubar() {
  const context = useContext(MenubarContext);
  if (!context)
    throw new Error('Menubar components must be used within Menubar');
  return context;
}

type TMenuContext = {
  menuId: string;
  closeMenu: () => void;
};

const MenuContext = createContext<TMenuContext | null>(null);

function useMenu() {
  return useContext(MenuContext);
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const menuVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
};

// ============================================================================
// MENUBAR ROOT
// ============================================================================

type TMenubarProps = HTMLAttributes<HTMLDivElement>;

const Menubar = forwardRef<HTMLDivElement, TMenubarProps>(
  ({ children, className, ...props }, ref) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const triggerRefs = useRef(new Map<string, HTMLButtonElement>()).current;

    const registerTrigger = useCallback(
      (id: string, triggerRef: HTMLButtonElement) => {
        triggerRefs.set(id, triggerRef);
      },
      [triggerRefs],
    );

    useEffect(() => {
      if (!activeMenu) return;

      const handleClickOutside = (e: MouseEvent) => {
        const isInsideMenubar = (e.target as Element).closest('[data-menubar]');
        const isInsideMenu = (e.target as Element).closest(
          '[data-menubar-content]',
        );

        if (!isInsideMenubar && !isInsideMenu) {
          setActiveMenu(null);
        }
      };

      const handleEscape = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') setActiveMenu(null);
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [activeMenu]);

    return (
      <MenubarContext.Provider
        value={{ activeMenu, setActiveMenu, triggerRefs, registerTrigger }}
      >
        <div
          ref={ref}
          data-menubar
          role='menubar'
          className={cn(
            'flex h-9 items-center gap-1 rounded-lg border bg-background p-1 shadow-sm',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </MenubarContext.Provider>
    );
  },
);

Menubar.displayName = 'Menubar';

// ============================================================================
// MENU
// ============================================================================

type TMenubarMenuProps = {
  children: ReactNode;
};

function MenubarMenu({ children }: TMenubarMenuProps) {
  const menuId = useRef(`menu-${Math.random().toString(36).slice(2)}`).current;
  const { setActiveMenu } = useMenubar();

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, [setActiveMenu]);

  return (
    <MenuContext.Provider value={{ menuId, closeMenu }}>
      <div className='relative'>{children}</div>
    </MenuContext.Provider>
  );
}

// ============================================================================
// TRIGGER
// ============================================================================

type TMenubarTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
};

const MenubarTrigger = forwardRef<HTMLButtonElement, TMenubarTriggerProps>(
  ({ children, disabled, className, ...props }, ref) => {
    const { activeMenu, setActiveMenu, registerTrigger } = useMenubar();
    const menu = useMenu();
    const internalRef = useRef<HTMLButtonElement>(null);
    const isOpen = activeMenu === menu?.menuId;

    useEffect(() => {
      const triggerEl = internalRef.current;
      if (triggerEl && menu) {
        registerTrigger(menu.menuId, triggerEl);
      }
    }, [menu, registerTrigger]);

    const handleClick = () => {
      if (disabled) return;
      setActiveMenu(isOpen ? null : (menu?.menuId ?? null));
    };

    const handleMouseEnter = () => {
      if (activeMenu && !disabled && menu) {
        setActiveMenu(menu.menuId);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (menu) setActiveMenu(menu.menuId);
      }
    };

    return (
      <button
        ref={(node) => {
          (
            internalRef as React.MutableRefObject<HTMLButtonElement | null>
          ).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type='button'
        role='menuitem'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex cursor-pointer select-none items-center rounded-md px-3 py-1 text-sm font-medium outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground',
          isOpen && 'bg-accent text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

MenubarTrigger.displayName = 'MenubarTrigger';

// ============================================================================
// CONTENT
// ============================================================================

type TMenubarContentProps = {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

function MenubarContent({
  children,
  className,
  align = 'start',
  sideOffset = 4,
}: TMenubarContentProps) {
  const { activeMenu, triggerRefs } = useMenubar();
  const menu = useMenu();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const isOpen = activeMenu === menu?.menuId;

  useEffect(() => {
    if (!isOpen || !menu) return;

    const trigger = triggerRefs.get(menu.menuId);
    if (!trigger) return;

    const updatePosition = () => {
      const triggerRect = trigger.getBoundingClientRect();
      const gap = 8;

      // Initial position
      let left = triggerRect.left;
      let top = triggerRect.bottom + sideOffset;

      // Wait for content to render to get its dimensions
      requestAnimationFrame(() => {
        const content = contentRef.current?.getBoundingClientRect();
        if (!content) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Align handling
        if (align === 'center') {
          left = triggerRect.left + triggerRect.width / 2 - content.width / 2;
        } else if (align === 'end') {
          left = triggerRect.right - content.width;
        }

        // Check right edge collision
        if (left + content.width > viewportWidth - gap) {
          left = viewportWidth - content.width - gap;
        }

        // Check left edge collision
        if (left < gap) {
          left = gap;
        }

        // Check bottom edge collision - flip to top if needed
        if (top + content.height > viewportHeight - gap) {
          top = triggerRect.top - content.height - sideOffset;
        }

        // Check top edge collision (if flipped)
        if (top < gap) {
          top = gap;
        }

        setPosition({ top, left });
      });

      // Set initial position immediately
      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen, menu, triggerRefs, align, sideOffset]);

  // Reset submenu when content closes
  useEffect(() => {
    if (!isOpen) {
      setOpenSubId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <SubMenuContext.Provider value={{ openSubId, setOpenSubId }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            data-menubar-content
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={menuVariants}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'fixed z-50 min-w-[180px] overflow-hidden rounded-lg border bg-popover p-1 shadow-lg',
              className,
            )}
            style={{ top: position.top, left: position.left }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </SubMenuContext.Provider>,
    document.body,
  );
}

// ============================================================================
// MENU ITEMS
// ============================================================================

type TMenubarItemProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
};

const MenubarItem = forwardRef<HTMLDivElement, TMenubarItemProps>(
  (
    { children, disabled, destructive, onSelect, className, onClick, ...props },
    ref,
  ) => {
    const menu = useMenu();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onSelect?.();
      menu?.closeMenu();
      onClick?.(e);
    };

    return (
      <div
        ref={ref}
        role='menuitem'
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          destructive &&
            'text-destructive hover:bg-destructive/10 hover:text-destructive',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MenubarItem.displayName = 'MenubarItem';

// Checkbox Item
type TMenubarCheckboxItemProps = TMenubarItemProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const MenubarCheckboxItem = forwardRef<
  HTMLDivElement,
  TMenubarCheckboxItemProps
>(({ children, checked, onCheckedChange, className, ...props }, ref) => {
  return (
    <MenubarItem
      ref={ref}
      role='menuitemcheckbox'
      aria-checked={checked}
      onSelect={() => onCheckedChange?.(!checked)}
      className={cn('pl-8', className)}
      {...props}
    >
      <span className='absolute left-2 flex h-4 w-4 items-center justify-center'>
        {checked && <Check className='h-4 w-4' />}
      </span>
      {children}
    </MenubarItem>
  );
});

MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

// Radio Group & Item
const RadioGroupContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

type TMenubarRadioGroupProps = {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
};

function MenubarRadioGroup({
  children,
  value,
  onValueChange,
}: TMenubarRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
}

type TMenubarRadioItemProps = TMenubarItemProps & {
  value: string;
};

const MenubarRadioItem = forwardRef<HTMLDivElement, TMenubarRadioItemProps>(
  ({ children, value, className, ...props }, ref) => {
    const radioContext = useContext(RadioGroupContext);
    const checked = radioContext?.value === value;

    return (
      <MenubarItem
        ref={ref}
        role='menuitemradio'
        aria-checked={checked}
        onSelect={() => radioContext?.onValueChange?.(value)}
        className={cn('pl-8', className)}
        {...props}
      >
        <span className='absolute left-2 flex h-4 w-4 items-center justify-center'>
          {checked && <Circle className='h-2 w-2 fill-current' />}
        </span>
        {children}
      </MenubarItem>
    );
  },
);

MenubarRadioItem.displayName = 'MenubarRadioItem';

// ============================================================================
// SUB MENU
// ============================================================================

const SubMenuContext = createContext<{
  openSubId: string | null;
  setOpenSubId: (id: string | null) => void;
} | null>(null);

// Context for individual sub menu
const SubItemContext = createContext<{
  subId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
} | null>(null);

type TMenubarSubProps = {
  children: ReactNode;
};

function MenubarSub({ children }: TMenubarSubProps) {
  const subId = useRef(`sub-${Math.random().toString(36).slice(2)}`).current;
  const triggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <SubItemContext.Provider value={{ subId, triggerRef }}>
      <div className='relative'>{children}</div>
    </SubItemContext.Provider>
  );
}

type TMenubarSubTriggerProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
};

const MenubarSubTrigger = forwardRef<HTMLDivElement, TMenubarSubTriggerProps>(
  ({ children, disabled, className, ...props }, ref) => {
    const subContext = useContext(SubMenuContext);
    const subItemContext = useContext(SubItemContext);

    const handleMouseEnter = () => {
      if (!disabled && subItemContext && subContext) {
        subContext.setOpenSubId(subItemContext.subId);
      }
    };

    return (
      <div
        ref={(node) => {
          if (subItemContext) subItemContext.triggerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role='menuitem'
        aria-haspopup='menu'
        aria-disabled={disabled}
        onMouseEnter={handleMouseEnter}
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRight className='ml-auto h-4 w-4' />
      </div>
    );
  },
);

MenubarSubTrigger.displayName = 'MenubarSubTrigger';

type TMenubarSubContentProps = {
  children: ReactNode;
  className?: string;
};

function MenubarSubContent({ children, className }: TMenubarSubContentProps) {
  const subContext = useContext(SubMenuContext);
  const subItemContext = useContext(SubItemContext);
  const isOpen = subContext?.openSubId === subItemContext?.subId;
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && subItemContext?.triggerRef.current) {
      const triggerRect =
        subItemContext.triggerRef.current.getBoundingClientRect();
      const gap = 4;

      // Initial position (right of trigger)
      let top = triggerRect.top;
      let left = triggerRect.right + gap;

      // Wait for content to render to get its dimensions
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const contentRect = contentRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Check right edge collision - flip to left
          if (left + contentRect.width > viewportWidth - gap) {
            left = triggerRect.left - contentRect.width - gap;
          }

          // Check left edge collision
          if (left < gap) {
            left = gap;
          }

          // Check bottom edge collision
          if (top + contentRect.height > viewportHeight - gap) {
            top = viewportHeight - contentRect.height - gap;
          }

          // Check top edge collision
          if (top < gap) {
            top = gap;
          }

          setPosition({ top, left });
        }
      });

      // Set initial position immediately
      setPosition({ top, left });
    }
  }, [isOpen, subItemContext]);

  const handleMouseEnter = () => {
    if (subItemContext && subContext) {
      subContext.setOpenSubId(subItemContext.subId);
    }
  };

  const handleMouseLeave = () => {
    subContext?.setOpenSubId(null);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
          style={{ top: position.top, left: position.left }}
          className={cn(
            'fixed z-60 min-w-[160px] overflow-hidden rounded-lg border bg-popover p-1 shadow-lg',
            className,
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

function MenubarSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} />;
}

function MenubarLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}

function MenubarShortcut({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarSeparator,
  MenubarLabel,
  MenubarShortcut,
};
