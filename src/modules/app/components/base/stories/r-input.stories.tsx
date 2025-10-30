import { useState } from 'react';
import { Mail, Search, ArrowRight, User } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RInput } from '../r-input';

const meta: Meta<typeof RInput> = {
  title: 'Base/Form/RInput',
  component: RInput,
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
    showCount: { control: 'boolean' },
    countLimit: { control: 'number' },
    countType: {
      control: 'inline-radio',
      options: ['character', 'word'],
    },
  },
  args: {
    label: 'Project name',
    placeholder: 'Enter project name',
    showCount: true,
    countLimit: 40,
    description: 'This will be visible to your teammates.',
    required: true,
    clearable: true,
    disabled: false,
    'aria-invalid': false,
    density: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof RInput>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('Initial draft');
    return (
      <RInput
        {...args}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          args.onChange?.(event);
        }}
        className='w-64'
      />
    );
  },
};

export const Sizes: Story = {
  args: {
    clearable: false,
    showCount: false,
    label: undefined,
    description: undefined,
  },
  render: (args) => (
    <div className='flex w-64 flex-col gap-4'>
      <RInput {...args} density='sm' placeholder='Small' label='Small' />
      <RInput
        {...args}
        density='default'
        placeholder='Default'
        label='Default'
      />
      <RInput {...args} density='lg' placeholder='Large' label='Large' />
      <RInput
        {...args}
        density='icon'
        aria-label='Icon input'
        label='Icon density'
        showCount={false}
        defaultValue='A'
      />
    </div>
  ),
};

export const WithPrepend: Story = {
  args: {
    prepend: <Mail size={16} className='text-muted-foreground' />,
    placeholder: 'email@example.com',
    label: 'Work email',
    className: 'w-72',
    description: 'We’ll send project updates to this address.',
  },
};

export const WithAppend: Story = {
  args: {
    append: <Search size={16} className='text-muted-foreground mr-2' />,
    placeholder: 'Search projects…',
    label: 'Search',
    className: 'w-72',
    clearable: false,
  },
};

export const WithPrependAndAppend: Story = {
  args: {
    prepend: <User size={16} className='text-muted-foreground' />,
    append: <ArrowRight size={16} className='text-muted-foreground mr-2' />,
    placeholder: 'Username',
    label: 'Assign to',
    className: 'w-72',
    clearable: false,
  },
};

export const CharacterCount: Story = {
  args: {
    label: 'Title',
    placeholder: 'Add a concise title',
    countType: 'character',
    showCount: true,
    countLimit: 100,
    description: 'Keep the title under 100 characters.',
    className: 'w-72',
  },
};

export const WordCount: Story = {
  args: {
    label: 'Slug',
    placeholder: 'marketing site',
    countType: 'word',
    showCount: true,
    defaultValue: 'marketing site',
    description: 'Words are counted to keep slugs short and readable.',
    className: 'w-72',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Cannot be changed',
    disabled: true,
    label: 'Disabled input',
    description: 'Users cannot interact with this field.',
    className: 'w-72',
  },
};

export const ErrorState: Story = {
  args: {
    value: 'Invalid input',
    'aria-invalid': true,
    label: 'API key',
    error: 'The key must follow the format sk_live_***',
    className: 'w-72',
  },
};
