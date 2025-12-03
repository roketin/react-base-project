import { cva } from 'class-variance-authority';
import { cn } from '@/modules/app/libs/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius)] text-[length:var(--form-font-size)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--form-focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-[var(--form-disabled-opacity)] shadow-[var(--form-shadow)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-[var(--form-border-color)] bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        info: 'bg-blue-500 text-white hover:bg-blue-600',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600',
        warning: 'bg-amber-500 text-white hover:bg-amber-600',
        error: 'bg-red-500 text-white hover:bg-red-600',
        confirm:
          'bg-purple-500 text-white hover:bg-purple-600 disabled:bg-purple-400',
        'soft-default': 'bg-primary/10 text-primary hover:bg-primary/20',
        'soft-destructive':
          'bg-destructive/10 text-destructive hover:bg-destructive/20',
        'soft-info': 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20',
        'soft-success':
          'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20',
        'soft-warning': 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20',
        'soft-error': 'bg-red-500/10 text-red-700 hover:bg-red-500/20',
        'soft-confirm':
          'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20',
      },
      size: {
        default: 'h-[var(--form-height-outer)] px-[var(--form-padding-x)]',
        sm: 'h-[var(--form-height-sm-outer)] px-[var(--form-padding-x-sm)]',
        xs: 'h-8 px-2 text-xs',
        lg: 'h-[var(--form-height-lg-outer)] px-[var(--form-padding-x-lg)]',
        icon: 'h-[var(--form-height-outer)] w-[var(--form-height-outer)]',
        iconSm:
          'h-[var(--form-height-sm-outer)] w-[var(--form-height-sm-outer)] text-sm',
        iconLg:
          'h-[var(--form-height-lg-outer)] w-[var(--form-height-lg-outer)] text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'border-slate-200 text-slate-900 hover:bg-slate-100',
        success:
          'border-transparent bg-green-600 text-white hover:bg-green-700',
        warning:
          'border-transparent bg-yellow-600 text-white hover:bg-yellow-700',
        info: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
        'soft-default':
          'border-transparent bg-primary/10 text-primary hover:bg-primary/20',
        'soft-secondary':
          'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200',
        'soft-destructive':
          'border-transparent bg-red-100 text-red-700 hover:bg-red-200',
        'soft-success':
          'border-transparent bg-green-100 text-green-700 hover:bg-green-200',
        'soft-warning':
          'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
        'soft-info':
          'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Base input classes for consistent styling across all input components
 * Uses CSS variables defined in global.css for centralized theming
 */
export const inputBaseClasses = cn(
  'flex w-full rounded-[var(--form-radius)] border bg-[var(--form-bg)] text-[var(--form-text)]',
  'h-[var(--form-height-outer)] px-[var(--form-padding-x)] py-2',
  'text-[length:var(--form-font-size)]',
  'transition-colors duration-200',
  'placeholder:text-[var(--form-placeholder)]',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)] disabled:bg-[var(--form-disabled-bg)]',
  'border-[var(--form-border-color)] focus:border-primary focus:ring-primary/20',
  'shadow-[var(--form-shadow)]',
);

/**
 * Input classes with error state
 */
export const inputErrorClasses = cn(
  'aria-invalid:border-destructive',
  'aria-invalid:focus:border-destructive',
  'aria-invalid:focus:ring-destructive/20',
);

/**
 * Get complete input classes with optional error state
 */
export const getInputClasses = (_hasError?: boolean, className?: string) => {
  return cn(inputBaseClasses, inputErrorClasses, className);
};

/**
 * Textarea base classes (similar to input but with min-height)
 */
export const textareaBaseClasses = cn(
  'flex min-h-[80px] w-full rounded-[var(--form-radius)] border bg-[var(--form-bg)] text-[var(--form-text)]',
  'px-[var(--form-padding-x)] py-2',
  'text-[length:var(--form-font-size)]',
  'transition-colors duration-200',
  'placeholder:text-[var(--form-placeholder)]',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)] disabled:bg-[var(--form-disabled-bg)]',
  'border-[var(--form-border-color)] focus:border-primary focus:ring-primary/20',
  'shadow-[var(--form-shadow)]',
);

/**
 * Get complete textarea classes with optional error state
 */
export const getTextareaClasses = (_hasError?: boolean, className?: string) => {
  return cn(textareaBaseClasses, inputErrorClasses, className);
};

/**
 * Centralized feedback/status variant styles
 * Used by RAlert, RProgress, Toast, and other feedback components
 */
export type TFeedbackVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export const feedbackVariants = {
  /** Background styles for alert/banner components */
  bg: {
    default: 'bg-muted border-border text-foreground',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success:
      'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    warning:
      'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error:
      'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  },
  /** Solid color styles */
  solid: {
    default: 'bg-primary',
    info: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-yellow-600 dark:bg-yellow-500',
    error: 'bg-red-600 dark:bg-red-500',
  },
  /** Text/icon color styles */
  text: {
    default: 'text-primary',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  },
  /** Border color styles */
  border: {
    default: 'border-primary/20',
    info: 'border-blue-600/20 dark:border-blue-400/20',
    success: 'border-green-600/20 dark:border-green-400/20',
    warning: 'border-yellow-600/20 dark:border-yellow-400/20',
    error: 'border-red-600/20 dark:border-red-400/20',
  },
} as const;
