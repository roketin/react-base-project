import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RDialog } from '@/modules/app/components/base/r-dialog';

describe('RDialog', () => {
  it('renders when open is true', () => {
    render(
      <RDialog open={true} onOpenChange={() => {}} title='Test Dialog'>
        <p>Dialog content</p>
      </RDialog>,
    );
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('does not render content when open is false', () => {
    render(
      <RDialog open={false} onOpenChange={() => {}} title='Hidden Dialog'>
        <p>Hidden content</p>
      </RDialog>,
    );
    expect(screen.queryByText('Hidden Dialog')).not.toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <RDialog
        open={true}
        onOpenChange={() => {}}
        title='Title'
        description='This is a description'
      >
        Content
      </RDialog>,
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <RDialog
        open={true}
        onOpenChange={() => {}}
        title='Title'
        footer={<button>Save</button>}
      >
        Content
      </RDialog>,
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('hides header when hideHeader is true', () => {
    render(
      <RDialog
        open={true}
        onOpenChange={() => {}}
        title='Hidden Title'
        hideHeader
      >
        Content
      </RDialog>,
    );
    // Title should be in sr-only for accessibility
    const title = screen.getByText('Hidden Title');
    expect(title).toHaveClass('sr-only');
  });

  it('hides footer when hideFooter is true', () => {
    render(
      <RDialog
        open={true}
        onOpenChange={() => {}}
        title='Title'
        footer={<button>Hidden Button</button>}
        hideFooter
      >
        Content
      </RDialog>,
    );
    expect(
      screen.queryByRole('button', { name: /hidden button/i }),
    ).not.toBeInTheDocument();
  });

  it('renders with trigger', () => {
    render(
      <RDialog title='Title' trigger={<button>Open Dialog</button>}>
        Content
      </RDialog>,
    );
    expect(
      screen.getByRole('button', { name: /open dialog/i }),
    ).toBeInTheDocument();
  });
});
