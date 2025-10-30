import { useId } from 'react';
import type { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/app/components/ui/dialog';
import { cn } from '@/modules/app/libs/utils';
import type { DialogProps } from '@radix-ui/react-dialog';

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_MAP: Record<Size, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-none sm:w-full sm:mx-6 md:mx-0 md:w-[960px]',
};

export type RDialogProps = Omit<DialogProps, 'children'> & {
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  size?: Size;
  blurOverlay?: boolean;
  alignFooter?: 'start' | 'center' | 'end' | 'apart';
  children?: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  showCloseButton?: boolean;
};

export function RDialog({
  trigger,
  title,
  description,
  footer,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  size = 'md',
  blurOverlay = false,
  alignFooter = 'end',
  children,
  hideHeader = false,
  hideFooter = false,
  showCloseButton = true,
  ...dialogProps
}: RDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  const footerAlignment = {
    start: 'sm:justify-start',
    center: 'sm:justify-center',
    end: 'sm:justify-end',
    apart: 'sm:justify-between',
  }[alignFooter];

  return (
    <Dialog {...dialogProps}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'gap-5',
          SIZE_MAP[size],
          blurOverlay && 'backdrop-blur',
          contentClassName,
        )}
        showCloseButton={showCloseButton}
      >
        {!hideHeader && (title || description) ? (
          <DialogHeader className={cn('space-y-2', headerClassName)}>
            {title ? (
              <DialogTitle id={titleId} className='text-xl font-semibold'>
                {title}
              </DialogTitle>
            ) : null}
            {description ? (
              <DialogDescription id={descriptionId}>
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        ) : null}

        {children ? (
          <div className={cn('max-h-[70vh] overflow-y-auto', bodyClassName)}>
            {children}
          </div>
        ) : null}

        {!hideFooter && footer ? (
          <DialogFooter
            className={cn('gap-2', footerAlignment, footerClassName)}
          >
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default RDialog;
