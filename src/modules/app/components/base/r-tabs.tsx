import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PANEL_MARKER = Symbol('RTabPanel');

type InternalComponent = {
  rTabsType?: symbol;
};

export type TRTabPanelProps = PropsWithChildren<{
  tabKey: string;
  header: ReactNode;
  disabled?: boolean;
  forceRender?: boolean;
}>;

export type TRTabsProps = PropsWithChildren<{
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  full?: boolean;
  variant?: 'default' | 'underline';
  orientation?: 'horizontal' | 'vertical';
}>;

type TRTabPanelComponent = (props: TRTabPanelProps) => null;

const RTabPanel: TRTabPanelComponent = () => null;

(RTabPanel as InternalComponent).rTabsType = PANEL_MARKER;
(RTabPanel as { displayName?: string }).displayName = 'RTabPanel';

function RTabs(props: TRTabsProps) {
  const {
    activeKey,
    defaultActiveKey,
    onChange,
    className,
    listClassName,
    triggerClassName,
    contentClassName,
    full = false,
    variant = 'default',
    orientation = 'horizontal',
    children,
  } = props;

  const { panels, orderedKeys, forceRenderKeys } = useMemo(() => {
    const extractedPanels: Array<{
      tabKey: string;
      header: ReactNode;
      content: ReactNode;
      disabled?: boolean;
    }> = [];
    const forceRenderSet = new Set<string>();

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      const componentType = (child.type as InternalComponent | undefined)
        ?.rTabsType;

      if (componentType === PANEL_MARKER) {
        const {
          tabKey,
          header,
          disabled,
          forceRender,
          children: content,
        } = child.props as TRTabPanelProps;
        if (tabKey) {
          extractedPanels.push({ tabKey, header, content, disabled });
          if (forceRender) forceRenderSet.add(tabKey);
        }
      }
    });

    return {
      panels: extractedPanels,
      orderedKeys: extractedPanels.map((p) => p.tabKey),
      forceRenderKeys: Array.from(forceRenderSet),
    };
  }, [children]);

  const isControlled = activeKey !== undefined;
  const firstKey = orderedKeys[0];
  const validActiveKey =
    activeKey && orderedKeys.includes(activeKey) ? activeKey : undefined;
  const validDefaultKey =
    defaultActiveKey && orderedKeys.includes(defaultActiveKey)
      ? defaultActiveKey
      : undefined;

  const [internalValue, setInternalValue] = useState<string>(
    validActiveKey ?? validDefaultKey ?? firstKey,
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    if (
      !isControlled &&
      internalValue &&
      !orderedKeys.includes(internalValue)
    ) {
      setInternalValue(validDefaultKey ?? firstKey);
    }
  }, [orderedKeys, internalValue, isControlled, validDefaultKey, firstKey]);

  const currentValue = isControlled
    ? (validActiveKey ?? firstKey)
    : orderedKeys.includes(internalValue)
      ? internalValue
      : firstKey;

  const isVertical = orientation === 'vertical';

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowPrev(scrollLeft > 5);
    setShowNext(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isVertical || full) return;

    checkScroll();
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);

    container.addEventListener('scroll', checkScroll);
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', checkScroll);
    };
  }, [isVertical, full, panels.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const buttons = container.querySelectorAll('button[data-tab]');
    if (buttons.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    let targetButton: Element | null = null;

    if (direction === 'left') {
      for (let i = buttons.length - 1; i >= 0; i--) {
        const button = buttons[i];
        const rect = button.getBoundingClientRect();
        if (rect.left < containerRect.left - 1) {
          targetButton = button;
          break;
        }
      }
    } else {
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const rect = button.getBoundingClientRect();
        if (rect.right > containerRect.right + 1) {
          targetButton = button;
          break;
        }
      }
    }

    if (targetButton) {
      targetButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const handleTabClick = (
    tabKey: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!orderedKeys.includes(tabKey)) return;
    if (!isControlled) setInternalValue(tabKey);
    onChange?.(tabKey);

    // Scroll clicked tab to center
    if (!isVertical && !full) {
      const button = event.currentTarget;
      button.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  return (
    <div
      className={cn(
        'flex gap-2',
        isVertical ? 'flex-col lg:flex-row lg:items-start' : 'flex-col',
        full && 'w-full',
        className,
      )}
    >
      {panels.length > 0 && (
        <div
          className={cn(
            !isVertical &&
              variant === 'underline' &&
              'w-full bg-white border-b border-gray-100',
            !isVertical && !full && 'relative',
          )}
        >
          {!isVertical && !full && showPrev && (
            <button
              type='button'
              onClick={() => scroll('left')}
              className='absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-r-md bg-background/95 p-1 shadow-md hover:bg-background'
              aria-label='Scroll left'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className={cn(
              !isVertical &&
                !full &&
                'overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden',
            )}
          >
            <div
              className={cn(
                'inline-flex items-center gap-1',
                isVertical
                  ? 'flex-col items-stretch h-auto bg-muted/40 p-2 rounded-lg'
                  : full
                    ? 'w-full bg-muted text-muted-foreground h-9 justify-center rounded-lg p-1'
                    : variant === 'underline'
                      ? 'p-0 gap-0 h-auto'
                      : 'bg-muted text-muted-foreground h-9 rounded-lg p-1',
                full && isVertical && 'w-full max-w-xs',
                listClassName,
              )}
            >
              {panels.map(({ tabKey, header, disabled }) => {
                const isActive = tabKey === currentValue;
                return (
                  <button
                    key={tabKey}
                    type='button'
                    data-tab={tabKey}
                    disabled={disabled}
                    onClick={(e) => handleTabClick(tabKey, e)}
                    className={cn(
                      'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
                      variant === 'underline'
                        ? cn(
                            'bg-white border-b-2 border-transparent rounded-none px-4 pb-3 pt-3 h-auto text-slate-600 hover:text-slate-900',
                            isActive &&
                              'bg-transparent border-b-primary text-slate-900',
                          )
                        : cn(
                            'rounded-md px-3 py-1.5',
                            isActive
                              ? 'bg-background text-foreground shadow-sm'
                              : 'hover:bg-background/50',
                          ),
                      isVertical &&
                        'justify-start w-full text-left h-auto px-3 py-2',
                      !isVertical && !full && 'shrink-0 snap-start',
                      full && !isVertical && 'flex-1',
                      triggerClassName,
                    )}
                  >
                    {header}
                  </button>
                );
              })}
            </div>
          </div>

          {!isVertical && !full && showNext && (
            <button
              type='button'
              onClick={() => scroll('right')}
              className='absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-l-md bg-background/95 p-1 shadow-md hover:bg-background'
              aria-label='Scroll right'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          )}
        </div>
      )}

      {panels.map(({ tabKey, content }) => {
        const isActive = tabKey === currentValue;
        const shouldRender = isActive || forceRenderKeys.includes(tabKey);

        if (!shouldRender) return null;

        return (
          <div
            key={tabKey}
            className={cn(
              'pt-2 outline-none',
              !isActive && 'hidden',
              isVertical && 'lg:flex-1 lg:pl-4 w-full',
              full && 'w-full',
              contentClassName,
            )}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

export { RTabs, RTabPanel };
export default RTabs;
