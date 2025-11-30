import { RBrand } from '@/modules/app/components/base/r-brand';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Zap, Shield } from 'lucide-react';

const meta: Meta<typeof RBrand> = {
  title: 'Components/Other/RBrand',
  component: RBrand,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  // Define controls for the props
  argTypes: {
    direction: { control: 'radio', options: ['horizontal', 'vertical'] },
    align: { control: 'radio', options: ['start', 'center', 'end'] },
    showTagline: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    // These controls are useful for styling overrides
    className: { control: 'text' },
    iconClassName: { control: 'text' },
    // Hiding complex ReactNode controls for simpler demo
    icon: { control: false },
  },

  // We need a decorator to mock the useTranslation hook
  decorators: [
    (Story) => (
      // For this example, we can't fully mock the internals of RBrand's dependency,
      // so we rely on the component's internal logic that falls back to props or defaults.
      // In a live environment, you would wrap this with your i18next provider.
      <div className='p-4 bg-background border rounded'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RBrand>;

/**
 * The default presentation: Horizontal layout, auto-align start,
 * using titles from internal config/i18n.
 */
export const DefaultHorizontal: Story = {
  args: {
    // Relying on default props and mocked config/i18n titles
    direction: 'horizontal',
    align: 'start',
    showTagline: true,
  },
};

/**
 * A compact version without the tagline (subtitle).
 */
export const HorizontalNoTagline: Story = {
  args: {
    ...DefaultHorizontal.args,
    showTagline: false,
    title: 'Short Brand',
  },
};

/**
 * The brand displayed in a vertical stack, centered.
 * Overriding the default icon and applying custom styling.
 */
export const VerticalCentered: Story = {
  args: {
    direction: 'vertical',
    align: 'center',
    title: 'Vertical Stack',
    subtitle: 'Great for sidebar headers.',
    icon: <Zap className='size-6' />, // Custom icon
    // Customizing the icon container color
    iconClassName: 'bg-yellow-500 text-white size-12',
  },
};

/**
 * Vertical layout aligned to the right, using the default Rocket icon.
 */
export const VerticalRightAligned: Story = {
  args: {
    direction: 'vertical',
    align: 'end',
    title: 'Right Aligned Title',
    subtitle: 'This subtitle is also right aligned.',
    // Custom class to slightly adjust the entire component container
    className: 'border-l-4 border-blue-500 p-2',
  },
};

/**
 * Demonstrates how to use a custom icon element (like an image or a different component)
 * and use custom class names to change the text appearance.
 */
export const CustomIconAndText: Story = {
  args: {
    direction: 'horizontal',
    align: 'center',
    title: 'Custom Look',
    subtitle: 'Styling all the things.',
    icon: <Shield className='size-6' />,
    iconClassName: 'bg-purple-600',
    titleClassName: 'text-xl font-extrabold text-purple-600',
    subtitleClassName: 'italic text-sm text-gray-400',
  },
};
