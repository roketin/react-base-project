import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/modules/app/components/ui/alert-dialog';

type TBaseAlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  okText?: string;
  cancelText?: string;
  okColor?: string;
  cancelColor?: string;
  onOk?: () => void;
  onCancel?: () => void;
  extraButtons?: React.ReactNode;
};

const BaseAlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  okText = 'OK',
  cancelText = 'Cancel',
  okColor,
  cancelColor,
  onOk,
  onCancel,
  extraButtons,
}: TBaseAlertDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        {extraButtons}
        <AlertDialogCancel
          className={cancelColor ? cancelColor : undefined}
          onClick={onCancel}
        >
          {cancelText}
        </AlertDialogCancel>
        <AlertDialogAction
          className={okColor ? okColor : undefined}
          onClick={onOk}
        >
          {okText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default BaseAlertDialog;
