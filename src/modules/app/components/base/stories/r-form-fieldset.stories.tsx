import type { Meta, StoryObj } from '@storybook/react-vite';
import { RFormFieldSet } from '../r-form-fieldset';
import { Input } from '@/modules/app/components/ui/input';
import { Label } from '@/modules/app/components/ui/label';

const meta: Meta<typeof RFormFieldSet> = {
  title: 'Base/Form/RFormFieldSet',
  component: RFormFieldSet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['horizontal', 'vertical'] },
    titleWidth: { control: 'text' },
    isSticky: { control: 'boolean' },
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
      <Label htmlFor='email'>Email</Label>
      <Input type='email' id='email' placeholder='Email' />
    </div>
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='username'>Username</Label>
      <Input type='text' id='username' placeholder='Username' />
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
