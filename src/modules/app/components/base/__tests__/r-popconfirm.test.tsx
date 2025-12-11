import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RPopconfirm } from '@/modules/app/components/base/r-popconfirm';

describe('RPopconfirm', () => {
  it('renders trigger element', () => {
    render(
      <RPopconfirm title='Confirm?'>
        <button>Delete</button>
      </RPopconfirm>,
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders with title prop', () => {
    render(
      <RPopconfirm title='Are you sure?'>
        <button>Delete</button>
      </RPopconfirm>,
    );
    // Trigger renders correctly
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders with description prop', () => {
    render(
      <RPopconfirm title='Confirm' description='This action cannot be undone'>
        <button>Delete</button>
      </RPopconfirm>,
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('accepts onConfirm callback', () => {
    const handleConfirm = vi.fn();
    render(
      <RPopconfirm title='Confirm?' onConfirm={handleConfirm}>
        <button>Delete</button>
      </RPopconfirm>,
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('accepts onCancel callback', () => {
    const handleCancel = vi.fn();
    render(
      <RPopconfirm title='Confirm?' onCancel={handleCancel}>
        <button>Delete</button>
      </RPopconfirm>,
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const handleConfirm = vi.fn();
    render(
      <RPopconfirm title='Confirm?' disabled onConfirm={handleConfirm}>
        <button>Delete</button>
      </RPopconfirm>,
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.queryByText('Confirm?')).not.toBeInTheDocument();
  });

  it('accepts custom button text props', () => {
    render(
      <RPopconfirm title='Confirm?' okText='Confirm' cancelText='Cancel'>
        <button>Delete</button>
      </RPopconfirm>,
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
