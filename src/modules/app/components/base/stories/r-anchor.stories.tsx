import type { Meta, StoryObj } from '@storybook/react-vite';
import { RAnchor } from '../r-anchor';
import RStickyWrapper from '../r-sticky-wrapper';

const meta: Meta<typeof RAnchor> = {
  title: 'Components/Navigation/RAnchor',
  component: RAnchor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    offsetTop: { control: 'number' },
    showInk: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof RAnchor>;

const anchorItems = [
  { key: 'section1', href: '#section1', title: 'Section 1' },
  { key: 'section2', href: '#section2', title: 'Section 2' },
  { key: 'section3', href: '#section3', title: 'Section 3' },
  { key: 'section4', href: '#section4', title: 'Section 4' },
];

const SectionContent = ({ id, title }: { id: string; title: string }) => (
  <div id={id} className='mb-8 p-6 bg-gray-50 rounded-lg'>
    <h2 className='text-2xl font-bold mb-4'>{title}</h2>
    <p className='mb-4'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
    <p className='mb-4'>
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    items: anchorItems,
    offsetTop: 20,
  },
  render: (args) => (
    <div style={{ height: '100vh', overflow: 'auto', padding: '20px' }}>
      <div className='grid grid-cols-[1fr_200px] gap-6'>
        <div>
          <SectionContent id='section1' title='Section 1' />
          <SectionContent id='section2' title='Section 2' />
          <SectionContent id='section3' title='Section 3' />
          <SectionContent id='section4' title='Section 4' />
        </div>
        <div>
          <RAnchor {...args} />
        </div>
      </div>
    </div>
  ),
};

export const WithStickyWrapper: Story = {
  args: {
    items: anchorItems,
    offsetTop: 80,
    scrollContainer: 'sticky-scroll-container',
  },
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <div
        id='sticky-scroll-container'
        style={{
          height: '80vh',
          overflow: 'auto',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div className='grid grid-cols-[1fr_200px] gap-6'>
          <div>
            <SectionContent id='section1' title='Section 1' />
            <SectionContent id='section2' title='Section 2' />
            <SectionContent id='section3' title='Section 3' />
            <SectionContent id='section4' title='Section 4' />
          </div>
          <div>
            <RStickyWrapper
              scrollContainer='sticky-scroll-container'
              position='top'
              offset={20}
              shadowOnSticky
            >
              <RAnchor {...args} />
            </RStickyWrapper>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const WithNestedItems: Story = {
  args: {
    items: [
      {
        key: 'section1',
        href: '#section1',
        title: 'Section 1',
        children: [
          { key: 'section1-1', href: '#section1-1', title: 'Subsection 1.1' },
          { key: 'section1-2', href: '#section1-2', title: 'Subsection 1.2' },
        ],
      },
      { key: 'section2', href: '#section2', title: 'Section 2' },
      {
        key: 'section3',
        href: '#section3',
        title: 'Section 3',
        children: [
          { key: 'section3-1', href: '#section3-1', title: 'Subsection 3.1' },
        ],
      },
    ],
    offsetTop: 20,
  },
  render: (args) => (
    <div style={{ height: '100vh', overflow: 'auto', padding: '20px' }}>
      <div className='grid grid-cols-[1fr_200px] gap-6'>
        <div>
          <SectionContent id='section1' title='Section 1' />
          <div className='ml-8'>
            <SectionContent id='section1-1' title='Subsection 1.1' />
            <SectionContent id='section1-2' title='Subsection 1.2' />
          </div>
          <SectionContent id='section2' title='Section 2' />
          <SectionContent id='section3' title='Section 3' />
          <div className='ml-8'>
            <SectionContent id='section3-1' title='Subsection 3.1' />
          </div>
        </div>
        <div>
          <RAnchor {...args} />
        </div>
      </div>
    </div>
  ),
};
