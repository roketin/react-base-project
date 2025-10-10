import React, {
  memo,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type OffsetTarget =
  | string
  | HTMLElement
  | null
  | undefined
  | (() => HTMLElement | null | undefined);

type StickyChild = ReactNode | ((isSticky: boolean) => ReactNode);

type TRRStickyWrapperProps = {
  /** Content to render inside the sticky wrapper. */
  children: StickyChild;

  /** Scroll container element — can be an HTMLElement, the Window object, or a string ID (e.g. "#container").
   * If not provided, the sticky wrapper observes the global window scroll. */
  scrollContainer?: HTMLElement | Window | string | null;

  /** Sticky alignment position: "top" or "bottom".
   * Determines which side the element sticks to when scrolling. */
  position?: 'top' | 'bottom';

  /** Offset (in pixels) from the sticky edge defined by `position`.
   * For example, `offset = 16` means the element will stick 16px below the top. */
  offset?: number;

  /** Whether the sticky element should stop at the bottom edge of its parent container
   * instead of overlapping beyond it. */
  boundaryStop?: boolean;

  /** Automatically adds a drop shadow when the element becomes sticky to provide a visual cue. */
  shadowOnSticky?: boolean;

  /** Callback function triggered whenever the sticky status changes.
   * The parameter `isSticky` is `true` when the element is fixed to the viewport. */
  onStickyChange?: (isSticky: boolean) => void;

  /** Element(s) whose current height should be added to the offset (e.g., fixed headers).
   * Accepts a CSS selector, HTMLElement, function returning HTMLElement, or an array of those values. */
  offsetElements?: OffsetTarget | OffsetTarget[];

  /** Additional class names to apply to the inner sticky element. */
  className?: string;

  /** Additional inline styles for the sticky element. */
  style?: CSSProperties;
};

/**
 * 🧱 RStickyWrapper
 * Meniru perilaku `position: sticky` secara penuh, bahkan di dalam div overflow-scroll.
 * - Bisa pakai container id, ref, atau window
 * - Tidak flicker
 * - Deteksi boundary dan trigger callback
 */
type Mode = 'normal' | 'fixed' | 'end';

const RStickyWrapper: React.FC<TRRStickyWrapperProps> = memo(
  ({
    children,
    scrollContainer,
    position = 'top',
    offset = 0,
    boundaryStop = true,
    shadowOnSticky = false,
    onStickyChange,
    offsetElements,
    className,
    style,
  }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLElement | Window | null>(null);
    const rafRef = useRef<number | undefined>(undefined);
    const offsetElementsRef = useRef<HTMLElement[]>([]);

    const [mode, setMode] = useState<Mode>('normal');
    const [coords, setCoords] = useState<{ left: number; width: number }>({
      left: 0,
      width: 0,
    });
    const [endOffset, setEndOffset] = useState(0);
    const [computedOffset, setComputedOffset] = useState(offset);

    // ✅ Resolve scroll container (HTMLElement | id | Window)
    useLayoutEffect(() => {
      if (typeof scrollContainer === 'string') {
        const id = scrollContainer.startsWith('#')
          ? scrollContainer.slice(1)
          : scrollContainer;
        containerRef.current = document.getElementById(id);
      } else {
        containerRef.current = scrollContainer ?? window;
      }
    }, [scrollContainer]);

    /**
     * Clears any pending `requestAnimationFrame` callback to prevent redundant position updates.
     * Ensures that only the latest scheduled frame will trigger an update.
     */
    const clearRaf = useCallback(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    }, []);

    const resolveOffsetElements = useCallback((): HTMLElement[] => {
      const targets = Array.isArray(offsetElements)
        ? offsetElements
        : offsetElements != null
          ? [offsetElements]
          : [];

      if (typeof document === 'undefined') return [];

      const elements: HTMLElement[] = [];
      for (const target of targets) {
        if (!target) continue;
        if (typeof target === 'function') {
          const el = target();
          if (el instanceof HTMLElement) {
            elements.push(el);
          }
          continue;
        }
        if (typeof target === 'string') {
          const selector = target.startsWith('#') ? target : target;
          const el = document.querySelector<HTMLElement>(selector);
          if (el) {
            elements.push(el);
          }
          continue;
        }
        if (target instanceof HTMLElement) {
          elements.push(target);
        }
      }
      return elements;
    }, [offsetElements]);

    /**
     * Calculates and updates the sticky element’s current position and mode.
     * Handles 3 states:
     * - `normal`: default flow
     * - `fixed`: element is stuck to the viewport
     * - `end`: element has reached the parent’s bottom boundary (if `boundaryStop` enabled)
     *
     * The function:
     * 1. Measures element and container geometry.
     * 2. Determines scroll position and computes `nextMode`.
     * 3. Updates coordinates for fixed mode alignment.
     * 4. Computes `endOffset` for boundary stop.
     * 5. Sets wrapper height to avoid layout jump.
     */
    const updatePosition = useCallback(() => {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      const container = containerRef.current ?? window;
      if (!wrapper || !inner || !container) return;

      const parent = wrapper.parentElement;
      if (!parent) return;

      const isWindow = container instanceof Window;
      // Get container's bounding rectangle or use viewport dimensions if window
      const containerRect = isWindow
        ? {
            top: 0,
            bottom: window.innerHeight,
            height: window.innerHeight,
            left: 0,
          }
        : (container as HTMLElement).getBoundingClientRect();

      const wrapperRect = wrapper.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();

      // Calculate visible top and bottom of the wrapper relative to container
      const visibleTop = wrapperRect.top - containerRect.top;
      const visibleBottom = visibleTop + innerRect.height;
      const containerHeight = containerRect.bottom - containerRect.top;

      // Determine horizontal scroll offset for proper left positioning
      const scrollLeft = isWindow
        ? (window.scrollX ?? 0)
        : (container as HTMLElement).scrollLeft;

      const extraOffset = offsetElementsRef.current.reduce((total, element) => {
        const rect = element.getBoundingClientRect();
        return total + rect.height;
      }, 0);
      const dynamicOffset = offset + extraOffset;
      setComputedOffset((prev) =>
        Math.abs(prev - dynamicOffset) > 0.5 ? dynamicOffset : prev,
      );

      let nextMode: Mode = 'normal';

      if (position === 'top') {
        // If scrolled past the offset, fix element to top
        if (visibleTop <= dynamicOffset) {
          nextMode = 'fixed';
          // Check if bottom of parent reached to stop sticky element
          const parentBottomWithin =
            parentRect.bottom - containerRect.top - innerRect.height;
          if (boundaryStop && parentBottomWithin <= dynamicOffset) {
            nextMode = 'end';
          }
        }
      } else if (position === 'bottom') {
        // For bottom sticky, fix element when scrolled near bottom offset
        if (containerHeight - visibleBottom <= dynamicOffset) {
          nextMode = 'fixed';
        }
      }

      // Update mode state only if changed to avoid re-renders
      setMode((prev) => (prev !== nextMode ? nextMode : prev));

      // Calculate left position and width for fixed positioning
      const left =
        wrapperRect.left + scrollLeft - (isWindow ? 0 : containerRect.left);
      const width = wrapperRect.width;
      setCoords((prev) =>
        Math.abs(prev.left - left) > 0.5 || Math.abs(prev.width - width) > 0.5
          ? { left, width }
          : prev,
      );

      if (nextMode === 'end') {
        // Calculate absolute offset to position sticky element at parent's bottom boundary
        const parentHeight = parent.offsetHeight;
        const wrapperOffsetTop = wrapper.offsetTop;
        const absoluteTop = Math.max(
          parentHeight - innerRect.height - dynamicOffset - wrapperOffsetTop,
          0,
        );
        setEndOffset(absoluteTop);
      } else {
        setEndOffset(0);
      }

      // Set minimum height on wrapper to prevent layout jump when element becomes fixed
      wrapper.style.minHeight = `${innerRect.height}px`;
    }, [boundaryStop, offset, position]);

    /**
     * Schedules a position recalculation using `requestAnimationFrame`
     * to avoid excessive synchronous layout reads during scroll events.
     * This keeps scroll performance smooth and non-blocking.
     */
    const scheduleUpdate = useCallback(() => {
      clearRaf();
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        updatePosition();
      });
    }, [clearRaf, updatePosition]);

    /**
     * Cleanup effect that cancels any pending animation frames when the component unmounts.
     * Prevents possible memory leaks or race conditions.
     */
    useLayoutEffect(() => () => clearRaf(), [clearRaf]);

    /**
     * Attaches scroll and resize event listeners to the target container or window.
     * These events trigger position recalculations in a throttled (RAF-based) manner.
     * Automatically cleans up listeners on unmount.
     */
    useLayoutEffect(() => {
      const container = containerRef.current ?? window;
      const handleScroll = () => scheduleUpdate();
      const handleResize = () => scheduleUpdate();

      scheduleUpdate();

      if (container instanceof Window) {
        container.addEventListener('scroll', handleScroll, { passive: true });
        container.addEventListener('resize', handleResize);
      } else {
        container.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
      }

      return () => {
        if (container instanceof Window) {
          container.removeEventListener('scroll', handleScroll);
          container.removeEventListener('resize', handleResize);
        } else {
          container.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        }
      };
    }, [scheduleUpdate]);

    /**
     * Observes changes in the scroll container size (when it’s an HTMLElement, not window).
     * Recalculates sticky position whenever the container resizes.
     */
    useLayoutEffect(() => {
      const container = containerRef.current;
      if (
        !container ||
        container instanceof Window ||
        typeof ResizeObserver === 'undefined'
      ) {
        return;
      }

      const observer = new ResizeObserver(() => scheduleUpdate());
      observer.observe(container);

      return () => observer.disconnect();
    }, [scheduleUpdate]);

    /**
     * Observes both wrapper and inner element dimensions using ResizeObserver.
     * Recalculates position when the height or width of these elements changes.
     */
    useLayoutEffect(() => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) return;

      const observer = new ResizeObserver(() => scheduleUpdate());
      observer.observe(wrapper);
      observer.observe(inner);

      return () => observer.disconnect();
    }, [scheduleUpdate]);

    /**
     * Resolves offset elements and watches their size changes to keep the computed offset in sync.
     */
    useLayoutEffect(() => {
      const elements = resolveOffsetElements();
      offsetElementsRef.current = elements;
      scheduleUpdate();

      if (typeof ResizeObserver === 'undefined' || elements.length === 0) {
        return;
      }

      const observer = new ResizeObserver(() => scheduleUpdate());
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, [resolveOffsetElements, scheduleUpdate]);

    /**
     * Invokes the `onStickyChange` callback whenever sticky mode changes.
     * Allows parent components to respond to sticky activation/deactivation events.
     */
    useEffect(() => {
      onStickyChange?.(mode === 'fixed');
    }, [mode, onStickyChange]);

    useEffect(() => {
      setComputedOffset(offset);
      scheduleUpdate();
    }, [offset, scheduleUpdate]);

    // ✅ Style berdasarkan mode
    const innerStyle: CSSProperties = {
      ...style,
      width: mode === 'fixed' && coords.width ? coords.width : undefined,
      left: mode === 'fixed' ? coords.left : undefined,
    };

    if (mode === 'fixed') {
      Object.assign(innerStyle, {
        position: 'fixed',
        top: position === 'top' ? computedOffset : undefined,
        bottom: position === 'bottom' ? computedOffset : undefined,
        zIndex: 50,
      });
    } else if (mode === 'end') {
      Object.assign(innerStyle, {
        position: 'absolute',
        top: endOffset,
        left: 0,
        right: 0,
      });
    } else {
      Object.assign(innerStyle, {
        position: 'relative',
        top: undefined,
        left: undefined,
      });
    }

    // ✅ Tambah shadow otomatis saat sticky aktif
    const shadowClass =
      shadowOnSticky && mode === 'fixed'
        ? 'shadow-md transition-shadow'
        : 'transition-shadow';

    const renderChildren =
      typeof children === 'function'
        ? (children as (isSticky: boolean) => ReactNode)(mode === 'fixed')
        : children;

    return (
      <div ref={wrapperRef} className='relative w-full'>
        <div
          ref={innerRef}
          className={`${className ?? ''} ${shadowClass}`}
          style={innerStyle}
        >
          {renderChildren}
        </div>
      </div>
    );
  },
);
RStickyWrapper.displayName = 'RStickyWrapper';
export default RStickyWrapper;
