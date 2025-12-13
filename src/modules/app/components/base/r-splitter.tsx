import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// Types
// ============================================================================

type TOrientation = 'horizontal' | 'vertical';

type TSplitterPanelProps = {
  children: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  className?: string;
  style?: CSSProperties;
};

type TSplitterProps = {
  children: ReactNode;
  orientation?: TOrientation;
  className?: string;
  gutterSize?: number;
  gutterClassName?: string;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  disabled?: boolean;
  /** Storage key for persisting sizes */
  storageKey?: string;
};

type TPanelData = {
  defaultSize: number;
  minSize: number;
  maxSize: number;
  collapsible: boolean;
  collapsedSize: number;
};

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MIN_SIZE = 10;
const DEFAULT_MAX_SIZE = 100;
const DEFAULT_GUTTER_SIZE = 4;
const COLLAPSE_THRESHOLD = 0.5;

// ============================================================================
// Utilities
// ============================================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getStoredSizes(key: string): number[] | null {
  try {
    const stored = localStorage.getItem(`splitter_${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

function storeSizes(key: string, sizes: number[]): void {
  try {
    localStorage.setItem(`splitter_${key}`, JSON.stringify(sizes));
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// RSplitterPanel Component
// ============================================================================

function RSplitterPanel({
  children,
  className,
  style,
}: TSplitterPanelProps): ReactElement {
  return (
    <div className={cn('overflow-auto', className)} style={style}>
      {children}
    </div>
  );
}

RSplitterPanel.displayName = 'RSplitterPanel';

// ============================================================================
// RSplitterGutter Component
// ============================================================================

type TGutterProps = {
  orientation: TOrientation;
  size: number;
  className?: string;
  disabled?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onDoubleClick: () => void;
};

function RSplitterGutter({
  orientation,
  size,
  className,
  disabled,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
}: TGutterProps): ReactElement {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role='separator'
      aria-orientation={orientation}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'relative flex items-center justify-center shrink-0',
        'bg-border hover:bg-primary/20 active:bg-primary/30',
        'transition-colors duration-150',
        isHorizontal ? 'cursor-col-resize' : 'cursor-row-resize',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      style={{
        [isHorizontal ? 'width' : 'height']: size,
      }}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onTouchStart}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      onKeyDown={(e) => {
        if (disabled) return;
        // Allow keyboard navigation
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDoubleClick();
        }
      }}
    >
      {/* Visual handle indicator */}
      <div
        className={cn(
          'rounded-full bg-muted-foreground/30',
          isHorizontal ? 'h-8 w-1' : 'h-1 w-8',
        )}
      />
    </div>
  );
}

// ============================================================================
// RSplitter Component
// ============================================================================

function RSplitter({
  children,
  orientation = 'horizontal',
  className,
  gutterSize = DEFAULT_GUTTER_SIZE,
  gutterClassName,
  onResize,
  onResizeEnd,
  disabled = false,
  storageKey,
}: TSplitterProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const activeGutterIndex = useRef<number | null>(null);
  const startPosition = useRef(0);
  const startSizes = useRef<number[]>([]);

  // Extract panel data from children
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<TSplitterPanelProps> =>
      isValidElement(child) && child.type === RSplitterPanel,
  );

  const panelCount = panels.length;

  // Parse panel configurations
  const panelData: TPanelData[] = panels.map((panel) => ({
    defaultSize: panel.props.defaultSize ?? 100 / panelCount,
    minSize: panel.props.minSize ?? DEFAULT_MIN_SIZE,
    maxSize: panel.props.maxSize ?? DEFAULT_MAX_SIZE,
    collapsible: panel.props.collapsible ?? false,
    collapsedSize: panel.props.collapsedSize ?? 0,
  }));

  // Initialize sizes
  const getInitialSizes = useCallback((): number[] => {
    // Try to restore from storage
    if (storageKey) {
      const stored = getStoredSizes(storageKey);
      if (stored && stored.length === panelCount) {
        return stored;
      }
    }

    // Use default sizes
    const defaults = panelData.map((p) => p.defaultSize);
    const total = defaults.reduce((sum, s) => sum + s, 0);

    // Normalize to 100%
    if (Math.abs(total - 100) > 0.01) {
      const factor = 100 / total;
      return defaults.map((s) => s * factor);
    }

    return defaults;
  }, [panelCount, panelData, storageKey]);

  const [sizes, setSizes] = useState<number[]>(getInitialSizes);
  const [collapsedPanels, setCollapsedPanels] = useState<Set<number>>(
    new Set(),
  );

  // Sync sizes when panel count changes
  useEffect(() => {
    if (sizes.length !== panelCount) {
      setSizes(getInitialSizes());
    }
  }, [panelCount, sizes.length, getInitialSizes]);

  const isHorizontal = orientation === 'horizontal';

  // Get container size
  const getContainerSize = useCallback((): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const totalGutterSize = gutterSize * (panelCount - 1);
    return (isHorizontal ? rect.width : rect.height) - totalGutterSize;
  }, [isHorizontal, gutterSize, panelCount]);

  // Calculate new sizes during drag
  const calculateNewSizes = useCallback(
    (delta: number, gutterIndex: number): number[] => {
      const containerSize = getContainerSize();
      if (containerSize === 0) return startSizes.current;

      const deltaPercent = (delta / containerSize) * 100;
      const newSizes = [...startSizes.current];

      const leftIndex = gutterIndex;
      const rightIndex = gutterIndex + 1;

      const leftPanel = panelData[leftIndex];
      const rightPanel = panelData[rightIndex];

      let newLeftSize = startSizes.current[leftIndex] + deltaPercent;
      let newRightSize = startSizes.current[rightIndex] - deltaPercent;

      // Handle collapsing
      if (
        leftPanel.collapsible &&
        newLeftSize < leftPanel.minSize * COLLAPSE_THRESHOLD
      ) {
        newLeftSize = leftPanel.collapsedSize;
        newRightSize =
          startSizes.current[leftIndex] +
          startSizes.current[rightIndex] -
          leftPanel.collapsedSize;
      } else if (
        rightPanel.collapsible &&
        newRightSize < rightPanel.minSize * COLLAPSE_THRESHOLD
      ) {
        newRightSize = rightPanel.collapsedSize;
        newLeftSize =
          startSizes.current[leftIndex] +
          startSizes.current[rightIndex] -
          rightPanel.collapsedSize;
      } else {
        // Apply constraints
        newLeftSize = clamp(newLeftSize, leftPanel.minSize, leftPanel.maxSize);
        newRightSize = clamp(
          newRightSize,
          rightPanel.minSize,
          rightPanel.maxSize,
        );

        // Ensure total remains constant
        const total =
          startSizes.current[leftIndex] + startSizes.current[rightIndex];
        if (newLeftSize + newRightSize !== total) {
          if (deltaPercent > 0) {
            newRightSize = total - newLeftSize;
          } else {
            newLeftSize = total - newRightSize;
          }
        }
      }

      newSizes[leftIndex] = newLeftSize;
      newSizes[rightIndex] = newRightSize;

      return newSizes;
    },
    [getContainerSize, panelData],
  );

  // Mouse/Touch handlers
  const handleDragStart = useCallback(
    (gutterIndex: number, clientPos: number) => {
      isDragging.current = true;
      activeGutterIndex.current = gutterIndex;
      startPosition.current = clientPos;
      startSizes.current = [...sizes];

      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [sizes, isHorizontal],
  );

  const handleDragMove = useCallback(
    (clientPos: number) => {
      if (!isDragging.current || activeGutterIndex.current === null) return;

      const delta = clientPos - startPosition.current;
      const newSizes = calculateNewSizes(delta, activeGutterIndex.current);

      setSizes(newSizes);
      onResize?.(newSizes);

      // Update collapsed state
      const newCollapsed = new Set<number>();
      newSizes.forEach((size, index) => {
        if (
          panelData[index].collapsible &&
          size <= panelData[index].collapsedSize
        ) {
          newCollapsed.add(index);
        }
      });
      setCollapsedPanels(newCollapsed);
    },
    [calculateNewSizes, onResize, panelData],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;

    isDragging.current = false;
    activeGutterIndex.current = null;

    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Persist sizes
    if (storageKey) {
      storeSizes(storageKey, sizes);
    }

    onResizeEnd?.(sizes);
  }, [sizes, storageKey, onResizeEnd]);

  // Toggle collapse on double-click
  const handleDoubleClick = useCallback(
    (gutterIndex: number) => {
      const leftIndex = gutterIndex;
      const rightIndex = gutterIndex + 1;
      const leftPanel = panelData[leftIndex];
      const rightPanel = panelData[rightIndex];

      const newSizes = [...sizes];
      const newCollapsed = new Set(collapsedPanels);

      // Try to collapse/expand left panel first, then right
      if (leftPanel.collapsible) {
        if (collapsedPanels.has(leftIndex)) {
          // Expand left
          const expandTo = leftPanel.defaultSize;
          const diff = expandTo - sizes[leftIndex];
          newSizes[leftIndex] = expandTo;
          newSizes[rightIndex] = Math.max(
            rightPanel.minSize,
            sizes[rightIndex] - diff,
          );
          newCollapsed.delete(leftIndex);
        } else {
          // Collapse left
          const diff = sizes[leftIndex] - leftPanel.collapsedSize;
          newSizes[leftIndex] = leftPanel.collapsedSize;
          newSizes[rightIndex] = Math.min(
            rightPanel.maxSize,
            sizes[rightIndex] + diff,
          );
          newCollapsed.add(leftIndex);
        }
      } else if (rightPanel.collapsible) {
        if (collapsedPanels.has(rightIndex)) {
          // Expand right
          const expandTo = rightPanel.defaultSize;
          const diff = expandTo - sizes[rightIndex];
          newSizes[rightIndex] = expandTo;
          newSizes[leftIndex] = Math.max(
            leftPanel.minSize,
            sizes[leftIndex] - diff,
          );
          newCollapsed.delete(rightIndex);
        } else {
          // Collapse right
          const diff = sizes[rightIndex] - rightPanel.collapsedSize;
          newSizes[rightIndex] = rightPanel.collapsedSize;
          newSizes[leftIndex] = Math.min(
            leftPanel.maxSize,
            sizes[leftIndex] + diff,
          );
          newCollapsed.add(rightIndex);
        }
      }

      setSizes(newSizes);
      setCollapsedPanels(newCollapsed);
      onResize?.(newSizes);
      onResizeEnd?.(newSizes);

      if (storageKey) {
        storeSizes(storageKey, newSizes);
      }
    },
    [sizes, collapsedPanels, panelData, onResize, onResizeEnd, storageKey],
  );

  // Global event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(isHorizontal ? e.clientX : e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragMove(
          isHorizontal ? e.touches[0].clientX : e.touches[0].clientY,
        );
      }
    };

    const handleTouchEnd = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleDragMove, handleDragEnd, isHorizontal]);

  // Render panels with gutters
  const renderContent = () => {
    const elements: ReactNode[] = [];

    panels.forEach((panel, index) => {
      // Add panel
      const panelStyle: CSSProperties = {
        ...panel.props.style,
        flexBasis: `${sizes[index]}%`,
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'auto',
      };

      elements.push(
        cloneElement(panel, {
          key: `panel-${index}`,
          style: panelStyle,
          className: cn(
            panel.props.className,
            collapsedPanels.has(index) && 'overflow-hidden',
          ),
        }),
      );

      // Add gutter (except after last panel)
      if (index < panels.length - 1) {
        elements.push(
          <RSplitterGutter
            key={`gutter-${index}`}
            orientation={orientation}
            size={gutterSize}
            className={gutterClassName}
            disabled={disabled}
            onMouseDown={(e) => {
              e.preventDefault();
              handleDragStart(index, isHorizontal ? e.clientX : e.clientY);
            }}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                handleDragStart(
                  index,
                  isHorizontal ? e.touches[0].clientX : e.touches[0].clientY,
                );
              }
            }}
            onDoubleClick={() => handleDoubleClick(index)}
          />,
        );
      }
    });

    return elements;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex h-full w-full',
        isHorizontal ? 'flex-row' : 'flex-col',
        className,
      )}
    >
      {renderContent()}
    </div>
  );
}

RSplitter.Panel = RSplitterPanel;

export { RSplitter, RSplitterPanel };
export type { TSplitterProps, TSplitterPanelProps };
export default RSplitter;
