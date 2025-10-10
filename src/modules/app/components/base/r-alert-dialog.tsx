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
import { buttonVariants } from '@/modules/app/components/ui/variants/button-variants';
import type { TLoadable } from '@/modules/app/types/component.type';
import type { VariantProps } from 'class-variance-authority';
import RBtn from '@/modules/app/components/base/r-btn';

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
}: TRAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && <div>{icon}</div>}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='text-sm'>{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {extraButtons}
          {!hideCancel && (
            <AlertDialogCancel onClick={onCancel} disabled={loading}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <RBtn
            onClick={onOk}
            loading={loading}
            variant={okVariant ?? 'default'}
          >
            {okText}
          </RBtn>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RAlertDialog;
