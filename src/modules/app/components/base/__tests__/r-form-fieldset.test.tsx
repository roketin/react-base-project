import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RFormFieldSet } from '../r-form-fieldset';

vi.mock('@/modules/app/contexts/form-config-context', () => ({
  useFormConfig: () => ({
    fieldsetConfig: null,
  }),
}));

describe('RFormFieldSet', () => {
  it('renders title', () => {
    render(
      <RFormFieldSet title='Personal Information'>
        <div>Content</div>
      </RFormFieldSet>,
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <RFormFieldSet title='Personal Info' subtitle='Enter your details'>
        <div>Content</div>
      </RFormFieldSet>,
    );

    expect(screen.getByText('Enter your details')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <RFormFieldSet title='Test'>
        <div data-testid='child'>Child Content</div>
      </RFormFieldSet>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders with horizontal layout by default', () => {
    const { container } = render(
      <RFormFieldSet title='Test'>
        <div>Content</div>
      </RFormFieldSet>,
    );

    expect(container.querySelector('.lg\\:flex')).toBeInTheDocument();
  });

  it('renders with vertical layout', () => {
    const { container } = render(
      <RFormFieldSet title='Test' layout='vertical'>
        <div>Content</div>
      </RFormFieldSet>,
    );

    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('renders divider when divider prop is true', () => {
    render(
      <RFormFieldSet title='Test' divider>
        <div>Content</div>
      </RFormFieldSet>,
    );

    // Separator component should be rendered
    expect(document.querySelector('[role="none"]')).toBeInTheDocument();
  });

  it('applies custom id', () => {
    const { container } = render(
      <RFormFieldSet title='Test' id='custom-section'>
        <div>Content</div>
      </RFormFieldSet>,
    );

    expect(container.querySelector('#custom-section')).toBeInTheDocument();
  });

  it('applies sticky styles when isSticky is true', () => {
    const { container } = render(
      <RFormFieldSet title='Test' isSticky stickyOffset={100}>
        <div>Content</div>
      </RFormFieldSet>,
    );

    const stickyElement = container.querySelector('.lg\\:sticky');
    expect(stickyElement).toBeInTheDocument();
  });
});
