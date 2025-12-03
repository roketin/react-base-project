import type { Meta, StoryObj } from '@storybook/react-vite';
import { RCollapse, RCollapsePanel } from '../r-collapse';
import { useState } from 'react';
import RBtn from '../r-btn';
import { Settings, Trash, Copy } from 'lucide-react';

const meta = {
  title: 'Components/Data Display/RCollapse',
  component: RCollapse,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RCollapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Panel 2'>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='3' header='Panel 3'>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const Accordion: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse accordion defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Section 1'>
          <p>Only one panel can be open at a time in accordion mode.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Section 2'>
          <p>Opening this panel will close the previous one.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='3' header='Section 3'>
          <p>This creates a more focused user experience.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const Borderless: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse bordered={false} defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Borderless Panel 1'>
          <p>This collapse has no outer border.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Borderless Panel 2'>
          <p>Clean and minimal appearance.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='3' header='Borderless Panel 3'>
          <p>Great for embedding in other components.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const Ghost: Story = {
  render: () => (
    <div className='w-[500px] p-4 bg-muted/30 rounded-lg'>
      <RCollapse ghost defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Ghost Panel 1'>
          <p>Ghost style removes all borders and backgrounds.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Ghost Panel 2'>
          <p>Perfect for sidebars and navigation menus.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='3' header='Ghost Panel 3'>
          <p>Blends seamlessly with the parent container.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const WithExtra: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse defaultActiveKeys={['1']}>
        <RCollapsePanel
          panelKey='1'
          header='Panel with Actions'
          extra={
            <div className='flex gap-1'>
              <RBtn size='iconSm' variant='ghost'>
                <Settings className='h-4 w-4' />
              </RBtn>
              <RBtn size='iconSm' variant='ghost'>
                <Copy className='h-4 w-4' />
              </RBtn>
              <RBtn size='iconSm' variant='ghost'>
                <Trash className='h-4 w-4 text-destructive' />
              </RBtn>
            </div>
          }
        >
          <p>This panel has extra action buttons in the header.</p>
        </RCollapsePanel>
        <RCollapsePanel
          panelKey='2'
          header='Panel with Badge'
          extra={
            <span className='px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full'>
              New
            </span>
          }
        >
          <p>Extra content can be any React node.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const Disabled: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Active Panel'>
          <p>This panel is active and can be toggled.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Disabled Panel' disabled>
          <p>This content is not accessible.</p>
        </RCollapsePanel>
        <RCollapsePanel panelKey='3' header='Another Active Panel'>
          <p>This panel works normally.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const NoArrow: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse defaultActiveKeys={['1']}>
        <RCollapsePanel
          panelKey='1'
          header='No Arrow Panel 1'
          showArrow={false}
        >
          <p>This panel has no arrow indicator.</p>
        </RCollapsePanel>
        <RCollapsePanel
          panelKey='2'
          header='No Arrow Panel 2'
          showArrow={false}
        >
          <p>Cleaner look without the chevron.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const Controlled: Story = {
  render: () => {
    const [activeKeys, setActiveKeys] = useState<string[]>(['1']);

    return (
      <div className='w-[500px] space-y-4'>
        <div className='flex gap-2'>
          <RBtn size='sm' onClick={() => setActiveKeys(['1'])}>
            Open 1
          </RBtn>
          <RBtn size='sm' onClick={() => setActiveKeys(['2'])}>
            Open 2
          </RBtn>
          <RBtn size='sm' onClick={() => setActiveKeys(['1', '2', '3'])}>
            Open All
          </RBtn>
          <RBtn size='sm' variant='outline' onClick={() => setActiveKeys([])}>
            Close All
          </RBtn>
        </div>

        <RCollapse activeKeys={activeKeys} onChange={setActiveKeys}>
          <RCollapsePanel panelKey='1' header='Controlled Panel 1'>
            <p>This collapse is controlled externally.</p>
          </RCollapsePanel>
          <RCollapsePanel panelKey='2' header='Controlled Panel 2'>
            <p>Use buttons above to control which panels are open.</p>
          </RCollapsePanel>
          <RCollapsePanel panelKey='3' header='Controlled Panel 3'>
            <p>Great for complex UI interactions.</p>
          </RCollapsePanel>
        </RCollapse>

        <p className='text-sm text-muted-foreground'>
          Active keys: {activeKeys.join(', ') || 'none'}
        </p>
      </div>
    );
  },
  args: {},
};

export const NestedContent: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='FAQ: How to get started?'>
          <div className='space-y-3'>
            <p>Follow these steps to get started:</p>
            <ol className='list-decimal list-inside space-y-1 text-muted-foreground'>
              <li>Install the package</li>
              <li>Import the components</li>
              <li>Add to your project</li>
            </ol>
            <RBtn size='sm'>Learn More</RBtn>
          </div>
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='FAQ: What are the requirements?'>
          <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
            <li>React 18+</li>
            <li>TypeScript 5+</li>
            <li>Tailwind CSS 3+</li>
          </ul>
        </RCollapsePanel>
        <RCollapsePanel panelKey='3' header='FAQ: How to customize?'>
          <p className='text-muted-foreground'>
            Use the className props to customize the appearance. You can also
            use the headerClassName and contentClassName for more specific
            styling.
          </p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};

export const CustomStyling: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RCollapse
        defaultActiveKeys={['1']}
        className='bg-primary/5 border-primary/20'
      >
        <RCollapsePanel
          panelKey='1'
          header='Custom Styled Panel'
          headerClassName='hover:bg-primary/10'
          contentClassName='bg-background'
        >
          <p>This panel has custom styling applied.</p>
        </RCollapsePanel>
        <RCollapsePanel
          panelKey='2'
          header='Another Custom Panel'
          headerClassName='hover:bg-primary/10'
          contentClassName='bg-background'
        >
          <p>Customize each panel individually.</p>
        </RCollapsePanel>
      </RCollapse>
    </div>
  ),
  args: {},
};
