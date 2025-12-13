import type { Meta, StoryObj } from '@storybook/react-vite';
import showFileViewer from '../show-file-viewer';
import RBtn from '@/modules/app/components/base/r-btn';
import { FileImage, FileText, Film } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Utilities/showFileViewer',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Imperative function to show a file viewer modal. Supports images, PDFs, and videos.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const ViewImage: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showFileViewer({
          src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
          onClose: () => console.log('File viewer closed'),
        })
      }
    >
      <FileImage size={16} className='mr-2' />
      View Image
    </RBtn>
  ),
};

export const ViewPDF: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showFileViewer({
          src: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
          onClose: () => console.log('PDF viewer closed'),
        })
      }
    >
      <FileText size={16} className='mr-2' />
      View PDF
    </RBtn>
  ),
};

export const ViewVideo: Story = {
  render: () => (
    <RBtn
      variant='outline'
      onClick={() =>
        showFileViewer({
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          onClose: () => console.log('Video viewer closed'),
        })
      }
    >
      <Film size={16} className='mr-2' />
      View Video
    </RBtn>
  ),
};

export const MultipleFiles: Story = {
  render: () => (
    <div className='flex gap-3'>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showFileViewer({
            src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
          })
        }
      >
        Nature
      </RBtn>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showFileViewer({
            src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
          })
        }
      >
        Landscape
      </RBtn>
      <RBtn
        variant='outline'
        size='sm'
        onClick={() =>
          showFileViewer({
            src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
          })
        }
      >
        Mountains
      </RBtn>
    </div>
  ),
};
