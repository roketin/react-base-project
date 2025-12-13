import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/modules/app/components/base/r-form-primitives';

// Helper component to test form primitives
function TestForm({
  defaultValues = { name: '' },
  error,
}: {
  defaultValues?: { name: string };
  error?: string;
}) {
  const form = useForm({
    defaultValues,
  });

  // Manually set error if provided
  if (error) {
    form.setError('name', { message: error });
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} data-testid='input' />
              </FormControl>
              <FormDescription>Enter your name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('FormField', () => {
  it('renders form field with control', () => {
    render(<TestForm />);
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<TestForm defaultValues={{ name: 'John' }} />);
    expect(screen.getByTestId('input')).toHaveValue('John');
  });
});

describe('FormItem', () => {
  it('renders form item container', () => {
    render(<TestForm />);
    expect(
      screen.getByTestId('input').closest('[data-slot="form-item"]'),
    ).toBeInTheDocument();
  });
});

describe('FormControl', () => {
  it('renders form control with aria attributes', () => {
    render(<TestForm />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('sets aria-invalid to true when there is an error', () => {
    render(<TestForm error='Name is required' />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('FormDescription', () => {
  it('renders form description', () => {
    render(<TestForm />);
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<TestForm />);
    expect(screen.getByText('Enter your name').getAttribute('data-slot')).toBe(
      'form-description',
    );
  });
});

describe('FormMessage', () => {
  it('does not render when there is no error', () => {
    render(<TestForm />);
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    render(<TestForm error='Name is required' />);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<TestForm error='Name is required' />);
    expect(screen.getByText('Name is required').getAttribute('data-slot')).toBe(
      'form-message',
    );
  });
});
