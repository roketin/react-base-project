import { cva } from 'class-variance-authority';
import { cn } from '@/modules/app/libs/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius)] text-[length:var(--form-font-size)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--form-focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-[var(--form-disabled-opacity)] shadow-[var(--form-shadow)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:text-white',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-[var(--form-border-color)] bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        info: 'bg-info text-info-foreground hover:bg-info/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        error:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        confirm:
          'bg-purple-500 text-white hover:bg-purple-600 disabled:bg-purple-400',
        'soft-default': 'bg-primary/10 text-primary hover:bg-primary/20',
        'soft-destructive':
          'bg-destructive/10 text-destructive hover:bg-destructive/20',
        'soft-info': 'bg-info/10 text-info hover:bg-info/20',
        'soft-success': 'bg-success/10 text-success hover:bg-success/20',
        'soft-warning': 'bg-warning/10 text-warning hover:bg-warning/20',
        'soft-error':
          'bg-destructive/10 text-destructive hover:bg-destructive/20',
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
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'border-border text-foreground hover:bg-accent',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning:
          'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/80',
        'soft-default':
          'border-transparent bg-primary/10 text-primary hover:bg-primary/20',
        'soft-secondary':
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'soft-destructive':
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20',
        'soft-success':
          'border-transparent bg-success/10 text-success hover:bg-success/20',
        'soft-warning':
          'border-transparent bg-warning/10 text-warning hover:bg-warning/20',
        'soft-info': 'border-transparent bg-info/10 text-info hover:bg-info/20',
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
 * Input variants using CVA for consistent styling with size support
 * Uses CSS variables defined in global.css for centralized theming
 */
export const inputVariants = cva(
  cn(
    'flex w-full rounded-[var(--form-radius)] border bg-[var(--form-bg)] text-[var(--form-text)]',
    'transition-colors duration-200',
    'placeholder:text-[var(--form-placeholder)]',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)] disabled:bg-[var(--form-disabled-bg)]',
    'border-[var(--form-border-color)] focus:border-primary focus:ring-primary/20',
    'shadow-[var(--form-shadow)]',
    // Error state classes
    'aria-invalid:border-destructive',
    'aria-invalid:focus:border-destructive',
    'aria-invalid:focus:ring-destructive/20',
  ),
  {
    variants: {
      size: {
        default:
          'h-[var(--form-height-outer)] px-[var(--form-padding-x)] py-2 text-[length:var(--form-font-size)]',
        sm: 'h-[var(--form-height-sm-outer)] px-[var(--form-padding-x-sm)] py-1.5 text-sm',
        xs: 'h-8 px-2 py-1 text-xs',
        lg: 'h-[var(--form-height-lg-outer)] px-[var(--form-padding-x-lg)] py-2.5 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/**
 * Base input classes for consistent styling across all input components
 * @deprecated Use inputVariants instead for size support
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
 * @deprecated Use inputVariants instead
 */
export const inputErrorClasses = cn(
  'aria-invalid:border-destructive',
  'aria-invalid:focus:border-destructive',
  'aria-invalid:focus:ring-destructive/20',
);

/**
 * Get complete input classes with optional error state
 * @deprecated Use inputVariants instead for size support
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
    info: 'bg-info/10 border-info/20 text-info',
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    error: 'bg-destructive/10 border-destructive/20 text-destructive',
  },
  /** Solid color styles */
  solid: {
    default: 'bg-primary',
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  },
  /** Text/icon color styles */
  text: {
    default: 'text-primary',
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
  },
  /** Border color styles */
  border: {
    default: 'border-primary/20',
    info: 'border-info/20',
    success: 'border-success/20',
    warning: 'border-warning/20',
    error: 'border-destructive/20',
  },
} as const;
