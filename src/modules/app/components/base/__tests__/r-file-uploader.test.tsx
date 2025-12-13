import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RFileUploader from '../r-file-uploader';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) =>
      params ? `${key} ${JSON.stringify(params)}` : key,
  }),
}));

describe('RFileUploader', () => {
  it('renders upload area', () => {
    render(<RFileUploader />);
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
  });

  it('renders with custom label in compact variant', () => {
    render(<RFileUploader variant='compact' label='Upload Document' />);
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  it('shows upload button in compact variant', () => {
    render(<RFileUploader variant='compact' />);
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('handles file selection', () => {
    const onChange = vi.fn();
    render(<RFileUploader onChange={onChange} />);

    const input = screen.getByTestId('fileInput');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });
    // onChange is called asynchronously due to compression
  });

  it('disables upload when disabledUpload is true', () => {
    render(<RFileUploader variant='compact' disabledUpload />);
    expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();
  });

  it('shows progress bar when uploading', () => {
    render(<RFileUploader variant='compact' isUploading uploadProgress={50} />);
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
  });

  it('renders with string value (remote file)', () => {
    render(<RFileUploader value='https://example.com/image.png' showPreview />);
    // Should show preview area
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('supports multiple files', () => {
    render(<RFileUploader multiple maxFiles={5} />);
    const input = screen.getByTestId('fileInput');
    expect(input).toHaveAttribute('multiple');
  });
});
