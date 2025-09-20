import type { TBaseAlertDialogProps } from '@/modules/app/components/base/base-alert-dialog';
import BaseAlertDialog from '@/modules/app/components/base/base-alert-dialog';
import { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';

type TAlertConfirmationConfig = Omit<
  TBaseAlertDialogProps,
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

    const handleOk = useCallback(() => {
      if (!isLoading) {
        callback?.({
          ok: true,
          setLoading: setIsLoading,
          close: cleanup,
        });

        if (!config?.manualClose) {
          cleanup();
        }
      }
    }, [isLoading]);

    const handleCancel = useCallback(() => {
      if (!isLoading) {
        callback?.({
          ok: false,
          setLoading: setIsLoading,
          close: cleanup,
        });

        if (!config?.manualClose) {
          cleanup();
        }
      }
    }, [isLoading]);

    const defaultConfigByType = useMemo<Partial<TBaseAlertDialogProps>>(() => {
      if (config.type === 'alert') {
        return {
          hideCancel: true,
          okText: 'Ok',
        };
      }

      if (config.type === 'confirm') {
        return {
          handleCancel: false,
          okText: 'Yes',
          cancelText: 'No',
        };
      }

      return {};
    }, []);

    return (
      <BaseAlertDialog
        {...defaultConfigByType}
        {...config}
        open={true}
        loading={isLoading}
        onOpenChange={() => {}}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    );
  };

  root.render(<Component />);
};

export default showAlert;
