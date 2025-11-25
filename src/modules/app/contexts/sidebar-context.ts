import { createContext, use, useState, useEffect } from 'react';

export type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return {
    ...context,
    isCollapsed: context.state === 'collapsed',
    isExpanded: context.state === 'expanded',
  };
}

/**
 * Hook to delay showing content when sidebar expands.
 * Useful for smooth transitions when revealing text/content.
 *
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns boolean - true when sidebar is expanded and delay has passed
 *
 * @example
 * const showContent = useDelayedExpanded(300);
 * <div className={showContent ? 'opacity-100' : 'opacity-0'}>...</div>
 */
export function useDelayedExpanded(delay: number = 200): boolean {
  const { isCollapsed } = useSidebar();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isCollapsed) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isCollapsed, delay]);

  return showContent;
}
