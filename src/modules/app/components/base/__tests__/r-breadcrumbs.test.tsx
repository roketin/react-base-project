import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RBreadcrumbs } from '../r-breadcrumbs';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useMatches: vi.fn(() => []),
  };
});

vi.mock('@/modules/app/stores/breadcrumbs.store', () => ({
  useBreadcrumbStore: () => ({ resolvers: {} }),
}));

vi.mock('@/modules/app/stores/page-config.store', () => ({
  useOverridePageConfigStore: () => undefined,
}));

vi.mock('@/modules/app/hooks/use-named-route', () => ({
  linkTo: () => '/dashboard',
}));

describe('RBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home link', () => {
    render(
      <MemoryRouter>
        <RBreadcrumbs />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link');
    expect(homeLink).toBeInTheDocument();
  });

  it('renders with aria-label for accessibility', () => {
    render(
      <MemoryRouter>
        <RBreadcrumbs />
      </MemoryRouter>,
    );

    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav).toBeInTheDocument();
  });

  it('renders breadcrumb list', () => {
    render(
      <MemoryRouter>
        <RBreadcrumbs />
      </MemoryRouter>,
    );

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });
});
