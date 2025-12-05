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

export type TRDialogProps = Omit<DialogProps, 'children'> & {
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
  closeClassName?: string;
  size?: Size;
  blurOverlay?: boolean;
  alignFooter?: 'start' | 'center' | 'end' | 'apart';
  children?: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  showCloseButton?: boolean;
  fullscreen?: boolean;
  /** Prevent closing when clicking outside the dialog */
  preventCloseOnOverlay?: boolean;
  /** Prevent closing when pressing Escape key */
  preventCloseOnEscape?: boolean;
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
  overlayClassName,
  closeClassName,
  size = 'md',
  blurOverlay = false,
  alignFooter = 'end',
  children,
  hideHeader = false,
  hideFooter = false,
  showCloseButton = true,
  fullscreen = false,
  preventCloseOnOverlay = false,
  preventCloseOnEscape = false,
  ...dialogProps
}: TRDialogProps) {
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
        aria-labelledby={titleId}
        showCloseButton={showCloseButton}
        fullscreen={fullscreen}
        overlayClassName={cn(blurOverlay && 'backdrop-blur', overlayClassName)}
        closeClassName={closeClassName}
        className={cn(
          'gap-5',
          fullscreen ? '' : SIZE_MAP[size],
          contentClassName,
        )}
        onInteractOutside={
          preventCloseOnOverlay ? (e) => e.preventDefault() : undefined
        }
        onEscapeKeyDown={
          preventCloseOnEscape ? (e) => e.preventDefault() : undefined
        }
      >
        {/* DialogTitle is ALWAYS required for accessibility */}
        {!hideHeader && title ? (
          <DialogHeader className={cn('space-y-2', headerClassName)}>
            <DialogTitle id={titleId} className='text-xl font-semibold'>
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription id={descriptionId}>
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        ) : (
          /* Hidden title for accessibility when header is hidden or no title provided */
          <DialogTitle id={titleId} className='sr-only'>
            {title || 'Dialog'}
          </DialogTitle>
        )}

        {/* Show description separately if header is hidden but description exists */}
        {hideHeader && description && (
          <DialogDescription id={descriptionId} className='sr-only'>
            {description}
          </DialogDescription>
        )}

        {children && <div className={cn(bodyClassName)}>{children}</div>}

        {!hideFooter && footer ? (
          <DialogFooter
            className={cn('gap-1', footerAlignment, footerClassName)}
          >
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default RDialog;
