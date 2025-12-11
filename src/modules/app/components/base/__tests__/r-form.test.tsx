/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RForm from '@/modules/app/components/base/r-form';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      on: vi.fn(),
      off: vi.fn(),
    },
  }),
}));

// Mock react-hook-form's Form component
vi.mock('@/modules/app/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RForm', () => {
  const createMockForm = () => ({
    handleSubmit: vi.fn((cb) => (e: React.FormEvent) => {
      e?.preventDefault();
      cb({});
    }),
    trigger: vi.fn(),
    formState: { touchedFields: {}, errors: {} },
    register: vi.fn(),
    watch: vi.fn(),
    setValue: vi.fn(),
    reset: vi.fn(),
    getValues: vi.fn(),
    control: {},
  });

  it('renders form element', () => {
    const form = createMockForm();
    render(
      <RForm form={form as any} onSubmit={() => {}}>
        <div>Content</div>
      </RForm>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with custom id', () => {
    const form = createMockForm();
    const { container } = render(
      <RForm form={form as any} onSubmit={() => {}} id='custom-form'>
        <div>Content</div>
      </RForm>,
    );
    expect(container.querySelector('#custom-form')).toBeInTheDocument();
  });

  it('renders children content', () => {
    const form = createMockForm();
    render(
      <RForm form={form as any} onSubmit={() => {}}>
        <input type='text' placeholder='Name' />
        <button type='submit'>Submit</button>
      </RForm>,
    );
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const form = createMockForm();
    const { container } = render(
      <RForm form={form as any} onSubmit={() => {}} className='custom-form'>
        <div>Content</div>
      </RForm>,
    );
    expect(container.querySelector('.custom-form')).toBeInTheDocument();
  });

  it('renders form with data-testid', () => {
    const form = createMockForm();
    render(
      <RForm form={form as any} onSubmit={() => {}} id='test-form'>
        <div>Content</div>
      </RForm>,
    );
    expect(screen.getByTestId('test-form')).toBeInTheDocument();
  });
});
