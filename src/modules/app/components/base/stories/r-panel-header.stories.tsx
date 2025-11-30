import type { Meta, StoryObj } from '@storybook/react-vite';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { RPanelHeader } from '../r-panel-header';
import RBtn from '../r-btn';

const meta: Meta<typeof RPanelHeader> = {
  title: 'Components/Layout/RPanelHeader',
  component: RPanelHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    showClose: { control: 'boolean' },
    showCancel: { control: 'boolean' },
    showOk: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    title: 'Panel Title',
    showClose: false,
    showCancel: false,
    showOk: false,
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof RPanelHeader>;

export const Default: Story = {
  args: {
    title: 'Default Header',
  },
};

export const WithClose: Story = {
  args: {
    title: 'Header with Close Button',
    showClose: true,
    onClose: () => alert('Close clicked'),
  },
};

export const WithOk: Story = {
  args: {
    title: 'Header with Ok Button',
    showOk: true,
    onOk: () => alert('Ok clicked'),
  },
};

export const WithCancel: Story = {
  args: {
    title: 'Header with Cancel Button',
    showCancel: true,
    onCancel: () => alert('Cancel clicked'),
  },
};

export const WithAllButtons: Story = {
  args: {
    title: 'Header with All Buttons',
    showClose: true,
    showCancel: true,
    showOk: true,
    onClose: () => alert('Close clicked'),
    onCancel: () => alert('Cancel clicked'),
    onOk: () => alert('Ok clicked'),
  },
};

export const CustomOkButton: Story = {
  args: {
    title: 'Custom Ok Button',
    showOk: true,
    okButton: {
      label: 'Save',
      icon: <Save className='size-4' />,
      iconPlacement: 'start',
    },
    onOk: () => alert('Save clicked'),
  },
};

export const CustomCancelButton: Story = {
  args: {
    title: 'Custom Cancel Button',
    showCancel: true,
    cancelButton: {
      label: 'Back',
      icon: <ArrowLeft className='size-4' />,
      iconPlacement: 'start',
    },
    onCancel: () => alert('Back clicked'),
  },
};

export const CustomCloseButton: Story = {
  args: {
    title: 'Custom Close Button',
    showClose: true,
    closeButton: {
      label: 'Exit',
      size: 'default',
    },
    onClose: () => alert('Exit clicked'),
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading State',
    showOk: true,
    showCancel: true,
    loading: true,
    okButton: {
      label: 'Saving...',
    },
    onOk: () => alert('Ok clicked'),
    onCancel: () => alert('Cancel clicked'),
  },
};

export const WithCustomClassName: Story = {
  args: {
    title: 'Custom Styled Header',
    showClose: true,
    showOk: true,
    className: 'mb-0 pt-0 border-blue-200',
    onClose: () => alert('Close clicked'),
    onOk: () => alert('Ok clicked'),
  },
};

export const WithCustomActions: Story = {
  args: {
    title: 'Header with Custom Actions',
    showClose: true,
    onClose: () => alert('Close clicked'),
    actions: (
      <div className='flex items-center gap-2'>
        <RBtn variant='outline' iconStart={<Eye className='size-4' />}>
          View
        </RBtn>
        <RBtn variant='outline'>Cancel</RBtn>
        <RBtn iconEnd={<Save className='size-4' />}>Save</RBtn>
      </div>
    ),
  },
};

export const Sticky: Story = {
  args: {
    title: 'Sticky Header',
    showClose: true,
    showOk: true,
    sticky: true,
    stickyOffset: 0,
    stickyClassName: 'shadow-lg',
    onClose: () => alert('Close clicked'),
    onOk: () => alert('Ok clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ height: '150vh', paddingTop: '20px' }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#f0f0f0',
          }}
        >
          Scroll down to see sticky behavior with shadow
        </div>
        <Story />
        <div
          style={{ marginTop: '50vh', padding: '10px', background: '#f0f0f0' }}
        >
          End of content
        </div>
      </div>
    ),
  ],
};

export const StickyWithCustomClass: Story = {
  args: {
    title: 'Sticky with Custom Styling',
    showClose: true,
    sticky: true,
    stickyOffset: 0,
    stickyClassName: 'shadow-2xl bg-blue-50 border-b-2 border-blue-500',
    actions: (
      <div className='flex items-center gap-2'>
        <RBtn variant='outline'>Cancel</RBtn>
        <RBtn>Save</RBtn>
      </div>
    ),
    onClose: () => alert('Close clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ height: '150vh', paddingTop: '20px' }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#f0f0f0',
          }}
        >
          Scroll to see custom sticky styling (blue background + shadow)
        </div>
        <Story />
        <div
          style={{ marginTop: '50vh', padding: '10px', background: '#f0f0f0' }}
        >
          End of content
        </div>
      </div>
    ),
  ],
};

export const Responsive: Story = {
  args: {
    title: 'Responsive Header',
    showClose: true,
    responsive: true,
    onClose: () => alert('Close clicked'),
    actions: (
      <div className='flex items-center gap-2'>
        <RBtn variant='outline' iconStart={<Eye className='size-4' />}>
          View
        </RBtn>
        <RBtn variant='outline'>Cancel</RBtn>
        <RBtn iconEnd={<Save className='size-4' />}>Save</RBtn>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const ResponsiveSticky: Story = {
  args: {
    title: 'Responsive Sticky Header',
    showClose: true,
    sticky: true,
    stickyOffset: 0,
    responsive: true,
    stickyClassName: 'shadow-lg',
    onClose: () => alert('Close clicked'),
    actions: (
      <div className='flex items-center gap-2'>
        <RBtn variant='outline' iconStart={<Eye className='size-4' />}>
          View
        </RBtn>
        <RBtn variant='outline'>Cancel</RBtn>
        <RBtn iconEnd={<Save className='size-4' />}>Save</RBtn>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: '150vh', paddingTop: '20px' }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#f0f0f0',
          }}
        >
          Resize window to mobile size to see dropdown menu. Scroll to see
          sticky behavior.
        </div>
        <Story />
        <div
          style={{ marginTop: '50vh', padding: '10px', background: '#f0f0f0' }}
        >
          End of content
        </div>
      </div>
    ),
  ],
};
