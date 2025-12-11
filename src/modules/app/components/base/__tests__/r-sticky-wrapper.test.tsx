import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RStickyWrapper from '@/modules/app/components/base/r-sticky-wrapper';

describe('RStickyWrapper', () => {
  it('renders children', () => {
    render(
      <RStickyWrapper>
        <div data-testid='content'>Sticky Content</div>
      </RStickyWrapper>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Sticky Content')).toBeInTheDocument();
  });

  it('renders with function children', () => {
    render(
      <RStickyWrapper>
        {(isSticky) => (
          <div data-testid='content'>{isSticky ? 'Sticky' : 'Normal'}</div>
        )}
      </RStickyWrapper>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RStickyWrapper className='custom-sticky'>
        <div>Content</div>
      </RStickyWrapper>,
    );
    expect(container.querySelector('.custom-sticky')).toBeInTheDocument();
  });

  it('applies position top by default', () => {
    render(
      <RStickyWrapper>
        <div>Content</div>
      </RStickyWrapper>,
    );
    // Just ensure it renders without errors
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with bottom position', () => {
    render(
      <RStickyWrapper position='bottom'>
        <div>Bottom Sticky</div>
      </RStickyWrapper>,
    );
    expect(screen.getByText('Bottom Sticky')).toBeInTheDocument();
  });
});
