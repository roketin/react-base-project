import { useMemo } from 'react';
import {
  isFeatureEnabled,
  type FeatureFlagKey,
} from '@/modules/app/libs/feature-flag';

export function useFeatureFlag(flag?: FeatureFlagKey) {
  return useMemo(() => isFeatureEnabled(flag), [flag]);
}
