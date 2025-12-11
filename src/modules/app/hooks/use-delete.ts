import { useCallback, useState } from 'react';
import showAlert from '@/modules/app/components/base/show-alert';
import { showToast } from '@/modules/app/libs/toast-utils';

type TDeleteHelperOptions<T> = {
  /** Confirmation message shown in dialog */
  confirmationMessage?: string;
  /** Title for confirmation dialog */
  confirmationTitle?: string;
  /** Function to execute delete action, receives item id */
  deleteAction: (id: string) => Promise<unknown>;
  /** Callback after successful delete */
  onSuccessDeleteAction?: () => void;
  /** Callback after failed delete */
  onErrorDeleteAction?: (error: unknown) => void;
  /** Function to get id from item, defaults to item.id */
  getId?: (item: T) => string;
  /** Success title shown in toast */
  successTitle?: string;
  /** Success message shown in toast */
  successMessage?: string;
  /** Use popconfirm instead of alert dialog */
  usePopconfirm?: boolean;
};

/**
 * Hook to handle delete operation with confirmation dialog or popconfirm
 * @param options - Configuration options for delete helper
 * @returns Object with deleteItem function and popconfirm props
 */
export const useDeleteHelper = <T extends { id?: string | number }>(
  options: TDeleteHelperOptions<T>,
) => {
  const {
    confirmationMessage = 'Are you sure you want to delete this item?',
    confirmationTitle = 'Delete Confirmation',
    deleteAction,
    onSuccessDeleteAction,
    onErrorDeleteAction,
    getId = (item) => String(item.id),
    successTitle,
    successMessage = 'Data deleted successfully',
    usePopconfirm = false,
  } = options;

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteItem = useCallback(
    (item: T) => {
      if (usePopconfirm) {
        // For popconfirm, just return - actual deletion happens in getPopconfirmProps
        return;
      }

      showAlert(
        {
          type: 'confirm',
          title: confirmationTitle,
          description: confirmationMessage,
          variant: 'error',
          manualClose: true,
        },
        async ({ ok, setLoading, close }) => {
          if (!ok) {
            close();
            return;
          }

          setLoading(true);

          try {
            const id = getId(item);
            await deleteAction(id);

            showToast.success({
              title: successTitle,
              description: successMessage,
            });

            onSuccessDeleteAction?.();
            close();
          } catch (error) {
            onErrorDeleteAction?.(error);
            close();
          } finally {
            setLoading(false);
          }
        },
      );
    },
    [
      confirmationMessage,
      confirmationTitle,
      deleteAction,
      getId,
      onErrorDeleteAction,
      onSuccessDeleteAction,
      successTitle,
      successMessage,
      usePopconfirm,
    ],
  );

  const getPopconfirmProps = useCallback(
    (item: T) => ({
      title: confirmationTitle,
      description: confirmationMessage,
      loading: isDeleting,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const id = getId(item);
          await deleteAction(id);

          showToast.success({
            title: successTitle,
            description: successMessage,
          });

          onSuccessDeleteAction?.();
        } catch (error) {
          onErrorDeleteAction?.(error);
        } finally {
          setIsDeleting(false);
        }
      },
    }),
    [
      confirmationMessage,
      confirmationTitle,
      deleteAction,
      getId,
      isDeleting,
      onErrorDeleteAction,
      onSuccessDeleteAction,
      successTitle,
      successMessage,
    ],
  );

  return { deleteItem, getPopconfirmProps, isDeleting };
};
