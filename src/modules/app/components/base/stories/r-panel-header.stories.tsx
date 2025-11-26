import type { Meta, StoryObj } from '@storybook/react-vite';
import { Save, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { RPanelHeader } from '../r-panel-header';

const meta: Meta<typeof RPanelHeader> = {
  title: 'Base/RPanelHeader',
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
