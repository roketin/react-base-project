import {
  DEFAULT_EXT,
  DEFAULT_FILE_SIZE,
} from '@/modules/app/constants/app.constant';
import {
  byteToMb,
  formatBytes,
  getFileExtensionFromFile,
  getFileExtensionFromString,
} from '@/modules/app/libs/file-utils';
import Yup from '@/plugins/yup';
import type { TestConfig, TestContext } from 'yup';

/**
 * This module provides custom Yup validation rules for file inputs in forms.
 * It includes validation for file extensions and file size constraints, as well as
 * a composite validator that can handle either a File object or a string.
 * These validators are intended to be used within Yup schemas to enforce file-related
 * constraints such as allowed file types and size limits, improving form data integrity.
 */

/**
 * Validates that a file's extension matches one of the allowed extensions.
 *
 * @param exts - An array of allowed file extensions (e.g., ['jpg', 'png']).
 * @returns A Yup TestConfig object that can be used in a Yup schema's test method.
 *
 * This function creates a custom validation rule that checks whether the file's extension
 * is included in the provided list of allowed extensions. It extracts the extension from
 * the File object using a utility function and compares it against the allowed list.
 * If the file extension is not allowed, the validation fails with a message indicating
 * the permitted extensions.
 */
export const fileExtRule = (exts: string[]): TestConfig<unknown> => {
  return {
    name: 'check-file-exts',
    message: ({ path }) => {
      return `${path} that are allowed are only ${exts.join(', ')} extension`;
    },
    test: (value) => {
      if (!value) return true;

      if (value instanceof File) {
        return exts.includes(getFileExtensionFromFile(value) ?? '');
      }

      if (typeof value === 'string') {
        return exts.includes(getFileExtensionFromString(value) ?? '');
      }

      return false;
    },
  };
};

/**
 * Validates that a file's size falls within specified minimum and/or maximum bounds.
 *
 * @param param0 - An object containing:
 *   - min: minimum file size in bytes (number).
 *   - max: maximum file size in bytes (number).
 * @returns A Yup TestConfig object that can be used in a Yup schema's test method.
 *
 * This function creates a custom validation rule that checks whether the file size is
 * within the allowed range. It converts byte values to megabytes for comparison using
 * utility functions. The validation logic handles three scenarios:
 * - Both min and max specified: file size must be between min and max.
 * - Only min specified: file size must be at least min.
 * - Only max specified: file size must not exceed max.
 *
 * If the file size is outside the allowed range, the validation fails with a descriptive
 * error message indicating the allowed size limits.
 */
export const fileSizeRule = ({
  min,
  max,
}: {
  min: number;
  max: number;
}): TestConfig<unknown> => {
  return {
    name: 'check-file-size',
    test: (value, ctx: TestContext) => {
      const fileSize = (value as File).size;

      if (min && max) {
        if (fileSize < byteToMb(min) || fileSize > byteToMb(max)) {
          return ctx.createError({
            message: ({ path }) =>
              `${path} only allow file size min ${formatBytes(min)} and max ${formatBytes(byteToMb(max))}'`,
          });
        }
      } else if (min && !max) {
        if (fileSize < byteToMb(min)) {
          return ctx.createError({
            message: ({ path }) =>
              `${path} only allow file size min ${formatBytes(byteToMb(min))}`,
          });
        }
      } else if (max && !min) {
        if (fileSize > byteToMb(max)) {
          return ctx.createError({
            message: ({ path }) =>
              `${path} only allow file size max ${formatBytes(byteToMb(max))}`,
          });
        }
      }

      return true;
    },
  };
};

/**
 * Creates a Yup validation schema that validates a value as either a File or a string,
 * with optional checks for allowed file extensions, file size limits, and whether the
 * field is required.
 *
 * @param label - A string label for the schema, used in validation error messages (default: 'File').
 * @param options - An optional object containing:
 *   - allowedExts: an array of allowed file extensions (default: DEFAULT_EXT.IMAGES).
 *   - size: an object with min and max properties defining file size limits in bytes (default: DEFAULT_FILE_SIZE).
 *   - required: a boolean indicating if the field is required.
 * @returns A Yup schema configured with the specified validation rules.
 *
 * This function builds a Yup.mixed() schema that can accept either a File object or a string.
 * It conditionally adds custom tests for file extension and file size based on the provided options.
 * If the 'required' flag is true, it marks the schema as required.
 * This composite validator is useful for form fields that accept file uploads or string inputs
 * and need to enforce file-related constraints in a flexible manner.
 */
export const fileOrStringRule = (
  label = 'File',
  options?: {
    allowedExts?: string[];
    size?: { min: number; max: number };
    required?: boolean;
  },
) => {
  const {
    allowedExts = DEFAULT_EXT.IMAGES,
    size = DEFAULT_FILE_SIZE,
    required,
  } = options || {};

  let schema = Yup.mixed<File | string>().label(label);

  if (allowedExts) {
    schema = schema.test(fileExtRule(allowedExts));
  }

  if (size) {
    schema = schema.test(fileSizeRule(size));
  }

  if (required) {
    schema = schema.required();
  }

  return schema;
};
