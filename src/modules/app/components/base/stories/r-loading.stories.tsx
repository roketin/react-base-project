import type { Meta, StoryObj } from '@storybook/react-vite';

import { RLoading } from '../r-loading';

const meta: Meta<typeof RLoading> = {
  title: 'Components/Feedback/RLoading',
  component: RLoading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    fullScreen: { control: 'boolean' },
    className: { control: false },
    iconClassName: { control: false },
    labelClassName: { control: false },
  },
  args: {
    label: 'Loading data...',
    hideLabel: false,
    fullScreen: false,
  },
};

export default meta;

type Story = StoryObj<typeof RLoading>;

export const Default: Story = {};

export const WithoutLabel: Story = {
  args: {
    hideLabel: true,
  },
};

export const CustomStyling: Story = {
  args: {
    label: 'Fetching analytics…',
    className: 'bg-muted/40 px-6 py-4 rounded-2xl',
    iconClassName: 'text-primary',
    labelClassName: 'text-primary font-semibold',
  },
};
