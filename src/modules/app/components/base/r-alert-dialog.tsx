import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/modules/app/libs/utils';
import { buttonVariants } from '@/modules/app/libs/ui-variants';
import type { TLoadable } from '@/modules/app/types/component.type';
import type { VariantProps } from 'class-variance-authority';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
  ShieldQuestion,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RBtn from '@/modules/app/components/base/r-btn';
import { useSmartStack } from '@/modules/app/hooks/use-smart-stack';

// ============================================================================
// TYPES
// ============================================================================

type TRAlertVariant = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export type TRAlertDialogProps = TLoadable & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  okText?: string;
  cancelText?: string;
  okVariant?: VariantProps<typeof buttonVariants>['variant'];
  onOk?: () => void;
  onCancel?: () => void;
  extraButtons?: React.ReactNode;
  icon?: React.ReactNode;
  hideCancel?: boolean;
  width?: number | string;
  variant?: TRAlertVariant;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_ICONS: Record<TRAlertVariant, React.ReactNode> = {
  info: <Info className='h-16 w-16 text-info' />,
  success: <CheckCircle2 className='h-16 w-16 text-success' />,
  warning: <AlertTriangle className='h-16 w-16 text-warning' />,
  error: <OctagonAlert className='h-16 w-16 text-destructive' />,
  confirm: <ShieldQuestion className='h-16 w-16 text-warning' />,
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 15,
      delay: 0.1,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
      delay: 0.15,
    },
  },
};

const footerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
      delay: 0.2,
    },
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

const RAlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  okText = 'Yes',
  cancelText = 'No',
  okVariant,
  onOk,
  onCancel,
  extraButtons,
  loading,
  icon,
  hideCancel = false,
  width = 320,
  variant = 'info',
}: TRAlertDialogProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Smart stack for dynamic z-index
  const { overlayZIndex, contentZIndex } = useSmartStack({ enabled: open });

  // Focus trap, escape key, body scroll lock
  useEffect(() => {
    if (!open) return;

    // Store previous focus
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus first focusable element
    const focusableElements = contentRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }

    // Handle escape key and focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }

      if (e.key === 'Tab' && focusableElements?.length) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [open, onOpenChange]);

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const displayIcon = icon ?? DEFAULT_ICONS[variant];

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='fixed inset-0 bg-black/50'
            style={{ zIndex: overlayZIndex }}
            aria-hidden='true'
          />

          {/* Dialog */}
          <motion.div
            ref={contentRef}
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'bg-background border rounded-lg shadow-lg',
              'px-6 pt-8 pb-5',
            )}
            style={{
              width,
              maxWidth: width,
              boxSizing: 'border-box',
              zIndex: contentZIndex,
            }}
          >
            {/* Header */}
            <div className='flex flex-col gap-2 text-center items-center'>
              {displayIcon && (
                <motion.div
                  variants={iconVariants}
                  initial='hidden'
                  animate='visible'
                  className='mb-2'
                >
                  {displayIcon}
                </motion.div>
              )}

              <motion.div
                variants={contentVariants}
                initial='hidden'
                animate='visible'
              >
                <h2
                  id='alert-dialog-title'
                  className='text-lg font-semibold text-center'
                >
                  {title}
                </h2>
                <p
                  id='alert-dialog-description'
                  className='text-sm text-muted-foreground text-center leading-relaxed'
                >
                  {description}
                </p>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              variants={footerVariants}
              initial='hidden'
              animate='visible'
              className='flex flex-row gap-3 mt-4'
            >
              {extraButtons}
              {!hideCancel && (
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={loading}
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'flex-1',
                  )}
                >
                  {cancelText}
                </button>
              )}
              <RBtn
                onClick={onOk}
                loading={loading}
                variant={okVariant ?? 'default'}
                className='flex-1'
              >
                {okText}
              </RBtn>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default RAlertDialog;
