import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { cn } from '@/modules/app/libs/utils';

export type TAnchorItem = {
  key: string;
  href: string;
  title: ReactNode;
  children?: TAnchorItem[];
};

export type TRAnchorProps = {
  items: TAnchorItem[];
  /** Offset from top when calculating active link (default: 0) */
  offsetTop?: number;
  /** Scroll container (default: window) */
  scrollContainer?: HTMLElement | Window | string | null;
  /** Callback when active link changes */
  onChange?: (currentActiveLink: string) => void;
  /** Custom class for wrapper */
  className?: string;
  /** Show ink indicator (default: true) */
  showInk?: boolean;
};

export function RAnchor({
  items,
  offsetTop = 0,
  scrollContainer,
  onChange,
  className,
  showInk = true,
}: TRAnchorProps) {
  const [activeLink, setActiveLink] = useState<string>('');
  const [inkTop, setInkTop] = useState<number>(0);
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const containerRef = useRef<HTMLElement | Window | null>(null);

  // Resolve scroll container
  useEffect(() => {
    if (typeof scrollContainer === 'string') {
      const id = scrollContainer.startsWith('#')
        ? scrollContainer.slice(1)
        : scrollContainer;
      containerRef.current = document.getElementById(id);
    } else {
      containerRef.current = scrollContainer ?? window;
    }
  }, [scrollContainer]);

  const updateInkPosition = useCallback((href: string) => {
    const linkElement = linksRef.current.get(href);
    if (!linkElement) return;
    const parentRect =
      linkElement.parentElement?.parentElement?.getBoundingClientRect();
    const linkRect = linkElement.getBoundingClientRect();
    if (parentRect) {
      setInkTop(linkRect.top - parentRect.top + linkRect.height / 2);
    }
  }, []);

  const handleScrollOrResize = useCallback(() => {
    const allItems = getAllItems(items);
    const container = containerRef.current ?? window;
    let currentActive = '';

    const containerTop =
      container instanceof Window
        ? 0
        : (container as HTMLElement).getBoundingClientRect().top;

    for (const item of allItems) {
      const target = document.querySelector(item.href);
      if (!target) continue;

      const rect = target.getBoundingClientRect();
      const relativeTop = rect.top - containerTop;

      if (relativeTop <= offsetTop + 50) {
        currentActive = item.href;
      }
    }

    if (currentActive) {
      setActiveLink((prev) => {
        if (prev === currentActive) return prev;
        onChange?.(currentActive);
        updateInkPosition(currentActive);
        return currentActive;
      });
    }
  }, [items, offsetTop, onChange, updateInkPosition]);

  // Calculate which section is in view and update on resize/scroll
  useEffect(() => {
    const container = containerRef.current ?? window;
    handleScrollOrResize(); // Initial check

    container.addEventListener('scroll', handleScrollOrResize, {
      passive: true,
    });
    window.addEventListener('resize', handleScrollOrResize);

    // Observe size changes of custom containers to keep ink aligned on resize
    let resizeObserver: ResizeObserver | null = null;
    if (
      typeof ResizeObserver !== 'undefined' &&
      container instanceof HTMLElement
    ) {
      resizeObserver = new ResizeObserver(() => handleScrollOrResize());
      resizeObserver.observe(container);
    }

    return () => {
      container.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      resizeObserver?.disconnect();
    };
  }, [handleScrollOrResize]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const container = containerRef.current;
    const targetElement = target as HTMLElement;

    if (container instanceof Window || !container) {
      window.scrollTo({
        top: targetElement.offsetTop - offsetTop,
        behavior: 'smooth',
      });
    } else {
      // For custom container, calculate position relative to container
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const scrollTop = container.scrollTop;

      container.scrollTo({
        top: scrollTop + targetRect.top - containerRect.top - offsetTop,
        behavior: 'smooth',
      });
    }

    setActiveLink(href);
    onChange?.(href);
  };

  const renderItem = (item: TAnchorItem, level: number = 0) => {
    const isActive = activeLink === item.href;

    return (
      <div key={item.key}>
        <a
          ref={(el) => {
            if (el) linksRef.current.set(item.href, el);
          }}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={cn(
            'block py-1 text-sm transition-colors duration-200',
            level === 0 ? 'pl-4' : 'pl-8',
            isActive
              ? 'text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {item.title}
        </a>
        {item.children && (
          <div>
            {item.children.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {/* Ink indicator */}
      {showInk && (
        <div
          className='absolute left-0 w-0.5 bg-primary transition-all duration-300'
          style={{
            top: `${inkTop}px`,
            height: '20px',
            transform: 'translateY(-50%)',
          }}
        />
      )}

      {/* Links */}
      <div className='space-y-0.5'>{items.map((item) => renderItem(item))}</div>
    </div>
  );
}

// Helper to flatten nested items
function getAllItems(items: TAnchorItem[]): TAnchorItem[] {
  const result: TAnchorItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children) {
      result.push(...getAllItems(item.children));
    }
  }
  return result;
}
