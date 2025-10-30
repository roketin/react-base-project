import type { Meta, StoryObj } from '@storybook/react-vite';
import { useViewport } from '../use-viewport';

const meta: Meta = {
  title: 'Hooks/useViewport',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const ViewportInfo = () => {
  const viewport = useViewport();

  return (
    <div className='mx-auto flex w-full max-w-xl flex-col gap-4 rounded-xl border border-border/60 bg-background p-6 text-sm'>
      <div>
        <h2 className='text-lg font-semibold'>Viewport information</h2>
        <p className='text-muted-foreground'>
          Resize the browser to see live updates.
        </p>
      </div>
      <ul className='grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/20 p-4'>
        <li>
          <span className='text-xs uppercase text-muted-foreground'>Width</span>
          <p className='text-base font-semibold'>{viewport.width}px</p>
        </li>
        <li>
          <span className='text-xs uppercase text-muted-foreground'>
            Height
          </span>
          <p className='text-base font-semibold'>{viewport.height}px</p>
        </li>
        <li>
          <span className='text-xs uppercase text-muted-foreground'>
            Breakpoint
          </span>
          <p className='text-base font-semibold'>{viewport.breakpoint}</p>
        </li>
        <li>
          <span className='text-xs uppercase text-muted-foreground'>
            Device
          </span>
          <p className='text-base font-semibold'>
            {viewport.isMobile
              ? 'Mobile'
              : viewport.isTablet
                ? 'Tablet'
                : 'Desktop'}
          </p>
        </li>
      </ul>
    </div>
  );
};

export const Playground: Story = {
  render: () => <ViewportInfo />,
};
