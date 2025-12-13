import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RTabs, RTabPanel } from '@/modules/app/components/base/r-tabs';

// Mock ResizeObserver which is not available in jsdom
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
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
    render(
      <RTabs defaultActiveKey='2'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('renders with activeKey prop (controlled)', () => {
    render(
      <RTabs activeKey='2'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('calls onChange when tab is clicked', () => {
    const handleChange = vi.fn();
    render(
      <RTabs onChange={handleChange}>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('renders with disabled tab', () => {
    render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2' disabled>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    const disabledTab = screen.getByText('Tab 2');
    expect(disabledTab).toBeDisabled();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <RTabs className='custom-tabs'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.custom-tabs')).toBeInTheDocument();
  });

  it('renders with listClassName', () => {
    const { container } = render(
      <RTabs listClassName='custom-list'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.custom-list')).toBeInTheDocument();
  });

  it('renders with triggerClassName', () => {
    const { container } = render(
      <RTabs triggerClassName='custom-trigger'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.custom-trigger')).toBeInTheDocument();
  });

  it('renders with contentClassName', () => {
    const { container } = render(
      <RTabs contentClassName='custom-content'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });

  it('renders with full width', () => {
    const { container } = render(
      <RTabs full>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('renders with underline variant', () => {
    const { container } = render(
      <RTabs variant='underline'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.border-b')).toBeInTheDocument();
  });

  it('renders with vertical orientation', () => {
    const { container } = render(
      <RTabs orientation='vertical'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('switches tabs when clicked (uncontrolled)', () => {
    render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('renders forceRender panels even when not active', () => {
    render(
      <RTabs defaultActiveKey='1'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2' forceRender>
          Content 2
        </RTabPanel>
      </RTabs>,
    );

    // Both contents should be in DOM due to forceRender
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('handles invalid activeKey gracefully', () => {
    render(
      <RTabs activeKey='invalid'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    // Should fall back to first tab
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('handles invalid defaultActiveKey gracefully', () => {
    render(
      <RTabs defaultActiveKey='invalid'>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <RTabPanel tabKey='2' header='Tab 2'>
          Content 2
        </RTabPanel>
      </RTabs>,
    );
    // Should fall back to first tab
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('ignores non-RTabPanel children', () => {
    render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          Content 1
        </RTabPanel>
        <div>Not a tab panel</div>
        <span>Also not a tab panel</span>
      </RTabs>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('renders empty when no panels', () => {
    const { container } = render(<RTabs>{null}</RTabs>);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('RTabPanel', () => {
  it('renders tab panel content', () => {
    render(
      <RTabs>
        <RTabPanel tabKey='1' header='Tab 1'>
          <div data-testid='content'>Content 1</div>
        </RTabPanel>
      </RTabs>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('accepts header as ReactNode', () => {
    render(
      <RTabs>
        <RTabPanel
          tabKey='1'
          header={<span data-testid='custom-header'>Custom Header</span>}
        >
          Content 1
        </RTabPanel>
      </RTabs>,
    );
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  it('RTabPanel returns null when rendered directly', () => {
    const result = RTabPanel({
      tabKey: '1',
      header: 'Test',
      children: 'Content',
    });
    expect(result).toBeNull();
  });
});
