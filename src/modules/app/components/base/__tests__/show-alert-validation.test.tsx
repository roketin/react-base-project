import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as errorUtils from '@/modules/app/libs/error-utils';
import { showAlertValidation } from '@/modules/app/components/base/show-alert-validation';
import showAlert from '@/modules/app/components/base/show-alert';

vi.mock('@/modules/app/components/base/show-alert', () => ({
  default: vi.fn(),
}));

describe('showAlertValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing when no messages', () => {
    vi.spyOn(errorUtils, 'collectErrorMessages').mockReturnValue([]);

    showAlertValidation({});
    expect(showAlert).not.toHaveBeenCalled();
  });

  it('calls showAlert with error messages when there are errors', () => {
    vi.spyOn(errorUtils, 'collectErrorMessages').mockReturnValue([
      'Error 1',
      'Error 2',
    ]);

    showAlertValidation({});

    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'alert',
        title: 'Sorry, there are some errors',
        description: expect.anything(), // Description is a complex React element
      }),
    );
  });
});
