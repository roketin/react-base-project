import type { Meta, StoryObj } from '@storybook/react-vite';
import { RThemeSwitcher } from '../r-theme-switcher';

const meta = {
  title: 'Components/Navigation/RThemeSwitcher',
  component: RThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof RThemeSwitcher>;

export const Dropdown: Story = {
  args: {
    variant: 'dropdown',
  },
};

export const DropdownSmall: Story = {
  args: {
    variant: 'dropdown',
    size: 'sm',
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
  },
};

export const InlineSmall: Story = {
  args: {
    variant: 'inline',
    size: 'sm',
  },
};

export const InHeader: Story = {
  render: () => (
    <div className='flex items-center gap-4 p-4 border rounded-lg bg-background'>
      <span className='text-sm text-muted-foreground'>Theme:</span>
      <RThemeSwitcher variant='dropdown' />
    </div>
  ),
};

export const InSettings: Story = {
  render: () => (
    <div className='w-80 p-4 border rounded-lg bg-background space-y-4'>
      <h3 className='font-semibold'>Appearance</h3>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium'>Theme</p>
          <p className='text-xs text-muted-foreground'>
            Select your preferred theme
          </p>
        </div>
        <RThemeSwitcher variant='inline' size='sm' />
      </div>
    </div>
  ),
};
