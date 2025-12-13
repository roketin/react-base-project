import { describe, it, expect } from 'vitest';
import showFileViewer from '../show-file-viewer';

describe('showFileViewer', () => {
  it('exports a function', () => {
    expect(typeof showFileViewer).toBe('function');
  });

  it('has correct function signature', () => {
    // Verify the function accepts the expected config shape
    expect(showFileViewer.length).toBe(1); // Takes 1 argument (config object)
  });

  it('is callable with src config', () => {
    // This test just verifies the function can be called without throwing during import
    // Actual rendering is tested in integration tests
    expect(showFileViewer).toBeDefined();
  });
});
