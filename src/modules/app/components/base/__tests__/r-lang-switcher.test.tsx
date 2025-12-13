import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RLangSwitcher from '../r-lang-switcher';

const mockChangeLanguage = vi.fn(() => Promise.resolve());

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

vi.mock('@config', () => ({
  default: {
    languages: {
      enabled: true,
      supported: [
        { code: 'en', label: 'English', isDefault: true },
        { code: 'id', label: 'Indonesian' },
      ],
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('RLangSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language switcher button', () => {
    render(<RLangSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows current language code', () => {
    render(<RLangSwitcher />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('shows current language label when showCode is false', () => {
    render(<RLangSwitcher showCode={false} />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('opens popover on click', async () => {
    render(<RLangSwitcher />);

    fireEvent.click(screen.getByRole('button'));

    // Wait for popover to open
    expect(await screen.findByText('Indonesian')).toBeInTheDocument();
  });

  it('changes language on selection', async () => {
    render(<RLangSwitcher />);

    fireEvent.click(screen.getByRole('button'));

    const indonesianOption = await screen.findByText('Indonesian');
    fireEvent.click(indonesianOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('id');
  });

  it('does not change language when selecting current language', async () => {
    render(<RLangSwitcher />);

    fireEvent.click(screen.getByRole('button'));

    // Find and click English (current language)
    const buttons = await screen.findAllByRole('button');
    const englishButton = buttons.find((btn) =>
      btn.textContent?.includes('English'),
    );
    if (englishButton) {
      fireEvent.click(englishButton);
    }

    expect(mockChangeLanguage).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<RLangSwitcher className='custom-class' />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
