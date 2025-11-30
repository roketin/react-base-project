import type { Meta, StoryObj } from '@storybook/react-vite';
import { RCheckbox } from '../r-checkbox';
import { useState } from 'react';

const meta = {
  title: 'Components/Form Controls/RCheckbox',
  component: RCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'I agree',
    checked: true,
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
    label: 'Subscribe to newsletter',
    helperText: 'You can unsubscribe at any time',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
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

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate state',
    indeterminate: true,
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
        <RCheckbox
          label='Toggle me'
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className='text-sm text-slate-600'>
          Status: {checked ? 'Checked' : 'Unchecked'}
        </p>
      </div>
    );
  },
};

export const MultipleCheckboxes: Story = {
  render: () => {
    const [options, setOptions] = useState({
      option1: false,
      option2: true,
      option3: false,
    });

    return (
      <div className='space-y-3'>
        <RCheckbox
          label='Option 1'
          checked={options.option1}
          onChange={(e) =>
            setOptions({ ...options, option1: e.target.checked })
          }
        />
        <RCheckbox
          label='Option 2'
          checked={options.option2}
          onChange={(e) =>
            setOptions({ ...options, option2: e.target.checked })
          }
        />
        <RCheckbox
          label='Option 3'
          checked={options.option3}
          onChange={(e) =>
            setOptions({ ...options, option3: e.target.checked })
          }
        />
      </div>
    );
  },
};
