import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Download, Check, Settings } from 'lucide-react';
import RBtn from '@/modules/app/components/base/r-btn';

// --- 1. Metadata Configuration ---
const meta: Meta<typeof RBtn> = {
  title: 'Base/RBtn',
  component: RBtn,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  // Define controls for the props
  argTypes: {
    // Core RBtn props
    debounceMs: { control: { type: 'number', min: 0 } },
    loading: { control: 'boolean' },
    loadingLabel: { control: 'text' },
    iconStart: { control: false },
    iconEnd: { control: false },
    onClick: { action: 'clicked' },

    // Inherited Button props (e.g., variant, size)
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },

  // Set default values for Storybook controls
  args: {
    children: 'Submit Form',
    variant: 'default',
    size: 'default',
    debounceMs: 500,
    loading: false,
    loadingLabel: 'Processing...',
  },
};

export default meta;

type Story = StoryObj<typeof RBtn>;

/**
 * The standard appearance of the RBtn, showing a simple button with text.
 */
export const Default: Story = {
  args: {
    // All properties rely on metadata args defined above
  },
};

/**
 * Demonstrates the button in its loading state. The text content (`children`) is replaced
 * by the loading spinner and `loadingLabel`.
 */
export const LoadingState: Story = {
  args: {
    loading: true,
    children: 'Save Data',
    loadingLabel: 'Saving Data...',
    variant: 'secondary',
  },
};

/**
 * Demonstrates the use of `iconStart` and `iconEnd` slots.
 */
export const WithIcons: Story = {
  args: {
    children: 'Download Report',
    iconStart: <Download className='size-4' />,
    iconEnd: <Check className='size-4' />,
    variant: 'default',
  },
};

/**
 * A destructive button variant with a loading state.
 */
export const DestructiveLoading: Story = {
  args: {
    children: 'Delete Account',
    loading: true,
    loadingLabel: 'Deleting...',
    variant: 'destructive',
  },
};

/**
 * Story demonstrating the debouncing behavior.
 * This component adds local state to visually show the button's action and debouncing.
 * * To test: Click the button rapidly. The console action will only fire once per 1000ms.
 */
export const DebounceBehavior: Story = {
  // This story uses a custom render function to manage its own state
  render: (args) => {
    const [clicks, setClicks] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClick = () => {
      // Simulate an async action that takes 2 seconds
      console.log('Action triggered (Debounced)!');
      setClicks((c) => c + 1);
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    };

    return (
      <div className='flex flex-col items-center space-y-4'>
        <RBtn
          {...args}
          onClick={handleClick}
          loading={isProcessing}
          debounceMs={1000} // Set a noticeable debounce time
          children='Rapid Click Test'
          loadingLabel='Stabilizing input...'
          iconStart={<Settings className='size-4' />}
        />
        <p className='text-sm text-gray-600'>Clicks Processed: **{clicks}**</p>
        <p className='text-xs text-muted-foreground'>
          Try clicking multiple times quickly. The internal action and the
          'Processing' state will only start once per 1000ms.
        </p>
      </div>
    );
  },
  // Override default args for this specific story
  args: {
    // We manage loading and onClick internally in the render function
    loading: false,
    onClick: undefined,
  },
};
