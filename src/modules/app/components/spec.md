# Component Development Specification

This document serves as a guideline when creating components in the `app/components` folder.

## Folder Structure

```
components/
├── base/           # Base UI components (reusable)
│   ├── __tests__/  # Unit tests
│   ├── stories/    # Storybook stories
│   └── r-*.tsx     # Components with "r-" prefix
├── layouts/        # Application layout components
└── pages/          # Page components
```

## Naming Convention

### File Naming

- Base components: `r-{component-name}.tsx` (e.g., `r-btn.tsx`, `r-input.tsx`)
- Layout components: `app-{name}.tsx` (e.g., `app-layout.tsx`)
- Page components: `app-{name}.tsx` (e.g., `app-not-found.tsx`)
- Test files: `{component-name}.test.tsx`
- Story files: `{component-name}.stories.tsx`

### Component Naming

- Use PascalCase for component names
- Prefix `R` for base components (e.g., `RBtn`, `RInput`, `RCard`)
- Prefix `App` for layout/page components

### Type Naming

- Props type: `T{ComponentName}Props` (e.g., `TRBtnProps`, `TRInputProps`)
- Variant type: `T{ComponentName}VariantProps`

## Component Structure

### Base Component Template

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { type VariantProps } from 'class-variance-authority';
import { componentVariants } from '@/modules/app/libs/ui-variants';

export type TRComponentProps = ComponentPropsWithoutRef<'element'> &
  VariantProps<typeof componentVariants> & {
    // custom props
  };

export const RComponent = forwardRef<HTMLElement, TRComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

RComponent.displayName = 'RComponent';
```

## Styling Guidelines

### Tailwind CSS

- Use Tailwind CSS utility classes
- Use `cn()` helper from `@/modules/app/libs/utils` to merge classes
- Use CSS variables for theming (e.g., `bg-card`, `text-foreground`)

### Variants with CVA

- Define variants in `@/modules/app/libs/ui-variants`
- Use `class-variance-authority` for variant management
- Support `size` and `variant` props consistently

### Responsive Design

- Mobile-first approach
- Use breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`

## Props Guidelines

### Required Props

- Always export props type
- Use `forwardRef` for components that need ref forwarding
- Extend native HTML attributes when relevant

### Common Props Pattern

```tsx
{
  className?: string;        // Custom styling
  disabled?: boolean;        // Disabled state
  loading?: boolean;         // Loading state
  size?: 'xs' | 'sm' | 'default' | 'lg';
  variant?: string;          // Visual variant
}
```

### Accessibility Props

- Use appropriate `aria-*` attributes
- Support `aria-label`, `aria-describedby`
- Use `aria-busy` for loading state
- Use `aria-invalid` for error state

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Provide proper ARIA labels
- Support screen readers
- Maintain focus management
- Color contrast must meet WCAG 2.1 AA standards

## Testing Requirements

### Unit Test (`__tests__/`)

- File: `{component-name}.test.tsx`
- Framework: Vitest + React Testing Library
- Minimum coverage:
  - Render default state
  - Props handling
  - User interactions
  - Accessibility attributes
  - Edge cases

### Test Template

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RComponent } from '@/modules/app/components/base/r-component';

describe('RComponent', () => {
  it('renders correctly', () => {
    render(<RComponent>Content</RComponent>);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const handler = vi.fn();
    render(<RComponent onClick={handler}>Click</RComponent>);
    fireEvent.click(screen.getByRole('...'));
    expect(handler).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<RComponent className='custom'>Content</RComponent>);
    expect(screen.getByRole('...')).toHaveClass('custom');
  });
});
```

## Storybook Requirements

### Story File (`stories/`)

- File: `{component-name}.stories.tsx`
- Use CSF3 format (Component Story Format 3)
- Include `autodocs` tag

### Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RComponent } from '../r-component';

const meta = {
  title: 'Components/{Category}/RComponent',
  component: RComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Content',
  },
};

export const Variants: Story = {
  render: () => (
    <div className='flex gap-3'>
      <RComponent variant='default'>Default</RComponent>
      <RComponent variant='secondary'>Secondary</RComponent>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <RComponent size='sm'>Small</RComponent>
      <RComponent size='default'>Default</RComponent>
      <RComponent size='lg'>Large</RComponent>
    </div>
  ),
};
```

## Import Conventions

```tsx
// Internal utilities
import { cn } from '@/modules/app/libs/utils';
import { variants } from '@/modules/app/libs/ui-variants';

// React
import { forwardRef, useState, type ReactNode } from 'react';

// External libraries
import { type VariantProps } from 'class-variance-authority';

// Icons (use lucide-react)
import { IconName } from 'lucide-react';
```

## Pre-Commit Checklist

- [ ] Component follows naming convention
- [ ] Props type is exported
- [ ] `displayName` is set for forwardRef components
- [ ] Accessibility attributes are added
- [ ] Unit test created in `__tests__/`
- [ ] Storybook story created in `stories/`
- [ ] No TypeScript errors
- [ ] Styling uses Tailwind + cn() helper
