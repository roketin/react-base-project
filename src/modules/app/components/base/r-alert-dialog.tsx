import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/modules/app/components/ui/alert-dialog';
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
  const defaultIconByVariant: Record<TRAlertVariant, React.ReactNode> = {
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        style={{ width, maxWidth: width, boxSizing: 'border-box' }}
        className='px-6 pt-8 pb-5'
      >
        <AnimatePresence mode='wait'>
          <AlertDialogHeader className='text-center items-center'>
            {(icon ?? defaultIconByVariant[variant]) && (
              <motion.div
                variants={iconVariants}
                initial='hidden'
                animate='visible'
                className='mb-2'
              >
                {icon ?? defaultIconByVariant[variant]}
              </motion.div>
            )}
            <motion.div
              variants={contentVariants}
              initial='hidden'
              animate='visible'
            >
              <AlertDialogTitle className='text-center'>
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className='text-sm text-center leading-relaxed'>
                  {description}
                </div>
              </AlertDialogDescription>
            </motion.div>
          </AlertDialogHeader>
          <motion.div
            variants={footerVariants}
            initial='hidden'
            animate='visible'
          >
            <AlertDialogFooter className='sm:flex-row flex-row gap-3 mt-2'>
              {extraButtons}
              {!hideCancel && (
                <AlertDialogCancel
                  onClick={onCancel}
                  disabled={loading}
                  className='flex-1 m-0'
                >
                  {cancelText}
                </AlertDialogCancel>
              )}
              <RBtn
                onClick={onOk}
                loading={loading}
                variant={okVariant ?? 'default'}
                className='flex-1'
              >
                {okText}
              </RBtn>
            </AlertDialogFooter>
          </motion.div>
        </AnimatePresence>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RAlertDialog;
