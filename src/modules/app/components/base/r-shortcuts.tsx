import type { ReactNode } from 'react';
import { Command } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

export type RShortcutItem = {
  id: string;
  keys: string[];
  description: ReactNode;
  group?: string;
  meta?: ReactNode;
};

export type RShortcutsProps = {
  items: RShortcutItem[];
  className?: string;
  showHeaderIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  columns?: 1 | 2;
};

function formatKey(key: string) {
  switch (key.toLowerCase()) {
    case 'cmd':
    case 'command':
      return '⌘';
    case 'shift':
      return '⇧';
    case 'alt':
    case 'option':
      return '⌥';
    case 'ctrl':
    case 'control':
      return '⌃';
    case 'enter':
      return '↩';
    case 'escape':
    case 'esc':
      return '⎋';
    case 'tab':
      return '⇥';
    case 'space':
      return '␣';
    case 'delete':
      return '⌫';
    default:
      return key.toUpperCase();
  }
}

function ShortcutKey({ value }: { value: string }) {
  return (
    <kbd className='inline-flex min-w-6 items-center justify-center rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm'>
      {formatKey(value)}
    </kbd>
  );
}

export function RShortcuts({
  items,
  className,
  showHeaderIcon = true,
  title = 'Keyboard shortcuts',
  description = 'Speed up everyday tasks by learning these key combinations.',
  columns = 2,
}: RShortcutsProps) {
  const grouped = items.reduce<Record<string, RShortcutItem[]>>((acc, item) => {
    const groupKey = item.group ?? 'General';
    acc[groupKey] = acc[groupKey] ?? [];
    acc[groupKey].push(item);
    return acc;
  }, {});

  const columnClass =
    columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1';

  return (
    <div
      className={cn(
        'space-y-6 rounded-2xl border border-border/60 bg-linear-to-br from-background via-background to-muted/40 p-6 shadow-md',
        className,
      )}
    >
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-3'>
          {showHeaderIcon ? (
            <span className='inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Command className='size-4' aria-hidden='true' />
            </span>
          ) : null}

          <div className='space-y-1'>
            <h2 className='text-xl font-semibold'>{title}</h2>
            {description ? (
              <p className='text-sm text-muted-foreground'>{description}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cn('grid gap-6', columnClass)}>
        {Object.entries(grouped).map(([group, groupItems]) => (
          <div
            key={group}
            className='space-y-3 rounded-xl border border-dashed border-border/60 bg-background/60 p-4'
          >
            <h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              {group}
            </h3>

            <ul className='space-y-3 text-sm'>
              {groupItems.map((item) => (
                <li
                  key={item.id}
                  className='flex items-start justify-between gap-4 rounded-lg border border-transparent px-2 py-1 transition hover:border-border/60 hover:bg-muted/30'
                >
                  <div className='flex flex-1 items-center gap-2 text-left'>
                    <span className='flex flex-wrap items-center gap-1 text-xs text-muted-foreground/90'>
                      {item.keys.map((key, index) => (
                        <span key={`${item.id}-key-${key}-${index}`}>
                          <ShortcutKey value={key} />
                          {index < item.keys.length - 1 ? (
                            <span className='mx-1 text-muted-foreground'>
                              +
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </span>

                    <span className='text-sm text-foreground'>
                      {item.description}
                    </span>
                  </div>

                  {item.meta ? (
                    <span className='text-xs text-muted-foreground'>
                      {item.meta}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RShortcuts;
