import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RAnchor } from '@/modules/app/components/base/r-anchor';

describe('RAnchor', () => {
  const items = [
    { key: 'section1', href: '#section1', title: 'Section 1' },
    { key: 'section2', href: '#section2', title: 'Section 2' },
    { key: 'section3', href: '#section3', title: 'Section 3' },
  ];

  it('renders all anchor items', () => {
    render(<RAnchor items={items} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  it('renders as links', () => {
    render(<RAnchor items={items} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('has correct href attributes', () => {
    render(<RAnchor items={items} />);
    expect(screen.getByText('Section 1').closest('a')).toHaveAttribute(
      'href',
      '#section1',
    );
    expect(screen.getByText('Section 2').closest('a')).toHaveAttribute(
      'href',
      '#section2',
    );
  });

  it('shows ink indicator by default', () => {
    const { container } = render(<RAnchor items={items} />);
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('hides ink indicator when showInk is false', () => {
    const { container } = render(<RAnchor items={items} showInk={false} />);
    const inkElements = container.querySelectorAll('.w-0\\.5.bg-primary');
    expect(inkElements.length).toBe(0);
  });

  it('renders nested children', () => {
    const nestedItems = [
      {
        key: 'parent',
        href: '#parent',
        title: 'Parent',
        children: [
          { key: 'child1', href: '#child1', title: 'Child 1' },
          { key: 'child2', href: '#child2', title: 'Child 2' },
        ],
      },
    ];
    render(<RAnchor items={nestedItems} />);
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RAnchor items={items} className='custom-anchor' />,
    );
    expect(container.firstChild).toHaveClass('custom-anchor');
  });
});
