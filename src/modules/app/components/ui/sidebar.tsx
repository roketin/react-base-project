import { cn } from '@/modules/app/libs/utils';
import { useSidebar } from '@/modules/app/contexts/sidebar-context';
import { useViewport } from '@/modules/app/hooks/use-viewport';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/modules/app/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/app/components/ui/tooltip';
import { Slot } from '@radix-ui/react-slot';
import { type ReactNode } from 'react';

import roketinConfig from '@config';
import { PanelLeft } from 'lucide-react';

// Constants
const TRANSITION = 'transition-all duration-300 ease-in-out';

// ============================================================================
// SIDEBAR PROVIDER
// ============================================================================
import { useState, useCallback, useMemo } from 'react';
import { SidebarContext } from '@/modules/app/contexts/sidebar-context';

// ... (imports remain the same)

// ============================================================================
// SIDEBAR PROVIDER
// ============================================================================
export function SidebarProvider({
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

  // Internal state for desktop sidebar
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
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

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
      <TooltipProvider delayDuration={0}>
        <div className='flex h-screen w-full overflow-hidden'>{children}</div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// ============================================================================
// MAIN SIDEBAR COMPONENT
// ============================================================================
type SidebarProps = {
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right';
};

export function Sidebar({ children, className, side = 'left' }: SidebarProps) {
  const { isCollapsed, openMobile, setOpenMobile } = useSidebar();
  const { isMobile } = useViewport();

  // Mobile: Render as Sheet
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className='p-0 [&>button]:hidden max-w-none sm:max-w-none'
          style={
            {
              '--sidebar-width': roketinConfig.sidebar.settings.widthMobile,
              width: roketinConfig.sidebar.settings.widthMobile,
            } as React.CSSProperties
          }
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

  // Desktop: Fixed sidebar
  const currentWidth = isCollapsed
    ? roketinConfig.sidebar.settings.widthIcon
    : roketinConfig.sidebar.settings.width;

  return (
    <>
      {/* Spacer div to push content */}
      <div
        className={cn('shrink-0', TRANSITION)}
        style={{ width: currentWidth }}
      />

      {/* Fixed sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar overflow-hidden',
          TRANSITION,
          className,
        )}
        style={{ width: currentWidth }}
      >
        <div className='flex h-full flex-col'>{children}</div>
      </aside>
    </>
  );
}

// ============================================================================
// SIDEBAR SUB-COMPONENTS
// ============================================================================

export function SidebarHeader({
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

export function SidebarContent({
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

export function SidebarFooter({
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

export function SidebarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}

export function SidebarGroupContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}

// ============================================================================
// MENU COMPONENTS
// ============================================================================

export function SidebarMenu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <ul className={cn('space-y-1', className)}>{children}</ul>;
}

import { forwardRef } from 'react';

// ...

export const SidebarMenuItem = forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ children, className, ...props }, ref) => {
  return (
    <li ref={ref} className={cn('relative', className)} {...props}>
      {children}
    </li>
  );
});
SidebarMenuItem.displayName = 'SidebarMenuItem';

type SidebarMenuButtonProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  size?: 'default' | 'sm' | 'md' | 'lg' | 'sub';
  onClick?: (e?: React.MouseEvent) => void;
};

export function SidebarMenuButton({
  children,
  className,
  asChild = false,
  isActive = false,
  tooltip,
  size = 'default',
  onClick,
}: SidebarMenuButtonProps) {
  const { isCollapsed, isMobile, setOpenMobile } = useSidebar();
  const Comp = asChild ? Slot : 'button';

  const sizeClasses = {
    default: 'h-9 text-sm',
    sm: 'h-7 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-sm',
    sub: 'h-8 text-sm',
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
        'transition-all duration-200',
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

  // Show tooltip when collapsed
  if (tooltip && isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side='right' align='center'>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

// ============================================================================
// SUBMENU COMPONENTS
// ============================================================================

export function SidebarMenuSub({
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

export function SidebarMenuSubItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <li className={cn('relative', className)}>{children}</li>;
}

export function SidebarInset({
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

export function SidebarTrigger({
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
