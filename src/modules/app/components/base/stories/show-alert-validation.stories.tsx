import type { Meta, StoryObj } from '@storybook/react-vite';
import { showAlertValidation } from '../show-alert-validation';
import RBtn from '@/modules/app/components/base/r-btn';
import { AlertTriangle } from 'lucide-react';
import type { FieldErrors } from 'react-hook-form';

const meta: Meta = {
  title: 'Components/Utilities/showAlertValidation',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Utility function to display form validation errors in an alert dialog. Accepts react-hook-form FieldErrors object.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const singleError: FieldErrors = {
  email: { type: 'required', message: 'Email is required' },
};

const multipleErrors: FieldErrors = {
  name: { type: 'required', message: 'Name is required' },
  email: { type: 'pattern', message: 'Please enter a valid email address' },
  password: {
    type: 'minLength',
    message: 'Password must be at least 8 characters',
  },
};

const nestedErrors: FieldErrors = {
  user: { type: 'validate', message: 'User validation failed' },
  'address.street': { type: 'required', message: 'Street address is required' },
  'address.city': { type: 'required', message: 'City is required' },
  'address.zipCode': {
    type: 'pattern',
    message: 'Please enter a valid zip code',
  },
};

const manyErrors: FieldErrors = {
  firstName: { type: 'required', message: 'First name is required' },
  lastName: { type: 'required', message: 'Last name is required' },
  email: { type: 'pattern', message: 'Invalid email format' },
  phone: { type: 'pattern', message: 'Invalid phone number' },
  age: { type: 'min', message: 'Age must be at least 18' },
  website: { type: 'pattern', message: 'Invalid URL format' },
};

export const SingleError: Story = {
  render: () => (
    <RBtn variant='outline' onClick={() => showAlertValidation(singleError)}>
      <AlertTriangle size={16} className='mr-2' />
      Show Single Error
    </RBtn>
  ),
};

export const MultipleErrors: Story = {
  render: () => (
    <RBtn variant='outline' onClick={() => showAlertValidation(multipleErrors)}>
      <AlertTriangle size={16} className='mr-2' />
      Show Multiple Errors
    </RBtn>
  ),
};

export const NestedErrors: Story = {
  render: () => (
    <RBtn variant='outline' onClick={() => showAlertValidation(nestedErrors)}>
      <AlertTriangle size={16} className='mr-2' />
      Show Nested Errors
    </RBtn>
  ),
};

export const ManyErrors: Story = {
  render: () => (
    <RBtn variant='outline' onClick={() => showAlertValidation(manyErrors)}>
      <AlertTriangle size={16} className='mr-2' />
      Show Many Errors
    </RBtn>
  ),
};

export const NoErrors: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() => {
        showAlertValidation({});
        console.log('No alert shown because there are no errors');
      }}
    >
      <AlertTriangle size={16} className='mr-2' />
      No Errors (nothing happens)
    </RBtn>
  ),
};

export const FormExample: Story = {
  render: () => {
    const simulateFormSubmit = () => {
      const errors: FieldErrors = {
        username: { type: 'required', message: 'Username is required' },
        email: {
          type: 'pattern',
          message: 'Please enter a valid email address',
        },
        password: {
          type: 'minLength',
          message: 'Password must be at least 8 characters',
        },
        confirmPassword: {
          type: 'validate',
          message: 'Passwords do not match',
        },
      };
      showAlertValidation(errors);
    };

    return (
      <div className='space-y-4 p-4 border rounded-lg w-80'>
        <h3 className='font-medium'>Registration Form</h3>
        <div className='space-y-2'>
          <input
            type='text'
            placeholder='Username'
            className='w-full px-3 py-2 border rounded-md text-sm'
          />
          <input
            type='email'
            placeholder='Email'
            className='w-full px-3 py-2 border rounded-md text-sm'
          />
          <input
            type='password'
            placeholder='Password'
            className='w-full px-3 py-2 border rounded-md text-sm'
          />
          <input
            type='password'
            placeholder='Confirm Password'
            className='w-full px-3 py-2 border rounded-md text-sm'
          />
        </div>
        <RBtn variant='default' className='w-full' onClick={simulateFormSubmit}>
          Submit (will show errors)
        </RBtn>
      </div>
    );
  },
};
