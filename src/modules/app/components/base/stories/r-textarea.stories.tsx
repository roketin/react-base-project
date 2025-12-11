import type { Meta, StoryObj } from '@storybook/react-vite';
import { RTextarea } from '../r-textarea';

const meta = {
  title: 'Components/Inputs/RTextarea',
  component: RTextarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description',
  },
};

export const WithError: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    error: 'Message is required',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    helperText: 'Maximum 500 characters',
  },
};

export const ResizeNone: Story = {
  args: {
    label: 'Fixed Size',
    placeholder: 'Cannot resize',
    resize: 'none',
  },
};

export const ResizeVertical: Story = {
  args: {
    label: 'Vertical Resize',
    placeholder: 'Can resize vertically',
    resize: 'vertical',
  },
};

export const ResizeHorizontal: Story = {
  args: {
    label: 'Horizontal Resize',
    placeholder: 'Can resize horizontally',
    resize: 'horizontal',
  },
};

export const ResizeBoth: Story = {
  args: {
    label: 'Free Resize',
    placeholder: 'Can resize in any direction',
    resize: 'both',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'This is disabled content',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width',
    placeholder: 'This textarea takes full width',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export const SizeExtraSmall: Story = {
  args: {
    label: 'Extra Small Size',
    placeholder: 'Extra small textarea',
    size: 'xs',
  },
};

export const SizeSmall: Story = {
  args: {
    label: 'Small Size',
    placeholder: 'Small textarea',
    size: 'sm',
  },
};

export const SizeDefault: Story = {
  args: {
    label: 'Default Size',
    placeholder: 'Default textarea',
    size: 'default',
  },
};

export const SizeLarge: Story = {
  args: {
    label: 'Large Size',
    placeholder: 'Large textarea',
    size: 'lg',
  },
};

export const AutoGrow: Story = {
  args: {
    label: 'Auto Grow',
    placeholder: 'Type here and the textarea will grow automatically...',
    autoGrow: true,
    defaultValue:
      'This textarea automatically adjusts its height based on content.\n\nTry adding more lines to see it grow!',
  },
};

export const AutoGrowWithFullWidth: Story = {
  args: {
    label: 'Auto Grow Full Width',
    placeholder: 'Auto-growing textarea with full width',
    autoGrow: true,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};
