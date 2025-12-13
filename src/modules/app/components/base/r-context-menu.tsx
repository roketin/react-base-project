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
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES
// ============================================================================

type TPosition = { x: number; y: number };

type TContextMenuContext = {
  open: boolean;
  position: TPosition;
  openMenu: (pos: TPosition) => void;
  closeMenu: () => void;
};

type TSubMenuContext = {
  openSubId: string | null;
  setOpenSubId: (id: string | null) => void;
};

// ============================================================================
// CONTEXT
// ============================================================================

const ContextMenuContext = createContext<TContextMenuContext | null>(null);
const SubMenuContext = createContext<TSubMenuContext | null>(null);

function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context)
    throw new Error('ContextMenu components must be used within ContextMenu');
  return context;
}

function useSubMenu() {
  return useContext(SubMenuContext);
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const menuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -4 },
};

const subMenuVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
};

// ============================================================================
// CONTEXT MENU ROOT
// ============================================================================

type TContextMenuProps = {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

function ContextMenu({ children, onOpenChange }: TContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<TPosition>({ x: 0, y: 0 });

  const openMenu = useCallback(
    (pos: TPosition) => {
      setPosition(pos);
      setOpen(true);
      onOpenChange?.(true);
    },
    [onOpenChange],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <ContextMenuContext.Provider
      value={{ open, position, openMenu, closeMenu }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

// ============================================================================
// TRIGGER
// ============================================================================

type TContextMenuTriggerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  disabled?: boolean;
};

const ContextMenuTrigger = forwardRef<HTMLDivElement, TContextMenuTriggerProps>(
  ({ children, disabled, onContextMenu, ...props }, ref) => {
    const { openMenu } = useContextMenu();

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      openMenu({ x: e.clientX, y: e.clientY });
      onContextMenu?.(e);
    };

    return (
      <div ref={ref} onContextMenu={handleContextMenu} {...props}>
        {children}
      </div>
    );
  },
);

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

// ============================================================================
// CONTENT
// ============================================================================

type TContextMenuContentProps = {
  children: ReactNode;
  className?: string;
};

function ContextMenuContent({ children, className }: TContextMenuContentProps) {
  const { open, position, closeMenu } = useContextMenu();
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  useEffect(() => {
    if (!open) {
      setOpenSubId(null);
      return;
    }

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open || !contentRef.current) return;

    const rect = contentRef.current.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    let x = position.x;
    let y = position.y;

    if (x + rect.width > viewport.width - 8)
      x = viewport.width - rect.width - 8;
    if (y + rect.height > viewport.height - 8)
      y = viewport.height - rect.height - 8;
    if (x < 8) x = 8;
    if (y < 8) y = 8;

    setAdjustedPos({ x, y });
  }, [open, position]);

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <SubMenuContext.Provider value={{ openSubId, setOpenSubId }}>
          <motion.div
            ref={contentRef}
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={menuVariants}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'fixed z-50 min-w-[180px] overflow-hidden rounded-lg border bg-popover p-1 shadow-lg',
              className,
            )}
            style={{ left: adjustedPos.x, top: adjustedPos.y }}
          >
            {children}
          </motion.div>
        </SubMenuContext.Provider>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ============================================================================
// MENU ITEMS
// ============================================================================

type TContextMenuItemProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
};

const ContextMenuItem = forwardRef<HTMLDivElement, TContextMenuItemProps>(
  (
    { children, disabled, destructive, onSelect, className, onClick, ...props },
    ref,
  ) => {
    const { closeMenu } = useContextMenu();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onSelect?.();
      closeMenu();
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
          'focus:bg-accent focus:text-accent-foreground',
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

ContextMenuItem.displayName = 'ContextMenuItem';

// ============================================================================
// CHECKBOX ITEM
// ============================================================================

type TContextMenuCheckboxItemProps = TContextMenuItemProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  TContextMenuCheckboxItemProps
>(({ children, checked, onCheckedChange, className, ...props }, ref) => {
  return (
    <ContextMenuItem
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
    </ContextMenuItem>
  );
});

ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

// ============================================================================
// RADIO GROUP & ITEM
// ============================================================================

type TContextMenuRadioGroupProps = {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

function ContextMenuRadioGroup({
  children,
  value,
  onValueChange,
}: TContextMenuRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
}

type TContextMenuRadioItemProps = TContextMenuItemProps & {
  value: string;
};

const ContextMenuRadioItem = forwardRef<
  HTMLDivElement,
  TContextMenuRadioItemProps
>(({ children, value, className, ...props }, ref) => {
  const radioContext = useContext(RadioGroupContext);
  const checked = radioContext?.value === value;

  return (
    <ContextMenuItem
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
    </ContextMenuItem>
  );
});

ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

// ============================================================================
// SUB MENU
// ============================================================================

type TContextMenuSubProps = {
  children: ReactNode;
};

const SubContext = createContext<{
  subId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
} | null>(null);

function ContextMenuSub({ children }: TContextMenuSubProps) {
  const subId = useRef(`sub-${Math.random().toString(36).slice(2)}`).current;
  const triggerRef = useRef<HTMLDivElement | null>(null);
  return (
    <SubContext.Provider value={{ subId, triggerRef }}>
      <div className='relative'>{children}</div>
    </SubContext.Provider>
  );
}

type TContextMenuSubTriggerProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
};

const ContextMenuSubTrigger = forwardRef<
  HTMLDivElement,
  TContextMenuSubTriggerProps
>(({ children, disabled, className, ...props }, ref) => {
  const subContext = useContext(SubContext);
  const subMenuContext = useSubMenu();

  const handleMouseEnter = () => {
    if (!disabled && subContext && subMenuContext) {
      subMenuContext.setOpenSubId(subContext.subId);
    }
  };

  return (
    <div
      ref={(node) => {
        if (subContext) subContext.triggerRef.current = node;
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
});

ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

type TContextMenuSubContentProps = {
  children: ReactNode;
  className?: string;
};

function ContextMenuSubContent({
  children,
  className,
}: TContextMenuSubContentProps) {
  const subContext = useContext(SubContext);
  const subMenuContext = useSubMenu();
  const isOpen = subMenuContext?.openSubId === subContext?.subId;
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && subContext?.triggerRef.current) {
      const triggerRect = subContext.triggerRef.current.getBoundingClientRect();
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
  }, [isOpen, subContext]);

  const handleMouseEnter = () => {
    if (subContext && subMenuContext) {
      subMenuContext.setOpenSubId(subContext.subId);
    }
  };

  const handleMouseLeave = () => {
    subMenuContext?.setOpenSubId(null);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={subMenuVariants}
          transition={{ duration: 0.15, ease: 'easeOut' }}
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

function ContextMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} />;
}

function ContextMenuLabel({
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

type TContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;

function ContextMenuShortcut({
  className,
  ...props
}: TContextMenuShortcutProps) {
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
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
};
