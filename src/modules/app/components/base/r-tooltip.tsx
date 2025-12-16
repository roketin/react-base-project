import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/modules/app/libs/utils';

type TTooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TTooltipAlign = 'start' | 'center' | 'end';

type TRTooltipProps = {
  children: ReactNode;
  content: ReactNode;
  side?: TTooltipSide;
  align?: TTooltipAlign;
  sideOffset?: number;
  alignOffset?: number;
  delayDuration?: number;
  disabled?: boolean;
  withArrow?: boolean;
  className?: string;
  contentClassName?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  avoidCollisions?: boolean;
  /** Custom container for portal, defaults to document.body */
  container?: HTMLElement | null;
};

// Get the appropriate container for portal
function getPortalContainer(
  customContainer?: HTMLElement | null,
): HTMLElement | null {
  if (customContainer) return customContainer;
  if (typeof document === 'undefined') return null;

  // Try to find storybook docs container first
  const storybookRoot = document.getElementById('storybook-root');
  if (storybookRoot) return storybookRoot;

  return document.body;
}

function RTooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  alignOffset = 0,
  delayDuration = 0,
  disabled = false,
  withArrow = true,
  className,
  contentClassName,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  avoidCollisions = true,
  container: customContainer,
}: TRTooltipProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [actualSide, setActualSide] = useState(side);
  const [arrowOffset, setArrowOffset] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  const triggerRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Set portal container on mount
  useEffect(() => {
    setPortalContainer(getPortalContainer(customContainer));
  }, [customContainer]);

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
    if (delayDuration > 0) {
      openTimeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
    } else {
      setOpen(true);
    }
  }, [disabled, delayDuration, setOpen, clearTimeouts]);

  const handleClose = useCallback(() => {
    clearTimeouts();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 50);
  }, [setOpen, clearTimeouts]);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  // Handle open/close
  useEffect(() => {
    if (isOpen && !disabled) {
      setShouldRender(true);
      setPosition(null);
      setArrowOffset(null);
    } else {
      setVisible(false);
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setPosition(null);
        setArrowOffset(null);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, disabled]);

  // Calculate position after render
  useEffect(() => {
    if (!shouldRender || !triggerRef.current || !contentRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const content = contentRef.current?.getBoundingClientRect();
      if (!trigger || !content) return;

      const viewport = { width: window.innerWidth, height: window.innerHeight };
      let finalSide = side;

      const calcPos = (s: TTooltipSide) => {
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

      if (avoidCollisions) {
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

        const constrainedLeft = Math.max(
          pad,
          Math.min(left, viewport.width - content.width - pad),
        );
        const constrainedTop = Math.max(
          pad,
          Math.min(top, viewport.height - content.height - pad),
        );

        // Calculate arrow offset to point at trigger center
        if (finalSide === 'top' || finalSide === 'bottom') {
          const tooltipCenterX = constrainedLeft + content.width / 2;
          const triggerCenterX = trigger.left + trigger.width / 2;
          const offset = triggerCenterX - tooltipCenterX;

          // Only apply offset if there's meaningful difference (> 2px)
          if (Math.abs(offset) > 2) {
            const maxOffset = content.width / 2 - 12;
            setArrowOffset(Math.max(-maxOffset, Math.min(offset, maxOffset)));
          } else {
            setArrowOffset(null);
          }
        } else {
          const tooltipCenterY = constrainedTop + content.height / 2;
          const triggerCenterY = trigger.top + trigger.height / 2;
          const offset = triggerCenterY - tooltipCenterY;

          if (Math.abs(offset) > 2) {
            const maxOffset = content.height / 2 - 12;
            setArrowOffset(Math.max(-maxOffset, Math.min(offset, maxOffset)));
          } else {
            setArrowOffset(null);
          }
        }

        left = constrainedLeft;
        top = constrainedTop;
      } else {
        setArrowOffset(null);
      }

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
  }, [shouldRender, side, align, sideOffset, alignOffset, avoidCollisions]);

  if (!children) return null;

  // Generate arrow styles with offset
  const getArrowStyle = (): React.CSSProperties => {
    const isHorizontalSide = actualSide === 'top' || actualSide === 'bottom';

    if (arrowOffset !== null) {
      if (isHorizontalSide) {
        return {
          left: `calc(50% + ${arrowOffset}px)`,
          ...(actualSide === 'top'
            ? {
                bottom: 0,
                transform: 'translateX(-50%) translateY(50%) rotate(45deg)',
              }
            : {
                top: 0,
                transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
              }),
        };
      } else {
        return {
          top: `calc(50% + ${arrowOffset}px)`,
          ...(actualSide === 'left'
            ? {
                right: 0,
                transform: 'translateY(-50%) translateX(50%) rotate(45deg)',
              }
            : {
                left: 0,
                transform: 'translateY(-50%) translateX(-50%) rotate(45deg)',
              }),
        };
      }
    }

    return {};
  };

  const arrowBaseClasses: Record<TTooltipSide, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  };

  const tooltipContent = shouldRender && (
    <div
      ref={contentRef}
      role='tooltip'
      className={cn(
        'fixed z-9999 px-3 py-1.5 text-xs rounded-md shadow-md',
        'bg-foreground text-background',
        'pointer-events-none select-none max-w-xs',
        'transition-opacity duration-150 ease-out',
        visible && position ? 'opacity-100' : 'opacity-0',
        contentClassName,
      )}
      style={
        position
          ? { top: position.top, left: position.left }
          : { top: -9999, left: -9999 }
      }
    >
      {content}
      {withArrow && (
        <div
          className={cn(
            'absolute w-2 h-2 bg-foreground',
            arrowOffset === null && arrowBaseClasses[actualSide],
          )}
          style={arrowOffset !== null ? getArrowStyle() : undefined}
        />
      )}
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        className={cn('inline-flex', className)}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
      >
        {children}
      </span>

      {portalContainer && tooltipContent
        ? createPortal(tooltipContent, portalContainer)
        : tooltipContent}
    </>
  );
}

export type { TRTooltipProps };
export { RTooltip };
