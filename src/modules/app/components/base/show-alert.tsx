import type { TRAlertDialogProps } from '@/modules/app/components/base/r-alert-dialog';
import RAlertDialog from '@/modules/app/components/base/r-alert-dialog';
import { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';

export type TAlertConfirmationConfig = Omit<
  TRAlertDialogProps,
  'open' | 'onOpenChange' | 'onOk' | 'onCancel'
> & {
  manualClose?: boolean;
  type?: 'confirm' | 'alert';
};

export type TAlertConfirmationCallback = {
  ok: boolean;
  setLoading: (loading: boolean) => void;
  close: () => void;
};

const showAlert = (
  config: TAlertConfirmationConfig,
  callback?: (callback: TAlertConfirmationCallback) => void,
) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  /**
   * Clean up element
   */
  const cleanup = () => {
    root.unmount();
    div.remove();
  };

  /**
   * Alert component
   * @returns
   */
  const Component = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(true);
    const width = config.width ?? 280;

    const handleClose = useCallback(() => {
      setOpen(false);
      setTimeout(() => {
        cleanup();
      }, 300);
    }, []);

    const handleOk = useCallback(() => {
      if (!isLoading) {
        callback?.({
          ok: true,
          setLoading: setIsLoading,
          close: handleClose,
        });

        if (!config?.manualClose) {
          handleClose();
        }
      }
    }, [isLoading, handleClose]);

    const handleCancel = useCallback(() => {
      if (!isLoading) {
        callback?.({
          ok: false,
          setLoading: setIsLoading,
          close: handleClose,
        });

        if (!config?.manualClose) {
          handleClose();
        }
      }
    }, [isLoading, handleClose]);

    const defaultConfigByType = useMemo<Partial<TRAlertDialogProps>>(() => {
      if (config.type === 'alert') {
        return {
          hideCancel: true,
          okText: 'Ok',
          variant: 'info',
        };
      }

      if (config.type === 'confirm') {
        return {
          handleCancel: false,
          okText: 'Yes',
          cancelText: 'No',
          variant: 'confirm',
        };
      }

      return {};
    }, []);

    return (
      <RAlertDialog
        {...defaultConfigByType}
        {...config}
        open={open}
        loading={isLoading}
        width={width}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
        }}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    );
  };

  root.render(<Component />);
};

export default showAlert;
