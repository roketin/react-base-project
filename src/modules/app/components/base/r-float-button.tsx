import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/modules/app/libs/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const floatButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground',
        ghost:
          'bg-background/80 backdrop-blur-sm text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-10 w-10 [&_svg]:size-4',
        default: 'h-14 w-14 [&_svg]:size-5',
        lg: 'h-16 w-16 [&_svg]:size-6',
      },
      position: {
        none: '',
        'bottom-right': 'fixed z-50 bottom-6 right-6',
        'bottom-left': 'fixed z-50 bottom-6 left-6',
        'top-right': 'fixed z-50 top-6 right-6',
        'top-left': 'fixed z-50 top-6 left-6',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'bottom-right',
      animation: 'none',
    },
  },
);

export type TRFloatButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof floatButtonVariants> & {
    icon?: ReactNode;
    badge?: ReactNode;
    tooltip?: string;
  };

export const RFloatButton = forwardRef<HTMLButtonElement, TRFloatButtonProps>(
  (
    {
      className,
      variant,
      size,
      position,
      animation,
      icon,
      badge,
      tooltip,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className='relative'>
        <button
          ref={ref}
          className={cn(
            floatButtonVariants({ variant, size, position, animation }),
            className,
          )}
          title={tooltip}
          {...props}
        >
          {icon || children}
        </button>

        {badge && (
          <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground'>
            {badge}
          </span>
        )}
      </div>
    );
  },
);

RFloatButton.displayName = 'RFloatButton';

export type TRFloatButtonGroupProps = {
  children: ReactNode;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  direction?: 'vertical' | 'horizontal';
};

export const RFloatButtonGroup = forwardRef<
  HTMLDivElement,
  TRFloatButtonGroupProps
>(
  (
    { children, className, position = 'bottom-right', direction = 'vertical' },
    ref,
  ) => {
    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex gap-3',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          positionClasses[position],
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

RFloatButtonGroup.displayName = 'RFloatButtonGroup';

export type TRFloatButtonMenuProps = {
  mainButton: ReactNode;
  children: ReactNode;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  gap?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  closeOnItemClick?: boolean;
};

export const RFloatButtonMenu = forwardRef<
  HTMLDivElement,
  TRFloatButtonMenuProps
>(
  (
    {
      mainButton,
      children,
      className,
      position = 'bottom-right',
      gap = 12,
      open,
      defaultOpen = false,
      onOpenChange,
      closeOnClickOutside = true,
      closeOnEscape = true,
      closeOnItemClick = true,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const containerRef = useRef<HTMLDivElement>(null);

    // Controlled vs uncontrolled
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalOpen(value);
        }
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange],
    );

    const toggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

    // Click outside handler
    useEffect(() => {
      if (!closeOnClickOutside || !isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [closeOnClickOutside, isOpen, setOpen]);

    // Escape key handler
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, isOpen, setOpen]);

    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };

    const handleMenuItemClick = () => {
      if (closeOnItemClick) {
        setOpen(false);
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn('fixed z-50', positionClasses[position], className)}
      >
        <div ref={ref} className='flex flex-col items-center'>
          {/* Sub menu items - expand upward */}
          <div
            role='menu'
            aria-hidden={!isOpen}
            className={cn(
              'flex flex-col items-center transition-all duration-300 ease-out mb-3',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            style={{
              gap: isOpen ? `${gap}px` : '0px',
              maxHeight: isOpen ? '500px' : '0px',
            }}
            onClick={handleMenuItemClick}
          >
            {children}
          </div>

          {/* Main button */}
          <div
            role='button'
            aria-expanded={isOpen}
            aria-haspopup='menu'
            tabIndex={0}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
              }
            }}
            className={cn(
              'transition-transform duration-300 cursor-pointer',
              isOpen && 'rotate-45',
            )}
          >
            {mainButton}
          </div>
        </div>
      </div>
    );
  },
);

RFloatButtonMenu.displayName = 'RFloatButtonMenu';
