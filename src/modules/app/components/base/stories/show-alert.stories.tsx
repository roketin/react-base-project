import type { Meta, StoryObj } from '@storybook/react-vite';
import showAlert from '../show-alert';
import RBtn from '@/modules/app/components/base/r-btn';
import { AlertCircle, CheckCircle, Info, Trash2, LogOut } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Utilities/showAlert',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Imperative function to show alert/confirm dialogs. Returns callback with ok status, setLoading, and close functions.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const BasicAlert: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showAlert({
          type: 'alert',
          title: 'Information',
          description: 'This is a basic alert message.',
        })
      }
    >
      <Info size={16} className='mr-2' />
      Show Alert
    </RBtn>
  ),
};

export const ConfirmDialog: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showAlert(
          {
            type: 'confirm',
            title: 'Are you sure?',
            description: 'This action cannot be undone.',
          },
          ({ ok, close }) => {
            if (ok) {
              console.log('User confirmed');
            } else {
              console.log('User cancelled');
            }
            close();
          },
        )
      }
    >
      <AlertCircle size={16} className='mr-2' />
      Confirm Action
    </RBtn>
  ),
};

export const DeleteConfirmation: Story = {
  render: () => (
    <RBtn
      variant='destructive'
      onClick={() =>
        showAlert(
          {
            type: 'confirm',
            variant: 'error',
            title: 'Delete Item',
            description:
              'Are you sure you want to delete this item? This action cannot be undone.',
            okText: 'Delete',
            cancelText: 'Cancel',
          },
          ({ ok }) => {
            if (ok) {
              console.log('Item deleted');
            }
          },
        )
      }
    >
      <Trash2 size={16} className='mr-2' />
      Delete Item
    </RBtn>
  ),
};

export const SuccessAlert: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showAlert({
          type: 'alert',
          variant: 'success',
          title: 'Success!',
          description: 'Your changes have been saved successfully.',
          okText: 'Great',
        })
      }
    >
      <CheckCircle size={16} className='mr-2' />
      Show Success
    </RBtn>
  ),
};

export const WithAsyncLoading: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showAlert(
          {
            type: 'confirm',
            title: 'Sign Out',
            description: 'Are you sure you want to sign out?',
            okText: 'Sign Out',
            cancelText: 'Stay',
            manualClose: true,
          },
          ({ ok, setLoading, close }) => {
            if (ok) {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                close();
                console.log('Signed out');
              }, 2000);
            } else {
              close();
            }
          },
        )
      }
    >
      <LogOut size={16} className='mr-2' />
      Sign Out (with loading)
    </RBtn>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showAlert({
          type: 'alert',
          title: 'Wide Alert',
          description:
            'This alert has a custom width of 400px. You can customize the width to fit your content better.',
          width: 400,
        })
      }
    >
      Wide Alert
    </RBtn>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showAlert({
            type: 'alert',
            variant: 'info',
            title: 'Info',
            description: 'This is an info alert.',
          })
        }
      >
        Info
      </RBtn>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showAlert({
            type: 'alert',
            variant: 'success',
            title: 'Success',
            description: 'This is a success alert.',
          })
        }
      >
        Success
      </RBtn>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showAlert({
            type: 'alert',
            variant: 'warning',
            title: 'Warning',
            description: 'This is a warning alert.',
          })
        }
      >
        Warning
      </RBtn>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showAlert({
            type: 'alert',
            variant: 'error',
            title: 'Error',
            description: 'This is an error alert.',
          })
        }
      >
        Error
      </RBtn>
    </div>
  ),
};
