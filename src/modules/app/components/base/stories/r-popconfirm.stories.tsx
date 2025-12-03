import type { Meta, StoryObj } from '@storybook/react-vite';
import { RPopconfirm } from '../r-popconfirm';
import RBtn from '../r-btn';
import { Trash2, LogOut, Send, Settings } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Feedback/RPopconfirm',
  component: RPopconfirm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RPopconfirm>;

export default meta;
type Story = StoryObj<typeof RPopconfirm>;

export const Default: Story = {
  args: {
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    children: <RBtn>Click me</RBtn>,
  },
};

export const Variants: Story = {
  render: () => (
    <div className='flex gap-4'>
      <RPopconfirm
        variant='default'
        title='Confirm action?'
        description='Default variant'
      >
        <RBtn variant='outline'>Default</RBtn>
      </RPopconfirm>

      <RPopconfirm
        variant='info'
        title='Information'
        description='Info variant for informational confirmations'
      >
        <RBtn variant='soft-info'>Info</RBtn>
      </RPopconfirm>

      <RPopconfirm
        variant='warning'
        title='Warning'
        description='Warning variant for cautionary actions'
      >
        <RBtn variant='soft-warning'>Warning</RBtn>
      </RPopconfirm>

      <RPopconfirm
        variant='error'
        title='Danger'
        description='Error variant for destructive actions'
      >
        <RBtn variant='soft-destructive'>Error</RBtn>
      </RPopconfirm>
    </div>
  ),
};

export const DeleteConfirmation: Story = {
  render: () => (
    <RPopconfirm
      variant='error'
      title='Delete this item?'
      description='This action cannot be undone. The item will be permanently removed.'
      okText='Delete'
      cancelText='Cancel'
      onConfirm={() => console.log('Deleted!')}
    >
      <RBtn variant='destructive' iconStart={<Trash2 className='h-4 w-4' />}>
        Delete
      </RBtn>
    </RPopconfirm>
  ),
};

export const LogoutConfirmation: Story = {
  render: () => (
    <RPopconfirm
      variant='warning'
      title='Sign out?'
      description='You will need to sign in again to access your account.'
      okText='Sign out'
      cancelText='Stay'
      onConfirm={() => console.log('Logged out!')}
    >
      <RBtn variant='outline' iconStart={<LogOut className='h-4 w-4' />}>
        Sign out
      </RBtn>
    </RPopconfirm>
  ),
};

export const AsyncConfirmation: Story = {
  render: () => (
    <RPopconfirm
      variant='info'
      title='Send message?'
      description='The message will be sent to all recipients.'
      okText='Send'
      cancelText='Cancel'
      onConfirm={async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Message sent!');
      }}
    >
      <RBtn iconStart={<Send className='h-4 w-4' />}>Send Message</RBtn>
    </RPopconfirm>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className='grid grid-cols-3 gap-4 p-20'>
      <div />
      <RPopconfirm
        side='top'
        title='Top placement'
        description='Popover on top'
      >
        <RBtn variant='outline' className='w-full'>
          Top
        </RBtn>
      </RPopconfirm>
      <div />

      <RPopconfirm
        side='left'
        title='Left placement'
        description='Popover on left'
      >
        <RBtn variant='outline' className='w-full'>
          Left
        </RBtn>
      </RPopconfirm>
      <div />
      <RPopconfirm
        side='right'
        title='Right placement'
        description='Popover on right'
      >
        <RBtn variant='outline' className='w-full'>
          Right
        </RBtn>
      </RPopconfirm>

      <div />
      <RPopconfirm
        side='bottom'
        title='Bottom placement'
        description='Popover on bottom'
      >
        <RBtn variant='outline' className='w-full'>
          Bottom
        </RBtn>
      </RPopconfirm>
      <div />
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <RPopconfirm
      icon={null}
      title='Confirm action'
      description='This popconfirm has no icon.'
    >
      <RBtn variant='outline'>No Icon</RBtn>
    </RPopconfirm>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <div className='flex gap-4'>
      <RPopconfirm
        title='Narrow'
        description='This is a narrow popconfirm.'
        width={200}
      >
        <RBtn variant='outline'>Narrow (200px)</RBtn>
      </RPopconfirm>

      <RPopconfirm
        title='Wide popconfirm'
        description='This popconfirm has more width to accommodate longer content and descriptions.'
        width={400}
      >
        <RBtn variant='outline'>Wide (400px)</RBtn>
      </RPopconfirm>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className='flex gap-4 items-center'>
        <RPopconfirm
          open={open}
          onOpenChange={setOpen}
          title='Controlled popconfirm'
          description='This popconfirm is controlled externally.'
          onConfirm={() => console.log('Confirmed!')}
        >
          <RBtn>Open Popconfirm</RBtn>
        </RPopconfirm>

        <RBtn variant='outline' onClick={() => setOpen(!open)}>
          Toggle: {open ? 'Open' : 'Closed'}
        </RBtn>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RPopconfirm
      disabled
      title='This should not appear'
      description='The popconfirm is disabled.'
    >
      <RBtn variant='outline'>Disabled Popconfirm</RBtn>
    </RPopconfirm>
  ),
};

export const InTable: Story = {
  render: () => (
    <div className='border rounded-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-slate-50'>
          <tr>
            <th className='px-4 py-3 text-left text-sm font-medium'>Name</th>
            <th className='px-4 py-3 text-left text-sm font-medium'>Status</th>
            <th className='px-4 py-3 text-right text-sm font-medium'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {['John Doe', 'Jane Smith', 'Bob Wilson'].map((name, i) => (
            <tr key={i}>
              <td className='px-4 py-3 text-sm'>{name}</td>
              <td className='px-4 py-3 text-sm'>Active</td>
              <td className='px-4 py-3 text-right'>
                <div className='flex justify-end gap-2'>
                  <RPopconfirm
                    variant='warning'
                    title={`Edit ${name}?`}
                    description='You will be redirected to the edit page.'
                    okText='Edit'
                  >
                    <RBtn
                      size='sm'
                      variant='outline'
                      iconStart={<Settings className='h-3 w-3' />}
                    >
                      Edit
                    </RBtn>
                  </RPopconfirm>
                  <RPopconfirm
                    variant='error'
                    title={`Delete ${name}?`}
                    description='This action cannot be undone.'
                    okText='Delete'
                    onConfirm={() => console.log(`Deleted ${name}`)}
                  >
                    <RBtn
                      size='sm'
                      variant='soft-destructive'
                      iconStart={<Trash2 className='h-3 w-3' />}
                    >
                      Delete
                    </RBtn>
                  </RPopconfirm>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
