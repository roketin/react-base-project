import RFileUploader, {
  type TRFileUploaderRef,
} from '@/modules/app/components/base/r-file-uploader';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';

const DEFAULT_EXT = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  EXCEL: ['.xlsx', '.xls'],
};

// --- 1. Metadata Configuration ---
const meta: Meta<typeof RFileUploader> = {
  title: 'Base/Form/RFileUploader',
  component: RFileUploader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  // Define controls for the props
  argTypes: {
    // --- Behavior Props ---
    value: { control: false }, // Controlled value, disabled in Storybook controls
    accept: { control: 'object' },
    disabledUpload: { control: 'boolean' },
    disabledDelete: { control: 'boolean' },
    showPreview: { control: 'boolean' },
    compress: { control: 'boolean' },
    adaptiveThumbnail: { control: 'boolean' },
    maxSizeMB: { control: 'number' },
    'aria-invalid': { control: 'boolean' },

    // --- Styling Props ---
    width: { control: 'text' },
    height: { control: 'text' },
    thumbnailSize: { control: 'radio', options: ['cover', 'contain'] },
    icon: { control: 'radio', options: ['image', 'music', 'excel'] },

    // --- Actions ---
    onChange: { action: 'onChange' },
    onRemove: { action: 'onRemove' },
    onPreview: { action: 'onPreview' },
    onBlur: { action: 'onBlur' },
  },

  // Set default args for all stories
  args: {
    width: '300px',
    height: '150px',
    accept: DEFAULT_EXT.IMAGES,
    icon: 'image',
    maxSizeMB: 2,
    adaptiveThumbnail: false,
    showPreview: true,
  },
};

export default meta;

type Story = StoryObj<typeof RFileUploader>;

/**
 * The default state of the uploader, ready to accept an image.
 */
export const Default: Story = {
  args: {
    value: null,
  },
};

/**
 * The default state for a non-image file type (e.g., Excel).
 * This demonstrates the `icon` prop.
 */
export const DefaultNonImage: Story = {
  args: {
    value: null,
    icon: 'excel',
    accept: DEFAULT_EXT.EXCEL,
  },
};

/**
 * Demonstrates the uploader in a controlled state with a remote URL string
 * provided as the `value`.
 */
export const WithValueRemoteURL: Story = {
  args: {
    value: 'https://placehold.co/600x400/eee/aaa?text=Remote+Image',
    thumbnailSize: 'contain',
  },
};

/**
 * Demonstrates the `aria-invalid` state, typically used for validation.
 */
export const InvalidState: Story = {
  args: {
    value: null,
    'aria-invalid': true,
  },
};

/**
 * Demonstrates the uploader in a fully disabled state.
 */
export const Disabled: Story = {
  args: {
    value: 'https://placehold.co/600x400/999/ccc?text=Disabled',
    disabledUpload: true,
    disabledDelete: true,
  },
};

/**
 * Demonstrates `adaptiveThumbnail={true}`. The component's height
 * will adapt to the aspect ratio of the preview image instead of
 * adhering to the `height` prop.
 */
export const AdaptiveThumbnail: Story = {
  args: {
    value: 'https://placehold.co/400x600/eee/aaa?text=Adaptive+Height', // A vertical image
    adaptiveThumbnail: true,
    width: '200px', // Width is respected
    height: '100px', // Height is ignored
    thumbnailSize: 'contain',
  },
};

/**
 * This story is interactive. It uses local state to demonstrate the
 * full upload and preview lifecycle for an *image* file.
 */
export const InteractiveImageUpload: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | string | null>(null);

    return (
      <div className='flex flex-col gap-4'>
        <RFileUploader
          {...args}
          value={file}
          onChange={(newFile) => {
            args?.onChange?.(newFile); // Trigger Storybook action
            setFile(newFile);
          }}
          onRemove={() => {
            args?.onRemove?.();
            setFile(null);
          }}
        />
        <div className='text-sm text-muted-foreground'>
          <strong>Current State:</strong>{' '}
          {file ? (file instanceof File ? file.name : file) : 'null'}
        </div>
      </div>
    );
  },
};

/**
 * This story is interactive and demonstrates uploading a *non-image* file.
 * It shows the generic file preview instead of an image.
 */
export const InteractiveFileUpload: Story = {
  ...InteractiveImageUpload, // Inherit the render function
  args: {
    icon: 'excel',
    accept: ['.xlsx', '.xls', '.csv'],
    maxSizeMB: 5,
  },
};

/**
 * Demonstrates using the component's imperative `ref` to trigger
 * `removeFile()` from a parent component.
 */
export const WithImperativeRef: Story = {
  render: (args) => {
    const uploaderRef = useRef<TRFileUploaderRef>(null);
    const [file, setFile] = useState<File | string | null>(
      'https://placehold.co/600x400/ccc/888?text=Initial+Image',
    );

    const handleRemoveClick = () => {
      uploaderRef.current?.removeFile();
    };

    return (
      <div className='flex flex-col gap-4 items-center'>
        <RFileUploader
          {...args}
          ref={uploaderRef}
          value={file}
          onChange={setFile}
          onRemove={() => setFile(null)}
        />
        <button
          onClick={handleRemoveClick}
          className='bg-red-500 text-white p-2 rounded text-sm'
        >
          Remove File via Ref
        </button>
      </div>
    );
  },
};
