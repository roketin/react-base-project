import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RTable,
  RThead,
  RTbody,
  RTr,
  RTh,
  RTd,
} from '@/modules/app/components/base/r-simple-table';

describe('RTable', () => {
  it('renders table', () => {
    render(
      <RTable>
        <RTbody>
          <RTr>
            <RTd>Cell</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders with fixed layout', () => {
    const { container } = render(
      <RTable fixed>
        <RTbody>
          <RTr>
            <RTd>Cell</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(container.querySelector('.table-fixed')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <RTable ref={ref}>
        <RTbody>
          <RTr>
            <RTd>Cell</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('RThead', () => {
  it('renders thead', () => {
    render(
      <RTable>
        <RThead>
          <RTr>
            <RTh>Header</RTh>
          </RTr>
        </RThead>
      </RTable>,
    );
    expect(screen.getByRole('columnheader')).toBeInTheDocument();
  });
});

describe('RTbody', () => {
  it('renders tbody', () => {
    render(
      <RTable>
        <RTbody>
          <RTr>
            <RTd>Cell</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(screen.getByRole('cell')).toBeInTheDocument();
  });
});

describe('RTr', () => {
  it('renders row', () => {
    render(
      <RTable>
        <RTbody>
          <RTr>
            <RTd>Cell</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(screen.getByRole('row')).toBeInTheDocument();
  });

  it('applies striped styling', () => {
    const { container } = render(
      <RTable>
        <RTbody>
          <RTr striped>
            <RTd>Cell</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(container.querySelector('tr')).toHaveClass('even:bg-muted/50');
  });
});

describe('RTh', () => {
  it('renders header cell', () => {
    render(
      <RTable>
        <RThead>
          <RTr>
            <RTh>Header</RTh>
          </RTr>
        </RThead>
      </RTable>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('applies alignment', () => {
    const { container } = render(
      <RTable>
        <RThead>
          <RTr>
            <RTh align='center'>Centered</RTh>
          </RTr>
        </RThead>
      </RTable>,
    );
    expect(container.querySelector('th')).toHaveClass('text-center');
  });
});

describe('RTd', () => {
  it('renders data cell', () => {
    render(
      <RTable>
        <RTbody>
          <RTr>
            <RTd>Data</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('applies alignment', () => {
    const { container } = render(
      <RTable>
        <RTbody>
          <RTr>
            <RTd align='right'>Right</RTd>
          </RTr>
        </RTbody>
      </RTable>,
    );
    expect(container.querySelector('td')).toHaveClass('text-right');
  });
});
