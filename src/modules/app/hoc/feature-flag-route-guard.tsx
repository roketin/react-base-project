import { memo } from 'react';
import type { ReactNode } from 'react';
import AppNotFound from '@/modules/app/components/pages/app-not-found';
import { useFeatureFlag } from '@/modules/app/hooks/use-feature-flag';
import type { FeatureFlagKey } from '@/modules/app/libs/feature-flag';

type FeatureFlagRouteGuardProps = {
  element: ReactNode;
  featureFlag?: FeatureFlagKey;
  fallback?: ReactNode;
};

const FeatureFlagRouteGuard = ({
  element,
  featureFlag,
  fallback,
}: FeatureFlagRouteGuardProps) => {
  const isEnabled = useFeatureFlag(featureFlag);

  if (!featureFlag || isEnabled) {
    return <>{element}</>;
  }

  return <>{fallback ?? <AppNotFound />}</>;
};

export default memo(FeatureFlagRouteGuard);
