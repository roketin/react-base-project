import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { RPanelHeader } from '@/modules/app/components/base/r-panel-header';

const meta: Meta<typeof RPanelHeader> = {
  title: 'Base/RPanelHeader',
  component: RPanelHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**RPanelHeader** is a flexible header component used for panel or drawer UIs.
It supports multiple actions (Close, Cancel, OK), optional icons, loading states, and visibility control.
`,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed in the panel header',
    },
    showClose: {
      control: 'boolean',
      description: 'Display the close button',
    },
    hideCancel: {
      control: 'boolean',
      description: 'Hide or show the cancel button',
    },
    hideOk: {
      control: 'boolean',
      description: 'Hide or show the ok button',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state on the Ok button',
    },
    onClose: { action: 'onClose' },
    onCancel: { action: 'onCancel' },
    onOk: { action: 'onOk' },
  },
};

export default meta;

type Story = StoryObj<typeof RPanelHeader>;

// ----------------------------------------------------------------------------
// 🧩 Default Example
// ----------------------------------------------------------------------------
export const Default: Story = {
  args: {
    title: 'Default Panel Header',
    onClose: () => alert('Close clicked'),
    onCancel: () => alert('Cancel clicked'),
    onOk: () => alert('Ok clicked'),
    showClose: true,
  },
};

// ----------------------------------------------------------------------------
// 🎨 Custom Buttons Example
// ----------------------------------------------------------------------------
export const CustomButtons: Story = {
  args: {
    title: 'Custom Buttons Example',
    onClose: () => alert('Exit clicked'),
    onCancel: () => alert('Go back'),
    onOk: () => alert('Proceed clicked'),
    showClose: true,
    closeButton: {
      label: 'Exit',
      icon: <X className='size-4' />,
      variant: 'destructive',
      size: 'sm',
    },
    cancelButton: {
      label: 'Back',
      icon: <ChevronLeft className='size-4' />,
      variant: 'outline',
      size: 'sm',
    },
    okButton: {
      label: 'Continue',
      icon: <ChevronRight className='size-4' />,
      variant: 'default',
      size: 'sm',
    },
  },
};

// ----------------------------------------------------------------------------
// 🚫 Hidden Buttons Example
// ----------------------------------------------------------------------------
export const HiddenButtons: Story = {
  args: {
    title: 'Header Without Some Buttons',
    showClose: false,
    hideCancel: true,
    hideOk: false,
    onOk: () => alert('Submit clicked'),
  },
};

// ----------------------------------------------------------------------------
// ⏳ Loading State Example
// ----------------------------------------------------------------------------
export const LoadingState: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(false);

    return (
      <div className='w-[460px] border rounded-lg shadow-sm bg-white'>
        <RPanelHeader
          {...args}
          showClose
          loading={loading}
          onOk={() => {
            setLoading(true);
            setTimeout(() => {
              alert('Saved successfully!');
              setLoading(false);
            }, 1500);
          }}
          onCancel={() => alert('Cancelled')}
          onClose={() => alert('Closed')}
        />
      </div>
    );
  },
  args: {
    title: 'Saving Changes...',
    showClose: true,
    okButton: {
      label: 'Save',
      icon: <Check className='size-4' />,
      loadingIcon: <Loader2 className='size-4 animate-spin' />,
    },
  },
};

// ----------------------------------------------------------------------------
// 🚫 Disabled Buttons Example
// ----------------------------------------------------------------------------
export const DisabledButtons: Story = {
  args: {
    title: 'All Buttons Disabled',
    onClose: () => {},
    onCancel: () => {},
    onOk: () => {},
    showClose: true,
    closeButton: { disabled: true },
    cancelButton: { disabled: true },
    okButton: { disabled: true },
  },
};

// ----------------------------------------------------------------------------
// 🔁 Dynamic Mode Switch Example
// ----------------------------------------------------------------------------
export const DynamicMode: Story = {
  render: (args) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const handleOk = () => {
      if (isEditMode) {
        alert('Data saved!');
        setIsEditMode(false);
      } else {
        setIsEditMode(true);
      }
    };

    return (
      <div className='w-[480px] border rounded-lg shadow bg-white'>
        <RPanelHeader
          {...args}
          title={isEditMode ? 'Edit Mode' : 'View Mode'}
          onOk={handleOk}
          onCancel={() => setIsEditMode(false)}
          showClose
          okButton={{
            label: isEditMode ? 'Save' : 'Edit',
            icon: isEditMode ? (
              <Check className='size-4' />
            ) : (
              <ChevronRight className='size-4' />
            ),
            variant: isEditMode ? 'default' : 'outline',
          }}
          cancelButton={{
            label: 'Cancel',
            icon: <ChevronLeft className='size-4' />,
            disabled: !isEditMode,
          }}
          closeButton={{
            label: 'Close',
            icon: <X className='size-4' />,
          }}
        />
        <div className='p-4 text-sm text-gray-600'>
          {isEditMode
            ? 'You are now editing the data. Click Save to confirm changes.'
            : 'This is view mode. Click Edit to make changes.'}
        </div>
      </div>
    );
  },
  args: {
    title: 'Dynamic State Header',
  },
};
