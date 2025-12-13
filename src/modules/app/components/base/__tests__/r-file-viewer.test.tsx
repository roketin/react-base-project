import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import RFileViewer from '../r-file-viewer';

// Mock URL.createObjectURL
beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => 'blob:test');
  global.URL.revokeObjectURL = vi.fn();
});

describe('RFileViewer', () => {
  it('does not render when show is false', () => {
    render(<RFileViewer show={false} src='test.png' onClose={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders when show is true', () => {
    render(<RFileViewer show src='test.png' onClose={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<RFileViewer show src='test.png' onClose={onClose} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <RFileViewer show src='test.png' onClose={onClose} />,
    );

    const backdrop = container.querySelector('.fixed');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('calls onClose on escape key', () => {
    const onClose = vi.fn();
    render(<RFileViewer show src='test.png' onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders image preview for image files', () => {
    render(<RFileViewer show src='test.png' onClose={vi.fn()} />);
    expect(screen.getByAltText('File preview')).toBeInTheDocument();
  });

  it('renders PDF viewer for PDF files', () => {
    render(<RFileViewer show src='document.pdf' onClose={vi.fn()} />);
    expect(screen.getByTitle('PDF viewer')).toBeInTheDocument();
  });

  it('shows unsupported message for unknown file types', () => {
    render(<RFileViewer show src='file.xyz' onClose={vi.fn()} />);
    expect(screen.getByText(/not supported/i)).toBeInTheDocument();
  });

  it('handles File object as src', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    render(<RFileViewer show src={file} onClose={vi.fn()} />);
    expect(screen.getByAltText('File preview')).toBeInTheDocument();
  });
});
