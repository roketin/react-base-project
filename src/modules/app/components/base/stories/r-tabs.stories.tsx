import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import RTabs, { RTabContent, RTabItem } from '../r-tabs';

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
  title: 'Base/RTabs',
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
    animation: {
      control: 'inline-radio',
      options: ['none', 'fade', 'slide'],
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
    animation: 'none',
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
        {config.map(({ key, label, forceRender }) => (
          <RTabItem
            key={`trigger-${key}`}
            tabKey={key}
            label={label}
            forceRender={forceRender}
          />
        ))}

        {config.map(({ key, panel }) => (
          <RTabContent key={`content-${key}`} tabKey={key}>
            {panel}
          </RTabContent>
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

export const FadeAnimation: Story = {
  render: Template.render,
  args: {
    animation: 'fade',
  },
};

export const SlideAnimation: Story = {
  render: Template.render,
  args: {
    animation: 'slide',
  },
};

const FORCE_RENDER_CONFIG: TabConfig[] = TAB_CONFIG.map((tab) =>
  tab.key === 'reports' ? { ...tab, forceRender: true } : tab,
);

export const ForceRender: Story = {
  render: createRender(FORCE_RENDER_CONFIG),
  args: {
    animation: 'slide',
    variant: 'underline',
    orientation: 'horizontal',
  },
};
