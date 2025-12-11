import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RImg } from '@/modules/app/components/base/r-img';

describe('RImg', () => {
  it('renders image with src', () => {
    render(
      <RImg
        src='https://example.com/image.jpg'
        alt='Test Image'
        lazy={false}
      />,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Image');
  });

  it('shows loader while loading', () => {
    const { container } = render(
      <RImg src='https://example.com/image.jpg' lazy={false} />,
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows custom loader', () => {
    render(
      <RImg
        src='https://example.com/image.jpg'
        lazy={false}
        loader={<span data-testid='custom-loader'>Loading...</span>}
      />,
    );
    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
  });

  it('shows fallback after error', async () => {
    render(
      <RImg
        src='invalid-url'
        alt='Test'
        lazy={false}
        fallback={<span data-testid='fallback'>Failed</span>}
      />,
    );

    const img = screen.getByRole('img');
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });

  it('shows initial as fallback when no custom fallback', async () => {
    render(<RImg src='invalid-url' alt='Test Image' lazy={false} />);

    const img = screen.getByRole('img');
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  it('applies lazy loading attribute', () => {
    render(<RImg src='https://example.com/image.jpg' lazy={true} />);
    // Image should not render immediately when lazy
  });

  it('applies eager loading when lazy is false', () => {
    render(<RImg src='https://example.com/image.jpg' lazy={false} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RImg
        src='https://example.com/image.jpg'
        className='custom-img'
        lazy={false}
      />,
    );
    expect(container.firstChild).toHaveClass('custom-img');
  });

  it('calls onLoad when image loads', () => {
    const handleLoad = vi.fn();
    render(
      <RImg
        src='https://example.com/image.jpg'
        onLoad={handleLoad}
        lazy={false}
      />,
    );

    const img = screen.getByRole('img');
    fireEvent.load(img);

    expect(handleLoad).toHaveBeenCalled();
  });

  it('calls onError when image fails', () => {
    const handleError = vi.fn();
    render(<RImg src='invalid-url' onError={handleError} lazy={false} />);

    const img = screen.getByRole('img');
    fireEvent.error(img);

    expect(handleError).toHaveBeenCalled();
  });

  it('tries fallbackSrc before showing fallback', async () => {
    render(
      <RImg
        src='invalid-url'
        fallbackSrc='https://example.com/fallback.jpg'
        lazy={false}
      />,
    );

    const img = screen.getByRole('img');
    fireEvent.error(img);

    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    });
  });
});
