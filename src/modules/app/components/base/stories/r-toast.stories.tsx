import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomToast } from '../r-custom-toast';
import { Toaster } from '../r-toaster';
import { showToast } from '@/modules/app/libs/toast-utils';
import RBtn from '../r-btn';

const meta = {
  title: 'Components/Feedback/Toast',
  component: CustomToast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Toaster position='top-right' />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof CustomToast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Static display of CustomToast component
export const Default: Story = {
  args: {
    title: 'Default Toast',
    description: 'This is a toast message.',
    variant: 'default',
    toastId: 'demo-1',
    duration: 4000,
  },
  decorators: [
    (Story) => (
      <div className='w-[350px]'>
        <Story />
      </div>
    ),
  ],
};

export const Variants: Story = {
  render: () => (
    <div className='w-[350px] space-y-4'>
      <CustomToast
        title='Default'
        description='This is a default toast message.'
        variant='default'
        toastId='demo-default'
      />
      <CustomToast
        title='Success'
        description='Your action was completed successfully.'
        variant='success'
        toastId='demo-success'
      />
      <CustomToast
        title='Warning'
        description='Please review this warning message.'
        variant='warning'
        toastId='demo-warning'
      />
      <CustomToast
        title='Error'
        description='An error occurred while processing.'
        variant='error'
        toastId='demo-error'
      />
      <CustomToast
        title='Info'
        description='Here is some helpful information.'
        variant='info'
        toastId='demo-info'
      />
    </div>
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <div className='w-[350px] space-y-4'>
      <CustomToast title='Success!' variant='success' toastId='no-desc-1' />
      <CustomToast title='Warning!' variant='warning' toastId='no-desc-2' />
      <CustomToast title='Error!' variant='error' toastId='no-desc-3' />
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className='w-[350px]'>
      <CustomToast
        title='Long Content Toast'
        description='This is a much longer description that demonstrates how the toast handles multiple lines of text. The content will wrap appropriately and the toast will expand to accommodate the text.'
        variant='info'
        toastId='long-content'
      />
    </div>
  ),
};

// Interactive stories using showToast utility
export const InteractiveToasts: Story = {
  render: () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold mb-4'>
        Click buttons to trigger toasts
      </h3>
      <div className='flex flex-wrap gap-3'>
        <RBtn
          variant='outline'
          onClick={() =>
            showToast.default({
              title: 'Default Toast',
              description: 'This is a default notification.',
            })
          }
        >
          Default
        </RBtn>
        <RBtn
          variant='soft-success'
          onClick={() =>
            showToast.success({
              title: 'Success!',
              description: 'Your changes have been saved.',
            })
          }
        >
          Success
        </RBtn>
        <RBtn
          variant='soft-warning'
          onClick={() =>
            showToast.warning({
              title: 'Warning',
              description: 'This action may have consequences.',
            })
          }
        >
          Warning
        </RBtn>
        <RBtn
          variant='soft-destructive'
          onClick={() =>
            showToast.error({
              title: 'Error',
              description: 'Something went wrong. Please try again.',
            })
          }
        >
          Error
        </RBtn>
        <RBtn
          variant='soft-info'
          onClick={() =>
            showToast.info({
              title: 'Information',
              description: 'Here is some helpful information for you.',
            })
          }
        >
          Info
        </RBtn>
      </div>
    </div>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold mb-4'>Custom Duration Toasts</h3>
      <div className='flex flex-wrap gap-3'>
        <RBtn
          variant='outline'
          onClick={() =>
            showToast.info({
              title: 'Quick Toast',
              description: 'This disappears in 2 seconds.',
              duration: 2000,
            })
          }
        >
          2 seconds
        </RBtn>
        <RBtn
          variant='outline'
          onClick={() =>
            showToast.info({
              title: 'Normal Toast',
              description: 'This disappears in 4 seconds (default).',
              duration: 4000,
            })
          }
        >
          4 seconds
        </RBtn>
        <RBtn
          variant='outline'
          onClick={() =>
            showToast.info({
              title: 'Long Toast',
              description: 'This stays for 8 seconds.',
              duration: 8000,
            })
          }
        >
          8 seconds
        </RBtn>
      </div>
    </div>
  ),
};

export const MultipleToasts: Story = {
  render: () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold mb-4'>Stack Multiple Toasts</h3>
      <RBtn
        onClick={() => {
          showToast.success({
            title: 'Step 1 Complete',
            description: 'First task completed.',
          });
          setTimeout(() => {
            showToast.success({
              title: 'Step 2 Complete',
              description: 'Second task completed.',
            });
          }, 500);
          setTimeout(() => {
            showToast.success({
              title: 'All Done!',
              description: 'All tasks have been completed.',
            });
          }, 1000);
        }}
      >
        Trigger Multiple Toasts
      </RBtn>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>Real-World Use Cases</h3>

      <div className='space-y-3'>
        <h4 className='text-sm font-medium text-muted-foreground'>
          Form Actions
        </h4>
        <div className='flex flex-wrap gap-3'>
          <RBtn
            onClick={() =>
              showToast.success({
                title: 'Profile Updated',
                description: 'Your profile information has been saved.',
              })
            }
          >
            Save Profile
          </RBtn>
          <RBtn
            variant='outline'
            onClick={() =>
              showToast.info({
                title: 'Changes Discarded',
                description: 'Your unsaved changes have been discarded.',
              })
            }
          >
            Discard Changes
          </RBtn>
        </div>
      </div>

      <div className='space-y-3'>
        <h4 className='text-sm font-medium text-muted-foreground'>
          Authentication
        </h4>
        <div className='flex flex-wrap gap-3'>
          <RBtn
            variant='soft-success'
            onClick={() =>
              showToast.success({
                title: 'Welcome Back!',
                description: 'You have successfully logged in.',
              })
            }
          >
            Login Success
          </RBtn>
          <RBtn
            variant='soft-destructive'
            onClick={() =>
              showToast.error({
                title: 'Login Failed',
                description: 'Invalid email or password. Please try again.',
              })
            }
          >
            Login Failed
          </RBtn>
        </div>
      </div>

      <div className='space-y-3'>
        <h4 className='text-sm font-medium text-muted-foreground'>
          Data Operations
        </h4>
        <div className='flex flex-wrap gap-3'>
          <RBtn
            variant='soft-success'
            onClick={() =>
              showToast.success({
                title: 'Item Deleted',
                description: 'The item has been permanently removed.',
              })
            }
          >
            Delete Item
          </RBtn>
          <RBtn
            variant='soft-warning'
            onClick={() =>
              showToast.warning({
                title: 'Unsaved Changes',
                description: 'You have unsaved changes. Save before leaving?',
              })
            }
          >
            Navigate Away
          </RBtn>
        </div>
      </div>

      <div className='space-y-3'>
        <h4 className='text-sm font-medium text-muted-foreground'>
          Network Status
        </h4>
        <div className='flex flex-wrap gap-3'>
          <RBtn
            variant='soft-destructive'
            onClick={() =>
              showToast.error({
                title: 'Connection Lost',
                description: 'Please check your internet connection.',
              })
            }
          >
            Connection Error
          </RBtn>
          <RBtn
            variant='soft-success'
            onClick={() =>
              showToast.success({
                title: 'Reconnected',
                description: 'Your connection has been restored.',
              })
            }
          >
            Reconnected
          </RBtn>
        </div>
      </div>
    </div>
  ),
};

export const ProgressBar: Story = {
  render: () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold mb-4'>Toast with Progress Bar</h3>
      <p className='text-sm text-muted-foreground mb-4'>
        Each toast includes an animated progress bar showing remaining time.
      </p>
      <div className='w-[350px] space-y-4'>
        <CustomToast
          title='Watch the Progress'
          description='The progress bar shows how much time is left.'
          variant='info'
          toastId='progress-demo'
          duration={6000}
        />
      </div>
    </div>
  ),
};
