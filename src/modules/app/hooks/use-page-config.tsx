import { useEffect, useMemo, type DependencyList, type ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AppForbidden from '@/modules/app/components/pages/app-forbidden';
import AppNotFound from '@/modules/app/components/pages/app-not-found';
import { useFeatureFlag } from '@/modules/app/hooks/use-feature-flag';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import {
  useOverridePageConfigStore,
  type TResolvedPageConfig,
} from '@/modules/app/stores/page-config.store';
import type {
  TBreadcrumbItem,
  TPageConfig,
  TPageConfigContext,
} from '@/modules/app/types/page-config.type';
import type { TPermission } from '@/modules/app/constants/permission.constant';

type useOverridePageConfigOptions = {
  deps?: DependencyList;
};

export type useOverridePageConfigResult = {
  canRender: boolean;
  fallback: ReactNode | null;
  isFeatureEnabled: boolean;
  hasPermission: boolean;
  breadcrumbs?: TBreadcrumbItem[];
};

function normalizePermissions(
  permissions?: TPermission | TPermission[],
): TPermission[] | undefined {
  if (!permissions) return undefined;
  return Array.isArray(permissions) ? permissions : [permissions];
}

function buildContext(
  pathname: string,
  params: Record<string, string | undefined>,
) {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return {
    params,
    pathname,
    segments,
  };
}

function resolveConfig(
  config?: TPageConfig | ((ctx: TPageConfigContext) => TPageConfig),
  ctx?: TPageConfigContext,
) {
  if (!config || !ctx) return undefined;
  const shape = typeof config === 'function' ? config(ctx) : config;

  const breadcrumbs =
    typeof shape.breadcrumbs === 'function'
      ? shape.breadcrumbs(ctx)
      : shape.breadcrumbs;

  return {
    title: shape.title,
    breadcrumbs,
    permissions: normalizePermissions(shape.permissions),
    featureFlag: shape.featureFlag,
  } as TResolvedPageConfig;
}

export function useOverridePageConfig(
  config?: TPageConfig | ((ctx: TPageConfigContext) => TPageConfig),
  options?: useOverridePageConfigOptions,
): useOverridePageConfigResult {
  const location = useLocation();
  const params = useParams();
  const memoizedParams = useMemo(() => ({ ...params }), [params]);
  const ctx = useMemo(
    () => buildContext(location.pathname, memoizedParams),
    [location.pathname, memoizedParams],
  );

  const deps = options?.deps ?? [];

  const resolved = useMemo(
    () => resolveConfig(config, ctx),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, ctx, ...deps],
  );

  const setPageConfig = useOverridePageConfigStore(
    (state) => state.setPageConfig,
  );

  useEffect(() => {
    setPageConfig(resolved);

    return () => {
      setPageConfig(undefined);
    };
  }, [resolved, setPageConfig]);

  const { isCan, isLoggedIn } = useAuth();
  const permissions = resolved?.permissions;
  const needsPermission = Boolean(permissions && permissions.length > 0);

  const hasPermission = useMemo(() => {
    if (!needsPermission || !permissions) return true;
    if (!isLoggedIn()) return false;
    return isCan(permissions);
  }, [isCan, isLoggedIn, needsPermission, permissions]);

  const isFeatureEnabled = useFeatureFlag(resolved?.featureFlag);

  const fallback = useMemo(() => {
    if (resolved?.featureFlag && !isFeatureEnabled) {
      return <AppNotFound />;
    }

    if (needsPermission && !hasPermission) {
      return <AppForbidden />;
    }

    return null;
  }, [hasPermission, isFeatureEnabled, needsPermission, resolved?.featureFlag]);

  return {
    canRender: !fallback,
    fallback,
    isFeatureEnabled,
    hasPermission,
    breadcrumbs: resolved?.breadcrumbs,
  };
}
