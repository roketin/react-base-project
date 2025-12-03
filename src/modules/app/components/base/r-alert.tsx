import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/modules/app/libs/utils';
import {
  feedbackVariants,
  type TFeedbackVariant,
} from '@/modules/app/libs/ui-variants';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

export type TRAlertVariant = TFeedbackVariant;

export type TRAlertProps = HTMLAttributes<HTMLDivElement> & {
  /** Alert variant */
  variant?: TRAlertVariant;
  /** Alert title */
  title?: ReactNode;
  /** Alert description/content */
  description?: ReactNode;
  /** Custom icon, set to null to hide */
  icon?: ReactNode | null;
  /** Show close button */
  closable?: boolean;
  /** Callback when close button clicked */
  onClose?: () => void;
  /** Additional action buttons */
  action?: ReactNode;
};

const variantIcons: Record<TRAlertVariant, ReactNode> = {
  default: <Info className='h-5 w-5 text-muted-foreground' />,
  info: <Info className='h-5 w-5 text-info' />,
  success: <CheckCircle2 className='h-5 w-5 text-success' />,
  warning: <AlertTriangle className='h-5 w-5 text-warning' />,
  error: <AlertCircle className='h-5 w-5 text-destructive' />,
};

export const RAlert = forwardRef<HTMLDivElement, TRAlertProps>(
  (
    {
      variant = 'default',
      title,
      description,
      icon,
      closable = false,
      onClose,
      action,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const showIcon = icon !== null;
    const iconElement = icon ?? variantIcons[variant];

    return (
      <div
        ref={ref}
        role='alert'
        className={cn(
          'relative flex gap-3 rounded-lg border p-4',
          feedbackVariants.bg[variant],
          className,
        )}
        {...props}
      >
        {showIcon && <div className='shrink-0 mt-0.5'>{iconElement}</div>}

        <div className='flex-1 space-y-1'>
          {title && <div className='font-semibold text-sm'>{title}</div>}
          {description && (
            <div className='text-sm opacity-90'>{description}</div>
          )}
          {children && <div className='text-sm opacity-90'>{children}</div>}
          {action && <div className='mt-3'>{action}</div>}
        </div>

        {closable && (
          <button
            type='button'
            onClick={onClose}
            className='shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2'
            aria-label='Close alert'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    );
  },
);

RAlert.displayName = 'RAlert';
