import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import showAlert from '@/modules/app/components/base/show-alert';

describe('showAlert', () => {
  it('renders confirm dialog and calls callback with ok=true when confirmed', async () => {
    const callback = vi.fn();
    showAlert(
      { type: 'confirm', title: 'Confirm?', description: 'Are you sure?' },
      callback,
    );

    expect(await screen.findByText('Confirm?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /yes/i }));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          setLoading: expect.any(Function),
          close: expect.any(Function),
        }),
      );
    });
  });

  it('renders confirm dialog and calls callback with ok=false when cancelled', async () => {
    const callback = vi.fn();
    showAlert(
      { type: 'confirm', title: 'Confirm?', description: 'Are you sure?' },
      callback,
    );

    expect(await screen.findByText('Confirm?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /no/i }));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ ok: false }),
      );
    });
  });

  it('renders alert dialog with only ok button', async () => {
    const callback = vi.fn();
    showAlert(
      { type: 'alert', title: 'Notice', description: 'Something happened' },
      callback,
    );

    expect(await screen.findByText('Notice')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /no/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });
});
