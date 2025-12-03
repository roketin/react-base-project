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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        style={{ width, maxWidth: width, boxSizing: 'border-box' }}
        className='p-8'
      >
        <AlertDialogHeader className='text-center items-center'>
          {(icon ?? defaultIconByVariant[variant]) && (
            <div className='mb-2'>{icon ?? defaultIconByVariant[variant]}</div>
          )}
          <AlertDialogTitle className='text-center'>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='text-sm text-center leading-relaxed'>
              {description}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
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
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RAlertDialog;
