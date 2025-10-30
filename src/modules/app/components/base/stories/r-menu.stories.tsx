import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClipboardCheck, Settings, Trash2, UserPlus } from 'lucide-react';
import RMenu, { type RMenuItem } from '../r-menu';
import RBtn from '@/modules/app/components/base/r-btn';

const baseItems: RMenuItem[] = [
  {
    id: 'new',
    label: 'New project…',
    icon: <ClipboardCheck className='size-4' />,
    description: 'Create from template or scratch',
    hotkey: 'cmd+n',
  },
  {
    id: 'invite',
    label: 'Invite teammates',
    icon: <UserPlus className='size-4' />,
    items: [
      {
        id: 'invite-email',
        label: 'Via email',
        description: 'Send a one-off invitation',
      },
      {
        id: 'invite-link',
        label: 'Generate shareable link',
        description: 'Anyone with link can request access',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Workspace settings',
    icon: <Settings className='size-4' />,
    dividerAbove: true,
  },
  {
    id: 'delete',
    label: 'Delete workspace',
    icon: <Trash2 className='size-4' />,
    danger: true,
  },
];

const meta: Meta<typeof RMenu> = {
  title: 'Base/RMenu',
  component: RMenu,
  tags: ['autodocs'],
  args: {
    trigger: <RBtn>Open menu</RBtn>,
    items: baseItems,
    label: 'Workspace actions',
    description: 'Manage workspace configuration, collaborators, and access.',
  },
};

export default meta;

type Story = StoryObj<typeof RMenu>;

export const Default: Story = {};

export const MinimalDense: Story = {
  args: {
    dense: true,
    contentClassName: 'border border-border/40 bg-background/80 shadow-sm',
  },
};

export const NestedMenu: Story = {
  args: {
    items: baseItems,
  },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <div className='flex items-center justify-between'>
        <span>Need advanced actions?</span>
        <RBtn size='sm' variant='outline'>
          Open console
        </RBtn>
      </div>
    ),
  },
};

export const HiddenItems: Story = {
  args: {
    items: baseItems.map((item) =>
      item.id === 'delete' ? { ...item, hidden: true } : item,
    ),
  },
};

export const WithHandlers: Story = {
  render: (args) => (
    <RMenu
      {...args}
      onItemSelect={(item) => {
        // eslint-disable-next-line no-alert
        window.alert(`Clicked on ${item.label}`);
      }}
    />
  ),
  args: {
    items: baseItems,
  },
};
