import { useMatches } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TAppRouteObject } from '@/modules/app/libs/routes-utils';
import { useOverridePageConfigStore } from '@/modules/app/stores/page-config.store';
import { cn } from '@/modules/app/libs/utils';
import roketinConfig from '@config';

type AppPageTitleProps = {
  className?: string;
};

/**
 * Component that automatically displays the current page title.
 * It retrieves the title from route configuration or override store,
 * and translates it using i18n.
 * Also sets the document title.
 */
export const AppPageTitle = ({ className }: AppPageTitleProps) => {
  const matches = useMatches() as (ReturnType<typeof useMatches>[number] & {
    handle?: TAppRouteObject['handle'];
  })[];

  const overrideTitle = useOverridePageConfigStore(
    (state) => state.current?.title,
  );

  // Get title from route
  const routeTitle = useMemo<string>(
    () => matches[matches.length - 1].handle?.title || '',
    [matches],
  );

  const resolvedTitle = overrideTitle ?? routeTitle ?? '';

  // Translation
  const { t } = useTranslation();

  const translatedTitle = resolvedTitle
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      t(resolvedTitle as any, { defaultValue: resolvedTitle })
    : '';

  // Set document title
  useEffect(() => {
    const appName = roketinConfig.app.name;
    if (translatedTitle) {
      document.title = `${translatedTitle} | ${appName}`;
    } else {
      document.title = appName;
    }
  }, [translatedTitle]);

  if (!resolvedTitle) return null;

  return (
    <div className={cn('text-primary font-semibold', className)}>
      {translatedTitle}
    </div>
  );
};
