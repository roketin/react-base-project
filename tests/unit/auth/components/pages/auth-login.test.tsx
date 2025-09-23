import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AuthLogin from '@/modules/auth/components/pages/auth-login';
import useAuthStore from '@/modules/auth/stores/auth.store';
import { renderWithConfig } from '@tests/test-utils';

describe('AuthLogin', () => {
  it('submits form and saves token to store', async () => {
    renderWithConfig(
      <MemoryRouter>
        <AuthLogin />
      </MemoryRouter>,
    );

    // fill form
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), '12345');

    // submit
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await act(async () => {
      const token = await useAuthStore.getState().token;
      expect(token).toBe('dummy-token');
    });
  });
});
