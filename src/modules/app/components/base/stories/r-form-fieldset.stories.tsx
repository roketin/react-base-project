import type { Meta, StoryObj } from '@storybook/react-vite';
import { RFormFieldSet } from '../r-form-fieldset';
import { RInput } from '../r-input';
import { RLabel } from '../r-label';
import RForm from '../r-form';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof RFormFieldSet> = {
  title: 'Components/Layout/RFormFieldSet',
  component: RFormFieldSet,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['horizontal', 'vertical'] },
    titleWidth: { control: 'text' },
    isSticky: { control: 'boolean' },
    stickyOffset: { control: 'number' },
    divider: { control: 'boolean' },
  },
  args: {
    title: 'Section Title',
    subtitle: 'This is a description of the section.',
    layout: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof RFormFieldSet>;

const ExampleContent = () => (
  <div className='space-y-4'>
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <RLabel htmlFor='email'>Email</RLabel>
      <RInput type='email' id='email' placeholder='Email' />
    </div>
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <RLabel htmlFor='username'>Username</RLabel>
      <RInput type='text' id='username' placeholder='Username' />
    </div>
  </div>
);

export const Horizontal: Story = {
  args: {
    children: <ExampleContent />,
  },
};

export const Vertical: Story = {
  args: {
    layout: 'vertical',
    children: <ExampleContent />,
  },
};

export const WithoutSubtitle: Story = {
  args: {
    subtitle: undefined,
    children: <ExampleContent />,
  },
};

export const CustomTitleWidth: Story = {
  args: {
    titleWidth: 'lg:w-1/4',
    children: <ExampleContent />,
  },
};

export const WithDivider: Story = {
  args: {
    divider: true,
    children: <ExampleContent />,
  },
};

export const WithId: Story = {
  args: {
    id: 'section-example',
    children: <ExampleContent />,
  },
  decorators: [
    (Story) => (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <a
            href='#section-example'
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Click to scroll to section
          </a>
        </div>
        <div style={{ height: '100vh' }} />
        <Story />
      </div>
    ),
  ],
};

export const Sticky: Story = {
  args: {
    isSticky: true,
    stickyOffset: 20,
    children: <ExampleContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '150vh', paddingTop: '100px' }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#f0f0f0',
          }}
        >
          Scroll down to see sticky behavior
        </div>
        <Story />
        <div
          style={{ marginTop: '50vh', padding: '10px', background: '#f0f0f0' }}
        >
          End of content
        </div>
      </div>
    ),
  ],
};

export const WithFormConfig: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        email: '',
        username: '',
        firstName: '',
        lastName: '',
      },
    });

    return (
      <div style={{ height: '150vh' }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#f0f0f0',
          }}
        >
          Scroll to see sticky behavior with centralized config
        </div>
        <RForm
          form={form}
          onSubmit={(values) => console.log(values)}
          fieldsetConfig={{
            isSticky: true,
            stickyOffset: 20,
            divider: true,
            titleWidth: 'lg:w-80',
          }}
        >
          <RFormFieldSet
            title='Personal Information'
            subtitle='Enter your personal details'
            layout='horizontal'
          >
            <div className='space-y-4'>
              <div className='grid w-full items-center gap-1.5'>
                <RLabel htmlFor='firstName'>First Name</RLabel>
                <RInput type='text' id='firstName' placeholder='First Name' />
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <RLabel htmlFor='lastName'>Last Name</RLabel>
                <RInput type='text' id='lastName' placeholder='Last Name' />
              </div>
            </div>
          </RFormFieldSet>

          <RFormFieldSet
            title='Account Information'
            subtitle='Setup your account credentials'
            layout='horizontal'
          >
            <div className='space-y-4'>
              <div className='grid w-full items-center gap-1.5'>
                <RLabel htmlFor='email2'>Email</RLabel>
                <RInput type='email' id='email2' placeholder='Email' />
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <RLabel htmlFor='username2'>Username</RLabel>
                <RInput type='text' id='username2' placeholder='Username' />
              </div>
            </div>
          </RFormFieldSet>
        </RForm>
        <div
          style={{ marginTop: '50vh', padding: '10px', background: '#f0f0f0' }}
        >
          End of content
        </div>
      </div>
    );
  },
};
