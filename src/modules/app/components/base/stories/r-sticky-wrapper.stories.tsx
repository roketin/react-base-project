import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useRef, useState, useCallback } from 'react';
import { Settings, X } from 'lucide-react';
import RStickyWrapper from '@/modules/app/components/base/r-sticky-wrapper';

const longContent = Array.from({ length: 50 }, (_, i) => (
  <p key={i} className='py-1 text-sm text-gray-700'>
    Long content line #{i + 1}
  </p>
));

const HeaderComponent = ({ children }: { children: React.ReactNode }) => (
  <header className='bg-blue-600 text-white p-4 text-lg font-bold'>
    {children}
  </header>
);

const OffsetElementMock = () => (
  <div
    id='top-fixed-offset'
    className='bg-red-500 text-white p-2 text-center text-sm'
  >
    Fixed Header (Offset Element: 40px)
  </div>
);

const meta: Meta<typeof RStickyWrapper> = {
  title: 'Base/RStickyWrapper',
  component: RStickyWrapper,
  tags: ['autodocs'],
  parameters: {
    // Disable centered layout for scroll demo
    layout: 'fullscreen',
  },
  argTypes: {
    children: { control: false },
    scrollContainer: { control: false },
    onStickyChange: { action: 'onStickyChange' },
    position: { control: 'radio', options: ['top', 'bottom'] },
    offset: { control: 'number' },
    boundaryStop: { control: 'boolean' },
    shadowOnSticky: { control: 'boolean' },
    offsetElements: {
      control: 'object',
      description: 'Array of selectors/elements to offset',
    },
    className: { control: 'text' },
  },
  args: {
    position: 'top',
    offset: 0,
    boundaryStop: true,
    shadowOnSticky: true,
    className: 'p-3 bg-white rounded-lg border',
  },
};

export default meta;
type Story = StoryObj<typeof RStickyWrapper>;

/**
 * Default case: Sticky on window scroll at the top with a small offset.
 */
export const DefaultWindowScroll: Story = {
  render: (args) => {
    const [isSticky, setIsSticky] = useState(false);

    return (
      <div className='p-4 bg-gray-50 min-h-[200vh]'>
        <HeaderComponent>Scroll down to see the sticky effect</HeaderComponent>

        {longContent.slice(0, 5)}

        <h2 className='text-xl font-semibold my-6'>
          Sticky Wrapper (Position: Top)
        </h2>

        <RStickyWrapper
          {...args}
          offset={24} // Slight offset from top
          onStickyChange={(sticky) => {
            setIsSticky(sticky);
            args.onStickyChange?.(sticky);
          }}
          className={args.className + (isSticky ? ' z-50 shadow-xl' : '')}
        >
          {/* Example using children as a function */}
          {(sticky) => (
            <div className='flex justify-between items-center text-sm font-medium'>
              <span>Status: {sticky ? '🚀 STICKY' : 'Normal'}</span>
              <Settings size={18} />
            </div>
          )}
        </RStickyWrapper>

        <h2 className='text-xl font-semibold my-6'>
          Content below the sticky element
        </h2>
        {longContent}

        <div className='h-64 bg-gray-200 mt-8 text-center py-20'>
          End of Scroll Area
        </div>
      </div>
    );
  },
};

// -----------------------------------------------------------------------------

/**
 * Demonstrates Sticky inside a custom scroll container (`overflow-y: scroll`).
 */
export const CustomScrollContainer: Story = {
  render: (args) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    return (
      <div className='p-4 w-[600px] h-[500px] bg-gray-100 border-2 rounded-lg flex flex-col'>
        <HeaderComponent>Custom Scroll Container</HeaderComponent>

        {/* Custom Scroll Container */}
        <div
          ref={containerRef}
          id='custom-container'
          className='flex-1 overflow-y-scroll p-4 relative'
        >
          <p className='mb-4 text-gray-600'>
            *This element will be sticky inside this div (ID:
            custom-container).*
          </p>

          {longContent.slice(0, 10)}

          <div className='h-[200px] border-l-4 border-blue-400 pl-4 mb-8'>
            <h3 className='font-bold'>Sticky Target Area</h3>

            <RStickyWrapper
              {...args}
              scrollContainer='#custom-container' // Target custom container
              onStickyChange={setIsSticky}
            >
              <div
                className={
                  isSticky
                    ? 'bg-yellow-200 p-2 border-l-4 border-yellow-500'
                    : 'bg-gray-100 p-2'
                }
              >
                {isSticky ? '🎉 Fixed Inside Container' : 'Normal Flow'}
              </div>
            </RStickyWrapper>

            {longContent.slice(10, 30)}
          </div>

          <div className='h-40 bg-gray-200 mt-8 text-center py-10'>
            End of Content
          </div>
        </div>
      </div>
    );
  },
  args: {
    offset: 10,
    shadowOnSticky: true,
  },
};

// -----------------------------------------------------------------------------

/**
 * Demonstrates the `boundaryStop` feature (element stops at the bottom boundary of parent).
 * Also shows `position: bottom`.
 */
export const BoundaryStopAndBottom: Story = {
  render: (args) => {
    return (
      <div className='p-4 bg-gray-50 min-h-[150vh] w-[400px]'>
        <HeaderComponent>Boundary Stop & Position Bottom</HeaderComponent>

        {longContent.slice(0, 5)}

        <div className='relative border-4 border-green-500 p-4 mt-8 h-[700px]'>
          <h3 className='text-lg font-bold mb-4 text-green-700'>
            Parent Boundary (Height: 700px)
          </h3>

          {longContent.slice(5, 15)}

          <RStickyWrapper
            {...args}
            position='bottom'
            boundaryStop={true} // Enable boundary stop
            offset={0}
            shadowOnSticky={false}
            className='p-3 bg-red-100 border-2 border-red-500 text-sm font-medium'
          >
            Sticky Element at Bottom (will stop at green line!)
          </RStickyWrapper>

          {longContent.slice(15, 20)}
        </div>

        {longContent.slice(20, 30)}
      </div>
    );
  },
  args: {
    position: 'bottom',
    boundaryStop: true,
    shadowOnSticky: true,
  },
};

// -----------------------------------------------------------------------------

/**
 * Demonstrates the use of `offsetElements` to calculate other fixed elements
 * (e.g. header) into the sticky offset.
 */
export const WithDynamicOffsetElements: Story = {
  render: (args) => {
    const [offsetRemoved, setOffsetRemoved] = useState(false);

    // Use useRef to store reference to offset element,
    // or use string ID (#top-fixed-offset).
    const offsetElement = document.getElementById('top-fixed-offset');

    const handleRemoveOffset = useCallback(() => {
      setOffsetRemoved(true);
    }, []);

    return (
      <div className='p-4 bg-gray-50 min-h-[200vh]'>
        {/* Fixed Offset Element */}
        {!offsetRemoved && <OffsetElementMock />}

        <HeaderComponent>Sticky with Dynamic Offset</HeaderComponent>

        {longContent.slice(0, 5)}

        <RStickyWrapper
          {...args}
          offset={16} // Base offset 16px
          offsetElements={['#top-fixed-offset']} // Use CSS selector
        >
          {(isSticky) => (
            <div className='p-3 bg-indigo-100 border-l-4 border-indigo-500 font-medium flex justify-between items-center'>
              <span>
                Sticky Bar. Offset: {isSticky ? '16px + Header' : 'Normal'}
              </span>
              <button
                onClick={handleRemoveOffset}
                className='text-xs text-indigo-700 underline flex items-center'
              >
                Remove Offset <X size={14} />
              </button>
            </div>
          )}
        </RStickyWrapper>

        {longContent}

        <div className='h-64 bg-gray-200 mt-8 text-center py-20'>
          End of Content
        </div>
      </div>
    );
  },
  args: {
    offset: 16,
    offsetElements: [], // Handled in render
  },
};
