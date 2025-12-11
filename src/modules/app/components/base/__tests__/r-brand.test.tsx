import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RBrand } from '@/modules/app/components/base/r-brand';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/plugins/i18n';

const renderWithI18n = (ui: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
};

describe('RBrand', () => {
  it('renders brand with title', () => {
    renderWithI18n(<RBrand title='My App' />);
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('renders with subtitle when showTagline is true', () => {
    renderWithI18n(<RBrand title='App' subtitle='Best App Ever' showTagline />);
    expect(screen.getByText('Best App Ever')).toBeInTheDocument();
  });

  it('hides subtitle when showTagline is false', () => {
    renderWithI18n(
      <RBrand title='App' subtitle='Tagline' showTagline={false} />,
    );
    expect(screen.queryByText('Tagline')).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    renderWithI18n(
      <RBrand title='App' icon={<span data-testid='custom-icon'>🚀</span>} />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies horizontal direction by default', () => {
    const { container } = renderWithI18n(<RBrand title='App' />);
    expect(container.firstChild).toHaveClass('items-center');
  });

  it('applies vertical direction', () => {
    const { container } = renderWithI18n(
      <RBrand title='App' direction='vertical' />,
    );
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('aligns to center when vertical', () => {
    const { container } = renderWithI18n(
      <RBrand title='App' direction='vertical' align='center' />,
    );
    expect(container.firstChild).toHaveClass('items-center');
  });

  it('aligns to end when vertical', () => {
    const { container } = renderWithI18n(
      <RBrand title='App' direction='vertical' align='end' />,
    );
    expect(container.firstChild).toHaveClass('items-end');
  });

  it('applies custom className', () => {
    const { container } = renderWithI18n(
      <RBrand title='App' className='custom-brand' />,
    );
    expect(container.firstChild).toHaveClass('custom-brand');
  });

  it('applies custom iconClassName', () => {
    const { container } = renderWithI18n(
      <RBrand title='App' iconClassName='custom-icon' />,
    );
    expect(container.querySelector('.custom-icon')).toBeInTheDocument();
  });

  it('applies custom titleClassName', () => {
    const { container } = renderWithI18n(
      <RBrand title='App' titleClassName='custom-title' />,
    );
    expect(container.querySelector('.custom-title')).toBeInTheDocument();
  });
});
