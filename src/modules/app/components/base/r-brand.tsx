import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Rocket } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import roketinConfig from '@config';

type RBrandProps = {
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  showTagline?: boolean;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
};

export function RBrand({
  className,
  iconClassName,
  titleClassName,
  subtitleClassName,
  direction = 'horizontal',
  align = 'start',
  showTagline = true,
  title,
  subtitle,
  icon,
}: RBrandProps) {
  const { t } = useTranslation('app');
  const { app: appConfig } = roketinConfig;

  const { resolvedTitle, resolvedSubtitle } = useMemo(() => {
    return {
      resolvedTitle: title ?? appConfig.name ?? t('title'),
      resolvedSubtitle: subtitle ?? appConfig.tagline ?? t('subTitle'),
    };
  }, [title, subtitle, appConfig.name, appConfig.tagline, t]);

  const hasTagline = showTagline && resolvedSubtitle;

  return (
    <div
      className={clsx(
        'flex gap-3',
        direction === 'horizontal' && 'items-center',
        direction === 'vertical' && [
          'flex-col',
          align === 'center' && 'items-center',
          align === 'end' && 'items-end',
          align === 'start' && 'items-start',
        ],
        className,
      )}
    >
      <span
        className={clsx(
          'flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm',
          iconClassName,
        )}
      >
        {icon ?? <Rocket className='size-5' />}
      </span>
      <div
        className={clsx(
          'flex flex-col',
          direction === 'vertical'
            ? [
                'gap-1',
                align === 'center' && 'items-center text-center',
                align === 'end' && 'items-end text-right',
                align === 'start' && 'items-start text-left',
              ]
            : 'text-left',
        )}
      >
        <span
          className={clsx(
            'text-base font-semibold leading-tight text-foreground',
            titleClassName,
          )}
        >
          {resolvedTitle}
        </span>
        {hasTagline ? (
          <span
            className={clsx('text-xs text-muted-foreground', subtitleClassName)}
          >
            {resolvedSubtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
