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
import { X } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import { useSmartStack } from '@/modules/app/hooks/use-smart-stack';

// ============================================================================
// TYPES
// ============================================================================

type TDialogContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  overlayZIndex: number;
  contentZIndex: number;
};

// ============================================================================
// CONTEXT
// ============================================================================

const DialogContext = createContext<TDialogContext | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog');
  }
  return context;
}

// ============================================================================
// DIALOG ROOT
// ============================================================================

type TDialogProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Dialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: TDialogProps) {
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

  // Smart stack for dynamic z-index
  const { overlayZIndex, contentZIndex } = useSmartStack({ enabled: open });

  return (
    <DialogContext.Provider
      value={{ open, setOpen, overlayZIndex, contentZIndex }}
    >
      {children}
    </DialogContext.Provider>
  );
}

// ============================================================================
// DIALOG TRIGGER
// ============================================================================

type TDialogTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

function DialogTrigger({ children, asChild }: TDialogTriggerProps) {
  const { setOpen } = useDialog();

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
// DIALOG CLOSE
// ============================================================================

type TDialogCloseProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
};

function DialogClose({ children, asChild, className }: TDialogCloseProps) {
  const { setOpen } = useDialog();

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
// DIALOG PORTAL & OVERLAY
// ============================================================================

function DialogPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}

type TDialogOverlayProps = {
  children?: ReactNode;
  className?: string;
  fullscreen?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  zIndex?: number;
};

function DialogOverlay({
  children,
  className,
  fullscreen = false,
  onClick,
  zIndex,
}: TDialogOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/40',
        'animate-in fade-in-0 duration-200',
        !fullscreen && 'overflow-y-auto py-16 grid place-items-center',
        className,
      )}
      style={{ zIndex }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ============================================================================
// DIALOG CONTENT
// ============================================================================

type TDialogContentProps = {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  fullscreen?: boolean;
  overlayClassName?: string;
  closeClassName?: string;
  onOpenAutoFocus?: (e: Event) => void;
  onCloseAutoFocus?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onPointerDownOutside?: (e: PointerEvent) => void;
};

function DialogContent({
  children,
  className,
  showCloseButton = true,
  fullscreen = false,
  overlayClassName,
  closeClassName,
  onOpenAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
}: TDialogContentProps) {
  const { open, setOpen, overlayZIndex, contentZIndex } = useDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus management and escape key
  useEffect(() => {
    if (!open) return;

    // Store previous focus
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus content or first focusable element
    const focusableElements = contentRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (onOpenAutoFocus) {
      const event = new Event('focus');
      onOpenAutoFocus(event);
      if (!event.defaultPrevented && focusableElements?.length) {
        focusableElements[0].focus();
      }
    } else if (focusableElements?.length) {
      // Default: prevent auto focus
    }

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeKeyDown?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }

      // Focus trap
      if (e.key === 'Tab' && focusableElements?.length) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [open, setOpen, onOpenAutoFocus, onEscapeKeyDown]);

  // Handle click outside
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        const pointerEvent = new PointerEvent('pointerdown');
        onPointerDownOutside?.(pointerEvent);
        if (!pointerEvent.defaultPrevented) {
          setOpen(false);
        }
      }
    },
    [setOpen, onPointerDownOutside],
  );

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay
        fullscreen={fullscreen}
        className={overlayClassName}
        onClick={handleOverlayClick}
        zIndex={overlayZIndex}
      >
        <div
          ref={contentRef}
          role='dialog'
          aria-modal='true'
          onClick={(e) => e.stopPropagation()}
          style={{ zIndex: contentZIndex }}
          className={cn(
            'grid gap-4 bg-background p-6 shadow-lg duration-200',
            'animate-in fade-in-0 zoom-in-95',
            !fullscreen && 'w-full max-w-lg sm:rounded-lg md:w-full relative',
            fullscreen && 'h-full',
            className,
          )}
        >
          {children}
          {showCloseButton && (
            <DialogClose
              className={cn(
                'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background',
                'transition-opacity hover:opacity-100',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:pointer-events-none cursor-pointer',
                closeClassName,
              )}
            >
              <X className={cn('h-5 w-5', fullscreen && 'text-white')} />
              <span className='sr-only'>Close</span>
            </DialogClose>
          )}
        </div>
      </DialogOverlay>
    </DialogPortal>
  );
}

// ============================================================================
// DIALOG HEADER & FOOTER
// ============================================================================

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// DIALOG TITLE & DESCRIPTION
// ============================================================================

type TDialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

function DialogTitle({ className, ...props }: TDialogTitleProps) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

type TDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

function DialogDescription({ className, ...props }: TDialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
