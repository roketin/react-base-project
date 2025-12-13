import { cn } from '@/modules/app/libs/utils';
import { useSidebar } from '@/modules/app/contexts/sidebar-context';
import { useViewport } from '@/modules/app/hooks/use-viewport';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/modules/app/components/base/r-sheet';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';
import {
  type ReactNode,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  isValidElement,
  cloneElement,
  Children,
} from 'react';
import { SidebarContext } from '@/modules/app/contexts/sidebar-context';
import { PanelLeft } from 'lucide-react';
import roketinConfig from '@config';

// ============================================================================
// CUSTOM SLOT COMPONENT (replaces @radix-ui/react-slot)
// ============================================================================

function Slot({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
  if (isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    return cloneElement(children, {
      ...props,
      ...childProps,
      className: cn(
        (props as { className?: string }).className,
        childProps.className as string | undefined,
      ),
    } as React.Attributes);
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'sidebar_width';

// Sidebar width constraints (in pixels)
const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_MAX_WIDTH = 400;
const SIDEBAR_DEFAULT_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const COLLAPSE_THRESHOLD = 140;

// ============================================================================
// UTILITIES
// ============================================================================

function getStoredWidth(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const width = parseInt(stored, 10);
      if (!isNaN(width) && width >= SIDEBAR_COLLAPSED_WIDTH) {
        return width;
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

function storeWidth(width: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // Ignore
  }
}

// ============================================================================
// RSIDEBAR PROVIDER
// ============================================================================

export function RSidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { isMobile } = useViewport();
  const [openMobile, setOpenMobile] = useState(false);

  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open],
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o);
  }, [isMobile, setOpen]);

  const state: 'expanded' | 'collapsed' = open ? 'expanded' : 'collapsed';

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className='flex h-screen w-full overflow-hidden'>{children}</div>
    </SidebarContext.Provider>
  );
}

// ============================================================================
// MAIN RSIDEBAR COMPONENT
// ============================================================================

type RSidebarProps = {
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right';
  resizable?: boolean;
};

export function RSidebar({
  children,
  className,
  side = 'left',
  resizable = true,
}: RSidebarProps) {
  const { isCollapsed, openMobile, setOpenMobile, setOpen } = useSidebar();
  const { isMobile } = useViewport();

  const sidebarRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const rafId = useRef<number>(0);

  // Initialize width from storage
  const [expandedWidth, setExpandedWidth] = useState(() => {
    const stored = getStoredWidth();
    return stored && stored > COLLAPSE_THRESHOLD
      ? stored
      : SIDEBAR_DEFAULT_WIDTH;
  });

  // Current display width
  const currentWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : expandedWidth;

  // Update DOM directly for smooth resize (no React re-render during drag)
  const updateWidth = useCallback((width: number) => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${width}px`;
    }
    if (spacerRef.current) {
      spacerRef.current.style.width = `${width}px`;
    }
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isCollapsed) return;

      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = expandedWidth;

      // Disable transitions during drag
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = 'none';
      }
      if (spacerRef.current) {
        spacerRef.current.style.transition = 'none';
      }

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [isCollapsed, expandedWidth],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      // Cancel previous frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Use RAF for smooth updates
      rafId.current = requestAnimationFrame(() => {
        const delta = e.clientX - startX.current;
        const newWidth = Math.min(
          Math.max(startWidth.current + delta, SIDEBAR_COLLAPSED_WIDTH),
          SIDEBAR_MAX_WIDTH,
        );
        updateWidth(newWidth);
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;

      isDragging.current = false;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Re-enable transitions
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = '';
      }
      if (spacerRef.current) {
        spacerRef.current.style.transition = '';
      }

      // Calculate final width
      const delta = e.clientX - startX.current;
      const finalWidth = startWidth.current + delta;

      // Check if should collapse
      if (finalWidth <= COLLAPSE_THRESHOLD) {
        setOpen(false);
        storeWidth(SIDEBAR_COLLAPSED_WIDTH);
        updateWidth(SIDEBAR_COLLAPSED_WIDTH);
      } else {
        const clampedWidth = Math.min(
          Math.max(finalWidth, SIDEBAR_MIN_WIDTH),
          SIDEBAR_MAX_WIDTH,
        );
        setExpandedWidth(clampedWidth);
        storeWidth(clampedWidth);
        updateWidth(clampedWidth);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updateWidth, setOpen]);

  // Sync width when collapsed state changes (from toggle button)
  useEffect(() => {
    if (isCollapsed) {
      updateWidth(SIDEBAR_COLLAPSED_WIDTH);
    } else {
      const stored = getStoredWidth();
      const width =
        stored && stored > COLLAPSE_THRESHOLD ? stored : SIDEBAR_DEFAULT_WIDTH;
      setExpandedWidth(width);
      updateWidth(width);
    }
  }, [isCollapsed, updateWidth]);

  // Mobile: Sheet
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className='p-0 [&>button]:hidden max-w-none sm:max-w-none'
          style={{ width: roketinConfig.sidebar.settings.widthMobile }}
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile navigation sidebar</SheetDescription>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Resizable sidebar
  return (
    <>
      {/* Spacer */}
      <div
        ref={spacerRef}
        className='shrink-0 transition-[width] duration-200 ease-out'
        style={{ width: currentWidth }}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        data-sidebar='root'
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar overflow-hidden',
          'transition-[width] duration-200 ease-out',
          className,
        )}
        style={{ width: currentWidth }}
      >
        <div className='flex h-full flex-col relative'>
          {children}

          {/* Resize handle */}
          {resizable && !isCollapsed && (
            <div
              className={cn(
                'absolute right-0 top-0 z-50 h-full w-1.5',
                'cursor-col-resize select-none',
                'hover:bg-primary/20 active:bg-primary/40',
                'transition-colors duration-100',
              )}
              onMouseDown={handleMouseDown}
            >
              {/* Visual indicator */}
              <div className='absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-0.5 rounded-full bg-border opacity-0 hover:opacity-100 transition-opacity' />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// RSIDEBAR SUB-COMPONENTS
// ============================================================================

export function RSidebarHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2 border-border p-4', className)}>
      {children}
    </div>
  );
}

export function RSidebarContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isCollapsed } = useSidebar();
  return (
    <div
      className={cn(
        isCollapsed ? 'p-2' : 'p-3',
        'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function RSidebarFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isCollapsed } = useSidebar();
  return (
    <div className={cn(isCollapsed ? 'p-2' : 'p-3', className)}>{children}</div>
  );
}

export function RSidebarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}

export function RSidebarGroupContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}

// ============================================================================
// RSIDEBAR MENU COMPONENTS
// ============================================================================

export function RSidebarMenu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <ul className={cn('space-y-1', className)}>{children}</ul>;
}

export const RSidebarMenuItem = forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ children, className, ...props }, ref) => (
  <li ref={ref} className={cn('relative', className)} {...props}>
    {children}
  </li>
));
RSidebarMenuItem.displayName = 'RSidebarMenuItem';

type RSidebarMenuButtonProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  size?: 'default' | 'sm' | 'md' | 'lg' | 'sub';
  onClick?: (e?: React.MouseEvent) => void;
};

export function RSidebarMenuButton({
  children,
  className,
  asChild = false,
  isActive = false,
  tooltip,
  size = 'default',
  onClick,
}: RSidebarMenuButtonProps) {
  const { isCollapsed, isMobile, setOpenMobile } = useSidebar();
  const Comp = asChild ? Slot : 'button';

  const sizeClasses = {
    default: 'h-9 text-[length:var(--sidebar-menu-font-size)]',
    sm: 'h-7 text-[length:var(--sidebar-menu-font-size-sm)]',
    md: 'h-10 text-[length:var(--sidebar-menu-font-size)]',
    lg: 'h-12 text-[length:var(--sidebar-menu-font-size)]',
    sub: 'h-8 text-[length:var(--sidebar-menu-font-size)]',
  };

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    if (isMobile && e.currentTarget instanceof HTMLAnchorElement) {
      setOpenMobile(false);
    }
  };

  const button = (
    <Comp
      onClick={handleClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left outline-none',
        'transition-colors duration-150',
        'hover:bg-primary/10 hover:text-primary',
        'focus-visible:ring-2 focus-visible:ring-primary',
        isActive && 'bg-primary/15 font-semibold text-primary',
        isCollapsed && 'justify-center px-2 [&>span:not(.sub-menu)]:hidden',
        sizeClasses[size],
        '[&>svg]:size-5 [&>svg]:shrink-0',
        className,
      )}
    >
      {children}
    </Comp>
  );

  if (tooltip && isCollapsed) {
    return (
      <RTooltip content={tooltip} side='right' align='center'>
        {button}
      </RTooltip>
    );
  }

  return button;
}

// ============================================================================
// RSIDEBAR SUBMENU COMPONENTS
// ============================================================================

export function RSidebarMenuSub({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isCollapsed } = useSidebar();
  if (isCollapsed) return null;
  return (
    <ul className={cn('ml-4 mt-1 space-y-1 pl-3', className)}>{children}</ul>
  );
}

export function RSidebarMenuSubItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <li className={cn('relative', className)}>{children}</li>;
}

export function RSidebarInset({
  className,
  ...props
}: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn('flex flex-1 flex-col overflow-hidden', className)}
      {...props}
    />
  );
}

export function RSidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar='trigger'
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft className='size-4' />
      <span className='sr-only'>Toggle Sidebar</span>
    </button>
  );
}
