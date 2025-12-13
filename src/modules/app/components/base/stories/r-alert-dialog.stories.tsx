import { useState } from 'react';
import RAlertDialog from '@/modules/app/components/base/r-alert-dialog';
import RDialog from '@/modules/app/components/base/r-dialog';
import RBtn from '@/modules/app/components/base/r-btn';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircle, Trash2 } from 'lucide-react';

const meta: Meta<typeof RAlertDialog> = {
  title: 'Components/Feedback/RAlertDialog',
  component: RAlertDialog,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
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
    onOpenChange: { action: 'onOpenChange' },
    onOk: { action: 'onOk' },
    onCancel: { action: 'onCancel' },
    icon: { control: false },
    extraButtons: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof RAlertDialog>;

/**
 * The standard confirmation dialog, open by default for demonstration.
 */
export const DefaultConfirmation: Story = {
  args: {
    open: true,
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
 */
export const DestructiveAction: Story = {
  args: {
    open: true,
    title: 'Permanently Delete Item?',
    description: (
      <>
        This will <strong>permanently delete</strong> the selected item. All
        related data will be lost.
      </>
    ),
    okText: 'Delete',
    okVariant: 'destructive',
    variant: 'error',
    icon: <Trash2 className='h-16 w-16 text-destructive' />,
  },
};

/**
 * An informational dialog that forces the user to acknowledge the message.
 */
export const ForcedAcknowledgement: Story = {
  args: {
    open: true,
    title: 'System Maintenance Alert',
    description:
      'The system will be offline tonight from 12:00 AM to 3:00 AM for essential updates. Please save your work.',
    okText: 'Understood',
    okVariant: 'default',
    hideCancel: true,
    variant: 'warning',
    icon: <AlertCircle className='h-16 w-16 text-warning' />,
  },
};

/**
 * Demonstrates the loading state on the 'OK' button.
 */
export const LoadingState: Story = {
  args: {
    open: true,
    title: 'Processing Request',
    description:
      'Do you want to run the process in the background? The operation may take a few minutes.',
    okText: 'Run Now',
    okVariant: 'default',
    loading: true,
    cancelText: 'Cancel Operation',
    variant: 'info',
  },
};

/**
 * Smart stack with multiple RAlertDialogs stacked.
 */
export const SmartStackAlerts: Story = {
  render: () => {
    const [alert1, setAlert1] = useState(false);
    const [alert2, setAlert2] = useState(false);
    const [alert3, setAlert3] = useState(false);

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Multiple RAlertDialogs stacking on top of each other.
        </p>

        <RBtn onClick={() => setAlert1(true)}>Start Delete Flow</RBtn>

        <RAlertDialog
          open={alert1}
          onOpenChange={setAlert1}
          title='Delete Item?'
          description='This will move the item to trash.'
          variant='warning'
          okText='Move to Trash'
          cancelText='Cancel'
          onOk={() => setAlert2(true)}
          onCancel={() => setAlert1(false)}
        />

        <RAlertDialog
          open={alert2}
          onOpenChange={setAlert2}
          title='Permanently Delete?'
          description='Do you also want to permanently delete from trash?'
          variant='error'
          okText='Delete Forever'
          okVariant='destructive'
          cancelText='Keep in Trash'
          onOk={() => {
            setAlert2(false);
            setAlert3(true);
          }}
          onCancel={() => {
            setAlert2(false);
            setAlert1(false);
          }}
        />

        <RAlertDialog
          open={alert3}
          onOpenChange={setAlert3}
          title='Deleted!'
          description='The item has been permanently deleted.'
          variant='success'
          okText='Done'
          hideCancel
          onOk={() => {
            setAlert3(false);
            setAlert2(false);
            setAlert1(false);
          }}
        />
      </div>
    );
  },
};

/**
 * Smart stack with mixed RDialog and RAlertDialog.
 */
export const SmartStackMixed: Story = {
  render: () => {
    const [formOpen, setFormOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const handleSubmit = () => {
      setConfirmOpen(true);
    };

    const handleConfirm = () => {
      setConfirmOpen(false);
      // Simulate random error
      if (Math.random() > 0.5) {
        setErrorOpen(true);
      } else {
        setSuccessOpen(true);
      }
    };

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Mixed RDialog and RAlertDialog stacking. Submit form to see
          confirmation flow.
        </p>

        <RBtn onClick={() => setFormOpen(true)}>Open Form</RBtn>

        <RDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title='Contact Form'
          description='Send us a message.'
          size='sm'
          preventCloseOnOverlay
          footer={
            <div className='flex gap-2'>
              <RBtn variant='outline' onClick={() => setFormOpen(false)}>
                Cancel
              </RBtn>
              <RBtn onClick={handleSubmit}>Submit</RBtn>
            </div>
          }
        >
          <div className='space-y-3'>
            <input
              type='text'
              placeholder='Your name'
              className='w-full px-3 py-2 border rounded-md bg-background'
            />
            <input
              type='email'
              placeholder='Email'
              className='w-full px-3 py-2 border rounded-md bg-background'
            />
            <textarea
              placeholder='Message'
              rows={3}
              className='w-full px-3 py-2 border rounded-md bg-background resize-none'
            />
          </div>
        </RDialog>

        <RAlertDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title='Send Message?'
          description='Your message will be sent to our support team.'
          variant='confirm'
          okText='Send'
          cancelText='Review'
          onOk={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
        />

        <RAlertDialog
          open={errorOpen}
          onOpenChange={setErrorOpen}
          title='Failed to Send'
          description='There was an error sending your message. Please try again.'
          variant='error'
          okText='Try Again'
          cancelText='Cancel'
          onOk={() => {
            setErrorOpen(false);
            setConfirmOpen(true);
          }}
          onCancel={() => {
            setErrorOpen(false);
            setFormOpen(false);
          }}
        />

        <RAlertDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title='Message Sent!'
          description='We will get back to you within 24 hours.'
          variant='success'
          okText='Great!'
          hideCancel
          onOk={() => {
            setSuccessOpen(false);
            setFormOpen(false);
          }}
        />
      </div>
    );
  },
};

/**
 * Chained confirmations - multiple steps requiring confirmation.
 */
export const ChainedConfirmations: Story = {
  render: () => {
    const [step1, setStep1] = useState(false);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);
    const [final, setFinal] = useState(false);

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Multi-step confirmation flow. Each step stacks on top of the previous.
        </p>

        <RBtn variant='destructive' onClick={() => setStep1(true)}>
          Delete Account
        </RBtn>

        <RAlertDialog
          open={step1}
          onOpenChange={setStep1}
          title='Step 1: Confirm Identity'
          description='Are you sure you want to delete your account? This will remove all your data.'
          variant='warning'
          okText='Continue'
          cancelText='Cancel'
          onOk={() => setStep2(true)}
          onCancel={() => setStep1(false)}
        />

        <RAlertDialog
          open={step2}
          onOpenChange={setStep2}
          title='Step 2: Backup Data'
          description='Would you like to download a backup of your data before deletion?'
          variant='info'
          okText='Skip Backup'
          cancelText='Download Backup'
          onOk={() => setStep3(true)}
          onCancel={() => {
            // Simulate download
            setStep3(true);
          }}
        />

        <RAlertDialog
          open={step3}
          onOpenChange={setStep3}
          title='Step 3: Final Confirmation'
          description='This action is IRREVERSIBLE. Type "DELETE" to confirm.'
          variant='error'
          okText='Delete My Account'
          okVariant='destructive'
          cancelText='Go Back'
          onOk={() => {
            setStep3(false);
            setStep2(false);
            setStep1(false);
            setFinal(true);
          }}
          onCancel={() => setStep3(false)}
        />

        <RAlertDialog
          open={final}
          onOpenChange={setFinal}
          title='Account Deleted'
          description='Your account has been permanently deleted. We are sorry to see you go.'
          variant='success'
          okText='Goodbye'
          hideCancel
          onOk={() => setFinal(false)}
        />
      </div>
    );
  },
};
