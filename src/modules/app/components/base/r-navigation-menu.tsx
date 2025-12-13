import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

// ============================================================================
// TYPES & CONTEXT
// ============================================================================

type TNavigationMenuContext = {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  indicatorPosition: { left: number; width: number } | null;
  setIndicatorPosition: (pos: { left: number; width: number } | null) => void;
  orientation: 'horizontal' | 'vertical';
};

const NavigationMenuContext = createContext<TNavigationMenuContext | null>(
  null,
);

function useNavigationMenu() {
  const context = useContext(NavigationMenuContext);
  if (!context)
    throw new Error(
      'NavigationMenu components must be used within NavigationMenu',
    );
  return context;
}

// Item context to share itemId between trigger and content
type TNavigationMenuItemContext = {
  itemId: string;
  setItemId: (id: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const NavigationMenuItemContext =
  createContext<TNavigationMenuItemContext | null>(null);

function useNavigationMenuItem() {
  const context = useContext(NavigationMenuItemContext);
  if (!context)
    throw new Error(
      'NavigationMenuTrigger/Content must be used within NavigationMenuItem',
    );
  return context;
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const contentVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

// ============================================================================
// NAVIGATION MENU ROOT
// ============================================================================

type TNavigationMenuProps = HTMLAttributes<HTMLElement> & {
  orientation?: 'horizontal' | 'vertical';
  delayDuration?: number;
};

const NavigationMenu = forwardRef<HTMLElement, TNavigationMenuProps>(
  ({ children, className, orientation = 'horizontal', ...props }, ref) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [indicatorPosition, setIndicatorPosition] = useState<{
      left: number;
      width: number;
    } | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleSetActiveItem = useCallback((id: string | null) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (id === null) {
        timeoutRef.current = setTimeout(() => {
          setActiveItem(null);
          setIndicatorPosition(null);
        }, 100);
      } else {
        setActiveItem(id);
      }
    }, []);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <NavigationMenuContext.Provider
        value={{
          activeItem,
          setActiveItem: handleSetActiveItem,
          indicatorPosition,
          setIndicatorPosition,
          orientation,
        }}
      >
        <nav
          ref={ref}
          data-orientation={orientation}
          className={cn('relative', className)}
          {...props}
        >
          {children}
        </nav>
      </NavigationMenuContext.Provider>
    );
  },
);

NavigationMenu.displayName = 'NavigationMenu';

// ============================================================================
// LIST
// ============================================================================

type TNavigationMenuListProps = HTMLAttributes<HTMLUListElement>;

const NavigationMenuList = forwardRef<
  HTMLUListElement,
  TNavigationMenuListProps
>(({ children, className, ...props }, ref) => {
  const { orientation, indicatorPosition } = useNavigationMenu();

  return (
    <ul
      ref={ref}
      className={cn(
        'group flex list-none items-center gap-1 rounded-lg bg-background p-1',
        orientation === 'vertical' && 'flex-col items-stretch',
        className,
      )}
      {...props}
    >
      {children}
      {/* Animated indicator */}
      {indicatorPosition && orientation === 'horizontal' && (
        <motion.div
          layoutId='nav-indicator'
          className='absolute bottom-0 h-0.5 bg-primary rounded-full'
          initial={false}
          animate={{
            left: indicatorPosition.left,
            width: indicatorPosition.width,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </ul>
  );
});

NavigationMenuList.displayName = 'NavigationMenuList';

// ============================================================================
// ITEM
// ============================================================================

type TNavigationMenuItemProps = HTMLAttributes<HTMLLIElement>;

const NavigationMenuItem = forwardRef<HTMLLIElement, TNavigationMenuItemProps>(
  ({ children, className, ...props }, ref) => {
    const [itemId, setItemId] = useState(
      () => `nav-item-${Math.random().toString(36).slice(2)}`,
    );
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    return (
      <NavigationMenuItemContext.Provider
        value={{ itemId, setItemId, triggerRef }}
      >
        <li ref={ref} className={cn('relative', className)} {...props}>
          {children}
        </li>
      </NavigationMenuItemContext.Provider>
    );
  },
);

NavigationMenuItem.displayName = 'NavigationMenuItem';

// ============================================================================
// TRIGGER
// ============================================================================

type TNavigationMenuTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
};

const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  TNavigationMenuTriggerProps
>(({ children, disabled, className, ...props }, ref) => {
  const { activeItem, setActiveItem, setIndicatorPosition } =
    useNavigationMenu();
  const { itemId, triggerRef } = useNavigationMenuItem();
  const isOpen = activeItem === itemId;

  const handleMouseEnter = () => {
    if (disabled) return;
    setActiveItem(itemId);

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const parentRect =
        triggerRef.current.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setIndicatorPosition({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      type='button'
      disabled={disabled}
      data-item-id={itemId}
      aria-expanded={isOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground focus:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        isOpen && 'bg-accent/50',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'relative h-3 w-3 transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
        aria-hidden='true'
      />
    </button>
  );
});

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

// ============================================================================
// CONTENT
// ============================================================================

type TNavigationMenuContentProps = HTMLAttributes<HTMLDivElement>;

const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  TNavigationMenuContentProps
>(({ children, className }, ref) => {
  const { activeItem, setActiveItem } = useNavigationMenu();
  const { itemId, triggerRef } = useNavigationMenuItem();
  const isOpen = activeItem === itemId;
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const gap = 8;

      // Initial position (below trigger, aligned left)
      let top = triggerRect.bottom + gap;
      let left = triggerRect.left;

      // Wait for content to render to get its dimensions
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const contentRect = contentRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Check right edge collision
          if (left + contentRect.width > viewportWidth - gap) {
            left = viewportWidth - contentRect.width - gap;
          }

          // Check left edge collision
          if (left < gap) {
            left = gap;
          }

          // Check bottom edge collision - flip to top if needed
          if (top + contentRect.height > viewportHeight - gap) {
            top = triggerRect.top - contentRect.height - gap;
          }

          // Check top edge collision (if flipped)
          if (top < gap) {
            top = gap;
          }

          setPosition({ top, left });
        }
      });

      // Set initial position immediately
      setPosition({ top, left });
    }
  }, [isOpen, triggerRef]);

  const handleMouseEnter = () => {
    setActiveItem(itemId);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={(node) => {
            (
              contentRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={contentVariants}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ top: position.top, left: position.left }}
          className={cn('fixed z-50 w-auto', className)}
        >
          <div className='overflow-hidden rounded-lg border bg-popover shadow-lg'>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

NavigationMenuContent.displayName = 'NavigationMenuContent';

// ============================================================================
// LINK
// ============================================================================

type TNavigationMenuLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  active?: boolean;
  asChild?: boolean;
};

const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  TNavigationMenuLinkProps
>(({ children, href, active, className, ...props }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        'block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        active && 'bg-accent/50',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
});

NavigationMenuLink.displayName = 'NavigationMenuLink';

// ============================================================================
// VIEWPORT (for mega menu style)
// ============================================================================

type TNavigationMenuViewportProps = HTMLAttributes<HTMLDivElement>;

const NavigationMenuViewport = forwardRef<
  HTMLDivElement,
  TNavigationMenuViewportProps
>(({ className }, ref) => {
  const { activeItem } = useNavigationMenu();

  return (
    <div className='absolute left-0 top-full flex justify-center perspective-[2000px]'>
      <AnimatePresence>
        {activeItem && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.96, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.96, rotateX: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative mt-2 h-auto w-full overflow-hidden rounded-lg border bg-popover shadow-lg',
              'origin-top',
              className,
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

NavigationMenuViewport.displayName = 'NavigationMenuViewport';

// ============================================================================
// INDICATOR
// ============================================================================

type TNavigationMenuIndicatorProps = HTMLAttributes<HTMLDivElement>;

const NavigationMenuIndicator = forwardRef<
  HTMLDivElement,
  TNavigationMenuIndicatorProps
>(({ className }, ref) => {
  const { indicatorPosition } = useNavigationMenu();

  if (!indicatorPosition) return null;

  return (
    <motion.div
      ref={ref}
      layoutId='navigation-indicator'
      className={cn(
        'absolute bottom-0 z-10 flex h-2.5 items-end justify-center overflow-hidden',
        className,
      )}
      initial={false}
      animate={{
        left: indicatorPosition.left,
        width: indicatorPosition.width,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
    >
      <div className='relative top-[60%] h-2.5 w-2.5 rotate-45 rounded-tl-sm bg-border shadow-md' />
    </motion.div>
  );
});

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

// ============================================================================
// LIST ITEM (for content)
// ============================================================================

type TListItemProps = HTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  title: string;
  icon?: ReactNode;
};

const ListItem = forwardRef<HTMLAnchorElement, TListItemProps>(
  ({ className, title, children, href, icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            href={href}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className='flex items-center gap-2'>
              {icon && <span className='text-muted-foreground'>{icon}</span>}
              <div className='text-sm font-medium leading-none'>{title}</div>
            </div>
            {children && (
              <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                {children}
              </p>
            )}
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  ListItem,
};
