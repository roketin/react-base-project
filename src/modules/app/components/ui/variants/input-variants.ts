import { cva } from 'class-variance-authority';

export type TInputSize = 'default' | 'sm' | 'lg';

export const inputVariants = cva(
  'w-full min-w-0 rounded-[var(--form-radius)] text-[length:var(--form-font-size)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-[var(--form-height)] px-[var(--form-padding-x)] py-1',
        sm: 'h-[var(--form-height-sm)] px-[var(--form-padding-x-sm)] py-1 text-[length:var(--form-font-size-sm)]',
        lg: 'h-[var(--form-height-lg)] px-[var(--form-padding-x-lg)] py-2 text-[length:var(--form-font-size-lg)]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);
