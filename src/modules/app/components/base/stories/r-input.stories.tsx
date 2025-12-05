import type { Meta, StoryObj } from '@storybook/react-vite';
import { RInput } from '../r-input';
import { Mail, Search, User, Lock, Eye } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Inputs/RInput',
  component: RInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className='space-y-4'>
      <RInput
        size='xs'
        label='Extra Small (xs)'
        placeholder='Extra small input'
      />
      <RInput size='sm' label='Small (sm)' placeholder='Small input' />
      <RInput size='default' label='Default' placeholder='Default input' />
      <RInput size='lg' label='Large (lg)' placeholder='Large input' />
    </div>
  ),
};

export const SizesWithIcons: Story = {
  render: () => (
    <div className='space-y-4'>
      <RInput
        size='xs'
        label='Extra Small with Icon'
        placeholder='Search...'
        leftIcon={<Search className='h-3 w-3' />}
      />
      <RInput
        size='sm'
        label='Small with Icon'
        placeholder='Search...'
        leftIcon={<Search className='h-3.5 w-3.5' />}
      />
      <RInput
        size='default'
        label='Default with Icon'
        placeholder='Search...'
        leftIcon={<Search className='h-4 w-4' />}
      />
      <RInput
        size='lg'
        label='Large with Icon'
        placeholder='Search...'
        leftIcon={<Search className='h-5 w-5' />}
      />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    size: 'lg',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Username',
    value: 'john.doe',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters',
    placeholder: 'Enter password',
    size: 'sm',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
    size: 'lg',
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftIcon: <Search className='h-3 w-3' />,
    size: 'xs',
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    rightIcon: <Mail className='h-5 w-5' />,
    size: 'lg',
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    leftIcon: <User className='h-4 w-4' />,
    rightIcon: <Eye className='h-4 w-4' />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Cannot edit this',
    disabled: true,
    size: 'sm',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div className='space-y-4'>
      <RInput
        label='Text (xs)'
        type='text'
        placeholder='Text input'
        size='xs'
      />
      <RInput
        label='Email (sm)'
        type='email'
        placeholder='email@example.com'
        size='sm'
      />
      <RInput
        label='Password (default)'
        type='password'
        placeholder='Enter password'
      />
      <RInput
        label='Number (lg)'
        type='number'
        placeholder='Enter number'
        size='lg'
      />
      <RInput label='Date (sm)' type='date' size='sm' />
      <RInput label='Time (xs)' type='time' size='xs' />
      <RInput
        label='URL (lg)'
        type='url'
        placeholder='https://example.com'
        size='lg'
      />
      <RInput
        label='Tel (default)'
        type='tel'
        placeholder='+1 (555) 000-0000'
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='space-y-4'>
        <RInput
          label='Controlled Input'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Type something...'
        />
        <p className='text-sm text-slate-600'>
          Current value: {value || '(empty)'}
        </p>
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (value: string) => {
      if (!value) {
        setError('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError('Please enter a valid email');
      } else {
        setError('');
      }
    };

    return (
      <RInput
        label='Email with Validation'
        type='email'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        onBlur={() => validateEmail(email)}
        error={error}
        placeholder='Enter your email'
        leftIcon={<Mail className='h-4 w-4' />}
      />
    );
  },
};

export const SearchInput: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Search className='h-3 w-3' />,
    size: 'xs',
  },
};

export const LoginForm: Story = {
  render: () => (
    <div className='space-y-4'>
      <RInput
        label='Username'
        placeholder='Enter username'
        leftIcon={<User className='h-5 w-5' />}
        size='lg'
      />
      <RInput
        label='Password'
        type='password'
        placeholder='Enter password'
        leftIcon={<Lock className='h-5 w-5' />}
        size='lg'
      />
    </div>
  ),
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState('Clear me!');
    return (
      <div className='space-y-4'>
        <RInput
          label='Clearable Input'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Type something...'
          clearable
          onClear={() => console.log('Cleared!')}
        />
        <p className='text-sm text-slate-600'>
          Current value: {value || '(empty)'}
        </p>
      </div>
    );
  },
};

export const ClearableWithIcon: Story = {
  render: () => {
    const [value, setValue] = useState('Search query');
    return (
      <RInput
        label='Search with Clear'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Search...'
        leftIcon={<Search className='h-4 w-4' />}
        clearable
      />
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className='space-y-4'>
      <RInput label='Default' placeholder='Default state' />
      <RInput label='With Value' value='Some text' />
      <RInput
        label='With Helper'
        helperText='This is helper text'
        placeholder='Enter text'
      />
      <RInput
        label='With Error'
        error='This field has an error'
        value='Invalid value'
      />
      <RInput label='Disabled' disabled value='Disabled input' />
      <RInput
        label='With Left Icon'
        leftIcon={<Mail className='h-4 w-4' />}
        placeholder='Email'
      />
      <RInput
        label='With Right Icon'
        rightIcon={<Search className='h-4 w-4' />}
        placeholder='Search'
      />
      <RInput
        label='Clearable'
        defaultValue='Clear me'
        placeholder='Type something'
        clearable
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
