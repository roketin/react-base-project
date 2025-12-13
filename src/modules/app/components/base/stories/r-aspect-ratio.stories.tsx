import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RAspectRatio,
  RAspectRatioImage,
  RAspectRatioVideo,
} from '../r-aspect-ratio';
import { ImageOff } from 'lucide-react';

const meta: Meta<typeof RAspectRatio> = {
  title: 'Components/Layout/RAspectRatio',
  component: RAspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RAspectRatio>;

export const Default: Story = {
  render: () => (
    <div className='w-[300px]'>
      <RAspectRatio
        ratio={16 / 9}
        className='bg-muted rounded-lg overflow-hidden'
      >
        <img
          src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
          alt='Photo'
          className='h-full w-full object-cover'
        />
      </RAspectRatio>
    </div>
  ),
};

export const Presets: Story = {
  render: () => (
    <div className='grid grid-cols-3 gap-4 w-[600px]'>
      {(['square', 'video', 'portrait', 'wide', 'golden'] as const).map(
        (preset) => (
          <div key={preset} className='space-y-2'>
            <p className='text-sm font-medium capitalize'>{preset}</p>
            <RAspectRatio
              preset={preset}
              className='bg-muted rounded-lg flex items-center justify-center'
            >
              <span className='text-xs text-muted-foreground'>{preset}</span>
            </RAspectRatio>
          </div>
        ),
      )}
    </div>
  ),
};

export const CustomRatios: Story = {
  render: () => (
    <div className='grid grid-cols-3 gap-4 w-[600px]'>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>1:1 (Square)</p>
        <RAspectRatio ratio={1} className='bg-muted rounded-lg' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>4:3</p>
        <RAspectRatio ratio={4 / 3} className='bg-muted rounded-lg' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>16:9</p>
        <RAspectRatio ratio={16 / 9} className='bg-muted rounded-lg' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>21:9 (Ultrawide)</p>
        <RAspectRatio ratio={21 / 9} className='bg-muted rounded-lg' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>3:4 (Portrait)</p>
        <RAspectRatio ratio={3 / 4} className='bg-muted rounded-lg' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>String "16/9"</p>
        <RAspectRatio ratio='16/9' className='bg-muted rounded-lg' />
      </div>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-4 w-[500px]'>
      <RAspectRatioImage
        preset='video'
        src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
        alt='Code on screen'
        className='rounded-lg overflow-hidden'
      />
      <RAspectRatioImage
        preset='video'
        src='https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'
        alt='Programming'
        className='rounded-lg overflow-hidden'
      />
    </div>
  ),
};

export const ImageObjectFit: Story = {
  render: () => (
    <div className='grid grid-cols-3 gap-4 w-[600px]'>
      {(['cover', 'contain', 'fill'] as const).map((fit) => (
        <div key={fit} className='space-y-2'>
          <p className='text-sm font-medium capitalize'>{fit}</p>
          <RAspectRatioImage
            preset='square'
            src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
            alt='Code'
            objectFit={fit}
            className='rounded-lg overflow-hidden bg-muted'
          />
        </div>
      ))}
    </div>
  ),
};

export const ImageWithFallback: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-4 w-[400px]'>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Valid Image</p>
        <RAspectRatioImage
          preset='video'
          src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
          alt='Code'
          className='rounded-lg overflow-hidden'
          fallback={
            <div className='flex flex-col items-center gap-2 text-muted-foreground'>
              <ImageOff className='h-8 w-8' />
              <span className='text-sm'>Failed to load</span>
            </div>
          }
        />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Broken Image</p>
        <RAspectRatioImage
          preset='video'
          src='https://invalid-url.com/broken.jpg'
          alt='Broken'
          className='rounded-lg overflow-hidden'
          fallback={
            <div className='flex flex-col items-center gap-2 text-muted-foreground'>
              <ImageOff className='h-8 w-8' />
              <span className='text-sm'>Failed to load</span>
            </div>
          }
        />
      </div>
    </div>
  ),
};

export const VideoEmbed: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RAspectRatioVideo
        embedUrl='https://www.youtube.com/embed/dQw4w9WgXcQ'
        className='rounded-lg overflow-hidden'
      />
    </div>
  ),
};

export const NativeVideo: Story = {
  render: () => (
    <div className='w-[500px]'>
      <RAspectRatioVideo
        src='https://www.w3schools.com/html/mov_bbb.mp4'
        poster='https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800'
        controls
        className='rounded-lg overflow-hidden'
      />
    </div>
  ),
};

export const ImageGallery: Story = {
  render: () => (
    <div className='grid grid-cols-4 gap-2 w-[600px]'>
      {Array.from({ length: 8 }).map((_, i) => (
        <RAspectRatioImage
          key={i}
          preset='square'
          src={`https://picsum.photos/seed/${i + 10}/200`}
          alt={`Gallery image ${i + 1}`}
          className='rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'
        />
      ))}
    </div>
  ),
};

export const CardWithImage: Story = {
  render: () => (
    <div className='w-[300px] rounded-lg border overflow-hidden'>
      <RAspectRatioImage
        preset='video'
        src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'
        alt='Laptop'
      />
      <div className='p-4 space-y-2'>
        <h3 className='font-semibold'>Modern Development</h3>
        <p className='text-sm text-muted-foreground'>
          Learn the latest techniques for building modern web applications.
        </p>
      </div>
    </div>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <div className='w-full max-w-4xl'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <RAspectRatioImage
            key={i}
            preset='video'
            src={`https://picsum.photos/seed/${i + 20}/400/225`}
            alt={`Image ${i + 1}`}
            className='rounded-lg overflow-hidden'
          />
        ))}
      </div>
    </div>
  ),
};
