import { Input } from '@/modules/app/components/ui/input';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Base/Form/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    prepend: { control: false, description: 'ReactNode for prefix slot' },
    append: { control: false, description: 'ReactNode for suffix slot' },
    clearable: { control: 'boolean' },
    density: {
      control: 'radio',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean', description: 'Marks error state' },
    onChange: { action: 'onChange' },
  },
  args: {
    placeholder: 'Type here...',
    clearable: true,
    disabled: false,
    'aria-invalid': false,
    density: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

/**
 * Interactive story to demonstrate `onChange` and `clearable` button.
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('Text that can be cleared');

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e); // Trigger action in Storybook
        }}
        className='w-64'
      />
    );
  },
};

/**
 * Displays all available sizes (density).
 */
export const Sizes: Story = {
  render: (args) => (
    <div className='flex flex-col gap-4 w-64'>
      <Input {...args} density='sm' placeholder='Small (sm)' />
      <Input {...args} density='default' placeholder='Default' />
      <Input {...args} density='lg' placeholder='Large (lg)' />
      <Input {...args} density='icon' aria-label='Icon' value='?' />
    </div>
  ),
  args: {
    clearable: false, // Disable clearable for size demo
  },
};

/**
 * Demonstrates the `prepend` slot with an icon.
 */
export const WithPrepend: Story = {
  args: {
    prepend: <Mail size={16} className='text-gray-500' />,
    placeholder: 'email@example.com',
    className: 'w-64',
  },
};

/**
 * Demonstrates the `append` slot with an icon.
 */
export const WithAppend: Story = {
  args: {
    append: <Search size={16} className='text-gray-500 mr-2' />,
    placeholder: 'Search something...',
    className: 'w-64',
    clearable: false,
  },
};

/**
 * Uses both `prepend` and `append` slots simultaneously.
 */
export const WithPrependAndAppend: Story = {
  args: {
    prepend: <User size={16} className='text-gray-500' />,
    append: <ArrowRight size={16} className='text-gray-500 mr-2' />,
    placeholder: 'Username',
    className: 'w-64',
    clearable: false,
  },
};

/**
 * Demonstrates the `disabled` state.
 */
export const Disabled: Story = {
  args: {
    value: 'Cannot be changed',
    disabled: true,
    className: 'w-64',
  },
};

/**
 * Demonstrates the error state (`aria-invalid`).
 */
export const ErrorState: Story = {
  args: {
    value: 'Invalid input',
    'aria-invalid': true,
    className: 'w-64',
  },
};
