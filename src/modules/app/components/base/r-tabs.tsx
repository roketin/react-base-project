import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/app/components/ui/tabs';
import { cn } from '@/modules/app/libs/utils';

const COMPONENT_MARKERS = {
  item: Symbol('RTabItem'),
  content: Symbol('RTabContent'),
} as const;

type InternalComponent = {
  rtabsType?: symbol;
};

export type TRTabItemProps = {
  tabKey: string;
  label: ReactNode;
  disabled?: boolean;
  forceRender?: boolean;
};

export type TRTabContentProps = PropsWithChildren<{
  tabKey: string;
}>;

type ExtractedContent = {
  tabKey: string;
  node: ReactNode;
};

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
  animation?: 'none' | 'fade' | 'slide';
  orientation?: 'horizontal' | 'vertical';
}>;

const animationClassMap = {
  none: 'data-[state=inactive]:hidden',
  fade: 'relative transition-opacity duration-200 ease-out data-[state=inactive]:absolute data-[state=inactive]:inset-0 data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none data-[state=active]:relative data-[state=active]:opacity-100',
  slide:
    'relative transition-all duration-200 ease-out data-[state=inactive]:absolute data-[state=inactive]:inset-0 data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2 data-[state=inactive]:pointer-events-none data-[state=active]:relative data-[state=active]:opacity-100 data-[state=active]:translate-y-0',
} as const satisfies Record<'none' | 'fade' | 'slide', string>;

const variantClassMap = {
  default: {
    list: '',
    trigger: '',
  },
  underline: {
    list: 'bg-transparent p-0 rounded-none border-b border-border/60 gap-6',
    trigger:
      'bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-2 h-auto text-muted-foreground data-[state=active]:text-foreground shadow-none data-[state=active]:shadow-none',
  },
} as const satisfies Record<
  'default' | 'underline',
  { list: string; trigger: string }
>;

type TRTabItemComponent = (props: TRTabItemProps) => null;
type TRTabContentComponent = (props: TRTabContentProps) => null;

const RTabItem: TRTabItemComponent = () => null;
const RTabContent: TRTabContentComponent = () => null;

(RTabItem as InternalComponent).rtabsType = COMPONENT_MARKERS.item;
(RTabItem as { displayName?: string }).displayName = 'RTabItem';
(RTabContent as InternalComponent).rtabsType = COMPONENT_MARKERS.content;
(RTabContent as { displayName?: string }).displayName = 'RTabContent';

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
    animation = 'none',
    orientation = 'horizontal',
    children,
  } = props;

  const { items, contentByKey, orderedKeys, forceRenderKeys } = useMemo(() => {
    const extractedItems: TRTabItemProps[] = [];
    const extractedContents: ExtractedContent[] = [];
    const extractedContentByKey = new Map<string, ExtractedContent>();

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      const componentType = (child.type as InternalComponent | undefined)
        ?.rtabsType;

      if (componentType === COMPONENT_MARKERS.item) {
        const { tabKey, label, disabled, forceRender } =
          child.props as TRTabItemProps;

        if (!tabKey) {
          return;
        }

        extractedItems.push({
          tabKey,
          label,
          disabled,
          forceRender: Boolean(forceRender),
        });
        return;
      }

      if (componentType === COMPONENT_MARKERS.content) {
        const { tabKey, children: contentChildren } =
          child.props as TRTabContentProps;

        if (!tabKey) {
          return;
        }

        const normalizedContent: ExtractedContent = {
          tabKey,
          node: contentChildren,
        };

        extractedContents.push(normalizedContent);
        extractedContentByKey.set(tabKey, normalizedContent);
      }
    });

    const itemKeys = extractedItems.map((item) => item.tabKey);
    const fallbackKeys = extractedContents
      .map((content) => content.tabKey)
      .filter((key) => !itemKeys.includes(key));

    const orderedKeys =
      itemKeys.length > 0
        ? itemKeys
        : fallbackKeys.length > 0
          ? fallbackKeys
          : [];

    const forceRenderKeys = extractedItems
      .filter((item) => item.forceRender)
      .map((item) => item.tabKey);

    return {
      items: extractedItems,
      contentByKey: extractedContentByKey,
      orderedKeys,
      forceRenderKeys,
    };
  }, [children]);

  const resolveKey = useCallback(
    (key?: string | null) => {
      if (!key) {
        return undefined;
      }

      return orderedKeys.includes(key) ? key : undefined;
    },
    [orderedKeys],
  );

  const firstKey = orderedKeys[0];
  const isControlled = activeKey !== undefined;

  const controlledKey = resolveKey(activeKey);
  const defaultKey = resolveKey(defaultActiveKey);

  const [internalValue, setInternalValue] = useState<string | undefined>(() => {
    return controlledKey ?? defaultKey ?? firstKey;
  });

  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlledKey ?? firstKey);
    }
  }, [controlledKey, firstKey, isControlled]);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue((prev) => {
        const resolvedPrev = resolveKey(prev);
        if (resolvedPrev) {
          return resolvedPrev;
        }

        return defaultKey ?? firstKey;
      });
    }
  }, [defaultKey, firstKey, isControlled, resolveKey]);

  const currentValue = isControlled
    ? (controlledKey ?? firstKey)
    : (resolveKey(internalValue) ?? defaultKey ?? firstKey);

  const prevActiveKeyRef = useRef<string | undefined>(
    currentValue ?? undefined,
  );
  const exitTimersRef = useRef<Record<string, number>>({});
  const [leavingKeys, setLeavingKeys] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      prevActiveKeyRef.current = currentValue ?? undefined;
      return;
    }

    if (animation === 'none') {
      Object.values(exitTimersRef.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      exitTimersRef.current = {};
      setLeavingKeys([]);
      prevActiveKeyRef.current = currentValue ?? undefined;
      return;
    }

    const prevKey = prevActiveKeyRef.current;
    if (
      prevKey &&
      prevKey !== currentValue &&
      !forceRenderKeys.includes(prevKey)
    ) {
      setLeavingKeys((prev) =>
        prev.includes(prevKey) ? prev : [...prev, prevKey],
      );

      if (exitTimersRef.current[prevKey]) {
        window.clearTimeout(exitTimersRef.current[prevKey]);
      }

      const exitDuration = animation === 'slide' ? 220 : 200;
      exitTimersRef.current[prevKey] = window.setTimeout(() => {
        setLeavingKeys((prev) => prev.filter((key) => key !== prevKey));
        delete exitTimersRef.current[prevKey];
      }, exitDuration);
    }

    prevActiveKeyRef.current = currentValue ?? undefined;
  }, [animation, currentValue, forceRenderKeys]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') {
        return;
      }
      Object.values(exitTimersRef.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  useEffect(() => {
    if (animation === 'none') {
      return;
    }
    setLeavingKeys((prev) =>
      prev.filter((key) => !forceRenderKeys.includes(key)),
    );
  }, [animation, forceRenderKeys]);

  useEffect(() => {
    setLeavingKeys((prev) => prev.filter((key) => orderedKeys.includes(key)));
  }, [orderedKeys]);

  const isVertical = orientation === 'vertical';
  const effectiveVariant =
    isVertical && variant === 'underline' ? 'default' : variant;
  const variantClasses = variantClassMap[effectiveVariant];
  const animationClassName = animationClassMap[animation];
  const rootClasses = cn(
    full && 'w-full',
    isVertical && 'lg:items-stretch',
    className,
  );
  const listClasses = cn(
    isVertical
      ? cn(
          'flex-col items-stretch gap-1 h-auto bg-muted/40 p-2',
          full ? 'w-full' : 'w-full max-w-xs',
        )
      : full && 'w-full',
    variantClasses.list,
    !isVertical && full && effectiveVariant === 'default' && 'justify-between',
    listClassName,
  );
  const triggerClasses = cn(
    variantClasses.trigger,
    isVertical &&
      'justify-start px-3 py-2 h-auto w-full text-left flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm',
    full && !isVertical && effectiveVariant === 'default' && 'flex-1',
    triggerClassName,
  );
  const contentClasses = cn(
    'pt-2',
    animation !== 'none' && 'min-h-[1px] overflow-hidden',
    isVertical && 'lg:flex-1 lg:pl-4 w-full',
    full && 'w-full',
    animationClassName,
    contentClassName,
  );

  const handleChange = (nextValue: string) => {
    if (!orderedKeys.includes(nextValue)) {
      return;
    }

    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <Tabs
      orientation={orientation}
      className={rootClasses}
      value={currentValue}
      onValueChange={handleChange}
    >
      {items.length > 0 ? (
        <TabsList className={listClasses}>
          {items.map(({ tabKey, label, disabled }) => (
            <TabsTrigger
              key={tabKey}
              value={tabKey}
              disabled={disabled}
              className={triggerClasses}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      ) : null}

      {orderedKeys.map((tabKey) => {
        const content = contentByKey.get(tabKey);

        if (!content) {
          return null;
        }

        const shouldRender =
          forceRenderKeys.includes(tabKey) ||
          tabKey === currentValue ||
          leavingKeys.includes(tabKey);

        if (!shouldRender) {
          return null;
        }

        const shouldForceMount =
          animation !== 'none' || forceRenderKeys.includes(tabKey);

        return (
          <TabsContent
            key={tabKey}
            value={tabKey}
            forceMount={shouldForceMount ? true : undefined}
            className={contentClasses}
          >
            {content.node}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export { RTabs, RTabItem, RTabContent };
export default RTabs;
