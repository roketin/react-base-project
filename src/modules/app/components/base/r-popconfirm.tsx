import {
  forwardRef,
  useState,
  useCallback,
  type ReactNode,
  type ReactElement,
  cloneElement,
  isValidElement,
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from '@/modules/app/components/base/r-popover-primitives';
import { cn } from '@/modules/app/libs/utils';
import RBtn from '@/modules/app/components/base/r-btn';
import { AlertTriangle, HelpCircle, Info, AlertCircle } from 'lucide-react';
import {
  feedbackVariants,
  type TFeedbackVariant,
} from '@/modules/app/libs/ui-variants';

export type TRPopconfirmProps = {
  /** Title of the confirmation */
  title: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Variant for icon color */
  variant?: TFeedbackVariant;
  /** Custom icon, set to null to hide */
  icon?: ReactNode | null;
  /** Text for confirm button */
  okText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** Callback when confirmed */
  onConfirm?: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Loading state for confirm button */
  loading?: boolean;
  /** Disable the popconfirm */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Popover placement */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Popover alignment */
  align?: 'start' | 'center' | 'end';
  /** Trigger element */
  children: ReactElement;
  /** Additional class for popover content */
  className?: string;
  /** Width of the popover */
  width?: number | string;
  /** Show arrow pointer */
  showArrow?: boolean;
};

const variantIcons: Record<TFeedbackVariant, ReactNode> = {
  default: <HelpCircle className='h-5 w-5' />,
  info: <Info className='h-5 w-5' />,
  success: <HelpCircle className='h-5 w-5' />,
  warning: <AlertTriangle className='h-5 w-5' />,
  error: <AlertCircle className='h-5 w-5' />,
};

export const RPopconfirm = forwardRef<HTMLDivElement, TRPopconfirmProps>(
  (
    {
      title,
      description,
      variant = 'warning',
      icon,
      okText = 'Yes',
      cancelText = 'No',
      onConfirm,
      onCancel,
      loading = false,
      disabled = false,
      open: controlledOpen,
      onOpenChange,
      side = 'top',
      align = 'center',
      children,
      className,
      width = 280,
      showArrow = true,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        if (disabled) return;
        if (!isControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [disabled, isControlled, onOpenChange],
    );

    const handleCancel = useCallback(() => {
      onCancel?.();
      handleOpenChange(false);
    }, [onCancel, handleOpenChange]);

    const handleConfirm = useCallback(async () => {
      if (loading || isLoading) return;

      const result = onConfirm?.();
      if (result instanceof Promise) {
        setIsLoading(true);
        try {
          await result;
          handleOpenChange(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        handleOpenChange(false);
      }
    }, [loading, isLoading, onConfirm, handleOpenChange]);

    const showIcon = icon !== null;
    const iconElement = icon ?? variantIcons[variant];
    const actualLoading = loading || isLoading;

    // Clone trigger element to handle disabled state
    const trigger = isValidElement(children)
      ? cloneElement(children as ReactElement<{ onClick?: () => void }>, {
          onClick: disabled
            ? undefined
            : (children as ReactElement<{ onClick?: () => void }>).props
                .onClick,
        })
      : children;

    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          ref={ref}
          side={side}
          align={align}
          sideOffset={showArrow ? 8 : 4}
          className={cn('p-4', className)}
          style={{ width }}
        >
          {showArrow && (
            <PopoverArrow className='fill-popover drop-shadow-sm' />
          )}
          <div className='flex gap-3'>
            {showIcon && (
              <div
                className={cn(
                  'shrink-0 mt-0.5',
                  feedbackVariants.text[variant],
                )}
              >
                {iconElement}
              </div>
            )}
            <div className='flex-1 space-y-1'>
              <div className='font-semibold text-sm'>{title}</div>
              {description && (
                <div className='text-sm text-muted-foreground'>
                  {description}
                </div>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-2 mt-4'>
            <RBtn
              size='sm'
              variant='outline'
              onClick={handleCancel}
              disabled={actualLoading}
            >
              {cancelText}
            </RBtn>
            <RBtn size='sm' onClick={handleConfirm} loading={actualLoading}>
              {okText}
            </RBtn>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

RPopconfirm.displayName = 'RPopconfirm';

export default RPopconfirm;
