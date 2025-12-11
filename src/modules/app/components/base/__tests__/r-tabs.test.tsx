import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { RTabs, RTabPanel } from '@/modules/app/components/base/r-tabs';

// Mock ResizeObserver which is not available in jsdom
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('RTabs', () => {
  it('renders tabs container', () => {
    const { container } = render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with defaultActiveKey prop', () => {
    const { container } = render(
      <RTabs defaultActiveKey='2'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with activeKey prop', () => {
    const { container } = render(
      <RTabs activeKey='2'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts onChange callback', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RTabs onChange={handleChange}>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with disabled tab', () => {
    const { container } = render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2' disabled>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <RTabs className='custom-tabs'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('RTabPanel', () => {
  it('renders tab panel content', () => {
    const { container } = render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          <div data-testid='content'>Content 1</div>
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts header as ReactNode', () => {
    const { container } = render(
      <RTabs>
        <RTabPanel tabKey='1' header={<span>Custom Header</span>}>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
