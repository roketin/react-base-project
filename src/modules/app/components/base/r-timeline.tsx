import type { ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';

type TimelineStatus = 'completed' | 'current' | 'upcoming' | 'error';

export type TRTimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  status?: TimelineStatus;
  icon?: ReactNode;
  children?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  lineClassName?: string;
  dotClassName?: string;
};

export type TRTimelineProps = {
  items: TRTimelineItem[];
  className?: string;
  variant?: 'solid' | 'ghost';
  align?: 'left' | 'alternate';
  showLine?: boolean;
  compact?: boolean;
};

const STATUS_COLORS: Record<TimelineStatus, string> = {
  completed: 'bg-emerald-500 border-emerald-500',
  current: 'bg-primary border-primary',
  upcoming: 'bg-muted border-border',
  error: 'bg-destructive border-destructive',
};

function renderIcon(item: TRTimelineItem, status: TimelineStatus) {
  if (item.icon) {
    return (
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground shadow-sm',
        )}
      >
        {item.icon}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'h-3 w-3 rounded-full border-2',
        STATUS_COLORS[status],
        item.dotClassName,
      )}
    />
  );
}

const TimelineLine = ({
  isLast,
  status,
  className,
}: {
  isLast: boolean;
  status: TimelineStatus;
  className?: string;
}) => {
  if (isLast) {
    return null;
  }

  return (
    <span
      aria-hidden='true'
      className={cn(
        'absolute left-[calc(50%-0.75px)] top-12 h-[calc(100%-3rem)] w-[1.5px] bg-border',
        status === 'completed' && 'bg-emerald-100 dark:bg-emerald-500/30',
        status === 'error' && 'bg-destructive/40',
        className,
      )}
    />
  );
};

export function RTimeline({
  items,
  className,
  variant = 'solid',
  align = 'left',
  showLine = true,
  compact = false,
}: TRTimelineProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-6',
        variant === 'ghost' ? 'bg-background/40' : 'bg-background',
        className,
      )}
    >
      <ol
        className={cn(
          'relative flex flex-col gap-8',
          align === 'alternate' && 'lg:grid lg:grid-cols-2 lg:gap-x-12',
        )}
      >
        {items.map((item, index) => {
          const status = item.status ?? 'upcoming';
          const isLast = index === items.length - 1;
          const content = (
            <div
              className={cn(
                'relative flex gap-4',
                align === 'alternate' ? 'lg:flex-row-reverse' : 'flex-row',
              )}
            >
              <div className='relative flex flex-col items-center'>
                <div className='relative flex h-12 w-12 items-center justify-center'>
                  {renderIcon(item, status)}
                  {showLine ? (
                    <TimelineLine
                      isLast={isLast}
                      status={status}
                      className={item.lineClassName}
                    />
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  'flex-1 space-y-2 rounded-lg border border-border/60 bg-muted/10 p-4 shadow-sm backdrop-blur-sm',
                  variant === 'ghost' &&
                    'border-dashed bg-transparent shadow-none',
                  compact && 'p-3',
                )}
              >
                <div className='flex flex-wrap items-start justify-between gap-2'>
                  <div className='space-y-1'>
                    <h3 className='text-base font-semibold leading-tight'>
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className='text-sm text-muted-foreground'>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  {item.timestamp ? (
                    <span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                      {item.timestamp}
                    </span>
                  ) : null}
                </div>

                {item.children ? (
                  <div className='space-y-2 text-sm text-muted-foreground'>
                    {item.children}
                  </div>
                ) : null}

                {item.metadata ? (
                  <div className='border-t border-border/60 pt-3 text-xs text-muted-foreground'>
                    {item.metadata}
                  </div>
                ) : null}

                {item.actions ? (
                  <div className='border-t border-border/60 pt-3'>
                    <div className='flex flex-wrap gap-2'>{item.actions}</div>
                  </div>
                ) : null}
              </div>
            </div>
          );

          if (align === 'alternate') {
            return (
              <li
                key={item.id}
                className={cn(
                  'relative',
                  'lg:flex lg:flex-col',
                  index % 2 === 0
                    ? 'lg:col-start-1'
                    : 'lg:col-start-2 lg:items-end',
                )}
              >
                {content}
              </li>
            );
          }

          return (
            <li key={item.id} className='relative'>
              {content}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default RTimeline;
