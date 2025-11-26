import { cva } from 'class-variance-authority';

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
