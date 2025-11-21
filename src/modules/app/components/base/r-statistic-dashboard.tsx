import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';
import { RCard } from '@/modules/app/components/base/r-card';

type TrendDirection = 'up' | 'down' | 'neutral';

export type TRStatisticMetric = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  trend?: {
    value: number | string;
    direction?: TrendDirection;
    label?: ReactNode;
  };
  icon?: ReactNode;
  accentColor?: string;
  footer?: ReactNode;
  tags?: ReactNode;
  chart?: ReactNode;
};

export type TRStatisticDashboardProps = {
  metrics: TRStatisticMetric[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  cardClassName?: string;
  minimal?: boolean;
};

const DIRECTION_CONFIG: Record<
  TrendDirection,
  {
    icon?: ReactNode;
    className: string;
    prefix?: string;
  }
> = {
  up: {
    icon: <TrendingUp className='size-3.5 flex-none' aria-hidden='true' />,
    className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    prefix: '+',
  },
  down: {
    icon: <TrendingDown className='size-3.5 flex-none' aria-hidden='true' />,
    className: 'text-destructive bg-destructive/10',
    prefix: '',
  },
  neutral: {
    className: 'text-muted-foreground bg-muted',
  },
};

export function RStatisticDashboard({
  metrics,
  columns = 3,
  className,
  cardClassName,
  minimal = false,
}: TRStatisticDashboardProps) {
  const gridClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : columns === 3
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';

  return (
    <div className={cn('grid gap-4', gridClass, className)}>
      {metrics.map((metric) => {
        const direction = metric.trend?.direction ?? 'neutral';
        const trendConfig = DIRECTION_CONFIG[direction];
        const trendValue =
          typeof metric.trend?.value === 'number'
            ? `${trendConfig.prefix ?? ''}${metric.trend.value}`
            : metric.trend?.value;

        return (
          <RCard
            key={metric.id}
            wrapperClassName={cn(
              'group relative overflow-hidden bg-linear-to-br from-background via-background to-muted/50',
              minimal && 'border-transparent bg-background/80 shadow-none',
              cardClassName,
            )}
          >
            {metric.accentColor ? (
              <span
                className='pointer-events-none absolute inset-x-0 top-0 h-1 w-full'
                style={{ background: metric.accentColor }}
              />
            ) : null}

            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-2'>
                <span className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                  {metric.label}
                </span>
                <div className='text-3xl font-semibold'>{metric.value}</div>
              </div>
              {metric.icon ? (
                <div className='rounded-lg border border-border/70 bg-background/70 p-2 text-muted-foreground'>
                  {metric.icon}
                </div>
              ) : null}
            </div>

            {metric.description ? (
              <p className='mt-3 text-sm text-muted-foreground'>
                {metric.description}
              </p>
            ) : null}

            {metric.trend ? (
              <div className='mt-4 flex flex-wrap items-center gap-2'>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                    trendConfig.className,
                  )}
                >
                  {trendConfig.icon}
                  <span>{trendValue}</span>
                </span>
                {metric.trend.label ? (
                  <span className='text-xs text-muted-foreground'>
                    {metric.trend.label}
                  </span>
                ) : null}
              </div>
            ) : null}

            {metric.tags ? (
              <div className='mt-4 flex flex-wrap items-center gap-2'>
                {metric.tags}
              </div>
            ) : null}

            {metric.chart ? <div className='mt-4'>{metric.chart}</div> : null}

            {metric.footer ? (
              <div className='mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground'>
                {metric.footer}
              </div>
            ) : null}
          </RCard>
        );
      })}
    </div>
  );
}

export default RStatisticDashboard;
