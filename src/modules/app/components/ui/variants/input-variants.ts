import { cva } from 'class-variance-authority';

export type TInputSize = 'default' | 'sm' | 'lg' | 'icon';

export const inputVariants = cva(
  'w-full min-w-0 rounded text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      size: {
        default: 'h-9 px-3 py-1',
        sm: 'h-8 px-2 py-1 text-sm',
        lg: 'h-11 px-4 py-2 text-lg',
        icon: 'h-9 w-9 p-0 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);
