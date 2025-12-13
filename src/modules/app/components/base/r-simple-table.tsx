import { cn } from '@/modules/app/libs/utils';
import {
  forwardRef,
  useRef,
  useEffect,
  type ComponentPropsWithoutRef,
} from 'react';

// Base Table Component
export type TRTableProps = ComponentPropsWithoutRef<'table'> & {
  fixed?: boolean;
  bordered?: boolean;
};

export const RTable = forwardRef<HTMLTableElement, TRTableProps>(
  ({ className, fixed = false, bordered = false, ...props }, ref) => {
    return (
      <div className='w-full min-w-0 overflow-x-auto rounded-md border border-b-0 p-px'>
        <table
          ref={ref}
          className={cn(
            'w-full border-collapse',
            fixed && 'table-fixed',
            bordered && '[&_td]:border [&_th]:border',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
RTable.displayName = 'RTable';

// Table Head Component
export type TRTheadProps = ComponentPropsWithoutRef<'thead'>;

export const RThead = forwardRef<HTMLTableSectionElement, TRTheadProps>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn(className)} {...props} />;
  },
);
RThead.displayName = 'RThead';

// Table Body Component
export type TRTbodyProps = ComponentPropsWithoutRef<'tbody'>;

export const RTbody = forwardRef<HTMLTableSectionElement, TRTbodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn(className)} {...props} />;
  },
);
RTbody.displayName = 'RTbody';

// Table Footer Component
export type TRTfootProps = ComponentPropsWithoutRef<'tfoot'>;

export const RTfoot = forwardRef<HTMLTableSectionElement, TRTfootProps>(
  ({ className, ...props }, ref) => {
    return <tfoot ref={ref} className={cn(className)} {...props} />;
  },
);
RTfoot.displayName = 'RTfoot';

// Table Row Component
export type TRTrProps = ComponentPropsWithoutRef<'tr'> & {
  striped?: boolean;
  hoverable?: boolean;
};

export const RTr = forwardRef<HTMLTableRowElement, TRTrProps>(
  ({ className, striped = false, hoverable = true, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          striped && 'even:bg-muted/50',
          hoverable && 'transition-colors hover:bg-muted/50',
          className,
        )}
        {...props}
      />
    );
  },
);
RTr.displayName = 'RTr';

// Table Header Cell Component
export type TRThProps = ComponentPropsWithoutRef<'th'> & {
  sticky?: 'left' | 'right' | 'none';
  stickyOffset?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  onResize?: (width: number) => void;
  onResizeEnd?: (width: number) => void;
};

export const RTh = forwardRef<HTMLTableCellElement, TRThProps>(
  (
    {
      className,
      sticky = 'none',
      stickyOffset = 0,
      align = 'left',
      resizable = false,
      onResize,
      onResizeEnd,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    return (
      <th
        ref={ref}
        style={{
          ...style,
          position: sticky !== 'none' ? 'sticky' : undefined,
          left: sticky === 'left' ? stickyOffset : undefined,
          right: sticky === 'right' ? stickyOffset : undefined,
          zIndex: sticky !== 'none' ? 10 : undefined,
        }}
        className={cn(
          'border-b bg-muted px-4 py-3 font-medium text-muted-foreground transition-colors',
          'text-(length:--table-header-font-size)',
          resizable && 'relative',
          alignClass,
          className,
        )}
        {...props}
      >
        {children}
        {resizable && (
          <RColumnResizer onResize={onResize} onResizeEnd={onResizeEnd} />
        )}
      </th>
    );
  },
);
RTh.displayName = 'RTh';

// Column Resizer Component
type TRColumnResizerProps = {
  onResize?: (delta: number) => void;
  onResizeEnd?: (delta: number) => void;
};

function RColumnResizer({ onResize, onResizeEnd }: TRColumnResizerProps) {
  const startX = useRef(0);
  const isDragging = useRef(false);
  const rafId = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    isDragging.current = true;
    startX.current = e.clientX;

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const delta = e.clientX - startX.current;
        onResize?.(delta);
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;

      isDragging.current = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);

      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      const delta = e.clientX - startX.current;
      onResizeEnd?.(delta);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [onResize, onResizeEnd]);

  return (
    <div
      className={cn(
        'absolute right-0 top-0 h-full w-1 cursor-col-resize',
        'hover:bg-primary/30 active:bg-primary/50',
        'transition-colors duration-100',
      )}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

// Table Data Cell Component
export type TRTdProps = ComponentPropsWithoutRef<'td'> & {
  sticky?: 'left' | 'right' | 'none';
  stickyOffset?: number;
  align?: 'left' | 'center' | 'right';
};

export const RTd = forwardRef<HTMLTableCellElement, TRTdProps>(
  (
    {
      className,
      sticky = 'none',
      stickyOffset = 0,
      align = 'left',
      style,
      ...props
    },
    ref,
  ) => {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    return (
      <td
        ref={ref}
        style={{
          ...style,
          position: sticky !== 'none' ? 'sticky' : undefined,
          left: sticky === 'left' ? stickyOffset : undefined,
          right: sticky === 'right' ? stickyOffset : undefined,
          zIndex: sticky !== 'none' ? 5 : undefined,
        }}
        className={cn(
          'border-b bg-background px-4 py-3',
          'text-(length:--table-font-size)',
          alignClass,
          className,
        )}
        {...props}
      />
    );
  },
);
RTd.displayName = 'RTd';
