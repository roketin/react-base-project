import type { Meta, StoryObj } from '@storybook/react-vite';
import { RSplitter } from '../r-splitter';

const meta: Meta<typeof RSplitter> = {
  title: 'Components/Other/RSplitter',
  component: RSplitter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    gutterSize: {
      control: { type: 'range', min: 2, max: 16, step: 1 },
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RSplitter>;

// Panel content component
const PanelContent = ({ title, color }: { title: string; color: string }) => (
  <div
    className='h-full w-full p-4 flex items-center justify-center'
    style={{ backgroundColor: color }}
  >
    <span className='text-lg font-medium'>{title}</span>
  </div>
);

// ============================================================================
// Stories
// ============================================================================

export const Horizontal: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='horizontal'>
        <RSplitter.Panel defaultSize={30} minSize={20}>
          <PanelContent title='Left Panel (30%)' color='#e0f2fe' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={70} minSize={30}>
          <PanelContent title='Right Panel (70%)' color='#fef3c7' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className='h-[500px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='vertical'>
        <RSplitter.Panel defaultSize={40} minSize={20}>
          <PanelContent title='Top Panel (40%)' color='#dcfce7' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={60} minSize={20}>
          <PanelContent title='Bottom Panel (60%)' color='#fce7f3' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='horizontal'>
        <RSplitter.Panel defaultSize={25} minSize={15}>
          <PanelContent title='Sidebar' color='#e0e7ff' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={50} minSize={30}>
          <PanelContent title='Main Content' color='#f5f5f5' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={25} minSize={15}>
          <PanelContent title='Details' color='#fef9c3' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='horizontal'>
        <RSplitter.Panel
          defaultSize={25}
          minSize={15}
          collapsible
          collapsedSize={0}
        >
          <PanelContent
            title='Collapsible Sidebar (double-click gutter)'
            color='#dbeafe'
          />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={75} minSize={40}>
          <PanelContent title='Main Content' color='#f1f5f9' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const NestedSplitters: Story = {
  render: () => (
    <div className='h-[500px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='horizontal'>
        <RSplitter.Panel defaultSize={25} minSize={15}>
          <PanelContent title='Sidebar' color='#e0e7ff' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={75} minSize={40}>
          <RSplitter orientation='vertical'>
            <RSplitter.Panel defaultSize={60} minSize={30}>
              <PanelContent title='Editor' color='#f5f5f5' />
            </RSplitter.Panel>
            <RSplitter.Panel defaultSize={40} minSize={20}>
              <PanelContent title='Terminal' color='#1e293b' />
            </RSplitter.Panel>
          </RSplitter>
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const WithPersistence: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='horizontal' storageKey='demo-splitter'>
        <RSplitter.Panel defaultSize={30} minSize={20}>
          <PanelContent
            title='Persisted Left (resize and refresh)'
            color='#d1fae5'
          />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={70} minSize={30}>
          <PanelContent title='Persisted Right' color='#fee2e2' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const WithCallbacks: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter
        orientation='horizontal'
        onResize={(sizes) => console.log('Resizing:', sizes)}
        onResizeEnd={(sizes) => console.log('Resize ended:', sizes)}
      >
        <RSplitter.Panel defaultSize={50} minSize={20}>
          <PanelContent title='Check console for events' color='#fef3c7' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={50} minSize={20}>
          <PanelContent title='Drag to see callbacks' color='#dbeafe' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter orientation='horizontal' disabled>
        <RSplitter.Panel defaultSize={40}>
          <PanelContent title='Disabled (cannot resize)' color='#f3f4f6' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={60}>
          <PanelContent title='Fixed size' color='#e5e7eb' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const CustomGutter: Story = {
  render: () => (
    <div className='h-[400px] w-full border rounded-lg overflow-hidden'>
      <RSplitter
        orientation='horizontal'
        gutterSize={8}
        gutterClassName='bg-primary/10 hover:bg-primary/30'
      >
        <RSplitter.Panel defaultSize={50} minSize={20}>
          <PanelContent title='Custom gutter style' color='#ecfdf5' />
        </RSplitter.Panel>
        <RSplitter.Panel defaultSize={50} minSize={20}>
          <PanelContent title='8px wide, custom colors' color='#fdf4ff' />
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};

export const IDELayout: Story = {
  render: () => (
    <div className='h-[600px] w-full border rounded-lg overflow-hidden bg-background'>
      <RSplitter orientation='horizontal' storageKey='ide-layout'>
        {/* File Explorer */}
        <RSplitter.Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          collapsible
          collapsedSize={0}
        >
          <div className='h-full bg-muted/30 p-2'>
            <div className='text-sm font-medium mb-2 px-2'>Explorer</div>
            <div className='space-y-1'>
              {['src', 'components', 'hooks', 'utils'].map((item) => (
                <div
                  key={item}
                  className='px-2 py-1 text-sm hover:bg-muted rounded cursor-pointer'
                >
                  📁 {item}
                </div>
              ))}
            </div>
          </div>
        </RSplitter.Panel>

        {/* Main Area */}
        <RSplitter.Panel defaultSize={80} minSize={50}>
          <RSplitter orientation='vertical'>
            {/* Editor */}
            <RSplitter.Panel defaultSize={70} minSize={30}>
              <div className='h-full bg-background p-4'>
                <div className='text-sm text-muted-foreground mb-2'>
                  editor.tsx
                </div>
                <pre className='text-sm font-mono'>
                  {`function Editor() {
  return (
    <div>
      Hello World
    </div>
  );
}`}
                </pre>
              </div>
            </RSplitter.Panel>

            {/* Terminal */}
            <RSplitter.Panel
              defaultSize={30}
              minSize={15}
              collapsible
              collapsedSize={0}
            >
              <div className='h-full bg-zinc-900 text-zinc-100 p-2 font-mono text-sm'>
                <div className='text-zinc-400 mb-1'>Terminal</div>
                <div>$ pnpm dev</div>
                <div className='text-green-400'>Ready on localhost:5177</div>
              </div>
            </RSplitter.Panel>
          </RSplitter>
        </RSplitter.Panel>
      </RSplitter>
    </div>
  ),
};
