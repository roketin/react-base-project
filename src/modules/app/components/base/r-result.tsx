import { Children, isValidElement, cloneElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Inbox,
  OctagonX,
} from 'lucide-react';

import { cn } from '@/modules/app/libs/utils';

type ResultStatus = 'empty' | 'info' | 'success' | 'warning' | 'error';
type ResultSize = 'sm' | 'md' | 'lg';
type ResultAlign = 'center' | 'start';

const STATUS_ICON_MAP: Record<
  ResultStatus,
  {
    Icon: React.ElementType;
    iconClass: string;
    wrapperClass: string;
  }
> = {
  empty: {
    Icon: Inbox,
    iconClass: 'text-muted-foreground',
    wrapperClass: 'bg-muted/40',
  },
  info: {
    Icon: Info,
    iconClass: 'text-sky-500',
    wrapperClass: 'bg-sky-50 text-sky-500 dark:bg-sky-500/10',
  },
  success: {
    Icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    wrapperClass: 'bg-emerald-500/10 text-emerald-500',
  },
  warning: {
    Icon: AlertTriangle,
    iconClass: 'text-amber-500',
    wrapperClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  error: {
    Icon: OctagonX,
    iconClass: 'text-destructive',
    wrapperClass: 'bg-destructive/10 text-destructive',
  },
};

const SIZE_MAP: Record<
  ResultSize,
  {
    container: string;
    title: string;
    description: string;
    icon: string;
    iconWrapper: string;
    spacing: string;
  }
> = {
  sm: {
    container: 'gap-3',
    title: 'text-lg font-semibold',
    description: 'text-sm',
    icon: 'size-10',
    iconWrapper: 'size-14',
    spacing: 'space-y-1.5',
  },
  md: {
    container: 'gap-4',
    title: 'text-2xl font-semibold',
    description: 'text-base',
    icon: 'size-12',
    iconWrapper: 'size-16',
    spacing: 'space-y-2',
  },
  lg: {
    container: 'gap-5',
    title: 'text-3xl font-semibold',
    description: 'text-lg',
    icon: 'size-14',
    iconWrapper: 'size-20',
    spacing: 'space-y-3',
  },
};

type TRResultProps = {
  status?: ResultStatus;
  size?: ResultSize;
  align?: ResultAlign;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  illustration?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  bodyClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
  fullHeight?: boolean;
  subdued?: boolean;
  children?: ReactNode;
};

function renderCustomIcon(icon: ReactNode, className: string): ReactNode {
  if (!icon) {
    return null;
  }

  if (isValidElement(icon)) {
    return cloneElement(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon as ReactElement<any>,
      {
        className: cn(
          'shrink-0',
          className,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (icon as ReactElement<any>).props.className,
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    );
  }

  return <span className={cn('shrink-0', className)}>{icon}</span>;
}

export type TRResultStatus = ResultStatus;
export type TRResultSize = ResultSize;
export type TRResultAlign = ResultAlign;

export function RResult({
  status = 'empty',
  size = 'md',
  align = 'center',
  title,
  description,
  action,
  illustration,
  icon,
  badge,
  className,
  bodyClassName,
  iconWrapperClassName,
  iconClassName,
  fullHeight = false,
  subdued = false,
  children,
}: TRResultProps) {
  const statusConfig = STATUS_ICON_MAP[status];
  const sizeConfig = SIZE_MAP[size];

  const hasSlotContent =
    illustration ||
    icon ||
    badge ||
    title ||
    description ||
    action ||
    Children.count(children) > 0;

  const renderedIcon =
    icon !== undefined && icon !== null ? (
      renderCustomIcon(
        icon,
        cn(statusConfig?.iconClass, sizeConfig.icon, iconClassName),
      )
    ) : statusConfig ? (
      <statusConfig.Icon
        aria-hidden='true'
        className={cn(
          'shrink-0',
          statusConfig.iconClass,
          sizeConfig.icon,
          iconClassName,
        )}
      />
    ) : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        sizeConfig.container,
        align === 'start' && 'items-start text-left',
        fullHeight && 'min-h-[calc(100vh-6rem)] justify-center',
        subdued && 'text-muted-foreground',
        className,
      )}
    >
      {illustration ? (
        <div className='flex items-center justify-center'>{illustration}</div>
      ) : null}

      {renderedIcon ? (
        <div
          className={cn(
            'flex items-center justify-center rounded-full border border-border/40 bg-background/80',
            statusConfig?.wrapperClass,
            sizeConfig.iconWrapper,
            iconWrapperClassName,
          )}
        >
          {renderedIcon}
        </div>
      ) : null}

      {badge ? (
        isValidElement(badge) ? (
          badge
        ) : (
          <div className='inline-flex items-center justify-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            {badge}
          </div>
        )
      ) : null}

      {hasSlotContent ? (
        <div className={cn('space-y-2', sizeConfig.spacing, bodyClassName)}>
          {title ? (
            <h2 className={cn(sizeConfig.title, subdued && 'text-foreground')}>
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className={cn('text-muted-foreground', sizeConfig.description)}>
              {description}
            </p>
          ) : null}
          {children ? (
            <div className='text-sm text-muted-foreground/90 space-y-1'>
              {children}
            </div>
          ) : null}
        </div>
      ) : null}

      {action ? (
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {action}
        </div>
      ) : null}
    </div>
  );
}

export default RResult;
