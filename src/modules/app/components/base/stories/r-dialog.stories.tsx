import type { Meta, StoryObj } from '@storybook/react-vite';
import RDialog from '../r-dialog';
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
