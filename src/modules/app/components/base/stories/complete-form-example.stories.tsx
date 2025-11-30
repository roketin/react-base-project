import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import RBtn from '../r-btn';
import { RInput } from '../r-input';
import { RTextarea } from '../r-textarea';
import { RCheckbox } from '../r-checkbox';
import { RRadioGroup, RRadio } from '../r-radio-group';
import { Mail, User, Lock, Send, X } from 'lucide-react';

const CompleteFormExample = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      alert('Form submitted successfully!');
      console.log(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      bio: '',
      plan: 'free',
      newsletter: false,
      terms: false,
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-2xl space-y-6 p-8 bg-white rounded-lg shadow-lg'
    >
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold text-slate-900'>Create Account</h2>
        <p className='text-slate-600'>
          Fill in the form below to create your account
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
      </div>

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
        helperText='Optional - Maximum 500 characters'
        fullWidth
        rows={4}
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
        <RRadio
          value='pro'
          label='Pro - $9/month'
          description='Best for professionals'
        />
        <RRadio
          value='enterprise'
          label='Enterprise - Custom pricing'
          description='For large organizations'
        />
      </RRadioGroup>

      <div className='space-y-3 pt-2'>
        <RCheckbox
          label='Subscribe to newsletter'
          checked={formData.newsletter}
          onChange={(e) =>
            setFormData({ ...formData, newsletter: e.target.checked })
          }
          helperText='Get updates about new features and promotions'
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

      <div className='flex gap-3 pt-4'>
        <RBtn
          type='submit'
          variant='default'
          className='flex-1'
          loading={isSubmitting}
          loadingLabel='Creating account...'
          iconStart={!isSubmitting ? <Send className='h-4 w-4' /> : undefined}
        >
          Create Account
        </RBtn>

        <RBtn
          type='button'
          variant='outline'
          onClick={handleReset}
          disabled={isSubmitting}
          iconStart={<X className='h-4 w-4' />}
        >
          Reset
        </RBtn>
      </div>

      <div className='flex gap-2 pt-2'>
        <RBtn type='button' variant='soft-info' size='sm'>
          Info
        </RBtn>
        <RBtn type='button' variant='soft-success' size='sm'>
          Success
        </RBtn>
        <RBtn type='button' variant='soft-warning' size='sm'>
          Warning
        </RBtn>
        <RBtn type='button' variant='soft-error' size='sm'>
          Error
        </RBtn>
      </div>
    </form>
  );
};

const meta = {
  title: 'Examples/CompleteForm',
  component: CompleteFormExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CompleteFormExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
