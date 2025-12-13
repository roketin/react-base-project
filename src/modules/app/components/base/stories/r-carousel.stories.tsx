import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RCarousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '../r-carousel';

const meta: Meta<typeof RCarousel> = {
  title: 'Components/Other/RCarousel',
  component: RCarousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RCarousel>;

const slides = [
  { id: 1, color: 'bg-blue-500', label: 'Slide 1' },
  { id: 2, color: 'bg-green-500', label: 'Slide 2' },
  { id: 3, color: 'bg-purple-500', label: 'Slide 3' },
  { id: 4, color: 'bg-orange-500', label: 'Slide 4' },
];

export const Default: Story = {
  render: () => (
    <RCarousel className='w-[400px]'>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className={`${slide.color} h-48 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
            >
              {slide.label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </RCarousel>
  ),
};

export const WithDots: Story = {
  render: () => (
    <RCarousel className='w-[400px]'>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className={`${slide.color} h-48 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
            >
              {slide.label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots className='mt-4' />
    </RCarousel>
  ),
};

export const LineDots: Story = {
  render: () => (
    <RCarousel className='w-[400px]'>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className={`${slide.color} h-48 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
            >
              {slide.label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots variant='line' className='mt-4' />
    </RCarousel>
  ),
};

export const Loop: Story = {
  render: () => (
    <RCarousel className='w-[400px]' loop>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className={`${slide.color} h-48 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
            >
              {slide.label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots className='mt-4' />
    </RCarousel>
  ),
};

export const AutoPlay: Story = {
  render: () => (
    <RCarousel className='w-[400px]' autoPlay autoPlayInterval={2000} loop>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className={`${slide.color} h-48 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
            >
              {slide.label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots className='mt-4' />
    </RCarousel>
  ),
};

export const Vertical: Story = {
  render: () => (
    <RCarousel className='h-[300px] w-[300px]' orientation='vertical'>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className={`${slide.color} h-[300px] rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
            >
              {slide.label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </RCarousel>
  ),
};

export const ImageCarousel: Story = {
  render: () => (
    <RCarousel className='w-[500px]' loop>
      <CarouselContent>
        <CarouselItem>
          <img
            src='https://picsum.photos/500/300?random=1'
            alt='Random 1'
            className='w-full h-[300px] object-cover rounded-lg'
          />
        </CarouselItem>
        <CarouselItem>
          <img
            src='https://picsum.photos/500/300?random=2'
            alt='Random 2'
            className='w-full h-[300px] object-cover rounded-lg'
          />
        </CarouselItem>
        <CarouselItem>
          <img
            src='https://picsum.photos/500/300?random=3'
            alt='Random 3'
            className='w-full h-[300px] object-cover rounded-lg'
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious variant='default' />
      <CarouselNext variant='default' />
      <CarouselDots className='mt-4' />
    </RCarousel>
  ),
};

export const CardCarousel: Story = {
  render: () => (
    <RCarousel className='w-[400px]'>
      <CarouselContent>
        {[1, 2, 3, 4].map((i) => (
          <CarouselItem key={i}>
            <div className='p-4'>
              <div className='border rounded-lg p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-2'>Card {i}</h3>
                <p className='text-muted-foreground text-sm'>
                  This is a card inside a carousel. You can put any content
                  here.
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant='ghost' />
      <CarouselNext variant='ghost' />
      <CarouselDots className='mt-2' />
    </RCarousel>
  ),
};
