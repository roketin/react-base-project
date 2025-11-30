import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import RTabs, { RTabPanel } from '../r-tabs';

type Story = StoryObj<typeof RTabs>;

type StatefulPanelProps = {
  title: string;
  description: string;
};

function StatefulPanel({ title, description }: StatefulPanelProps) {
  const [count, setCount] = useState(0);

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='font-semibold'>{title}</p>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>

      <div className='flex items-center gap-4'>
        <span className='text-sm font-medium text-muted-foreground'>
          Counter value: {count}
        </span>
        <button
          type='button'
          className='rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent'
          onClick={() => setCount((prev) => prev + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  );
}

type TabConfig = {
  key: string;
  label: string;
  panel: ReactNode;
  forceRender?: boolean;
};

const TAB_CONFIG: TabConfig[] = [
  {
    key: 'overview',
    label: 'Overview',
    panel: (
      <StatefulPanel
        title='Overview'
        description='Keep frequently used summary cards here.'
      />
    ),
  },
  {
    key: 'reports',
    label: 'Reports',
    panel: (
      <StatefulPanel
        title='Reports'
        description='Switching away while keeping the counter shows if the panel is preserved.'
      />
    ),
  },
  {
    key: 'settings',
    label: 'Settings',
    forceRender: true,
    panel: (
      <StatefulPanel
        title='Settings'
        description='This tab is forced to render on mount even before being activated.'
      />
    ),
  },
];

const meta: Meta<typeof RTabs> = {
  title: 'Components/Navigation/RTabs',
  component: RTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'underline'],
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    full: {
      control: 'boolean',
    },
    onChange: {
      action: 'change',
    },
  },
  args: {
    defaultActiveKey: 'overview',
    variant: 'default',
    orientation: 'horizontal',
    full: false,
  },
};

export default meta;

const createRender =
  (config: TabConfig[]): Story['render'] =>
  ({ onChange, activeKey, defaultActiveKey, className, ...rest }) => {
    const [internalActiveKey, setInternalActiveKey] = useState<
      string | undefined
    >(activeKey ?? defaultActiveKey);

    useEffect(() => {
      if (activeKey !== undefined) {
        setInternalActiveKey(activeKey);
      }
    }, [activeKey]);

    const handleChange = (nextKey: string) => {
      if (activeKey === undefined) {
        setInternalActiveKey(nextKey);
      }

      onChange?.(nextKey);
    };

    return (
      <RTabs
        {...rest}
        activeKey={activeKey ?? internalActiveKey}
        defaultActiveKey={defaultActiveKey}
        onChange={handleChange}
        className={className ?? 'w-[440px]'}
      >
        {config.map(({ key, label, forceRender, panel }) => (
          <RTabPanel
            key={key}
            tabKey={key}
            header={label}
            forceRender={forceRender}
          >
            {panel}
          </RTabPanel>
        ))}
      </RTabs>
    );
  };

const Template: Story = {
  render: createRender(TAB_CONFIG),
};

export const Basic: Story = {
  render: Template.render,
};

export const Underline: Story = {
  render: Template.render,
  args: {
    variant: 'underline',
  },
};

export const FullWidth: Story = {
  render: Template.render,
  args: {
    full: true,
  },
};

export const Vertical: Story = {
  render: Template.render,
  args: {
    orientation: 'vertical',
    full: true,
    className: 'w-full max-w-4xl',
  },
};

const FORCE_RENDER_CONFIG: TabConfig[] = TAB_CONFIG.map((tab) =>
  tab.key === 'reports' ? { ...tab, forceRender: true } : tab,
);

export const ForceRender: Story = {
  render: createRender(FORCE_RENDER_CONFIG),
  args: {
    variant: 'underline',
    orientation: 'horizontal',
  },
};

const MANY_TABS_CONFIG: TabConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    panel: (
      <StatefulPanel title='Dashboard' description='Main dashboard view' />
    ),
  },
  {
    key: 'analytics',
    label: 'Analytics',
    panel: (
      <StatefulPanel title='Analytics' description='View analytics data' />
    ),
  },
  {
    key: 'reports',
    label: 'Reports',
    panel: <StatefulPanel title='Reports' description='Generate reports' />,
  },
  {
    key: 'users',
    label: 'Users',
    panel: <StatefulPanel title='Users' description='Manage users' />,
  },
  {
    key: 'products',
    label: 'Products',
    panel: <StatefulPanel title='Products' description='Product catalog' />,
  },
  {
    key: 'orders',
    label: 'Orders',
    panel: <StatefulPanel title='Orders' description='Order management' />,
  },
  {
    key: 'inventory',
    label: 'Inventory',
    panel: <StatefulPanel title='Inventory' description='Stock management' />,
  },
  {
    key: 'shipping',
    label: 'Shipping',
    panel: <StatefulPanel title='Shipping' description='Shipping options' />,
  },
  {
    key: 'payments',
    label: 'Payments',
    panel: <StatefulPanel title='Payments' description='Payment methods' />,
  },
  {
    key: 'settings',
    label: 'Settings',
    panel: <StatefulPanel title='Settings' description='System settings' />,
  },
];

export const ManyTabs: Story = {
  render: createRender(MANY_TABS_CONFIG),
  args: {
    variant: 'default',
    full: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example with many tabs showing horizontal scroll behavior. Tabs will scroll horizontally when they exceed container width.',
      },
    },
  },
};

export const ManyTabsUnderline: Story = {
  render: createRender(MANY_TABS_CONFIG),
  args: {
    variant: 'underline',
    full: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Many tabs with underline variant and horizontal scroll.',
      },
    },
  },
};

export const NestedTabs: Story = {
  render: () => (
    <RTabs defaultActiveKey='parent1' className='w-[600px]'>
      <RTabPanel tabKey='parent1' header='Parent Tab 1'>
        <div className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            This is parent tab 1 with nested tabs inside
          </p>
          <RTabs defaultActiveKey='child1a' variant='underline'>
            <RTabPanel tabKey='child1a' header='Child 1A'>
              <StatefulPanel
                title='Child Tab 1A'
                description='Nested tab content with independent state'
              />
            </RTabPanel>
            <RTabPanel tabKey='child1b' header='Child 1B'>
              <StatefulPanel
                title='Child Tab 1B'
                description='Another nested tab'
              />
            </RTabPanel>
            <RTabPanel tabKey='child1c' header='Child 1C'>
              <StatefulPanel
                title='Child Tab 1C'
                description='Third nested tab'
              />
            </RTabPanel>
          </RTabs>
        </div>
      </RTabPanel>

      <RTabPanel tabKey='parent2' header='Parent Tab 2'>
        <div className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            Parent tab 2 with different nested tabs
          </p>
          <RTabs defaultActiveKey='child2a'>
            <RTabPanel tabKey='child2a' header='Option A'>
              <StatefulPanel
                title='Option A'
                description='Different nested structure'
              />
            </RTabPanel>
            <RTabPanel tabKey='child2b' header='Option B'>
              <StatefulPanel
                title='Option B'
                description='Independent from parent tab 1'
              />
            </RTabPanel>
          </RTabs>
        </div>
      </RTabPanel>

      <RTabPanel tabKey='parent3' header='Parent Tab 3'>
        <StatefulPanel
          title='Parent Tab 3'
          description='This parent tab has no nested tabs'
        />
      </RTabPanel>
    </RTabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example showing nested tabs. Each parent tab can contain its own set of child tabs with independent state management.',
      },
    },
  },
};
