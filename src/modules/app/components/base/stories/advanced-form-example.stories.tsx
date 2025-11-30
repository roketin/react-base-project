import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Yup from '@/plugins/yup';
import RBtn from '../r-btn';
import RForm from '../r-form';
import { RFormField } from '../r-form-field';
import { RFormFieldSet } from '../r-form-fieldset';
import { RInput } from '../r-input';
import { RTextarea } from '../r-textarea';
import { RSwitch } from '../r-switch';
import RSelect from '../r-select';
import { RFormDatePicker } from '../r-picker';
import { RPanelHeader } from '../r-panel-header';
import { RAnchor } from '../r-anchor';
import RStickyWrapper from '../r-sticky-wrapper';
import { Mail, User, Lock, Save, Eye } from 'lucide-react';

// Form Schema
const formSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().required().label('First Name'),
  lastName: Yup.string().required().label('Last Name'),
  email: Yup.string().email().required().label('Email'),
  phone: Yup.string().required().label('Phone'),
  dateOfBirth: Yup.date()
    .nullable()
    .default(null)
    .required()
    .label('Date of Birth'),

  // Account Settings
  username: Yup.string().required().min(3).label('Username'),
  password: Yup.string().required().min(8).label('Password'),
  role: Yup.string().required().label('Role'),

  // Preferences
  bio: Yup.string().default('').max(500).label('Bio'),
  newsletter: Yup.boolean().default(false).label('Newsletter'),
  notifications: Yup.boolean().default(true).label('Notifications'),
  status: Yup.boolean().default(true).label('Active Status'),
});

type FormSchema = Yup.InferType<typeof formSchema>;

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' },
];

const AdvancedFormExample = () => {
  const form = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: null,
      username: '',
      password: '',
      role: '',
      bio: '',
      newsletter: false,
      notifications: true,
      status: true,
    },
  });

  const handleSubmit = (values: FormSchema) => {
    console.log('Form values:', values);
    alert('Form submitted! Check console for values.');
  };

  const anchorItems = [
    { key: 'personal', href: '#personal', title: 'Personal Info' },
    { key: 'account', href: '#account', title: 'Account Settings' },
    { key: 'preferences', href: '#preferences', title: 'Preferences' },
  ];

  return (
    <div
      id='form-container'
      style={{
        height: '80vh',
        overflow: 'auto',
        padding: '20px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div className='max-w-5xl mx-auto'>
        <RPanelHeader
          title='User Profile Settings'
          showClose
          onClose={() => alert('Close clicked')}
          sticky
          stickyOffset={0}
          id='form-header'
          actions={
            <div className='flex items-center gap-2'>
              <RBtn variant='outline' iconStart={<Eye size={16} />}>
                Preview
              </RBtn>
              <RBtn
                type='button'
                onClick={() => {
                  const formElement = document.getElementById(
                    'userForm',
                  ) as HTMLFormElement;
                  if (formElement) {
                    formElement.requestSubmit();
                  }
                }}
                iconEnd={<Save size={16} />}
              >
                Save Changes
              </RBtn>
            </div>
          }
        />

        <div className='grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6'>
          <RForm
            id='userForm'
            form={form}
            onSubmit={handleSubmit}
            layout='vertical'
            showErrorPopup
            spacing='0'
            fieldsetConfig={{
              layout: 'horizontal',
              isSticky: true,
              stickyOffset: 80,
              titleWidth: 'lg:w-64',
              divider: true,
            }}
          >
            {/* Personal Information Section */}
            <RFormFieldSet
              id='personal'
              title='Personal Information'
              subtitle='Basic information about the user'
            >
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <RFormField
                    control={form.control}
                    name='firstName'
                    label='First Name'
                  >
                    <RInput
                      placeholder='John'
                      leftIcon={<User className='h-4 w-4' />}
                    />
                  </RFormField>

                  <RFormField
                    control={form.control}
                    name='lastName'
                    label='Last Name'
                  >
                    <RInput placeholder='Doe' />
                  </RFormField>
                </div>

                <RFormField control={form.control} name='email' label='Email'>
                  <RInput
                    type='email'
                    placeholder='john.doe@example.com'
                    leftIcon={<Mail className='h-4 w-4' />}
                  />
                </RFormField>

                <RFormField control={form.control} name='phone' label='Phone'>
                  <RInput placeholder='+1 (555) 000-0000' />
                </RFormField>

                <RFormField
                  control={form.control}
                  name='dateOfBirth'
                  label='Date of Birth'
                >
                  <RFormDatePicker
                    placeholder='Select date'
                    className='w-full'
                  />
                </RFormField>
              </div>
            </RFormFieldSet>

            {/* Account Settings Section */}
            <RFormFieldSet
              id='account'
              title='Account Settings'
              subtitle='Login credentials and role assignment'
            >
              <div className='space-y-4'>
                <RFormField
                  control={form.control}
                  name='username'
                  label='Username'
                  description='Must be unique and at least 3 characters'
                >
                  <RInput placeholder='johndoe' />
                </RFormField>

                <RFormField
                  control={form.control}
                  name='password'
                  label='Password'
                  description='Must be at least 8 characters'
                >
                  <RInput
                    type='password'
                    placeholder='Enter password'
                    leftIcon={<Lock className='h-4 w-4' />}
                  />
                </RFormField>

                <RFormField control={form.control} name='role' label='Role'>
                  <RSelect
                    showSearch
                    options={roleOptions}
                    placeholder='Select role'
                  />
                </RFormField>
              </div>
            </RFormFieldSet>

            {/* Preferences Section */}
            <RFormFieldSet
              id='preferences'
              title='Preferences'
              subtitle='Customize your experience'
              divider={false}
            >
              <div className='space-y-4'>
                <RFormField
                  control={form.control}
                  name='bio'
                  label='Bio'
                  description='Tell us about yourself (max 500 characters)'
                >
                  <RTextarea
                    placeholder='Write something about yourself...'
                    rows={4}
                  />
                </RFormField>

                <RFormField
                  control={form.control}
                  name='newsletter'
                  label='Newsletter Subscription'
                  description='Receive updates and news via email'
                  valuePropName='checked'
                >
                  <RSwitch className='mt-2' />
                </RFormField>

                <RFormField
                  control={form.control}
                  name='notifications'
                  label='Push Notifications'
                  description='Get notified about important updates'
                  valuePropName='checked'
                >
                  <RSwitch className='mt-2' />
                </RFormField>

                <RFormField
                  control={form.control}
                  name='status'
                  label='Account Status'
                  description='Enable or disable this account'
                  valuePropName='checked'
                >
                  <RSwitch className='mt-2' />
                </RFormField>
              </div>
            </RFormFieldSet>
          </RForm>

          {/* Anchor Navigation */}
          <div className='hidden lg:block'>
            <RStickyWrapper
              scrollContainer='form-container'
              position='top'
              offset={16}
              offsetElements='#form-header'
              shadowOnSticky
            >
              <RAnchor
                items={anchorItems}
                offsetTop={80}
                scrollContainer='form-container'
              />
            </RStickyWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Examples/AdvancedForm',
  component: AdvancedFormExample,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AdvancedFormExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
