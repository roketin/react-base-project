import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import RDialog from '../r-dialog';
import RAlertDialog from '../r-alert-dialog';
import { RInput } from '../r-input';
import { RTextarea } from '../r-textarea';
import RBtn from '@/modules/app/components/base/r-btn';

const meta: Meta<typeof RDialog> = {
  title: 'Components/Feedback/RDialog',
  component: RDialog,
  tags: ['autodocs'],
  args: {
    title: 'Invite collaborators',
    description:
      'Send an invitation to teammates so they can access this workspace.',
    trigger: <RBtn>Open dialog</RBtn>,
    footer: (
      <>
        <RBtn variant='ghost'>Cancel</RBtn>
        <RBtn>Send invite</RBtn>
      </>
    ),
    blurOverlay: true,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    alignFooter: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'apart'],
    },
    showCloseButton: {
      control: 'boolean',
    },
    hideHeader: {
      control: 'boolean',
    },
    hideFooter: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RDialog>;

export const Playground: Story = {
  render: (args) => (
    <RDialog {...args}>
      <div className='space-y-4'>
        <RInput placeholder='Name' />
        <RInput type='email' placeholder='Email address' />
        <RTextarea rows={3} placeholder='Optional message' />
      </div>
    </RDialog>
  ),
};

export const LargeDialog: Story = {
  args: {
    size: 'xl',
    alignFooter: 'apart',
  },
  render: (args) => (
    <RDialog {...args}>
      <div className='grid gap-6'>
        <section className='space-y-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
            Summary
          </h3>
          <p className='text-sm text-muted-foreground'>
            This dialog showcases the large layout variant. You can provide any
            custom content inside the body and control the footer alignment.
          </p>
        </section>

        <section className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-2 rounded-lg border border-border/60 bg-background/80 p-4'>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Invitations sent
            </p>
            <p className='text-2xl font-semibold'>12</p>
          </div>

          <div className='space-y-2 rounded-lg border border-border/60 bg-background/80 p-4'>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Pending approvals
            </p>
            <p className='text-2xl font-semibold'>3</p>
          </div>
        </section>
      </div>
    </RDialog>
  ),
};

/**
 * Demonstrates smart stack behavior - dialogs opened later appear on top
 * with dynamic z-index management.
 */
export const SmartStack: Story = {
  render: () => {
    const [dialog1Open, setDialog1Open] = useState(false);
    const [dialog2Open, setDialog2Open] = useState(false);
    const [dialog3Open, setDialog3Open] = useState(false);

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Click buttons in sequence to see smart stack in action. Each new
          dialog appears above the previous one.
        </p>

        <RBtn onClick={() => setDialog1Open(true)}>Open Dialog 1</RBtn>

        <RDialog
          open={dialog1Open}
          onOpenChange={setDialog1Open}
          title='Dialog 1 (First)'
          description='This is the first dialog. Open Dialog 2 to see it stack on top.'
          size='sm'
          footer={
            <div className='flex gap-2'>
              <RBtn variant='outline' onClick={() => setDialog1Open(false)}>
                Close
              </RBtn>
              <RBtn onClick={() => setDialog2Open(true)}>Open Dialog 2</RBtn>
            </div>
          }
        >
          <div className='p-4 bg-blue-50 dark:bg-blue-950 rounded-lg'>
            <p className='text-sm'>
              I am the base dialog. Notice how Dialog 2 will appear above me.
            </p>
          </div>
        </RDialog>

        <RDialog
          open={dialog2Open}
          onOpenChange={setDialog2Open}
          title='Dialog 2 (Second)'
          description='This dialog stacks on top of Dialog 1.'
          size='sm'
          footer={
            <div className='flex gap-2'>
              <RBtn variant='outline' onClick={() => setDialog2Open(false)}>
                Close
              </RBtn>
              <RBtn onClick={() => setDialog3Open(true)}>Open Dialog 3</RBtn>
            </div>
          }
        >
          <div className='p-4 bg-green-50 dark:bg-green-950 rounded-lg'>
            <p className='text-sm'>
              I am stacked above Dialog 1. Open Dialog 3 to add another layer.
            </p>
          </div>
        </RDialog>

        <RDialog
          open={dialog3Open}
          onOpenChange={setDialog3Open}
          title='Dialog 3 (Third)'
          description='The topmost dialog in the stack.'
          size='sm'
          footer={
            <RBtn variant='outline' onClick={() => setDialog3Open(false)}>
              Close
            </RBtn>
          }
        >
          <div className='p-4 bg-purple-50 dark:bg-purple-950 rounded-lg'>
            <p className='text-sm'>
              I am the topmost dialog! Close me to go back to Dialog 2.
            </p>
          </div>
        </RDialog>
      </div>
    );
  },
};

/**
 * Form dialog with confirmation - demonstrates smart stack with RAlertDialog.
 */
export const FormWithConfirmation: Story = {
  render: () => {
    const [formOpen, setFormOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [discardOpen, setDiscardOpen] = useState(false);

    const handleSave = () => {
      setConfirmOpen(true);
    };

    const handleConfirmSave = () => {
      setConfirmOpen(false);
      setSuccessOpen(true);
    };

    const handleSuccess = () => {
      setSuccessOpen(false);
      setFormOpen(false);
    };

    const handleCancel = () => {
      setDiscardOpen(true);
    };

    const handleDiscard = () => {
      setDiscardOpen(false);
      setFormOpen(false);
    };

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Complete form flow with confirmation dialogs. Try saving or canceling
          to see stacked alerts.
        </p>

        <RBtn onClick={() => setFormOpen(true)}>Create New User</RBtn>

        {/* Main Form Dialog */}
        <RDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title='Create New User'
          description='Fill in the details below to create a new user account.'
          size='md'
          preventCloseOnOverlay
          preventCloseOnEscape
          footer={
            <div className='flex gap-2'>
              <RBtn variant='outline' onClick={handleCancel}>
                Cancel
              </RBtn>
              <RBtn onClick={handleSave}>Save User</RBtn>
            </div>
          }
        >
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <RInput placeholder='First name' />
              <RInput placeholder='Last name' />
            </div>
            <RInput type='email' placeholder='Email address' />
            <RInput type='tel' placeholder='Phone number' />
            <RTextarea rows={3} placeholder='Notes (optional)' />
          </div>
        </RDialog>

        {/* Confirm Save */}
        <RAlertDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title='Save User?'
          description='Are you sure you want to create this user account?'
          variant='confirm'
          okText='Yes, Save'
          cancelText='Go Back'
          onOk={handleConfirmSave}
          onCancel={() => setConfirmOpen(false)}
        />

        {/* Success */}
        <RAlertDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title='User Created!'
          description='The new user account has been created successfully.'
          variant='success'
          okText='Done'
          hideCancel
          onOk={handleSuccess}
        />

        {/* Discard Confirmation */}
        <RAlertDialog
          open={discardOpen}
          onOpenChange={setDiscardOpen}
          title='Discard Changes?'
          description='You have unsaved changes. Are you sure you want to discard them?'
          variant='warning'
          okText='Discard'
          okVariant='destructive'
          cancelText='Keep Editing'
          onOk={handleDiscard}
          onCancel={() => setDiscardOpen(false)}
        />
      </div>
    );
  },
};

/**
 * Nested dialogs - dialog opening another dialog of the same type.
 */
export const NestedDialogs: Story = {
  render: () => {
    const [level1, setLevel1] = useState(false);
    const [level2, setLevel2] = useState(false);
    const [level3, setLevel3] = useState(false);
    const [level4, setLevel4] = useState(false);

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Deep nesting example - up to 4 levels of dialogs stacked.
        </p>

        <RBtn onClick={() => setLevel1(true)}>Open Level 1</RBtn>

        <RDialog
          open={level1}
          onOpenChange={setLevel1}
          title='Level 1 - Categories'
          description='Select a category to drill down.'
          size='md'
          footer={
            <RBtn variant='outline' onClick={() => setLevel1(false)}>
              Close
            </RBtn>
          }
        >
          <div className='space-y-2'>
            {['Electronics', 'Clothing', 'Books'].map((cat) => (
              <button
                key={cat}
                onClick={() => setLevel2(true)}
                className='w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors'
              >
                {cat}
              </button>
            ))}
          </div>
        </RDialog>

        <RDialog
          open={level2}
          onOpenChange={setLevel2}
          title='Level 2 - Subcategories'
          description='Select a subcategory.'
          size='md'
          footer={
            <RBtn variant='outline' onClick={() => setLevel2(false)}>
              Back
            </RBtn>
          }
        >
          <div className='space-y-2'>
            {['Phones', 'Laptops', 'Tablets'].map((sub) => (
              <button
                key={sub}
                onClick={() => setLevel3(true)}
                className='w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors'
              >
                {sub}
              </button>
            ))}
          </div>
        </RDialog>

        <RDialog
          open={level3}
          onOpenChange={setLevel3}
          title='Level 3 - Products'
          description='Select a product.'
          size='md'
          footer={
            <RBtn variant='outline' onClick={() => setLevel3(false)}>
              Back
            </RBtn>
          }
        >
          <div className='space-y-2'>
            {['iPhone 15', 'Samsung S24', 'Pixel 8'].map((prod) => (
              <button
                key={prod}
                onClick={() => setLevel4(true)}
                className='w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors'
              >
                {prod}
              </button>
            ))}
          </div>
        </RDialog>

        <RDialog
          open={level4}
          onOpenChange={setLevel4}
          title='Level 4 - Product Details'
          description='View product information.'
          size='sm'
          footer={
            <div className='flex gap-2'>
              <RBtn variant='outline' onClick={() => setLevel4(false)}>
                Back
              </RBtn>
              <RBtn
                onClick={() => {
                  setLevel4(false);
                  setLevel3(false);
                  setLevel2(false);
                  setLevel1(false);
                }}
              >
                Add to Cart
              </RBtn>
            </div>
          }
        >
          <div className='p-4 bg-muted rounded-lg text-center'>
            <p className='text-lg font-semibold'>iPhone 15</p>
            <p className='text-2xl font-bold text-primary mt-2'>$999</p>
            <p className='text-sm text-muted-foreground mt-2'>
              This is the deepest level of the dialog stack.
            </p>
          </div>
        </RDialog>
      </div>
    );
  },
};
