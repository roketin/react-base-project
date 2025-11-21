import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AuthReset from '@/modules/auth/components/pages/auth-reset';
import { renderWithConfig, screenDebugFull } from '@tests/test-utils';

describe('AuthReset', () => {
  it('shows validation error if password too short', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthReset />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(screen.getByLabelText(/new password/i), '12345');
    await userEvent.type(
      screen.getByLabelText(/new confirm password/i),
      '12345',
    );

    // submit
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // checks

    await waitFor(() => {
      expect(
        screen.getAllByText(/must be at least 8 characters/i),
      ).toHaveLength(2);
    });
  });

  it('submits form and shows success alert', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthReset />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(
      screen.getByLabelText(/new password/i),
      'R4ndomP4$word',
    );
    await userEvent.type(
      screen.getByLabelText(/new confirm password/i),
      'R4ndomP4$word',
    );

    // submit
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      screen.getByText('Are you sure you want to change your password?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /yes/i }));

    expect(
      screen.getByText('Reset password successfully.'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ok/i }));

    screenDebugFull();

    await waitFor(() => {
      expect(
        screen.queryByText('Reset password successfully.'),
      ).not.toBeInTheDocument();
    });
  });

  it('submits form but user cancels confirmation', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthReset />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(
      screen.getByLabelText(/new password/i),
      'R4ndomP4$word',
    );
    await userEvent.type(
      screen.getByLabelText(/new confirm password/i),
      'R4ndomP4$word',
    );

    // submit
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      screen.getByText('Are you sure you want to change your password?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /no/i }));
  });
});
