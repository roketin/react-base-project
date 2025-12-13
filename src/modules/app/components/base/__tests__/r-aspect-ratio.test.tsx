import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RAspectRatio,
  RAspectRatioImage,
  RAspectRatioVideo,
} from '@/modules/app/components/base/r-aspect-ratio';

describe('RAspectRatio', () => {
  it('renders children correctly', () => {
    render(
      <RAspectRatio data-testid='aspect-ratio'>
        <div>Content</div>
      </RAspectRatio>,
    );
    expect(screen.getByTestId('aspect-ratio')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default aspect ratio of 1', () => {
    render(<RAspectRatio data-testid='aspect-ratio' />);
    const element = screen.getByTestId('aspect-ratio');
    expect(element.style.aspectRatio).toBe('1');
  });

  it('applies numeric ratio correctly', () => {
    render(<RAspectRatio data-testid='aspect-ratio' ratio={16 / 9} />);
    const element = screen.getByTestId('aspect-ratio');
    expect(element.style.aspectRatio).toContain('1.77');
  });

  it('applies string ratio correctly', () => {
    render(<RAspectRatio data-testid='aspect-ratio' ratio='4/3' />);
    const element = screen.getByTestId('aspect-ratio');
    expect(element.style.aspectRatio).toContain('1.33');
  });

  it('applies preset ratio correctly', () => {
    render(<RAspectRatio data-testid='aspect-ratio' preset='square' />);
    const element = screen.getByTestId('aspect-ratio');
    expect(element.style.aspectRatio).toBe('1');
  });

  it('applies video preset correctly', () => {
    render(<RAspectRatio data-testid='aspect-ratio' preset='video' />);
    const element = screen.getByTestId('aspect-ratio');
    expect(element.style.aspectRatio).toContain('1.77');
  });

  it('applies custom className', () => {
    render(
      <RAspectRatio data-testid='aspect-ratio' className='custom-class' />,
    );
    expect(screen.getByTestId('aspect-ratio')).toHaveClass('custom-class');
  });
});

describe('RAspectRatioImage', () => {
  it('renders image with correct src and alt', () => {
    render(
      <RAspectRatioImage
        src='https://example.com/image.jpg'
        alt='Test image'
        data-testid='aspect-image'
      />,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('applies object-fit style', () => {
    render(
      <RAspectRatioImage
        src='https://example.com/image.jpg'
        alt='Test'
        objectFit='contain'
      />,
    );
    const img = screen.getByRole('img');
    expect(img.style.objectFit).toBe('contain');
  });

  it('applies object-position style', () => {
    render(
      <RAspectRatioImage
        src='https://example.com/image.jpg'
        alt='Test'
        objectPosition='top'
      />,
    );
    const img = screen.getByRole('img');
    expect(img.style.objectPosition).toBe('top');
  });
});

describe('RAspectRatioVideo', () => {
  it('renders video element with src', () => {
    render(
      <RAspectRatioVideo
        src='https://example.com/video.mp4'
        data-testid='aspect-video'
      />,
    );
    const video = screen.getByTestId('aspect-video').querySelector('video');
    expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
  });

  it('renders iframe for embed URL', () => {
    render(
      <RAspectRatioVideo
        embedUrl='https://www.youtube.com/embed/123'
        data-testid='aspect-video'
      />,
    );
    const iframe = screen.getByTestId('aspect-video').querySelector('iframe');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/123');
  });

  it('applies controls by default', () => {
    render(
      <RAspectRatioVideo
        src='https://example.com/video.mp4'
        data-testid='aspect-video'
      />,
    );
    const video = screen.getByTestId('aspect-video').querySelector('video');
    expect(video).toHaveAttribute('controls');
  });

  it('applies video preset by default', () => {
    render(<RAspectRatioVideo data-testid='aspect-video' />);
    const element = screen.getByTestId('aspect-video');
    expect(element.style.aspectRatio).toContain('1.77');
  });
});
