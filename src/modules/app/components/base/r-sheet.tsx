import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES
// ============================================================================

type TSheetSide = 'top' | 'right' | 'bottom' | 'left';

type TSheetContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

// ============================================================================
// CONTEXT
// ============================================================================

const SheetContext = createContext<TSheetContext | null>(null);

function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within Sheet');
  }
  return context;
}

// ============================================================================
// SHEET ROOT
// ============================================================================

type TSheetProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Sheet({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: TSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

// ============================================================================
// SHEET TRIGGER
// ============================================================================

type TSheetTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

function SheetTrigger({ children, asChild }: TSheetTriggerProps) {
  const { setOpen } = useSheet();

  const handleClick = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      onClick: handleClick,
    });
  }

  return (
    <button type='button' onClick={handleClick}>
      {children}
    </button>
  );
}

// ============================================================================
// SHEET CLOSE
// ============================================================================

type TSheetCloseProps = {
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
};

function SheetClose({ children, asChild, className }: TSheetCloseProps) {
  const { setOpen } = useSheet();

  const handleClick = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      onClick: handleClick,
    });
  }

  return (
    <button type='button' onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

// ============================================================================
// SHEET PORTAL & OVERLAY
// ============================================================================

function SheetPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}

type TSheetOverlayProps = {
  className?: string;
  onClick?: () => void;
};

function SheetOverlay({ className, onClick }: TSheetOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'animate-in fade-in-0 duration-300',
        className,
      )}
      onClick={onClick}
      aria-hidden='true'
    />
  );
}

// ============================================================================
// SHEET CONTENT
// ============================================================================

export type TSheetContentProps = {
  children: ReactNode;
  className?: string;
  side?: TSheetSide;
  style?: React.CSSProperties;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onPointerDownOutside?: (e: PointerEvent) => void;
};

function SheetContent({
  children,
  className,
  side = 'right',
  style,
  onEscapeKeyDown,
}: TSheetContentProps) {
  const { open, setOpen } = useSheet();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Focus management and escape key
  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeKeyDown?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousActiveElement.current?.focus();
    };
  }, [open, setOpen, onEscapeKeyDown]);

  const handleOverlayClick = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (!shouldRender) return null;

  const slideClasses = {
    right: isAnimating ? 'translate-x-0' : 'translate-x-full',
    left: isAnimating ? 'translate-x-0' : '-translate-x-full',
    top: isAnimating ? 'translate-y-0' : '-translate-y-full',
    bottom: isAnimating ? 'translate-y-0' : 'translate-y-full',
  };

  const positionClasses = {
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    top: 'inset-x-0 top-0 h-auto border-b',
    bottom: 'inset-x-0 bottom-0 h-auto border-t',
  };

  return (
    <SheetPortal>
      <SheetOverlay
        onClick={handleOverlayClick}
        className={cn(!isAnimating && 'opacity-0')}
      />
      <div
        ref={contentRef}
        role='dialog'
        aria-modal='true'
        style={style}
        className={cn(
          'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
          'transition-transform duration-300 ease-in-out',
          positionClasses[side],
          slideClasses[side],
          className,
        )}
      >
        {children}
        <SheetClose
          className={cn(
            'ring-offset-background focus:ring-ring',
            'absolute top-4 right-4 rounded-xs opacity-70',
            'transition-opacity hover:opacity-100',
            'focus:ring-2 focus:ring-offset-2 focus:outline-hidden',
            'disabled:pointer-events-none',
          )}
        >
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </SheetClose>
      </div>
    </SheetPortal>
  );
}

// ============================================================================
// SHEET HEADER & FOOTER
// ============================================================================

function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
  );
}

function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

// ============================================================================
// SHEET TITLE & DESCRIPTION
// ============================================================================

type TSheetTitleProps = HTMLAttributes<HTMLHeadingElement>;

function SheetTitle({ className, ...props }: TSheetTitleProps) {
  return (
    <h2 className={cn('text-foreground font-semibold', className)} {...props} />
  );
}

type TSheetDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

function SheetDescription({ className, ...props }: TSheetDescriptionProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
