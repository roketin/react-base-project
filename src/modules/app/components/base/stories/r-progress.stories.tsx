import type { Meta, StoryObj } from '@storybook/react-vite';
import { RProgress, RProgressCircular } from '../r-progress';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Components/Feedback/RProgress',
  component: RProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

// Linear Progress Stories
export const LinearDefault: Story = {
  args: {
    value: 60,
    className: 'w-80',
  },
};

export const LinearVariants: Story = {
  render: () => (
    <div className='w-80 space-y-4'>
      <div>
        <p className='text-sm mb-2'>Default</p>
        <RProgress value={60} variant='default' />
      </div>
      <div>
        <p className='text-sm mb-2'>Success</p>
        <RProgress value={80} variant='success' />
      </div>
      <div>
        <p className='text-sm mb-2'>Warning</p>
        <RProgress value={50} variant='warning' />
      </div>
      <div>
        <p className='text-sm mb-2'>Error</p>
        <RProgress value={30} variant='error' />
      </div>
      <div>
        <p className='text-sm mb-2'>Info</p>
        <RProgress value={70} variant='info' />
      </div>
    </div>
  ),
};

export const LinearSizes: Story = {
  render: () => (
    <div className='w-80 space-y-4'>
      <div>
        <p className='text-sm mb-2'>Small</p>
        <RProgress value={60} size='sm' />
      </div>
      <div>
        <p className='text-sm mb-2'>Default</p>
        <RProgress value={60} size='default' />
      </div>
      <div>
        <p className='text-sm mb-2'>Large</p>
        <RProgress value={60} size='lg' />
      </div>
    </div>
  ),
};

export const LinearWithValue: Story = {
  render: () => (
    <div className='w-80 space-y-4'>
      <RProgress value={25} showValue />
      <RProgress value={50} showValue variant='success' />
      <RProgress value={75} showValue variant='warning' />
      <RProgress value={100} showValue variant='info' />
    </div>
  ),
};

export const LinearStriped: Story = {
  render: () => (
    <div className='w-80 space-y-4'>
      <div>
        <p className='text-sm mb-2'>Striped</p>
        <RProgress value={60} striped size='lg' />
      </div>
      <div>
        <p className='text-sm mb-2'>Striped + Animated</p>
        <RProgress value={60} striped animated size='lg' />
      </div>
    </div>
  ),
};

export const LinearAnimated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className='w-80 space-y-4'>
        <RProgress value={progress} showValue />
        <RProgress value={progress} variant='success' showValue />
        <RProgress value={progress} variant='warning' striped animated />
      </div>
    );
  },
};

// Circular Progress Stories
export const CircularDefault: Story = {
  render: () => <RProgressCircular value={60} />,
};

export const CircularVariants: Story = {
  render: () => (
    <div className='flex gap-6'>
      <div className='text-center'>
        <RProgressCircular value={60} variant='default' />
        <p className='text-xs mt-2'>Default</p>
      </div>
      <div className='text-center'>
        <RProgressCircular value={80} variant='success' />
        <p className='text-xs mt-2'>Success</p>
      </div>
      <div className='text-center'>
        <RProgressCircular value={50} variant='warning' />
        <p className='text-xs mt-2'>Warning</p>
      </div>
      <div className='text-center'>
        <RProgressCircular value={30} variant='error' />
        <p className='text-xs mt-2'>Error</p>
      </div>
      <div className='text-center'>
        <RProgressCircular value={70} variant='info' />
        <p className='text-xs mt-2'>Info</p>
      </div>
    </div>
  ),
};

export const CircularSizes: Story = {
  render: () => (
    <div className='flex items-center gap-6'>
      <div className='text-center'>
        <RProgressCircular value={60} size={48} strokeWidth={3} />
        <p className='text-xs mt-2'>Small</p>
      </div>
      <div className='text-center'>
        <RProgressCircular value={60} size={64} strokeWidth={4} />
        <p className='text-xs mt-2'>Default</p>
      </div>
      <div className='text-center'>
        <RProgressCircular value={60} size={96} strokeWidth={6} />
        <p className='text-xs mt-2'>Large</p>
      </div>
    </div>
  ),
};

export const CircularWithValue: Story = {
  render: () => (
    <div className='flex gap-6'>
      <RProgressCircular value={25} showValue />
      <RProgressCircular value={50} showValue variant='success' />
      <RProgressCircular value={75} showValue variant='warning' />
      <RProgressCircular value={100} showValue variant='info' />
    </div>
  ),
};

export const CircularIndeterminate: Story = {
  render: () => (
    <div className='flex gap-6'>
      <RProgressCircular indeterminate />
      <RProgressCircular indeterminate variant='success' />
      <RProgressCircular indeterminate variant='warning' />
      <RProgressCircular indeterminate variant='error' />
    </div>
  ),
};

export const CircularAnimated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className='flex gap-6'>
        <RProgressCircular value={progress} showValue />
        <RProgressCircular value={progress} showValue variant='success' />
        <RProgressCircular value={progress} showValue variant='warning' />
      </div>
    );
  },
};

export const Combined: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className='space-y-8'>
        <div className='flex items-center gap-4'>
          <RProgressCircular value={progress} showValue />
          <RProgress value={progress} showValue className='flex-1' />
        </div>
        <div className='flex items-center gap-4'>
          <RProgressCircular value={progress} showValue variant='success' />
          <RProgress
            value={progress}
            showValue
            variant='success'
            className='flex-1'
          />
        </div>
        <div className='flex items-center gap-4'>
          <RProgressCircular value={progress} showValue variant='warning' />
          <RProgress
            value={progress}
            showValue
            variant='warning'
            striped
            animated
            className='flex-1'
          />
        </div>
      </div>
    );
  },
};

export const FileUpload: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const startUpload = () => {
      setUploading(true);
      setProgress(0);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setUploading(false), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    };

    return (
      <div className='w-96 space-y-4'>
        <div className='rounded-lg border border-slate-200 p-6'>
          <h3 className='text-lg font-semibold mb-4'>Upload File</h3>
          {!uploading ? (
            <button
              onClick={startUpload}
              className='w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90'
            >
              Start Upload
            </button>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <RProgressCircular value={progress} showValue size={48} />
                <div className='flex-1'>
                  <p className='text-sm font-medium mb-2'>Uploading...</p>
                  <RProgress value={progress} showValue />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
};
