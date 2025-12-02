import { createElement } from 'react';
import { toast } from 'sonner';
import { CustomToast } from '@/modules/app/components/ui/custom-toast';

type ToastOptions = {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
};

/**
 * Show custom toast with progress bar
 */
export const showToast = {
  error: (options: Omit<ToastOptions, 'variant'>) => {
    return toast.custom(
      (t) =>
        createElement(CustomToast, {
          ...options,
          variant: 'error',
          duration: options.duration ?? 4000,
          toastId: t,
        }),
      {
        duration: options.duration ?? 4000,
      },
    );
  },

  success: (options: Omit<ToastOptions, 'variant'>) => {
    return toast.custom(
      (t) =>
        createElement(CustomToast, {
          ...options,
          variant: 'success',
          duration: options.duration ?? 4000,
          toastId: t,
        }),
      {
        duration: options.duration ?? 4000,
      },
    );
  },

  warning: (options: Omit<ToastOptions, 'variant'>) => {
    return toast.custom(
      (t) =>
        createElement(CustomToast, {
          ...options,
          variant: 'warning',
          duration: options.duration ?? 4000,
          toastId: t,
        }),
      {
        duration: options.duration ?? 4000,
      },
    );
  },

  info: (options: Omit<ToastOptions, 'variant'>) => {
    return toast.custom(
      (t) =>
        createElement(CustomToast, {
          ...options,
          variant: 'info',
          duration: options.duration ?? 4000,
          toastId: t,
        }),
      {
        duration: options.duration ?? 4000,
      },
    );
  },

  default: (options: Omit<ToastOptions, 'variant'>) => {
    return toast.custom(
      (t) =>
        createElement(CustomToast, {
          ...options,
          variant: 'default',
          duration: options.duration ?? 4000,
          toastId: t,
        }),
      {
        duration: options.duration ?? 4000,
      },
    );
  },

  custom: (options: ToastOptions) => {
    return toast.custom(
      (t) =>
        createElement(CustomToast, {
          ...options,
          duration: options.duration ?? 4000,
          toastId: t,
        }),
      {
        duration: options.duration ?? 4000,
      },
    );
  },
};
