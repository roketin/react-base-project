import type { Meta, StoryObj } from '@storybook/react-vite';
import { RSwitch } from '../r-switch';
import { useState } from 'react';

const meta = {
  title: 'Components/Form Controls/RSwitch',
  component: RSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

export const Checked: Story = {
  args: {
    label: 'Enabled',
    checked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Marketing emails',
    description: 'Receive emails about new products and features',
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Dark mode',
    helperText: 'Toggle between light and dark theme',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled switch',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    checked: true,
  },
};

export const WithoutLabel: Story = {
  args: {},
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className='space-y-4'>
        <RSwitch
          label='Toggle me'
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p className='text-sm text-slate-600'>
          Status: {checked ? 'On' : 'Off'}
        </p>
      </div>
    );
  },
};

export const CustomValues: Story = {
  render: () => {
    const [status, setStatus] = useState<'active' | 'inactive'>('inactive');
    return (
      <div className='space-y-4'>
        <RSwitch
          label='Account status'
          description='Toggle between active and inactive'
          value={status}
          onValueChange={setStatus}
          trueValue='active'
          falseValue='inactive'
        />
        <p className='text-sm text-slate-600'>Current status: {status}</p>
      </div>
    );
  },
};

export const NumericValues: Story = {
  render: () => {
    const [value, setValue] = useState<1 | 0>(0);
    return (
      <div className='space-y-4'>
        <RSwitch
          label='Numeric toggle'
          description='Toggle between 1 and 0'
          value={value}
          onValueChange={setValue}
          trueValue={1}
          falseValue={0}
        />
        <p className='text-sm text-slate-600'>Current value: {value}</p>
      </div>
    );
  },
};

export const MultipleSwitches: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      marketing: false,
      updates: true,
    });

    return (
      <div className='space-y-4 w-80'>
        <h3 className='text-lg font-semibold'>Notification Settings</h3>
        <RSwitch
          label='Push notifications'
          description='Receive push notifications on your device'
          checked={settings.notifications}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, notifications: checked })
          }
        />
        <RSwitch
          label='Marketing emails'
          description='Receive emails about new products'
          checked={settings.marketing}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, marketing: checked })
          }
        />
        <RSwitch
          label='Product updates'
          description='Get notified about product updates'
          checked={settings.updates}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, updates: checked })
          }
        />
      </div>
    );
  },
};

export const InForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      newsletter: false,
      terms: false,
      privacy: false,
    });

    return (
      <form className='space-y-4 w-80'>
        <h3 className='text-lg font-semibold'>Sign Up</h3>
        <RSwitch
          label='Subscribe to newsletter'
          checked={formData.newsletter}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, newsletter: checked })
          }
        />
        <RSwitch
          label='Accept terms and conditions'
          checked={formData.terms}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, terms: checked })
          }
          error={!formData.terms ? 'Required' : undefined}
        />
        <RSwitch
          label='Accept privacy policy'
          checked={formData.privacy}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, privacy: checked })
          }
          error={!formData.privacy ? 'Required' : undefined}
        />
      </form>
    );
  },
};
