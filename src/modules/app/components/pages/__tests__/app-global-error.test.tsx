import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppGlobalError from '@/modules/app/components/pages/app-global-error';

// Mock useTheme hook
vi.mock('@/modules/app/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

// Mock react-router-dom
const mockUseRouteError = vi.fn();
vi.mock('react-router-dom', () => ({
  isRouteErrorResponse: (error: unknown) => {
    return (
      error !== null &&
      typeof error === 'object' &&
      'status' in error &&
      'statusText' in error &&
      'data' in error
    );
  },
  useRouteError: () => mockUseRouteError(),
}));

describe('AppGlobalError', () => {
  it('renders with route error response (string data)', () => {
    mockUseRouteError.mockReturnValue({
      status: 404,
      statusText: 'Not Found',
      data: 'Page not found',
    });

    render(<AppGlobalError />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders with route error response (object data with message)', () => {
    mockUseRouteError.mockReturnValue({
      status: 500,
      statusText: 'Internal Server Error',
      data: { message: 'Server error occurred' },
    });

    render(<AppGlobalError />);
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Server error occurred')).toBeInTheDocument();
  });

  it('renders with route error response (empty data)', () => {
    mockUseRouteError.mockReturnValue({
      status: 503,
      statusText: 'Service Unavailable',
      data: '',
    });

    render(<AppGlobalError />);
    expect(screen.getByText('503')).toBeInTheDocument();
    expect(
      screen.getByText(/an unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  it('renders with Error instance', () => {
    mockUseRouteError.mockReturnValue(new Error('Something went wrong'));

    render(<AppGlobalError />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders with string error', () => {
    mockUseRouteError.mockReturnValue('String error message');

    render(<AppGlobalError />);
    expect(screen.getByText('String error message')).toBeInTheDocument();
  });

  it('renders with object error (JSON stringifiable)', () => {
    mockUseRouteError.mockReturnValue({ custom: 'error' });

    render(<AppGlobalError />);
    expect(screen.getByText('{"custom":"error"}')).toBeInTheDocument();
  });

  it('renders with unknown error type', () => {
    mockUseRouteError.mockReturnValue(null);

    render(<AppGlobalError />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/an unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  it('renders try again button', () => {
    mockUseRouteError.mockReturnValue(new Error('Test'));
    render(<AppGlobalError />);
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it('reloads page when try again button is clicked', () => {
    mockUseRouteError.mockReturnValue(new Error('Test'));
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    render(<AppGlobalError />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(reloadSpy).toHaveBeenCalled();
  });

  it('handles route error with empty statusText', () => {
    mockUseRouteError.mockReturnValue({
      status: 400,
      statusText: '',
      data: 'Bad request',
    });

    render(<AppGlobalError />);
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles Error with empty message', () => {
    const error = new Error('');
    error.name = 'CustomError';
    mockUseRouteError.mockReturnValue(error);

    render(<AppGlobalError />);
    expect(screen.getByText('CustomError')).toBeInTheDocument();
  });
});
