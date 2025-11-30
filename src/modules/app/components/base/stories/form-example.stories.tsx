import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import RBtn from '../r-btn';
import { RInput } from '../r-input';
import { RTextarea } from '../r-textarea';
import { RCheckbox } from '../r-checkbox';
import { RRadioGroup, RRadio } from '../r-radio-group';
import { Mail, User, Lock } from 'lucide-react';

const FormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    plan: 'free',
    newsletter: false,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
      console.log(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow'
    >
      <h2 className='text-2xl font-bold text-slate-900'>Sign Up</h2>

      <RInput
        label='Full Name'
        placeholder='John Doe'
        leftIcon={<User className='h-4 w-4' />}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        fullWidth
      />

      <RInput
        label='Email'
        type='email'
        placeholder='john@example.com'
        leftIcon={<Mail className='h-4 w-4' />}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        fullWidth
      />

      <RInput
        label='Password'
        type='password'
        placeholder='Enter password'
        leftIcon={<Lock className='h-4 w-4' />}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        helperText='Must be at least 8 characters'
        fullWidth
      />

      <RTextarea
        label='Bio'
        placeholder='Tell us about yourself...'
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        helperText='Optional'
        fullWidth
      />

      <RRadioGroup
        name='plan'
        label='Choose a plan'
        value={formData.plan}
        onChange={(value) => setFormData({ ...formData, plan: value })}
      >
        <RRadio
          value='free'
          label='Free'
          description='Perfect for personal projects'
        />
        <RRadio value='pro' label='Pro' description='Best for professionals' />
        <RRadio
          value='enterprise'
          label='Enterprise'
          description='For large organizations'
        />
      </RRadioGroup>

      <div className='space-y-3'>
        <RCheckbox
          label='Subscribe to newsletter'
          checked={formData.newsletter}
          onChange={(e) =>
            setFormData({ ...formData, newsletter: e.target.checked })
          }
        />

        <RCheckbox
          label='I accept the terms and conditions'
          checked={formData.terms}
          onChange={(e) =>
            setFormData({ ...formData, terms: e.target.checked })
          }
          error={errors.terms}
        />
      </div>

      <RBtn type='submit' className='w-full'>
        Sign Up
      </RBtn>
    </form>
  );
};

const meta = {
  title: 'Examples/Form',
  component: FormExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteForm: Story = {};
