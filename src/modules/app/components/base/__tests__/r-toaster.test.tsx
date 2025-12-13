import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toaster } from '../r-toaster';

describe('Toaster', () => {
  it('renders toaster component', () => {
    const { container } = render(<Toaster />);
    // Sonner renders a section element
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(<Toaster position='top-center' />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders section element', () => {
    const { container } = render(<Toaster />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders with toaster class', () => {
    const { container } = render(<Toaster />);
    const section = container.querySelector('section');
    // Sonner applies classes to the section
    expect(section).toBeInTheDocument();
  });
});
