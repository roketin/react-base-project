import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  RCollapse,
  RCollapsePanel,
} from '@/modules/app/components/base/r-collapse';

describe('RCollapse', () => {
  it('renders all panels', () => {
    render(
      <RCollapse>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          Content 1
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Panel 2'>
          Content 2
        </RCollapsePanel>
      </RCollapse>,
    );
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  it('shows content when panel is expanded', () => {
    render(
      <RCollapse defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          Content 1
        </RCollapsePanel>
      </RCollapse>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('toggles panel on click', () => {
    render(
      <RCollapse>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          Content 1
        </RCollapsePanel>
      </RCollapse>,
    );

    const header = screen.getByText('Panel 1');
    fireEvent.click(header);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('calls onChange when panel is toggled', () => {
    const handleChange = vi.fn();
    render(
      <RCollapse onChange={handleChange}>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          Content 1
        </RCollapsePanel>
      </RCollapse>,
    );

    fireEvent.click(screen.getByText('Panel 1'));
    expect(handleChange).toHaveBeenCalledWith(['1']);
  });

  it('allows only one open panel in accordion mode', () => {
    const handleChange = vi.fn();
    render(
      <RCollapse accordion onChange={handleChange} defaultActiveKeys={['1']}>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          Content 1
        </RCollapsePanel>
        <RCollapsePanel panelKey='2' header='Panel 2'>
          Content 2
        </RCollapsePanel>
      </RCollapse>,
    );

    fireEvent.click(screen.getByText('Panel 2'));
    expect(handleChange).toHaveBeenCalledWith(['2']);
  });

  it('disables panel when disabled prop is true', () => {
    render(
      <RCollapse>
        <RCollapsePanel panelKey='1' header='Panel 1' disabled>
          Content 1
        </RCollapsePanel>
      </RCollapse>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders extra content', () => {
    render(
      <RCollapse>
        <RCollapsePanel
          panelKey='1'
          header='Panel 1'
          extra={<span>Extra</span>}
        >
          Content 1
        </RCollapsePanel>
      </RCollapse>,
    );
    expect(screen.getByText('Extra')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <RCollapse ref={ref}>
        <RCollapsePanel panelKey='1' header='Panel 1'>
          Content 1
        </RCollapsePanel>
      </RCollapse>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
