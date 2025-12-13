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
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES
// ============================================================================

type TPopoverSide = 'top' | 'right' | 'bottom' | 'left';
type TPopoverAlign = 'start' | 'center' | 'end';

type TPopoverContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
};

// ============================================================================
// CONTEXT
// ============================================================================

const PopoverContext = createContext<TPopoverContext | null>(null);

function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover');
  }
  return context;
}

// ============================================================================
// POPOVER ROOT
// ============================================================================

type TPopoverProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Popover({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: TPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);

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
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

// ============================================================================
// POPOVER TRIGGER
// ============================================================================

type TPopoverTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

function PopoverTrigger({ children, asChild }: TPopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopover();

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
      },
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
    });
  }

  return (
    <button
      type='button'
      ref={(node) => {
        triggerRef.current = node;
      }}
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup='dialog'
    >
      {children}
    </button>
  );
}

// ============================================================================
// POPOVER ANCHOR
// ============================================================================

type TPopoverAnchorProps = {
  children: ReactNode;
  asChild?: boolean;
};

function PopoverAnchor({ children, asChild }: TPopoverAnchorProps) {
  const { triggerRef } = usePopover();

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
      },
    });
  }

  return (
    <div
      ref={(node) => {
        triggerRef.current = node;
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// POPOVER CONTENT
// ============================================================================

type TPopoverContentProps = {
  children: ReactNode;
  className?: string;
  side?: TPopoverSide;
  sideOffset?: number;
  align?: TPopoverAlign;
  onOpenAutoFocus?: (e: Event) => void;
  onCloseAutoFocus?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onPointerDownOutside?: (e: PointerEvent) => void;
};

function PopoverContent({
  children,
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  onEscapeKeyDown,
  onPointerDownOutside,
}: TPopoverContentProps) {
  const { open, setOpen, triggerRef } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CSSProperties>({});
  const [isVisible, setIsVisible] = useState(false);

  // Calculate position
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!contentRef.current || !triggerRef.current) return;

      const trigger = triggerRef.current.getBoundingClientRect();
      const content = contentRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let top = 0;
      let left = 0;

      // Calculate position based on side
      switch (side) {
        case 'top':
          top = trigger.top + scrollY - content.height - sideOffset;
          break;
        case 'bottom':
          top = trigger.bottom + scrollY + sideOffset;
          break;
        case 'left':
          left = trigger.left + scrollX - content.width - sideOffset;
          break;
        case 'right':
          left = trigger.right + scrollX + sideOffset;
          break;
      }

      // Calculate alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            left = trigger.left + scrollX;
            break;
          case 'center':
            left =
              trigger.left + scrollX + trigger.width / 2 - content.width / 2;
            break;
          case 'end':
            left = trigger.right + scrollX - content.width;
            break;
        }
      } else {
        switch (align) {
          case 'start':
            top = trigger.top + scrollY;
            break;
          case 'center':
            top =
              trigger.top + scrollY + trigger.height / 2 - content.height / 2;
            break;
          case 'end':
            top = trigger.bottom + scrollY - content.height;
            break;
        }
      }

      // Clamp to viewport
      const padding = 8;
      left = Math.max(
        padding,
        Math.min(left, window.innerWidth - content.width - padding),
      );
      top = Math.max(
        padding,
        Math.min(top, window.innerHeight + scrollY - content.height - padding),
      );

      setPosition({ top, left });
      setIsVisible(true);
    };

    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [open, side, align, sideOffset, triggerRef]);

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeKeyDown?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen, onEscapeKeyDown]);

  // Handle click outside
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onPointerDownOutside?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, setOpen, triggerRef, onPointerDownOutside]);

  // Reset visibility when closed
  useEffect(() => {
    if (!open) {
      setIsVisible(false);
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      role='dialog'
      className={cn(
        'fixed z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'transition-all duration-150',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className,
      )}
      style={position}
    >
      {children}
    </div>,
    document.body,
  );
}

// ============================================================================
// POPOVER ARROW
// ============================================================================

type TPopoverArrowProps = {
  className?: string;
};

function PopoverArrow({ className }: TPopoverArrowProps) {
  // Arrow is optional and can be styled via className
  return (
    <div
      className={cn('absolute size-2 rotate-45 bg-popover border', className)}
    />
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverArrow };
