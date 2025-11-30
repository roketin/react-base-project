import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import RFileViewer from '../r-file-viewer';
import RBtn from '@/modules/app/components/base/r-btn';

const SMALL_IMAGE = 'https://placehold.co/220x140.png?text=Small+220x140';
const LARGE_IMAGE = 'https://placehold.co/1600x900.png?text=Large+1600x900';
const SAMPLE_PDF =
  'https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf';
const SAMPLE_XLSX =
  'https://file-examples.com/storage/fe6b680f2661c3a18123cce/2017/02/file_example_XLSX_10.xlsx';

const meta: Meta<typeof RFileViewer> = {
  title: 'Components/Media/RFileViewer',
  component: RFileViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    show: { control: false },
    src: { control: false },
    onClose: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof RFileViewer>;

const sources = {
  smallImage: SMALL_IMAGE,
  largeImage: LARGE_IMAGE,
  samplePdf: SAMPLE_PDF,
  sampleXlsx: SAMPLE_XLSX,
} as const;

export const Playground: Story = {
  render: () => {
    const [selected, setSelected] =
      useState<keyof typeof sources>('smallImage');
    const [open, setOpen] = useState(false);

    const previewSrc = useMemo(() => sources[selected], [selected]);

    return (
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-6'>
        <div className='grid gap-4 md:grid-cols-[240px_1fr]'>
          <div className='space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4'>
            <h3 className='text-base font-semibold text-foreground'>
              Examples
            </h3>
            <p className='text-xs text-muted-foreground'>
              Open one of the assets to preview. Small images keep their natural
              size until you click to zoom in.
            </p>
            <div className='flex flex-col gap-2'>
              <RBtn
                variant='outline'
                onClick={() => {
                  setSelected('smallImage');
                  setOpen(true);
                }}
              >
                Small image (220×140)
              </RBtn>
              <RBtn
                variant='outline'
                onClick={() => {
                  setSelected('largeImage');
                  setOpen(true);
                }}
              >
                Large image (1600×900)
              </RBtn>
              <RBtn
                variant='outline'
                onClick={() => {
                  setSelected('samplePdf');
                  setOpen(true);
                }}
              >
                Sample PDF document
              </RBtn>
              <RBtn
                variant='outline'
                onClick={() => {
                  setSelected('sampleXlsx');
                  setOpen(true);
                }}
              >
                Sample Excel spreadsheet
              </RBtn>
            </div>
          </div>

          <div className='rounded-xl border border-border/60 bg-muted/20 p-6'>
            <h4 className='mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
              Current preview
            </h4>
            <div className='flex h-32 items-center justify-center rounded-md border border-border/60 bg-background p-3 text-xs text-muted-foreground text-center'>
              {selected === 'samplePdf' &&
                'PDF preview opens directly in the inline viewer.'}
              {selected === 'sampleXlsx' &&
                'Excel file is rendered using the Office Online embed (requires internet access).'}
              {selected === 'smallImage' &&
                'Small image shows at natural size until you click to zoom.'}
              {selected === 'largeImage' &&
                'Large image fits the viewport; click to expand to the full screen.'}
            </div>
          </div>
        </div>

        <p className='text-xs text-muted-foreground'>
          Tip: small images stay compact until you click to zoom. Office
          documents use the public Office Online viewer, so they must be
          reachable via a direct URL.
        </p>

        <RFileViewer
          show={open}
          src={previewSrc}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};
