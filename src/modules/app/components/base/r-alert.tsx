import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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

export type TRAlertAnimation =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'none';

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
  /** Animation type */
  animate?: TRAlertAnimation;
  /** Control visibility for AnimatePresence */
  visible?: boolean;
  /** Animation duration in seconds */
  duration?: number;
};

const variantIcons: Record<TRAlertVariant, ReactNode> = {
  default: <Info className='h-5 w-5 text-muted-foreground' />,
  info: <Info className='h-5 w-5 text-info' />,
  success: <CheckCircle2 className='h-5 w-5 text-success' />,
  warning: <AlertTriangle className='h-5 w-5 text-warning' />,
  error: <AlertCircle className='h-5 w-5 text-destructive' />,
};

const animationVariants: Record<TRAlertAnimation, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  },
  'slide-down': {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
  },
  'slide-right': {
    initial: { opacity: 0, x: -16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 16 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
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
      animate = 'none',
      visible = true,
      duration = 0.2,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const showIcon = icon !== null;
    const iconElement = icon ?? variantIcons[variant];
    const variants = animationVariants[animate];

    const alertContent = (
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
        {showIcon && <div className='mt-0.5 shrink-0'>{iconElement}</div>}

        <div className='flex-1 space-y-1'>
          {title && <div className='text-sm font-semibold'>{title}</div>}
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

    if (animate === 'none') {
      return visible ? alertContent : null;
    }

    return (
      <AnimatePresence mode='wait'>
        {visible && (
          <motion.div
            initial='initial'
            animate='animate'
            exit='exit'
            variants={variants}
            transition={{ duration, ease: 'easeOut' }}
          >
            {alertContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

RAlert.displayName = 'RAlert';
