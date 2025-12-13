import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES
// ============================================================================

type TSide = 'top' | 'right' | 'bottom' | 'left';
type TAlign = 'start' | 'center' | 'end';

export type TRHoverCardProps = {
  children: ReactNode;
  content: ReactNode;
  side?: TSide;
  align?: TAlign;
  sideOffset?: number;
  alignOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  arrowClassName?: string;
  showArrow?: boolean;
};

// ============================================================================
// ANIMATIONS
// ============================================================================

const getAnimationVariants = (side: TSide) => {
  const offset = 8;
  const directions = {
    top: { y: offset },
    bottom: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  };

  return {
    hidden: { opacity: 0, scale: 0.96, ...directions[side] },
    visible: { opacity: 1, scale: 1, x: 0, y: 0 },
    exit: { opacity: 0, scale: 0.96, ...directions[side] },
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

export const RHoverCard = forwardRef<HTMLDivElement, TRHoverCardProps>(
  (
    {
      children,
      content,
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      alignOffset = 0,
      openDelay = 200,
      closeDelay = 300,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      contentClassName,
      arrowClassName,
      showArrow = true,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [position, setPosition] = useState<{
      top: number;
      left: number;
    } | null>(null);
    const [actualSide, setActualSide] = useState(side);
    const [visible, setVisible] = useState(false);

    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) setInternalOpen(value);
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange],
    );

    const clearTimeouts = useCallback(() => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }, []);

    const handleOpen = useCallback(() => {
      if (disabled) return;
      clearTimeouts();
      openTimeoutRef.current = setTimeout(() => setOpen(true), openDelay);
    }, [disabled, openDelay, setOpen, clearTimeouts]);

    const handleClose = useCallback(() => {
      clearTimeouts();
      closeTimeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
    }, [closeDelay, setOpen, clearTimeouts]);

    const handleContentEnter = useCallback(() => {
      clearTimeouts();
    }, [clearTimeouts]);

    const handleContentLeave = useCallback(() => {
      handleClose();
    }, [handleClose]);

    useEffect(() => clearTimeouts, [clearTimeouts]);

    // Calculate position
    useEffect(() => {
      if (!isOpen || !triggerRef.current || !contentRef.current) {
        setVisible(false);
        return;
      }

      const updatePosition = () => {
        const trigger = triggerRef.current?.getBoundingClientRect();
        const content = contentRef.current?.getBoundingClientRect();
        if (!trigger || !content) return;

        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        let finalSide = side;

        const calcPos = (s: TSide) => {
          let top = 0;
          let left = 0;

          if (s === 'top') {
            top = trigger.top - content.height - sideOffset;
            left = trigger.left + trigger.width / 2 - content.width / 2;
          } else if (s === 'bottom') {
            top = trigger.bottom + sideOffset;
            left = trigger.left + trigger.width / 2 - content.width / 2;
          } else if (s === 'left') {
            top = trigger.top + trigger.height / 2 - content.height / 2;
            left = trigger.left - content.width - sideOffset;
          } else {
            top = trigger.top + trigger.height / 2 - content.height / 2;
            left = trigger.right + sideOffset;
          }

          // Alignment
          if (s === 'top' || s === 'bottom') {
            if (align === 'start') left = trigger.left + alignOffset;
            else if (align === 'end')
              left = trigger.right - content.width + alignOffset;
            else left += alignOffset;
          } else {
            if (align === 'start') top = trigger.top + alignOffset;
            else if (align === 'end')
              top = trigger.bottom - content.height + alignOffset;
            else top += alignOffset;
          }

          return { top, left };
        };

        let { top, left } = calcPos(side);

        // Collision detection
        const pad = 8;
        if (side === 'top' && top < pad) {
          finalSide = 'bottom';
          ({ top, left } = calcPos('bottom'));
        } else if (
          side === 'bottom' &&
          top + content.height > viewport.height - pad
        ) {
          finalSide = 'top';
          ({ top, left } = calcPos('top'));
        } else if (side === 'left' && left < pad) {
          finalSide = 'right';
          ({ top, left } = calcPos('right'));
        } else if (
          side === 'right' &&
          left + content.width > viewport.width - pad
        ) {
          finalSide = 'left';
          ({ top, left } = calcPos('left'));
        }

        left = Math.max(
          pad,
          Math.min(left, viewport.width - content.width - pad),
        );
        top = Math.max(
          pad,
          Math.min(top, viewport.height - content.height - pad),
        );

        setActualSide(finalSide);
        setPosition({ top: top + window.scrollY, left: left + window.scrollX });
        requestAnimationFrame(() => setVisible(true));
      };

      requestAnimationFrame(updatePosition);

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [isOpen, side, align, sideOffset, alignOffset]);

    const arrowStyles: Record<TSide, string> = {
      top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
      bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
      left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
      right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    };

    const cardContent = (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial='hidden'
            animate={visible ? 'visible' : 'hidden'}
            exit='exit'
            variants={getAnimationVariants(actualSide)}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={handleContentEnter}
            onMouseLeave={handleContentLeave}
            className={cn(
              'fixed z-50 w-64 rounded-lg border bg-popover p-4 shadow-lg',
              contentClassName,
            )}
            style={
              position
                ? { top: position.top, left: position.left }
                : { top: -9999, left: -9999 }
            }
          >
            {content}
            {showArrow && (
              <div
                className={cn(
                  'absolute h-2.5 w-2.5 border bg-popover',
                  actualSide === 'top' && 'border-t-0 border-l-0',
                  actualSide === 'bottom' && 'border-b-0 border-r-0',
                  actualSide === 'left' && 'border-l-0 border-b-0',
                  actualSide === 'right' && 'border-r-0 border-t-0',
                  arrowStyles[actualSide],
                  arrowClassName,
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );

    return (
      <>
        <div
          ref={(node) => {
            (
              triggerRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn('inline-block', className)}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          onFocus={handleOpen}
          onBlur={handleClose}
        >
          {children}
        </div>
        {typeof document !== 'undefined' &&
          createPortal(cardContent, document.body)}
      </>
    );
  },
);

RHoverCard.displayName = 'RHoverCard';
