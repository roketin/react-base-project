import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  RCarousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '../r-carousel';

describe('RCarousel', () => {
  it('renders carousel with items', () => {
    render(
      <RCarousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </RCarousel>,
    );

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('renders with region role', () => {
    render(
      <RCarousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </RCarousel>,
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <RCarousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </RCarousel>,
    );

    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('navigates to next slide on button click', () => {
    const onIndexChange = vi.fn();
    render(
      <RCarousel onIndexChange={onIndexChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </RCarousel>,
    );

    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('navigates with keyboard arrows', () => {
    const onIndexChange = vi.fn();
    render(
      <RCarousel onIndexChange={onIndexChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </RCarousel>,
    );

    const carousel = screen.getByRole('region');
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('renders dots indicator', () => {
    render(
      <RCarousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </RCarousel>,
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('supports vertical orientation', () => {
    const onIndexChange = vi.fn();
    render(
      <RCarousel orientation='vertical' onIndexChange={onIndexChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </RCarousel>,
    );

    const carousel = screen.getByRole('region');
    fireEvent.keyDown(carousel, { key: 'ArrowDown' });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('supports loop mode', () => {
    const onIndexChange = vi.fn();
    render(
      <RCarousel loop onIndexChange={onIndexChange} defaultIndex={0}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
      </RCarousel>,
    );

    fireEvent.click(screen.getByLabelText('Previous slide'));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
