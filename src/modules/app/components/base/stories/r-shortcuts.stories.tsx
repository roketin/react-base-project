import type { Meta, StoryObj } from '@storybook/react-vite';
import { RShortcuts } from '../r-shortcuts';

const items = [
  {
    id: 'cmdk',
    keys: ['cmd', 'k'],
    description: 'Open global command menu',
    group: 'Navigation',
  },
  {
    id: 'new',
    keys: ['n'],
    description: 'Create new record',
    group: 'Navigation',
  },
  {
    id: 'save',
    keys: ['cmd', 's'],
    description: 'Save current changes',
    group: 'Editing',
  },
  {
    id: 'duplicate',
    keys: ['shift', 'cmd', 'd'],
    description: 'Duplicate selection',
    group: 'Editing',
  },
  {
    id: 'shortcuts',
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    group: 'Help',
    meta: 'Available everywhere',
  },
  {
    id: 'support',
    keys: ['cmd', '/'],
    description: 'Open support panel',
    group: 'Help',
  },
];

const meta: Meta<typeof RShortcuts> = {
  title: 'Base/RShortcuts',
  component: RShortcuts,
  tags: ['autodocs'],
  args: {
    items,
    columns: 2,
    showHeaderIcon: true,
  },
  argTypes: {
    columns: {
      control: 'inline-radio',
      options: [1, 2],
    },
  },
};

export default meta;

type Story = StoryObj<typeof RShortcuts>;

export const Default: Story = {};

export const SingleColumn: Story = {
  args: {
    columns: 1,
    showHeaderIcon: false,
  },
};
