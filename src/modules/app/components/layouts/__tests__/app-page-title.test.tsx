import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppPageTitle } from '@/modules/app/components/layouts/app-page-title';

// Mock react-router-dom
const mockMatches = vi.fn();
vi.mock('react-router-dom', () => ({
  useMatches: () => mockMatches(),
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue || key,
  }),
}));

// Mock store
const mockOverrideTitle = vi.fn();
vi.mock('@/modules/app/stores/page-config.store', () => ({
  useOverridePageConfigStore: (
    selector: (state: { current?: { title?: string } }) => unknown,
  ) => selector({ current: { title: mockOverrideTitle() } }),
}));

// Mock config
vi.mock('@config', () => ({
  default: { app: { name: 'Test App' } },
}));

describe('AppPageTitle', () => {
  const originalTitle = document.title;

  beforeEach(() => {
    mockMatches.mockReturnValue([{ handle: { title: 'Dashboard' } }]);
    mockOverrideTitle.mockReturnValue(undefined);
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it('renders page title from route', () => {
    render(<AppPageTitle />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('sets document title', () => {
    render(<AppPageTitle />);
    expect(document.title).toBe('Dashboard | Test App');
  });

  it('uses override title when provided', () => {
    mockOverrideTitle.mockReturnValue('Custom Title');
    render(<AppPageTitle />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(document.title).toBe('Custom Title | Test App');
  });

  it('returns null when no title', () => {
    mockMatches.mockReturnValue([{ handle: {} }]);
    const { container } = render(<AppPageTitle />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<AppPageTitle className='custom-title' />);
    expect(container.querySelector('.custom-title')).toBeInTheDocument();
  });

  it('sets app name only when no title', () => {
    mockMatches.mockReturnValue([{ handle: { title: '' } }]);
    render(<AppPageTitle />);
    expect(document.title).toBe('Test App');
  });
});
