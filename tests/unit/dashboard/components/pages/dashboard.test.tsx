import Dashboard from '@/modules/dashboard/components/pages/dashboard';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

describe('Dashboard', () => {
  it('renders initial count', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Count is 0/)).toBeInTheDocument();
  });

  it('increments count when button is clicked', async () => {
    render(<Dashboard />);
    const button = screen.getByRole('button', { name: /increment/i });

    await act(async () => {
      await userEvent.click(button);
      expect(screen.getByText(/Count is 1/)).toBeInTheDocument();

      await userEvent.click(button);
      expect(screen.getByText(/Count is 2/)).toBeInTheDocument();
    });
  });
});
