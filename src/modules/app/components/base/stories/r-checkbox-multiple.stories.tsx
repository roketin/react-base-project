import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { TLabelValueOption } from '@/modules/app/types/component.type';
import { RCheckboxMultiple } from '@/modules/app/components/base/r-checkbox-multiple';

// --- Mock Data ---
const OPTIONS: TLabelValueOption<string, string>[] = [
  { label: 'Option A (Red)', value: 'red' },
  { label: 'Option B (Green)', value: 'green' },
  { label: 'Option C (Blue)', value: 'blue' },
  { label: 'Option D (Yellow)', value: 'yellow' },
  { label: 'Option E (Black)', value: 'black' },
];

const FRUITS: TLabelValueOption<string, string>[] = [
  { label: 'Apples', value: 'apple' },
  { label: 'Bananas', value: 'banana' },
  { label: 'Oranges', value: 'orange' },
];

const meta: Meta<typeof RCheckboxMultiple> = {
  title: 'Base/Form/RCheckboxMultiple',
  component: RCheckboxMultiple,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  // Define controls for the props
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of {label, value} objects.',
    },
    checked: {
      control: 'object',
      description: 'Array of selected values (strings).',
    },
    onCheckedChange: { action: 'checkedChange' },
    disabled: { control: 'boolean' },
    layout: { control: 'radio', options: ['horizontal', 'vertical'] },
    className: { control: 'text' },
  },

  // Set default options to use in the stories
  args: {
    options: OPTIONS,
    disabled: false,
    layout: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof RCheckboxMultiple>;

/**
 * Standard interactive story to demonstrate the component's functionality
 * and state management when displayed horizontally.
 */
export const HorizontalInteractive: Story = {
  // Use the render function to manage local state for interactivity
  render: (args) => {
    // Start with 'red' and 'blue' checked
    const [checkedValues, setCheckedValues] = useState<string[]>([
      'red',
      'blue',
    ]);

    return (
      <div className='w-[400px]'>
        <RCheckboxMultiple
          {...args}
          checked={checkedValues}
          onCheckedChange={setCheckedValues}
        />
        <p className='mt-4 text-sm text-muted-foreground'>
          Selected Values: **{checkedValues.join(', ') || 'None'}**
        </p>
      </div>
    );
  },
};

/**
 * Story demonstrating the vertical layout, which is better for long lists
 * or complex labels.
 */
export const VerticalLayout: Story = {
  args: {
    options: FRUITS,
    checked: ['apple'],
    layout: 'vertical',
  },
};

/**
 * Story demonstrating the disabled state for the entire group.
 * The current checked state should be preserved, but interaction is blocked.
 */
export const DisabledGroup: Story = {
  args: {
    checked: ['green', 'yellow'],
    disabled: true,
  },
};

/**
 * Story demonstrating a very long list of options that wraps horizontally.
 */
export const LongListHorizontal: Story = {
  args: {
    options: [
      ...OPTIONS,
      { label: 'Violet', value: 'violet' },
      { label: 'Cyan', value: 'cyan' },
      { label: 'Magenta', value: 'magenta' },
      { label: 'Teal', value: 'teal' },
      { label: 'Lime', value: 'lime' },
      { label: 'Maroon', value: 'maroon' },
    ],
    checked: ['cyan', 'lime'],
    layout: 'horizontal',
    className: 'max-w-md', // Ensure the wrapper has a max-width to demonstrate wrapping
  },
};
