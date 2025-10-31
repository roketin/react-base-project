import { ChevronRight } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { Fragment, useMemo } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/modules/app/components/ui/dropdown-menu';

export type TRMenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  hotkey?: string;
  disabled?: boolean;
  danger?: boolean;
  onSelect?: (event: MouseEvent<HTMLDivElement>) => void;
  href?: string;
  items?: TRMenuItem[];
  dividerAbove?: boolean;
  hidden?: boolean;
};

export type TRMenuProps = {
  trigger: ReactNode;
  items: TRMenuItem[];
  className?: string;
  contentClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  label?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  dense?: boolean;
  onItemSelect?: (item: TRMenuItem, event: Event) => void;
};

const HOTKEY_DISPLAY: Record<string, string> = {
  cmd: '⌘',
  shift: '⇧',
  alt: '⌥',
  option: '⌥',
  ctrl: '⌃',
  control: '⌃',
  enter: '↩',
  del: '⌫',
  delete: '⌫',
  esc: '⎋',
};

function formatHotkey(hotkey?: string) {
  if (!hotkey) return null;
  return hotkey
    .split('+')
    .map(
      (segment) =>
        HOTKEY_DISPLAY[segment.toLowerCase()] ?? segment.toUpperCase(),
    )
    .join(' + ');
}

function hasSubItems(item: TRMenuItem) {
  return Array.isArray(item.items) && item.items.length > 0;
}

export function RMenu({
  trigger,
  items,
  className,
  contentClassName,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset = 0,
  label,
  description,
  footer,
  dense = false,
  onItemSelect,
}: TRMenuProps) {
  const contentClasses = useMemo(
    () =>
      cn(
        'min-w-[220px] overflow-hidden rounded-lg border border-border/60 bg-background shadow-xl focus:outline-none',
        'data-[side=top]:animate-slide-up data-[side=bottom]:animate-slide-down',
        contentClassName,
      ),
    [contentClassName],
  );

  const renderItems = (menuItems: TRMenuItem[]) => (
    <Fragment>
      {menuItems.map((item) => {
        if (item.hidden) {
          return null;
        }

        const hasChildren = hasSubItems(item);
        const key = item.id;
        const baseClasses = cn(
          'relative flex w-full cursor-default select-none items-center justify-between gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors',
          dense && 'px-2.5 py-1.5 text-sm',
          item.disabled && 'pointer-events-none opacity-40',
          item.danger && !item.disabled
            ? 'text-destructive focus:bg-destructive/10'
            : 'focus:bg-muted/40',
        );

        const handleItemSelect = (event: Event) => {
          if (item.disabled) return;
          item.onSelect?.(event as unknown as MouseEvent<HTMLDivElement>);
          onItemSelect?.(item, event);
        };

        const renderContent = (showChevron: boolean) => (
          <div className='flex w-full items-center justify-between gap-3'>
            <span className='flex flex-1 items-start gap-3'>
              {item.icon ? (
                <span className='text-muted-foreground'>{item.icon}</span>
              ) : null}
              <span className='flex flex-1 flex-col items-start gap-1'>
                <span>{item.label}</span>
                {item.description ? (
                  <span className='text-xs text-muted-foreground'>
                    {item.description}
                  </span>
                ) : null}
              </span>
            </span>
            <span className='flex items-center gap-2 text-xs text-muted-foreground'>
              {item.hotkey ? formatHotkey(item.hotkey) : null}
              {showChevron ? <ChevronRight className='size-3.5' /> : null}
            </span>
          </div>
        );

        const content = item.href ? (
          <DropdownMenuItem
            key={key}
            disabled={item.disabled}
            onSelect={handleItemSelect}
            asChild
            className='focus:outline-none'
          >
            <a href={item.href} className={cn(baseClasses, 'block')}>
              {renderContent(false)}
            </a>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            key={key}
            disabled={item.disabled}
            onSelect={handleItemSelect}
            className={baseClasses}
          >
            {renderContent(false)}
          </DropdownMenuItem>
        );

        const element = hasChildren ? (
          <DropdownMenuSub key={key}>
            <DropdownMenuSubTrigger
              disabled={item.disabled}
              className={baseClasses}
            >
              {renderContent(false)}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className={contentClasses}
              sideOffset={4}
              alignOffset={-4}
            >
              {renderItems(item.items!)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : (
          content
        );

        return (
          <Fragment key={key}>
            {item.dividerAbove ? (
              <DropdownMenuSeparator className='my-1 h-px bg-border/70' />
            ) : null}
            {element}
          </Fragment>
        );
      })}
    </Fragment>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={contentClasses}
      >
        {label || description ? (
          <div className='border-border/60 border-b px-3 py-2'>
            {label ? (
              <p className='text-sm font-semibold text-foreground'>{label}</p>
            ) : null}
            {description ? (
              <p className='text-xs text-muted-foreground'>{description}</p>
            ) : null}
          </div>
        ) : null}

        <div className='px-1 py-1'>{renderItems(items)}</div>

        {footer ? (
          <div className='border-border/60 border-t px-3 py-2 text-xs text-muted-foreground'>
            {footer}
          </div>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RMenu;
