import { type ComponentType, type ComponentProps, type ReactNode } from 'react';
import { useFeatureFlag } from '@/modules/app/hooks/use-feature-flag';
import AppNotFound from '@/modules/app/components/pages/app-not-found';
import type { FeatureFlagKey } from '@/modules/app/libs/feature-flag';

type WithFeatureFlagOptions = {
  flag?: FeatureFlagKey;
  fallback?: ReactNode;
};

export function withFeatureFlag<T extends ComponentType<unknown>>(
  Component: T,
  { flag, fallback }: WithFeatureFlagOptions,
): ComponentType<ComponentProps<T>> {
  const Wrapped = (props: ComponentProps<T>) => {
    const isEnabled = useFeatureFlag(flag);

    if (!isEnabled) {
      return fallback ?? <AppNotFound />;
    }

    return <Component {...props} />;
  };

  Wrapped.displayName = `WithFeatureFlag(${Component.displayName ?? Component.name ?? 'Component'})`;

  return Wrapped;
}
