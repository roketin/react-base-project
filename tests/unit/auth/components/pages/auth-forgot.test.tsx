import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AuthForgot from '@/modules/auth/components/pages/auth-forgot';
import { renderWithConfig } from '@tests/test-utils';

describe('AuthForgot', () => {
  it('submits form and shows success toast', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthForgot />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');

    // submit
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(
      screen.getByText('Are you sure you want to reset password?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /yes/i }));

    await waitFor(() => {
      expect(
        screen.getByText('The reset link has been sent to your email'),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
  });

  it('submits form but user cancels confirmation', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthForgot />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');

    // submit
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(
      screen.getByText('Are you sure you want to reset password?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /no/i }));
  });

  it('submits form and shows error toast', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthForgot />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(screen.getByLabelText(/email/i), 'error@example.com');

    // submit
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(
      screen.getByText('Are you sure you want to reset password?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /yes/i }));

    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
