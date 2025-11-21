import RAlertDialog from '@/modules/app/components/base/r-alert-dialog';
import RBtn from '@/modules/app/components/base/r-btn';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircle, Trash2 } from 'lucide-react';

const meta: Meta<typeof RAlertDialog> = {
  title: 'Base/RAlertDialog',
  component: RAlertDialog,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },

  // Define controls for the props
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    okVariant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'ghost',
        'info',
        'success',
        'warning',
        'error',
        'confirm',
      ],
    },
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'confirm'],
    },
    loading: { control: 'boolean' },
    hideCancel: { control: 'boolean' },
    // Mock functions for actions to appear in the Storybook Actions panel
    onOpenChange: { action: 'onOpenChange' },
    onOk: { action: 'onOk' },
    onCancel: { action: 'onCancel' },
    icon: { control: false }, // Hide icon control for better examples
    extraButtons: { control: false }, // Hide extraButtons control
  },
};

export default meta;

type Story = StoryObj<typeof RAlertDialog>;

/**
 * The standard confirmation dialog, open by default for demonstration.
 * In a real application, you would manage the `open` state.
 */
export const DefaultConfirmation: Story = {
  args: {
    open: true, // Render it open for the story
    title: 'Confirm Data Submission',
    description:
      'Are you sure you want to submit this data? This action cannot be undone.',
    okText: 'Proceed',
    okVariant: 'default',
    loading: false,
    hideCancel: false,
    variant: 'info',
  },
};

/**
 * A destructive action confirmation (e.g., deleting a record).
 * Uses a red button variant for emphasis and an icon for visual context.
 */
export const DestructiveAction: Story = {
  args: {
    open: true,
    title: 'Permanently Delete Item?',
    description: (
      <>
        This will **permanently delete** the selected item. All related data
        will be lost.
        <br />
        Please confirm your intent.
      </>
    ),
    okText: 'Delete',
    okVariant: 'destructive',
    variant: 'error',
    icon: <Trash2 className='h-6 w-6 text-red-600 mx-auto' />, // Icon above the title
  },
};

/**
 * An informational dialog that forces the user to acknowledge the message.
 * The 'Cancel' button is hidden, making the 'OK' button the only way to close.
 */
export const ForcedAcknowledgement: Story = {
  args: {
    open: true,
    title: 'System Maintenance Alert',
    description:
      'The system will be offline tonight from 12:00 AM to 3:00 AM for essential updates. Please save your work.',
    okText: 'Understood',
    okVariant: 'default',
    hideCancel: true, // Hides the cancel button
    variant: 'warning',
    icon: <AlertCircle className='h-6 w-6 text-yellow-500 mx-auto' />,
  },
};

/**
 * Demonstrates the loading state on the 'OK' button and custom buttons.
 */
export const LoadingState: Story = {
  args: {
    open: true,
    title: 'Processing Request',
    description:
      'Do you want to run the process in the background? The operation may take a few minutes.',
    okText: 'Run Now',
    okVariant: 'default',
    loading: true, // Sets the loading state
    cancelText: 'Cancel Operation', // The cancel button will be disabled
    variant: 'info',
    extraButtons: (
      // Demonstrating the extraButtons slot
      <RBtn variant='outline' className='mr-3'>
        Run in Background
      </RBtn>
    ),
  },
};
