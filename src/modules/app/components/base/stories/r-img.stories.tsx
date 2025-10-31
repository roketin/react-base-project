import type { Meta, StoryObj } from '@storybook/react-vite';
import RImg from '../r-img';

const meta: Meta<typeof RImg> = {
  title: 'Base/Media/RImg',
  component: RImg,
  tags: ['autodocs'],
  args: {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&auto=format&fit=crop&q=80',
    alt: 'Forest pathway',
    lazy: true,
    wrapperClassName: 'relative size-48 overflow-hidden rounded-xl',
    imageClassName: 'object-cover',
  },
  argTypes: {
    lazy: {
      control: 'boolean',
    },
    fallback: {
      control: false,
    },
    loader: {
      control: false,
    },
    fallbackSrc: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RImg>;

export const Default: Story = {};

export const WithFallbackNode: Story = {
  args: {
    src: 'https://invalid-domain.local/image.jpg',
    fallback: (
      <div className='flex size-full items-center justify-center rounded-xl bg-muted text-sm font-medium text-muted-foreground'>
        No image
      </div>
    ),
  },
};

export const WithFallbackSrc: Story = {
  args: {
    src: 'https://invalid-domain.local/image.jpg',
    fallbackSrc:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640&auto=format&fit=crop&q=80',
  },
};

export const CustomLoader: Story = {
  args: {
    loader: (
      <div className='absolute inset-0 flex items-center justify-center rounded-xl bg-muted/70 text-xs font-medium text-muted-foreground'>
        Loading preview...
      </div>
    ),
  },
};

export const LazyInViewport: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Renders multiple images with `lazy` enabled to demonstrate how they load only when near the viewport.',
      },
    },
  },
  render: (args) => (
    <div className='flex flex-col gap-10'>
      <p className='text-sm text-muted-foreground'>
        Scroll within the preview to trigger image loading.
      </p>
      <div className='space-y-10'>
        {[
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640&auto=format&fit=crop&q=80',
        ].map((url, index) => (
          <div
            key={url}
            className='h-48 border border-dashed border-muted-foreground/40'
          >
            <RImg {...args} src={url} alt={`Lazy image ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  ),
};
