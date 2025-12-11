import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type BlockerFunction,
  useBeforeUnload,
  useBlocker,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import showAlert, {
  type TAlertConfirmationConfig,
} from '@/modules/app/components/base/show-alert';

export type LeavePageGuardOptions = {
  enabled: boolean;
  message?: string;
  confirmStrategy?: 'confirm' | 'alert';
  alertConfig?: Partial<TAlertConfirmationConfig>;
};

export type LeavePageGuard = {
  canSafelyLeave: boolean;
  setCanLeave: (canLeave: boolean) => void;
  confirmNavigation: () => Promise<boolean>;
};

export function useLeavePageGuard({
  enabled,
  message,
  confirmStrategy = 'alert',
  alertConfig,
}: LeavePageGuardOptions): LeavePageGuard {
  const { t } = useTranslation('app');
  const defaultMessage = t('leavePageGuard.message');
  const finalMessage = message ?? defaultMessage;

  const [canSafelyLeave, setCanSafelyLeaveState] = useState(!enabled);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const canSafelyLeaveRef = useRef(canSafelyLeave);
  const confirmingNavigationRef = useRef(false);

  const setCanSafelyLeave = useCallback((value: boolean) => {
    canSafelyLeaveRef.current = value;
    setCanSafelyLeaveState(value);
  }, []);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!enabledRef.current) return;
        event.preventDefault();
        event.returnValue = finalMessage;
      },
      [finalMessage],
    ),
    { capture: true },
  );

  useEffect(() => {
    if (!enabled) {
      setCanSafelyLeave(true);
    } else {
      setCanSafelyLeave(false);
    }
  }, [enabled, setCanSafelyLeave]);

  const shouldBlockNavigation = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      if (!enabledRef.current || canSafelyLeaveRef.current) {
        return false;
      }

      const currentKey = `${currentLocation.pathname}${currentLocation.search}${currentLocation.hash}`;
      const nextKey = `${nextLocation.pathname}${nextLocation.search}${nextLocation.hash}`;

      return currentKey !== nextKey;
    },
    [],
  );

  const blocker = useBlocker(shouldBlockNavigation);
  const blockerState = blocker.state;
  const blockerProceed = blocker.proceed;
  const blockerReset = blocker.reset;

  const confirmNavigation = useCallback(async () => {
    if (!enabledRef.current) {
      return true;
    }

    if (confirmStrategy === 'alert') {
      const result = await new Promise<boolean>((resolve) => {
        showAlert(
          {
            title: alertConfig?.title ?? t('leavePageGuard.title'),
            description: alertConfig?.description ?? finalMessage,
            okText: alertConfig?.okText ?? t('leavePageGuard.leave'),
            cancelText: alertConfig?.cancelText ?? t('leavePageGuard.stay'),
            manualClose: true,
            type: 'confirm',
            ...alertConfig,
          },
          ({ ok, close }) => {
            resolve(ok);
            close();
          },
        );
      });

      if (result) {
        setCanSafelyLeave(true);
      }
      return result;
    }

    const confirmResult = window.confirm(finalMessage);
    if (confirmResult) {
      setCanSafelyLeave(true);
    }
    return confirmResult;
  }, [alertConfig, confirmStrategy, finalMessage, setCanSafelyLeave, t]);

  useEffect(() => {
    if (blockerState !== 'blocked') {
      confirmingNavigationRef.current = false;
      return;
    }

    if (confirmingNavigationRef.current) {
      return;
    }

    confirmingNavigationRef.current = true;

    void (async () => {
      const shouldProceed = await confirmNavigation();
      if (shouldProceed) {
        blockerProceed?.();
      } else {
        blockerReset?.();
      }
    })().finally(() => {
      confirmingNavigationRef.current = false;
    });
  }, [blockerState, blockerProceed, blockerReset, confirmNavigation]);

  return {
    canSafelyLeave,
    setCanLeave: setCanSafelyLeave,
    confirmNavigation,
  };
}

export type DirtyTrackerOptions<T> = {
  initialValue: T;
  compare?: (a: T, b: T) => boolean;
};

export function useDirtyTracker<T>({
  initialValue,
  compare,
}: DirtyTrackerOptions<T>) {
  const [baseline, setBaseline] = useState(initialValue);
  const [current, setCurrent] = useState(initialValue);

  const isDirty = useMemo(() => {
    if (compare) {
      return !compare(baseline, current);
    }
    return baseline !== current;
  }, [baseline, compare, current]);

  const updateCurrent = useCallback((value: T) => {
    setCurrent(value);
  }, []);

  const resetBaseline = useCallback(() => {
    setBaseline(current);
  }, [current]);

  const setBaselineValue = useCallback((value: T) => {
    setBaseline(value);
  }, []);

  return {
    isDirty,
    current,
    baseline,
    updateCurrent,
    resetBaseline,
    setBaseline: setBaselineValue,
  };
}
