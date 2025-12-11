export type TSharedDialogProps = {
  open: boolean;
  initialValues?: string;
  onClose?: () => void;
  onSuccess?: () => void;
};
