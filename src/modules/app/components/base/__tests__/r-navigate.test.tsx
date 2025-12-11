import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { RNavigate } from '@/modules/app/components/base/r-navigate';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the useNamedRoute hook
vi.mock('@/modules/app/hooks/use-named-route', () => ({
  useNamedRoute: () => ({
    linkTo: (
      name: string,
      params?: Record<string, string>,
      options?: {
        query?: Record<string, string | number | boolean>;
        replace?: boolean;
      },
    ) => {
      const searchParams = new URLSearchParams();
      if (options?.query) {
        for (const [key, value] of Object.entries(options.query)) {
          searchParams.append(key, String(value));
        }
      }
      const search = searchParams.toString()
        ? `?${searchParams.toString()}`
        : undefined;
      return { pathname: `/${name}`, search, replace: options?.replace };
    },
  }),
}));

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path='*' element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('RNavigate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws error when neither name nor path provided', () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderWithRouter(<RNavigate />);
    }).toThrow('DynamicRedirect requires either name or path');

    consoleSpy.mockRestore();
  });

  it('renders without error with path', () => {
    // This test just ensures the component doesn't crash
    expect(() => {
      renderWithRouter(
        <Routes>
          <Route path='/dashboard' element={<div>Dashboard</div>} />
          <Route path='*' element={<RNavigate path='/dashboard' />} />
        </Routes>,
      );
    }).not.toThrow();
  });

  it('renders without error with name', () => {
    expect(() => {
      renderWithRouter(
        <Routes>
          <Route path='/home' element={<div>Home</div>} />
          <Route path='*' element={<RNavigate name='home' />} />
        </Routes>,
      );
    }).not.toThrow();
  });
});
