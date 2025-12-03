import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/modules/app/libs/utils';
import { ChevronDown } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type TRCollapseProps = {
  children?: ReactNode;
  defaultActiveKeys?: string[];
  activeKeys?: string[];
  onChange?: (keys: string[]) => void;
  accordion?: boolean;
  className?: string;
  bordered?: boolean;
  ghost?: boolean;
};

export type TRCollapsePanelProps = {
  panelKey: string;
  header: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  showArrow?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  forceRender?: boolean;
};

// ============================================================================
// Context
// ============================================================================

type TCollapseContext = {
  activeKeys: string[];
  togglePanel: (key: string) => void;
  bordered: boolean;
  ghost: boolean;
};

const CollapseContext = createContext<TCollapseContext | null>(null);

const useCollapseContext = () => {
  const context = useContext(CollapseContext);
  if (!context) {
    throw new Error('RCollapsePanel must be used within RCollapse');
  }
  return context;
};

// ============================================================================
// RCollapse Component
// ============================================================================

export const RCollapse = forwardRef<HTMLDivElement, TRCollapseProps>(
  (
    {
      children,
      defaultActiveKeys = [],
      activeKeys: controlledActiveKeys,
      onChange,
      accordion = false,
      className,
      bordered = true,
      ghost = false,
    },
    ref,
  ) => {
    const [internalActiveKeys, setInternalActiveKeys] =
      useState<string[]>(defaultActiveKeys);

    const isControlled = controlledActiveKeys !== undefined;
    const activeKeys = isControlled ? controlledActiveKeys : internalActiveKeys;

    const togglePanel = useCallback(
      (key: string) => {
        let newKeys: string[];

        if (accordion) {
          newKeys = activeKeys.includes(key) ? [] : [key];
        } else {
          newKeys = activeKeys.includes(key)
            ? activeKeys.filter((k) => k !== key)
            : [...activeKeys, key];
        }

        if (!isControlled) {
          setInternalActiveKeys(newKeys);
        }
        onChange?.(newKeys);
      },
      [accordion, activeKeys, isControlled, onChange],
    );

    return (
      <CollapseContext.Provider
        value={{ activeKeys, togglePanel, bordered, ghost }}
      >
        <div
          ref={ref}
          className={cn(
            'divide-y divide-border',
            bordered && 'border border-border rounded-lg overflow-hidden',
            ghost && 'border-0 divide-y-0',
            className,
          )}
        >
          {children}
        </div>
      </CollapseContext.Provider>
    );
  },
);

RCollapse.displayName = 'RCollapse';

// ============================================================================
// RCollapsePanel Component
// ============================================================================

export const RCollapsePanel = forwardRef<HTMLDivElement, TRCollapsePanelProps>(
  (
    {
      panelKey,
      header,
      children,
      disabled = false,
      extra,
      showArrow = true,
      className,
      headerClassName,
      contentClassName,
      forceRender = false,
    },
    ref,
  ) => {
    const { activeKeys, togglePanel, bordered, ghost } = useCollapseContext();
    const isActive = activeKeys.includes(panelKey);
    const innerRef = useRef<HTMLDivElement>(null);
    const [hasRendered, setHasRendered] = useState(forceRender || isActive);
    const headerId = useId();
    const contentId = useId();

    // Ensure content is rendered when active
    useEffect(() => {
      if (isActive && !hasRendered) {
        setHasRendered(true);
      }
    }, [isActive, hasRendered]);

    const handleClick = () => {
      if (!disabled) {
        togglePanel(panelKey);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel(panelKey);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-colors',
          ghost && 'border-b border-border last:border-b-0',
          className,
        )}
      >
        {/* Header */}
        <button
          type='button'
          id={headerId}
          aria-expanded={isActive}
          aria-controls={contentId}
          aria-disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
            !disabled && 'hover:bg-muted/50 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed',
            isActive && !ghost && 'bg-muted/30',
            bordered && !ghost && 'bg-background',
            headerClassName,
          )}
        >
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            {showArrow && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300',
                  isActive && 'rotate-180',
                )}
              />
            )}
            <span className='font-medium text-foreground truncate'>
              {header}
            </span>
          </div>
          {extra && (
            <div
              className='shrink-0'
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {extra}
            </div>
          )}
        </button>

        {/* Content */}
        <div
          id={contentId}
          role='region'
          aria-labelledby={headerId}
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className='overflow-hidden'>
            {(hasRendered || forceRender) && (
              <div
                ref={innerRef}
                className={cn(
                  'px-4 py-3 text-sm text-foreground',
                  showArrow && 'pl-11',
                  contentClassName,
                )}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

RCollapsePanel.displayName = 'RCollapsePanel';

export default RCollapse;
