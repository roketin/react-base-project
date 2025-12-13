import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RFormField } from '../r-form-field';
import { useForm, FormProvider } from 'react-hook-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/modules/app/contexts/form-config-context', () => ({
  useFormConfig: () => null,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: { name: '' },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('RFormField', () => {
  it('renders label', () => {
    render(
      <TestWrapper>
        <RFormField label='Name'>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders required indicator when not notRequired', () => {
    render(
      <TestWrapper>
        <RFormField label='Name'>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not render required indicator when notRequired', () => {
    render(
      <TestWrapper>
        <RFormField label='Name' notRequired>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <TestWrapper>
        <RFormField label='Name' description='Enter your full name'>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('renders label description', () => {
    render(
      <TestWrapper>
        <RFormField label='Name' labelDescription='Required field'>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <TestWrapper>
        <RFormField label='Name'>
          <input data-testid='input' />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('renders preview content when isPreview', () => {
    render(
      <TestWrapper>
        <RFormField label='Name' isPreview previewContent='John Doe'>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders skeleton when isLoading', () => {
    render(
      <TestWrapper>
        <RFormField label='Name' isLoading>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    // Skeleton elements should be present
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <RFormField label='Name' className='custom-class'>
          <input />
        </RFormField>
      </TestWrapper>,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
